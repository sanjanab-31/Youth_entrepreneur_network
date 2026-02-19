
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const IncubatorContext = createContext();

export const useIncubator = () => useContext(IncubatorContext);

const KEYS = {
    STARTUPS: 'vanguard_startups',
    APPLICATIONS: 'vanguard_applications',
    SETTINGS: 'vanguard_incubatorSettings'
};

const DEFAULT_SETTINGS = {
    batchLimits: {
        maxCapacity: 25,
        durationWeeks: 12,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    notifications: {
        newApplications: true,
        milestoneUpdates: true,
        mentorMessages: true
    },
    subAdmins: []
};

export const IncubatorProvider = ({ children }) => {
    const { user } = useAuth();
    const [pipeline, setPipeline] = useState([]);
    const [applications, setApplications] = useState([]);
    const [cohorts, setCohorts] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState(null);

    const refreshData = () => {
        if (!user || user.role !== 'incubator') {
            setLoading(false);
            return;
        }

        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const allApplications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');

        const allUsersRaw = localStorage.getItem('vanguard_users');
        let allUsers = {};
        try {
            allUsers = JSON.parse(allUsersRaw || '{}');
            if (Array.isArray(allUsers)) {
                allUsers = allUsers.reduce((acc, u) => {
                    if (u.uid || u.id) acc[u.uid || u.id] = u;
                    return acc;
                }, {});
            }
        } catch (e) { allUsers = {}; }

        const allCohorts = JSON.parse(localStorage.getItem('vanguard_cohorts') || '[]');
        const savedSettings = JSON.parse(localStorage.getItem(`${KEYS.SETTINGS}_${user.uid}`) || 'null');

        // UNIFIED SCHEMA: Use user object from AuthContext (Master Key: profile_${uid})
        // Combine core user info with portal-specific metadata
        const incubatorProfile = {
            ...user,
            ...(user.portalData || {}),
            id: user.uid // Ensure 'id' alias for legacy prop consistency
        };
        setProfile(incubatorProfile);

        // Pipeline shows startups assigned to this incubator
        const myPipeline = allStartups.filter(s => s.incubatorAssigned === user.uid);
        setPipeline(myPipeline);

        // Filter applications for this incubator
        const myApplications = allApplications.filter(a => a.incubatorId === user.uid);
        setApplications(myApplications);

        // Fetch active mentors
        const mentorList = Object.values(allUsers).filter(u => u.role === 'mentor');
        setMentors(mentorList);

        // Filter cohorts managed by this incubator
        const myCohorts = allCohorts.filter(c => c.incubatorId === user.uid);
        setCohorts(myCohorts);

        // Load settings with fallback
        setSettings(savedSettings || DEFAULT_SETTINGS);

        setLoading(false);
    };

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem(`${KEYS.SETTINGS}_${user.uid}`, JSON.stringify(newSettings));
    };

    useEffect(() => {
        refreshData();
        window.addEventListener('storage', refreshData);
        return () => window.removeEventListener('storage', refreshData);
    }, [user]);

    const acceptApplication = (appId, cohortId) => {
        const allApplications = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
        const app = allApplications.find(a => a.id === appId);

        if (app) {
            // 1. Update application status
            const updatedApps = allApplications.map(a =>
                a.id === appId ? { ...a, status: 'accepted', updatedAt: new Date().toISOString() } : a
            );
            localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(updatedApps));

            // 2. Relational Link: Update startup to note it's now IN this incubator and cohort
            const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
            const updatedStartups = allStartups.map(s =>
                s.startupId === app.startupId ? {
                    ...s,
                    incubatorAssigned: user.uid,
                    cohortId: cohortId || null,
                    applicationStatus: 'accepted',
                    updatedAt: new Date().toISOString()
                } : s
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

    const assignMentorToStartup = (mentorId, startupId) => {
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s =>
            s.startupId === startupId ? { ...s, mentorAssigned: mentorId, updatedAt: new Date().toISOString() } : s
        );
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const removeMentorAssignment = (mentorId, startupId) => {
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s =>
            s.startupId === startupId ? { ...s, mentorAssigned: null, updatedAt: new Date().toISOString() } : s
        );
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const { updateProfile: authUpdate } = useAuth();

    const updateProfile = (updatedData) => {
        // Sync with unified profile storage
        const updates = {
            ...updatedData,
            portalData: {
                ...(user.portalData || {}),
                ...updatedData
            }
        };
        authUpdate(updates);

        // Registry Sync: Keep vanguard_incubators up to date for public discovery
        const allIncubators = JSON.parse(localStorage.getItem('vanguard_incubators') || '[]');
        const index = allIncubators.findIndex(inc => inc.id === user.uid);

        const firmProfile = {
            ...(allIncubators[index] || {}),
            ...updatedData,
            id: user.uid,
            updatedAt: new Date().toISOString()
        };

        if (index > -1) {
            allIncubators[index] = firmProfile;
        } else {
            allIncubators.push(firmProfile);
        }
        localStorage.setItem('vanguard_incubators', JSON.stringify(allIncubators));

        refreshData();
    };

    const onboardStartup = (startupData) => {
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');

        // Generate a new startup record
        const newStartup = {
            startupId: `ST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            founderId: `GUEST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Mock ID for manually onboarded
            startupName: startupData.name || 'New Startup',
            sector: startupData.sector || 'General',
            stage: startupData.stage || 'Idea',
            oneLiner: startupData.oneLiner || '',
            executionScore: 0,
            incubatorAssigned: user.uid,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            activity: [{
                id: `act_${Date.now()}`,
                message: 'Venture onboarded by incubator.',
                type: 'info',
                timestamp: new Date().toISOString()
            }]
        };

        localStorage.setItem(KEYS.STARTUPS, JSON.stringify([...allStartups, newStartup]));
        refreshData();
        return newStartup;
    };

    const onboardMentor = (mentorData) => {
        const allUsersRaw = localStorage.getItem('vanguard_users');
        let allUsers = {};
        try {
            allUsers = JSON.parse(allUsersRaw || '{}');
            if (Array.isArray(allUsers)) {
                allUsers = allUsers.reduce((acc, u) => {
                    if (u.uid || u.id) acc[u.uid || u.id] = u;
                    return acc;
                }, {});
            }
        } catch (e) { allUsers = {}; }

        const mentorId = `MNT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const newMentor = {
            uid: mentorId,
            name: mentorData.name,
            email: mentorData.email || `${mentorData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
            role: 'mentor',
            expertise: mentorData.expertise || [],
            bio: mentorData.bio || '',
            onboardedBy: user.uid,
            createdAt: new Date().toISOString()
        };

        allUsers[mentorId] = newMentor;
        localStorage.setItem('vanguard_users', JSON.stringify(allUsers));
        refreshData();
        return newMentor;
    };

    const inviteMentor = (mentorData) => {
        // In a real app, this sends an email. Here, we'll just log it or add to a mock list.
        console.log('Inviting mentor:', mentorData);
        // We could also save to a 'vanguard_pending_invites' key if needed.
    };

    const analytics = useMemo(() => {
        const totalStartups = pipeline.length;
        const stageDistribution = pipeline.reduce((acc, s) => {
            acc[s.stage] = (acc[s.stage] || 0) + 1;
            return acc;
        }, {});

        const totalApps = applications.length;
        const acceptedApps = applications.filter(a => a.status === 'accepted').length;
        const pendingApps = applications.filter(a => a.status === 'pending').length;
        const acceptedRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;

        const totalExecScore = pipeline.reduce((acc, s) => acc + (s.executionScore || 0), 0);
        const avgExecutionScore = totalStartups > 0 ? Math.round(totalExecScore / totalStartups) : 0;

        return {
            totalStartups,
            stageDistribution,
            acceptedRate: `${acceptedRate}%`,
            activeApps: pendingApps,
            avgExecutionScore,
            cohortSize: pipeline.filter(s => s.cohortId).length,
            graduated: pipeline.filter(s => s.status === 'graduated').length
        };
    }, [pipeline, applications]);

    // Derived alerts based on pipeline and applications
    const alerts = useMemo(() => {
        const list = [];
        const pendingCount = applications.filter(a => a.status === 'pending').length;
        if (pendingCount > 0) {
            list.push({
                id: 'pending_apps',
                type: 'warning',
                message: `You have ${pendingCount} pending applications requiring review.`,
                timestamp: new Date().toISOString()
            });
        }

        const lowExecutionStartups = pipeline.filter(s => (s.executionScore || 0) < 40);
        if (lowExecutionStartups.length > 0) {
            list.push({
                id: 'low_execution',
                type: 'critical',
                message: `${lowExecutionStartups.length} startups have execution scores below 40%.`,
                timestamp: new Date().toISOString()
            });
        }

        return list;
    }, [applications, pipeline]);

    // Combined activity feed from all startups in pipeline
    const activityFeed = useMemo(() => {
        const feed = pipeline.flatMap(s => (s.activity || []).map(a => ({
            ...a,
            startupName: s.startupName,
            startupId: s.startupId
        })));
        return feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    }, [pipeline]);

    const createCohort = (cohortData) => {
        const allCohorts = JSON.parse(localStorage.getItem('vanguard_cohorts') || '[]');
        const newCohort = {
            ...cohortData,
            id: `COH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            incubatorId: user.uid,
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('vanguard_cohorts', JSON.stringify([...allCohorts, newCohort]));
        refreshData();
    };

    const value = {
        profile,
        updateProfile,
        pipeline,
        applications,
        cohorts,
        mentors,
        acceptApplication,
        rejectApplication,
        onboardStartup,
        onboardMentor,
        assignMentorToStartup,
        removeMentorAssignment,
        inviteMentor,
        createCohort,
        analytics,
        alerts,
        activityFeed,
        settings,
        updateSettings,
        loading
    };

    return (
        <IncubatorContext.Provider value={value}>
            {!loading && children}
        </IncubatorContext.Provider>
    );
};
