export const SYSTEM_KEY = 'vanguard_system';

const normalizeStringArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === 'string') {
        return value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }
    return [];
};

const normalizeSector = (value) => {
    const normalized = (value || '').toString().trim().toLowerCase();
    const map = {
        tech: 'Technology',
        technology: 'Technology',
        finance: 'Finance',
        fintech: 'Fintech',
        marketing: 'Marketing',
        operations: 'Operations',
        general: 'General',
        ai: 'AI/ML',
        'ai/ml': 'AI/ML',
        saas: 'SaaS',
        edtech: 'Edtech',
        healthtech: 'Healthtech',
        other: 'General'
    };

    if (!normalized) return 'General';
    return map[normalized] || value;
};

const normalizeAvailability = (value) => {
    if (typeof value === 'string') {
        return {
            status: value,
            days: [],
            workload: 0,
            sessionType: '1:1'
        };
    }

    return {
        status: value?.status || 'Available',
        days: Array.isArray(value?.days) ? value.days : [],
        workload: Number(value?.workload) || 0,
        sessionType: value?.sessionType || '1:1'
    };
};

const normalizeRole = (role) => {
    const normalized = (role || '').toString().trim().toLowerCase();
    if (!normalized) return '';
    if (normalized === 'cofounder') return 'co-founder';
    return normalized;
};

export const normalizeUserProfile = (user) => {
    if (!user || typeof user !== 'object') return user;

    const normalizedRole = normalizeRole(user.role);
    const inferredMentor = !normalizedRole && (
        Number(user?.portalData?.capacity) > 0 ||
        Array.isArray(user?.expertise) ||
        Array.isArray(user?.areas) ||
        typeof user?.areas === 'string' ||
        typeof user?.availability === 'object'
    );
    const role = inferredMentor ? 'mentor' : normalizedRole;
    if (role !== 'mentor') {
        return {
            ...user,
            uid: user.uid || user.id,
            role: role || user.role
        };
    }

    const rawExpertise = normalizeStringArray(
        user.expertise ||
        user.portalData?.expertise ||
        user.areas ||
        user.primarySkills
    );
    const expertise = rawExpertise.length > 0 ? rawExpertise : ['General Mentorship'];
    const sector = normalizeSector(
        user.sector ||
        user.portalData?.sector ||
        user.industry
    );
    const capacity = Number(user.portalData?.capacity) || Number(user.capacity) || 5;
    const availability = normalizeAvailability(user.availability || user.portalData?.availability);
    const badge = user.badge || user.portalData?.badge || 'Verified';

    return {
        ...user,
        uid: user.uid || user.id,
        role: 'mentor',
        name: user.name || user.fullName || user.portalData?.fullName || user.email?.split('@')[0] || 'Mentor',
        email: user.email || '',
        expertise,
        sector,
        bio: user.bio || user.portalData?.bio || 'Mentor profile initialized.',
        availability,
        badge,
        responseRate: Number(user.responseRate) || Number(user.portalData?.responseRate) || null,
        portalData: {
            ...user.portalData,
            expertise,
            sector,
            bio: user.bio || user.portalData?.bio || 'Mentor profile initialized.',
            company: user.portalData?.company || user.company || '',
            currentRole: user.portalData?.currentRole || user.currentRole || '',
            capacity,
            availability,
            badge
        }
    };
};

export const isValidMentorUser = (user) => {
    if (!user || normalizeRole(user.role) !== 'mentor') return false;
    if (!user.uid || !user.name || !user.email) return false;
    if (!Array.isArray(user.expertise) || user.expertise.length === 0) return false;
    if (!user.sector || !user.bio) return false;
    if (!user.availability || typeof user.availability !== 'object') return false;
    if (!user.portalData || typeof user.portalData !== 'object') return false;
    if (!user.portalData.sector) return false;
    if (!Number.isFinite(Number(user.portalData.capacity)) || Number(user.portalData.capacity) <= 0) return false;
    return true;
};

export const getMentorUsers = (system) => {
    return Object.values(system?.users || {})
        .map(normalizeUserProfile)
        .filter(isValidMentorUser);
};

const normalizeUsersMap = (users) => {
    return Object.values(users || {}).reduce((accumulator, user) => {
        const normalized = normalizeUserProfile(user);
        if (normalized?.uid) {
            accumulator[normalized.uid] = normalized;
        }
        return accumulator;
    }, {});
};

const recoverIncubatorsFromUsers = (incubators, usersMap) => {
    const result = Array.isArray(incubators) ? [...incubators] : [];
    const existingIds = new Set(result.map(inc => inc.id || inc.uid).filter(Boolean));

    Object.values(usersMap || {}).forEach((user) => {
        if (!user || (user.role || '').toLowerCase() !== 'incubator') return;
        const uid = user.uid || user.id;
        if (!uid || existingIds.has(uid)) return;

        const pd = user.portalData || {};
        result.push({
            id: uid,
            uid,
            name: pd.incubatorName || user.name || user.incubatorName || 'Unnamed Incubator',
            incubatorName: pd.incubatorName || user.name || user.incubatorName || 'Unnamed Incubator',
            location: pd.location || user.location || '',
            description: pd.description || user.description || '',
            website: pd.website || user.website || '',
            sectorFocus: Array.isArray(pd.sectorFocus) ? pd.sectorFocus
                : (Array.isArray(user.sectorFocus) ? user.sectorFocus : []),
            stagePreference: pd.stagePreference
                ? [pd.stagePreference]
                : (Array.isArray(user.stagePreference) ? user.stagePreference : []),
            fundingSupport: Boolean(pd.fundingSupport),
            batchSize: pd.batchSize || 20,
            verified: Boolean(user.verified),
            mentors: Array.isArray(user.mentors) ? user.mentors : [],
            successStats: user.successStats || { graduated: 0, raised: '$0', active: 0 },
            createdAt: user.createdAt || new Date().toISOString()
        });
        existingIds.add(uid);
    });

    return result;
};

const mergeUsersWithProfileKeys = (usersMap) => {
    const merged = { ...(usersMap || {}) };

    try {
        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith('profile_')) continue;

            const raw = localStorage.getItem(key);
            if (!raw) continue;

            const parsed = JSON.parse(raw);
            const normalized = normalizeUserProfile(parsed);

            if (normalized?.uid) {
                merged[normalized.uid] = normalized;
            }
        }
    } catch (error) {
        console.error('Error merging profile keys into system users:', error);
    }

    return merged;
};

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
        messages: [],
        announcements: [],
        reports: [],
        settings: {}
    };

    try {
        const stored = localStorage.getItem(SYSTEM_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // AUTO-HEALING: Ensure all required keys exist
            const parsedUsers = mergeUsersWithProfileKeys(normalizeUsersMap(parsed.users || {}));
            system = {
                ...system,
                ...parsed,
                users: parsedUsers,
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
                incubators: recoverIncubatorsFromUsers(parsed.incubators || [], parsedUsers),
                applications: parsed.applications || [],
                cohorts: parsed.cohorts || [],
                mentorRequests: parsed.mentorRequests || [],
                sessions: parsed.sessions || [],
                invitations: parsed.invitations || [],
                joinRequests: parsed.joinRequests || [],
                messages: parsed.messages || [],
                announcements: parsed.announcements || [],
                reports: parsed.reports || [],
                settings: parsed.settings || {}
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

            const legacyMergedUsers = mergeUsersWithProfileKeys(normalizeUsersMap(normalizedUsers));
            system = {
                users: legacyMergedUsers,
                startups: legacyStartups,
                incubators: recoverIncubatorsFromUsers(legacyIncubators, legacyMergedUsers),
                applications: legacyApplications,
                cohorts: legacyCohorts,
                mentorRequests: legacyRequests,
                sessions: legacySessions,
                announcements: [],
                reports: [],
                settings: {}
            };

            saveSystem(system);
        }
    } catch (e) {
        console.error("Error reading system object:", e);
    }
    return system;
};

export const saveSystem = (system) => {
    const normalizedUsers = mergeUsersWithProfileKeys(normalizeUsersMap(system.users || {}));
    const normalizedSystem = {
        ...system,
        users: normalizedUsers,
        incubators: recoverIncubatorsFromUsers(system.incubators || [], normalizedUsers)
    };
    localStorage.setItem(SYSTEM_KEY, JSON.stringify(normalizedSystem));
    window.dispatchEvent(new Event('storage'));
};
