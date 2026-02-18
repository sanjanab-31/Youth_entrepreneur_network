
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const KEYS = {
    USERS: 'vanguard_users',
    STARTUPS: 'vanguard_startups',
    MENTOR_REQUESTS: 'vanguard_mentorRequests',
    SESSIONS: 'vanguard_sessions',
    APPLICATIONS: 'vanguard_applications',
    CURRENT_USER: 'vanguard_currentUser'
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize localStorage keys if they don't exist
    useEffect(() => {
        Object.values(KEYS).forEach(key => {
            if (!localStorage.getItem(key)) {
                if (key === KEYS.CURRENT_USER) {
                    // Current user is null by default
                } else {
                    localStorage.setItem(key, JSON.stringify([]));
                }
            }
        });

        // Rehydrate state
        const storedUser = localStorage.getItem(KEYS.CURRENT_USER);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        try {
            const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
            const matchedUser = users.find(u => u.email === email && u.password === password);

            if (!matchedUser) {
                throw { code: 'auth/invalid-credential', message: 'Invalid credentials' };
            }

            // Set current user
            localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(matchedUser));
            setUser(matchedUser);

            // Redirect based on role
            const roleRedirects = {
                'founder': '/founder',
                'mentor': '/mentor',
                'incubator': '/incubator',
                'admin': '/admin-dashboard'
            };

            const path = roleRedirects[matchedUser.role] || '/founder';
            navigate(path);

            return matchedUser;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const signup = async (email, password, role, profileData) => {
        try {
            const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');

            if (users.find(u => u.email === email)) {
                throw { code: 'auth/email-already-in-use', message: 'Email already exists' };
            }

            const newUser = {
                id: Date.now().toString(),
                name: profileData.fullName || email.split('@')[0],
                email,
                password,
                role: role.toLowerCase(),
                profileData,
                createdAt: new Date().toISOString()
            };

            // Save user
            const updatedUsers = [...users, newUser];
            localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));

            // If role is founder: Create a startup object
            if (newUser.role === 'founder') {
                const startups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
                const newStartup = {
                    startupId: `s_${Date.now()}`,
                    founderId: newUser.id,
                    startupName: profileData.startupName || "My Startup",
                    sector: profileData.sector || "General",
                    stage: profileData.stage || "Idea",
                    traction: "0",
                    teamSize: profileData.teamSize || "1",
                    problemStatement: profileData.problemStatement || "",
                    milestones: [],
                    mentorAssigned: null,
                    applications: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    status: 'active'
                };
                localStorage.setItem(KEYS.STARTUPS, JSON.stringify([...startups, newStartup]));
            }

            // Set current user after signup
            localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
            setUser(newUser);

            // Redirect
            const roleRedirects = {
                'founder': '/founder',
                'mentor': '/mentor',
                'incubator': '/incubator'
            };
            const path = roleRedirects[newUser.role] || '/founder';
            navigate(path);

            return newUser;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem(KEYS.CURRENT_USER);
        setUser(null);
        navigate('/');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
