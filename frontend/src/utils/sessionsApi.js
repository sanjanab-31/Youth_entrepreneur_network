import api from '../../services/api';

const normalizeSession = (session = {}) => {
    const rawStatus = (session.status || '').toLowerCase();
    let status = rawStatus || 'pending_confirmation';

    if (status === 'confirmed' || status === 'rescheduled') {
        status = 'upcoming';
    }

    return {
        ...session,
        id: session.id,
        startupId: session.startupId ?? session.startup_id ?? null,
        founderId: session.founderId ?? session.founder_id ?? null,
        mentorId: session.mentorId ?? session.mentor_id ?? null,
        incubatorId: session.incubatorId ?? session.incubator_id ?? null,
        meetingLink: session.meetingLink ?? session.meeting_link ?? null,
        actionItems: Array.isArray(session.actionItems)
            ? session.actionItems
            : Array.isArray(session.action_items)
                ? session.action_items
                : [],
        completedAt: session.completedAt ?? session.completed_at ?? null,
        createdAt: session.createdAt ?? session.created_at ?? null,
        updatedAt: session.updatedAt ?? session.updated_at ?? null,
        status,
    };
};

export const fetchSessions = async () => {
    const response = await api.get('/v1/sessions');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeSession);
};

export const createSession = async (payload) => {
    const response = await api.post('/v1/sessions', payload);
    return normalizeSession(response.data?.data || {});
};

export const updateSession = async (id, payload) => {
    const response = await api.put(`/v1/sessions/${id}`, payload);
    return normalizeSession(response.data?.data || {});
};

export const deleteSession = async (id) => {
    const response = await api.delete(`/v1/sessions/${id}`);
    return normalizeSession(response.data?.data || {});
};

export const confirmSession = async (id) => {
    const response = await api.post(`/v1/sessions/${id}/confirm`);
    return normalizeSession(response.data?.data || {});
};

export const cancelSession = async (id) => {
    const response = await api.post(`/v1/sessions/${id}/cancel`);
    return normalizeSession(response.data?.data || {});
};

export const completeSession = async (id) => {
    const response = await api.post(`/v1/sessions/${id}/complete`);
    return normalizeSession(response.data?.data || {});
};

export const rescheduleSession = async (id, scheduledAt) => {
    const response = await api.post(`/v1/sessions/${id}/reschedule`, { scheduledAt });
    return normalizeSession(response.data?.data || {});
};
