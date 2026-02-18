
import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Calendar,
    ChevronLeft,
    Video,
    User,
    Plus,
    X,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStartup } from '../../../context/StartupContext';

const RequestSessionModal = ({ onClose, onRequest }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRequest(date, time, topic);
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
                        <h2 className="text-2xl font-black text-white mb-1">Request Session</h2>
                        <p className="text-[#8B5CF6] font-bold text-sm">Propose a time for your next call</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">Proposed Date</label>
                        <input
                            required
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">Proposed Time</label>
                        <input
                            required
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block">Topic / Agenda</label>
                        <input
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="What do you want to discuss?"
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-700"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                        >
                            <CalendarIcon size={16} /> Send Request
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

const SessionItem = ({ session }) => {
    // Hydrate mentor name from ID
    const allUsers = JSON.parse(localStorage.getItem('vanguard_users') || '[]');
    const mentor = allUsers.find(u => u.id === session.mentorId);
    const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Unknown Mentor';
    const mentorTitle = mentor?.title || 'Expert Mentor';

    return (
        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg border border-white/10 flex-shrink-0">
                        {mentorName?.[0] || '?'}
                    </div>
                    <div>
                        <h4 className="text-white font-bold">{mentorName}</h4>
                        <p className="text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest">{mentorTitle}</p>
                        <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><CalendarIcon size={12} className="text-[#8B5CF6]" /> {session.date}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#8B5CF6]" /> {session.time}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {session.status === 'upcoming' && (
                        <button className="flex items-center gap-2 px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all">
                            <Video size={14} /> Join Call
                        </button>
                    )}
                    <button className="p-3 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                        <MessageSquare size={18} />
                    </button>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${session.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        session.status === 'upcoming' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' :
                            session.status === 'requested' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {session.status === 'completed' ? <CheckCircle2 size={14} /> :
                            session.status === 'upcoming' ? <Clock size={14} /> :
                                session.status === 'requested' ? <CalendarIcon size={14} /> : <XCircle size={14} />}
                        {session.status}
                    </span>
                </div>
            </div>

            {session.status === 'completed' && session.notes && (
                <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-400" /> Mentor Feedback
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed italic">"{session.notes}"</p>
                    {session.actionItems && session.actionItems.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {session.actionItems.map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 font-bold">
                                    • {item}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Sessions = () => {
    const { sessions, requestSession, startup } = useStartup();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Filter sessions based on tab
    const filteredSessions = sessions.filter(s => s.status === activeTab);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Mentorship <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Sessions</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Review feedback and join upcoming advisory calls.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="bg-[#1E1E2F] p-1.5 rounded-2xl border border-white/5 flex gap-2 w-fit">
                        {['requested', 'upcoming', 'completed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {startup?.mentorAssigned && (
                        <button
                            onClick={() => setShowRequestModal(true)}
                            className="px-6 py-4 bg-white/5 hover:bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:border-[#8B5CF6] transition-all flex items-center gap-2"
                        >
                            <Plus size={16} /> Request Session
                        </button>
                    )}
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4 max-w-4xl">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <SessionItem key={session.id} session={session} />
                    ))
                ) : (
                    <div className="py-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                            <CalendarIcon size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">No {activeTab} sessions</h3>
                        <p className="text-gray-500 font-medium">Your mentor will schedule sessions here after acceptance.</p>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="max-w-4xl p-6 bg-[#8B5CF6]/5 rounded-2xl border border-[#8B5CF6]/20 flex items-start gap-4">
                <div className="p-2 bg-[#8B5CF6]/20 rounded-lg text-[#8B5CF6]">
                    <User size={20} />
                </div>
                <div>
                    <h4 className="text-white font-black text-sm mb-1">How it works</h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                        Sessions are scheduled by your mentor. Once a session is marked as completed, you can view the feedback and action items assigned to you here. Use these to update your milestones and track execution progress.
                    </p>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showRequestModal && (
                    <RequestSessionModal
                        onClose={() => setShowRequestModal(false)}
                        onRequest={requestSession}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sessions;
