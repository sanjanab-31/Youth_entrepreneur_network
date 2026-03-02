import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getSystem, saveSystem } from '../utils/system';

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshMessages = () => {
        const system = getSystem();
        setMessages(system.messages || []);
        setLoading(false);
    };

    useEffect(() => {
        refreshMessages();
        window.addEventListener('storage', refreshMessages);
        return () => window.removeEventListener('storage', refreshMessages);
    }, []);

    // Relational Logic: Compute active conversations for the current user
    const conversations = useMemo(() => {
        if (!user) return [];
        const system = getSystem();
        const allStartups = system.startups || [];
        const allUsers = system.users || {};

        const convoMap = new Map();

        // 1. Startup Members (Founder, Co-Founder)
        if (user.role === 'founder' || ['co-founder', 'cofounder'].includes(user.role)) {
            const myStartup = allStartups.find(s =>
                s.founderId === user.uid || (s.coFounders || []).includes(user.uid)
            );

            if (myStartup) {
                const sid = myStartup.startupId;

                // Group Chat (Team)
                const teamMessages = messages.filter(m => m.startupId === sid && m.conversationType === 'startup');
                convoMap.set(`startup_${sid}`, {
                    id: sid,
                    startupId: sid,
                    name: `${myStartup.startupName} (Team)`,
                    type: 'startup',
                    lastMessage: teamMessages[teamMessages.length - 1],
                    unreadCount: teamMessages.filter(m => !m.readBy.includes(user.uid)).length
                });

                // Mentor Link
                if (myStartup.mentorAssigned) {
                    const mentor = allUsers[myStartup.mentorAssigned];
                    const mentorMsgs = messages.filter(m => m.startupId === sid && m.conversationType === 'mentor');
                    convoMap.set(`mentor_${sid}`, {
                        id: myStartup.mentorAssigned,
                        startupId: sid,
                        name: mentor?.name || 'Assigned Mentor',
                        type: 'mentor',
                        lastMessage: mentorMsgs[mentorMsgs.length - 1],
                        unreadCount: mentorMsgs.filter(m => !m.readBy.includes(user.uid)).length
                    });
                }

                // Incubator Link
                if (myStartup.incubatorAssigned) {
                    const incubator = allUsers[myStartup.incubatorAssigned];
                    const incMsgs = messages.filter(m => m.startupId === sid && m.conversationType === 'incubator');
                    convoMap.set(`incubator_${sid}`, {
                        id: myStartup.incubatorAssigned,
                        startupId: sid,
                        name: incubator?.name || 'Assigned Incubator',
                        type: 'incubator',
                        lastMessage: incMsgs[incMsgs.length - 1],
                        unreadCount: incMsgs.filter(m => !m.readBy.includes(user.uid)).length
                    });
                }
            }
        }

        // 2. Mentor View
        if (user.role === 'mentor') {
            const myMentees = allStartups.filter(s => s.mentorAssigned === user.uid);
            myMentees.forEach(s => {
                const sid = s.startupId;
                const mentorMsgs = messages.filter(m => m.startupId === sid && m.conversationType === 'mentor');
                convoMap.set(`mentor_${sid}`, {
                    id: sid,
                    startupId: sid,
                    name: s.startupName,
                    type: 'mentor',
                    lastMessage: mentorMsgs[mentorMsgs.length - 1],
                    unreadCount: mentorMsgs.filter(m => !m.readBy.includes(user.uid)).length
                });
            });
        }

        // 3. Incubator View
        if (user.role === 'incubator') {
            const myStartups = allStartups.filter(s => s.incubatorAssigned === user.uid);
            myStartups.forEach(s => {
                const sid = s.startupId;

                // Communication with Founder
                const incMsgs = messages.filter(m => m.startupId === sid && m.conversationType === 'incubator');
                convoMap.set(`incubator_${sid}`, {
                    id: sid,
                    startupId: sid,
                    name: s.startupName,
                    type: 'incubator',
                    lastMessage: incMsgs[incMsgs.length - 1],
                    unreadCount: incMsgs.filter(m => !m.readBy.includes(user.uid)).length
                });

                // Communication with Mentor (Direct)
                if (s.mentorAssigned) {
                    const mentor = allUsers[s.mentorAssigned];
                    const directMsgs = messages.filter(m =>
                        m.startupId === sid &&
                        m.conversationType === 'direct' &&
                        ((m.senderId === user.uid && m.receiverId === s.mentorAssigned) ||
                            (m.senderId === s.mentorAssigned && m.receiverId === user.uid))
                    );
                    convoMap.set(`direct_${sid}_${s.mentorAssigned}`, {
                        id: s.mentorAssigned,
                        startupId: sid,
                        name: `${mentor?.name || 'Mentor'} (${s.startupName})`,
                        type: 'direct',
                        lastMessage: directMsgs[directMsgs.length - 1],
                        unreadCount: directMsgs.filter(m => !m.readBy.includes(user.uid)).length
                    });
                }
            });
        }

        return Array.from(convoMap.values()).sort((a, b) => {
            const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
            const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
            return timeB - timeA;
        });
    }, [user, messages]);

    const sendMessage = (payload) => {
        if (!user) return;
        const system = getSystem();

        // Relational Validation
        let isValid = false;
        const targetStartup = system.startups.find(s => s.startupId === payload.startupId);

        if (!targetStartup) return console.error("Invalid startupId");

        if (user.role === 'founder' || ['co-founder', 'cofounder'].includes(user.role)) {
            const isMember = targetStartup.founderId === user.uid || (targetStartup.coFounders || []).includes(user.uid);
            if (isMember) {
                if (payload.conversationType === 'startup') isValid = true;
                if (payload.conversationType === 'mentor' && targetStartup.mentorAssigned) isValid = true;
                if (payload.conversationType === 'incubator' && targetStartup.incubatorAssigned) isValid = true;
            }
        } else if (user.role === 'mentor') {
            if (targetStartup.mentorAssigned === user.uid) {
                if (payload.conversationType === 'mentor') isValid = true;
                if (payload.conversationType === 'direct' && targetStartup.incubatorAssigned) isValid = true;
            }
        } else if (user.role === 'incubator') {
            if (targetStartup.incubatorAssigned === user.uid) {
                if (payload.conversationType === 'incubator') isValid = true;
                if (payload.conversationType === 'direct' && targetStartup.mentorAssigned) isValid = true;
            }
        }

        if (!isValid) {
            console.warn("Relational communication blocked: Unauthorized link.", { role: user.role, type: payload.conversationType });
            return;
        }

        const newMessage = {
            id: `msg_${Date.now()}`,
            startupId: payload.startupId,
            senderId: user.uid,
            senderName: user.name || 'User',
            senderRole: user.role,
            receiverId: payload.receiverId || (payload.conversationType === 'direct' ? (user.role === 'incubator' ? targetStartup.mentorAssigned : targetStartup.incubatorAssigned) : null),
            conversationType: payload.conversationType,
            message: payload.message,
            readBy: [user.uid],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        system.messages = [...(system.messages || []), newMessage];

        // Activity Logging Rules
        if (user.role === 'mentor' && payload.conversationType === 'mentor') {
            const act = {
                id: `act_${Date.now()}`,
                message: `Mentor sent strategic message`,
                type: 'mentor',
                timestamp: new Date().toISOString()
            };
            targetStartup.activity = [act, ...(targetStartup.activity || [])].slice(0, 50);
        } else if (user.role === 'incubator' && payload.conversationType === 'incubator') {
            const act = {
                id: `act_${Date.now()}`,
                message: `Incubator sent decision message`,
                type: 'incubator',
                timestamp: new Date().toISOString()
            };
            targetStartup.activity = [act, ...(targetStartup.activity || [])].slice(0, 50);
        }

        saveSystem(system);
        refreshMessages();
    };

    const markAsRead = (startupId, conversationType) => {
        if (!user) return;
        const system = getSystem();
        let changed = false;

        system.messages = (system.messages || []).map(m => {
            if (m.startupId === startupId && m.conversationType === conversationType && !m.readBy.includes(user.uid)) {
                changed = true;
                return { ...m, readBy: [...m.readBy, user.uid] };
            }
            return m;
        });

        if (changed) {
            saveSystem(system);
            refreshMessages();
        }
    };

    const value = {
        messages,
        conversations,
        sendMessage,
        markAsRead,
        loading
    };

    return (
        <MessagingContext.Provider value={value}>
            {children}
        </MessagingContext.Provider>
    );
};
