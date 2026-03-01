import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStartup } from '../context/StartupContext';

const StartupWorkspaceGuard = () => {
    const { user } = useAuth();
    const { startup, loading } = useStartup();

    if (loading) return null; // Let StartupContext handle initial loading state

    // If co-founder is NOT linked to a startup, block workspace routes
    if (['co-founder', 'cofounder'].includes(user?.role) && !startup) {
        const homePath = user.role === 'cofounder' ? '/cofounder' : '/co-founder';
        return <Navigate to={homePath} replace />;
    }

    return <Outlet />;
};

export default StartupWorkspaceGuard;
