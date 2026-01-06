import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthForms from './pages/AuthForms';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup/:role" element={<AuthForms type="signup" />} />
            <Route path="/login/:role" element={<AuthForms type="login" />} />

            <Route path="/dashboard/*" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
