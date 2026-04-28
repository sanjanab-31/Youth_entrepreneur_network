import {
    getSystem,
    normalizeStartup,
    normalizeUserProfile,
    getMentorUsers,
    saveSystem
} from './system';
import {
    acceptApplication,
    fetchApplications,
    rejectApplication
} from './applicationsApi';
import {
    addMentorToIncubator,
    fetchIncubators,
    removeMentorFromIncubator
} from './incubatorsApi';
import {
    createCohort,
    fetchCohorts,
    joinCohort,
    leaveCohort,
    updateCohort,
    deleteCohort
} from './cohortsApi';
import { fetchStartups } from './startupsApi';
import api from '../../services/api';
import { fetchUsers } from './usersApi';

const nowIso = () => new Date().toISOString();
const DAY_MS = 24 * 60 * 60 * 1000;

export const getDefaultIncubatorSettings = () => ({
    batchLimits: {
        maxCapacity: 25,
        durationWeeks: 12,
        deadline: new Date(new Date().getTime() + 30 * DAY_MS).toISOString().split('T')[0]
    },
    notifications: {
        newApplications: true,
        milestoneUpdates: true,
        mentorMessages: true
    },
    subAdmins: []
});

export const loadIncubatorState = async (user) => {
    if (!user || user.role !== 'incubator') {
        return {
            pipeline: [],
            applications: [],
            cohorts: [],
            mentors: [],
            profile: null
        };
    }

    const system = getSystem();
    let applications = [];
    let cohorts = [];
    let incubatorRecord = null;

    try {
        const allApplications = await fetchApplications();
        applications = allApplications.filter((a) => a.incubatorId === user.uid);
    } catch {
        applications = [];
    }

    try {
        const allCohorts = await fetchCohorts();
        cohorts = allCohorts.filter((c) => c.incubatorId === user.uid);
    } catch {
        cohorts = [];
    }

    try {
        const allIncubators = await fetchIncubators();
        incubatorRecord = allIncubators.find((incubator) => incubator.id === user.uid || incubator.incubatorId === user.uid) || null;
    } catch {
        incubatorRecord = null;
    }

    let backendMentors = [];
    try {
        backendMentors = (await fetchUsers())
            .map(normalizeUserProfile)
            .filter((mentor) => mentor && mentor.role === 'mentor');
    } catch {
        backendMentors = [];
    }

    // Fetch live startups and update system
    let allStartups = system.startups || [];
    try {
        allStartups = await fetchStartups();
        system.startups = allStartups;
        saveSystem(system);
    } catch (err) {
        console.error('Failed to fetch startups in loadIncubatorState:', err);
    }

    const mentorById = new Map();
    [...getMentorUsers(system), ...backendMentors].forEach((mentor) => {
        const mentorId = mentor?.uid || mentor?.id;
        if (mentorId && !mentorById.has(mentorId)) {
            mentorById.set(mentorId, mentor);
        }
    });

    const allMentors = Array.from(mentorById.values());
    const mentors = allMentors;

    return {
        applications,
        pipeline: (allStartups).filter((s) => s.incubatorAssigned === user.uid),
        cohorts,
        mentors,
        profile: {
            ...user,
            ...(user.portalData || {}),
            ...(incubatorRecord || {}),
            id: user.uid
        }
    };
};

const mutateSystem = (mutationFn) => {
    const system = getSystem();
    mutationFn(system);
    saveSystem(system);
};

export const acceptIncubatorApplication = async (user, appId, cohortId) => {
    await acceptApplication(appId);

    mutateSystem((system) => {
        const app = (system.applications || []).find((a) => a.id === appId || a.applicationId === appId);
        if (!app) return;

        app.status = 'accepted';
        app.updatedAt = nowIso();

        system.startups = (system.startups || []).map((s) =>
            s.startupId === app.startupId
                ? { ...s, incubatorAssigned: user.uid, cohortId: cohortId || null, applicationStatus: 'accepted', updatedAt: nowIso() }
                : s
        );

        system.incubators = (system.incubators || []).map((inc) =>
            inc.id === user.uid
                ? { ...inc, activeCohorts: Array.from(new Set([...(inc.activeCohorts || []), app.founderId])) }
                : inc
        );
    });
};

export const rejectIncubatorApplication = async (appId) => {
    await rejectApplication(appId);

    mutateSystem((system) => {
        const app = (system.applications || []).find((a) => a.id === appId || a.applicationId === appId);
        if (!app) return;

        app.status = 'rejected';
        app.updatedAt = nowIso();

        system.startups = (system.startups || []).map((s) =>
            s.startupId === app.startupId ? { ...s, applicationStatus: 'rejected', updatedAt: nowIso() } : s
        );
    });
};

export const assignMentorForIncubatorStartup = async (mentorId, startupId) => {
    mutateSystem((system) => {
        const mentor = system.users?.[mentorId];
        const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

        system.startups = (system.startups || []).map((s) =>
            s.startupId === startupId
                ? {
                    ...s,
                    mentorAssigned: mentorId,
                    mentorshipStartDate: nowIso(),
                    updatedAt: nowIso(),
                    activity: [{ id: null, message: `Incubator assigned mentor ${mentorName}`, type: 'mentor', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50)
                }
                : s
        );
    });
};

export const removeMentorForIncubatorStartup = async (mentorId, startupId, incubatorId = null) => {
    let shouldRemoveMentorLink = false;

    mutateSystem((system) => {
        const mentor = system.users?.[mentorId];
        const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

        system.startups = (system.startups || []).map((s) =>
            s.startupId === startupId
                ? {
                    ...s,
                    mentorAssigned: null,
                    updatedAt: nowIso(),
                    activity: [{ id: null, message: `Incubator removed mentor ${mentorName}`, type: 'warning', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50)
                }
                : s
        );

        if (incubatorId) {
            shouldRemoveMentorLink = !(system.startups || []).some((startup) =>
                startup.incubatorAssigned === incubatorId && startup.mentorAssigned === mentorId
            );
        }
    });

    if (incubatorId && shouldRemoveMentorLink) {
        await removeMentorFromIncubator(incubatorId, mentorId);
    }
};

export const onboardIncubatorStartup = async (user, startupData) => {
    const startupId = startupData?.startupId || startupData?.id || null;
    const startup = {
        startupId,
        id: startupId,
        founderId: startupData?.founderId || null,
        startupName: startupData.name || 'New Startup',
        sector: startupData.sector || 'General',
        stage: startupData.stage || 'Idea',
        oneLiner: startupData.oneLiner || '',
        solutionOverview: startupData.oneLiner || '',
        problemStatement: startupData.problemStatement || '',
        targetAudience: [],
        marketInfo: '',
        growth: '',
        revenue: '',
        activeUsers: 0,
        demoLink: '',
        pitchDeckLink: '',
        executionScore: 0,
        incubatorAssigned: user.uid,
        status: 'active',
        milestones: [],
        documents: [],
        coFounders: [],
        focusAreas: [],
        activity: [{ id: null, message: 'Onboarded by incubator.', type: 'info', timestamp: nowIso() }],
        createdAt: nowIso(),
        updatedAt: nowIso()
    };

    mutateSystem((system) => {
        system.startups = system.startups || [];
        system.startups.push(normalizeStartup(startup));
    });

    return startup;
};

export const onboardIncubatorMentor = async (user, mentorData) => {
    const system = getSystem();
    const backendUsers = await fetchUsers().catch(() => []);
    const mentorEmail = (mentorData?.email || '').trim().toLowerCase();
    const existingMentor = [
        ...Object.values(system.users || {}),
        ...backendUsers
    ]
        .map(normalizeUserProfile)
        .find((mentor) => {
            if (!mentor || mentor.role !== 'mentor') return false;

            const mentorId = (mentor.uid || mentor.id || '').toString();
            const mentorEmailValue = (mentor.email || '').toString().trim().toLowerCase();
            return (mentorData?.uid && mentorId === String(mentorData.uid))
                || (mentorData?.id && mentorId === String(mentorData.id))
                || (mentorEmail && mentorEmailValue === mentorEmail);
        });

    const mentorId = existingMentor?.uid || existingMentor?.id || mentorData?.uid || mentorData?.id || mentorData?.email || null;
    const expertise = Array.isArray(mentorData.expertise)
        ? mentorData.expertise
        : (mentorData.expertise || mentorData.primarySkills || '').split(',').map((item) => item.trim()).filter(Boolean);

    const availability = {
        status: 'Available',
        days: ['Mon', 'Wed', 'Fri'],
        workload: 0,
        sessionType: '1:1',
        ...(mentorData.availability || {})
    };

    const mentor = normalizeUserProfile({
        uid: mentorId,
        name: mentorData.name,
        email: mentorData.email || `${mentorData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
        role: 'mentor',
        expertise: expertise.length > 0 ? expertise : ['General Mentorship'],
        sector: mentorData.sector || 'General',
        company: mentorData.company || '',
        linkedin: mentorData.linkedin || '',
        bio: mentorData.bio || 'Mentor profile created by incubator.',
        availability,
        badge: mentorData.badge || 'Verified',
        portalData: {
            sector: mentorData.sector || 'General',
            company: mentorData.company || '',
            currentRole: mentorData.currentRole || '',
            capacity: Number(mentorData.capacity) || 5,
            availability,
            badge: mentorData.badge || 'Verified'
        },
        onboardedBy: user.uid,
        createdAt: nowIso()
    });

    mutateSystem((state) => {
        if (!mentorId) return;
        state.users[mentorId] = mentor;
    });

    if (mentorId && !existingMentor) {
        await api.post('/v1/users', {
            id: mentorId,
            uid: mentorId,
            name: mentor.name,
            email: mentor.email,
            role: 'mentor',
            portal_data: mentor.portalData,
            profile_data: {
                expertise: mentor.expertise,
                sector: mentor.sector,
                company: mentor.company,
                linkedin: mentor.linkedin,
                bio: mentor.bio,
                availability: mentor.availability,
                badge: mentor.badge
            }
        });
    }

    if (mentorId) {
        await addMentorToIncubator(user.uid, mentorId);
    }

    return mentor;
};

export const removeMentorFromIncubatorDirectory = async (incubatorId, mentorId) => {
    if (!incubatorId || !mentorId) return;
    await removeMentorFromIncubator(incubatorId, mentorId);
};

export const createIncubatorCohort = async (user, cohortData) => {
    await createCohort({
        id: cohortData?.id || null,
        incubatorId: user.uid,
        name: cohortData.name,
        startDate: cohortData.startDate,
        endDate: cohortData.endDate,
        maxCapacity: Number(cohortData.maxCapacity) || 20,
        status: 'upcoming'
    });
};

export const assignStartupToIncubatorCohort = async (user, startupId, cohortId) => {
    await joinCohort(cohortId, startupId);
};

export const removeStartupFromIncubatorCohort = async (user, startupId, cohortId) => {
    await leaveCohort(cohortId, startupId);
};

export const updateIncubatorCohort = async (cohortId, cohortData) => {
    await updateCohort(cohortId, cohortData);
};

export const deleteIncubatorCohort = async (cohortId) => {
    await deleteCohort(cohortId);
};

const getLastUpdateTime = (startup) => {
    const milestoneTimes = (startup.milestones || [])
        .map((ms) => (typeof ms === 'object' ? (ms.updatedAt || ms.completedAt || ms.createdAt || ms.timestamp) : null))
        .filter(Boolean)
        .map((t) => new Date(t).getTime())
        .filter(Number.isFinite);

    const activityTimes = (startup.activity || []).map((a) => new Date(a.timestamp).getTime()).filter(Number.isFinite);
    const directTimes = [startup.updatedAt, startup.createdAt].filter(Boolean).map((t) => new Date(t).getTime()).filter(Number.isFinite);

    const all = [...directTimes, ...activityTimes, ...milestoneTimes];
    return all.length ? Math.max(...all) : 0;
};

const hasRecentUpdate = (startup, days = 14) => {
    const last = getLastUpdateTime(startup);
    if (!last) return false;
    return last >= (new Date().getTime() - (days * DAY_MS));
};

const isAtRiskStartup = (startup) => {
    const noMilestones = !startup.milestones || startup.milestones.length === 0;
    const lowExecution = (startup.executionScore || 0) < 40;
    const stale = !hasRecentUpdate(startup, 14);
    return noMilestones || lowExecution || stale;
};

export const buildIncubatorDerivedState = (pipeline, applications, cohorts) => {
    const totalStartups = (pipeline || []).length;
    const totalApps = (applications || []).length;
    const pendingApplications = (applications || []).filter((a) => a.status === 'pending').length;
    const acceptedApps = (applications || []).filter((a) => a.status === 'accepted').length;
    const acceptanceRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : null;
    const totalExecScore = (pipeline || []).reduce((acc, s) => acc + (s.executionScore || 0), 0);
    const avgExecutionScore = totalStartups > 0 ? Math.round(totalExecScore / totalStartups) : 0;
    const mentorAssignedCount = (pipeline || []).filter((s) => s.mentorAssigned || s.mentorId).length;
    const mentorUtilization = totalStartups > 0 ? Math.round((mentorAssignedCount / totalStartups) * 100) : 0;
    const atRiskStartups = (pipeline || []).filter(isAtRiskStartup).length;

    const analytics = {
        totalStartups,
        totalApplications: totalApps,
        acceptedApplications: acceptedApps,
        pendingApplications,
        acceptanceRate,
        acceptanceRateLabel: acceptanceRate === null ? 'N/A' : `${acceptanceRate}%`,
        atRiskStartups,
        avgExecutionScore,
        mentorUtilization,
        cohortSize: (pipeline || []).filter((s) => s.cohortId).length,
        graduated: (pipeline || []).filter((s) => s.status === 'graduated').length
    };

    const alerts = [];
    const lowExec = (pipeline || []).filter((s) => (s.executionScore || 0) < 40);
    if (lowExec.length > 0) alerts.push({ id: 'low_exec', type: 'critical', message: `${lowExec.length} startups have low execution score (<40).`, timestamp: nowIso() });

    const inactive = (pipeline || []).filter((s) => !hasRecentUpdate(s, 14));
    if (inactive.length > 0) alerts.push({ id: 'inactive_startups', type: 'warning', message: `${inactive.length} startups have no recent updates in the last 14 days.`, timestamp: nowIso() });

    const noMentor = (pipeline || []).filter((s) => !s.mentorAssigned && !s.mentorId);
    if (noMentor.length > 0) alerts.push({ id: 'no_mentor', type: 'warning', message: `${noMentor.length} startups do not have a mentor assigned.`, timestamp: nowIso() });

    const noMilestones = (pipeline || []).filter((s) => !s.milestones || s.milestones.length === 0);
    if (noMilestones.length > 0) alerts.push({ id: 'no_milestones', type: 'critical', message: `${noMilestones.length} startups have no milestones defined.`, timestamp: nowIso() });

    const highPotentialStartups = (pipeline || [])
        .filter((s) => (s.executionScore || 0) > 60 && (s.milestones || []).length > 0 && hasRecentUpdate(s, 14))
        .sort((a, b) => {
            const scoreDelta = (b.executionScore || 0) - (a.executionScore || 0);
            if (scoreDelta !== 0) return scoreDelta;
            return getLastUpdateTime(b) - getLastUpdateTime(a);
        })
        .slice(0, 3);

    const activityFeed = (pipeline || [])
        .flatMap((s) => (s.activity || []).map((a) => ({ ...a, startupName: s.startupName, startupId: s.startupId })))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 15);

    const now = new Date();
    const nextBatch = (cohorts || [])
        .filter((c) => c.startDate && new Date(c.startDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;

    return { analytics, alerts, highPotentialStartups, activityFeed, nextBatch };
};