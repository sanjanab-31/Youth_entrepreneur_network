import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useMessaging } from './MessagingContext';
import {
    acceptStartupInvitation,
    acceptStartupJoinRequest,
    addMilestoneToStartup,
    addStartupActivity,
    addStartupDocument,
    applyStartupToIncubator,
    cancelStartupInvitation,
    cancelStartupSession,
    createStartupRecord,
    declineStartupInvitation,
    deleteStartupDocument,
    deleteStartupMilestone,
    leaveStartupTeam,
    loadStartupState,
    removeStartupJoinRequest,
    removeStartupMentor,
    renameStartupDocument,
    requestStartupMentorship,
    requestStartupSession,
    resignFromStartupTeam,
    sendDirectStartupInvitation,
    sendStartupInvitation,
    sendStartupJoinRequest,
    updateStartupData,
    updateStartupMilestone,
    validateStartupInvitation,
    rejectStartupJoinRequest,
    withdrawStartupJoinRequest
} from '../utils/startupService';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

export const StartupProvider = ({ children }) => {
    const { user } = useAuth();
    const messaging = useMessaging();

    const [startup, setStartup] = useState(null);
    const [joinRequests, setJoinRequests] = useState([]);
    const [allStartups, setAllStartups] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [applications, setApplications] = useState([]);
    const [mentorRequests, setMentorRequests] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [sessionsError, setSessionsError] = useState('');
    const [sessionActionId, setSessionActionId] = useState(null);

    const syncData = useCallback(async () => {
        setLoading(true);
        setSessionsLoading(true);
        setSessionsError('');
        try {
            const state = await loadStartupState(user);
            setStartup(state.startup);
            setJoinRequests(state.joinRequests);
            setAllStartups(state.allStartups);
            setInvitations(state.invitations);
            setApplications(state.applications);
            setMentorRequests(state.mentorRequests);
            setSessions(state.sessions);
        } catch (error) {
            setSessions([]);
            setSessionsError(error.response?.data?.error || 'Failed to load sessions');
        }
        setLoading(false);
        setSessionsLoading(false);
    }, [user]);

    useEffect(() => {
        void syncData();
    }, [user, syncData]);

    useEffect(() => {
        const handleStorage = (event) => {
            // Only sync if the storage event was triggered by another window
            // and it's our system key
            if (!event || event.key === 'vanguard_system') {
                void syncData();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [syncData]);

    const updateStartup = async (updates) => {
        if (!startup) return;
        await updateStartupData(startup, updates);
        await syncData();
    };

    const addActivity = async (message, type = 'info') => {
        if (!startup) return;
        await addStartupActivity(startup, message, type);
        await syncData();
    };

    const addMilestone = async (title, description = '', stage = 'Idea', deadline = '') => {
        await addMilestoneToStartup(startup, title, description, stage, deadline);
        await syncData();
    };

    const updateMilestone = async (id, updates) => {
        await updateStartupMilestone(startup, id, updates);
        await syncData();
    };

    const deleteMilestone = async (id) => {
        await deleteStartupMilestone(startup, id);
        await syncData();
    };

    const addDocument = async (name, size) => {
        await addStartupDocument(startup, name, size);
        await syncData();
    };

    const deleteDocument = async (index) => {
        await deleteStartupDocument(startup, index);
        await syncData();
    };

    const renameDocument = async (index, newName) => {
        await renameStartupDocument(startup, index, newName);
        await syncData();
    };

    const applyToIncubator = async (incubatorId, message) => {
        await applyStartupToIncubator(startup, user, incubatorId, message);
        await syncData();
    };

    const requestMentorship = async (mentorId, message) => {
        const result = await requestStartupMentorship(startup, user, mentorId, message);
        await syncData();
        return result;
    };

    const requestSession = async (date, time, topic) => {
        setSessionActionId('create');
        setSessionsError('');
        try {
            await requestStartupSession(startup, user, date, time, topic);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to create session');
        }
        await syncData();
        setSessionActionId(null);
    };

    const removeAssignedMentor = async () => {
        await removeStartupMentor(startup);
        await syncData();
    };

    const cancelSession = async (sessionId) => {
        setSessionActionId(sessionId);
        setSessionsError('');
        try {
            await cancelStartupSession(startup, sessionId);
        } catch (error) {
            setSessionsError(error.response?.data?.error || 'Failed to cancel session');
        }
        await syncData();
        setSessionActionId(null);
    };

    const leaveStartup = async () => {
        await leaveStartupTeam(startup, user);
        await syncData();
    };

    const resignFromStartup = async () => {
        await resignFromStartupTeam(startup, user);
        await syncData();
    };

    const sendInvitation = async (invitedEmail) => {
        const result = await sendStartupInvitation(startup, invitedEmail);
        await syncData();
        return result;
    };

    const sendDirectInvitation = async (invitedUserId, invitedEmail, message = '') => {
        const result = await sendDirectStartupInvitation(startup, user, invitedUserId, invitedEmail, message);
        await syncData();
        return result;
    };

    const validateInvitation = async (code) => validateStartupInvitation(code);

    const acceptInvitation = async (inviteCode) => {
        const ok = await acceptStartupInvitation(user, inviteCode);
        await syncData();
        return ok;
    };

    const declineInvitation = async (invitationId) => {
        const ok = await declineStartupInvitation(user, invitationId);
        await syncData();
        return ok;
    };

    const cancelInvitation = async (invitationId) => {
        const ok = await cancelStartupInvitation(startup, invitationId);
        await syncData();
        return ok;
    };

    const isUserLinked = () => !!startup;

    const sendJoinRequest = async (startupId, message) => {
        const result = await sendStartupJoinRequest(user, startupId, message, isUserLinked());
        await syncData();
        return result;
    };

    const acceptJoinRequest = async (requestId) => {
        const result = await acceptStartupJoinRequest(user, requestId, isUserLinked());
        await syncData();
        return result;
    };

    const rejectJoinRequest = async (requestId) => {
        await rejectStartupJoinRequest(requestId);
        await syncData();
    };

    const withdrawJoinRequest = async (requestId) => {
        await withdrawStartupJoinRequest(requestId);
        await syncData();
    };

    const removeJoinRequest = async (requestId) => {
        await removeStartupJoinRequest(requestId);
        await syncData();
    };

    const sendMessage = async (text, channel = 'team') => {
        if (!startup) return;
        await messaging.sendMessage({
            startupId: startup.startupId,
            conversationType: channel === 'mentor' ? 'mentor' : 'startup',
            message: text
        });
    };

    const createStartup = async (startupData) => {
        const created = await createStartupRecord(user, startupData);
        await syncData();
        return created;
    };

    const value = {
        startup,
        loading,
        updateStartup,
        createStartup,
        addMilestone,
        isUserLinked,
        resignFromStartup,
        updateMilestone,
        deleteMilestone,
        addDocument,
        deleteDocument,
        renameDocument,
        applyToIncubator,
        requestMentorship,
        removeAssignedMentor,
        requestSession,
        cancelSession,
        leaveStartup,
        sendInvitation,
        sendDirectInvitation,
        validateInvitation,
        acceptInvitation,
        declineInvitation,
        cancelInvitation,
        sendJoinRequest,
        acceptJoinRequest,
        rejectJoinRequest,
        withdrawJoinRequest,
        removeJoinRequest,
        sendMessage,
        addActivity,
        allStartups,
        joinRequests,
        invitations,
        applications,
        mentorRequests,
        sessions,
        sessionsLoading,
        sessionsError,
        sessionActionId
    };

    return (
        <StartupContext.Provider value={value}>
            {children}
        </StartupContext.Provider>
    );
};