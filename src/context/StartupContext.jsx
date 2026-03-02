import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMessaging } from './MessagingContext';
import { getSystem, saveSystem } from '../utils/system';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

// --- Calculation Helpers (Can be moved to a separate utils file later) ---
export const calculateExecutionScore = (startup) => {
    if (!startup || !startup.milestones || startup.milestones.length === 0) return 30;
    const completed = startup.milestones.filter(m => m.status === 'completed').length;
    const progress = Math.round((completed / startup.milestones.length) * 70);
    return 30 + progress;
};

export const StartupProvider = ({ children }) => {
    const { user } = useAuth();
    const [startup, setStartup] = useState(null);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Sync
    useEffect(() => {
        syncData();
        const handleStorage = () => syncData();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [user]);

    const syncData = () => {
        if (!user) {
            setStartup(null);
            setLoading(false);
            return;
        }

        const system = getSystem();

        // Strict Relational Check:
        // 1. If Founder: s.founderId === user.uid
        // 2. If Co-Founder: user.uid exists in s.coFounders
        const userStartup = system.startups.find(s => {
            if (user.role === 'founder' && s.founderId === user.uid) return true;
            if (['co-founder', 'cofounder'].includes(user.role) && Array.isArray(s.coFounders) && s.coFounders.includes(user.uid)) return true;
            return false;
        });

        if (userStartup) {
            // Recalculate dynamic values
            userStartup.executionScore = calculateExecutionScore(userStartup);

            let completion = 0;
            if (userStartup.startupName) completion += 20;
            if (userStartup.problemStatement) completion += 20;
            if (userStartup.targetAudience?.length > 0) completion += 20;
            if (userStartup.milestones?.length > 0) completion += 20;
            if (userStartup.sector) completion += 20;
            userStartup.profileCompletion = completion;

            setStartup({ ...userStartup });
        } else {
            setStartup(null);
        }

        // Sync Join Requests reactively
        const allRequests = system.joinRequests || [];
        const filteredRequests = allRequests.filter(r =>
            (user.role === 'founder' && r.founderId === user.uid) ||
            (['co-founder', 'cofounder'].includes(user.role) && r.requesterId === user.uid)
        );
        setJoinRequests(filteredRequests);

        setLoading(false);
    };

    const updateSystem = (updatedStartup) => {
        const system = getSystem();
        system.startups = system.startups.map(s =>
            s.startupId === updatedStartup.startupId ? updatedStartup : s
        );
        saveSystem(system);
        setStartup({ ...updatedStartup });
    };

    const updateStartup = (updates) => {
        if (!startup) return;
        const updated = {
            ...startup,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        updateSystem(updated);
    };

    const addActivity = (message, type = 'info') => {
        if (!startup) return;
        const newAct = {
            id: `act_${Date.now()}`,
            message,
            type,
            timestamp: new Date().toISOString()
        };
        updateStartup({
            activity: [newAct, ...(startup.activity || [])].slice(0, 50)
        });
    };

    // --- MILESTONES ---
    const addMilestone = (title) => {
        if (!startup) return;
        const newMilestone = {
            id: Date.now(),
            title,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const updated = {
            ...startup,
            milestones: [...(startup.milestones || []), newMilestone],
            updatedAt: new Date().toISOString()
        };
        updateSystem(updated);
        addActivity(`Added milestone: ${title}`, 'milestone');
    };

    const updateMilestone = (id, updates) => {
        if (!startup) return;
        const updatedMilestones = startup.milestones.map(m =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        );
        updateStartup({ milestones: updatedMilestones });
        if (updates.status === 'completed') {
            const m = startup.milestones.find(ms => ms.id === id);
            addActivity(`Completed milestone: ${m?.title}`, 'success');
        }
    };

    const deleteMilestone = (id) => {
        if (!startup) return;
        updateStartup({
            milestones: startup.milestones.filter(m => m.id !== id)
        });
    };

    // --- DOCUMENTS ---
    const addDocument = (name, size) => {
        if (!startup) return;
        const newDoc = { name, size, uploadedAt: new Date().toISOString() };
        updateStartup({
            documents: [...(startup.documents || []), newDoc]
        });
        addActivity(`Uploaded document: ${name}`, 'document');
    };

    const deleteDocument = (index) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs.splice(index, 1);
        updateStartup({ documents: docs });
    };

    const renameDocument = (index, newName) => {
        if (!startup) return;
        const docs = [...(startup.documents || [])];
        docs[index] = { ...docs[index], name: newName };
        updateStartup({ documents: docs });
    };

    // --- APPLICATIONS ---
    const applyToIncubator = (incubatorId, message) => {
        if (!startup || !user) return;
        const system = getSystem();
        const newApp = {
            id: `app_${Date.now()}`,
            founderId: user.uid,
            startupId: startup.startupId,
            incubatorId: incubatorId,
            startupName: startup.startupName,
            sector: startup.sector || 'General',
            teamSize: startup.teamSize || 1,
            appliedDate: new Date().toISOString(),
            status: "pending",
            message: message || ''
        };
        system.applications.push(newApp);
        saveSystem(system);
        addActivity(`Sent application to incubator`, 'incubator');
    };

    const requestMentorship = (mentorId, message) => {
        if (!startup || !user) return;
        const system = getSystem();
        const newRequest = {
            id: `mreq_${Date.now()}`,
            mentorId,
            startupId: startup.startupId,
            founderId: user.uid,
            message: message || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        system.mentorRequests = system.mentorRequests || [];
        system.mentorRequests.push(newRequest);
        saveSystem(system);
        addActivity(`Requested mentorship from mentor`, 'mentor');
    };

    const requestSession = (date, time, topic) => {
        if (!startup || !user) return;
        const system = getSystem();
        const newSession = {
            id: `ses_${Date.now()}`,
            startupId: startup.startupId,
            founderId: user.uid,
            mentorId: startup.mentorAssigned,
            date,
            time,
            topic,
            status: 'pending_confirmation',
            createdAt: new Date().toISOString()
        };

        if (!system.sessions) system.sessions = [];
        system.sessions.push(newSession);

        addActivity({
            message: `Requested session for ${date}`,
            type: 'info'
        });

        saveSystem(system);
        syncData();
    };

    const cancelSession = (sessionId) => {
        if (!startup || !user) return;
        const system = getSystem();
        const session = (system.sessions || []).find(s => s.id === sessionId);
        if (!session) return;

        session.status = 'cancelled';
        session.updatedAt = new Date().toISOString();

        addActivity({
            message: `Session for ${session.date} was cancelled`,
            type: 'warning'
        });

        saveSystem(system);
        syncData();
    };

    const leaveStartup = () => {
        if (!startup || !user) return;
        const system = getSystem();
        system.startups = system.startups.map(s => {
            if (s.startupId === startup.startupId) {
                return {
                    ...s,
                    coFounders: (s.coFounders || []).filter(uid => uid !== user.uid)
                };
            }
            return s;
        });
        saveSystem(system);
        setStartup(null);
    };

    // --- INVITATIONS ---
    const sendInvitation = (invitedEmail) => {
        if (!startup) return;
        const system = getSystem();
        const newInvitation = {
            id: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            startupId: startup.startupId,
            invitedEmail: invitedEmail.toLowerCase(),
            invitedUserId: null,
            status: "pending",
            createdAt: new Date().toISOString()
        };
        system.invitations = system.invitations || [];
        system.invitations.push(newInvitation);
        saveSystem(system);
        addActivity(`Invited ${invitedEmail}`, 'info');
        syncData();
        return newInvitation;
    };

    const sendDirectInvitation = (invitedUserId, invitedEmail, message = '') => {
        if (!startup) return;
        const system = getSystem();
        system.invitations = system.invitations || [];

        // Check for duplicates
        const exists = system.invitations.find(i =>
            i.startupId === startup.startupId &&
            i.invitedUserId === invitedUserId &&
            i.status === 'pending'
        );
        if (exists) return { error: "Invitation already pending" };

        const newInvitation = {
            id: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            startupId: startup.startupId,
            founderId: user.uid,
            invitedUserId,
            invitedEmail: invitedEmail?.toLowerCase() || null,
            status: "pending",
            message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        system.invitations.push(newInvitation);
        saveSystem(system);

        // Log activity
        const invitedUser = (system.users || {})[invitedUserId];
        const invitedName = invitedUser?.name || invitedEmail || 'Co-Founder';
        addActivity(`Invitation sent to ${invitedName}`, 'info');

        syncData();
        return { success: true, invitation: newInvitation };
    };

    const validateInvitation = (code) => {
        const system = getSystem();
        const inv = system.invitations.find(i =>
            (i.id === code || i.startupId === code) && i.status === 'pending'
        );
        if (inv) return inv;

        // Fallback: check by founder email
        const startupByEmail = system.startups.find(s => {
            const founderProfile = system.users[s.founderId];
            return founderProfile && founderProfile.email.toLowerCase() === code.toLowerCase();
        });

        if (startupByEmail) {
            return {
                id: 'AUTO',
                startupId: startupByEmail.startupId,
                status: 'pending'
            };
        }
        return null;
    };

    const acceptInvitation = (inviteCode) => {
        if (!user) return false;
        const system = getSystem();
        const inv = system.invitations.find(i =>
            (i.id === inviteCode || i.startupId === inviteCode) && i.status === 'pending'
        );

        let startupId = inv ? inv.startupId : null;

        if (!inv) {
            // Check founder email fallback
            const startupByEmail = system.startups.find(s => {
                const founderProfile = system.users[s.founderId];
                return founderProfile && founderProfile.email.toLowerCase() === inviteCode.toLowerCase();
            });
            if (startupByEmail) startupId = startupByEmail.startupId;
        }

        if (startupId) {
            if (inv) {
                inv.status = 'accepted';
                inv.invitedUserId = user.uid;
            }

            system.startups = system.startups.map(s => {
                if (s.startupId === startupId) {
                    const coFounders = s.coFounders || [];
                    if (!coFounders.includes(user.uid)) {
                        return { ...s, coFounders: [...coFounders, user.uid] };
                    }
                }
                return s;
            });
            saveSystem(system);
            syncData();
            return true;
        }
        return false;
    };

    const sendJoinRequest = (startupId, message) => {
        if (!user || (user.role !== 'co-founder' && user.role !== 'cofounder')) return { error: "Unauthorized" };
        const system = getSystem();
        const targetStartup = system.startups.find(s => s.startupId === startupId);
        if (!targetStartup) return { error: "Startup not found" };

        // Prevention: Check if already applied
        const existing = (system.joinRequests || []).find(r => r.startupId === startupId && r.requesterId === user.uid && r.status === 'pending');
        if (existing) return { error: "Request already pending" };

        const newRequest = {
            id: `jreq_${Date.now()}`,
            startupId,
            founderId: targetStartup.founderId,
            requesterId: user.uid,
            requesterName: user.name || user.profileData?.fullName || user.email?.split('@')[0] || 'Co-Founder',
            status: 'pending',
            message: message || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        system.joinRequests = system.joinRequests || [];
        system.joinRequests.push(newRequest);

        // Activity for Startup
        targetStartup.activity = [
            {
                id: `act_${Date.now()}_join`,
                message: `New join request from ${newRequest.requesterName}`,
                type: 'info',
                timestamp: new Date().toISOString()
            },
            ...(targetStartup.activity || [])
        ].slice(0, 50);

        saveSystem(system);
        syncData();
        return { success: true, request: newRequest };
    };
    const acceptJoinRequest = (requestId) => {
        const system = getSystem();
        const req = (system.joinRequests || []).find(r => r.id === requestId);
        if (!req) return;

        req.status = 'accepted';
        req.updatedAt = new Date().toISOString();

        const startupToUpdate = system.startups.find(s => s.startupId === req.startupId);
        if (startupToUpdate) {
            // Update coFounders array
            startupToUpdate.coFounders = [...new Set([...(startupToUpdate.coFounders || []), req.requesterId])];

            // Log Activity
            startupToUpdate.activity = [
                {
                    id: `act_${Date.now()}`,
                    message: `${req.requesterName} joined the team`,
                    type: 'success',
                    timestamp: new Date().toISOString()
                },
                ...(startupToUpdate.activity || [])
            ].slice(0, 50);

            startupToUpdate.executionScore = calculateExecutionScore(startupToUpdate);
        }

        saveSystem(system);
        syncData();
    };

    const rejectJoinRequest = (requestId) => {
        const system = getSystem();
        const req = (system.joinRequests || []).find(r => r.id === requestId);
        if (!req) return;

        req.status = 'rejected';
        req.updatedAt = new Date().toISOString();

        const startupToUpdate = system.startups.find(s => s.startupId === req.startupId);
        if (startupToUpdate) {
            startupToUpdate.activity = [
                {
                    id: `act_${Date.now()}`,
                    message: `Join request declined`,
                    type: 'warning',
                    timestamp: new Date().toISOString()
                },
                ...(startupToUpdate.activity || [])
            ].slice(0, 50);
        }

        saveSystem(system);
        syncData();
    };

    const withdrawJoinRequest = (requestId) => {
        const system = getSystem();
        const req = (system.joinRequests || []).find(r => r.id === requestId);
        if (!req) return;

        req.status = 'withdrawn';
        req.updatedAt = new Date().toISOString();

        const startupToUpdate = system.startups.find(s => s.startupId === req.startupId);
        if (startupToUpdate) {
            startupToUpdate.activity = [
                {
                    id: `act_${Date.now()}`,
                    message: `Co-Founder withdrew join request`,
                    type: 'info',
                    timestamp: new Date().toISOString()
                },
                ...(startupToUpdate.activity || [])
            ].slice(0, 50);
        }

        saveSystem(system);
        syncData();
    };

    // Redirection to new Messaging System
    const messaging = useMessaging();
    const sendMessage = (text, channel = 'team') => {
        if (!startup) return;
        messaging.sendMessage({
            startupId: startup.startupId,
            conversationType: channel === 'mentor' ? 'mentor' : 'startup',
            message: text
        });
    };

    const removeJoinRequest = (requestId) => {
        const system = getSystem();
        system.joinRequests = (system.joinRequests || []).filter(r => r.id !== requestId);
        saveSystem(system);
        syncData();
    };

    const value = {
        startup,
        loading,
        updateStartup,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addDocument,
        deleteDocument,
        renameDocument,
        applyToIncubator,
        requestMentorship,
        requestSession,
        cancelSession,
        leaveStartup,
        sendInvitation,
        sendDirectInvitation,
        validateInvitation,
        acceptInvitation,
        sendJoinRequest,
        acceptJoinRequest,
        rejectJoinRequest,
        withdrawJoinRequest,
        removeJoinRequest,
        sendMessage,
        addActivity,
        allStartups: getSystem().startups || [],
        joinRequests, // Reactively synced
        invitations: (getSystem().invitations || []).filter(i => i.startupId === startup?.startupId),
        applications: (getSystem().applications || []).filter(a => a.founderId === user?.uid),
        mentorRequests: (getSystem().mentorRequests || []).filter(r => r.founderId === user?.uid),
        sessions: (getSystem().sessions || []).filter(s => s.startupId === startup?.startupId)
    };

    return (
        <StartupContext.Provider value={value}>
            {!loading && children}
        </StartupContext.Provider>
    );
};
