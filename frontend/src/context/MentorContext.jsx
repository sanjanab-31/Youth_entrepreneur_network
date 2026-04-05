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
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [requestsError, setRequestsError] = useState('');
    const [requestActionId, setRequestActionId] = useState(null);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [sessionsError, setSessionsError] = useState('');
    const [sessionActionId, setSessionActionId] = useState(null);

    const refreshData = useCallback(async () => {
        setLoading(true);
        setRequestsLoading(true);
        setSessionsLoading(true);
        setRequestsError('');
        setSessionsError('');
        try {
            const state = await loadMentorState(user);
            setProfile(state.profile);
            setRequests(state.requests);
            setSessions(state.sessions);
            setMentees(state.mentees);
        } catch (error) {
            setRequests([]);
            setSessions([]);
            setRequestsError(error.response?.data?.error || 'Failed to load mentor requests');
            setSessionsError(error.response?.data?.error || 'Failed to load sessions');
        }
        setLoading(false);
        setRequestsLoading(false);
        setSessionsLoading(false);
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
        setSessionActionId(sessionId);
        setSessionsError('');
        try {
            await updateMentorSession(sessionId, updates);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to update session');
        }
        await refreshData();
        setSessionActionId(null);
    };

    const acceptRequest = async (requestId) => {
        setRequestActionId(requestId);
        setRequestsError('');
        try {
            await acceptMentorRequest(requestId);
        } catch (error) {
            setRequestsError(error.response?.data?.error || 'Failed to accept mentor request');
        }
        await refreshData();
        setRequestActionId(null);
    };

    const declineRequest = async (requestId) => {
        setRequestActionId(requestId);
        setRequestsError('');
        try {
            await declineMentorRequest(requestId);
        } catch (error) {
            setRequestsError(error.response?.data?.error || 'Failed to reject mentor request');
        }
        await refreshData();
        setRequestActionId(null);
    };

    const scheduleSession = async (startupId, date, time, topic = 'Mentorship Session', meetingLink = '') => {
        setSessionActionId('create');
        setSessionsError('');
        try {
            await scheduleMentorSession(startupId, date, time, topic, meetingLink, user);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to create session');
        }
        await refreshData();
        setSessionActionId(null);
    };

    const confirmSessionRequest = async (sessionId, schedule) => {
        setSessionActionId(sessionId);
        setSessionsError('');
        try {
            await confirmMentorSessionRequest(sessionId, schedule, user);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to confirm session');
        }
        await refreshData();
        setSessionActionId(null);
    };

    const declineSessionRequest = async (sessionId) => {
        setSessionActionId(sessionId);
        setSessionsError('');
        try {
            await declineMentorSessionRequest(sessionId, user);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to cancel session');
        }
        await refreshData();
        setSessionActionId(null);
    };

    const completeSession = async (sessionId, feedback) => {
        setSessionActionId(sessionId);
        setSessionsError('');
        try {
            await completeMentorSession(sessionId, feedback, user);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to complete session');
        }
        await refreshData();
        setSessionActionId(null);
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
        loading,
        requestsLoading,
        requestsError,
        requestActionId,
        sessionsLoading,
        sessionsError,
        sessionActionId
    };

    return (
        <MentorContext.Provider value={value}>
            {!loading && children}
        </MentorContext.Provider>
    );
};