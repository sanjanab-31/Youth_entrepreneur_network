// In-memory system store
let systemStore = null;
const listeners = new Set();

const initializeSystem = () => ({
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
});

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
    // In-memory version
    return { ...(usersMap || {}) };
};

export const getSystem = () => {
    // Initialize system store on first call
    if (!systemStore) {
        systemStore = initializeSystem();
    }
    // Return a deep copy to prevent direct mutations
    return JSON.parse(JSON.stringify(systemStore));
};

export const saveSystem = (system) => {
    // Update in-memory store
    if (!systemStore) {
        systemStore = initializeSystem();
    }
    
    const normalizedUsers = mergeUsersWithProfileKeys(normalizeUsersMap(system.users || {}));
    const normalizedSystem = {
        ...system,
        users: normalizedUsers,
        incubators: recoverIncubatorsFromUsers(system.incubators || [], normalizedUsers)
    };
    
    systemStore = normalizedSystem;
    
    // Notify all listeners of the change
    listeners.forEach(callback => callback(normalizedSystem));
    
    // Dispatch storage event for backward compatibility with existing event listeners
    window.dispatchEvent(new Event('storage'));
};

// Subscribe to system changes (for React components to listen for updates)
export const subscribeToSystem = (callback) => {
    listeners.add(callback);
    // Return unsubscribe function
    return () => listeners.delete(callback);
};
