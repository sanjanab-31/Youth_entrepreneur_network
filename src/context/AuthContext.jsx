import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = AuthService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password, role) => {
        const data = await AuthService.login(email, password, role);
        setUser(data.user);
        return data;
    };

    const signup = async (userData, role) => {
        const data = await AuthService.signup(userData, role);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
