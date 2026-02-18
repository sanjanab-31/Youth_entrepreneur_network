
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

const KEYS = {
    STARTUPS: 'vanguard_startups',
    APPLICATIONS: 'vanguard_applications',
    MENTOR_REQUESTS: 'vanguard_mentorRequests'
};

export const StartupProvider = ({ children }) => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sync startup from global startups array based on currentUser
    useEffect(() => {
        if (!user || user.role !== 'founder') {
            setStartup(null);
            setLoading(false);
            return;
        }

        const normalizeStartup = (data) => ({
            milestones: [],
            targetAudience: [],
            documents: [],
            activity: [],
            applications: [],
            activeUsers: 0,
            teamSize: 0,
            burnRate: 0,
            skillGap: '',
            skillGapPriority: 'Medium',
            skillGapFilled: false,
            problemStatement: '',
            solutionOverview: '',
            ...data,
            milestones: Array.isArray(data.milestones) ? data.milestones : [],
            targetAudience: Array.isArray(data.targetAudience) ? data.targetAudience : [],
            documents: Array.isArray(data.documents) ? data.documents : [],
            activity: Array.isArray(data.activity) ? data.activity : [],
            applications: Array.isArray(data.applications) ? data.applications : [],
            activeUsers: data.activeUsers ?? 0,
            teamSize: data.teamSize ?? 0,
            burnRate: data.burnRate ?? 0,
        });

        const syncData = () => {
            const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
            const userStartup = allStartups.find(s => s.founderId === user.id);
            if (userStartup) {
                const refreshed = updateCalculations(normalizeStartup(userStartup));
                setStartup(refreshed);
            }
            setLoading(false);
        };

        syncData();
        // Simple polling/event mechanism could be added for cross-tab sync, 
        // but for now, we'll rely on direct updates within the app.
        window.addEventListener('storage', syncData);
        return () => window.removeEventListener('storage', syncData);
    }, [user]);

    const calculateProfileCompletion = (data) => {
        let score = 0;
        let total = 6;

        if (data.problemStatement?.trim()) score++;
        if (data.solutionOverview?.trim()) score++;
        if (data.milestones?.length >= 3) score++;
        if (data.skillGap?.trim()) score++;
        if (data.targetAudience?.length > 0) score++;
        if (data.documents?.length > 0) score++;

        return Math.round((score / total) * 100);
    };

    const calculateExecutionScore = (data) => {
        const completedMilestonesCount = data.milestones?.filter(m => m.status === 'completed').length || 0;
        const totalMilestones = data.milestones?.length || 1;
        const milestonesWeight = (completedMilestonesCount / totalMilestones) * 40;

        const profileWeight = (calculateProfileCompletion(data) / 100) * 20;

        const mentorWeight = data.mentorAssigned ? 20 : 0;

        const lastTraction = new Date(data.updatedAt || 0);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const tractionWeight = lastTraction > fourteenDaysAgo ? 20 : 0;

        return Math.min(100, Math.round(milestonesWeight + profileWeight + mentorWeight + tractionWeight));
    };

    const updateCalculations = (data) => {
        const profileCompletion = calculateProfileCompletion(data);
        const executionScore = calculateExecutionScore(data);
        return { ...data, profileCompletion, executionScore };
    };

    const saveStartupToGlobal = (updatedStartup) => {
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedAll = allStartups.map(s => s.startupId === updatedStartup.startupId ? updatedStartup : s);
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedAll));
        setStartup(updateCalculations(updatedStartup));
    };

    const updateStartup = (newData) => {
        if (!startup) return;
        const updated = {
            ...startup,
            ...newData,
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
    };

    const addMilestone = (title) => {
        if (!startup) return;
        const newMilestone = {
            id: Date.now().toString(),
            title,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const updated = {
            ...startup,
            milestones: [...(startup.milestones || []), newMilestone],
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
        addActivity(`Added milestone: ${title}`, 'milestone');
    };

    const updateMilestone = (milestoneId, updates) => {
        if (!startup) return;
        const updatedMilestones = startup.milestones.map(m =>
            m.id === milestoneId ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        );
        const updated = {
            ...startup,
            milestones: updatedMilestones,
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
        if (updates.status === 'completed') {
            const m = startup.milestones.find(ms => ms.id === milestoneId);
            addActivity(`Completed milestone: ${m?.title}`, 'milestone');
        }
    };

    const deleteMilestone = (milestoneId) => {
        if (!startup) return;
        const updated = {
            ...startup,
            milestones: startup.milestones.filter(m => m.id !== milestoneId),
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
    };

    const addDocument = (name, size) => {
        if (!startup) return;
        const newDoc = { name, size, uploadedAt: new Date().toISOString() };
        const updated = {
            ...startup,
            documents: [...(startup.documents || []), newDoc],
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
        addActivity(`Uploaded document: ${name}`, 'document');
    };

    const deleteDocument = (index) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs.splice(index, 1);
        const updated = {
            ...startup,
            documents: docs,
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
    };

    const renameDocument = (index, newName) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs[index] = { ...docs[index], name: newName };
        const updated = {
            ...startup,
            documents: docs,
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
    };

    const applyToIncubator = (incubatorId, message) => {
        if (!startup) return;
        const applications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
        const newApp = {
            id: Date.now().toString(),
            startupId: startup.startupId,
            founderId: user.id,
            incubatorId,
            startupName: startup.startupName,
            sector: startup.sector,
            traction: startup.traction,
            status: 'pending',
            message,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify([...applications, newApp]));

        // Update startup applications list
        const updated = {
            ...startup,
            applications: [...(startup.applications || []), { applicationId: newApp.id, incubatorId, status: 'pending' }],
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
        addActivity(`Applied to incubator: ${incubatorId}`, 'incubator');
    };

    const requestMentor = (mentorId, message) => {
        if (!startup) return;
        const requests = JSON.parse(localStorage.getItem(KEYS.MENTOR_REQUESTS) || '[]');
        const newRequest = {
            id: Date.now().toString(),
            startupId: startup.startupId,
            founderId: user.id,
            mentorId,
            founderName: user.name,
            startupName: startup.startupName,
            sector: startup.sector,
            traction: startup.traction,
            executionScore: startup.executionScore,
            status: 'pending',
            message,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.MENTOR_REQUESTS, JSON.stringify([...requests, newRequest]));
        addActivity(`Requested mentor: ${mentorId}`, 'mentor');
    };

    const addActivity = (msg, type = 'info') => {
        if (!startup) return;
        const newActivity = {
            id: Date.now().toString(),
            msg,
            type,
            time: 'Just now'
        };
        const updated = {
            ...startup,
            activity: [newActivity, ...(startup.activity || [])].slice(0, 20),
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
    };

    const value = {
        startup,
        updateStartup,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addDocument,
        deleteDocument,
        renameDocument,
        addActivity,
        applyToIncubator,
        requestMentor,
        loading
    };

    return (
        <StartupContext.Provider value={value}>
            {!loading && children}
        </StartupContext.Provider>
    );
};

