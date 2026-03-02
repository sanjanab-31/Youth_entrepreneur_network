export const SYSTEM_KEY = 'vanguard_system';

export const getSystem = () => {
    let system = {
        users: {},
        startups: [],
        incubators: [],
        applications: [],
        cohorts: [],
        mentorRequests: [],
        sessions: [],
        invitations: [],
        joinRequests: [],
        messages: []
    };

    try {
        const stored = localStorage.getItem(SYSTEM_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // AUTO-HEALING: Ensure all required keys exist
            system = {
                ...system,
                ...parsed,
                users: parsed.users || {},
                startups: (parsed.startups || []).map(s => ({
                    ...s,
                    milestones: s.milestones || [],
                    activity: s.activity || [],
                    documents: s.documents || [],
                    messages: s.messages || [],
                    coFounders: s.coFounders || [],
                    activeUsers: s.activeUsers || 0,
                    burnRate: s.burnRate || 0,
                    teamSize: s.teamSize || 1,
                    startupName: s.startupName || 'Unnamed Venture',
                    sector: s.sector || 'General',
                    stage: s.stage || 'Idea'
                })),
                incubators: parsed.incubators || [],
                applications: parsed.applications || [],
                cohorts: parsed.cohorts || [],
                mentorRequests: parsed.mentorRequests || [],
                sessions: parsed.sessions || [],
                invitations: parsed.invitations || [],
                joinRequests: parsed.joinRequests || [],
                messages: parsed.messages || []
            };
        } else {
            // MIGRATION LOGIC
            const legacyUsersRaw = localStorage.getItem('vanguard_users');
            const legacyStartupsRaw = localStorage.getItem('vanguard_startups');
            const legacyApplicationsRaw = localStorage.getItem('vanguard_applications');
            const legacyIncubatorsRaw = localStorage.getItem('vanguard_incubators');
            const legacyCohortsRaw = localStorage.getItem('vanguard_cohorts');
            const legacyRequestsRaw = localStorage.getItem('vanguard_mentorRequests');
            const legacySessionsRaw = localStorage.getItem('vanguard_sessions');

            const legacyUsers = legacyUsersRaw ? JSON.parse(legacyUsersRaw) : {};
            const legacyStartups = (legacyStartupsRaw ? JSON.parse(legacyStartupsRaw) : []).map(s => ({
                ...s,
                milestones: s.milestones || [],
                activity: s.activity || [],
                documents: s.documents || [],
                messages: s.messages || [],
                coFounders: s.coFounders || [],
                activeUsers: s.activeUsers || 0,
                burnRate: s.burnRate || 0,
                teamSize: s.teamSize || 1
            }));
            const legacyApplications = legacyApplicationsRaw ? JSON.parse(legacyApplicationsRaw) : [];
            const legacyIncubators = legacyIncubatorsRaw ? JSON.parse(legacyIncubatorsRaw) : [];
            const legacyCohorts = legacyCohortsRaw ? JSON.parse(legacyCohortsRaw) : [];
            const legacyRequests = legacyRequestsRaw ? JSON.parse(legacyRequestsRaw) : [];
            const legacySessions = legacySessionsRaw ? JSON.parse(legacySessionsRaw) : [];

            // Normalize users
            const normalizedUsers = Array.isArray(legacyUsers)
                ? legacyUsers.reduce((acc, u) => { if (u.uid || u.id) acc[u.uid || u.id] = u; return acc; }, {})
                : legacyUsers;

            system = {
                users: normalizedUsers,
                startups: legacyStartups,
                incubators: legacyIncubators,
                applications: legacyApplications,
                cohorts: legacyCohorts,
                mentorRequests: legacyRequests,
                sessions: legacySessions
            };

            saveSystem(system);
        }
    } catch (e) {
        console.error("Error reading system object:", e);
    }
    return system;
};

export const saveSystem = (system) => {
    localStorage.setItem(SYSTEM_KEY, JSON.stringify(system));
    window.dispatchEvent(new Event('storage'));
};
