import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getSystem } from '../utils/system';
import {
    getUserProfile,
    loginUser,
    logoutUser,
    signupUser,
    updateUserProfile
} from '../utils/authService';

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

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const processingAuthRef = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        getSystem();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'admin' });
                setLoading(false);
                return;
            }

            const profile = getUserProfile(firebaseUser.uid);
            if (profile) {
                setUser(profile);
                const authPaths = ['/', '/auth/login', '/auth/signup', '/auth/role-selection'];
                if (authPaths.includes(window.location.pathname)) {
                    navigate(ROLE_PATHS[profile.role] || '/founder');
                }
            } else if (!processingAuthRef.current) {
                await signOut(auth);
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email, password, role, profileData) => {
        processingAuthRef.current = true;
        try {
            const result = await signupUser({ auth, email, password, role, profileData });
            setUser(result.user);
            navigate(ROLE_PATHS[result.role] || '/founder');
            return result.user;
        } finally {
            processingAuthRef.current = false;
        }
    };

    const login = async (email, password, selectedRole = 'founder') => {
        processingAuthRef.current = true;
        try {
            const profile = await loginUser({ auth, email, password, selectedRole });
            setUser(profile);
            navigate(ROLE_PATHS[profile.role] || '/founder');
            return profile;
        } finally {
            processingAuthRef.current = false;
        }
    };

    const logout = async () => {
        await logoutUser(auth);
        setUser(null);
        navigate('/');
    };

    const updateProfile = async (updates) => {
        const updated = await updateUserProfile(user, updates);
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