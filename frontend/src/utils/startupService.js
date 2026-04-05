import {
    getSystem,
    normalizeInvitation,
    normalizeJoinRequest,
    normalizeStartup,
    saveSystem
} from './system';
import { calculateExecutionScore } from './executionScore';
import api from '../../services/api';
import { createApplication, fetchApplications } from './applicationsApi';
import { cancelSession, createSession, fetchSessions } from './sessionsApi';

const nowIso = () => new Date().toISOString();

const hydrateStartupMetrics = (startup) => {
    if (!startup) return null;

    const hydrated = { ...startup };
    hydrated.executionScore = calculateExecutionScore(hydrated);

    let completion = 0;
    if (hydrated.startupName) completion += 15;
    if (hydrated.problemStatement) completion += 15;
    if (hydrated.targetAudience?.length > 0) completion += 15;
    if (hydrated.sector) completion += 15;
    if (hydrated.milestones?.length > 0) completion += 20;
    if (hydrated.documents?.length > 0) completion += 20;
    hydrated.profileCompletion = Math.min(completion, 100);

    hydrated.teamSize = 1 + (Array.isArray(hydrated.coFounders) ? hydrated.coFounders.length : 0);
    return hydrated;
};

const resolveUserStartup = (system, user) => {
    if (!user) return null;
    return (system.startups || []).find((s) => {
        if (user.role === 'founder' && s.founderId === user.uid) return true;
        if (user.role === 'co-founder' && Array.isArray(s.coFounders) && s.coFounders.includes(user.uid)) return true;
        return false;
    }) || null;
};

export const loadStartupState = async (user) => {
    if (!user) {
        return {
            startup: null,
            joinRequests: [],
            allStartups: [],
            invitations: [],
            applications: [],
            mentorRequests: [],
            sessions: []
        };
    }

    const system = getSystem();
    const startup = hydrateStartupMetrics(resolveUserStartup(system, user));

    const joinRequests = (system.joinRequests || []).filter((r) =>
        (user.role === 'founder' && r.founderId === user.uid)
        || (user.role === 'co-founder' && r.requesterId === user.uid)
    );

    let mentorRequests = [];
    try {
        const response = await api.get('/v1/mentor-requests');
        const apiRequests = Array.isArray(response.data?.data) ? response.data.data : [];
        mentorRequests = apiRequests
            .map((r) => ({
                ...r,
                startupId: r.startupId ?? r.startup_id ?? null,
                founderId: r.founderId ?? r.founder_id ?? null,
                mentorId: r.mentorId ?? r.mentor_id ?? null,
                status: r.status === 'rejected' ? 'declined' : r.status,
                createdAt: r.createdAt ?? r.created_at ?? null,
                updatedAt: r.updatedAt ?? r.updated_at ?? null,
            }))
            .filter((r) => r.founderId === user?.uid);
    } catch {
        mentorRequests = [];
    }

    let applications = [];
    try {
        const allApplications = await fetchApplications();
        applications = allApplications.filter((a) => a.founderId === user?.uid);
    } catch {
        applications = [];
    }

    return {
        startup,
        joinRequests,
        allStartups: system.startups || [],
        invitations: (system.invitations || []).filter((i) => i.startupId === startup?.startupId),
        applications,
        mentorRequests,
        sessions: startup?.startupId
            ? (await fetchSessions()).filter((s) => s.startupId === startup.startupId)
            : []
    };
};

const persistStartup = (system, updatedStartup) => {
    system.startups = (system.startups || []).map((s) =>
        s.startupId === updatedStartup.startupId ? normalizeStartup(updatedStartup) : s
    );
    saveSystem(system);
};

export const updateStartupData = async (startup, updates) => {
    if (!startup) return null;
    const system = getSystem();
    const current = (system.startups || []).find((s) => s.startupId === startup.startupId) || startup;
    const updated = {
        ...current,
        ...updates,
        updatedAt: nowIso()
    };
    if (updates.activeUsers !== undefined && updates.activeUsers !== current.activeUsers) {
        updated.lastTractionUpdate = nowIso();
    }
    updated.executionScore = calculateExecutionScore(updated);
    persistStartup(system, updated);
    return updated;
};

export const addStartupActivity = async (startup, message, type = 'info') => {
    if (!startup) return null;
    const system = getSystem();
    const current = (system.startups || []).find((s) => s.startupId === startup.startupId) || startup;
    const newAct = { id: null, message, type, timestamp: nowIso() };
    return updateStartupData(current, {
        activity: [newAct, ...(current.activity || [])].slice(0, 50)
    });
};

export const addMilestoneToStartup = async (startup, title, description = '', stage = 'Idea', deadline = '') => {
    if (!startup) return;
    const system = getSystem();
    const current = (system.startups || []).find((s) => s.startupId === startup.startupId) || startup;
    const newMilestone = {
        id: null,
        title,
        description,
        stage,
        deadline,
        status: 'pending',
        createdAt: nowIso(),
        updatedAt: nowIso()
    };
    await updateStartupData(current, { milestones: [...(current.milestones || []), newMilestone] });
    await addStartupActivity(current, `Added milestone: ${title}`, 'milestone');
};

export const updateStartupMilestone = async (startup, id, updates) => {
    if (!startup) return;
    const system = getSystem();
    const current = (system.startups || []).find((s) => s.startupId === startup.startupId) || startup;
    const updatedMilestones = (current.milestones || []).map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: nowIso() } : m
    );
    await updateStartupData(current, { milestones: updatedMilestones });
    if (updates.status === 'completed') {
        const milestone = (current.milestones || []).find((m) => m.id === id);
        await addStartupActivity(current, `Milestone completed: ${milestone?.title || 'Task'}`, 'success');
    }
};

export const deleteStartupMilestone = async (startup, id) => {
    if (!startup) return;
    const system = getSystem();
    const current = (system.startups || []).find((s) => s.startupId === startup.startupId) || startup;
    await updateStartupData(current, { milestones: (current.milestones || []).filter((m) => m.id !== id) });
};

export const addStartupDocument = async (startup, name, size) => {
    if (!startup) return;
    await updateStartupData(startup, {
        documents: [...(startup.documents || []), { name, size, uploadedAt: nowIso() }]
    });
    await addStartupActivity(startup, `Uploaded document: ${name}`, 'document');
};

export const deleteStartupDocument = async (startup, index) => {
    if (!startup) return;
    const docs = [...(startup.documents || [])];
    docs.splice(index, 1);
    await updateStartupData(startup, { documents: docs });
};

export const renameStartupDocument = async (startup, index, newName) => {
    if (!startup) return;
    const docs = [...(startup.documents || [])];
    docs[index] = { ...docs[index], name: newName };
    await updateStartupData(startup, { documents: docs });
};

export const applyStartupToIncubator = async (startup, user, incubatorId, message) => {
    if (!startup || !user) return;
    await createApplication({
        founderId: user.uid,
        startupId: startup.startupId,
        incubatorId,
        startupName: startup.startupName,
        sector: startup.sector || 'General',
        teamSize: Number(startup.teamSize) || 1,
        status: 'pending',
        message: message || ''
    });
    await addStartupActivity(startup, 'Sent application to incubator', 'incubator');
};

export const requestStartupMentorship = async (startup, user, mentorId, message) => {
    if (!startup || !user) return { error: 'Invalid request' };
    if (startup.mentorAssigned) return { error: 'You already have an assigned mentor.' };

    try {
        await api.post('/v1/mentor-requests', {
            mentorId,
            startupId: startup.startupId,
            founderId: user.uid,
            message: message || '',
            status: 'pending'
        });
        await addStartupActivity(startup, 'Mentorship request sent', 'mentor');
        return { success: true };
    } catch (error) {
        return { error: error.response?.data?.error || 'Failed to send mentorship request' };
    }
};

export const requestStartupSession = async (startup, user, date, time, topic) => {
    if (!startup || !user || !startup.mentorAssigned) return;
    await createSession({
        startupId: startup.startupId,
        founderId: user.uid,
        mentorId: startup.mentorAssigned,
        date,
        time,
        topic,
        status: 'pending_confirmation',
    });
    await addStartupActivity(startup, `Requested session for ${date}`, 'info');
};

export const removeStartupMentor = async (startup) => {
    if (!startup || !startup.mentorAssigned) return;
    const system = getSystem();
    const mentor = system.users?.[startup.mentorAssigned];
    const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

    system.startups = (system.startups || []).map((s) => {
        if (s.startupId !== startup.startupId) return s;
        const updated = {
            ...s,
            mentorAssigned: null,
            mentorshipStartDate: null,
            updatedAt: nowIso(),
            activity: [{ id: null, message: `Mentor ${mentorName} was removed from the startup`, type: 'warning', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50)
        };
        updated.executionScore = calculateExecutionScore(updated);
        return updated;
    });
    saveSystem(system);
};

export const cancelStartupSession = async (startup, sessionId) => {
    if (!startup) return;
    const updated = await cancelSession(sessionId);
    await addStartupActivity(startup, `Session for ${updated.date || 'upcoming date'} was cancelled`, 'warning');
};

export const leaveStartupTeam = async (startup, user) => {
    if (!startup || !user) return;
    const system = getSystem();
    system.startups = (system.startups || []).map((s) =>
        s.startupId === startup.startupId
            ? { ...s, coFounders: (s.coFounders || []).filter((uid) => uid !== user.uid) }
            : s
    );
    saveSystem(system);
};

export const resignFromStartupTeam = async (startup, user) => {
    if (!startup || !user) return;
    const system = getSystem();
    system.startups = (system.startups || []).map((s) => {
        if (s.startupId !== startup.startupId) return s;
        const newCoFounders = (s.coFounders || []).filter((uid) => uid !== user.uid);
        const activityMsg = `Co-Founder ${user.name || user.email} resigned from the team`;
        return {
            ...s,
            coFounders: newCoFounders,
            activity: [{ id: null, message: activityMsg, type: 'info', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50)
        };
    });
    saveSystem(system);
};

export const sendStartupInvitation = async (startup, invitedEmail) => {
    if (!startup) return null;
    const system = getSystem();
    const invitation = {
        id: null,
        startupId: startup.startupId,
        invitedEmail: invitedEmail.toLowerCase(),
        invitedUserId: null,
        status: 'pending',
        createdAt: nowIso()
    };
    system.invitations = system.invitations || [];
    system.invitations.push(normalizeInvitation(invitation));

    const target = (system.startups || []).find((s) => s.startupId === startup.startupId);
    if (target) {
        target.activity = [{ id: null, message: `Invited ${invitedEmail}`, type: 'info', timestamp: nowIso() }, ...(target.activity || [])].slice(0, 50);
    }

    saveSystem(system);
    return invitation;
};

export const sendDirectStartupInvitation = async (startup, user, invitedUserId, invitedEmail, message = '') => {
    if (!startup || !user) return { error: 'Invalid request' };
    const system = getSystem();
    system.invitations = system.invitations || [];

    const exists = system.invitations.find((i) =>
        i.startupId === startup.startupId && i.invitedUserId === invitedUserId && i.status === 'pending'
    );
    if (exists) return { error: 'Invitation already pending' };

    const invitation = {
        id: null,
        startupId: startup.startupId,
        founderId: user.uid,
        invitedUserId,
        invitedEmail: invitedEmail?.toLowerCase() || null,
        status: 'pending',
        message,
        createdAt: nowIso(),
        updatedAt: nowIso()
    };

    system.invitations.push(normalizeInvitation(invitation));

    const target = (system.startups || []).find((s) => s.startupId === startup.startupId);
    if (target) {
        const invitedName = invitedEmail || 'Co-Founder';
        target.activity = [{ id: null, message: `Invitation sent to ${invitedName}`, type: 'info', timestamp: nowIso() }, ...(target.activity || [])].slice(0, 50);
    }

    saveSystem(system);
    return { success: true, invitation };
};

export const validateStartupInvitation = async (code) => {
    const system = getSystem();
    const inv = (system.invitations || []).find((i) =>
        (i.id === code || i.startupId === code) && i.status === 'pending'
    );
    if (inv) return inv;

    const startupByEmail = (system.startups || []).find((s) => {
        const founder = system.users?.[s.founderId];
        return founder && founder.email.toLowerCase() === code.toLowerCase();
    });

    if (!startupByEmail) return null;
    return { id: 'AUTO', startupId: startupByEmail.startupId, status: 'pending' };
};

export const acceptStartupInvitation = async (user, inviteCode) => {
    if (!user) return false;
    const system = getSystem();
    const invitation = (system.invitations || []).find((i) =>
        (i.id === inviteCode || i.startupId === inviteCode) && i.status === 'pending'
    );

    let startupId = invitation ? invitation.startupId : null;

    if (!invitation) {
        const startupByEmail = (system.startups || []).find((s) => {
            const founder = system.users?.[s.founderId];
            return founder && founder.email.toLowerCase() === inviteCode.toLowerCase();
        });
        if (startupByEmail) startupId = startupByEmail.startupId;
    }

    if (!startupId) return false;

    if (invitation) {
        invitation.status = 'accepted';
        invitation.invitedUserId = user.uid;
        invitation.updatedAt = nowIso();
    }

    system.startups = (system.startups || []).map((s) => {
        if (s.startupId !== startupId) return s;
        const coFounders = s.coFounders || [];
        if (coFounders.includes(user.uid)) return s;
        const newCoFounders = [...coFounders, user.uid];
        const msg = `${user.name || user.email || 'A Co-Founder'} joined the team via invitation`;
        return {
            ...s,
            coFounders: newCoFounders,
            teamSize: newCoFounders.length + 1,
            activity: [{ id: null, message: msg, type: 'success', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50)
        };
    });

    saveSystem(system);
    return true;
};

export const declineStartupInvitation = async (user, invitationId) => {
    if (!user) return false;
    const system = getSystem();
    const invitation = (system.invitations || []).find((i) => i.id === invitationId && i.status === 'pending');
    if (!invitation) return false;

    invitation.status = 'declined';
    invitation.updatedAt = nowIso();

    system.startups = (system.startups || []).map((s) => {
        if (s.startupId !== invitation.startupId) return s;
        const msg = `Invitation declined by ${user.name || user.email || 'candidate'}`;
        return { ...s, activity: [{ id: null, message: msg, type: 'warning', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50) };
    });

    saveSystem(system);
    return true;
};

export const cancelStartupInvitation = async (startup, invitationId) => {
    if (!startup) return false;
    const system = getSystem();
    const original = (system.invitations || []).length;
    system.invitations = (system.invitations || []).filter((i) => i.id !== invitationId);
    if (system.invitations.length >= original) return false;

    const target = (system.startups || []).find((s) => s.startupId === startup.startupId);
    if (target) {
        target.activity = [{ id: null, message: 'Cancelled outgoing invitation', type: 'info', timestamp: nowIso() }, ...(target.activity || [])].slice(0, 50);
    }

    saveSystem(system);
    return true;
};

export const sendStartupJoinRequest = async (user, startupId, message, isUserLinked) => {
    if (!user || user.role !== 'co-founder') return { error: 'Unauthorized' };
    const system = getSystem();
    const target = (system.startups || []).find((s) => s.startupId === startupId);
    if (!target) return { error: 'Startup not found' };
    if (isUserLinked) return { error: 'User must resign from current startup before applying' };

    const existing = (system.joinRequests || []).find((r) =>
        r.startupId === startupId && r.requesterId === user.uid && r.status === 'pending'
    );
    if (existing) return { error: 'Request already pending' };

    const request = {
        id: null,
        startupId,
        founderId: target.founderId,
        requesterId: user.uid,
        requesterName: user.name || user.profileData?.fullName || user.email?.split('@')[0] || 'Co-Founder',
        status: 'pending',
        message: message || '',
        createdAt: nowIso(),
        updatedAt: nowIso()
    };

    system.joinRequests = system.joinRequests || [];
    system.joinRequests.push(normalizeJoinRequest(request));
    target.activity = [{ id: null, message: `New join request from ${request.requesterName}`, type: 'info', timestamp: nowIso() }, ...(target.activity || [])].slice(0, 50);
    saveSystem(system);

    return { success: true, request };
};

export const acceptStartupJoinRequest = async (user, requestId, isUserLinked) => {
    const system = getSystem();
    const req = (system.joinRequests || []).find((r) => r.id === requestId);
    if (!req) return { error: 'Request not found' };

    if (user?.role === 'co-founder' && isUserLinked) {
        return { error: 'User must resign from current startup first.' };
    }

    req.status = 'accepted';
    req.updatedAt = nowIso();

    const startup = (system.startups || []).find((s) => s.startupId === req.startupId);
    if (startup) {
        startup.coFounders = [...new Set([...(startup.coFounders || []), req.requesterId])];
        startup.activity = [{ id: null, message: `${req.requesterName} joined the team`, type: 'success', timestamp: nowIso() }, ...(startup.activity || [])].slice(0, 50);
        startup.executionScore = calculateExecutionScore(startup);
    }

    saveSystem(system);
    return { success: true };
};

export const rejectStartupJoinRequest = async (requestId) => {
    const system = getSystem();
    const req = (system.joinRequests || []).find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'rejected';
    req.updatedAt = nowIso();

    const startup = (system.startups || []).find((s) => s.startupId === req.startupId);
    if (startup) {
        startup.activity = [{ id: null, message: 'Join request declined', type: 'warning', timestamp: nowIso() }, ...(startup.activity || [])].slice(0, 50);
    }

    saveSystem(system);
};

export const withdrawStartupJoinRequest = async (requestId) => {
    const system = getSystem();
    const req = (system.joinRequests || []).find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'withdrawn';
    req.updatedAt = nowIso();

    const startup = (system.startups || []).find((s) => s.startupId === req.startupId);
    if (startup) {
        startup.activity = [{ id: null, message: 'Co-Founder withdrew join request', type: 'info', timestamp: nowIso() }, ...(startup.activity || [])].slice(0, 50);
    }

    saveSystem(system);
};

export const removeStartupJoinRequest = async (requestId) => {
    const system = getSystem();
    system.joinRequests = (system.joinRequests || []).filter((r) => r.id !== requestId);
    saveSystem(system);
};

export const createStartupRecord = async (user, startupData) => {
    if (!user || user.role !== 'founder') return null;

    const system = getSystem();
    const capitalizeStage = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Idea');

    const startup = {
        startupId: user.uid || null,
        founderId: user.uid,
        startupName: startupData.startupName || 'My Startup',
        sector: startupData.sector || 'General',
        stage: capitalizeStage(startupData.stage),
        oneLiner: startupData.oneLiner || '',
        solutionOverview: startupData.solutionOverview || '',
        traction: '',
        growth: startupData.growth || '',
        revenue: startupData.revenue || '',
        fundingGoal: '',
        marketInfo: startupData.marketInfo || '',
        teamSize: Number(startupData.teamSize) || 1,
        milestones: [],
        focusAreas: [],
        problemStatement: startupData.problemStatement || '',
        targetAudience: startupData.targetAudience
            ? startupData.targetAudience.split(',').map((a) => a.trim()).filter(Boolean)
            : [],
        skillGap: startupData.lookingFor || '',
        primarySkills: Array.isArray(startupData.primarySkills)
            ? startupData.primarySkills.filter(Boolean)
            : (typeof startupData.primarySkills === 'string'
                ? startupData.primarySkills.split(',').map((s) => s.trim()).filter(Boolean)
                : []),
        location: startupData.location || '',
        commitment: startupData.commitment || '',
        linkedin: startupData.linkedin || '',
        equity: startupData.equity || '',
        demoLink: startupData.demoLink || '',
        pitchDeckLink: startupData.pitchDeckLink || '',
        website: '',
        documents: [],
        activeUsers: Number(startupData.activeUsers) || 0,
        executionScore: 0,
        createdAt: nowIso(),
        mentorAssigned: null,
        applications: [],
        activity: [{ id: null, message: 'Venture profile initialized.', type: 'info', timestamp: nowIso() }],
        updatedAt: nowIso(),
        status: 'active'
    };

    system.startups = system.startups || [];
    system.startups.push(normalizeStartup(startup));
    saveSystem(system);
    return startup;
};