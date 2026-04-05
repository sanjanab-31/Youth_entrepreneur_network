import api from '../../services/api';

const normalizeCohort = (cohort = {}) => ({
    ...cohort,
    id: cohort.id,
    incubatorId: cohort.incubatorId ?? cohort.incubator_id ?? null,
    name: cohort.name ?? 'Cohort',
    startDate: cohort.startDate ?? cohort.start_date ?? null,
    endDate: cohort.endDate ?? cohort.end_date ?? null,
    maxCapacity: Number(cohort.maxCapacity ?? cohort.max_capacity ?? 20),
    status: cohort.status ?? 'upcoming',
    startupIds: Array.isArray(cohort.startupIds)
        ? cohort.startupIds
        : Array.isArray(cohort.memberStartupIds)
            ? cohort.memberStartupIds
            : Array.isArray(cohort.member_startup_ids)
                ? cohort.member_startup_ids
                : [],
    createdAt: cohort.createdAt ?? cohort.created_at ?? null,
    updatedAt: cohort.updatedAt ?? cohort.updated_at ?? null,
});

export const fetchCohorts = async () => {
    const response = await api.get('/v1/cohorts');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeCohort);
};

export const createCohort = async (payload) => {
    const response = await api.post('/v1/cohorts', payload);
    return normalizeCohort(response.data?.data || {});
};

export const updateCohort = async (id, payload) => {
    const response = await api.put(`/v1/cohorts/${id}`, payload);
    return normalizeCohort(response.data?.data || {});
};

export const deleteCohort = async (id) => {
    const response = await api.delete(`/v1/cohorts/${id}`);
    return normalizeCohort(response.data?.data || {});
};

export const joinCohort = async (id, startupId) => {
    const response = await api.post(`/v1/cohorts/${id}/join`, { startupId });
    return normalizeCohort(response.data?.data || {});
};

export const leaveCohort = async (id, startupId) => {
    const response = await api.post(`/v1/cohorts/${id}/leave`, { startupId });
    return normalizeCohort(response.data?.data || {});
};
