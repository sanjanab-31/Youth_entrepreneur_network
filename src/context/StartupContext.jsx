
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
            { title: 'User Interview (20/20 Completed)', status: 'completed', createdAt: new Date().toISOString() },
            { title: 'MVP Wireframes Finalized', status: 'completed', createdAt: new Date().toISOString() },
            { title: 'Core ML Model Training', status: 'in-progress', createdAt: new Date().toISOString() }
        ],
        documents: [
            { name: 'Executive_Summary.pdf', size: '1.2MB', uploadTimestamp: new Date().toISOString() },
            { name: 'Financial_Projections.xlsx', size: '450KB', uploadTimestamp: new Date().toISOString() }
        ],
        activity: [
            { id: 1, type: 'milestone', msg: 'Milestone: User Interviews Completed', time: '2 hours ago' },
            { id: 2, type: 'session', msg: 'Mentor Session: Scalability discussion', time: 'Yesterday' }
        ],
        lastUpdated: new Date().toISOString(),
        profileCompletion: 0,
        mentor: null
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

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Ensure legacy fields don't break things or migration
                const migration = {
                    ...defaultStartup,
                    ...parsed,
                };
                migration.profileCompletion = calculateProfileCompletion(migration);
                setStartup(migration);
            } catch (e) {
                console.error("Failed to parse startup data", e);
                setStartup(defaultStartup);
            }
        } else {
            const initial = { ...defaultStartup, profileCompletion: calculateProfileCompletion(defaultStartup) };
            setStartup(initial);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
        setLoading(false);
    }, []);

    const updateStartup = (newData) => {
        setStartup(prev => {
            const updated = {
                ...prev,
                ...newData,
                lastUpdated: new Date().toISOString()
            };
            updated.profileCompletion = calculateProfileCompletion(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const addActivity = (msg, type = 'milestone') => {
        const newActivity = {
            id: Date.now(),
            type,
            msg,
            time: 'Just now'
        };
        const updatedActivity = [newActivity, ...(startup.activity || [])];
        updateStartup({ activity: updatedActivity });
    };

    const addMilestone = (title) => {
        const newMilestone = {
            title,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const updatedMilestones = [...startup.milestones, newMilestone];
        updateStartup({ milestones: updatedMilestones });
        addActivity(`New Milestone Added: ${title}`, 'milestone');
    };

    const toggleMilestoneStatus = (index, newStatus) => {
        const updatedMilestones = [...startup.milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], status: newStatus };
        updateStartup({ milestones: updatedMilestones });
    };

    const deleteMilestone = (index) => {
        const updatedMilestones = startup.milestones.filter((_, i) => i !== index);
        updateStartup({ milestones: updatedMilestones });
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
        toggleMilestoneStatus,
        deleteMilestone,
        addDocument,
        deleteDocument,
        renameDocument,
        loading
    };

    return (
        <StartupContext.Provider value={value}>
            {!loading && children}
        </StartupContext.Provider>
    );
};
