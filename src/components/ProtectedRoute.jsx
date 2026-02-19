
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
    founder: '/founder',
    'co-founder': '/cofounder',
    cofounder: '/cofounder',
    mentor: '/mentor',
    incubator: '/incubator',
    admin: '/admin'
};

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-purple-400 text-sm font-medium tracking-widest uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/role-selection" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their own correct portal
        const home = ROLE_HOME[user.role] || '/auth/role-selection';
        return <Navigate to={home} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
