
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const IncubatorContext = createContext();

export const useIncubator = () => useContext(IncubatorContext);

const KEYS = {
    PROFILE: 'incubatorProfile',
    PIPELINE: 'startupPipeline',
    APPLICATIONS: 'startupApplications',
    COHORTS: 'incubatorCohorts',
    MENTORS: 'incubatorMentors',
    ACTIVITY: 'incubatorActivityFeed',
    SETTINGS: 'incubatorSettings'
};

export const IncubatorProvider = ({ children }) => {
    // Helper to get data from localStorage or fallback
    const getStored = (key, fallback) => {
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error(`Failed to parse ${key}`, e);
            }
        }
        return fallback;
    };

    // --- SEED DATA ---
    const initialProfile = {
        name: "Vanguard Innovation Hub",
        sectorFocus: ["Fintech", "Healthtech", "AI/ML", "SaaS"],
        batchSize: 15,
        location: "Bangalore, India",
        successStats: {
            graduated: 124,
            raised: "₹45Cr+",
            active: 42
        },
        website: "https://vanguardhub.io",
        description: "Vanguard is a global venture catalyst focused on empowering the next generation of mission-driven founders. We provide institutional-grade support, deep mentor networks, and strategic capital to bridge the gap between MVP and global scale.",
        programHighlights: [
            "12-week intensive execution sprints",
            "Direct access to Tier-1 VC network",
            "AWS / GCP Cloud Credits up to $100k",
            "Dedicated legal and compliance desk"
        ],
        stagePreference: "Idea / MVP / Revenue",
        fundingSupport: "Yes (Up to ₹50L Equity-free)",
        logo: null
    };

    const initialPipeline = [
        {
            id: 1,
            name: "CloudScale",
            stage: "Growth",
            sector: "SaaS",
            executionScore: 88,
            traction: "15% MoM",
            lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            watchlist: false,
            mentorId: 'm1',
            location: "San Francisco, CA",
            problem: "Legacy scaling solutions are too complex for mid-market SaaS.",
            solution: "Automated infrastructure optimization using AI agents.",
            team: "4 Co-founders, 12 Engineers",
            revenue: "$120k ARR",
            milestones: ["Series A Closed", "100+ Customers", "SOC2 Compliant"],
            founder: "Liam Vance"
        },
        {
            id: 2,
            name: "EcoTrack",
            stage: "Seed",
            sector: "Greentech",
            executionScore: 72,
            traction: "Beta",
            lastUpdated: new Date().toISOString(),
            watchlist: true,
            mentorId: null,
            location: "Oslo, Norway",
            problem: "Carbon credit market is opaque and lacks verification.",
            solution: "Blockchain-based IoT sensors for real-time carbon auditing.",
            team: "2 Co-founders, 3 Engineers",
            revenue: "Pre-revenue",
            milestones: ["Pilot with 5 Logistics Firms", "IoT V2 Ready"],
            founder: "Ingrid Sjoberg"
        },
        {
            id: 3,
            name: "Nexus AI",
            stage: "Pre-seed",
            sector: "AI",
            executionScore: 65,
            traction: "Waitlist",
            lastUpdated: new Date().toISOString(),
            watchlist: false,
            mentorId: null,
            location: "Berlin, Germany",
            problem: "Personal data privacy in LLM training is a bottleneck for enterprise.",
            solution: "Differential privacy layer for custom LLM fine-tuning.",
            team: "2 Ph.D Founders",
            revenue: "Pre-revenue",
            milestones: ["Algorithm Patent Pending", "Initial Research Paper Published"],
            founder: "Hans Mueller"
        }
    ];

    const initialApplications = [
        { id: 101, name: "Quantum Pay", sector: "Fintech", problem: "Slow cross-border payments", solution: "Blockchain-based settling", traction: "$5k MRR", teamSize: 3, documents: ["Pitch_Deck.pdf", "Financials.xlsx"], status: "pending", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 102, name: "HealthSync", sector: "Healthtech", problem: "Data silos in hospitals", solution: "Unified API for HER", traction: "Pilot with 2 clinics", teamSize: 4, documents: ["Deck.pdf"], status: "pending", createdAt: new Date().toISOString() }
    ];

    const initialCohorts = [
        { id: 'c1', name: "Batch 2024 - Spring", startDate: "2024-03-01", endDate: "2024-05-30", status: "active", startups: [1], mentors: ['m1'] },
        { id: 'c2', name: "Batch 2023 - Winter", startDate: "2023-11-01", endDate: "2024-02-15", status: "completed", startups: [2], mentors: ['m2'] }
    ];

    const initialMentors = [
        { id: 'm1', name: "Sarah Chen", expertise: "Scaling / SaaS", availability: "High", responseRate: "98%", activeStartups: [1], startupsCount: 1 },
        { id: 'm2', name: "Marcus Thorne", expertise: "Fintech Compliance", availability: "Medium", responseRate: "85%", activeStartups: [], startupsCount: 0 }
    ];

    const initialActivityFeed = [
        { id: Date.now(), type: 'system', message: "Incubator portal initialized", timestamp: new Date().toISOString() }
    ];

    const initialSettings = {
        publicVisibility: true,
        notifications: {
            newApplications: true,
            mentorMessages: true,
            cohortUpdates: true,
            systemAlerts: false
        },
        batchLimits: {
            maxCapacity: 20,
            durationWeeks: 12,
            deadline: "2025-04-30"
        },
        subAdmins: [
            { name: 'Sarah Wilson', role: 'Cohort Manager', email: 'sarah@vanguard.io' }
        ]
    };

    // --- STATE ---
    const [profile, setProfile] = useState(() => getStored(KEYS.PROFILE, initialProfile));
    const [pipeline, setPipeline] = useState(() => getStored(KEYS.PIPELINE, initialPipeline));
    const [applications, setApplications] = useState(() => getStored(KEYS.APPLICATIONS, initialApplications));
    const [cohorts, setCohorts] = useState(() => getStored(KEYS.COHORTS, initialCohorts));
    const [mentors, setMentors] = useState(() => getStored(KEYS.MENTORS, initialMentors));
    const [activityFeed, setActivityFeed] = useState(() => getStored(KEYS.ACTIVITY, initialActivityFeed));
    const [settings, setSettings] = useState(() => getStored(KEYS.SETTINGS, initialSettings));
    const [loading, setLoading] = useState(false);

    // --- PERSISTENCE ---
    useEffect(() => localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)), [profile]);
    useEffect(() => localStorage.setItem(KEYS.PIPELINE, JSON.stringify(pipeline)), [pipeline]);
    useEffect(() => localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications)), [applications]);
    useEffect(() => localStorage.setItem(KEYS.COHORTS, JSON.stringify(cohorts)), [cohorts]);
    useEffect(() => localStorage.setItem(KEYS.MENTORS, JSON.stringify(mentors)), [mentors]);
    useEffect(() => localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(activityFeed)), [activityFeed]);
    useEffect(() => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings)), [settings]);

    // --- ACTIONS ---
    const addActivity = (message, type = 'update') => {
        const newLog = {
            id: Date.now(),
            type,
            message,
            timestamp: new Date().toISOString()
        };
        setActivityFeed(prev => [newLog, ...prev]);
    };

    const updateProfile = (data) => {
        setProfile(prev => ({ ...prev, ...data }));
        addActivity("Incubator profile updated", "profile");
    };

    const toggleWatchlist = (id) => {
        setPipeline(prev => prev.map(s => s.id === id ? { ...s, watchlist: !s.watchlist } : s));
        const startup = pipeline.find(s => s.id === id);
        addActivity(`${startup?.name} ${startup?.watchlist ? 'removed from' : 'added to'} watchlist`, "pipeline");
    };

    const inviteToApply = (startupData) => {
        const newApp = {
            id: Date.now(),
            ...startupData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        setApplications(prev => [newApp, ...prev]);
        addActivity(`Invited ${startupData.name} to apply`, "pipeline");
    };

    const acceptApplication = (appId, cohortId) => {
        const app = applications.find(a => a.id === appId);
        if (!app) return;

        setApplications(prev => prev.filter(a => a.id !== appId));

        const newStartup = {
            ...app,
            stage: "Accepted",
            executionScore: 50,
            lastUpdated: new Date().toISOString(),
            watchlist: false,
            mentorId: null,
            cohortId: cohortId || null
        };

        setPipeline(prev => [...prev, newStartup]);

        if (cohortId) {
            setCohorts(prev => prev.map(c => c.id === cohortId ? { ...c, startups: [...c.startups, newStartup.id] } : c));
        }

        addActivity(`${app.name} accepted into ${cohortId ? 'Cohort' : 'Pipeline'}`, "success");
    };

    const rejectApplication = (appId) => {
        const app = applications.find(a => a.id === appId);
        setApplications(prev => prev.filter(a => a.id !== appId));
        addActivity(`Application from ${app?.name} rejected`, "reject");
    };

    const createCohort = (cohortData) => {
        const newCohort = {
            id: `c-${Date.now()}`,
            ...cohortData,
            status: 'active',
            startups: [],
            mentors: []
        };
        setCohorts(prev => [...prev, newCohort]);
        addActivity(`New cohort created: ${cohortData.name}`, "cohort");
    };

    const updateCohort = (id, updates) => {
        setCohorts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const assignMentorToStartup = (mentorId, startupId) => {
        setMentors(prev => prev.map(m => {
            if (m.id === mentorId) {
                return { ...m, activeStartups: [...new Set([...m.activeStartups, startupId])], startupsCount: m.activeStartups.length + 1 };
            }
            return m;
        }));
        setPipeline(prev => prev.map(s => s.id === startupId ? { ...s, mentorId } : s));

        const mentor = mentors.find(m => m.id === mentorId);
        const startup = pipeline.find(s => s.id === startupId);
        addActivity(`Assigned ${mentor?.name} to ${startup?.name}`, "mentor");
    };

    const removeMentorAssignment = (mentorId, startupId) => {
        setMentors(prev => prev.map(m => {
            if (m.id === mentorId) {
                const updated = m.activeStartups.filter(id => id !== startupId);
                return { ...m, activeStartups: updated, startupsCount: updated.length };
            }
            return m;
        }));
        setPipeline(prev => prev.map(s => s.id === startupId ? { ...s, mentorId: null } : s));
        addActivity(`Removed mentor assignment for ${startupId}`, "mentor");
    };

    const inviteMentor = (mentorData) => {
        const newMentor = {
            id: `m-${Date.now()}`,
            ...mentorData,
            status: 'invited',
            activeStartups: [],
            startupsCount: 0,
            rating: 5.0
        };
        setMentors(prev => [...prev, newMentor]);
        addActivity(`Invited ${mentorData.name} to join as mentor`, "mentor");
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    // --- ANALYTICS CALCULATIONS ---
    const analytics = useMemo(() => {
        const totalStartups = pipeline.length;
        const activeApps = applications.filter(a => a.status === 'pending').length;

        let cohortSize = 0;
        let graduated = 0;
        cohorts.forEach(c => {
            if (c.status === 'active') cohortSize += c.startups.length;
            if (c.status === 'completed') graduated += c.startups.length;
        });

        const assignedMentors = mentors.filter(m => m.activeStartups.length > 0).length;
        const mentorUtilization = mentors.length > 0 ? (assignedMentors / mentors.length) * 100 : 0;

        const avgExecution = totalStartups > 0 ? pipeline.reduce((acc, s) => acc + s.executionScore, 0) / totalStartups : 0;

        return {
            totalStartups,
            activeApps,
            cohortSize,
            graduated: graduated + (profile.successStats?.graduated || 0),
            mentorUtilization: Math.round(mentorUtilization),
            avgExecution: Math.round(avgExecution),
            stageDistribution: pipeline.reduce((acc, s) => {
                acc[s.stage] = (acc[s.stage] || 0) + 1;
                return acc;
            }, {}),
            gradRate: "82%", // Mock for now or calculated
            convRate: "12%"  // Mock for now or calculated
        };
    }, [pipeline, applications, cohorts, mentors, profile.successStats]);

    // --- ALERTS LOGIC ---
    const alerts = useMemo(() => {
        const newAlerts = [];
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        applications.forEach(app => {
            if (new Date(app.createdAt) < sevenDaysAgo) {
                newAlerts.push({ id: `app-${app.id}`, type: 'warning', message: `Application from ${app.name} is older than 7 days` });
            }
        });

        pipeline.forEach(s => {
            if (!s.mentorId) {
                newAlerts.push({ id: `mentor-${s.id}`, type: 'info', message: `${s.name} has no assigned mentor` });
            }
            if (new Date(s.lastUpdated) < fourteenDaysAgo) {
                newAlerts.push({ id: `traction-${s.id}`, type: 'error', message: `No traction update from ${s.name} in 14 days` });
            }
        });

        cohorts.forEach(c => {
            if (c.status === 'active') {
                const end = new Date(c.endDate);
                const soon = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
                if (end < soon) {
                    newAlerts.push({ id: `cohort-${c.id}`, type: 'warning', message: `Cohort ${c.name} is nearing end date` });
                }
            }
        });

        return newAlerts;
    }, [applications, pipeline, cohorts]);

    const value = {
        profile, updateProfile,
        pipeline, toggleWatchlist, inviteToApply,
        applications, acceptApplication, rejectApplication,
        cohorts, createCohort, updateCohort,
        mentors, assignMentorToStartup, removeMentorAssignment, inviteMentor,
        activityFeed, addActivity,
        settings, updateSettings,
        analytics,
        alerts,
        loading
    };

    return (
        <IncubatorContext.Provider value={value}>
            {children}
        </IncubatorContext.Provider>
    );
};
