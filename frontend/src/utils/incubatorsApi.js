import api from '../../services/api';

const normalizeIncubator = (incubator = {}) => ({
    ...incubator,
    id: incubator.id,
    incubatorId: incubator.incubatorId ?? incubator.incubator_id ?? incubator.id ?? null,
    name: incubator.name ?? incubator.incubatorName ?? incubator.incubator_name ?? 'Incubator',
    incubatorName: incubator.incubatorName ?? incubator.incubator_name ?? incubator.name ?? 'Incubator',
    location: incubator.location ?? '',
    description: incubator.description ?? '',
    website: incubator.website ?? '',
    stagePreference: Array.isArray(incubator.stagePreference)
        ? incubator.stagePreference
        : Array.isArray(incubator.stage_preference)
            ? incubator.stage_preference
            : [],
    fundingSupport: Boolean(incubator.fundingSupport ?? incubator.funding_support ?? false),
    batchSize: Number(incubator.batchSize ?? incubator.batch_size ?? 20),
    verified: Boolean(incubator.verified),
    successStats: incubator.successStats
        ? incubator.successStats
        : {
            graduated: Number(incubator.success_stats_graduated ?? 0),
            raised: incubator.success_stats_raised ?? '$0',
            active: Number(incubator.success_stats_active ?? 0)
        },
    mentorIds: Array.isArray(incubator.mentorIds)
        ? incubator.mentorIds
        : Array.isArray(incubator.mentor_ids)
            ? incubator.mentor_ids
            : [],
    ownerUserId: incubator.ownerUserId ?? incubator.owner_user_id ?? null,
    createdAt: incubator.createdAt ?? incubator.created_at ?? null,
    updatedAt: incubator.updatedAt ?? incubator.updated_at ?? null,
});

export const fetchIncubators = async () => {
    const response = await api.get('/v1/incubators');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeIncubator);
};

export const createIncubator = async (payload) => {
    const response = await api.post('/v1/incubators', payload);
    return normalizeIncubator(response.data?.data || {});
};

export const updateIncubator = async (id, payload) => {
    const response = await api.put(`/v1/incubators/${id}`, payload);
    return normalizeIncubator(response.data?.data || {});
};

export const deleteIncubator = async (id) => {
    const response = await api.delete(`/v1/incubators/${id}`);
    return normalizeIncubator(response.data?.data || {});
};

export const addMentorToIncubator = async (id, mentorId) => {
    const response = await api.post(`/v1/incubators/${id}/mentors`, { mentorId });
    return normalizeIncubator(response.data?.data || {});
};

export const removeMentorFromIncubator = async (id, mentorId) => {
    const response = await api.delete(`/v1/incubators/${id}/mentors/${mentorId}`);
    return normalizeIncubator(response.data?.data || {});
};
