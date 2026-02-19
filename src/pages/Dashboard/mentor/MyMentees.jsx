
import React, { useState, useMemo } from 'react';
import {
    Users,
    Rocket,
    Calendar,
    CheckCircle2,
    Clock,
    TrendingUp,
    ChevronRight,
    MessageSquare,
    ListTodo,
    ChevronLeft,
    Zap,
    Plus,
    X,
    Target,
    BarChart2,
    AlertCircle,
    Send,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMentor } from '../../../context/MentorContext';
import { useAuth } from '../../../context/AuthContext';
import { calculateExecutionScore } from '../../../utils/executionScore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Hydrate a raw startup object with:
 *  - founderName (from users)
 *  - dynamically computed executionScore
 *  - traction growth from tractionHistory
 *  - sessions for this startup (from mentor's sessions)
 */
const hydrateStartup = (startup, allUsers, allSessions, mentorId) => {
    // Founder name
    const allUsersList = Object.values(allUsers || {});
    const founder = allUsersList.find(u => u.uid === startup.founderId);
    const founderName = founder?.name || founder?.email?.split('@')[0] || 'Unknown Founder';

    // Execution score — use shared utility (identical to founder portal)
    const executionScore = calculateExecutionScore(startup);

    // Filter sessions for THIS startup
    const startupSessions = allSessions.filter(s => s.startupId === startup.startupId);

    // Traction growth from tractionHistory
    const tractionHistory = Array.isArray(startup.tractionHistory) ? startup.tractionHistory : [];
    let growthPercent = null;
    let growthDirection = null;
    if (tractionHistory.length >= 2) {
        const latest = parseFloat(tractionHistory[tractionHistory.length - 1]?.value) || 0;
        const prev = parseFloat(tractionHistory[tractionHistory.length - 2]?.value) || 0;
        if (prev > 0) {
            growthPercent = (((latest - prev) / prev) * 100).toFixed(1);
            growthDirection = latest >= prev ? 'up' : 'down';
        }
    }

    // Last & next session
    const completedSessions = startupSessions.filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
    const upcomingSessions = startupSessions.filter(s => s.status === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const lastSession = completedSessions[0] || null;
    const nextSession = upcomingSessions[0] || null;

    return {
        ...startup,
        founderName,
        executionScore,
        growthPercent,
        growthDirection,
        milestones: Array.isArray(startup.milestones) ? startup.milestones : [],
        focusAreas: Array.isArray(startup.focusAreas) ? startup.focusAreas : [],
        messages: Array.isArray(startup.messages) ? startup.messages : [],
        lastSession,
        nextSession,
        startupSessions,
    };
};

// ─── MenteeCard ───────────────────────────────────────────────────────────────

const MenteeCard = ({ startup, onSelect }) => {
    const completedMilestones = startup.milestones.filter(m => m.status === 'completed').length;

    const formatSessionDate = (session) => {
        if (!session) return null;
        try { return new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
        catch { return session.date; }
    };

    return (
        <motion.div
            layout
            onClick={() => onSelect(startup)}
            className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group cursor-pointer"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-black/20 group-hover:scale-105 transition-transform flex-shrink-0">
                        {startup.startupName?.[0] || '?'}
                    </div>
                    <div>
                        <h4 className="text-white font-black group-hover:text-[#8B5CF6] transition-colors">{startup.startupName || 'Unknown Startup'}</h4>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{startup.founderName}</p>
                    </div>
                </div>
                {startup.growthPercent !== null ? (
                    <div className={`p-2 rounded-lg flex items-center gap-1 ${parseFloat(startup.growthPercent) >= 0
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {parseFloat(startup.growthPercent) >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        <span className="text-[10px] font-black uppercase">{Math.abs(startup.growthPercent)}%</span>
                    </div>
                ) : (
                    <div className="p-2 rounded-lg bg-white/5 text-gray-600 border border-white/5 flex items-center gap-1">
                        <Minus size={12} />
                        <span className="text-[10px] font-black uppercase">No data</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Last Session</p>
                    <p className="text-xs font-bold text-gray-300">
                        {formatSessionDate(startup.lastSession) || <span className="text-gray-600 italic">None yet</span>}
                    </p>
                </div>
                <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">
                    <p className="text-[9px] text-[#8B5CF6] font-black uppercase mb-1">Next Session</p>
                    <p className="text-xs font-bold text-white">
                        {formatSessionDate(startup.nextSession) || <span className="text-gray-600 italic">Not scheduled</span>}
                    </p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-gray-500 font-black uppercase">Exec Score</span>
                    <span className={`text-[10px] font-black ${startup.executionScore >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {startup.executionScore}%
                    </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${startup.executionScore >= 60 ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${startup.executionScore}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{startup.stage || '—'}</span>
                    {startup.sector && startup.sector !== '—' && (
                        <>
                            <span className="text-gray-700">·</span>
                            <span className="text-[10px] font-black uppercase text-gray-600">{startup.sector}</span>
                        </>
                    )}
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#8B5CF6] group-hover:translate-x-1 transition-transform">
                    View Detail <ChevronRight size={14} />
                </span>
            </div>
        </motion.div>
    );
};

// ─── SendMessageModal ─────────────────────────────────────────────────────────

const SendMessageModal = ({ startup, onClose, onSend }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(startup.startupId, text);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1E1E2F] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-1">Send Message</h2>
                        <p className="text-[#8B5CF6] font-bold text-sm">to {startup.founderName} · {startup.startupName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        autoFocus
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write your message or feedback for the founder..."
                        className="w-full h-36 bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-600 resize-none"
                    />
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={16} /> Send Message
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 bg-white/5 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const ScheduleSessionModal = ({ startup, onClose, onSchedule }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSchedule(startup.startupId, date, time);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1E1E2F] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-1">Schedule Session</h2>
                        <p className="text-[#8B5CF6] font-bold text-sm">with {startup.startupName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">Meeting Date</label>
                        <input
                            required
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">Meeting Time</label>
                        <input
                            required
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar size={16} /> Confirm Schedule
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 bg-white/5 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// ─── ProgressView ─────────────────────────────────────────────────────────────

const ProgressView = ({ startup, onBack }) => {
    const { addFocusArea, removeFocusArea, sendMessage, scheduleSession } = useMentor();
    const { user } = useAuth();

    const [newFocusArea, setNewFocusArea] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Re-hydrate live on every render so changes from founder are reflected
    const allUsers = JSON.parse(localStorage.getItem('vanguard_users') || '{}');
    const allSessions = JSON.parse(localStorage.getItem('vanguard_sessions') || '[]');
    const allStartups = JSON.parse(localStorage.getItem('vanguard_startups') || '[]');

    // Always pull the freshest version of this startup
    const freshStartup = allStartups.find(s => s.startupId === startup.startupId) || startup;
    const live = hydrateStartup(freshStartup, allUsers, allSessions, user?.uid);

    const completedMilestones = live.milestones.filter(m => m.status === 'completed');
    const inProgressMilestones = live.milestones.filter(m => m.status === 'in-progress');
    const pendingMilestones = live.milestones.filter(m => m.status === 'pending' || !m.status);

    // Latest completed session with notes
    const latestFeedback = live.startupSessions
        .filter(s => s.status === 'completed' && s.notes)
        .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))[0] || null;

    const handleAddFocusArea = (e) => {
        e.preventDefault();
        if (!newFocusArea.trim()) return;
        addFocusArea(live.startupId, newFocusArea.trim());
        setNewFocusArea('');
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
        catch { return iso; }
    };

    const isMyActiveMentee = live.mentorAssigned === user?.uid;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10 pb-20"
        >
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
                <ChevronLeft size={16} /> Back to Mentees
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* ── Sidebar ── */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Identity Card */}
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Rocket size={100} /></div>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-xl mb-6 mx-auto">
                            {live.startupName?.[0] || '?'}
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white mb-1">{live.startupName}</h2>
                            <p className="text-[#8B5CF6] font-bold text-xs uppercase tracking-widest mb-4">{live.stage || '—'}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {live.sector && (
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400">{live.sector}</span>
                                )}
                                {isMyActiveMentee && (
                                    <span className="px-3 py-1 bg-[#8B5CF6]/10 rounded-full text-[10px] font-black uppercase text-[#8B5CF6] border border-[#8B5CF6]/20">
                                        My Active Mentee
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-5">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Founder</p>
                                <p className="text-white font-bold">{live.founderName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Joined</p>
                                <p className="text-white font-bold">{formatDate(live.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Funding Goal</p>
                                <p className="text-white font-bold">
                                    {live.fundingGoal || <span className="text-gray-600 italic text-xs">Not set</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Sessions</p>
                                <p className="text-white font-bold">{live.startupSessions.length} total</p>
                            </div>
                        </div>
                    </div>

                    {/* Send Message */}
                    <div className="p-6 bg-gradient-to-br from-[#8B5CF6] to-indigo-600 rounded-3xl text-white shadow-xl shadow-[#8B5CF6]/20">
                        <h4 className="font-black text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={14} /> Quick Action
                        </h4>
                        <p className="text-white/80 text-xs font-medium leading-relaxed mb-5">
                            Send a nudge or feedback directly to the founder's workspace.
                        </p>
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="w-full py-3 bg-white text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={12} /> Send Message
                        </button>
                    </div>

                    {/* Schedule Session */}
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <h4 className="font-black text-sm mb-3 uppercase tracking-wider flex items-center gap-2 text-white">
                            <Calendar size={14} className="text-[#8B5CF6]" /> Scheduling
                        </h4>
                        <p className="text-gray-500 text-xs font-medium leading-relaxed mb-5">
                            Set up your next advisory call with the founder.
                        </p>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="w-full py-3 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-[#8B5CF6]/20 flex items-center justify-center gap-2"
                        >
                            <Calendar size={12} /> Schedule Session
                        </button>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Execution Score */}
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <BarChart2 size={12} className="text-[#8B5CF6]" /> Execution Score
                            </p>
                            <p className={`text-3xl font-black ${live.executionScore >= 60 ? 'text-white' : 'text-yellow-400'}`}>
                                {live.executionScore}
                                <span className="text-sm ml-1 text-gray-500">/ 100</span>
                            </p>
                            <div className="mt-3 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${live.executionScore >= 60 ? 'bg-[#8B5CF6]' : 'bg-yellow-500'}`}
                                    style={{ width: `${live.executionScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Traction */}
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <TrendingUp size={12} className="text-[#8B5CF6]" /> Traction
                            </p>
                            {live.traction ? (
                                <p className="text-sm font-black text-white leading-snug line-clamp-3">{live.traction}</p>
                            ) : (
                                <p className="text-gray-600 italic text-xs mt-2">No traction data available.</p>
                            )}
                        </div>

                        {/* Growth */}
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <ArrowUp size={12} className="text-[#8B5CF6]" /> Growth
                            </p>
                            {live.growthPercent !== null ? (
                                <p className={`text-3xl font-black flex items-center gap-2 ${parseFloat(live.growthPercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {parseFloat(live.growthPercent) >= 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                                    {Math.abs(live.growthPercent)}%
                                </p>
                            ) : (
                                <p className="text-gray-600 italic text-xs mt-2">No traction history yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Mentorship Roadmap — Milestones */}
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <ListTodo className="text-[#8B5CF6]" size={20} /> Mentorship Roadmap
                            <span className="ml-auto text-xs font-bold text-gray-500">
                                {completedMilestones.length}/{live.milestones.length} completed
                            </span>
                        </h3>

                        {live.milestones.length === 0 ? (
                            <div className="py-10 text-center">
                                <AlertCircle className="mx-auto text-gray-700 mb-3" size={32} />
                                <p className="text-gray-600 font-medium">No roadmap defined yet.</p>
                                <p className="text-gray-700 text-xs mt-1">The founder hasn't added any milestones.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* In Progress */}
                                {inProgressMilestones.map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border bg-[#8B5CF6]/5 border-[#8B5CF6]/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
                                                <Clock size={12} />
                                            </div>
                                            <span className="text-sm font-bold text-white">{m.title}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest whitespace-nowrap">In Progress</span>
                                    </div>
                                ))}
                                {/* Completed */}
                                {completedMilestones.map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border bg-green-500/5 border-green-500/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                                                <CheckCircle2 size={12} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-400 line-through">{m.title}</span>
                                        </div>
                                        {m.completedAt && (
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">
                                                {formatDate(m.completedAt)}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {/* Pending */}
                                {pendingMilestones.map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border bg-white/5 border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 bg-gray-700 rounded-full" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-500">{m.title}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Pending</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Row: Feedback + Focus Areas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Most Recent Feedback */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-3">
                                <MessageSquare className="text-orange-400" size={18} /> Most Recent Feedback
                            </h3>
                            <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5 min-h-[120px]">
                                {latestFeedback ? (
                                    <>
                                        <p className="text-sm font-medium text-gray-300 leading-relaxed italic">
                                            "{latestFeedback.notes}"
                                        </p>
                                        <p className="text-[10px] font-black text-gray-600 mt-4 uppercase tracking-widest text-right">
                                            — {formatDate(latestFeedback.completedAt || latestFeedback.createdAt)}
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                                        <MessageSquare className="text-gray-700 mb-2" size={24} />
                                        <p className="text-gray-600 text-sm font-medium">No feedback yet.</p>
                                        <p className="text-gray-700 text-xs mt-1">Complete a session to add notes.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Focus Areas */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-3">
                                <Zap className="text-yellow-400" size={18} /> Focus Areas
                            </h3>
                            <div className="space-y-3">
                                {live.focusAreas.length === 0 && (
                                    <p className="text-gray-600 italic text-sm px-1">No focus areas defined yet.</p>
                                )}
                                {live.focusAreas.map((area, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full flex-shrink-0" />
                                            <span className="text-sm font-bold text-gray-300">{area}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFocusArea(live.startupId, area)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-600 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Add new focus area */}
                                <form onSubmit={handleAddFocusArea} className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={newFocusArea}
                                        onChange={e => setNewFocusArea(e.target.value)}
                                        placeholder="Add focus area..."
                                        className="flex-1 bg-[#0F0F14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newFocusArea.trim()}
                                        className="px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>

                    {/* Problem & Solution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Target size={12} /> Problem Statement
                            </h4>
                            {live.problemStatement ? (
                                <p className="text-sm text-gray-300 leading-relaxed">{live.problemStatement}</p>
                            ) : (
                                <p className="text-gray-600 italic text-xs">No problem statement added yet.</p>
                            )}
                        </div>
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Zap size={12} /> Solution Overview
                            </h4>
                            {live.solutionOverview ? (
                                <p className="text-sm text-gray-300 leading-relaxed">{live.solutionOverview}</p>
                            ) : (
                                <p className="text-gray-600 italic text-xs">No solution overview added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showMessageModal && (
                    <SendMessageModal
                        startup={live}
                        onClose={() => setShowMessageModal(false)}
                        onSend={sendMessage}
                    />
                )}
                {showScheduleModal && (
                    <ScheduleSessionModal
                        startup={live}
                        onClose={() => setShowScheduleModal(false)}
                        onSchedule={scheduleSession}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── MyMentees ────────────────────────────────────────────────────────────────

const MyMentees = () => {
    const { mentees } = useMentor();
    const { user } = useAuth();
    const [selectedStartup, setSelectedStartup] = useState(null);

    // Hydrate all mentees with live data on every render
    const allUsers = JSON.parse(localStorage.getItem('vanguard_users') || '{}');
    const allSessions = JSON.parse(localStorage.getItem('vanguard_sessions') || '[]');

    const hydratedMentees = useMemo(() => {
        return mentees.map(s => hydrateStartup(s, allUsers, allSessions, user?.uid));
    }, [mentees, user?.uid]);

    // If a mentee is selected, re-hydrate it from the live mentees list
    const selectedHydrated = useMemo(() => {
        if (!selectedStartup) return null;
        return hydratedMentees.find(m => m.startupId === selectedStartup.startupId) || selectedStartup;
    }, [selectedStartup, hydratedMentees]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {!selectedStartup ? (
                <>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Mentees</span>
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium">Track progress and manage your advisory relationships.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-1 px-3 bg-[#1E1E2F] rounded-xl border border-white/5 flex items-center gap-2">
                                <Users size={14} className="text-gray-500" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">{hydratedMentees.length} Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Mentee Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hydratedMentees.length === 0 ? (
                            <div className="col-span-full py-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <Rocket className="mx-auto text-gray-700 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-gray-500">No active mentees yet</h3>
                                <p className="text-gray-600 mt-1">Accept requests to start your mentorship journey.</p>
                            </div>
                        ) : (
                            hydratedMentees.map((startup) => (
                                <MenteeCard
                                    key={startup.startupId}
                                    startup={startup}
                                    onSelect={setSelectedStartup}
                                />
                            ))
                        )}
                    </div>
                </>
            ) : (
                <ProgressView
                    startup={selectedHydrated}
                    onBack={() => setSelectedStartup(null)}
                />
            )}
        </div>
    );
};

export default MyMentees;
