
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

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const ADMIN_EMAIL = "admin@vanguard.com"; // Example admin email

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Get role and profile from localStorage
                let role = localStorage.getItem('userRole');
                const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');

                // Handle Admin role strictly by email if not set
                if (firebaseUser.email === ADMIN_EMAIL) {
                    role = 'admin';
                    localStorage.setItem('userRole', 'admin');
                } else if (!role) {
                    // Fallback to founder if role is lost (limitation of no DB)
                    role = 'founder';
                }

                setUser({
                    ...firebaseUser,
                    role: role,
                    fullName: profile.fullName || firebaseUser.email.split('@')[0],
                    ...profile
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password, role) => {
        try {
            // Normalize role if provided
            if (role) role = role.toLowerCase();

            // Optimistically set localStorage BEFORE auth to prevent race condition with onAuthStateChanged
            if (role) {
                localStorage.setItem('userRole', role);
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Admin override
            if (email === ADMIN_EMAIL) {
                role = 'admin';
                localStorage.setItem('userRole', 'admin');
                navigate('/admin-dashboard');
                return firebaseUser;
            }

            // Trust the role passed from the login form if provided
            if (role) {
                localStorage.setItem('userRole', role);
            } else {
                // If no role passed, check localStorage
                role = localStorage.getItem('userRole');
            }

            if (!role) {
                // FALLBACK: default to founder if role not found
                role = 'founder';
                localStorage.setItem('userRole', 'founder');
            }

            // Standard redirects based on role
            const roleRedirects = {
                'founder': '/founder',
                'cofounder': '/cofounder',
                'mentor': '/mentor',
                'incubator': '/incubator',
                'co-founder': '/cofounder' // handling both dash and no-dash
            };

            const path = roleRedirects[role] || '/founder';
            navigate(path);

            return firebaseUser;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const signup = async (email, password, role, profileData) => {
        try {
            // Optimistically set localStorage BEFORE auth to prevent race condition with onAuthStateChanged
            localStorage.setItem('userRole', role);
            localStorage.setItem('userProfile', JSON.stringify({
                ...profileData,
                email: email
            }));

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Redirect to respective portal dashboard
            const roleRedirects = {
                'founder': '/founder',
                'cofounder': '/cofounder',
                'co-founder': '/cofounder',
                'mentor': '/mentor',
                'incubator': '/incubator'
            };

            const path = roleRedirects[role] || '/founder';
            navigate(path);

            return firebaseUser;
        } catch (error) {
            console.error("Signup error:", error);
            // Cleanup on error
            localStorage.removeItem('userRole');
            localStorage.removeItem('userProfile');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userRole');
            localStorage.removeItem('userProfile');
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        isAdmin: user?.email === ADMIN_EMAIL
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
