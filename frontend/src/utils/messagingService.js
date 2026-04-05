import api from '../../services/api';
import { getSystem } from './system';

const matchesConversationMessage = ({ message, conversation }) => {
    if (!message || !conversation) return false;
    if (message.startupId !== conversation.startupId || message.conversationType !== conversation.type) return false;
    if (conversation.type === 'startup') return true;

    const participantId = conversation.participantId;
    if (!participantId) return true;

    if (message.senderId === participantId || message.receiverId === participantId) return true;
    if (!message.receiverId) return message.senderId === participantId;
    return false;
};

const normalizeMessage = (message = {}) => ({
    ...message,
    id: message.id,
    startupId: message.startupId ?? message.startup_id ?? null,
    senderId: message.senderId ?? message.sender_id ?? null,
    senderName: message.senderName ?? message.sender_name ?? 'User',
    senderRole: message.senderRole ?? message.sender_role ?? null,
    receiverId: message.receiverId ?? message.receiver_id ?? null,
    conversationType: message.conversationType ?? message.conversation_type ?? 'startup',
    message: message.message ?? message.content ?? '',
    content: message.message ?? message.content ?? '',
    createdAt: message.createdAt ?? message.created_at ?? null,
    updatedAt: message.updatedAt ?? message.updated_at ?? null,
    read: Boolean(message.read),
});

export const fetchAllMessages = async () => {
    const response = await api.get('/v1/messages');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeMessage);
};

export const fetchStartupConversationMessages = async (startupId) => {
    const response = await api.get(`/v1/messages/conversations/${startupId}`);
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map(normalizeMessage);
};

export const sendApiMessage = async (payload = {}) => {
    const response = await api.post('/v1/messages/send', payload);
    return normalizeMessage(response.data?.data || payload);
};

export const markMessageAsReadApi = async (messageId) => {
    const response = await api.post(`/v1/messages/${messageId}/read`);
    return normalizeMessage(response.data?.data || {});
};

export const buildConversations = (user, messages) => {
    if (!user) return [];
    const system = getSystem();
    const allStartups = system.startups || [];
    const allUsers = system.users || {};

    const getStartupById = (startupId) => allStartups.find((s) => s.startupId === startupId);
    const getConvoMessages = (conversation) => {
        const startup = getStartupById(conversation.startupId);
        return (messages || []).filter((m) => matchesConversationMessage({ message: m, conversation, startup }));
    };

    const convoMap = new Map();

    if (user.role === 'founder' || user.role === 'co-founder') {
        const myStartup = allStartups.find((s) => s.founderId === user.uid || (s.coFounders || []).includes(user.uid));

        if (myStartup) {
            const sid = myStartup.startupId;
            const acceptedMentorRequest = (system.mentorRequests || []).find((r) => r.startupId === sid && r.status === 'accepted');
            const linkedMentorId = myStartup.mentorAssigned || acceptedMentorRequest?.mentorId || null;
            const mentorParticipants = new Set();

            const teamMessages = (messages || []).filter((m) => m.startupId === sid && m.conversationType === 'startup');
            convoMap.set(`startup_${sid}`, {
                id: sid,
                startupId: sid,
                name: `${myStartup.startupName} (Team)`,
                type: 'startup',
                lastMessage: teamMessages[teamMessages.length - 1],
                unreadCount: teamMessages.filter((m) => !m.read && m.senderId !== user.uid).length
            });

            if (linkedMentorId) mentorParticipants.add(linkedMentorId);
            (system.mentorRequests || []).filter((r) => r.startupId === sid && r.status === 'accepted' && r.mentorId).forEach((r) => mentorParticipants.add(r.mentorId));
            (messages || []).filter((m) => m.startupId === sid && m.conversationType === 'mentor').forEach((m) => {
                if (m.senderRole === 'mentor' && m.senderId) mentorParticipants.add(m.senderId);
                if (m.receiverId && allUsers[m.receiverId]?.role === 'mentor') mentorParticipants.add(m.receiverId);
            });

            mentorParticipants.forEach((mentorId) => {
                const mentorConversation = {
                    id: mentorId,
                    startupId: sid,
                    participantId: mentorId,
                    name: allUsers[mentorId]?.name || 'Mentor',
                    type: 'mentor'
                };
                const mentorMsgs = getConvoMessages(mentorConversation);
                convoMap.set(`mentor_${sid}_${mentorId}`, {
                    ...mentorConversation,
                    lastMessage: mentorMsgs[mentorMsgs.length - 1],
                    unreadCount: mentorMsgs.filter((m) => !m.read && m.senderId !== user.uid).length
                });
            });

            if (myStartup.incubatorAssigned) {
                const participantId = myStartup.incubatorAssigned;
                const incubatorConversation = {
                    id: participantId,
                    startupId: sid,
                    participantId,
                    name: allUsers[participantId]?.name || 'Assigned Incubator',
                    type: 'incubator'
                };
                const incMsgs = getConvoMessages(incubatorConversation);
                convoMap.set(`incubator_${sid}_${participantId}`, {
                    ...incubatorConversation,
                    lastMessage: incMsgs[incMsgs.length - 1],
                    unreadCount: incMsgs.filter((m) => !m.read && m.senderId !== user.uid).length
                });
            }
        }
    }

    if (user.role === 'mentor') {
        const startupIds = new Set(
            allStartups.filter((s) => s.mentorAssigned === user.uid).map((s) => s.startupId)
        );

        (messages || [])
            .filter((m) => m.conversationType === 'mentor' && (m.senderId === user.uid || m.receiverId === user.uid) && m.startupId)
            .forEach((m) => startupIds.add(m.startupId));

        Array.from(startupIds).forEach((startupId) => {
            const startup = allStartups.find((s) => s.startupId === startupId);
            if (!startup) return;

            const conversation = {
                id: startupId,
                startupId,
                participantId: user.uid,
                name: startup.startupName,
                type: 'mentor'
            };
            const mentorMsgs = getConvoMessages(conversation);
            convoMap.set(`mentor_${startupId}_${user.uid}`, {
                ...conversation,
                lastMessage: mentorMsgs[mentorMsgs.length - 1],
                unreadCount: mentorMsgs.filter((m) => !m.read && m.senderId !== user.uid).length
            });
        });
    }

    if (user.role === 'incubator') {
        const myStartups = allStartups.filter((s) => s.incubatorAssigned === user.uid);
        myStartups.forEach((s) => {
            const sid = s.startupId;
            const incubatorConversation = {
                id: sid,
                startupId: sid,
                participantId: user.uid,
                name: s.startupName,
                type: 'incubator'
            };
            const incMsgs = getConvoMessages(incubatorConversation);
            convoMap.set(`incubator_${sid}_${user.uid}`, {
                ...incubatorConversation,
                lastMessage: incMsgs[incMsgs.length - 1],
                unreadCount: incMsgs.filter((m) => !m.read && m.senderId !== user.uid).length
            });

            if (s.mentorAssigned) {
                const directMsgs = (messages || []).filter((m) =>
                    m.startupId === sid
                    && m.conversationType === 'direct'
                    && ((m.senderId === user.uid && m.receiverId === s.mentorAssigned)
                        || (m.senderId === s.mentorAssigned && m.receiverId === user.uid))
                );

                convoMap.set(`direct_${sid}_${s.mentorAssigned}`, {
                    id: s.mentorAssigned,
                    startupId: sid,
                    name: `${allUsers[s.mentorAssigned]?.name || 'Mentor'} (${s.startupName})`,
                    type: 'direct',
                    lastMessage: directMsgs[directMsgs.length - 1],
                    unreadCount: directMsgs.filter((m) => !m.read && m.senderId !== user.uid).length
                });
            }
        });
    }

    return Array.from(convoMap.values()).sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
        const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
        return timeB - timeA;
    });
};

export const getMessagesForConversation = (messages, conversation) => {
    if (!conversation) return [];

    return (messages || [])
        .filter((message) => matchesConversationMessage({ message, conversation }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};
