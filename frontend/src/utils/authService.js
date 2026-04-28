import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import {
    getSystem,
    normalizeIncubator,
    normalizeStartup,
    normalizeUserProfile,
    saveSystem
} from './system';
import api from '../../services/api';

const nowIso = () => new Date().toISOString();

export const getUserProfile = (uid) => {
    const system = getSystem();
    return system.users[uid] ? normalizeUserProfile(system.users[uid]) : null;
};

export const saveUserProfile = (uid, data) => {
    const normalizedData = normalizeUserProfile({ ...data, uid });
    const system = getSystem();
    system.users[uid] = normalizedData;
    saveSystem(system);
};

export const signupUser = async ({ auth, email, password, role, profileData }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const normalizedRole = role.toLowerCase() === 'cofounder' ? 'co-founder' : role.toLowerCase();
    const system = getSystem();

    const existingInvitation = (system.invitations || []).find((inv) =>
        inv.invitedEmail.toLowerCase() === email.toLowerCase() && inv.status === 'pending'
    );

    if (existingInvitation) {
        existingInvitation.status = 'accepted';
        existingInvitation.invitedUserId = firebaseUser.uid;

        const startup = (system.startups || []).find((s) => s.startupId === existingInvitation.startupId);
        if (startup) {
            startup.coFounders = startup.coFounders || [];
            if (!startup.coFounders.includes(firebaseUser.uid)) startup.coFounders.push(firebaseUser.uid);
        }
    }

    let finalRole = normalizedRole;
    if (normalizedRole === 'co-founder' && profileData.onboardingType === 'create') {
        finalRole = 'founder';
    }

    const name = profileData.fullName || profileData.incubatorName || profileData.name || email.split('@')[0];

    let portalData = {};
    if (['founder', 'co-founder'].includes(normalizedRole)) {
        portalData = {
            startupName: profileData.startupName || 'My Startup',
            sector: profileData.sector || 'General',
            stage: profileData.stage || 'Idea',
            teamSize: Number(profileData.teamSize) || 1,
            lookingFor: profileData.lookingFor || '',
            problemStatement: profileData.problemStatement || ''
        };
    } else if (normalizedRole === 'mentor') {
        const expertise = Array.isArray(profileData.expertise)
            ? profileData.expertise
            : Array.isArray(profileData.areas)
                ? profileData.areas
                : (typeof profileData.areas === 'string' ? profileData.areas : '')
                    .split(',').map((item) => item.trim()).filter(Boolean);

        portalData = {
            expertise,
            sector: profileData.sector || profileData.industry || 'General',
            bio: profileData.bio || '',
            linkedin: profileData.linkedin || '',
            company: profileData.company || '',
            currentRole: profileData.currentRole || '',
            capacity: Number(profileData.capacity) || 5,
            availability: { status: 'Available', days: [], workload: 0, sessionType: '1:1' },
            badge: profileData.badge || 'Verified'
        };
    } else if (normalizedRole === 'incubator') {
        portalData = {
            incubatorName: profileData.incubatorName || name,
            website: profileData.website || '',
            location: profileData.location || '',
            description: profileData.description || '',
            sectorFocus: Array.isArray(profileData.sectorFocus) ? profileData.sectorFocus : [],
            stagePreference: profileData.stagePref || 'Early Stage',
            fundingSupport: profileData.funding === 'yes',
            batchSize: parseInt(profileData.cohortSize, 10) || 20
        };
    }

    const baseUser = {
        uid: firebaseUser.uid,
        email,
        role: finalRole,
        name,
        portalData,
        createdAt: nowIso(),
        ...profileData
    };

    const newUser = finalRole === 'mentor'
        ? normalizeUserProfile({
            ...baseUser,
            expertise: portalData.expertise,
            sector: portalData.sector,
            bio: portalData.bio,
            availability: portalData.availability,
            badge: portalData.badge
        })
        : baseUser;

    saveUserProfile(firebaseUser.uid, newUser);

    // Sync user with backend database
    try {
        await api.post('/v1/users', {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            portal_data: newUser.portalData,
            profile_data: profileData
        });

        // Also create incubator record if role is incubator
        if (normalizedRole === 'incubator') {
            await api.post('/v1/incubators', {
                id: firebaseUser.uid,
                name: portalData.incubatorName || name,
                incubatorName: portalData.incubatorName || name,
                location: portalData.location || '',
                description: portalData.description || '',
                website: portalData.website || '',
                stagePreference: portalData.stagePreference ? [portalData.stagePreference] : [],
                fundingSupport: Boolean(portalData.fundingSupport),
                batchSize: portalData.batchSize || 20,
                ownerUserId: firebaseUser.uid
            });
        }
    } catch (err) {
        console.error('Failed to sync user or incubator to database:', err);
    }

    if (finalRole === 'founder') {
        const capitalizeStage = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Idea');
        const startupId = firebaseUser.uid || null;

        const newStartup = {
            startupId,
            id: startupId,
            founderId: firebaseUser.uid,
            startupName: profileData.startupName || 'My Startup',
            sector: profileData.sector || 'General',
            stage: capitalizeStage(profileData.stage),
            oneLiner: '',
            traction: '',
            fundingGoal: '',
            teamSize: Number(profileData.teamSize) || 1,
            milestones: [],
            focusAreas: [],
            problemStatement: profileData.problemStatement || '',
            targetAudience: [],
            skillGap: profileData.lookingFor || '',
            primarySkills: Array.isArray(profileData.primarySkills)
                ? profileData.primarySkills.filter(Boolean)
                : (typeof profileData.primarySkills === 'string'
                    ? profileData.primarySkills.split(',').map((s) => s.trim()).filter(Boolean)
                    : []),
            location: profileData.location || '',
            commitment: profileData.commitment || '',
            linkedin: profileData.linkedin || '',
            equity: profileData.equity || '',
            website: '',
            executionScore: 0,
            createdAt: nowIso(),
            mentorAssigned: null,
            applications: [],
            activity: [{ id: null, message: 'Venture profile initialized.', type: 'info', timestamp: nowIso() }],
            updatedAt: nowIso(),
            status: 'active'
        };

        // Persist to Backend API
        import('./startupService').then(({ createStartupRecord }) => {
            createStartupRecord({ uid: firebaseUser.uid, role: 'founder' }, newStartup);
        });

        system.startups.push(normalizeStartup(newStartup));
    }


    if (normalizedRole === 'incubator') {
        const incubatorEntry = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            incubatorId: firebaseUser.uid,
            name: portalData.incubatorName || name,
            incubatorName: portalData.incubatorName || name,
            location: portalData.location || '',
            description: portalData.description || '',
            website: portalData.website || '',
            sectorFocus: Array.isArray(portalData.sectorFocus) ? portalData.sectorFocus : [],
            stagePreference: portalData.stagePreference ? [portalData.stagePreference] : [],
            fundingSupport: Boolean(portalData.fundingSupport),
            batchSize: portalData.batchSize || 20,
            verified: false,
            mentors: [],
            successStats: { graduated: 0, raised: '$0', active: 0 },
            createdAt: nowIso()
        };

        const alreadyExists = (system.incubators || []).some((inc) => (inc.id || inc.uid) === firebaseUser.uid);
        if (!alreadyExists) {
            system.incubators = [...(system.incubators || []), normalizeIncubator(incubatorEntry)];
        }
    }

    if (normalizedRole === 'co-founder' && profileData.onboardingType === 'invite') {
        const invitation = (system.invitations || []).find((inv) =>
            (inv.id === profileData.inviteCode || inv.startupId === profileData.inviteCode) && inv.status === 'pending'
        );

        if (invitation) {
            invitation.status = 'accepted';
            invitation.invitedUserId = firebaseUser.uid;
            const startup = (system.startups || []).find((s) => s.startupId === invitation.startupId);
            if (startup) {
                startup.coFounders = startup.coFounders || [];
                if (!startup.coFounders.includes(firebaseUser.uid)) startup.coFounders.push(firebaseUser.uid);
            }
        } else if (profileData.inviteCode) {
            const startupByEmail = (system.startups || []).find((s) => {
                const founder = system.users[s.founderId];
                return founder && founder.email.toLowerCase() === profileData.inviteCode.toLowerCase();
            });
            if (startupByEmail) {
                startupByEmail.coFounders = startupByEmail.coFounders || [];
                if (!startupByEmail.coFounders.includes(firebaseUser.uid)) startupByEmail.coFounders.push(firebaseUser.uid);
            }
        }
    }

    saveSystem(system);
    return { firebaseUser, user: newUser, role: finalRole };
};

export const loginUser = async ({ auth, email, password, selectedRole }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    let profile = getUserProfile(firebaseUser.uid);

    if (!profile) {
        profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email,
            role: selectedRole.toLowerCase() === 'cofounder' ? 'co-founder' : selectedRole.toLowerCase(),
            portalData: {},
            createdAt: nowIso()
        };

        if (profile.role === 'incubator') {
            profile.portalData = { incubatorName: profile.name, successStats: { graduated: 0, raised: '$0', active: 0 } };
        } else if (profile.role === 'mentor') {
            profile = normalizeUserProfile({
                ...profile,
                expertise: ['General Mentorship'],
                sector: 'General',
                bio: 'Mentor profile initialized.',
                availability: { status: 'Available', days: [], workload: 0, sessionType: '1:1' },
                portalData: {
                    expertise: ['General Mentorship'],
                    sector: 'General',
                    bio: 'Mentor profile initialized.',
                    company: '',
                    currentRole: '',
                    capacity: 5,
                    availability: { status: 'Available', days: [], workload: 0, sessionType: '1:1' }
                }
            });
        }

        saveUserProfile(firebaseUser.uid, profile);
    }

    return profile;
};

export const logoutUser = async (auth) => {
    await signOut(auth);
};

export const updateUserProfile = async (currentUser, updates) => {
    if (!currentUser) return currentUser;
    const updated = { ...currentUser, ...updates };
    saveUserProfile(currentUser.uid, updated);
    return updated;
};