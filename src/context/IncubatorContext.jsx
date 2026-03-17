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

    const getLastUpdateTime = (startup) => {
        const milestoneTimes = (startup.milestones || [])
            .map(ms => (typeof ms === 'object' ? (ms.updatedAt || ms.completedAt || ms.createdAt || ms.timestamp) : null))
            .filter(Boolean)
            .map(t => new Date(t).getTime())
            .filter(Number.isFinite);

        const activityTimes = (startup.activity || [])
            .map(a => new Date(a.timestamp).getTime())
            .filter(Number.isFinite);

        const directTimes = [startup.updatedAt, startup.createdAt]
            .filter(Boolean)
            .map(t => new Date(t).getTime())
            .filter(Number.isFinite);

        const allTimes = [...directTimes, ...activityTimes, ...milestoneTimes];
        return allTimes.length ? Math.max(...allTimes) : 0;
    };

    const hasRecentUpdate = (startup, days = 14) => {
        const lastUpdate = getLastUpdateTime(startup);
        if (!lastUpdate) return false;
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return lastUpdate >= cutoff;
    };

    const isAtRiskStartup = (startup) => {
        const noMilestones = !startup.milestones || startup.milestones.length === 0;
        const lowExecution = (startup.executionScore || 0) < 40;
        const stale = !hasRecentUpdate(startup, 14);
        return noMilestones || lowExecution || stale;
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
            const mentor = system.users?.[mentorId];
            const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

            system.startups = system.startups.map(s =>
                s.startupId === startupId
                    ? {
                        ...s,
                        mentorAssigned: mentorId,
                        mentorshipStartDate: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        activity: [{
                            id: `act_${Date.now()}`,
                            message: `Incubator assigned mentor ${mentorName}`,
                            type: 'mentor',
                            timestamp: new Date().toISOString()
                        }, ...(s.activity || [])].slice(0, 50)
                    }
                    : s
            );
        });
    };

    const removeMentorAssignment = (mentorId, startupId) => {
        updateSystem(system => {
            const mentor = system.users?.[mentorId];
            const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

            system.startups = system.startups.map(s =>
                s.startupId === startupId
                    ? {
                        ...s,
                        mentorAssigned: null,
                        updatedAt: new Date().toISOString(),
                        activity: [{
                            id: `act_${Date.now()}`,
                            message: `Incubator removed mentor ${mentorName}`,
                            type: 'warning',
                            timestamp: new Date().toISOString()
                        }, ...(s.activity || [])].slice(0, 50)
                    }
                    : s
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
            solutionOverview: startupData.oneLiner || '',
            problemStatement: startupData.problemStatement || '',
            targetAudience: [],
            marketInfo: '',
            growth: '',
            revenue: '',
            activeUsers: 0,
            demoLink: '',
            pitchDeckLink: '',
            executionScore: 0,
            incubatorAssigned: user.uid,
            status: 'active',
            milestones: [],
            documents: [],
            coFounders: [],
            focusAreas: [],
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
        const expertise = Array.isArray(mentorData.expertise)
            ? mentorData.expertise
            : (mentorData.expertise || mentorData.primarySkills || '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);

        const availability = {
            status: 'Available',
            days: ['Mon', 'Wed', 'Fri'],
            workload: 0,
            sessionType: '1:1',
            ...(mentorData.availability || {})
        };

        const newMentor = {
            uid: mentorId,
            name: mentorData.name,
            email: mentorData.email || `${mentorData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
            role: 'mentor',
            expertise: expertise.length > 0 ? expertise : ['General Mentorship'],
            sector: mentorData.sector || 'General',
            company: mentorData.company || '',
            linkedin: mentorData.linkedin || '',
            bio: mentorData.bio || 'Mentor profile created by incubator.',
            availability,
            badge: mentorData.badge || 'Verified',
            portalData: {
                sector: mentorData.sector || 'General',
                company: mentorData.company || '',
                currentRole: mentorData.currentRole || '',
                capacity: Number(mentorData.capacity) || 5,
                availability,
                badge: mentorData.badge || 'Verified'
            },
            onboardedBy: user.uid,
            createdAt: new Date().toISOString()
        };

        updateSystem(system => {
            system.users[mentorId] = newMentor;
        });
        return newMentor;
    };

    const createCohort = (cohortData) => {
        const nowIso = new Date().toISOString();
        const newCohort = {
            id: `COH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            incubatorId: user.uid,
            name: cohortData.name,
            startDate: cohortData.startDate,
            endDate: cohortData.endDate,
            maxCapacity: Number(cohortData.maxCapacity) || 20,
            sectorFocus: cohortData.sectorFocus || '',
            startupIds: [],
            status: 'upcoming',
            createdAt: nowIso,
            updatedAt: nowIso
        };

        updateSystem(system => {
            system.cohorts.push(newCohort);
        });
    };

    const assignStartupToCohort = (startupId, cohortId) => {
        updateSystem(system => {
            const targetCohort = system.cohorts.find(c => c.id === cohortId && c.incubatorId === user.uid);
            if (!targetCohort) return;

            const startup = system.startups.find(s => s.startupId === startupId && s.incubatorAssigned === user.uid);
            if (!startup) return;

            const previousCohortId = startup.cohortId;

            system.startups = system.startups.map(s => {
                if (s.startupId !== startupId) return s;
                return {
                    ...s,
                    cohortId,
                    updatedAt: new Date().toISOString(),
                    activity: [{
                        id: `act_${Date.now()}`,
                        message: `Added to cohort ${targetCohort.name}`,
                        type: 'cohort',
                        timestamp: new Date().toISOString()
                    }, ...(s.activity || [])].slice(0, 50)
                };
            });

            system.cohorts = system.cohorts.map(c => {
                const startupIds = Array.isArray(c.startupIds) ? c.startupIds : [];

                if (c.id === previousCohortId) {
                    return {
                        ...c,
                        startupIds: startupIds.filter(id => id !== startupId),
                        updatedAt: new Date().toISOString()
                    };
                }

                if (c.id === cohortId) {
                    return {
                        ...c,
                        startupIds: Array.from(new Set([...startupIds, startupId])),
                        updatedAt: new Date().toISOString()
                    };
                }

                return c;
            });
        });
    };

    const removeStartupFromCohort = (startupId, cohortId) => {
        updateSystem(system => {
            const cohort = system.cohorts.find(c => c.id === cohortId && c.incubatorId === user.uid);
            if (!cohort) return;

            system.startups = system.startups.map(s => {
                if (s.startupId !== startupId) return s;
                return {
                    ...s,
                    cohortId: null,
                    updatedAt: new Date().toISOString(),
                    activity: [{
                        id: `act_${Date.now()}`,
                        message: `Removed from cohort ${cohort.name}`,
                        type: 'warning',
                        timestamp: new Date().toISOString()
                    }, ...(s.activity || [])].slice(0, 50)
                };
            });

            system.cohorts = system.cohorts.map(c => {
                if (c.id !== cohortId) return c;
                return {
                    ...c,
                    startupIds: (c.startupIds || []).filter(id => id !== startupId),
                    updatedAt: new Date().toISOString()
                };
            });
        });
    };

    // --- ANALYTICS & ALERTS ---
    const analytics = useMemo(() => {
        const totalStartups = pipeline.length;
        const totalApps = applications.length;
        const pendingApplications = applications.filter(a => a.status === 'pending').length;
        const acceptedApps = applications.filter(a => a.status === 'accepted').length;
        const acceptanceRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : null;
        const totalExecScore = pipeline.reduce((acc, s) => acc + (s.executionScore || 0), 0);
        const avgExecutionScore = totalStartups > 0 ? Math.round(totalExecScore / totalStartups) : 0;
        const mentorAssignedCount = pipeline.filter(s => s.mentorAssigned || s.mentorId).length;
        const mentorUtilization = totalStartups > 0 ? Math.round((mentorAssignedCount / totalStartups) * 100) : 0;
        const atRiskStartups = pipeline.filter(isAtRiskStartup).length;

        return {
            totalStartups,
            totalApplications: totalApps,
            acceptedApplications: acceptedApps,
            pendingApplications,
            acceptanceRate,
            acceptanceRateLabel: acceptanceRate === null ? 'N/A' : `${acceptanceRate}%`,
            atRiskStartups,
            avgExecutionScore,
            mentorUtilization,
            cohortSize: pipeline.filter(s => s.cohortId).length,
            graduated: pipeline.filter(s => s.status === 'graduated').length
        };
    }, [pipeline, applications]);

    const alerts = useMemo(() => {
        const list = [];

        const lowExec = pipeline.filter(s => (s.executionScore || 0) < 40);
        if (lowExec.length > 0) {
            list.push({ id: 'low_exec', type: 'critical', message: `${lowExec.length} startups have low execution score (<40).`, timestamp: new Date().toISOString() });
        }

        const inactive = pipeline.filter(s => !hasRecentUpdate(s, 14));
        if (inactive.length > 0) {
            list.push({ id: 'inactive_startups', type: 'warning', message: `${inactive.length} startups have no recent updates in the last 14 days.`, timestamp: new Date().toISOString() });
        }

        const noMentor = pipeline.filter(s => !s.mentorAssigned && !s.mentorId);
        if (noMentor.length > 0) {
            list.push({ id: 'no_mentor', type: 'warning', message: `${noMentor.length} startups do not have a mentor assigned.`, timestamp: new Date().toISOString() });
        }

        const noMilestones = pipeline.filter(s => !s.milestones || s.milestones.length === 0);
        if (noMilestones.length > 0) {
            list.push({ id: 'no_milestones', type: 'critical', message: `${noMilestones.length} startups have no milestones defined.`, timestamp: new Date().toISOString() });
        }

        return list;
    }, [pipeline]);

    const highPotentialStartups = useMemo(() => {
        return pipeline
            .filter(s => {
                const scoreOk = (s.executionScore || 0) > 60;
                const hasMilestones = (s.milestones || []).length > 0;
                const recentlyUpdated = hasRecentUpdate(s, 14);
                return scoreOk && hasMilestones && recentlyUpdated;
            })
            .sort((a, b) => {
                const scoreDelta = (b.executionScore || 0) - (a.executionScore || 0);
                if (scoreDelta !== 0) return scoreDelta;
                return getLastUpdateTime(b) - getLastUpdateTime(a);
            })
            .slice(0, 3);
    }, [pipeline]);

    const activityFeed = useMemo(() => {
        const feed = pipeline.flatMap(s => (s.activity || []).map(a => ({ ...a, startupName: s.startupName, startupId: s.startupId })));
        return feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15);
    }, [pipeline]);

    const nextBatch = useMemo(() => {
        if (!cohorts.length) return null;
        const now = new Date();
        const upcoming = cohorts
            .filter(c => c.startDate && new Date(c.startDate) >= now)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return upcoming[0] || null;
    }, [cohorts]);

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
        assignStartupToCohort,
        removeStartupFromCohort,
        analytics,
        alerts,
        highPotentialStartups,
        activityFeed,
        nextBatch,
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
