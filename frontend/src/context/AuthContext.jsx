import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import {
    getSystem,
    normalizeIncubator,
    normalizeStartup,
    normalizeUserProfile,
    saveSystem
} from '../utils/system';
import api from '../../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@vanguard.com';

const ROLE_PATHS = {
    founder: '/founder',
    'co-founder': '/cofounder',
    mentor: '/mentor',
    incubator: '/incubator',
    admin: '/admin'
};

// Helper: get user from system by uid
const getUserProfile = (uid) => {
    const system = getSystem();
    if (system.users[uid]) {
        return normalizeUserProfile(system.users[uid]);
    }
    return null;
};

// Helper: save user to system
const saveUserProfile = (uid, data) => {
    const normalizedData = normalizeUserProfile({ ...data, uid });
    const system = getSystem();
    system.users[uid] = normalizedData;
    saveSystem(system);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const processingAuthRef = useRef(false);
    const navigate = useNavigate();

    // Initialize in-memory system store on mount.
    useEffect(() => {
        getSystem();
    }, []);

    // ─── AUTH STATE LISTENER ──────────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Admin Rule: Case-insensitive check against .env or default
                if (firebaseUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                    const adminUser = { uid: firebaseUser.uid, email: firebaseUser.email, role: 'admin' };
                    setUser(adminUser);
                    setLoading(false);
                    return;
                }

                // Regular User Check
                const userData = getUserProfile(firebaseUser.uid);

                if (userData) {
                    setUser(userData);

                    // Redirect from auth pages to dashboard if already logged in
                    const authPaths = ['/', '/auth/login', '/auth/signup', '/auth/role-selection'];
                    if (authPaths.includes(window.location.pathname)) {
                        navigate(ROLE_PATHS[userData.role] || '/founder');
                    }
                } else {
                    // Critical: if Firebase user exists but NO local profile found
                    // We only sign out if we're not currently in the middle of a signup/login flow
                    const isNewUser = processingAuthRef.current;
                    if (!isNewUser) {
                        signOut(auth);
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ─── SIGNUP ───────────────────────────────────────────────────────────────
    const signup = async (email, password, role, profileData) => {
        processingAuthRef.current = true;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const normalizedRole = role.toLowerCase() === 'cofounder' ? 'co-founder' : role.toLowerCase();
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
            if (normalizedRole === 'co-founder' && profileData.onboardingType === 'create') {
                finalRole = 'founder';
            }

            // Extract core info
            const name = profileData.fullName || profileData.incubatorName || profileData.name || email.split('@')[0];

            // Role-specific Portal Data Initialization
            let portalData = {};

            if (['founder', 'co-founder'].includes(normalizedRole)) {
                portalData = {
                    startupName: profileData.startupName || 'My Startup',
                    sector: profileData.sector || 'General',
                    stage: profileData.stage || 'Idea',
                    teamSize: Number(profileData.teamSize) || 1,
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
                            ? profileData.primarySkills.split(',').map(s => s.trim()).filter(Boolean)
                            : []),
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
                        id: null,
                        message: 'Venture profile initialized.',
                        type: 'info',
                        timestamp: new Date().toISOString()
                    }],
                    updatedAt: new Date().toISOString(),
                    status: 'active'
                };
                system.startups.push(normalizeStartup(newStartup));
            }

            // Relational: Initialize Incubator record in system.incubators so founders can discover it.
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
                    system.incubators = [...(system.incubators || []), normalizeIncubator(incubatorEntry)];
                }
            }

            // Case A: Manual invite linking (was handled partially by pre-signup but check again if they provided code)
            if (normalizedRole === 'co-founder' && profileData.onboardingType === 'invite') {
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

            // Sync with backend
            try {
                await api.post('/v1/users', {
                    id: newUser.uid,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    portal_data: newUser.portalData || {},
                    profile_data: newUser
                });
            } catch (backendError) {
                console.warn('Backend sync failed, continuing with local profile', backendError);
            }

            setUser(newUser);
            navigate(ROLE_PATHS[finalRole] || '/founder');
            return newUser;
        } finally {
            processingAuthRef.current = false;
        }
    };

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    const login = async (email, password, selectedRole = 'founder') => {
        processingAuthRef.current = true;
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
                    role: selectedRole.toLowerCase() === 'cofounder' ? 'co-founder' : selectedRole.toLowerCase(),
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

            // Sync with backend
            try {
                await api.post('/v1/users', {
                    id: profile.uid,
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    portal_data: profile.portalData,
                    profile_data: profile
                });
            } catch (backendError) {
                console.warn('Backend sync failed, continuing with local profile', backendError);
            }

            // Keep profile role as source of truth even when selected role differs in login form.

            setUser(profile);

            const targetPath = ROLE_PATHS[profile.role] || '/founder';
            navigate(targetPath);

            return profile;
        } finally {
            processingAuthRef.current = false;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
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
