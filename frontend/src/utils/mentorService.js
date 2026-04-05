import { calculateExecutionScore } from './executionScore';
import { getSystem, normalizeUserProfile, saveSystem } from './system';
import api from '../../services/api';
import {
    cancelSession,
    completeSession,
    confirmSession,
    createSession,
    fetchSessions,
    updateSession
} from './sessionsApi';

const nowIso = () => new Date().toISOString();

const normalizeMentorRequestFromApi = (request = {}) => ({
    ...request,
    id: request.id,
    startupId: request.startupId ?? request.startup_id ?? null,
    founderId: request.founderId ?? request.founder_id ?? null,
    mentorId: request.mentorId ?? request.mentor_id ?? null,
    status: request.status === 'rejected' ? 'declined' : request.status,
    createdAt: request.createdAt ?? request.created_at ?? null,
    updatedAt: request.updatedAt ?? request.updated_at ?? null,
});

export const fetchMentorRequests = async () => {
    const response = await api.get('/v1/mentor-requests');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeMentorRequestFromApi);
};

export const loadMentorState = async (user) => {
    if (!user || user.role !== 'mentor') {
        return { profile: null, requests: [], sessions: [], mentees: [] };
    }

    const system = getSystem();
    const profile = normalizeUserProfile(system.users?.[user.uid] || user);
    const allRequests = await fetchMentorRequests();
    const requests = allRequests.filter((r) => r.mentorId === profile.uid);

    return {
        profile,
        requests,
        sessions: (await fetchSessions()).filter((s) => s.mentorId === user.uid),
        mentees: (system.startups || []).filter((s) => s.mentorAssigned === user.uid)
    };
};

export const updateMentorProfile = async (profile, updates, user, authUpdateProfile) => {
    if (!user) return;
    const merged = normalizeUserProfile({ ...profile, ...updates, uid: user.uid, role: 'mentor' });
    await authUpdateProfile(merged);
};

export const updateMentorSession = async (sessionId, updates) => {
    await updateSession(sessionId, updates);
};

export const acceptMentorRequest = async (requestId) => {
    await api.post(`/v1/mentor-requests/${requestId}/accept`);
};

export const declineMentorRequest = async (requestId) => {
    await api.post(`/v1/mentor-requests/${requestId}/reject`);
};

export const scheduleMentorSession = async (startupId, date, time, topic, meetingLink, user) => {
    const system = getSystem();
    const startup = (system.startups || []).find((s) => s.startupId === startupId);
    if (!startup || startup.mentorAssigned !== user.uid) return;

    await createSession({
        mentorId: user.uid,
        startupId,
        founderId: startup.founderId,
        date,
        time,
        topic,
        meetingLink,
        status: 'upcoming',
    });

    system.startups = (system.startups || []).map((s) =>
        s.startupId !== startupId
            ? s
            : {
                ...s,
                activity: [{ id: null, message: `Mentor scheduled a session for ${date} at ${time}`, type: 'mentor', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50),
                updatedAt: nowIso()
            }
    );

    saveSystem(system);
};

export const confirmMentorSessionRequest = async (sessionId, schedule, user) => {
    const system = getSystem();
    const session = (await fetchSessions()).find((s) => s.id === sessionId);
    if (!session) return;
    const startup = (system.startups || []).find((s) => s.startupId === session.startupId);
    if (!startup || startup.mentorAssigned !== user.uid) return;

    const resolvedDate = schedule?.date || session.date;
    const resolvedTime = schedule?.time || session.time;
    const resolvedMeetingLink = schedule?.meetingLink?.trim();
    const resolvedTopic = schedule?.topic || session.topic;

    if (!resolvedDate || !resolvedTime || !resolvedMeetingLink) return;

    await confirmSession(sessionId);
    await updateSession(sessionId, {
        date: resolvedDate,
        time: resolvedTime,
        topic: resolvedTopic,
        meetingLink: resolvedMeetingLink
    });

    system.startups = (system.startups || []).map((s) =>
        s.startupId !== session.startupId
            ? s
            : {
                ...s,
                activity: [{ id: null, message: `Mentor confirmed your session request for ${resolvedDate} at ${resolvedTime}`, type: 'mentor', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50),
                updatedAt: nowIso()
            }
    );

    saveSystem(system);
};

export const declineMentorSessionRequest = async (sessionId, user) => {
    const system = getSystem();
    const session = (await fetchSessions()).find((s) => s.id === sessionId);
    if (!session) return;
    const startup = (system.startups || []).find((s) => s.startupId === session.startupId);
    if (!startup || startup.mentorAssigned !== user.uid) return;

    await cancelSession(sessionId);

    system.startups = (system.startups || []).map((s) =>
        s.startupId !== session.startupId
            ? s
            : {
                ...s,
                activity: [{ id: null, message: `Mentor declined your session request for ${session.date}`, type: 'warning', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50),
                updatedAt: nowIso()
            }
    );

    saveSystem(system);
};

export const completeMentorSession = async (sessionId, feedback, user) => {
    const system = getSystem();
    const session = (await fetchSessions()).find((s) => s.id === sessionId);
    if (!session) return;
    const startup = (system.startups || []).find((s) => s.startupId === session.startupId);
    if (!startup || startup.mentorAssigned !== user.uid) return;

    await completeSession(sessionId);
    await updateSession(sessionId, {
        notes: feedback.advice,
        actionItems: Array.isArray(feedback.actionItems) ? feedback.actionItems : [],
        completedAt: nowIso()
    });

    system.startups = (system.startups || []).map((s) => {
        if (s.startupId !== session.startupId) return s;
        const updated = {
            ...s,
            activity: [{ id: null, message: 'Completed session with mentor. Feedback received.', type: 'success', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 50),
            updatedAt: nowIso()
        };
        updated.executionScore = calculateExecutionScore(updated);
        return updated;
    });

    saveSystem(system);
};

export const addMentorFocusArea = async (startupId, area) => {
    if (!area?.trim()) return;
    const system = getSystem();
    system.startups = (system.startups || []).map((s) => {
        if (s.startupId !== startupId) return s;
        const existing = Array.isArray(s.focusAreas) ? s.focusAreas : [];
        if (existing.includes(area.trim())) return s;
        return {
            ...s,
            focusAreas: [...existing, area.trim()],
            activity: [{ id: null, message: `Mentor added focus area: ${area.trim()}`, type: 'mentor', timestamp: nowIso() }, ...(s.activity || [])].slice(0, 20),
            updatedAt: nowIso()
        };
    });
    saveSystem(system);
};

export const removeMentorFocusArea = async (startupId, area) => {
    const system = getSystem();
    system.startups = (system.startups || []).map((s) =>
        s.startupId !== startupId
            ? s
            : { ...s, focusAreas: (s.focusAreas || []).filter((a) => a !== area), updatedAt: nowIso() }
    );
    saveSystem(system);
};

export const buildMentorMessagePayload = async (user, startupId, text) => {
    if (!user || !startupId || !text) return null;

    const system = getSystem();
    const startup = (system.startups || []).find((s) => s.startupId === startupId);
    if (!startup || startup.mentorAssigned !== user.uid) return null;

    return {
        startupId,
        conversationType: 'mentor',
        message: text
    };
};

export const buildMentorStats = (requests, sessions, mentees) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));

    const sessionsThisWeek = (sessions || []).filter((s) => {
        const d = new Date(s.date);
        return d >= startOfWeek && d <= endOfWeek;
    }).length;

    const accepted = (requests || []).filter((r) => r.status === 'accepted').length;
    const total = (requests || []).length;

    return {
        pendingRequests: (requests || []).filter((r) => r.status === 'pending').length,
        activeMentees: (mentees || []).length,
        sessionsThisWeek,
        responseRate: total > 0 ? Math.round((accepted / total) * 100) : 100
    };
};

export const buildMentorActivity = (requests, sessions) => {
    const system = getSystem();
    const users = system.users || {};

    const getStartupName = (startupId) => (system.startups || []).find((s) => s.startupId === startupId)?.startupName || 'Unknown Startup';
    const getFounderName = (founderId) => {
        const u = users[founderId];
        return u?.name || u?.email?.split('@')[0] || 'Unknown Founder';
    };

    const items = [];

    (requests || []).forEach((r) => {
        const startup = (system.startups || []).find((s) => s.startupId === r.startupId);
        const founderName = startup ? getFounderName(startup.founderId) : 'Unknown Founder';
        const startupName = startup?.startupName || 'Unknown Startup';

        if (r.status === 'pending') items.push({ id: r.id || null, type: 'request', message: `New mentorship request from ${founderName} (${startupName})`, timestamp: r.createdAt });
        if (r.status === 'accepted') items.push({ id: r.id || null, type: 'success', message: `Accepted request from ${founderName}`, timestamp: r.updatedAt || r.createdAt });
        if (r.status === 'declined') items.push({ id: r.id || null, type: 'error', message: `Declined request from ${founderName}`, timestamp: r.updatedAt || r.createdAt });
    });

    (sessions || []).forEach((s) => {
        const startupName = getStartupName(s.startupId);
        items.push({ id: s.id || null, type: 'session', message: `Session with ${startupName} on ${s.date} at ${s.time}`, timestamp: s.createdAt });
    });

    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};