import React from 'react';
import { useStartup } from '../../../context/StartupContext';
import IndependentDashboard from './components/IndependentDashboard';
import StartupWorkspace from './components/StartupWorkspace';

const CoFounderDashboard = () => {
    const { startup, loading } = useStartup();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-[#8B5CF6] rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    // This controller determines which version of the dashboard to show based on startup association
    return startup ? <StartupWorkspace /> : <IndependentDashboard />;
};

export default CoFounderDashboard;
