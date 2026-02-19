import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getSystem, saveSystem } from '../utils/system';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

// --- Calculation Helpers (Can be moved to a separate utils file later) ---
export const calculateExecutionScore = (startup) => {
    if (!startup || !startup.milestones || startup.milestones.length === 0) return 30;
    const completed = startup.milestones.filter(m => m.status === 'completed').length;
    const progress = Math.round((completed / startup.milestones.length) * 70);
    return 30 + progress;
};

export const StartupProvider = ({ children }) => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Sync
    useEffect(() => {
        syncData();
        const handleStorage = () => syncData();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [user]);

    const syncData = () => {
        if (!user) {
            setStartup(null);
            setLoading(false);
            return;
        }

        const system = getSystem();
        const userStartup = system.startups.find(s =>
            s.founderId === user.uid || (Array.isArray(s.coFounders) && s.coFounders.includes(user.uid))
        );

        if (userStartup) {
            // Recalculate dynamic values
            userStartup.executionScore = calculateExecutionScore(userStartup);

            let completion = 0;
            if (userStartup.startupName) completion += 20;
            if (userStartup.problemStatement) completion += 20;
            if (userStartup.targetAudience?.length > 0) completion += 20;
            if (userStartup.milestones?.length > 0) completion += 20;
            if (userStartup.sector) completion += 20;
            userStartup.profileCompletion = completion;

            setStartup({ ...userStartup });
        } else {
            setStartup(null);
        }
        setLoading(false);
    };

    const updateSystem = (updatedStartup) => {
        const system = getSystem();
        system.startups = system.startups.map(s =>
            s.startupId === updatedStartup.startupId ? updatedStartup : s
        );
        saveSystem(system);
        setStartup({ ...updatedStartup });
    };

    const updateStartup = (updates) => {
        if (!startup) return;
        const updated = {
            ...startup,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        updateSystem(updated);
    };

    const addActivity = (message, type = 'info') => {
        if (!startup) return;
        const newAct = {
            id: `act_${Date.now()}`,
            message,
            type,
            timestamp: new Date().toISOString()
        };
        updateStartup({
            activity: [newAct, ...(startup.activity || [])].slice(0, 50)
        });
    };

    // --- MILESTONES ---
    const addMilestone = (title) => {
        if (!startup) return;
        const newMilestone = {
            id: Date.now(),
            title,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const updated = {
            ...startup,
            milestones: [...(startup.milestones || []), newMilestone],
            updatedAt: new Date().toISOString()
        };
        updateSystem(updated);
        addActivity(`Added milestone: ${title}`, 'milestone');
    };

    const updateMilestone = (id, updates) => {
        if (!startup) return;
        const updatedMilestones = startup.milestones.map(m =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        );
        updateStartup({ milestones: updatedMilestones });
        if (updates.status === 'completed') {
            const m = startup.milestones.find(ms => ms.id === id);
            addActivity(`Completed milestone: ${m?.title}`, 'success');
        }
    };

    const deleteMilestone = (id) => {
        if (!startup) return;
        updateStartup({
            milestones: startup.milestones.filter(m => m.id !== id)
        });
    };

    // --- DOCUMENTS ---
    const addDocument = (name, size) => {
        if (!startup) return;
        const newDoc = { name, size, uploadedAt: new Date().toISOString() };
        updateStartup({
            documents: [...(startup.documents || []), newDoc]
        });
        addActivity(`Uploaded document: ${name}`, 'document');
    };

    const deleteDocument = (index) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs.splice(index, 1);
        updateStartup({ documents: docs });
    };

    const renameDocument = (index, newName) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs[index] = { ...docs[index], name: newName };
        updateStartup({ documents: docs });
    };

    // --- APPLICATIONS ---
    const applyToIncubator = (incubatorId, message) => {
        if (!startup || !user) return;
        const system = getSystem();
        const newApp = {
            id: `app_${Date.now()}`,
            founderId: user.uid,
            startupId: startup.startupId,
            incubatorId: incubatorId,
            startupName: startup.startupName,
            sector: startup.sector || 'General',
            teamSize: startup.teamSize || 1,
            appliedDate: new Date().toISOString(),
            status: "pending",
            message: message || ''
        };
        system.applications.push(newApp);
        saveSystem(system);
        addActivity(`Sent application to incubator`, 'incubator');
    };

    const requestMentorship = (mentorId, message) => {
        if (!startup || !user) return;
        const system = getSystem();
        const newRequest = {
            id: `mreq_${Date.now()}`,
            mentorId,
            startupId: startup.startupId,
            founderId: user.uid,
            message: message || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        system.mentorRequests = system.mentorRequests || [];
        system.mentorRequests.push(newRequest);
        saveSystem(system);
        addActivity(`Requested mentorship from mentor`, 'mentor');
    };

    const requestSession = (mentorId, date, time) => {
        if (!startup || !user) return;
        const system = getSystem();
        const newSession = {
            id: `ses_${Date.now()}`,
            mentorId,
            startupId: startup.startupId,
            date,
            time,
            status: 'pending_confirmation',
            createdAt: new Date().toISOString()
        };
        system.sessions = system.sessions || [];
        system.sessions.push(newSession);
        saveSystem(system);
        addActivity(`Requested session for ${date}`, 'mentor');
    };

    const value = {
        startup,
        loading,
        updateStartup,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addDocument,
        deleteDocument,
        renameDocument,
        applyToIncubator,
        requestMentorship,
        requestSession,
        addActivity,
        applications: (getSystem().applications || []).filter(a => a.founderId === user?.uid),
        mentorRequests: (getSystem().mentorRequests || []).filter(r => r.founderId === user?.uid),
        sessions: (getSystem().sessions || []).filter(s => s.startupId === startup?.startupId)
    };

    return (
        <StartupContext.Provider value={value}>
            {!loading && children}
        </StartupContext.Provider>
    );
};
