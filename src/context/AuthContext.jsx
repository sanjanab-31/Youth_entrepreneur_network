import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getSystem, saveSystem } from '../utils/system';

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
            return JSON.parse(profile);
        } catch (e) {
            console.error('Error parsing profile for:', uid, e);
        }
    }

    // Priority 2: System Object
    const system = getSystem();
    if (system.users[uid]) {
        // Standardize: ensure uid profile exists
        localStorage.setItem(profileKey, JSON.stringify(system.users[uid]));
        return system.users[uid];
    }

    // Migration from legacy registry if still exists
    let legacyRaw = localStorage.getItem(USER_KEY);
    if (legacyRaw) {
        try {
            const users = JSON.parse(legacyRaw);
            const user = Array.isArray(users) ? users.find(u => u.uid === uid || u.id === uid) : users[uid];
            if (user) {
                localStorage.setItem(profileKey, JSON.stringify(user));
                return user;
            }
        } catch (e) { }
    }

    return null;
};

// Helper: save user to system
const saveUserProfile = (uid, data) => {
    // 1. Save to direct key
    localStorage.setItem(`profile_${uid}`, JSON.stringify(data));

    // 2. Save to centralized system
    const system = getSystem();
    system.users[uid] = data;
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
                portalData = {
                    expertise: profileData.expertise || [],
                    sector: profileData.sector || 'General',
                    bio: profileData.bio || '',
                    linkedin: profileData.linkedin || '',
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

            const newUser = {
                uid: firebaseUser.uid,
                email,
                role: normalizedRole,
                name,
                portalData,
                createdAt: new Date().toISOString(),
                ...profileData, // Keep flat props for compatibility with some legacy views if needed
            };

            saveUserProfile(firebaseUser.uid, newUser);

            const system = getSystem();

            // Relational: Initialize Startup record if founder
            if (['founder', 'co-founder', 'cofounder'].includes(normalizedRole)) {
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

            // Relational: Initialize Incubator record if incubator
            if (normalizedRole === 'incubator') {
                const newIncubator = {
                    id: firebaseUser.uid,
                    name: profileData.incubatorName || name,
                    email: email,
                    website: profileData.website || '',
                    location: profileData.location || '',
                    description: profileData.description || '',
                    sectorFocus: Array.isArray(profileData.sectorFocus) ? profileData.sectorFocus : [],
                    stagePreference: profileData.stagePref || 'Early Stage',
                    fundingSupport: profileData.funding === 'yes',
                    batchSize: parseInt(profileData.cohortSize) || 20,
                    programHighlights: [],
                    successStats: { graduated: 0, raised: '$0', active: 0 },
                    applicationsReceived: [],
                    activeCohorts: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                system.incubators.push(newIncubator);
            }

            saveSystem(system);
            setUser(newUser);
            navigate(ROLE_PATHS[normalizedRole] || '/founder');
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
                }

                saveUserProfile(firebaseUser.uid, profile);
            }

            // Role match validation log
            // Role match validation
            if (selectedRole && profile.role !== selectedRole.toLowerCase()) {
            }

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
