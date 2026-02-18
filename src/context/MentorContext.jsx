
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

        // Build / load mentor profile from persisted key + auth user
        const profileKey = `vanguard_mentorProfile_${user.id}`;
        const savedProfile = localStorage.getItem(profileKey);
        const baseProfile = savedProfile ? JSON.parse(savedProfile) : {};

        const mergedProfile = {
            expertise: 'General Mentorship',
            sector: 'General',
            badge: 'Verified Mentor',
            bio: '',
            ...baseProfile,
            // Always keep name/email in sync with auth record
            name: baseProfile.name || user.name || 'Mentor',
            email: user.email || '',
            availability: {
                status: 'Active',
                days: ['Mon', 'Wed', 'Fri'],
                sessionType: '1:1',
                ...(baseProfile.availability || {})
            }
        };

        // Persist defaults on first load
        if (!savedProfile) {
            localStorage.setItem(profileKey, JSON.stringify(mergedProfile));
        }
        setProfile(mergedProfile);

        // Load requests, sessions, mentees for this mentor
        const allRequests = JSON.parse(localStorage.getItem(KEYS.MENTOR_REQUESTS) || '[]');
        const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');

        setRequests(allRequests.filter(r => r.mentorId === user.id));
        setSessions(allSessions.filter(s => s.mentorId === user.id));
        setMentees(allStartups.filter(s => s.mentorAssigned === user.id));
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
        const profileKey = `vanguard_mentorProfile_${user.id}`;
        const current = JSON.parse(localStorage.getItem(profileKey) || '{}');
        const updated = { ...current, ...updates };
        localStorage.setItem(profileKey, JSON.stringify(updated));
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

        const updatedRequests = allRequests.map(r =>
            r.id === requestId ? { ...r, status: 'accepted', updatedAt: new Date().toISOString() } : r
        );
        localStorage.setItem(KEYS.MENTOR_REQUESTS, JSON.stringify(updatedRequests));

        const allStartups = JSON.parse(localStorage.getItem(KEYS.STARTUPS) || '[]');
        const updatedStartups = allStartups.map(s =>
            s.startupId === request.startupId
                ? { ...s, mentorAssigned: user.id, updatedAt: new Date().toISOString() }
                : s
        );
        localStorage.setItem(KEYS.STARTUPS, JSON.stringify(updatedStartups));
        refreshData();
    };

    const declineRequest = (requestId) => {
        const allRequests = JSON.parse(localStorage.getItem(KEYS.MENTOR_REQUESTS) || '[]');
        const updatedRequests = allRequests.map(r =>
            r.id === requestId ? { ...r, status: 'declined', updatedAt: new Date().toISOString() } : r
        );
        localStorage.setItem(KEYS.MENTOR_REQUESTS, JSON.stringify(updatedRequests));
        refreshData();
    };

    const scheduleSession = (startupId, startupName, date, time) => {
        const allSessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
        const newSession = {
            id: Date.now().toString(),
            mentorId: user.id,
            mentorName: user.name,
            startupId,
            startupName,
            date,
            time,
            status: 'upcoming',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.SESSIONS, JSON.stringify([...allSessions, newSession]));
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
        const items = [];

        requests.forEach(r => {
            const base = { founderName: r.founderName || r.startupName };
            if (r.status === 'pending') {
                items.push({ id: `req-${r.id}`, type: 'request', message: `New mentorship request from ${base.founderName}`, timestamp: r.createdAt });
            } else if (r.status === 'accepted') {
                items.push({ id: `acc-${r.id}`, type: 'success', message: `Accepted request from ${base.founderName}`, timestamp: r.updatedAt || r.createdAt });
            } else if (r.status === 'declined') {
                items.push({ id: `dec-${r.id}`, type: 'error', message: `Declined request from ${base.founderName}`, timestamp: r.updatedAt || r.createdAt });
            }
        });

        sessions.forEach(s => {
            items.push({ id: `ses-${s.id}`, type: 'session', message: `Session scheduled with ${s.startupName} on ${s.date} at ${s.time}`, timestamp: s.createdAt });
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
        loading
    };

    return (
        <MentorContext.Provider value={value}>
            {!loading && children}
        </MentorContext.Provider>
    );
};
