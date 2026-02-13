
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('yen_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password, role) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeToken = `jwt-token-${Math.random().toString(36).substring(7)}-${role}`;

                // Create a simulated full name from email for dashboard display
                const namePart = email.split('@')[0];
                const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

                const userData = { email, role, fullName, token: fakeToken };

                localStorage.setItem('yen_user', JSON.stringify(userData));
                setUser(userData);

                // Redirect based on role
                if (role === 'admin') navigate('/admin/dashboard');
                else if (role === 'founder') navigate('/founder/dashboard');
                else if (role === 'co-founder') navigate('/co-founder/dashboard');
                else if (role === 'mentor') navigate('/mentor/dashboard');
                else if (role === 'incubator') navigate('/incubator/dashboard');

                resolve(userData);
            }, 500);
        });
    };

    const signup = (data, role) => {
        // Simulate Signup API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeToken = `jwt-token-${Math.random().toString(36).substring(7)}-${role}`;
                // In real app, we'd save more data to backend
                const userData = { ...data, role, token: fakeToken };

                localStorage.setItem('yen_user', JSON.stringify(userData));
                setUser(userData);

                if (role === 'founder') navigate('/founder/dashboard');
                else if (role === 'co-founder') navigate('/co-founder/dashboard');
                else if (role === 'mentor') navigate('/mentor/dashboard');
                else if (role === 'incubator') navigate('/incubator/dashboard');

                resolve(userData);
            }, 800);
        });
    };

    const logout = () => {
        localStorage.removeItem('yen_user');
        setUser(null);
        navigate('/');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
