
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center text-purple-500">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard if they have the wrong role
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
