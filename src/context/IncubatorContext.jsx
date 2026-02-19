import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getSystem, saveSystem } from '../utils/system';

const IncubatorContext = createContext();

export const useIncubator = () => useContext(IncubatorContext);

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

        const system = getSystem();

        // 1. Filter applications for this incubator
        const myApplications = system.applications.filter(a => a.incubatorId === user.uid);
        setApplications(myApplications);

        // 2. Filter startups accepted into this incubator
        const myPipeline = system.startups.filter(s => s.incubatorAssigned === user.uid);
        setPipeline(myPipeline);

        // 3. Filter cohorts managed by this incubator
        const myCohorts = system.cohorts.filter(c => c.incubatorId === user.uid);
        setCohorts(myCohorts);

        // 4. Mentors filter (available globally)
        const mentorList = Object.values(system.users).filter(u => u.role === 'mentor');
        setMentors(mentorList);

        // 5. Settings & Profile
        setProfile({ ...user, ...(user.portalData || {}), id: user.uid });
        const savedSettings = localStorage.getItem(`vanguard_incubatorSettings_${user.uid}`);
        setSettings(savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS);

        setLoading(false);
    };

    useEffect(() => {
        refreshData();
        const handleStorage = () => refreshData();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [user]);

    const updateSystem = (mutationFn) => {
        const system = getSystem();
        mutationFn(system);
        saveSystem(system);
        refreshData();
    };

    // --- APPLICATION MANAGEMENT ---
    const acceptApplication = (appId, cohortId) => {
        updateSystem(system => {
            const app = system.applications.find(a => a.id === appId);
            if (!app) return;

            // 1. Update Application status
            app.status = 'accepted';
            app.updatedAt = new Date().toISOString();

            // 2. Update Startup relational links
            system.startups = system.startups.map(s => {
                if (s.startupId === app.startupId) {
                    return {
                        ...s,
                        incubatorAssigned: user.uid,
                        cohortId: cohortId || null,
                        applicationStatus: 'accepted',
                        updatedAt: new Date().toISOString()
                    };
                }
                return s;
            });

            // 3. Add Startup to Incubator's active list
            system.incubators = system.incubators.map(inc => {
                if (inc.id === user.uid) {
                    return {
                        ...inc,
                        activeCohorts: Array.from(new Set([...(inc.activeCohorts || []), app.founderId]))
                    };
                }
                return inc;
            });
        });
    };

    const rejectApplication = (appId) => {
        updateSystem(system => {
            const app = system.applications.find(a => a.id === appId);
            if (!app) return;

            app.status = 'rejected';
            app.updatedAt = new Date().toISOString();

            system.startups = system.startups.map(s =>
                s.startupId === app.startupId ? { ...s, applicationStatus: 'rejected', updatedAt: new Date().toISOString() } : s
            );
        });
    };

    // --- MENTOR MANAGEMENT ---
    const assignMentorToStartup = (mentorId, startupId) => {
        updateSystem(system => {
            system.startups = system.startups.map(s =>
                s.startupId === startupId ? { ...s, mentorAssigned: mentorId, updatedAt: new Date().toISOString() } : s
            );
        });
    };

    const removeMentorAssignment = (mentorId, startupId) => {
        updateSystem(system => {
            system.startups = system.startups.map(s =>
                s.startupId === startupId ? { ...s, mentorAssigned: null, updatedAt: new Date().toISOString() } : s
            );
        });
    };

    // --- ONBOARDING ---
    const onboardStartup = (startupData) => {
        const newStartup = {
            startupId: `ST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            founderId: `GUEST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            startupName: startupData.name || 'New Startup',
            sector: startupData.sector || 'General',
            stage: startupData.stage || 'Idea',
            oneLiner: startupData.oneLiner || '',
            executionScore: 0,
            incubatorAssigned: user.uid,
            status: 'active',
            activity: [{ id: `act_${Date.now()}`, message: 'Onboarded by incubator.', type: 'info', timestamp: new Date().toISOString() }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        updateSystem(system => {
            system.startups.push(newStartup);
        });
        return newStartup;
    };

    const onboardMentor = (mentorData) => {
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

        updateSystem(system => {
            system.users[mentorId] = newMentor;
        });
        return newMentor;
    };

    const createCohort = (cohortData) => {
        const newCohort = {
            ...cohortData,
            id: `COH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            incubatorId: user.uid,
            status: 'active',
            progress: 0,
            createdAt: new Date().toISOString()
        };
        updateSystem(system => {
            system.cohorts.push(newCohort);
        });
    };

    // --- ANALYTICS & ALERTS ---
    const analytics = useMemo(() => {
        const totalStartups = pipeline.length;
        const totalApps = applications.length;
        const acceptedApps = applications.filter(a => a.status === 'accepted').length;
        const acceptedRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;
        const totalExecScore = pipeline.reduce((acc, s) => acc + (s.executionScore || 0), 0);
        const avgExecutionScore = totalStartups > 0 ? Math.round(totalExecScore / totalStartups) : 0;

        return {
            totalStartups,
            acceptedRate: `${acceptedRate}%`,
            activeApps: applications.filter(a => a.status === 'pending').length,
            avgExecutionScore,
            cohortSize: pipeline.filter(s => s.cohortId).length,
            graduated: pipeline.filter(s => s.status === 'graduated').length
        };
    }, [pipeline, applications]);

    const alerts = useMemo(() => {
        const list = [];
        const pendingCount = applications.filter(a => a.status === 'pending').length;
        if (pendingCount > 0) {
            list.push({ id: 'pending_apps', type: 'warning', message: `You have ${pendingCount} pending applications.`, timestamp: new Date().toISOString() });
        }
        const lowExec = pipeline.filter(s => (s.executionScore || 0) < 40);
        if (lowExec.length > 0) {
            list.push({ id: 'low_exec', type: 'critical', message: `${lowExec.length} startups have low execution score.`, timestamp: new Date().toISOString() });
        }
        return list;
    }, [applications, pipeline]);

    const activityFeed = useMemo(() => {
        const feed = pipeline.flatMap(s => (s.activity || []).map(a => ({ ...a, startupName: s.startupName, startupId: s.startupId })));
        return feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    }, [pipeline]);

    const value = {
        profile,
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
        createCohort,
        analytics,
        alerts,
        activityFeed,
        settings,
        updateSettings: (s) => { setSettings(s); localStorage.setItem(`vanguard_incubatorSettings_${user.uid}`, JSON.stringify(s)); refreshData(); },
        loading
    };

    return (
        <IncubatorContext.Provider value={value}>
            {!loading && children}
        </IncubatorContext.Provider>
    );
};
