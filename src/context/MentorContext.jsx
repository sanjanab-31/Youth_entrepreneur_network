import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calculateExecutionScore } from '../context/StartupContext';
import { useMessaging } from './MessagingContext';
import { getSystem, saveSystem } from '../utils/system';


const MentorContext = createContext();

export const useMentor = () => useContext(MentorContext);

export const MentorProvider = ({ children }) => {
    const { user, updateProfile: authUpdateProfile } = useAuth();
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

        const system = getSystem();

        // Use the unified SSOT user object
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

        setRequests((system.mentorRequests || []).filter(r => r.mentorId === user.uid));
        setSessions((system.sessions || []).filter(s => s.mentorId === user.uid));
        setMentees((system.startups || []).filter(s => s.mentorAssigned === user.uid));
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
        authUpdateProfile(updates);
    };

    const updateSession = (sessionId, updates) => {
        const system = getSystem();
        system.sessions = system.sessions.map(s =>
            s.id === sessionId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        );
        saveSystem(system);
    };

    const acceptRequest = (requestId) => {
        const system = getSystem();
        const request = system.mentorRequests.find(r => r.id === requestId);
        if (!request) return;

        // Update request status
        system.mentorRequests = system.mentorRequests.map(r =>
            r.id === requestId ? { ...r, status: 'accepted', updatedAt: new Date().toISOString() } : r
        );

        // Assign mentor to startup + log activity
        system.startups = system.startups.map(s => {
            if (s.startupId !== request.startupId) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Mentor accepted your request`,
                type: 'mentor',
                timestamp: new Date().toISOString()
            };
            const updated = {
                ...s,
                mentorAssigned: user.uid,
                mentorshipStartDate: new Date().toISOString(),
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
            updated.executionScore = calculateExecutionScore(updated);
            return updated;
        });

        saveSystem(system);
    };

    const declineRequest = (requestId) => {
        const system = getSystem();
        const request = system.mentorRequests.find(r => r.id === requestId);
        if (!request) return;

        system.mentorRequests = system.mentorRequests.map(r =>
            r.id === requestId ? { ...r, status: 'declined', updatedAt: new Date().toISOString() } : r
        );

        // Log activity
        system.startups = system.startups.map(s => {
            if (s.startupId !== request.startupId) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Mentor declined your request`,
                type: 'warning',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 50),
                updatedAt: new Date().toISOString()
            };
        });

        saveSystem(system);
        refreshData();
    };

    const scheduleSession = (startupId, date, time, topic = 'Mentorship Session') => {
        const system = getSystem();
        const newSession = {
            id: `ses_${Date.now()}`,
            mentorId: user.uid,
            startupId,
            date,
            time,
            topic,
            status: 'upcoming',
            createdAt: new Date().toISOString()
        };
        system.sessions.push(newSession);

        // Log activity
        system.startups = system.startups.map(s => {
            if (s.startupId !== startupId) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Mentor scheduled a session for ${date}`,
                type: 'mentor',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 50),
                updatedAt: new Date().toISOString()
            };
        });

        saveSystem(system);
        refreshData();
    };

    const confirmSessionRequest = (sessionId) => {
        const system = getSystem();
        const session = system.sessions.find(s => s.id === sessionId);
        if (!session) return;

        session.status = 'upcoming';
        session.updatedAt = new Date().toISOString();

        // Log activity
        system.startups = system.startups.map(s => {
            if (s.startupId !== session.startupId) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Mentor confirmed your session request for ${session.date}`,
                type: 'mentor',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 50),
                updatedAt: new Date().toISOString()
            };
        });

        saveSystem(system);
        refreshData();
    };

    const declineSessionRequest = (sessionId) => {
        const system = getSystem();
        const session = system.sessions.find(s => s.id === sessionId);
        if (!session) return;

        session.status = 'declined';
        session.updatedAt = new Date().toISOString();

        // Log activity
        system.startups = system.startups.map(s => {
            if (s.startupId !== session.startupId) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Mentor declined your session request for ${session.date}`,
                type: 'warning',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 50),
                updatedAt: new Date().toISOString()
            };
        });

        saveSystem(system);
        refreshData();
    };

    const completeSession = (sessionId, feedback) => {
        const system = getSystem();
        const session = system.sessions.find(s => s.id === sessionId);
        if (!session) return;

        session.status = 'completed';
        session.notes = feedback.advice;
        session.actionItems = feedback.actionItems;
        session.completedAt = new Date().toISOString();
        session.updatedAt = new Date().toISOString();

        // Log activity & boost execution score
        system.startups = system.startups.map(s => {
            if (s.startupId !== session.startupId) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Completed session with mentor. Feedback received.`,
                type: 'success',
                timestamp: new Date().toISOString()
            };
            const updated = {
                ...s,
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 50),
                updatedAt: new Date().toISOString()
            };
            // Recalculate execution score (it includes sessions already in StartupContext logic)
            updated.executionScore = calculateExecutionScore(updated);
            return updated;
        });

        saveSystem(system);
        refreshData();
    };

    const addFocusArea = (startupId, area) => {
        if (!area?.trim()) return;
        const system = getSystem();
        system.startups = system.startups.map(s => {
            if (s.startupId !== startupId) return s;
            const existing = Array.isArray(s.focusAreas) ? s.focusAreas : [];
            if (existing.includes(area.trim())) return s;
            const activityEntry = {
                id: `act_${Date.now()}`,
                message: `Mentor added focus area: ${area.trim()}`,
                type: 'mentor',
                timestamp: new Date().toISOString()
            };
            return {
                ...s,
                focusAreas: [...existing, area.trim()],
                activity: [activityEntry, ...(Array.isArray(s.activity) ? s.activity : [])].slice(0, 20),
                updatedAt: new Date().toISOString()
            };
        });
        saveSystem(system);
    };

    const removeFocusArea = (startupId, area) => {
        const system = getSystem();
        system.startups = system.startups.map(s => {
            if (s.startupId !== startupId) return s;
            return {
                ...s,
                focusAreas: (s.focusAreas || []).filter(a => a !== area),
                updatedAt: new Date().toISOString()
            };
        });
        saveSystem(system);
        refreshData();
    };

    const messaging = useMessaging();
    const sendMessage = (startupId, text) => {
        messaging.sendMessage({
            startupId,
            conversationType: 'mentor',
            message: text
        });
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
        const system = getSystem();
        const allUsers = system.users || {};

        const getStartupName = (startupId) =>
            system.startups.find(s => s.startupId === startupId)?.startupName || 'Unknown Startup';
        const getFounderName = (founderId) => {
            const u = allUsers[founderId];
            return u?.name || u?.email?.split('@')[0] || 'Unknown Founder';
        };

        const items = [];

        requests.forEach(r => {
            const startup = system.startups.find(s => s.startupId === r.startupId);
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
        declineSessionRequest,
        completeSession,
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
