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

const normalizeId = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
};

const toText = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    return String(value);
};

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
    if (value === null || value === undefined) return fallback;
    return Boolean(value);
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const toNullableIso = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const toIsoOrNow = (value) => {
    if (value) {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date.toISOString();
    }
    return new Date().toISOString();
};

const normalizeMilestone = (milestone) => {
    if (!milestone || typeof milestone !== 'object') return null;

    const nowIso = new Date().toISOString();
    const createdAt = milestone.createdAt ? toIsoOrNow(milestone.createdAt) : nowIso;
    const updatedAt = milestone.updatedAt ? toIsoOrNow(milestone.updatedAt) : createdAt;

    return {
        id: normalizeId(milestone.id),
        title: toText(milestone.title),
        description: toText(milestone.description),
        stage: toText(milestone.stage, 'Idea'),
        deadline: toText(milestone.deadline),
        status: toText(milestone.status, 'pending'),
        createdAt,
        updatedAt,
        completedAt: toNullableIso(milestone.completedAt)
    };
};

const normalizeActivityItem = (item) => {
    if (!item || typeof item !== 'object') return null;
    return {
        id: normalizeId(item.id),
        message: toText(item.message),
        type: toText(item.type, 'info'),
        timestamp: toIsoOrNow(item.timestamp || item.createdAt)
    };
};

const normalizeDocument = (doc) => {
    if (!doc || typeof doc !== 'object') return null;
    return {
        name: toText(doc.name),
        size: toText(doc.size),
        uploadedAt: doc.uploadedAt ? toIsoOrNow(doc.uploadedAt) : toIsoOrNow(doc.createdAt)
    };
};

export const normalizeStartup = (startup) => {
    if (!startup || typeof startup !== 'object') return null;

    const startupId = normalizeId(startup.startupId);
    if (!startupId) return null;

    const founderId = normalizeId(startup.founderId);
    const mentorAssigned = normalizeId(startup.mentorAssigned) || null;
    const incubatorAssigned = normalizeId(startup.incubatorAssigned) || null;
    const cohortId = normalizeId(startup.cohortId) || null;

    const coFounders = ensureArray(startup.coFounders).map(id => normalizeId(id)).filter(Boolean);
    const milestones = ensureArray(startup.milestones).map(normalizeMilestone).filter(Boolean);
    const activity = ensureArray(startup.activity).map(normalizeActivityItem).filter(Boolean).slice(0, 50);
    const documents = ensureArray(startup.documents).map(normalizeDocument).filter(Boolean);
    const focusAreas = normalizeStringArray(startup.focusAreas || startup.expertise);
    const targetAudience = normalizeStringArray(startup.targetAudience);
    const tractionHistory = ensureArray(startup.tractionHistory).filter(Boolean);
    const applications = ensureArray(startup.applications).filter(Boolean);
    const messages = ensureArray(startup.messages).filter(Boolean);

    const inferredTeamSize = coFounders.length + 1;
    const teamSize = Math.max(1, toNumber(startup.teamSize, inferredTeamSize));

    return {
        id: startupId,
        startupId,
        founderId,
        startupName: toText(startup.startupName || startup.name || 'My Startup'),
        sector: normalizeSector(startup.sector || 'General'),
        stage: toText(startup.stage || 'Idea'),
        oneLiner: toText(startup.oneLiner),
        solutionOverview: toText(startup.solutionOverview),
        problemStatement: toText(startup.problemStatement),
        targetAudience,
        marketInfo: toText(startup.marketInfo),
        growth: toText(startup.growth),
        revenue: toText(startup.revenue),
        traction: toText(startup.traction),
        tractionHistory,
        fundingGoal: toText(startup.fundingGoal),
        activeUsers: Math.max(0, toNumber(startup.activeUsers, 0)),
        demoLink: toText(startup.demoLink),
        pitchDeckLink: toText(startup.pitchDeckLink),
        website: toText(startup.website),
        location: toText(startup.location),
        commitment: toText(startup.commitment),
        equity: toText(startup.equity),
        skillGap: toText(startup.skillGap || startup.lookingFor),
        primarySkills: normalizeStringArray(startup.primarySkills),
        teamSize,
        coFounders,
        milestones,
        documents,
        focusAreas,
        activity,
        applications,
        messages,
        mentorAssigned,
        incubatorAssigned,
        cohortId,
        mentorshipStartDate: toNullableIso(startup.mentorshipStartDate),
        executionScore: Math.max(0, toNumber(startup.executionScore, 0)),
        profileCompletion: Math.max(0, toNumber(startup.profileCompletion, 0)),
        status: toText(startup.status, 'active'),
        createdAt: toIsoOrNow(startup.createdAt),
        updatedAt: toIsoOrNow(startup.updatedAt)
    };
};

export const normalizeApplication = (application) => {
    if (!application || typeof application !== 'object') return null;

    const id = normalizeId(application.id) || null;

    return {
        id,
        startupId: normalizeId(application.startupId),
        founderId: normalizeId(application.founderId),
        incubatorId: normalizeId(application.incubatorId),
        startupName: toText(application.startupName),
        sector: normalizeSector(application.sector || 'General'),
        teamSize: Math.max(1, toNumber(application.teamSize, 1)),
        status: toText(application.status, 'pending'),
        message: toText(application.message),
        appliedDate: toIsoOrNow(application.appliedDate || application.createdAt),
        createdAt: toIsoOrNow(application.createdAt || application.appliedDate),
        updatedAt: toNullableIso(application.updatedAt),
        cohortId: normalizeId(application.cohortId) || null
    };
};

export const normalizeMentorRequest = (request) => {
    if (!request || typeof request !== 'object') return null;
    const id = normalizeId(request.id) || null;

    return {
        id,
        startupId: normalizeId(request.startupId),
        founderId: normalizeId(request.founderId),
        mentorId: normalizeId(request.mentorId) || null,
        status: toText(request.status, 'pending'),
        message: toText(request.message),
        createdAt: toIsoOrNow(request.createdAt),
        updatedAt: toNullableIso(request.updatedAt)
    };
};

export const normalizeSession = (session) => {
    if (!session || typeof session !== 'object') return null;
    const id = normalizeId(session.id) || null;

    return {
        id,
        startupId: normalizeId(session.startupId),
        founderId: normalizeId(session.founderId),
        mentorId: normalizeId(session.mentorId) || null,
        incubatorId: normalizeId(session.incubatorId) || null,
        date: toText(session.date),
        time: toText(session.time),
        topic: toText(session.topic),
        meetingLink: toText(session.meetingLink),
        status: toText(session.status, 'pending_confirmation'),
        notes: toText(session.notes),
        actionItems: Array.isArray(session.actionItems)
            ? session.actionItems
            : normalizeStringArray(session.actionItems),
        createdAt: toIsoOrNow(session.createdAt),
        updatedAt: toNullableIso(session.updatedAt),
        completedAt: toNullableIso(session.completedAt)
    };
};

export const normalizeInvitation = (invitation) => {
    if (!invitation || typeof invitation !== 'object') return null;
    const id = normalizeId(invitation.id) || null;

    return {
        id,
        startupId: normalizeId(invitation.startupId),
        founderId: normalizeId(invitation.founderId) || null,
        invitedEmail: toText(invitation.invitedEmail).toLowerCase(),
        invitedUserId: normalizeId(invitation.invitedUserId) || null,
        status: toText(invitation.status, 'pending'),
        message: toText(invitation.message),
        createdAt: toIsoOrNow(invitation.createdAt),
        updatedAt: toNullableIso(invitation.updatedAt)
    };
};

export const normalizeJoinRequest = (request) => {
    if (!request || typeof request !== 'object') return null;
    const id = normalizeId(request.id) || null;

    return {
        id,
        startupId: normalizeId(request.startupId),
        founderId: normalizeId(request.founderId),
        requesterId: normalizeId(request.requesterId),
        requesterName: toText(request.requesterName),
        message: toText(request.message),
        status: toText(request.status, 'pending'),
        createdAt: toIsoOrNow(request.createdAt),
        updatedAt: toNullableIso(request.updatedAt)
    };
};

export const normalizeCohort = (cohort) => {
    if (!cohort || typeof cohort !== 'object') return null;
    const id = normalizeId(cohort.id) || null;

    return {
        id,
        incubatorId: normalizeId(cohort.incubatorId),
        name: toText(cohort.name),
        startDate: toText(cohort.startDate),
        endDate: toText(cohort.endDate),
        maxCapacity: Math.max(1, toNumber(cohort.maxCapacity, 20)),
        sectorFocus: Array.isArray(cohort.sectorFocus)
            ? cohort.sectorFocus
            : normalizeStringArray(cohort.sectorFocus),
        startupIds: ensureArray(cohort.startupIds).map(id => normalizeId(id)).filter(Boolean),
        status: toText(cohort.status, 'upcoming'),
        createdAt: toIsoOrNow(cohort.createdAt),
        updatedAt: toNullableIso(cohort.updatedAt)
    };
};

export const normalizeIncubator = (incubator) => {
    if (!incubator || typeof incubator !== 'object') return null;

    const incubatorId = normalizeId(incubator.incubatorId);
    if (!incubatorId) return null;

    return {
        id: incubatorId,
        uid: incubatorId,
        incubatorId,
        name: toText(incubator.name || incubator.incubatorName || 'Unnamed Incubator'),
        incubatorName: toText(incubator.incubatorName || incubator.name || 'Unnamed Incubator'),
        location: toText(incubator.location),
        description: toText(incubator.description),
        website: toText(incubator.website),
        sectorFocus: Array.isArray(incubator.sectorFocus)
            ? incubator.sectorFocus
            : normalizeStringArray(incubator.sectorFocus),
        stagePreference: Array.isArray(incubator.stagePreference)
            ? incubator.stagePreference
            : normalizeStringArray(incubator.stagePreference),
        fundingSupport: toBoolean(incubator.fundingSupport, false),
        batchSize: Math.max(1, toNumber(incubator.batchSize, 20)),
        mentors: ensureArray(incubator.mentors).map(id => normalizeId(id)).filter(Boolean),
        activeCohorts: ensureArray(incubator.activeCohorts).map(id => normalizeId(id)).filter(Boolean),
        successStats: {
            graduated: Math.max(0, toNumber(incubator.successStats?.graduated, 0)),
            raised: toText(incubator.successStats?.raised, '$0'),
            active: Math.max(0, toNumber(incubator.successStats?.active, 0))
        },
        verified: toBoolean(incubator.verified, false),
        createdAt: toIsoOrNow(incubator.createdAt)
    };
};

const normalizeMessage = (message) => {
    if (!message || typeof message !== 'object') return null;
    const id = normalizeId(message.id) || null;

    return {
        id,
        startupId: normalizeId(message.startupId),
        senderId: normalizeId(message.senderId),
        senderName: toText(message.senderName, 'User'),
        senderRole: toText(message.senderRole),
        receiverId: normalizeId(message.receiverId) || null,
        conversationType: toText(message.conversationType, 'startup'),
        message: toText(message.message),
        readBy: ensureArray(message.readBy).map(id => normalizeId(id)).filter(Boolean),
        createdAt: toIsoOrNow(message.createdAt),
        updatedAt: toNullableIso(message.updatedAt)
    };
};

const normalizeAnnouncement = (announcement) => {
    if (!announcement || typeof announcement !== 'object') return null;
    const id = normalizeId(announcement.id) || null;

    return {
        id,
        title: toText(announcement.title),
        message: toText(announcement.message),
        createdBy: normalizeId(announcement.createdBy),
        createdAt: toIsoOrNow(announcement.createdAt),
        updatedAt: toNullableIso(announcement.updatedAt)
    };
};

const normalizeReport = (report) => {
    if (!report || typeof report !== 'object') return null;
    const id = normalizeId(report.id) || null;

    return {
        id,
        targetType: toText(report.targetType),
        targetId: normalizeId(report.targetId),
        reason: toText(report.reason),
        status: toText(report.status, 'open'),
        reportedBy: normalizeId(report.reportedBy),
        createdAt: toIsoOrNow(report.createdAt),
        updatedAt: toNullableIso(report.updatedAt)
    };
};

const normalizeSystemCollections = (system) => {
    const source = system && typeof system === 'object' ? system : initializeSystem();
    const normalizedStartups = ensureArray(source.startups).map(normalizeStartup).filter(Boolean);
    const normalizedApplications = ensureArray(source.applications).map(normalizeApplication).filter(Boolean);
    const normalizedMentorRequests = ensureArray(source.mentorRequests).map(normalizeMentorRequest).filter(Boolean);
    const normalizedSessions = ensureArray(source.sessions).map(normalizeSession).filter(Boolean);
    const normalizedInvitations = ensureArray(source.invitations).map(normalizeInvitation).filter(Boolean);
    const normalizedJoinRequests = ensureArray(source.joinRequests).map(normalizeJoinRequest).filter(Boolean);
    const normalizedCohorts = ensureArray(source.cohorts).map(normalizeCohort).filter(Boolean);
    const normalizedIncubators = ensureArray(source.incubators).map(normalizeIncubator).filter(Boolean);
    const normalizedMessages = ensureArray(source.messages).map(normalizeMessage).filter(Boolean);
    const normalizedAnnouncements = ensureArray(source.announcements).map(normalizeAnnouncement).filter(Boolean);
    const normalizedReports = ensureArray(source.reports).map(normalizeReport).filter(Boolean);

    return {
        users: source.users && typeof source.users === 'object' ? source.users : {},
        startups: normalizedStartups,
        applications: normalizedApplications,
        mentorRequests: normalizedMentorRequests,
        sessions: normalizedSessions,
        invitations: normalizedInvitations,
        joinRequests: normalizedJoinRequests,
        cohorts: normalizedCohorts,
        incubators: normalizedIncubators,
        messages: normalizedMessages,
        announcements: normalizedAnnouncements,
        reports: normalizedReports,
        settings: source.settings && typeof source.settings === 'object' ? source.settings : {}
    };
};

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
    return map[normalized] || toText(value, 'General');
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
    if (!user || typeof user !== 'object') return null;

    const normalizedRole = normalizeRole(user.role);
    const inferredMentor = !normalizedRole && (
        Number(user?.portalData?.capacity) > 0 ||
        Array.isArray(user?.expertise) ||
        Array.isArray(user?.areas) ||
        typeof user?.areas === 'string' ||
        typeof user?.availability === 'object'
    );
    const role = inferredMentor ? 'mentor' : normalizedRole;

    const uid = normalizeId(user.uid);
    if (!uid) return null;
    const createdAt = toIsoOrNow(user.createdAt);
    const updatedAt = toNullableIso(user.updatedAt);
    const basePortalData = user.portalData && typeof user.portalData === 'object' ? user.portalData : {};
    const normalizedProfileData = user.profileData && typeof user.profileData === 'object' ? user.profileData : {};

    if (role !== 'mentor') {
        const fallbackRole = role || normalizeRole(user.role) || 'founder';
        const startupName = toText(basePortalData.startupName || normalizedProfileData.startupName);
        const sector = normalizeSector(basePortalData.sector || normalizedProfileData.sector || user.sector);
        const stage = toText(basePortalData.stage || normalizedProfileData.stage || user.stage || 'Idea');
        const teamSize = Math.max(1, toNumber(basePortalData.teamSize || normalizedProfileData.teamSize, 1));
        const primarySkills = normalizeStringArray(
            basePortalData.primarySkills || normalizedProfileData.primarySkills || user.primarySkills
        );

        const portalData = {
            startupName,
            sector,
            stage,
            teamSize,
            primarySkills,
            lookingFor: toText(basePortalData.lookingFor || normalizedProfileData.lookingFor),
            problemStatement: toText(basePortalData.problemStatement || normalizedProfileData.problemStatement),
            incubatorName: toText(basePortalData.incubatorName || normalizedProfileData.incubatorName),
            website: toText(basePortalData.website || normalizedProfileData.website),
            location: toText(basePortalData.location || normalizedProfileData.location),
            description: toText(basePortalData.description || normalizedProfileData.description),
            sectorFocus: normalizeStringArray(basePortalData.sectorFocus || normalizedProfileData.sectorFocus),
            stagePreference: toText(basePortalData.stagePreference || normalizedProfileData.stagePreference),
            fundingSupport: toBoolean(basePortalData.fundingSupport || normalizedProfileData.fundingSupport, false),
            batchSize: Math.max(1, toNumber(basePortalData.batchSize || normalizedProfileData.batchSize, 20))
        };

        return {
            uid,
            id: uid,
            role: fallbackRole,
            name: toText(user.name || user.fullName || basePortalData.fullName || user.email?.split('@')[0] || 'User'),
            email: toText(user.email),
            primarySkills,
            createdAt,
            updatedAt,
            portalData,
            profileData: portalData
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
    const capacity = Number(basePortalData.capacity) || Number(user.capacity) || 5;
    const availability = normalizeAvailability(user.availability || basePortalData.availability);
    const badge = toText(user.badge || basePortalData.badge || 'Verified');
    const name = toText(user.name || user.fullName || basePortalData.fullName || user.email?.split('@')[0] || 'Mentor');
    const email = toText(user.email);
    const bio = toText(user.bio || basePortalData.bio || 'Mentor profile initialized.');
    const company = toText(basePortalData.company || user.company);
    const currentRole = toText(basePortalData.currentRole || user.currentRole);
    const linkedin = toText(basePortalData.linkedin || user.linkedin);
    const responseRateRaw = Number(user.responseRate) || Number(basePortalData.responseRate);
    const responseRate = Number.isFinite(responseRateRaw) && responseRateRaw > 0 ? responseRateRaw : null;
    const mentorPortalData = {
        expertise,
        sector,
        bio,
        company,
        currentRole,
        capacity,
        availability,
        badge,
        linkedin
    };

    return {
        uid,
        id: uid,
        role: 'mentor',
        name,
        email,
        expertise,
        sector,
        bio,
        availability,
        badge,
        responseRate,
        company,
        currentRole,
        linkedin,
        capacity,
        createdAt,
        updatedAt,
        portalData: mentorPortalData,
        profileData: mentorPortalData
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
    const result = Array.isArray(incubators) ? incubators.slice() : [];
    const existingIds = new Set(result.map(inc => inc.incubatorId).filter(Boolean));

    Object.values(usersMap || {}).forEach((user) => {
        if (!user || (user.role || '').toLowerCase() !== 'incubator') return;
        const uid = user.uid;
        if (!uid || existingIds.has(uid)) return;

        const pd = user.portalData || {};
        result.push(normalizeIncubator({
            incubatorId: uid,
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
        }));
        existingIds.add(uid);
    });

    return result;
};

const mergeUsersWithProfileKeys = (usersMap) => {
    // In-memory version
    return Object.assign({}, usersMap || {});
};

export const getSystem = () => {
    // Initialize system store on first call
    if (!systemStore) {
        systemStore = initializeSystem();
    }
    // Return a deep copy to prevent direct mutations
    return JSON.parse(JSON.stringify(normalizeSystemCollections(systemStore)));
};

export const saveSystem = (system) => {
    // Update in-memory store
    if (!systemStore) {
        systemStore = initializeSystem();
    }
    
    const normalizedUsers = mergeUsersWithProfileKeys(normalizeUsersMap(system.users || {}));
    const normalizedCollections = normalizeSystemCollections(system);
    const normalizedSystem = {
        users: normalizedUsers,
        startups: normalizedCollections.startups,
        applications: normalizedCollections.applications,
        mentorRequests: normalizedCollections.mentorRequests,
        sessions: normalizedCollections.sessions,
        invitations: normalizedCollections.invitations,
        joinRequests: normalizedCollections.joinRequests,
        cohorts: normalizedCollections.cohorts,
        incubators: recoverIncubatorsFromUsers(normalizedCollections.incubators || [], normalizedUsers),
        messages: normalizedCollections.messages,
        announcements: normalizedCollections.announcements,
        reports: normalizedCollections.reports,
        settings: normalizedCollections.settings
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
