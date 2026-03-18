import React, { useEffect, useMemo, useState } from 'react';
import {
    Search,
    UserPlus,
    Users,
    Rocket,
    CheckCircle2,
    Clock,
    XCircle,
    Send,
    Briefcase,
    Zap,
    Building,
    ExternalLink,
    MessageSquare,
    ChevronRight,
    SearchX,
    ShieldCheck,
    AlertCircle,
    X,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { getSystem } from '../../../utils/system';
import { Navigate } from 'react-router-dom';

const normalizeStage = (value) => {
    const normalized = (value || '').toString().trim().toLowerCase();
    const map = {
        idea: 'Idea',
        validation: 'Validation',
        mvp: 'MVP',
        revenue: 'Revenue',
        scale: 'Scale'
    };

    return map[normalized] || (value ? String(value) : 'Any');
};

const normalizeSector = (value) => {
    if (!value) return 'General';

    const normalized = value.toString().trim().toLowerCase();
    const map = {
        ai: 'AI/ML',
        'ai/ml': 'AI/ML',
        fintech: 'Fintech',
        edtech: 'Edtech',
        healthtech: 'Healthtech',
        saas: 'SaaS',
        tech: 'Technology',
        technology: 'Technology',
        other: 'General'
    };

    return map[normalized] || value;
};

const toSkillArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        return value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }
    return [];
};

const normalizeCoFounderProfile = (userProfile) => ({
    ...userProfile,
    uid: userProfile.uid,
    email: userProfile.email,
    name: userProfile.name || userProfile.fullName || userProfile.email?.split('@')[0] || 'Co-Founder',
    skills: toSkillArray(userProfile.skills || userProfile.primarySkills || userProfile.profileData?.primarySkills),
    expertiseSector: normalizeSector(userProfile.expertiseSector || userProfile.sector || userProfile.profileData?.sector),
    preferredStage: normalizeStage(userProfile.preferredStage || userProfile.stage || userProfile.profileData?.stage),
    experienceSummary: userProfile.experienceSummary || userProfile.bio || userProfile.profileData?.bio || 'Available to join a startup team.',
    location: userProfile.location || userProfile.profileData?.location || '',
    commitment: userProfile.commitment || userProfile.profileData?.commitment || ''
});

const FindCoFounder = () => {
    const { user } = useAuth();
    const { startup, loading, sendDirectInvitation, cancelInvitation, invitations: startupInvitations } = useStartup();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('All');
    const [selectedSkill, setSelectedSkill] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [inviteMessage, setInviteMessage] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [systemState, setSystemState] = useState({ users: {}, startups: [] });

    useEffect(() => {
        const refreshData = () => {
            const system = getSystem();
            setSystemState({
                users: system.users || {},
                startups: system.startups || []
            });
        };

        refreshData();
        const handleStorage = () => refreshData();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const allUsers = useMemo(
        () => Object.values(systemState.users || {}),
        [systemState.users]
    );
    const allStartups = systemState.startups || [];

    const normalizedCoFounders = useMemo(
        () => allUsers.map(normalizeCoFounderProfile),
        [allUsers]
    );

    // Filter for unlinked co-founders
    const unlinkedCoFounders = useMemo(() => {
        return normalizedCoFounders.filter(u => {
            const role = u.role?.toLowerCase() || '';
            if (role !== 'co-founder' && role !== 'cofounder') return false;
            if (u.uid === user.uid) return false;

            // Check if already in a startup
            const isJoined = allStartups.some(s =>
                (Array.isArray(s.coFounders) && s.coFounders.includes(u.uid)) ||
                (s.founderId === u.uid)
            );
            if (isJoined) return false;

            // Check if they already have an invitation from THIS startup 
            // We omit them if there's any invitation record (pending, accepted, declined) 
            // to prevent spam or re-inviting someone who declined.
            const hasInvitation = startupInvitations?.some(inv =>
                inv.invitedUserId === u.uid ||
                (inv.invitedEmail && u.email && inv.invitedEmail.toLowerCase() === u.email.toLowerCase())
            );
            if (hasInvitation) return false;

            return true;
        });
    }, [normalizedCoFounders, allStartups, user.uid, startupInvitations]);

    // --- MATCHING LOGIC ---
    const getMatchScore = (cf) => {
        if (!startup) return 0;
        let score = 0;
        const startupSkillGap = startup.skillGap?.toLowerCase() || '';
        const startupSector = normalizeSector(startup.expertiseSector || startup.sector);
        const cfSkills = (cf.skills || []).map(s => s.toLowerCase());
        const cfSummary = (cf.experienceSummary || '').toLowerCase();

        // 1. Skill Match (Weight: 50)
        if (cfSkills.some(s => startupSkillGap.includes(s) || s.includes(startupSkillGap))) score += 40;
        if (cfSummary.includes(startupSkillGap)) score += 10;

        // 2. Sector Match (Weight: 25)
        if (cf.expertiseSector === startupSector) score += 25;

        // 3. Stage Alignment (Weight: 25)
        if (cf.preferredStage === startup.stage || cf.preferredStage === 'Any') score += 25;

        return Math.min(score, 100);
    };

    const filteredTalent = useMemo(() => {
        return unlinkedCoFounders
            .map(cf => ({ ...cf, matchScore: getMatchScore(cf) }))
            .filter(cf => {
                const matchesSearch = cf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    cf.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesSector = selectedSector === 'All' || cf.expertiseSector === selectedSector;
                const matchesSkill = selectedSkill === 'All' || cf.skills?.includes(selectedSkill);
                return matchesSearch && matchesSector && matchesSkill;
            })
            .sort((a, b) => b.matchScore - a.matchScore);
    }, [unlinkedCoFounders, searchQuery, selectedSector, selectedSkill, startup]);

    // Unique skills and sectors for filters
    const availableSectors = ['All', ...new Set(unlinkedCoFounders.map(u => u.expertiseSector).filter(Boolean))];
    const availableSkills = ['All', ...new Set(unlinkedCoFounders.flatMap(u => u.skills || []).filter(Boolean))];

    const usersById = useMemo(() => {
        return Object.fromEntries(normalizedCoFounders.map(profile => [profile.uid, profile]));
    }, [normalizedCoFounders]);

    if (loading) return null;
    if (!startup) return <Navigate to="/founder/my-startup" />;

    // --- HANDLERS ---
    const handleInvite = (cf) => {
        setSelectedUser(cf);
        setIsInviteModalOpen(true);
    };

    const confirmInvite = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        const result = sendDirectInvitation(selectedUser.uid, selectedUser.email, inviteMessage);
        if (result.success) {
            setIsInviteModalOpen(false);
            setSelectedUser(null);
            setInviteMessage('');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } else {
            alert(result.error || "Failed to send invitation");
        }
    };

    // --- RENDER HELPERS ---
    const InvitationStatus = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            accepted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
            declined: 'bg-red-500/10 text-red-500 border-red-500/20'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[110] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm"
                    >
                        <ShieldCheck size={20} />
                        Invitation Sent Successfully
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Co-Founder</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">Discover and recruit elite talent for <span className="text-white font-bold">{startup.startupName}</span>.</p>
                </div>
                <div className="flex items-center gap-4 bg-[#1E1E2F] p-4 rounded-2xl border border-white/5 shadow-inner">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Team Size</p>
                        <p className="text-xl font-black text-white">{1 + (startup.coFounders?.length || 0)} / 5</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                        <Users size={20} />
                    </div>
                </div>
            </div>

            {/* Skill Gap Banner */}
            <div className="bg-brand-purple/5 border border-brand-purple/20 p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Rocket size={80} />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple shadow-lg">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight">Recruitment Target</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="px-3 py-1 bg-brand-purple/20 text-brand-purple text-[10px] font-black uppercase rounded-lg border border-brand-purple/30">
                                {startup.skillGap || "General Skills"} Needed
                            </span>
                            <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black uppercase rounded-lg border border-white/10">
                                {normalizeSector(startup.expertiseSector || startup.sector)}
                            </span>
                            <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black uppercase rounded-lg border border-white/10">
                                {startup.stage} Stage
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-[#1E1E2F] p-6 rounded-3xl border border-white/5 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-purple transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, skills or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="bg-[#0F0F14] border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-purple/50"
                        >
                            {availableSectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
                        </select>
                        <select
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value)}
                            className="bg-[#0F0F14] border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-purple/50"
                        >
                            {availableSkills.map(s => <option key={s} value={s}>{s === 'All' ? 'All Skills' : s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Talent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTalent.length > 0 ? (
                    filteredTalent.map((cf) => {
                        const isPending = startupInvitations?.some(i => i.invitedUserId === cf.uid && i.status === 'pending');
                        return (
                            <motion.div
                                key={cf.uid}
                                whileHover={{ y: -5 }}
                                className="bg-[#1E1E2F] rounded-3xl border border-white/5 overflow-hidden flex flex-col group hover:border-brand-purple/30 transition-all shadow-xl"
                            >
                                <div className="p-6 pb-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-brand-purple/20 group-hover:rotate-3 transition-transform relative">
                                            {cf.name?.[0] || 'C'}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1E1E2F]" title="Available" />
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 justify-end text-[10px] font-black text-brand-purple uppercase tracking-widest mb-1">
                                                <Zap size={10} fill="currentColor" /> Match Score
                                            </div>
                                            <span className="text-2xl font-black text-white">{cf.matchScore}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-black text-white truncate">{cf.name}</h3>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded border border-emerald-500/20">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-4">
                                        <Briefcase size={12} />
                                        {cf.expertiseSector} Specialist
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 h-8 font-medium italic mb-6">
                                        "{cf.experienceSummary || 'Experienced co-founder ready for the next challenge.'}"
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {(cf.skills || []).slice(0, 3).map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-gray-300 border border-white/5 uppercase">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto p-4 bg-[#0F0F14]/30 border-t border-white/5">
                                    <button
                                        onClick={() => handleInvite(cf)}
                                        disabled={isPending}
                                        className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isPending
                                            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 cursor-default'
                                            : 'bg-brand-purple text-white hover:shadow-lg hover:shadow-brand-purple/20 active:scale-95 shadow-lg'
                                            }`}
                                    >
                                        {isPending ? (
                                            <><Clock size={16} /> Invitation Pending</>
                                        ) : (
                                            <><UserPlus size={16} /> Invite to Join</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 bg-[#1E1E2F] rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-700 mb-6">
                            <SearchX size={40} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">No Talent Found</h3>
                        <p className="text-gray-500 max-w-xs font-medium italic">Try adjusting your filters or search keywords to find the perfect match.</p>
                    </div>
                )}
            </div>

            {/* Outgoing Invitations */}
            <div className="bg-[#1E1E2F] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Send className="text-brand-purple" size={20} />
                            Pending Invitations
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Track outgoing requests to potential co-founders.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0F0F14]/50 border-b border-white/5">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Co-Founder</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sent Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(startupInvitations || []).length > 0 ? (
                                [...startupInvitations].reverse().map((inv) => {
                                    const invitedUser = usersById[inv.invitedUserId] || (inv.invitedUserId ? normalizeCoFounderProfile((systemState.users || {})[inv.invitedUserId] || {}) : null);
                                    return (
                                        <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-gray-400 border border-white/5 text-sm uppercase">
                                                        {invitedUser?.name?.[0] || inv.invitedEmail?.[0] || 'C'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{invitedUser?.name || inv.invitedEmail}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{invitedUser?.expertiseSector || 'General'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-bold text-gray-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <InvitationStatus status={inv.status} />
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {inv.status === 'pending' ? (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Cancel this invitation?")) {
                                                                cancelInvitation(inv.id);
                                                            }
                                                        }}
                                                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors border border-red-500/20"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-gray-500 font-bold italic uppercase">Archived</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center">
                                        <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.2em] italic">No outgoing invitations yet</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsInviteModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-[#1E1E2F] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <UserPlus size={100} />
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2">Invite <span className="text-brand-purple">{selectedUser.name}</span></h2>
                                    <p className="text-xs text-gray-500 font-medium italic">Recruit talent for your startup mission.</p>
                                </div>
                                <button
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={confirmInvite} className="space-y-8 relative z-10">
                                <div className="bg-[#0F0F14] border border-white/5 p-6 rounded-3xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                                            <Building size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Inviting to Join</p>
                                            <p className="text-sm font-black text-white">{startup.startupName}</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 my-4" />
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-500">Matching Role:</span>
                                        <span className="text-emerald-500">{startup.skillGap || 'Co-Founder'}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-4">Personalized Message</label>
                                    <textarea
                                        value={inviteMessage}
                                        onChange={(e) => setInviteMessage(e.target.value)}
                                        placeholder="Hey! I saw your profile and your experience in fintech perfectly matches our mission to solve payments..."
                                        className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl px-6 py-5 text-sm font-medium text-white focus:outline-none focus:border-brand-purple/50 h-40 resize-none placeholder:text-gray-700"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteModalOpen(false)}
                                        className="flex-1 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Send size={18} /> Send Invitation
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FindCoFounder;
