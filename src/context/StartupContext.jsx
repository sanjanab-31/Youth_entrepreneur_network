
import React, { createContext, useContext, useState, useEffect } from 'react';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

const STORAGE_KEY = 'vanguardStartupData';

export const StartupProvider = ({ children }) => {
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);

    const defaultStartup = {
        startupName: "Nebula AI",
        stage: "Validation",
        activeUsers: 1280,
        teamSize: 5,
        burnRate: 2400,
        problemStatement: "Small-scale retailers struggle with inventory forecasting, leading to a 35% average waste in perishable goods each month.",
        solutionOverview: "Nebula AI provides a low-cost, mobile-first inventory management system that uses lightweight ML models to predict demand patterns.",
        targetAudience: ['Tier 2/3 City Retailers', 'Agritech Supply Chains', 'Urban Tech-first Bodegas'],
        skillGap: "Marketing Lead",
        skillGapPriority: "High",
        skillGapFilled: false,
        milestones: [
            { id: 1, title: 'User Interview (20/20 Completed)', status: 'completed', createdAt: new Date().toISOString() },
            { id: 2, title: 'MVP Wireframes Finalized', status: 'completed', createdAt: new Date().toISOString() },
            { id: 3, title: 'Core ML Model Training', status: 'in-progress', createdAt: new Date().toISOString() }
        ],
        documents: [
            { name: 'Executive_Summary.pdf', size: '1.2MB', uploadTimestamp: new Date().toISOString() },
            { name: 'Financial_Projections.xlsx', size: '450KB', uploadTimestamp: new Date().toISOString() }
        ],
        activity: [
            { id: 1, type: 'milestone', msg: 'Milestone: User Interviews Completed', time: '2 hours ago', createdAt: new Date().toISOString() },
            { id: 2, type: 'session', msg: 'Mentor Session: Scalability discussion', time: 'Yesterday', createdAt: new Date().toISOString() }
        ],
        lastUpdated: new Date().toISOString(),
        lastTractionUpdate: new Date().toISOString(),
        profileCompletion: 0,
        executionScore: 0,
        mentor: null,
        expertiseSector: "Fintech"
    };

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
        // Weighted average calculation:
        // Completed Milestones (40%)
        // Profile Completion (20%)
        // Active Mentor (20%)
        // Updated Traction (20%) - updated within 14 days

        const completedMilestonesCount = data.milestones?.filter(m => m.status === 'completed').length || 0;
        const totalMilestones = data.milestones?.length || 1;
        const milestonesWeight = (completedMilestonesCount / totalMilestones) * 40;

        const profileWeight = (data.profileCompletion / 100) * 20;

        const mentorWeight = data.mentor ? 20 : 0;

        const lastTraction = new Date(data.lastTractionUpdate || 0);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const tractionWeight = lastTraction > fourteenDaysAgo ? 20 : 0;

        return Math.min(100, Math.round(milestonesWeight + profileWeight + mentorWeight + tractionWeight));
    };

    const updateCalculations = (data) => {
        const profileCompletion = calculateProfileCompletion(data);
        const updatedWithProfile = { ...data, profileCompletion };
        const executionScore = calculateExecutionScore(updatedWithProfile);
        return { ...updatedWithProfile, executionScore };
    };

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                let migration = {
                    ...defaultStartup,
                    ...parsed,
                };
                migration = updateCalculations(migration);
                setStartup(migration);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(migration));
            } catch (e) {
                console.error("Failed to parse startup data", e);
                setStartup(updateCalculations(defaultStartup));
            }
        } else {
            const initial = updateCalculations(defaultStartup);
            setStartup(initial);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
        setLoading(false);
    }, []);

    const updateStartup = (newData) => {
        setStartup(prev => {
            let updated = {
                ...prev,
                ...newData,
                lastUpdated: new Date().toISOString()
            };
            if (newData.activeUsers !== undefined) {
                updated.lastTractionUpdate = new Date().toISOString();
            }
            updated = updateCalculations(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const addActivity = (msg, type = 'milestone') => {
        const newActivity = {
            id: Date.now(),
            type,
            msg,
            time: 'Just now',
            createdAt: new Date().toISOString()
        };
        setStartup(prev => {
            const updatedActivity = [newActivity, ...(prev.activity || [])];
            let updated = { ...prev, activity: updatedActivity };
            updated = updateCalculations(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const addMilestone = (title) => {
        const newMilestone = {
            id: Date.now(),
            title,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        setStartup(prev => {
            const updatedMilestones = [...prev.milestones, newMilestone];
            let updated = { ...prev, milestones: updatedMilestones };
            updated = updateCalculations(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
        addActivity(`New Milestone Added: ${title}`, 'milestone');
    };

    const updateMilestone = (id, updates) => {
        setStartup(prev => {
            const updatedMilestones = prev.milestones.map(m =>
                m.id === id ? { ...m, ...updates } : m
            );
            let updated = { ...prev, milestones: updatedMilestones };
            updated = updateCalculations(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        if (updates.status === 'completed') {
            const milestone = startup.milestones.find(m => m.id === id);
            addActivity(`Milestone Completed: ${milestone?.title}`, 'milestone');
        }
    };

    const deleteMilestone = (id) => {
        setStartup(prev => {
            const updatedMilestones = prev.milestones.filter(m => m.id !== id);
            let updated = { ...prev, milestones: updatedMilestones };
            updated = updateCalculations(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const addDocument = (name, size) => {
        const newDoc = {
            name,
            size,
            uploadTimestamp: new Date().toISOString()
        };
        const updatedDocs = [...startup.documents, newDoc];
        updateStartup({ documents: updatedDocs });
    };

    const deleteDocument = (index) => {
        const updatedDocs = startup.documents.filter((_, i) => i !== index);
        updateStartup({ documents: updatedDocs });
    };

    const renameDocument = (index, newName) => {
        const updatedDocs = [...startup.documents];
        updatedDocs[index] = { ...updatedDocs[index], name: newName };
        updateStartup({ documents: updatedDocs });
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
        loading
    };

    return (
        <StartupContext.Provider value={value}>
            {!loading && children}
        </StartupContext.Provider>
    );
};

