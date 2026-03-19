import { getSystem, saveSystem } from './system';

const nowIso = () => new Date().toISOString();

const isStartupMember = (startup, userId) => {
    if (!startup || !userId) return false;
    return startup.founderId === userId || (startup.coFounders || []).includes(userId);
};

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

export const backfillLegacyMentorMessageReceivers = (system) => {
    const startups = system.startups || [];
    const mentorRequests = system.mentorRequests || [];
    const allMessages = [...(system.messages || [])];
    const startupById = new Map(startups.map((s) => [s.startupId, s]));
    let changed = false;

    const candidateMentorsByStartup = new Map();

    startups.forEach((startup) => {
        const mentorIds = new Set();
        if (startup.mentorAssigned) mentorIds.add(startup.mentorAssigned);

        mentorRequests
            .filter((r) => r.startupId === startup.startupId && r.status === 'accepted' && r.mentorId)
            .forEach((r) => mentorIds.add(r.mentorId));

        allMessages
            .filter((m) => m.startupId === startup.startupId && m.conversationType === 'mentor' && m.senderRole === 'mentor' && m.senderId)
            .forEach((m) => mentorIds.add(m.senderId));

        candidateMentorsByStartup.set(startup.startupId, mentorIds);
    });

    const mentorMessagesByStartup = new Map();
    allMessages.forEach((message, index) => {
        if (message.conversationType !== 'mentor' || !message.startupId) return;
        const group = mentorMessagesByStartup.get(message.startupId) || [];
        group.push({ index, message });
        mentorMessagesByStartup.set(message.startupId, group);
    });

    mentorMessagesByStartup.forEach((entries, startupId) => {
        const startup = startupById.get(startupId);
        if (!startup) return;

        const sorted = [...entries].sort((a, b) =>
            new Date(a.message.createdAt || 0).getTime() - new Date(b.message.createdAt || 0).getTime()
        );

        let activeMentorId = null;
        const mentorCandidates = Array.from(candidateMentorsByStartup.get(startupId) || []);

        sorted.forEach(({ index, message }) => {
            if (message.receiverId) {
                if (message.senderRole === 'mentor' && message.senderId) activeMentorId = message.senderId;
                return;
            }

            if (message.senderRole === 'mentor' && message.senderId) {
                const resolvedFounderId = startup.founderId || null;
                if (resolvedFounderId) {
                    allMessages[index] = { ...message, receiverId: resolvedFounderId, updatedAt: nowIso() };
                    changed = true;
                }
                activeMentorId = message.senderId;
                return;
            }

            if (!isStartupMember(startup, message.senderId)) return;

            let resolvedMentorId = activeMentorId;
            if (!resolvedMentorId && mentorCandidates.length === 1) resolvedMentorId = mentorCandidates[0];

            if (resolvedMentorId) {
                allMessages[index] = { ...message, receiverId: resolvedMentorId, updatedAt: nowIso() };
                changed = true;
            }
        });
    });

    if (changed) system.messages = allMessages;
    return changed;
};

export const loadMessagingState = async () => {
    const system = getSystem();
    const changed = backfillLegacyMentorMessageReceivers(system);
    if (changed) saveSystem(system);
    return { messages: system.messages || [] };
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
                unreadCount: teamMessages.filter((m) => !m.readBy.includes(user.uid)).length
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
                    unreadCount: mentorMsgs.filter((m) => !m.readBy.includes(user.uid)).length
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
                    unreadCount: incMsgs.filter((m) => !m.readBy.includes(user.uid)).length
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
                unreadCount: mentorMsgs.filter((m) => !m.readBy.includes(user.uid)).length
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
                unreadCount: incMsgs.filter((m) => !m.readBy.includes(user.uid)).length
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
                    unreadCount: directMsgs.filter((m) => !m.readBy.includes(user.uid)).length
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

export const sendSystemMessage = async (user, payload) => {
    if (!user) return false;
    const system = getSystem();

    let isValid = false;
    const targetStartup = (system.startups || []).find((s) => s.startupId === payload.startupId);
    if (!targetStartup) return false;

    const acceptedMentorRequest = (system.mentorRequests || []).find((r) => r.startupId === payload.startupId && r.status === 'accepted');
    const linkedMentorId = targetStartup.mentorAssigned || acceptedMentorRequest?.mentorId || null;

    const relatedMentorIds = new Set();
    if (linkedMentorId) relatedMentorIds.add(linkedMentorId);

    (system.mentorRequests || []).filter((r) => r.startupId === payload.startupId && r.status === 'accepted' && r.mentorId).forEach((r) => relatedMentorIds.add(r.mentorId));
    (system.messages || []).filter((m) => m.startupId === payload.startupId && m.conversationType === 'mentor').forEach((m) => {
        if (m.senderRole === 'mentor' && m.senderId) relatedMentorIds.add(m.senderId);
        if (m.receiverId && system.users?.[m.receiverId]?.role === 'mentor') relatedMentorIds.add(m.receiverId);
    });

    if (user.role === 'founder' || user.role === 'co-founder') {
        const isMember = targetStartup.founderId === user.uid || (targetStartup.coFounders || []).includes(user.uid);
        if (isMember) {
            if (payload.conversationType === 'startup') isValid = true;
            if (payload.conversationType === 'mentor') isValid = payload.receiverId ? relatedMentorIds.has(payload.receiverId) : !!linkedMentorId;
            if (payload.conversationType === 'incubator' && targetStartup.incubatorAssigned) isValid = true;
        }
    } else if (user.role === 'mentor') {
        if (linkedMentorId === user.uid) {
            if (payload.conversationType === 'mentor') isValid = true;
            if (payload.conversationType === 'direct' && targetStartup.incubatorAssigned) isValid = true;
        }
    } else if (user.role === 'incubator') {
        if (targetStartup.incubatorAssigned === user.uid) {
            if (payload.conversationType === 'incubator') isValid = true;
            if (payload.conversationType === 'direct' && targetStartup.mentorAssigned) isValid = true;
        }
    }

    if (!isValid) return false;

    const message = {
        id: null,
        startupId: payload.startupId,
        senderId: user.uid,
        senderName: user.name || 'User',
        senderRole: user.role,
        receiverId: payload.receiverId
            || (payload.conversationType === 'mentor' ? linkedMentorId : null)
            || (payload.conversationType === 'incubator' ? targetStartup.incubatorAssigned : null)
            || (payload.conversationType === 'direct' ? (user.role === 'incubator' ? targetStartup.mentorAssigned : targetStartup.incubatorAssigned) : null),
        conversationType: payload.conversationType,
        message: payload.message,
        readBy: [user.uid],
        createdAt: nowIso(),
        updatedAt: nowIso()
    };

    system.messages = [...(system.messages || []), message];

    if (user.role === 'mentor' && payload.conversationType === 'mentor') {
        targetStartup.activity = [{ id: null, message: 'Mentor sent strategic message', type: 'mentor', timestamp: nowIso() }, ...(targetStartup.activity || [])].slice(0, 50);
    }
    if (user.role === 'incubator' && payload.conversationType === 'incubator') {
        targetStartup.activity = [{ id: null, message: 'Incubator sent decision message', type: 'incubator', timestamp: nowIso() }, ...(targetStartup.activity || [])].slice(0, 50);
    }

    saveSystem(system);
    return true;
};

export const getMessagesForConversation = (user, conversation) => {
    if (!user || !conversation) return [];
    const system = getSystem();

    return (system.messages || [])
        .filter((message) => matchesConversationMessage({ message, conversation, startup: (system.startups || []).find((s) => s.startupId === conversation.startupId) }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const markConversationAsRead = async (user, conversation) => {
    if (!user || !conversation) return;
    const system = getSystem();
    let changed = false;

    system.messages = (system.messages || []).map((m) => {
        const isInConversation = matchesConversationMessage({ message: m, conversation });
        if (isInConversation && !m.readBy.includes(user.uid)) {
            changed = true;
            return { ...m, readBy: [...m.readBy, user.uid] };
        }
        return m;
    });

    if (changed) saveSystem(system);
};