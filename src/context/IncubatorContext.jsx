
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const IncubatorContext = createContext();

export const useIncubator = () => useContext(IncubatorContext);

const KEYS = {
    STARTUPS: 'vanguard_startups',
    APPLICATIONS: 'vanguard_applications'
};

export const IncubatorProvider = ({ children }) => {
    const { user } = useAuth();
    const [pipeline, setPipeline] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = () => {
        if (!user || user.role !== 'incubator') {
            setLoading(false);
            return;
        }

        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const allApplications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');

        // Pipeline shows startups (filtered by stage or generally for the incubator)
        // For simplicity, let's say incubator sees all startups in the "pipeline" view 
        // or those that have applied to them.
        // Prompt says: "Show pipeline → filter startups by stage"
        setPipeline(allStartups);

        // Filter applications for this incubator
        const myApplications = allApplications.filter(a => a.incubatorId === user.id);
        setApplications(myApplications);

        setLoading(false);
    };

    useEffect(() => {
        refreshData();
        window.addEventListener('storage', refreshData);
        return () => window.removeEventListener('storage', refreshData);
    }, [user]);

    const acceptApplication = (appId) => {
        const allApplications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
        const app = allApplications.find(a => a.id === appId);

        if (app) {
            // Update application status
            const updatedApps = allApplications.map(a =>
                a.id === appId ? { ...a, status: 'approved', updatedAt: new Date().toISOString() } : a
            );
            localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updatedApps));

            // Update startup status
            const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
            const updatedStartups = allStartups.map(s =>
                s.startupId === app.startupId ? { ...s, applicationStatus: 'approved', updatedAt: new Date().toISOString() } : s
            );
            localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));

            refreshData();
        }
    };

    const rejectApplication = (appId) => {
        const allApplications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
        const updatedApps = allApplications.map(a =>
            a.id === appId ? { ...a, status: 'rejected', updatedAt: new Date().toISOString() } : a
        );
        localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updatedApps));
        refreshData();
    };

    const analytics = useMemo(() => {
        const totalStartups = pipeline.length;
        const stageDistribution = pipeline.reduce((acc, s) => {
            acc[s.stage] = (acc[s.stage] || 0) + 1;
            return acc;
        }, {});

        const totalApps = applications.length;
        const acceptedApps = applications.filter(a => a.status === 'approved').length;
        const acceptedRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;

        return {
            totalStartups,
            stageDistribution,
            acceptedRate: `${acceptedRate}%`,
            activeApps: applications.filter(a => a.status === 'pending').length
        };
    }, [pipeline, applications]);

    const value = {
        pipeline,
        applications,
        acceptApplication,
        rejectApplication,
        analytics,
        loading
    };

    return (
        <IncubatorContext.Provider value={value}>
            {!loading && children}
        </IncubatorContext.Provider>
    );
};
