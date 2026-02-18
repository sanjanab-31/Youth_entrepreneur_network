
import React, { createContext, useContext, useState, useEffect } from 'react';

const MentorContext = createContext();

export const useMentor = () => useContext(MentorContext);

const STORAGE_KEYS = {
    PROFILE: 'vanguardMentorProfile',
    REQUESTS: 'vanguardMentorRequests',
    MENTEES: 'vanguardMentorMentees',
    SESSIONS: 'vanguardMentorSessions',
    ACTIVITY: 'vanguardMentorActivityFeed',
    STATS: 'vanguardMentorStats'
};

export const MentorProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultProfile = {
        name: "Arjun",
        expertise: "FinTech | 12+ Years Experience",
        sector: "FinTech",
        badge: "Mentor Badge",
        availability: {
            status: "Active",
            days: ["Mon", "Wed", "Fri"],
            sessionType: "1:1"
        }
    };

    const defaultRequests = [
        { id: 1, founderName: "David Chen", startupName: "PayFlow", stage: "MVP", sector: "FinTech", executionScore: 75, traction: "500+ Beta Users", message: "Looking for advice on scaling our payment infrastructure.", status: "pending", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 2, founderName: "Sarah Smith", startupName: "GreenTech", stage: "Revenue", sector: "CleanTech", executionScore: 82, traction: "$10k MRR", message: "Seeking guidance on seed round strategy.", status: "pending", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: 3, founderName: "Michael Wang", startupName: "CloudScale", stage: "Revenue", sector: "SaaS", executionScore: 90, traction: "$50k MRR", message: "Help with B2B sales motion.", status: "pending", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() }
    ];

    const defaultMentees = [
        { id: 101, founderName: "Sarah Jenkins", startupName: "EcoFlow", stage: "Seed", sector: "Energy", traction: "$20k MRR", executionScore: 85 },
        { id: 102, founderName: "Alex Rivera", startupName: "Nexus AI", stage: "MVP", sector: "AI/ML", traction: "Partnership with 3 labs", executionScore: 70 }
    ];

    const defaultSessions = [
        { id: 1, founderName: "Sarah Jenkins", startupName: "EcoFlow", stage: "Seed", date: "2026-10-24", time: "10:30 AM", status: "upcoming", notes: "" },
        { id: 2, founderName: "Alex Rivera", startupName: "Nexus AI", stage: "MVP", date: "2026-10-25", time: "02:00 PM", status: "upcoming", notes: "" },
        { id: 3, founderName: "Michael Chen", startupName: "PayBolt", stage: "Revenue", date: "2026-10-25", time: "04:30 PM", status: "upcoming", notes: "" }
    ];

    const defaultActivity = [
        { id: 1, type: "request", message: "Received a new mentorship request from PayFlow", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: 2, type: "session", message: "Completed session with BioSense", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() }
    ];

    useEffect(() => {
        const loadData = (key, defaultValue) => {
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error(`Failed to parse ${key}`, e);
                    return defaultValue;
                }
            }
            return defaultValue;
        };

        setProfile(loadData(STORAGE_KEYS.PROFILE, defaultProfile));
        setRequests(loadData(STORAGE_KEYS.REQUESTS, defaultRequests));
        setMentees(loadData(STORAGE_KEYS.MENTEES, defaultMentees));
        setSessions(loadData(STORAGE_KEYS.SESSIONS, defaultSessions));
        setActivity(loadData(STORAGE_KEYS.ACTIVITY, defaultActivity));
        setLoading(false);
    }, []);

    // Persist to localStorage whenever state changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
            localStorage.setItem(STORAGE_KEYS.MENTEES, JSON.stringify(mentees));
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
            localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
        }
    }, [profile, requests, mentees, sessions, activity, loading]);

    const addActivity = (message, type = "info") => {
        const newLog = {
            id: Date.now(),
            type,
            message,
            timestamp: new Date().toISOString()
        };
        setActivity(prev => [newLog, ...prev]);
    };

    const acceptRequest = (requestId) => {
        const request = requests.find(r => r.id === requestId);
        if (request && request.status === 'pending') {
            // Update request status to 'accepted' instead of removing
            setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));

            // Add to mentees if not already present
            setMentees(prev => {
                if (prev.find(m => m.id === requestId)) return prev;
                const newMentee = {
                    ...request,
                    joinedAt: new Date().toISOString()
                };
                return [...prev, newMentee];
            });

            // Add activity
            addActivity(`Accepted mentorship request from ${request.founderName} (${request.startupName})`, "success");

            // Auto-create initial session
            const initialSession = {
                id: Date.now() + 1,
                founderName: request.founderName,
                startupName: request.startupName,
                stage: request.stage,
                date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
                time: "11:00 AM",
                status: "upcoming",
                notes: ""
            };
            setSessions(prev => [initialSession, ...prev]);
        }
    };

    const declineRequest = (requestId) => {
        const request = requests.find(r => r.id === requestId);
        if (request && request.status === 'pending') {
            setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'declined' } : r));
            addActivity(`Declined mentorship request from ${request.founderName}`, "warning");
        }
    };

    const updateSession = (sessionId, updates) => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));

        if (updates.status === 'completed') {
            const session = sessions.find(s => s.id === sessionId);
            addActivity(`Completed session with ${session.founderName}`, "success");
        } else if (updates.status === 'cancelled') {
            const session = sessions.find(s => s.id === sessionId);
            addActivity(`Cancelled session with ${session.founderName}`, "error");
        }
    };

    const updateProfile = (newData) => {
        setProfile(prev => ({ ...prev, ...newData }));
        addActivity(`Updated availability and profile settings`, "info");
    };

    // Stats Calculation
    const stats = {
        pendingRequests: requests.filter(r => r.status === "pending").length,
        activeMentees: mentees.length,
        sessionsThisWeek: sessions.filter(s => {
            if (s.status !== 'upcoming') return false;
            const sessionDate = new Date(s.date);
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return sessionDate >= today && sessionDate <= nextWeek;
        }).length,
        responseRate: (() => {
            const total = requests.length;
            if (total === 0) return 100;
            const responded = requests.filter(r => r.status !== 'pending').length;
            // The prompt says Response Rate = (acceptedRequests / totalRequests) * 100
            // But usually response rate is (responded / total). 
            // Let's stick to the prompt's specific formula if it meant that, 
            // but "accepted" only would be "Success/Acceptance Rate".
            // Prompt: "Response Rate = (acceptedRequests / totalRequests) × 100"
            const accepted = requests.filter(r => r.status === 'accepted').length; // Wait, I remove them from requests when accepted in my logic?
            // If I remove them, I need to keep track of total requests ever received.
            // Let's change the logic to keep requests but update status.
            return Math.round((accepted / total) * 100);
        })()
    };

    // Refined Stats Logic to match prompt exactly
    const calculateStats = () => {
        const pending = requests.filter(r => r.status === 'pending').length;
        const activeMenteesCount = mentees.length;

        // Sessions this week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (6 - now.getDay()));

        const sessionsWeek = sessions.filter(s => {
            const d = new Date(s.date);
            return d >= startOfWeek && d <= endOfWeek;
        }).length;

        // Response Rate
        // If I move accepted requests to mentees, I need a tally or keep them in requests.
        // Let's keep them in requests with 'accepted' status for calculation.
        // I'll adjust acceptRequest to not filter out but change status.

        // Wait, if I change status to 'accepted', I should probably also have them in mentees.
        // Let's recalculate based on state.

        // Let's rethink: Total Requests = pending + accepted + declined.
        const accepted = requests.filter(r => r.status === 'accepted').length;
        const declined = requests.filter(r => r.status === 'declined').length;
        const total = pending + accepted + declined;
        const rate = total > 0 ? Math.round((accepted / total) * 100) : 100;

        return {
            pendingRequests: pending,
            activeMentees: activeMenteesCount,
            sessionsThisWeek: sessionsWeek,
            responseRate: rate
        };
    };

    const value = {
        profile,
        requests,
        mentees,
        sessions,
        activity,
        stats: calculateStats(),
        acceptRequest,
        declineRequest,
        updateSession,
        updateProfile,
        addActivity,
        loading
    };

    return (
        <MentorContext.Provider value={value}>
            {!loading && children}
        </MentorContext.Provider>
    );
};
