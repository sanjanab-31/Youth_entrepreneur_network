import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getSystem, normalizeUserProfile, saveSystem } from '../utils/system';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// legacy keys for reference in migration logic inside system.js
const USER_KEY = 'vanguard_users';
const STARTUPS_KEY = 'vanguard_startups';
const MENTOR_REQUESTS_KEY = 'vanguard_mentorRequests';
const SESSIONS_KEY = 'vanguard_sessions';
const APPLICATIONS_KEY = 'vanguard_applications';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@vanguard.com';

const ROLE_PATHS = {
    founder: '/founder',
    'co-founder': '/cofounder',
    cofounder: '/cofounder',
    mentor: '/mentor',
    incubator: '/incubator',
    admin: '/admin'
};

// Helper: get user from system by uid
const getUserProfile = (uid) => {
    // Priority 1: Direct Key (Profile-specific single source)
    const profileKey = `profile_${uid}`;
    let profile = localStorage.getItem(profileKey);

    if (profile) {
        try {
            const normalized = normalizeUserProfile(JSON.parse(profile));

            // Auto-heal: ensure centralized users map always contains this profile.
            const system = getSystem();
            if (!system.users[uid]) {
                system.users[uid] = normalized;
                saveSystem(system);
            }

            return normalized;
        } catch (e) {
            console.error('Error parsing profile for:', uid, e);
        }
    }

    // Priority 2: System Object
    const system = getSystem();
    if (system.users[uid]) {
        // Standardize: ensure uid profile exists
        const normalized = normalizeUserProfile(system.users[uid]);
        localStorage.setItem(profileKey, JSON.stringify(normalized));
        return normalized;
    }

    // Migration from legacy registry if still exists
    let legacyRaw = localStorage.getItem(USER_KEY);
    if (legacyRaw) {
        try {
            const users = JSON.parse(legacyRaw);
            const user = Array.isArray(users) ? users.find(u => u.uid === uid || u.id === uid) : users[uid];
            if (user) {
                const normalized = normalizeUserProfile(user);
                localStorage.setItem(profileKey, JSON.stringify(normalized));

                // Auto-heal from legacy: persist into centralized users map.
                const system = getSystem();
                system.users[uid] = normalized;
                saveSystem(system);

                return normalized;
            }
        } catch (e) {
            console.warn('Failed to parse legacy users during profile migration', e);
        }
    }

    return null;
};

// Helper: save user to system
const saveUserProfile = (uid, data) => {
    const normalizedData = normalizeUserProfile({ ...data, uid });
    // 1. Save to direct key
    localStorage.setItem(`profile_${uid}`, JSON.stringify(normalizedData));

    // 2. Save to centralized system
    const system = getSystem();
    system.users[uid] = normalizedData;
    saveSystem(system);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize/Migrate on mount
    useEffect(() => {
        getSystem(); // Triggers migration if needed
    }, []);

    // ─── AUTH STATE LISTENER ──────────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Admin Rule: Case-insensitive check against .env or default
                if (firebaseUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                    const adminUser = { uid: firebaseUser.uid, email: firebaseUser.email, role: 'admin' };
                    setUser(adminUser);
                    localStorage.setItem('vanguard_session_currentUser', JSON.stringify(adminUser));
                    setLoading(false);
                    return;
                }

                // Regular User Check
                const userData = getUserProfile(firebaseUser.uid);

                if (userData) {
                    setUser(userData);
                    localStorage.setItem('vanguard_session_currentUser', JSON.stringify(userData));

                    // Redirect from auth pages to dashboard if already logged in
                    const authPaths = ['/', '/auth/login', '/auth/signup', '/auth/role-selection'];
                    if (authPaths.includes(window.location.pathname)) {
                        navigate(ROLE_PATHS[userData.role] || '/founder');
                    }
                } else {
                    // Critical: if Firebase user exists but NO local profile found
                    // We only sign out if we're not currently in the middle of a signup/login flow
                    const isNewUser = sessionStorage.getItem('vanguard_processing_auth') === 'true';
                    if (!isNewUser) {
                        signOut(auth);
                        setUser(null);
                        localStorage.removeItem('vanguard_session_currentUser');
                    }
                }
            } else {
                setUser(null);
                localStorage.removeItem('vanguard_session_currentUser');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ─── SIGNUP ───────────────────────────────────────────────────────────────
    const signup = async (email, password, role, profileData) => {
        sessionStorage.setItem('vanguard_processing_auth', 'true');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const normalizedRole = role.toLowerCase();
            const system = getSystem();

            // ─── Pre-Signup Invitation Handling ───────────────────
            let invitedStartupId = null;
            const existingInvitation = system.invitations.find(inv =>
                inv.invitedEmail.toLowerCase() === email.toLowerCase() &&
                inv.status === 'pending'
            );

            if (existingInvitation) {
                invitedStartupId = existingInvitation.startupId;
                existingInvitation.status = 'accepted';
                existingInvitation.invitedUserId = firebaseUser.uid;

                // Attach to startup
                const startup = system.startups.find(s => s.startupId === invitedStartupId);
                if (startup) {
                    startup.coFounders = startup.coFounders || [];
                    if (!startup.coFounders.includes(firebaseUser.uid)) {
                        startup.coFounders.push(firebaseUser.uid);
                    }
                }
                saveSystem(system);
            }
            // ──────────────────────────────────────────────────────

            // Case C: Co-Founder wants to create startup -> Promote to Founder
            let finalRole = normalizedRole;
            if (['co-founder', 'cofounder'].includes(normalizedRole) && profileData.onboardingType === 'create') {
                finalRole = 'founder';
            }

            // Extract core info
            const name = profileData.fullName || profileData.incubatorName || profileData.name || email.split('@')[0];

            // Role-specific Portal Data Initialization
            let portalData = {};

            if (['founder', 'co-founder', 'cofounder'].includes(normalizedRole)) {
                portalData = {
                    startupName: profileData.startupName || 'My Startup',
                    sector: profileData.sector || 'General',
                    stage: profileData.stage || 'Idea',
                    teamSize: parseInt(profileData.teamSize) || 1,
                    lookingFor: profileData.lookingFor || '',
                    problemStatement: profileData.problemStatement || '',
                };
            } else if (normalizedRole === 'mentor') {
                const expertise = Array.isArray(profileData.expertise)
                    ? profileData.expertise
                    : Array.isArray(profileData.areas)
                        ? profileData.areas
                        : (typeof profileData.areas === 'string' ? profileData.areas : '')
                            .split(',')
                            .map(item => item.trim())
                            .filter(Boolean);

                const availability = {
                    status: 'Available',
                    days: [],
                    workload: 0,
                    sessionType: '1:1'
                };

                portalData = {
                    expertise,
                    sector: profileData.sector || profileData.industry || 'General',
                    bio: profileData.bio || '',
                    linkedin: profileData.linkedin || '',
                    company: profileData.company || '',
                    currentRole: profileData.currentRole || '',
                    capacity: Number(profileData.capacity) || 5,
                    availability,
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
                    batchSize: parseInt(profileData.cohortSize) || 20,
                };
            }

            const baseUser = {
                uid: firebaseUser.uid,
                email,
                role: finalRole,
                name,
                portalData,
                createdAt: new Date().toISOString(),
                ...profileData, // Keep flat props for compatibility with some legacy views if needed
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

            // Relational: Initialize Startup record
            // RULE: Auto-create only for Founder (including promoted co-founders)
            if (finalRole === 'founder') {
                const capitalizeStage = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Idea';

                const newStartup = {
                    startupId: `ST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    founderId: firebaseUser.uid,
                    startupName: profileData.startupName || 'My Startup',
                    sector: profileData.sector || 'General',
                    stage: capitalizeStage(profileData.stage),
                    oneLiner: '',
                    traction: '',
                    fundingGoal: '',
                    teamSize: parseInt(profileData.teamSize) || 1,
                    milestones: [],
                    focusAreas: [],
                    problemStatement: profileData.problemStatement || '',
                    targetAudience: [],
                    skillGap: profileData.lookingFor || '',
                    primarySkills: profileData.primarySkills || '',
                    location: profileData.location || '',
                    commitment: profileData.commitment || '',
                    linkedin: profileData.linkedin || '',
                    equity: profileData.equity || '',
                    website: '',
                    executionScore: 0,
                    createdAt: new Date().toISOString(),
                    mentorAssigned: null,
                    applications: [],
                    activity: [{
                        id: `act_${Date.now()}`,
                        message: 'Venture profile initialized.',
                        type: 'info',
                        timestamp: new Date().toISOString()
                    }],
                    updatedAt: new Date().toISOString(),
                    status: 'active'
                };
                system.startups.push(newStartup);
            }

            // Relational: Initialize Incubator record in system.incubators so founders can discover it.
            if (normalizedRole === 'incubator') {
                const incubatorEntry = {
                    id: firebaseUser.uid,
                    uid: firebaseUser.uid,
                    name: portalData.incubatorName || name,
                    incubatorName: portalData.incubatorName || name,
                    location: portalData.location || '',
                    description: portalData.description || '',
                    website: portalData.website || '',
                    sectorFocus: Array.isArray(portalData.sectorFocus) ? portalData.sectorFocus : [],
                    stagePreference: portalData.stagePreference
                        ? [portalData.stagePreference]
                        : [],
                    fundingSupport: Boolean(portalData.fundingSupport),
                    batchSize: portalData.batchSize || 20,
                    verified: false,
                    mentors: [],
                    successStats: { graduated: 0, raised: '$0', active: 0 },
                    createdAt: new Date().toISOString()
                };
                const alreadyExists = (system.incubators || []).some(
                    inc => (inc.id || inc.uid) === firebaseUser.uid
                );
                if (!alreadyExists) {
                    system.incubators = [...(system.incubators || []), incubatorEntry];
                }
            }

            // Case A: Manual invite linking (was handled partially by pre-signup but check again if they provided code)
            if (['co-founder', 'cofounder'].includes(normalizedRole) && profileData.onboardingType === 'invite') {
                const invitation = system.invitations.find(inv =>
                    (inv.id === profileData.inviteCode || inv.startupId === profileData.inviteCode) &&
                    inv.status === 'pending'
                );

                if (invitation) {
                    invitation.status = 'accepted';
                    invitation.invitedUserId = firebaseUser.uid;
                    const startup = system.startups.find(s => s.startupId === invitation.startupId);
                    if (startup) {
                        startup.coFounders = startup.coFounders || [];
                        if (!startup.coFounders.includes(firebaseUser.uid)) {
                            startup.coFounders.push(firebaseUser.uid);
                        }
                    }
                } else if (profileData.inviteCode) {
                    // Search by founder email if invite code didn't match
                    const startupByEmail = system.startups.find(s => {
                        const founder = system.users[s.founderId];
                        return founder && founder.email.toLowerCase() === profileData.inviteCode.toLowerCase();
                    });

                    if (startupByEmail) {
                        startupByEmail.coFounders = startupByEmail.coFounders || [];
                        if (!startupByEmail.coFounders.includes(firebaseUser.uid)) {
                            startupByEmail.coFounders.push(firebaseUser.uid);
                        }
                    }
                }
            }

            saveSystem(system);
            setUser(newUser);
            navigate(ROLE_PATHS[finalRole] || '/founder');
            return newUser;
        } finally {
            sessionStorage.removeItem('vanguard_processing_auth');
        }
    };

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    const login = async (email, password, selectedRole = 'founder') => {
        sessionStorage.setItem('vanguard_processing_auth', 'true');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            let profile = getUserProfile(firebaseUser.uid);

            // SPECIAL: Auto-Healing if profile is missing
            if (!profile) {
                // Create a minimal profile to allow access
                profile = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || email.split('@')[0],
                    email: firebaseUser.email,
                    role: selectedRole.toLowerCase(),
                    portalData: {}, // Generic empty dashboard
                    createdAt: new Date().toISOString()
                };

                // Add role-specific empty portal data if possible
                if (profile.role === 'incubator') {
                    profile.portalData = {
                        incubatorName: profile.name,
                        successStats: { graduated: 0, raised: '$0', active: 0 }
                    };
                } else if (profile.role === 'mentor') {
                    profile = normalizeUserProfile({
                        ...profile,
                        expertise: ['General Mentorship'],
                        sector: 'General',
                        bio: 'Mentor profile initialized.',
                        availability: {
                            status: 'Available',
                            days: [],
                            workload: 0,
                            sessionType: '1:1'
                        },
                        portalData: {
                            expertise: ['General Mentorship'],
                            sector: 'General',
                            bio: 'Mentor profile initialized.',
                            company: '',
                            currentRole: '',
                            capacity: 5,
                            availability: {
                                status: 'Available',
                                days: [],
                                workload: 0,
                                sessionType: '1:1'
                            }
                        }
                    });
                }

                saveUserProfile(firebaseUser.uid, profile);
            }

            // Keep profile role as source of truth even when selected role differs in login form.

            setUser(profile);
            localStorage.setItem('vanguard_session_currentUser', JSON.stringify(profile));

            const targetPath = ROLE_PATHS[profile.role] || '/founder';
            navigate(targetPath);

            return profile;
        } finally {
            sessionStorage.removeItem('vanguard_processing_auth');
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem('vanguard_session_currentUser');
        navigate('/');
    };

    // ─── UPDATE PROFILE ───────────────────────────────────────────────────────
    const updateProfile = (updates) => {
        if (!user) return;
        const updated = { ...user, ...updates };
        saveUserProfile(user.uid, updated);
        setUser(updated);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
