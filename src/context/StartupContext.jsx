
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateExecutionScore, calculateProfileCompletion } from '../utils/executionScore';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

const KEYS = {
    STARTUPS: 'vanguard_startups',
    APPLICATIONS: 'vanguard_applications',
    MENTOR_REQUESTS: 'vanguard_mentorRequests',
    SESSIONS: 'vanguard_sessions',
    USERS: 'vanguard_users'
};

// Re-export so other files can import from context without touching utils directly
export { calculateExecutionScore, calculateProfileCompletion };

export const StartupProvider = ({ children }) => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const normalizeStartup = (data) => ({
        milestones: [],
        targetAudience: [],
        documents: [],
        activity: [],
        applications: [],
        focusAreas: [],
        messages: [],
        tractionHistory: [],
        activeUsers: 0,
        teamSize: 0,
        burnRate: 0,
        skillGap: '',
        skillGapPriority: 'Medium',
        skillGapFilled: false,
        problemStatement: '',
        solutionOverview: '',
        traction: '',
        fundingGoal: '',
        mentorAssigned: null,
        mentorshipStartDate: null,
        ...data,
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        targetAudience: Array.isArray(data.targetAudience) ? data.targetAudience : [],
        documents: Array.isArray(data.documents) ? data.documents : [],
        activity: Array.isArray(data.activity) ? data.activity : [],
        applications: Array.isArray(data.applications) ? data.applications : [],
        focusAreas: Array.isArray(data.focusAreas) ? data.focusAreas : [],
        messages: Array.isArray(data.messages) ? data.messages : [],
        tractionHistory: Array.isArray(data.tractionHistory) ? data.tractionHistory : [],
        activeUsers: data.activeUsers ?? 0,
        teamSize: data.teamSize ?? 0,
        burnRate: data.burnRate ?? 0,
    });

    const attachCalculations = (data) => {
        const profileCompletion = calculateProfileCompletion(data);
        const executionScore = calculateExecutionScore(data);
        return { ...data, profileCompletion, executionScore };
    };

    const syncData = () => {
        if (!user || user.role !== 'founder') {
            setStartup(null);
            setLoading(false);
            return;
        }
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const userStartup = allStartups.find(s => s.founderId === user.id);
        if (userStartup) {
            setStartup(attachCalculations(normalizeStartup(userStartup)));
            const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
            setSessions(allSessions.filter(s => s.startupId === userStartup.startupId));
        } else {
            setStartup(null);
            setSessions([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        syncData();
        window.addEventListener('storage', syncData);
        return () => window.removeEventListener('storage', syncData);
    }, [user]);

    // ── Persistence ────────────────────────────────────────────

    const saveStartupToGlobal = (updatedStartup) => {
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedAll = allStartups.map(s =>
            s.startupId === updatedStartup.startupId ? updatedStartup : s
        );
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedAll));
        setStartup(attachCalculations(updatedStartup));
    };

    // ── Mutations ──────────────────────────────────────────────

    const updateStartup = (newData) => {
        if (!startup) return;
        const updated = { ...startup, ...newData, updatedAt: new Date().toISOString() };
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
            m.id === milestoneId
                ? {
                    ...m, ...updates,
                    updatedAt: new Date().toISOString(),
                    ...(updates.status === 'completed' ? { completedAt: new Date().toISOString() } : {})
                }
                : m
        );
        const updated = { ...startup, milestones: updatedMilestones, updatedAt: new Date().toISOString() };
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

    /**
     * Update traction and append to tractionHistory for growth calculation.
     */
    const updateTraction = (tractionText, numericValue = null) => {
        if (!startup) return;
        const historyEntry = {
            value: numericValue ?? parseFloat(tractionText) ?? 0,
            text: tractionText,
            date: new Date().toISOString()
        };
        const updated = {
            ...startup,
            traction: tractionText,
            tractionHistory: [...(startup.tractionHistory || []), historyEntry].slice(-20),
            lastTractionUpdate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        saveStartupToGlobal(updated);
        addActivity(`Traction updated: ${tractionText}`, 'milestone');
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
        const updated = { ...startup, documents: docs, updatedAt: new Date().toISOString() };
        saveStartupToGlobal(updated);
    };

    const renameDocument = (index, newName) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs[index] = { ...docs[index], name: newName };
        const updated = { ...startup, documents: docs, updatedAt: new Date().toISOString() };
        saveStartupToGlobal(updated);
    };

    const applyToIncubator = (incubatorId, message) => {
        if (!startup) return;
        const applications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
        // Store IDs only — never duplicate business data
        const newApp = {
            id: Date.now().toString(),
            startupId: startup.startupId,
            founderId: user.id,
            incubatorId,
            message,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify([...applications, newApp]));
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

        // Prevent duplicate requests to same mentor from same startup
        const alreadyRequested = requests.some(
            r => r.mentorId === mentorId && r.startupId === startup.startupId
        );
        if (alreadyRequested) return;

        // Store IDs + message ONLY — never duplicate business data
        const newRequest = {
            id: Date.now().toString(),
            startupId: startup.startupId,
            founderId: user.id,
            mentorId,
            message,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.MENTOR_REQUESTS, JSON.stringify([...requests, newRequest]));

        // Hydrate mentor name for activity log
        const allUsers = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
        const mentor = allUsers.find(u => u.id === mentorId);
        const mentorName = mentor?.name || mentor?.email?.split('@')[0] || mentorId;
        addActivity(`Requested mentorship from ${mentorName}`, 'mentor');
    };

    const addActivity = (msg, type = 'info') => {
        if (!startup) return;
        const newActivity = {
            id: Date.now().toString(),
            msg,
            type,
            time: 'Just now',
            timestamp: new Date().toISOString()
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
        sessions,
        updateStartup,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        updateTraction,
        addDocument,
        deleteDocument,
        renameDocument,
        addActivity,
        applyToIncubator,
        requestMentor,
        requestSession: (date, time, topic) => {
            if (!startup || !startup.mentorAssigned) return;
            const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
            const newRequest = {
                id: Date.now().toString(),
                startupId: startup.startupId,
                mentorId: startup.mentorAssigned,
                date,
                time,
                topic,
                status: 'requested',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(KEYS.SESSIONS, JSON.stringify([...allSessions, newRequest]));
            syncData();
            addActivity(`Requested session for ${date}`, 'mentor');
        },
        loading
    };

    return (
        <StartupContext.Provider value={value}>
            {!loading && children}
        </StartupContext.Provider>
    );
};
