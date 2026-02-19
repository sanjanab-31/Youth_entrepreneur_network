
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateExecutionScore } from '../utils/executionScore';


const MentorContext = createContext();

export const useMentor = () => useContext(MentorContext);

const KEYS = {
    USERS: 'vanguard_users',
    STARTUPS: 'vanguard_startups',
    MENTOR_REQUESTS: 'vanguard_mentorRequests',
    SESSIONS: 'vanguard_sessions'
};

export const MentorProvider = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = () => {
        if (!user || user.role !== 'mentor') {
            setLoading(false);
            return;
        }

        // Mentor context now derives the profile directly from the SSOT user object
        setProfile({
            expertise: user.expertise || 'General Mentorship',
            sector: user.sector || 'General',
            badge: user.badge || 'Verified Mentor',
            bio: user.bio || '',
            name: user.name || 'Mentor',
            email: user.email || '',
            availability: {
                status: 'Active',
                days: ['Mon', 'Wed', 'Fri'],
                sessionType: '1:1',
                ...(user.availability || {})
            }
        });

        // Load requests, sessions, mentees for this mentor using user.uid
        const allRequests = JSON.parse(localStorage.getItem(KEYS.MENTOR_REQUESTS) || '[]');
        const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');

        setRequests(allRequests.filter(r => r.mentorId === user.uid));
        setSessions(allSessions.filter(s => s.mentorId === user.uid));
        setMentees(allStartups.filter(s => s.mentorAssigned === user.uid));
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
        window.addEventListener('storage', refreshData);
        return () => window.removeEventListener('storage', refreshData);
    }, [user]);

    // ── Mutations ──────────────────────────────────────────────

    const updateProfile = (updates) => {
        if (!user) return;
        // Use the unified AuthContext updateProfile for SSOT
        const { updateProfile: authUpdate } = useAuth();
        authUpdate(updates);
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const updateSession = (sessionId, updates) => {
        const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
        const updatedSessions = allSessions.map(s =>
            s.id === sessionId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        );
        localStorage.setItem(KEYS.SESSIONS, JSON.stringify(updatedSessions));
        refreshData();
    };

    const acceptRequest = (requestId) => {
        const allRequests = JSON.parse(localStorage.getItem(KEYS.MENTOR_REQUESTS) || '[]');
        const request = allRequests.find(r => r.id === requestId);
        if (!request) return;

        // Update request status
        const updatedRequests = allRequests.map(r =>
            r.id === requestId ? { ...r, status: 'accepted', updatedAt: new Date().toISOString() } : r
        );
        localStorage.setItem(KEYS.MENTOR_REQUESTS, JSON.stringify(updatedRequests));

        // Assign mentor to startup + log activity on the startup
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s => {
            if (s.startupId !== request.startupId) return s;
            const activityEntry = {
                id: Date.now().toString(),
                msg: `Mentor accepted your request`,
                type: 'mentor',
                time: 'Just now',
                timestamp: new Date().toISOString()
            };
            const updated = {
                ...s,
                mentorAssigned: user.uid,
                mentorshipStartDate: new Date().toISOString(),
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
            // Recalculate execution score after mentor assignment
            updated.executionScore = calculateExecutionScore(updated);
            return updated;
        });
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const declineRequest = (requestId) => {
        const allRequests = JSON.parse(localStorage.getItem(KEYS.MENTOR_REQUESTS) || '[]');
        const request = allRequests.find(r => r.id === requestId);

        const updatedRequests = allRequests.map(r =>
            r.id === requestId ? { ...r, status: 'declined', updatedAt: new Date().toISOString() } : r
        );
        localStorage.setItem(KEYS.MENTOR_REQUESTS, JSON.stringify(updatedRequests));

        // Log activity on the startup
        if (request) {
            const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
            const updatedStartups = allStartups.map(s => {
                if (s.startupId !== request.startupId) return s;
                const activityEntry = {
                    id: Date.now().toString(),
                    msg: `Mentor declined your request`,
                    type: 'warning',
                    time: 'Just now',
                    timestamp: new Date().toISOString()
                };
                return {
                    ...s,
                    activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                    updatedAt: new Date().toISOString()
                };
            });
            localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        }
        refreshData();
    };

    const scheduleSession = (startupId, date, time) => {
        const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
        // Store IDs only — never duplicate business data
        const newSession = {
            id: Date.now().toString(),
            mentorId: user.uid,
            startupId,
            date,
            time,
            status: 'upcoming',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.SESSIONS, JSON.stringify([...allSessions, newSession]));

        // Log activity on the startup
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s => {
            if (s.startupId !== startupId) return s;
            const activityEntry = {
                id: Date.now().toString(),
                msg: `Mentor scheduled a session for ${date}`,
                type: 'mentor',
                time: 'Just now',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
        });
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const confirmSessionRequest = (sessionId) => {
        const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
        const session = allSessions.find(s => s.id === sessionId);
        if (!session) return;

        const updatedSessions = allSessions.map(s =>
            s.id === sessionId ? { ...s, status: 'upcoming', updatedAt: new Date().toISOString() } : s
        );
        localStorage.setItem(KEYS.SESSIONS, JSON.stringify(updatedSessions));

        // Log activity on the startup
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s => {
            if (s.startupId !== session.startupId) return s;
            const activityEntry = {
                id: Date.now().toString(),
                msg: `Mentor confirmed your session request for ${session.date}`,
                type: 'mentor',
                time: 'Just now',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
        });
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const addFocusArea = (startupId, area) => {
        if (!area?.trim()) return;
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s => {
            if (s.startupId !== startupId) return s;
            const existing = Array.isArray(s.focusAreas) ? s.focusAreas : [];
            if (existing.includes(area.trim())) return s;
            const activityEntry = {
                id: Date.now().toString(),
                msg: `Mentor added focus area: ${area.trim()}`,
                type: 'mentor',
                time: 'Just now',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                focusAreas: [...existing, area.trim()],
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
        });
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const removeFocusArea = (startupId, area) => {
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s => {
            if (s.startupId !== startupId) return s;
            return {
                ...s,
                focusAreas: (Array.isArray(s.focusAreas) ? s.focusAreas : []).filter(f => f !== area),
                updatedAt: new Date().toISOString()
            };
        });
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const sendMessage = (startupId, messageText) => {
        if (!messageText?.trim()) return;
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s => {
            if (s.startupId !== startupId) return s;
            const newMsg = {
                id: Date.now().toString(),
                senderId: user.uid,
                senderName: user.name || 'Mentor',
                senderRole: 'mentor',
                message: messageText.trim(),
                timestamp: new Date().toISOString()
            };
            const activityEntry = {
                id: (Date.now() + 1).toString(),
                msg: `Mentor sent you a message`,
                type: 'mentor',
                time: 'Just now',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                messages: [newMsg, ...(Array.isArray(s.messages) ? s.messages : [])],
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
        });
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    // ── Derived data ───────────────────────────────────────────

    const calculateStats = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (6 - now.getDay()));

        const sessionsWeek = sessions.filter(s => {
            const d = new Date(s.date);
            return d >= startOfWeek && d <= endOfWeek;
        }).length;

        const accepted = requests.filter(r => r.status === 'accepted').length;
        const total = requests.length;

        return {
            pendingRequests: requests.filter(r => r.status === 'pending').length,
            activeMentees: mentees.length,
            sessionsThisWeek: sessionsWeek,
            responseRate: total > 0 ? Math.round((accepted / total) * 100) : 100
        };
    };

    const buildActivity = () => {
        // Hydrate names from IDs — never rely on stale duplicated data
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const allUsers = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');

        const getStartupName = (startupId) =>
            allStartups.find(s => s.startupId === startupId)?.startupName || 'Unknown Startup';
        const getFounderName = (founderId) => {
            const u = allUsers.find(u => u.uid === founderId);
            return u?.name || u?.email?.split('@')[0] || 'Unknown Founder';
        };

        const items = [];

        requests.forEach(r => {
            const startup = allStartups.find(s => s.startupId === r.startupId);
            const founderName = startup ? getFounderName(startup.founderId) : 'Unknown Founder';
            const startupName = startup?.startupName || 'Unknown Startup';
            if (r.status === 'pending') {
                items.push({ id: `req-${r.id}`, type: 'request', message: `New mentorship request from ${founderName} (${startupName})`, timestamp: r.createdAt });
            } else if (r.status === 'accepted') {
                items.push({ id: `acc-${r.id}`, type: 'success', message: `Accepted request from ${founderName}`, timestamp: r.updatedAt || r.createdAt });
            } else if (r.status === 'declined') {
                items.push({ id: `dec-${r.id}`, type: 'error', message: `Declined request from ${founderName}`, timestamp: r.updatedAt || r.createdAt });
            }
        });

        sessions.forEach(s => {
            const startupName = getStartupName(s.startupId);
            items.push({ id: `ses-${s.id}`, type: 'session', message: `Session with ${startupName} on ${s.date} at ${s.time}`, timestamp: s.createdAt });
        });

        return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const value = {
        profile,
        requests,
        mentees,
        sessions,
        activity: buildActivity(),
        stats: calculateStats(),
        updateProfile,
        updateSession,
        acceptRequest,
        declineRequest,
        scheduleSession,
        confirmSessionRequest,
        addFocusArea,
        removeFocusArea,
        sendMessage,
        refreshData,
        loading
    };

    return (
        <MentorContext.Provider value={value}>
            {!loading && children}
        </MentorContext.Provider>
    );
};
