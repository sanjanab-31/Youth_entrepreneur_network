import api from '../../services/api';

const normalizeApplication = (app = {}) => ({
    ...app,
    id: app.id,
    startupId: app.startupId ?? app.startup_id ?? null,
    founderId: app.founderId ?? app.founder_id ?? null,
    incubatorId: app.incubatorId ?? app.incubator_id ?? null,
    startupName: app.startupName ?? app.startup_name ?? null,
    teamSize: app.teamSize ?? app.team_size ?? 0,
    cohortId: app.cohortId ?? app.cohort_id ?? null,
    createdAt: app.createdAt ?? app.created_at ?? null,
    updatedAt: app.updatedAt ?? app.updated_at ?? null,
    status: app.status || 'pending',
});

export const fetchApplications = async () => {
    const response = await api.get('/v1/applications');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeApplication);
};

export const createApplication = async (payload) => {
    const response = await api.post('/v1/applications', payload);
    return normalizeApplication(response.data?.data || {});
};

export const updateApplication = async (id, payload) => {
    const response = await api.put(`/v1/applications/${id}`, payload);
    return normalizeApplication(response.data?.data || {});
};

export const deleteApplication = async (id) => {
    const response = await api.delete(`/v1/applications/${id}`);
    return normalizeApplication(response.data?.data || {});
};

export const acceptApplication = async (id) => {
    const response = await api.post(`/v1/applications/${id}/accept`);
    return normalizeApplication(response.data?.data || {});
};

export const rejectApplication = async (id) => {
    const response = await api.post(`/v1/applications/${id}/reject`);
    return normalizeApplication(response.data?.data || {});
};

export const waitlistApplication = async (id) => {
    const response = await api.post(`/v1/applications/${id}/waitlist`);
    return normalizeApplication(response.data?.data || {});
};
