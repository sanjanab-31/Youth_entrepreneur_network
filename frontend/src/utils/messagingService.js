import api from '../../services/api';
import { getSystem } from './system';

const matchesConversationMessage = ({ message, conversation }) => {
    if (!message || !conversation) return false;
    
    const mStartupId = String(message.startupId || '');
    const cStartupId = String(conversation.startupId || '');
    if (mStartupId !== cStartupId || message.conversationType !== conversation.type) return false;
    
    if (conversation.type === 'startup') return true;

    const participantId = String(conversation.participantId || '');
    if (!participantId) return true;

    const mSenderId = String(message.senderId || '');
    const mReceiverId = String(message.receiverId || '');
    
    if (mSenderId === participantId || mReceiverId === participantId) return true;
    if (!mReceiverId) return mSenderId === participantId;
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
    const userId = String(user.uid || user.id || '');

    const getStartupById = (startupId) => allStartups.find((s) => String(s.startupId) === String(startupId));
    const getConvoMessages = (conversation) => {
        const startup = getStartupById(conversation.startupId);
        return (messages || []).filter((m) => matchesConversationMessage({ message: m, conversation, startup }));
    };

    const convoMap = new Map();

    if (user.role === 'founder' || user.role === 'co-founder') {
        const myStartup = allStartups.find((s) => 
            String(s.founderId) === userId || 
            (Array.isArray(s.coFounders) && s.coFounders.map(String).includes(userId))
        );

        if (myStartup) {
            const sid = String(myStartup.startupId);
            const teamMessages = (messages || []).filter((m) => String(m.startupId) === sid && m.conversationType === 'startup');
            convoMap.set(`startup_${sid}`, {
                id: sid,
                startupId: sid,
                name: `${myStartup.startupName} (Team)`,
                type: 'startup',
                lastMessage: teamMessages[teamMessages.length - 1],
                unreadCount: teamMessages.filter((m) => !m.read && String(m.senderId) !== userId).length
            });

            const mentorParticipants = new Set();
            const linkedMentorId = myStartup.mentorAssigned ? String(myStartup.mentorAssigned) : null;
            if (linkedMentorId) mentorParticipants.add(linkedMentorId);

            (system.mentorRequests || []).filter((r) => String(r.startupId) === sid && r.status === 'accepted').forEach(r => {
                if (r.mentorId) mentorParticipants.add(String(r.mentorId));
            });

            (messages || []).filter((m) => String(m.startupId) === sid && m.conversationType === 'mentor').forEach((m) => {
                if (m.senderRole === 'mentor' && m.senderId) mentorParticipants.add(String(m.senderId));
                if (m.receiverId && allUsers[m.receiverId]?.role === 'mentor') mentorParticipants.add(String(m.receiverId));
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
                    unreadCount: mentorMsgs.filter((m) => !m.read && String(m.senderId) !== userId).length
                });
            });

            if (myStartup.incubatorAssigned) {
                const participantId = String(myStartup.incubatorAssigned);
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
                    unreadCount: incMsgs.filter((m) => !m.read && String(m.senderId) !== userId).length
                });

                if (linkedMentorId) {
                    const directMsgs = (messages || []).filter((m) => 
                        String(m.startupId) === sid && 
                        m.conversationType === 'direct' &&
                        ((String(m.senderId) === userId && String(m.receiverId) === linkedMentorId) ||
                         (String(m.senderId) === linkedMentorId && String(m.receiverId) === userId))
                    );
                    convoMap.set(`direct_${sid}_${linkedMentorId}`, {
                        id: linkedMentorId,
                        startupId: sid,
                        participantId: linkedMentorId,
                        name: `${allUsers[linkedMentorId]?.name || 'Mentor'} (Private)`,
                        type: 'direct',
                        lastMessage: directMsgs[directMsgs.length - 1],
                        unreadCount: directMsgs.filter((m) => !m.read && String(m.senderId) !== userId).length
                    });
                }
            }
        }
    }

    if (user.role === 'mentor') {
        const startupIds = new Set(
            allStartups.filter((s) => String(s.mentorAssigned) === userId).map((s) => String(s.startupId))
        );

        (messages || []).filter((m) => 
            m.conversationType === 'mentor' && 
            (String(m.senderId) === userId || String(m.receiverId) === userId) && 
            m.startupId
        ).forEach((m) => startupIds.add(String(m.startupId)));

        Array.from(startupIds).forEach((startupId) => {
            const startup = getStartupById(startupId);
            if (!startup) return;

            const conversation = {
                id: startupId,
                startupId,
                participantId: userId,
                name: startup.startupName,
                type: 'mentor'
            };
            const mentorMsgs = getConvoMessages(conversation);
            convoMap.set(`mentor_${startupId}_${userId}`, {
                ...conversation,
                lastMessage: mentorMsgs[mentorMsgs.length - 1],
                unreadCount: mentorMsgs.filter((m) => !m.read && String(m.senderId) !== userId).length
            });
        });
    }

    if (user.role === 'incubator') {
        const myStartups = allStartups.filter((s) => String(s.incubatorAssigned) === userId);
        myStartups.forEach((s) => {
            const sid = String(s.startupId);
            const incubatorConversation = {
                id: sid,
                startupId: sid,
                participantId: userId,
                name: s.startupName,
                type: 'incubator'
            };
            const incMsgs = getConvoMessages(incubatorConversation);
            convoMap.set(`incubator_${sid}_${userId}`, {
                ...incubatorConversation,
                lastMessage: incMsgs[incMsgs.length - 1],
                unreadCount: incMsgs.filter((m) => !m.read && String(m.senderId) !== userId).length
            });

            if (s.mentorAssigned) {
                const mid = String(s.mentorAssigned);
                const directMsgs = (messages || []).filter((m) =>
                    String(m.startupId) === sid &&
                    m.conversationType === 'direct' &&
                    ((String(m.senderId) === userId && String(m.receiverId) === mid) ||
                     (String(m.senderId) === mid && String(m.receiverId) === userId))
                );

                convoMap.set(`direct_${sid}_${mid}`, {
                    id: mid,
                    startupId: sid,
                    name: `${allUsers[mid]?.name || 'Mentor'} (${s.startupName})`,
                    type: 'direct',
                    lastMessage: directMsgs[directMsgs.length - 1],
                    unreadCount: directMsgs.filter((m) => !m.read && String(m.senderId) !== userId).length
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
