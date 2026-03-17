import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMessaging } from './MessagingContext';
import { getSystem, saveSystem } from '../utils/system';

const StartupContext = createContext();

export const useStartup = () => useContext(StartupContext);

// --- Calculation Helpers (Can be moved to a separate utils file later) ---
export const calculateExecutionScore = (startup) => {
    let baseScore = 20; // Start at 20 unconditionally
    if (!startup) return baseScore;

    // Advanced Execution Logic
    // Stage multipliers (harder stages = more score points)
    const stageWeights = { 'Idea': 1, 'Validation': 1.5, 'MVP': 2, 'Revenue': 3, 'Scale': 4 };

    let earnedPoints = 0;
    let totalPossiblePoints = 0;

    (startup.milestones || []).forEach(m => {
        const weight = stageWeights[m.stage] || 1;
        totalPossiblePoints += weight;
        if (m.status === 'completed') {
            earnedPoints += weight;
        }
    });

    const progressRatio = totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) : 0;
    const milestoneScore = Math.round(progressRatio * 70);

    // Mentor validation bonus comes from assigned mentor + completed mentorship sessions.
    const mentorAssignedBonus = startup.mentorAssigned ? 6 : 0;
    let mentorSessionBonus = 0;
    if (startup.startupId) {
        const system = getSystem();
        const completedSessions = (system.sessions || []).filter(
            s => s.startupId === startup.startupId && s.status === 'completed'
        ).length;
        mentorSessionBonus = Math.min(completedSessions * 2, 4);
    }

    const focusAreaBonus = Math.min((startup.focusAreas || []).length, 2);

    // Total score = baseline + milestone execution + mentor validation signals.
    const finalScore = baseScore + milestoneScore + mentorAssignedBonus + mentorSessionBonus + focusAreaBonus;
    return Math.min(finalScore, 100);
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
            if (userStartup.startupName) completion += 15;
            if (userStartup.problemStatement) completion += 15;
            if (userStartup.targetAudience?.length > 0) completion += 15;
            if (userStartup.sector) completion += 15;
            if (userStartup.milestones?.length > 0) completion += 20;
            if (userStartup.documents?.length > 0) completion += 20;
            userStartup.profileCompletion = Math.min(completion, 100);

            // Dynamically compute team size
            userStartup.teamSize = 1 + (Array.isArray(userStartup.coFounders) ? userStartup.coFounders.length : 0);

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
        syncData();
    };

    const updateStartup = (updates) => {
        if (!startup) return;
        const system = getSystem();
        const currentStartup = system.startups.find(s => s.startupId === startup.startupId) || startup;
        const updated = {
            ...currentStartup,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        updated.executionScore = calculateExecutionScore(updated);
        if (updates.activeUsers !== undefined && updates.activeUsers !== currentStartup.activeUsers) {
            updated.lastTractionUpdate = new Date().toISOString();
        }
        updateSystem(updated);
    };

    const addActivity = (message, type = 'info') => {
        if (!startup) return;
        const system = getSystem();
        const currentStartup = system.startups.find(s => s.startupId === startup.startupId) || startup;
        const newAct = {
            id: `act_${Date.now()}`,
            message,
            type,
            timestamp: new Date().toISOString()
        };
        updateStartup({
            activity: [newAct, ...(currentStartup.activity || [])].slice(0, 50)
        });
    };

    // --- MILESTONES ---
    const addMilestone = (title, description = '', stage = 'Idea', deadline = '') => {
        if (!startup) return;
        const system = getSystem();
        const currentStartup = system.startups.find(s => s.startupId === startup.startupId) || startup;
        const newMilestone = {
            id: Date.now(),
            title,
            description,
            stage,
            deadline,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        updateStartup({
            milestones: [...(currentStartup.milestones || []), newMilestone]
        });
        addActivity(`Added milestone: ${title}`, 'milestone');
    };

    const updateMilestone = (id, updates) => {
        if (!startup) return;
        const system = getSystem();
        const currentStartup = system.startups.find(s => s.startupId === startup.startupId) || startup;
        const updatedMilestones = currentStartup.milestones.map(m =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
        );
        updateStartup({ milestones: updatedMilestones });
        if (updates.status === 'completed') {
            const m = currentStartup.milestones.find(ms => ms.id === id);
            addActivity(`Milestone completed: ${m?.title || 'Task'}`, 'success');
        }
    };

    const deleteMilestone = (id) => {
        if (!startup) return;
        const system = getSystem();
        const currentStartup = system.startups.find(s => s.startupId === startup.startupId) || startup;
        updateStartup({
            milestones: currentStartup.milestones.filter(m => m.id !== id)
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

        // Guard 1: Already assigned a mentor
        if (startup.mentorAssigned) {
            addActivity('You already have an assigned mentor.', 'warning');
            return;
        }

        const system = getSystem();
        system.mentorRequests = system.mentorRequests || [];

        // Guard 2: Already requested this mentor
        const existingRequest = system.mentorRequests.find(r =>
            r.startupId === startup.startupId &&
            r.mentorId === mentorId &&
            r.status === 'pending'
        );
        if (existingRequest) {
            addActivity('Mentorship request already pending for this mentor.', 'warning');
            return;
        }

        const mentor = system.users[mentorId] || system.users?.find?.(u => u.uid === mentorId);
        const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

        const newRequest = {
            id: `mreq_${Date.now()}`,
            mentorId,
            startupId: startup.startupId,
            founderId: user.uid,
            message: message || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        system.mentorRequests.push(newRequest);
        saveSystem(system);
        addActivity(`Mentorship request sent to ${mentorName}`, 'mentor');
    };

    const requestSession = (date, time, topic) => {
        if (!startup || !user || !startup.mentorAssigned) return;
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

        addActivity(`Requested session for ${date}`, 'info');

        saveSystem(system);
        syncData();
    };

    const removeAssignedMentor = () => {
        if (!startup || !user || !startup.mentorAssigned) return;

        const system = getSystem();
        const mentor = system.users?.[startup.mentorAssigned];
        const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Mentor';

        const updatedStartups = (system.startups || []).map(s => {
            if (s.startupId !== startup.startupId) return s;

            const updated = {
                ...s,
                mentorAssigned: null,
                mentorshipStartDate: null,
                updatedAt: new Date().toISOString(),
                activity: [
                    {
                        id: `act_${Date.now()}`,
                        message: `Mentor ${mentorName} was removed from the startup`,
                        type: 'warning',
                        timestamp: new Date().toISOString()
                    },
                    ...(s.activity || [])
                ].slice(0, 50)
            };

            updated.executionScore = calculateExecutionScore(updated);
            return updated;
        });

        system.startups = updatedStartups;
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

    // Helper to determine if the current user is linked to a startup
    const isUserLinked = () => {
        return !!startup;
    };

    // Resignation system for co-founders
    const resignFromStartup = () => {
        if (!startup || !user) return;
        const system = getSystem();
        system.startups = system.startups.map(s => {
            if (s.startupId === startup.startupId) {
                const newCoFounders = (s.coFounders || []).filter(uid => uid !== user.uid);
                // Log activity
                const activityMsg = `Co-Founder ${user.name || user.email} resigned from the team`;
                s.activity = [{
                    id: `act_${Date.now()}`,
                    message: activityMsg,
                    type: 'info',
                    timestamp: new Date().toISOString()
                }, ...(s.activity || [])].slice(0, 50);
                return { ...s, coFounders: newCoFounders };
            }
            return s;
        });
        saveSystem(system);
        setStartup(null);
        syncData();
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
                inv.updatedAt = new Date().toISOString();
            }

            system.startups = system.startups.map(s => {
                if (s.startupId === startupId) {
                    const coFounders = s.coFounders || [];
                    if (!coFounders.includes(user.uid)) {
                        const newCoFounders = [...coFounders, user.uid];

                        // Log Activity
                        const activityMsg = `${user.name || user.email || 'A Co-Founder'} joined the team via invitation`;
                        const newAct = {
                            id: `act_${Date.now()}`,
                            message: activityMsg,
                            type: 'success',
                            timestamp: new Date().toISOString()
                        };

                        return {
                            ...s,
                            coFounders: newCoFounders,
                            activity: [newAct, ...(s.activity || [])].slice(0, 50),
                            teamSize: newCoFounders.length + 1 // founder + cofounders
                        };
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

    const declineInvitation = (invitationId) => {
        if (!user) return false;
        const system = getSystem();
        const inv = system.invitations.find(i => i.id === invitationId && i.status === 'pending');

        if (inv) {
            inv.status = 'declined';
            inv.updatedAt = new Date().toISOString();

            // Log activity for the startup
            system.startups = system.startups.map(s => {
                if (s.startupId === inv.startupId) {
                    const activityMsg = `Invitation declined by ${user.name || user.email || 'candidate'}`;
                    const newAct = {
                        id: `act_${Date.now()}`,
                        message: activityMsg,
                        type: 'warning',
                        timestamp: new Date().toISOString()
                    };
                    return { ...s, activity: [newAct, ...(s.activity || [])].slice(0, 50) };
                }
                return s;
            });

            saveSystem(system);
            syncData();
            return true;
        }
        return false;
    };

    const cancelInvitation = (invitationId) => {
        if (!startup) return false;
        const system = getSystem();

        // Remove the invitation entirely or mark it as cancelled. 
        // We'll filter it out to cleanly drop it from the pending table and allow re-invites.
        const originalLength = (system.invitations || []).length;
        system.invitations = (system.invitations || []).filter(i => i.id !== invitationId);

        if (system.invitations.length < originalLength) {
            saveSystem(system);

            // Log activity
            addActivity(`Cancelled outgoing invitation`, 'info');
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

        // Prevention: Check if already applied or already linked elsewhere
        if (isUserLinked()) {
            return { error: "User must resign from current startup before applying" };
        }
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

        // Prevent accepting if user is already linked to a startup - BUT ONLY IF THEY ARE A CO-FOUNDER
        // Founders are ALWAYS linked to their own startup.
        if (['co-founder', 'cofounder'].includes(user.role) && isUserLinked()) {
            return { error: "User must resign from current startup first." };
        }

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

    const createStartup = (startupData) => {
        if (!user || user.role !== 'founder') return;
        const system = getSystem();

        const capitalizeStage = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Idea';

        const newStartup = {
            startupId: `ST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            founderId: user.uid,
            startupName: startupData.startupName || 'My Startup',
            sector: startupData.sector || 'General',
            stage: capitalizeStage(startupData.stage),
            oneLiner: startupData.oneLiner || '',
            solutionOverview: startupData.solutionOverview || '',
            traction: '',
            growth: startupData.growth || '',
            revenue: startupData.revenue || '',
            fundingGoal: '',
            marketInfo: startupData.marketInfo || '',
            teamSize: parseInt(startupData.teamSize) || 1,
            milestones: [],
            focusAreas: [],
            problemStatement: startupData.problemStatement || '',
            targetAudience: startupData.targetAudience
                ? startupData.targetAudience.split(',').map(a => a.trim()).filter(Boolean)
                : [],
            skillGap: startupData.lookingFor || '',
            primarySkills: startupData.primarySkills || '',
            location: startupData.location || '',
            commitment: startupData.commitment || '',
            linkedin: startupData.linkedin || '',
            equity: startupData.equity || '',
            demoLink: startupData.demoLink || '',
            pitchDeckLink: startupData.pitchDeckLink || '',
            website: '',
            documents: [],
            activeUsers: Number(startupData.activeUsers) || 0,
            executionScore: 0,
            createdAt: new Date().toISOString(),
            mentorAssigned: null,
            applications: [],
            activity: [{
                id: `act_${Date.now()}`,
                message: 'Venture profile initialized.',
                type: 'info',
                timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString(),
            status: 'active'
        };

        system.startups.push(newStartup);
        saveSystem(system);
        syncData();
        return newStartup;
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

        // Invites / Join Requests
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
