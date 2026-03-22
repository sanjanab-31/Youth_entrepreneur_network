import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useMessaging } from './MessagingContext';
import {
    acceptMentorRequest,
    addMentorFocusArea,
    buildMentorMessagePayload,
    buildMentorActivity,
    buildMentorStats,
    completeMentorSession,
    confirmMentorSessionRequest,
    declineMentorRequest,
    declineMentorSessionRequest,
    loadMentorState,
    removeMentorFocusArea,
    scheduleMentorSession,
    updateMentorProfile,
    updateMentorSession
} from '../utils/mentorService';

const MentorContext = createContext();

export const useMentor = () => useContext(MentorContext);

export const MentorProvider = ({ children }) => {
    const { user, updateProfile: authUpdateProfile } = useAuth();
    const messaging = useMessaging();

    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        setLoading(true);
        const state = await loadMentorState(user);
        setProfile(state.profile);
        setRequests(state.requests);
        setSessions(state.sessions);
        setMentees(state.mentees);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        const handler = () => {
            void refreshData();
        };
        queueMicrotask(handler);
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [refreshData]);

    const updateProfile = async (updates) => {
        await updateMentorProfile(profile, updates, user, authUpdateProfile);
        await refreshData();
    };

    const updateSession = async (sessionId, updates) => {
        await updateMentorSession(sessionId, updates);
        await refreshData();
    };

    const acceptRequest = async (requestId) => {
        await acceptMentorRequest(requestId, user);
        await refreshData();
    };

    const declineRequest = async (requestId) => {
        await declineMentorRequest(requestId, user);
        await refreshData();
    };

    const scheduleSession = async (startupId, date, time, topic = 'Mentorship Session', meetingLink = '') => {
        await scheduleMentorSession(startupId, date, time, topic, meetingLink, user);
        await refreshData();
    };

    const confirmSessionRequest = async (sessionId, schedule) => {
        await confirmMentorSessionRequest(sessionId, schedule, user);
        await refreshData();
    };

    const declineSessionRequest = async (sessionId) => {
        await declineMentorSessionRequest(sessionId, user);
        await refreshData();
    };

    const completeSession = async (sessionId, feedback) => {
        await completeMentorSession(sessionId, feedback, user);
        await refreshData();
    };

    const addFocusArea = async (startupId, area) => {
        await addMentorFocusArea(startupId, area);
        await refreshData();
    };

    const removeFocusArea = async (startupId, area) => {
        await removeMentorFocusArea(startupId, area);
        await refreshData();
    };

    const sendMessage = async (startupId, text) => {
        const payload = await buildMentorMessagePayload(user, startupId, text);
        if (!payload) return;
        await messaging.sendMessage(payload);
    };

    const activity = useMemo(() => buildMentorActivity(requests, sessions), [requests, sessions]);
    const stats = useMemo(() => buildMentorStats(requests, sessions, mentees), [requests, sessions, mentees]);

    const value = {
        profile,
        requests,
        mentees,
        sessions,
        activity,
        stats,
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