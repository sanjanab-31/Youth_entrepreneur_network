import api from '../../services/api';

const normalizeStartup = (s = {}) => ({
    ...s,
    id: s.id,
    startupId: s.id || s.startup_id || s.startupId || null,
    founderId: s.founder_id || s.founderId || null,
    startupName: s.startup_name || s.startupName || s.name || 'My Startup',
    sector: s.sector || 'General',
    stage: s.stage || 'Idea',
    oneLiner: s.one_liner || s.oneLiner || '',
    solutionOverview: s.solution_overview || s.solutionOverview || '',
    problemStatement: s.problem_statement || s.problemStatement || '',
    targetAudience: Array.isArray(s.target_audience) ? s.target_audience : (s.targetAudience || []),
    marketInfo: s.market_info || s.marketInfo || '',
    growth: s.growth || '',
    revenue: s.revenue || '',
    traction: s.traction || '',
    tractionHistory: Array.isArray(s.traction_history) ? s.traction_history : (s.tractionHistory || []),
    fundingGoal: s.funding_goal || s.fundingGoal || '',
    activeUsers: Number(s.active_users || s.activeUsers || 0),
    burnRate: Number(s.burn_rate || s.burnRate || 0),
    demoLink: s.demo_link || s.demoLink || '',
    pitchDeckLink: s.pitch_deck_link || s.pitchDeckLink || '',
    website: s.website || '',
    location: s.location || '',
    commitment: s.commitment || '',
    equity: s.equity || '',
    skillGap: s.skill_gap || s.skillGap || s.lookingFor || '',
    primarySkills: Array.isArray(s.primary_skills) ? s.primary_skills : (s.primarySkills || []),
    teamSize: Number(s.team_size || s.teamSize || 1),
    coFounders: Array.isArray(s.co_founders) ? s.co_founders : (Array.isArray(s.coFounders) ? s.coFounders : []),
    focusAreas: Array.isArray(s.focus_areas) ? s.focus_areas : (s.focusAreas || []),
    mentorAssigned: s.mentor_assigned || s.mentorAssigned || s.mentorId || null,
    incubatorAssigned: s.incubator_assigned || s.incubatorAssigned || s.incubatorId || null,
    cohortId: s.cohort_id || s.cohortId || null,
    executionScore: Number(s.execution_score || s.executionScore || 0),
    profileCompletion: Number(s.profile_completion || s.profileCompletion || 0),
    status: s.status || 'active',
    createdAt: s.created_at || s.createdAt || null,
    updatedAt: s.updated_at || s.updatedAt || null,
});

export const fetchStartups = async () => {
    const response = await api.get('/v1/startups');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeStartup);
};

export const fetchStartupById = async (id) => {
    const response = await api.get(`/v1/startups/${id}`);
    return normalizeStartup(response.data?.data || {});
};

export const createStartup = async (payload) => {
    const response = await api.post('/v1/startups', payload);
    return normalizeStartup(response.data?.data || {});
};

export const updateStartup = async (id, payload) => {
    const response = await api.put(`/v1/startups/${id}`, payload);
    return normalizeStartup(response.data?.data || {});
};

export const deleteStartup = async (id) => {
    const response = await api.delete(`/v1/startups/${id}`);
    return normalizeStartup(response.data?.data || {});
};

export const assignMentorToStartup = async (id, mentorId) => {
    const response = await api.post(`/v1/startups/${id}/assign-mentor`, { mentorId });
    return normalizeStartup(response.data?.data || {});
};

export const assignIncubatorToStartup = async (id, incubatorId) => {
    const response = await api.post(`/v1/startups/${id}/assign-incubator`, { incubatorId });
    return normalizeStartup(response.data?.data || {});
};
