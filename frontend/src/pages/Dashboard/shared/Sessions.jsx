import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Video,
    User,
    Plus,
    X,
    ExternalLink,
    ChevronLeft,
    AlertCircle,
    Zap,
    ClipboardList,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { useMentor } from '../../../context/MentorContext';
import { getSystem } from '../../../utils/system';

// Modal for Founder to request or Mentor to schedule
const SessionFormModal = ({ onClose, onSubmit, role, mentees = [] }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [topic, setTopic] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [selectedStartupId, setSelectedStartupId] = useState(mentees[0]?.startupId || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role === 'mentor') {
            onSubmit(selectedStartupId, date, time, topic, meetingLink);
        } else {
            onSubmit(date, time, topic);
        }
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
                className="bg-[#1E1E2F] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl p-10"
            >
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-1">
                            {role === 'mentor' ? 'Schedule Session' : 'Request Session'}
                        </h2>
                        <p className="text-[#8B5CF6] font-bold text-sm tracking-wide uppercase italic">
                            {role === 'mentor' ? 'Set a time for your mentees' : 'Propose a time for your next call'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {role === 'mentor' && mentees.length > 0 && (
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Select Startup</label>
                            <select
                                value={selectedStartupId}
                                onChange={e => setSelectedStartupId(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all appearance-none"
                            >
                                {mentees.map(m => (
                                    <option key={m.startupId} value={m.startupId}>{m.startupName}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Date</label>
                            <input
                                required
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Time</label>
                            <input
                                required
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Topic / Agenda</label>
                        <input
                            required
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="Primary focus for this call..."
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-800"
                        />
                    </div>

                    {role === 'mentor' && (
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Meeting Link</label>
                            <input
                                required
                                type="url"
                                value={meetingLink}
                                onChange={e => setMeetingLink(e.target.value)}
                                placeholder="https://meet.google.com/..."
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-800"
                            />
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {role === 'mentor' ? <Plus size={18} /> : <CalendarIcon size={18} />}
                            {role === 'mentor' ? 'Schedule Now' : 'Send Request'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const ConfirmRequestModal = ({ session, onClose, onConfirm }) => {
    const [date, setDate] = useState(session?.date || '');
    const [time, setTime] = useState(session?.time || '');
    const [topic, setTopic] = useState(session?.topic || 'Mentorship Session');
    const [meetingLink, setMeetingLink] = useState(session?.meetingLink || '');

    const submit = (e) => {
        e.preventDefault();
        onConfirm({ date, time, topic, meetingLink });
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1E1E2F] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl p-10"
            >
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-1">Confirm Session Request</h2>
                        <p className="text-[#8B5CF6] font-bold text-sm tracking-wide uppercase italic">
                            Set exact time and meeting link for founder
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Date</label>
                            <input
                                required
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Time</label>
                            <input
                                required
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Topic / Agenda</label>
                        <input
                            required
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-800"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Meeting Link</label>
                        <input
                            required
                            type="url"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-800"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={18} /> Confirm Request
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Mentor's Post-Session Update Form
const PostSessionUpdate = ({ session, onSave, onBack }) => {
    const [advice, setAdvice] = useState('');
    const [actionItems, setActionItems] = useState(['']);

    const addActionItem = () => setActionItems([...actionItems, '']);
    const updateActionItem = (index, value) => {
        const newItems = [...actionItems];
        newItems[index] = value;
        setActionItems(newItems);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1E1E2F] rounded-[3rem] border border-white/5 shadow-2xl p-10 max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-black text-white text-2xl shadow-lg border border-white/10">
                    {session?.startupName?.[0] || '?'}
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white">Execution Debrief</h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
                        Session with {session?.startupName}
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                        <MessageSquare size={14} className="text-[#8B5CF6]" /> Key Strategic Advice
                    </label>
                    <textarea
                        value={advice}
                        onChange={(e) => setAdvice(e.target.value)}
                        placeholder="What were the most critical takeaways?"
                        className="w-full h-32 bg-[#0F0F14] border border-white/5 rounded-[2rem] p-6 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-800 resize-none font-medium leading-relaxed"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 block flex items-center justify-between">
                        <span className="flex items-center gap-2 tracking-[0.2em]">
                            <ClipboardList size={14} className="text-[#8B5CF6]" /> Assigned Action Items
                        </span>
                        <button onClick={addActionItem} className="p-1 text-[#8B5CF6] hover:text-white transition-colors"><Plus size={18} /></button>
                    </label>
                    <div className="space-y-3">
                        {actionItems.map((item, idx) => (
                            <input
                                key={idx}
                                value={item}
                                onChange={(e) => updateActionItem(idx, e.target.value)}
                                placeholder={`Milestone / Step #${idx + 1}`}
                                className="w-full bg-[#0F0F14] border border-white/5 rounded-2xl p-5 text-white font-bold focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-800"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        onClick={onBack}
                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/5 shadow-xl shadow-black/20"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({ advice, actionItems })}
                        className="flex-1 py-5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#8B5CF6]/30 transition-all"
                    >
                        Finalize & Save
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Main Sessions Component
const Sessions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isMentor = user.role === 'mentor';

    // Hooks for context based on role
    const startupCtx = useStartup();
    const mentorCtx = useMentor();

    const [activeTab, setActiveTab] = useState('upcoming');
    const [completingSession, setCompletingSession] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [sessionToConfirm, setSessionToConfirm] = useState(null);

    // Get relevant data & functions
    const sessions = isMentor ? mentorCtx.sessions : startupCtx.sessions;
    const startup = !isMentor ? startupCtx.startup : null;
    const mentees = isMentor ? mentorCtx.mentees : [];
    const sessionsLoading = isMentor ? mentorCtx.sessionsLoading : startupCtx.sessionsLoading;
    const sessionsError = isMentor ? mentorCtx.sessionsError : startupCtx.sessionsError;
    const sessionActionId = isMentor ? mentorCtx.sessionActionId : startupCtx.sessionActionId;

    // Helper to get startup/founder details for mentor view
    const hydrateSession = (s) => {
        if (!isMentor) {
            const system = getSystem();
            const allUsers = system.users || {};
            const mentor = allUsers[s.mentorId];
            return {
                ...s,
                mentorName: mentor?.name || mentor?.email?.split('@')[0] || 'Expert Mentor',
                mentorTitle: Array.isArray(mentor?.expertise) ? mentor.expertise.join(', ') : 'Mentor'
            };
        }
        const startup = mentees.find(m => m.startupId === s.startupId);
        return {
            ...s,
            startupName: startup?.startupName || 'Unknown Startup',
            founderName: startup?.founderId || 'Founder' // Simplified ID display for now
        };
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending_confirmation: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            upcoming: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]',
            completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            declined: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        };

        const label = status.replace('_', ' ').toUpperCase();

        return (
            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border ${styles[status]}`}>
                {label}
            </div>
        );
    };

    const filteredSessions = sessions
        .map(hydrateSession)
        .filter(s => {
            if (activeTab === 'pending') return s.status === 'pending_confirmation';
            return s.status === activeTab;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (completingSession) {
        return (
            <div className="py-10 animate-in slide-in-from-bottom duration-700">
                <button
                    onClick={() => setCompletingSession(null)}
                    className="mb-10 flex items-center gap-3 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#8B5CF6]/10 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    Back to Sessions
                </button>
                <PostSessionUpdate
                    session={completingSession}
                    onSave={(data) => {
                        mentorCtx.completeSession(completingSession.id, data);
                        setCompletingSession(null);
                        setActiveTab('completed');
                    }}
                    onBack={() => setCompletingSession(null)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-[#8B5CF6]/20">
                            Advisory Portal
                        </span>
                        <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            {isMentor ? 'Mentor View' : 'Startup View'}
                        </span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                        Advisory <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Sessions</span>
                    </h1>
                    <p className="text-gray-500 mt-3 font-medium flex items-center gap-2 italic">
                        {isMentor
                            ? 'Optimize your mentees\' growth with structured advisory.'
                            : 'Strategic alignment with your assigned advisors.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="bg-[#1E1E2F] p-2 rounded-[2rem] border border-white/5 flex gap-1 shadow-2xl">
                        {['upcoming', 'pending', 'completed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {((!isMentor && startup?.mentorAssigned) || (isMentor && mentees.length > 0)) && (
                        <button
                            onClick={() => setShowFormModal(true)}
                            className="w-full sm:w-auto px-8 py-5 bg-white/5 hover:bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] border border-white/5 hover:border-[#8B5CF6] transition-all flex items-center justify-center gap-3 shadow-xl group"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            {isMentor ? 'Schedule Session' : 'Request Session'}
                        </button>
                    )}
                </div>
            </div>

            {/* Sessions List */}
            <div className="grid grid-cols-1 gap-6 max-w-6xl">
                <AnimatePresence mode="popLayout">
                    {sessionsLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="min-h-[40vh] flex flex-col items-center justify-center text-center p-20 bg-[#1E1E2F] rounded-[4rem] border border-white/5 border-dashed"
                        >
                            <h3 className="text-3xl font-black text-white mb-3">Loading sessions...</h3>
                        </motion.div>
                    ) : sessionsError ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="min-h-[40vh] flex flex-col items-center justify-center text-center p-20 bg-[#1E1E2F] rounded-[4rem] border border-rose-500/20"
                        >
                            <h3 className="text-3xl font-black text-rose-400 mb-3">{sessionsError}</h3>
                        </motion.div>
                    ) : filteredSessions.length > 0 ? (
                        filteredSessions.map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#1E1E2F] rounded-[2.5rem] border border-white/5 hover:border-[#8B5CF6]/30 transition-all group overflow-hidden shadow-xl"
                            >
                                <div className="p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-10">
                                    {/* Entity Visual */}
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#15151e] to-[#1E1E2F] border border-white/10 flex items-center justify-center text-3xl font-black text-[#8B5CF6] shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        {(isMentor ? session.startupName[0] : session.mentorName[0]) || '?'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-4 text-center lg:text-left">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-3xl font-black text-white group-hover:text-[#8B5CF6] transition-colors leading-tight">
                                                    {isMentor ? session.startupName : session.mentorName}
                                                </h3>
                                                <div className="flex items-center justify-center lg:justify-start gap-4 mt-2">
                                                    <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.2em] bg-[#8B5CF6]/10 px-3 py-1 rounded-lg">
                                                        {isMentor ? 'Startup Mentee' : session.mentorTitle}
                                                    </span>
                                                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Clock size={14} /> {session.date} @ {session.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <StatusBadge status={session.status} />
                                        </div>

                                        <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5 inline-block w-full">
                                            <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                                                "{session.topic || "Regular advisory session and progress review."}"
                                            </p>
                                            {session.meetingLink && (
                                                <a
                                                    href={session.meetingLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5CF6] hover:text-white transition-colors"
                                                >
                                                    <ExternalLink size={12} /> Meeting Link Added
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Column */}
                                    <div className="shrink-0 flex flex-col gap-3 min-w-[180px] w-full lg:w-auto">
                                        {isMentor && session.status === 'pending_confirmation' && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setSessionToConfirm(session)}
                                                    disabled={sessionActionId === session.id}
                                                    className="p-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-2xl border border-emerald-500/20 transition-all flex items-center justify-center"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => mentorCtx.declineSessionRequest(session.id)}
                                                    disabled={sessionActionId === session.id}
                                                    className="p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl border border-rose-500/20 transition-all flex items-center justify-center"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}

                                        {isMentor && session.status === 'upcoming' && (
                                            <button
                                                onClick={() => setCompletingSession(session)}
                                                disabled={sessionActionId === session.id}
                                                className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> {sessionActionId === session.id ? 'Working...' : 'Mark Completed'}
                                            </button>
                                        )}

                                        {!isMentor && session.status === 'pending_confirmation' && (
                                            <button
                                                onClick={() => startupCtx.cancelSession(session.id)}
                                                disabled={sessionActionId === session.id}
                                                className="w-full py-4 bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={16} /> {sessionActionId === session.id ? 'Working...' : 'Cancel Request'}
                                            </button>
                                        )}

                                        {session.status === 'upcoming' && (
                                            session.meetingLink ? (
                                                <a
                                                    href={session.meetingLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Video size={16} /> Join Meeting
                                                </a>
                                            ) : (
                                                <button disabled className="w-full py-4 bg-white/5 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 cursor-not-allowed flex items-center justify-center gap-2">
                                                    <AlertCircle size={16} /> Link Pending
                                                </button>
                                            )
                                        )}

                                        {session.status === 'completed' && (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-center gap-1.5 p-2 bg-emerald-500/5 text-emerald-500 rounded-xl">
                                                    <Zap size={14} /> <span className="text-[10px] font-black uppercase">+5 Points</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => navigate(
                                                `/${user.role === 'cofounder' ? 'co-founder' : user.role}/messages`,
                                                { state: { openChat: { startupId: session.startupId, type: 'mentor' } } }
                                            )}
                                            className="w-full py-4 bg-white/5 text-gray-500 hover:text-white text-[10px] font-black uppercase rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare size={16} /> View Chat
                                        </button>
                                    </div>
                                </div>

                                {/* Feedback Section for Completed */}
                                {session.status === 'completed' && session.notes && (
                                    <div className="border-t border-white/5 p-8 lg:p-10 bg-black/20">
                                        <div className="flex flex-col lg:flex-row gap-10">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                                                    <CheckCircle2 size={14} className="text-emerald-500" /> Strategic Feedback
                                                </label>
                                                <p className="text-white/60 text-sm font-medium leading-relaxed italic">
                                                    "{session.notes}"
                                                </p>
                                            </div>
                                            {session.actionItems && session.actionItems.length > 0 && (
                                                <div className="lg:w-1/3">
                                                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                                                        <ClipboardList size={14} className="text-[#8B5CF6]" /> Action Items
                                                    </label>
                                                    <div className="space-y-2">
                                                        {session.actionItems.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                                <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
                                                                <span className="text-[11px] text-gray-400 font-bold">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="min-h-[40vh] flex flex-col items-center justify-center text-center p-20 bg-[#1E1E2F] rounded-[4rem] border border-white/5 border-dashed"
                        >
                            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-10 text-gray-600 shadow-inner">
                                <CalendarIcon size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3">No {activeTab} sessions</h3>
                            <p className="text-gray-500 max-w-sm font-medium mx-auto leading-relaxed">
                                {isMentor
                                    ? 'Your advisory pipeline is clear. Use cases will appear here as startups request your expertise.'
                                    : 'Schedule your first strategic advisory call to start tracking execution progress.'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Empty State Guard for Founders */}
            {!isMentor && !startup?.mentorAssigned && (
                <div className="p-12 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/20 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto shadow-2xl">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2">Mentor Access Required</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            You must have an assigned mentor to request and manage advisory sessions.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/founder/mentors'}
                        className="px-8 py-4 bg-white text-[10px] font-black text-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all shadow-xl"
                    >
                        Browse Mentors
                    </button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showFormModal && (
                    <SessionFormModal
                        role={user.role}
                        mentees={mentees}
                        onClose={() => setShowFormModal(false)}
                        onSubmit={isMentor ? mentorCtx.scheduleSession : startupCtx.requestSession}
                    />
                )}
                {sessionToConfirm && (
                    <ConfirmRequestModal
                        session={sessionToConfirm}
                        onClose={() => setSessionToConfirm(null)}
                        onConfirm={(schedule) => mentorCtx.confirmSessionRequest(sessionToConfirm.id, schedule)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sessions;
