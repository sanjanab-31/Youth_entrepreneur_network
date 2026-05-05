import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
    buildConversations,
    fetchAllMessages,
    fetchStartupConversationMessages,
    getMessagesForConversation,
    markMessageAsReadApi,
    sendApiMessage
} from '../utils/messagingService';

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [conversationMessages, setConversationMessages] = useState([]);
    const [conversationLoading, setConversationLoading] = useState(false);
    const [conversationError, setConversationError] = useState('');
    const [sending, setSending] = useState(false);
    const [markingRead, setMarkingRead] = useState(false);

    const refreshMessages = useCallback(async () => {
        if (!user) {
            setMessages([]);
            setConversations([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const fetchedMessages = await fetchAllMessages();
            setMessages(fetchedMessages);
            setConversations(buildConversations(user, fetchedMessages));
        } catch (err) {
            setMessages([]);
            setConversations([]);
            setError(err.response?.data?.error || 'Failed to load messages');
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        const handleRefresh = (event) => {
            if (!event || event.key === 'vanguard_system') {
                void refreshMessages();
            }
        };
        window.addEventListener('storage', handleRefresh);
        void refreshMessages();
        return () => window.removeEventListener('storage', handleRefresh);
    }, [refreshMessages]);

    const sendMessage = useCallback(async (payload) => {
        setSending(true);
        setConversationError('');
        try {
            await sendApiMessage(payload);
            await refreshMessages();
        } catch (err) {
            setConversationError(err.response?.data?.error || 'Failed to send message');
            throw err;
        } finally {
            setSending(false);
        }
    }, [refreshMessages]);

    const loadConversationMessages = useCallback(async (conversation) => {
        if (!user || !conversation?.startupId) {
            setConversationMessages([]);
            return;
        }

        setConversationLoading(true);
        setConversationError('');
        try {
            const startupMessages = await fetchStartupConversationMessages(conversation.startupId);
            setConversationMessages(getMessagesForConversation(startupMessages, conversation));
        } catch (err) {
            setConversationMessages([]);
            setConversationError(err.response?.data?.error || 'Failed to load conversation messages');
        } finally {
            setConversationLoading(false);
        }
    }, [user]);

    const getConversationMessages = (conversation) => {
        if (!conversation) return [];
        return getMessagesForConversation(conversationMessages, conversation);
    };

    const markAsRead = useCallback(async (conversation) => {
        if (!user || !conversation?.startupId) return;

        setMarkingRead(true);
        setConversationError('');
        try {
            const startupMessages = await fetchStartupConversationMessages(conversation.startupId);
            const scopedMessages = getMessagesForConversation(startupMessages, conversation);
            const unread = scopedMessages.filter((message) => !message.read && message.senderId !== user?.uid);

            if (unread.length > 0) {
                await Promise.all(unread.map((message) => markMessageAsReadApi(message.id)));
                await refreshMessages();
                await loadConversationMessages(conversation);
            }
        } catch (err) {
            setConversationError(err.response?.data?.error || 'Failed to mark messages as read');
        } finally {
            setMarkingRead(false);
        }
    }, [user, refreshMessages, loadConversationMessages]);

    const value = {
        messages,
        conversations,
        error,
        sendMessage,
        markAsRead,
        conversationMessages,
        conversationLoading,
        conversationError,
        loadConversationMessages,
        getConversationMessages,
        loading,
        sending,
        markingRead
    };

    return (
        <MessagingContext.Provider value={value}>
            {children}
        </MessagingContext.Provider>
    );
};