import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
    buildConversations,
    getMessagesForConversation,
    loadMessagingState,
    markConversationAsRead,
    sendSystemMessage
} from '../utils/messagingService';

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshMessages = async () => {
        setLoading(true);
        const state = await loadMessagingState();
        setMessages(state.messages);
        setConversations(buildConversations(user, state.messages));
        setLoading(false);
    };

    useEffect(() => {
        refreshMessages();
        const handler = () => refreshMessages();
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [user]);

    const sendMessage = async (payload) => {
        await sendSystemMessage(user, payload);
        await refreshMessages();
    };

    const getConversationMessages = (conversation) => {
        return getMessagesForConversation(user, conversation);
    };

    const markAsRead = async (conversation) => {
        await markConversationAsRead(user, conversation);
        await refreshMessages();
    };

    const value = {
        messages,
        conversations,
        sendMessage,
        markAsRead,
        getConversationMessages,
        loading
    };

    return (
        <MessagingContext.Provider value={value}>
            {children}
        </MessagingContext.Provider>
    );
};