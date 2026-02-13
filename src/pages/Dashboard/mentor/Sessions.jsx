
import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    MessageSquare,
    ClipboardList,
    Plus,
    Calendar,
    ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SessionItem = ({ session, onComplete }) => (
    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg border border-white/10 flex-shrink-0">
                    {session.founderName[0]}
                </div>
                <div>
                    <h4 className="text-white font-bold">{session.founderName}</h4>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">{session.startupName}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><CalendarIcon size={12} className="text-[#8B5CF6]" /> {session.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#8B5CF6]" /> {session.time}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-3 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                    <MessageSquare size={18} />
                </button>
                {session.status === 'upcoming' ? (
                    <button
                        onClick={() => onComplete(session)}
                        className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all whitespace-nowrap"
                    >
                        Complete Session
                    </button>
                ) : (
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${session.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {session.status === 'completed' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {session.status}
                    </span>
                )}
            </div>
        </div>
    </div>
);

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
            className="bg-[#1E1E2F] rounded-3xl border border-white/5 shadow-2xl p-8 max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6] flex items-center justify-center font-black text-white text-xl">
                    {session.founderName[0]}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">Post-Session Update</h2>
                    <p className="text-gray-500 font-medium">{session.founderName} • {session.startupName}</p>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <MessageSquare size={14} /> Key Advice Given
                    </label>
                    <textarea
                        value={advice}
                        onChange={(e) => setAdvice(e.target.value)}
                        placeholder="Summarize the core feedback shared..."
                        className="w-full h-32 bg-[#0F0F14] border border-white/5 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-700 resize-none"
                    />
                </div>

                <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block flex items-center justify-between">
                        <span className="flex items-center gap-2"><ClipboardList size={14} /> Action Steps Assigned</span>
                        <button onClick={addActionItem} className="text-[#8B5CF6] hover:text-white transition-colors"><Plus size={16} /></button>
                    </label>
                    <div className="space-y-3">
                        {actionItems.map((item, idx) => (
                            <input
                                key={idx}
                                value={item}
                                onChange={(e) => updateActionItem(idx, e.target.value)}
                                placeholder={`Action Item #${idx + 1}`}
                                className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-700"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <CalendarIcon size={14} /> Next Meeting Date
                    </label>
                    <input
                        type="date"
                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onBack}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({ advice, actionItems })}
                        className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all"
                    >
                        Save & Finish
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Sessions = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [completingSession, setCompletingSession] = useState(null);
    const [sessions, setSessions] = useState([
        { id: 1, founderName: 'Sarah Jenkins', startupName: 'EcoFlow', date: 'Oct 24, 2026', time: '10:30 AM', status: 'upcoming' },
        { id: 2, founderName: 'Alex Rivera', startupName: 'Nexus AI', date: 'Oct 25, 2026', time: '02:00 PM', status: 'upcoming' },
        { id: 3, founderName: 'Michael Chen', startupName: 'PayBolt', date: 'Oct 15, 2026', time: '04:30 PM', status: 'completed' },
        { id: 4, founderName: 'Elena Rossi', startupName: 'VibeHealth', date: 'Oct 12, 2026', time: '11:00 AM', status: 'completed' },
        { id: 5, founderName: 'John Doe', startupName: 'Stealth Startup', date: 'Oct 10, 2026', time: '09:00 AM', status: 'cancelled' },
    ]);

    const filteredSessions = sessions.filter(s => s.status === activeTab);

    if (completingSession) {
        return (
            <div className="py-10 animate-in fade-in duration-500">
                <button
                    onClick={() => setCompletingSession(null)}
                    className="mb-10 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Back to Sessions
                </button>
                <PostSessionUpdate
                    session={completingSession}
                    onSave={() => {
                        setSessions(prev => prev.map(s => s.id === completingSession.id ? { ...s, status: 'completed' } : s));
                        setCompletingSession(null);
                        setActiveTab('completed');
                    }}
                    onBack={() => setCompletingSession(null)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Advisory <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Sessions</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your calendar and track session outcomes.</p>
                </div>

                <div className="bg-[#1E1E2F] p-1.5 rounded-2xl border border-white/5 flex gap-2">
                    {['upcoming', 'completed', 'cancelled'].map((tab) => (
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
            </div>

            {/* Sessions List */}
            <div className="space-y-4 max-w-4xl">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <SessionItem
                            key={session.id}
                            session={session}
                            onComplete={setCompletingSession}
                        />
                    ))
                ) : (
                    <div className="py-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">No {activeTab} sessions</h3>
                        <p className="text-gray-500 font-medium">When you schedule or finish sessions, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sessions;
