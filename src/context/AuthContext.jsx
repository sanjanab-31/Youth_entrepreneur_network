import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// localStorage keys (for role + profile metadata only — NOT for identity/passwords)
const USER_KEY = 'vanguard_users';   // { [uid]: { uid, name, email, role, ...profileData, createdAt } }
const STARTUPS_KEY = 'vanguard_startups';
const MENTOR_REQUESTS_KEY = 'vanguard_mentorRequests';
const SESSIONS_KEY = 'vanguard_sessions';
const APPLICATIONS_KEY = 'vanguard_applications';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@vanguard.com';

// Role → dashboard path mapping
const ROLE_PATHS = {
    founder: '/founder',
    'co-founder': '/cofounder',
    cofounder: '/cofounder',
    mentor: '/mentor',
    incubator: '/incubator',
    admin: '/admin'
};

// Helper: get user from localStorage by uid
const getUserProfile = (uid) => {
    const users = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    // Migration check: also check old key if new one is empty
    if (!users[uid]) {
        const oldProfiles = JSON.parse(localStorage.getItem('vanguard_profiles') || '{}');
        if (oldProfiles[uid]) return oldProfiles[uid];
    }
    return users[uid] || null;
};

// Helper: save user to localStorage by uid
const saveUserProfile = (uid, data) => {
    const users = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    users[uid] = data;
    localStorage.setItem(USER_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);      // { uid, name, email, role, ...profileData }
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize other localStorage keys if they don't exist
    useEffect(() => {
        [STARTUPS_KEY, MENTOR_REQUESTS_KEY, SESSIONS_KEY, APPLICATIONS_KEY].forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }, []);

    // ─── CRITICAL: Firebase auth state listener ───────────────────────────────
    // This is the single source of truth. Fires on:
    //   - App load (restores session from Firebase persistence)
    //   - After login / signup
    //   - After logout
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Firebase says user is logged in — get their role/profile from localStorage
                const profile = getUserProfile(firebaseUser.uid);

                if (profile) {
                    setUser(profile);
                } else if (firebaseUser.email === ADMIN_EMAIL) {
                    // Admin logged in but no profile stored — build one from email
                    const adminProfile = {
                        uid: firebaseUser.uid,
                        name: 'Admin',
                        email: firebaseUser.email,
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    };
                    saveUserProfile(firebaseUser.uid, adminProfile);
                    setUser(adminProfile);
                } else {
                    // Firebase user exists but no local profile (e.g. cleared localStorage)
                    // Sign them out to force re-login
                    console.warn('Firebase user found but no local profile. Signing out.');
                    signOut(auth);
                    setUser(null);
                }
            } else {
                // No Firebase user — logged out
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ─── SIGNUP ───────────────────────────────────────────────────────────────
    const signup = async (email, password, role, profileData) => {
        // Create real Firebase user — this is what appears in Firebase Console
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const normalizedRole = role.toLowerCase();

        // Build profile object (NO password stored)
        const profile = {
            uid: firebaseUser.uid,
            name: profileData.fullName || profileData.incubatorName || email.split('@')[0],
            email: firebaseUser.email,
            role: normalizedRole,
            ...profileData, // Spread profileData directly for SSOT (name, sector, expertise etc)
            createdAt: new Date().toISOString()
        };

        // Save profile metadata to localStorage (role + profile only)
        saveUserProfile(firebaseUser.uid, profile);

        // If founder/co-founder: create a startup object
        if (normalizedRole === 'founder' || normalizedRole === 'co-founder' || normalizedRole === 'cofounder') {
            const startups = JSON.parse(localStorage.getItem(STARTUPS_KEY) || '[]');
            // Capitalize stage to match roadmap (e.g. "idea" → "Idea")
            const capitalizeStage = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Idea';
            const newStartup = {
                startupId: `s_${firebaseUser.uid}`,
                founderId: firebaseUser.uid,
                startupName: profileData.startupName || 'My Startup',
                sector: profileData.sector || 'General',
                stage: capitalizeStage(profileData.stage),
                traction: '',
                fundingGoal: '',
                focusAreas: [],
                teamSize: parseInt(profileData.teamSize) || 1,
                activeUsers: 0,
                burnRate: 0,
                problemStatement: profileData.problemStatement || '',
                // Map registration "looking for" field into the skill gap tracker
                skillGap: profileData.lookingFor || '',
                skillGapFilled: false,
                primarySkills: profileData.primarySkills || '',
                location: profileData.location || '',
                commitment: profileData.commitment || '',
                linkedin: profileData.linkedin || '',
                equity: profileData.equity || '',
                milestones: [],
                mentorAssigned: null,
                applications: [],
                activity: [{
                    id: Date.now().toString(),
                    msg: 'Account created and startup initialized',
                    type: 'milestone',
                    time: 'Just now',
                    timestamp: new Date().toISOString()
                }],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active'
            };
            localStorage.setItem(STARTUPS_KEY, JSON.stringify([...startups, newStartup]));
        }

        // onAuthStateChanged will fire and set user state automatically
        // But we also set it here for instant UI response
        setUser(profile);

        // Redirect based on role
        const path = ROLE_PATHS[normalizedRole] || '/founder';
        navigate(path);

        return profile;
    };

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        let profile = getUserProfile(firebaseUser.uid);

        // Admin: may not have a stored profile (created manually in Firebase)
        if (!profile && firebaseUser.email === ADMIN_EMAIL) {
            profile = {
                uid: firebaseUser.uid,
                name: 'Admin',
                email: firebaseUser.email,
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            saveUserProfile(firebaseUser.uid, profile);
        }

        if (!profile) {
            // Firebase auth succeeded but no profile — sign out and throw
            await signOut(auth);
            throw { code: 'auth/profile-not-found', message: 'Account data not found. Please sign up again.' };
        }

        setUser(profile);

        const path = ROLE_PATHS[profile.role] || '/founder';
        navigate(path);

        return profile;
    };

    // ─── LOGOUT ───────────────────────────────────────────────────────────────
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
