
import React, { useState } from 'react';
import {
    Users,
    Calendar,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    Zap,
    X,
    Save,
    Check,
    Loader2,
    Plus,
    Activity,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMentor } from '../../../context/MentorContext';
import { getSystem } from '../../../utils/system';

const Toast = ({ message, visible }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 right-8 z-[100] bg-[#8B5CF6] text-white px-6 py-3 rounded-xl shadow-2xl shadow-[#8B5CF6]/40 flex items-center gap-2 font-bold"
            >
                <Check size={18} />
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[#1E1E2F] border border-white/10 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-white">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
                            <X size={28} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all shadow-xl shadow-black/20"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon className={`text-${color}-400`} size={24} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</span>
                <span className="text-2xl font-black text-white mt-1">{value}</span>
            </div>
        </div>
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className={`h-full bg-${color}-500/50`}
            />
        </div>
    </motion.div>
);

const UpcomingSessionCard = ({ session, onJoin, onCancel }) => (
    <div className="bg-[#1E1E2F] p-5 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group">
        <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
                    {session?.founderName?.[0] || '?'}
                </div>
                <div>
                    <h4 className="text-white font-bold">{session?.founderName || 'Unknown Founder'}</h4>
                    <p className="text-gray-500 text-xs font-medium">{session?.startupName || 'Startup'} • <span className="text-[#8B5CF6]">{session?.stage || 'Idea'}</span></p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {session.time}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => onJoin(session)}
                    className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all whitespace-nowrap"
                >
                    Join Session
                </button>
                <button
                    onClick={() => onCancel(session.id)}
                    className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 text-[10px] font-black uppercase rounded-xl transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

const HighPotentialCard = ({ startup, onView }) => (
    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={48} />
        </div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-lg font-black text-white group-hover:text-[#8B5CF6] transition-colors">{startup?.startupName || 'Startup'}</h4>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{startup?.sector || 'Unknown Sector'}</span>
                </div>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest rounded border border-green-500/20">
                    {startup?.stage || 'Idea'}
                </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-6">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Traction Snapshot</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1">{startup.traction}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-[8px] text-gray-600 font-black uppercase">Execution Score</span>
                    <span className="text-[10px] text-[#8B5CF6] font-black">{startup.executionScore}%</span>
                </div>
            </div>

            <button
                onClick={() => onView(startup)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase text-gray-300 hover:text-white transition-all tracking-widest"
            >
                View Profile <ArrowUpRight size={14} />
            </button>
        </div>
    </div>
);

const MentorDashboard = () => {
    const {
        profile,
        stats,
        sessions,
        mentees,
        requests,
        activity,
        updateSession,
        updateProfile,
        loading
    } = useMentor();

    const [toast, setToast] = useState({ visible: false, message: "" });
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
    const [sessionNotes, setSessionNotes] = useState("");

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: "" }), 3000);
    };

    if (loading || !profile) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="text-[#8B5CF6] animate-spin" size={48} />
            </div>
        );
    }

    const statCards = [
        { label: 'Pending Requests', value: String(stats.pendingRequests).padStart(2, '0'), icon: MessageSquare, color: 'blue' },
        { label: 'Active Mentees', value: String(stats.activeMentees).padStart(2, '0'), icon: Users, color: 'purple' },
        { label: 'Sessions This Week', value: String(stats.sessionsThisWeek).padStart(2, '0'), icon: Calendar, color: 'green' },
        { label: 'Response Rate', value: `${stats.responseRate}%`, icon: Zap, color: 'orange' },
    ];

    const hydrateSession = (session) => {
        const system = getSystem();
        const startup = system.startups.find(s => s.startupId === session.startupId) || null;
        const founder = startup ? system.users[startup.founderId] : null;
        return {
            ...session,
            startupName: startup?.startupName || 'Unknown Startup',
            founderName: founder?.name || founder?.email?.split('@')[0] || '—',
            stage: startup?.stage || 'Idea'
        };
    };

    const upcomingSessions = sessions.filter(s => s.status === 'upcoming')
        .map(hydrateSession)
        .slice(0, 3);

    // Dynamic Logic for High-Potential Startups
    // Pull from requests or mentees where: Stage = MVP or Revenue, Execution score > 60
    const highPotentialStartups = [...requests, ...mentees]
        .filter(s =>
            (s.stage === 'MVP' || s.stage === 'Revenue' || s.stage === 'Seed') &&
            s.executionScore > 60
        )
        .sort((a, b) => b.executionScore - a.executionScore)
        .slice(0, 3);

    const handleJoinSession = (session) => {
        setSelectedSession(session);
        setSessionNotes(session.notes || "");
    };

    const handleCompleteSession = () => {
        updateSession(selectedSession.id, {
            status: 'completed',
            notes: sessionNotes,
            completedAt: new Date().toISOString()
        });
        setSelectedSession(null);
        showToast("Session marked as completed");
    };

    const handleCancelSession = (id) => {
        if (confirm("Are you sure you want to cancel this session?")) {
            updateSession(id, { status: 'cancelled' });
            showToast("Session cancelled");
        }
    };

    const handleUpdateAvailability = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const days = Array.from(formData.getAll('days'));
        const status = formData.get('status');
        const sessionType = formData.get('sessionType');

        updateProfile({
            availability: {
                status,
                days,
                sessionType
            }
        });
        setIsAvailabilityModalOpen(false);
        showToast("Availability updated");
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <Toast {...toast} />

            {/* Session Notes Modal */}
            <Modal
                isOpen={!!selectedSession}
                onClose={() => setSelectedSession(null)}
                title="Session Details"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Founder / Startup</p>
                        <p className="text-white font-bold">{selectedSession?.founderName} • {selectedSession?.startupName}</p>
                        <p className="text-xs text-gray-400 mt-2">{selectedSession?.date} at {selectedSession?.time}</p>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Session Notes</label>
                        <textarea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            placeholder="Add key takeaways, next steps, or feedback..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#8B5CF6] transition-all h-32"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleCompleteSession}
                            className="flex-1 py-4 bg-[#8B5CF6] text-white font-black uppercase text-xs rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all"
                        >
                            Complete Session
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Startup Discovery Modal */}
            <Modal
                isOpen={!!selectedStartup}
                onClose={() => setSelectedStartup(null)}
                title="Startup Deep Dive"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/20">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-black text-white text-2xl shadow-xl">
                            {selectedStartup?.startupName?.[0] || '?'}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">{selectedStartup?.startupName}</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedStartup?.sector}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Current Stage</p>
                            <p className="text-white font-bold">{selectedStartup?.stage}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Execution Score</p>
                            <p className="text-[#8B5CF6] font-black">{selectedStartup?.executionScore}%</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Traction</p>
                        <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                            <p className="text-sm font-bold text-green-400 leading-relaxed italic">"{selectedStartup?.traction}"</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Founder Vision</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{selectedStartup?.message || "Self-driven startup focused on solving market gaps with aggressive roadmap."}</p>
                    </div>

                    <button
                        onClick={() => setSelectedStartup(null)}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-xs rounded-xl hover:bg-white/10 transition-all"
                    >
                        Close Exploration
                    </button>
                </div>
            </Modal>

            {/* Availability Modal */}
            <Modal
                isOpen={isAvailabilityModalOpen}
                onClose={() => setIsAvailabilityModalOpen(false)}
                title="Office Hours & Availability"
            >
                <form onSubmit={handleUpdateAvailability} className="space-y-6">
                    <div>
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-4">Availability Status</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['Active', 'Paused'].map(status => (
                                <label key={status} className={`relative flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${profile.availability.status === status ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                    <input type="radio" name="status" value={status} defaultChecked={profile.availability.status === status} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <span className="text-xs font-black uppercase">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-4">Available Days</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <label key={day} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:border-[#8B5CF6]/50 transition-all">
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value={day}
                                        defaultChecked={profile.availability.days.includes(day)}
                                        className="w-4 h-4 accent-[#8B5CF6]"
                                    />
                                    <span className="text-[10px] font-bold text-gray-300">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-4">Session Type</label>
                        <select name="sessionType" defaultValue={profile.availability.sessionType} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#8B5CF6]">
                            <option value="1:1">1:1 Focused Sessions</option>
                            <option value="Group">Group Office Hours</option>
                            <option value="Either">Flexible (1:1 or Group)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-4 bg-[#8B5CF6] text-white font-black uppercase text-xs rounded-xl shadow-lg shadow-[#8B5CF6]/20 flex items-center justify-center gap-2">
                        <Save size={18} /> Sync Availability
                    </button>
                </form>
            </Modal>

            {/* Profile Preview Modal */}
            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Mentor Public Profile Preview">
                <div className="space-y-8">
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 mx-auto mb-4 border-4 border-white/10 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                            {profile?.name?.[0] || 'A'}
                        </div>
                        <h3 className="text-2xl font-black text-white">{profile.name}</h3>
                        <p className="text-sm font-bold text-[#8B5CF6] uppercase tracking-widest mt-1">{profile.badge}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Expertise & Experience</p>
                            <p className="text-white font-medium">{profile.expertise}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Primary Sector</p>
                            <p className="text-white font-medium">{profile.sector}</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button className="flex items-center gap-2 text-[#8B5CF6] text-xs font-black uppercase tracking-widest hover:underline">
                            <ExternalLink size={14} /> Copy Profile Link
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/30">
                            {profile.badge}
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">{profile.expertise}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{profile.name}</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Your guidance is shaping the next billion-dollar ideas.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                        View Public Profile
                    </button>
                    <button
                        onClick={() => setIsAvailabilityModalOpen(true)}
                        className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center gap-2"
                    >
                        <Zap size={16} /> Edit Availability
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Upcoming Sessions */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Calendar className="text-[#8B5CF6]" size={20} />
                            Upcoming Sessions
                        </h3>
                        <button className="text-xs font-bold text-[#8B5CF6] hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {upcomingSessions.length === 0 ? (
                            <div className="p-12 bg-[#1E1E2F] rounded-2xl border border-dashed border-white/10 text-center">
                                <Calendar className="mx-auto text-gray-700 mb-4" size={40} />
                                <p className="text-gray-500 font-bold">No upcoming sessions</p>
                                <p className="text-xs text-gray-600 mt-1">Founders are waiting for your expertise.</p>
                            </div>
                        ) : (
                            upcomingSessions.map((session) => (
                                <UpcomingSessionCard
                                    key={session.id}
                                    session={session}
                                    onJoin={handleJoinSession}
                                    onCancel={handleCancelSession}
                                />
                            ))
                        )}
                    </div>

                    {/* Quick Activity Preview */}
                    <div className="pt-10 space-y-6">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Activity className="text-orange-400" size={20} />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {activity.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-500' :
                                        item.type === 'warning' ? 'bg-yellow-500' :
                                            item.type === 'error' ? 'bg-red-500' : 'bg-[#8B5CF6]'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-300">{item.message}</p>
                                        <p className="text-[10px] text-gray-600 mt-1 font-black uppercase">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* High Potential Startups */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Zap className="text-yellow-400" size={20} />
                            High-Potential Startups
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {highPotentialStartups.length === 0 ? (
                            <div className="p-12 bg-[#1E1E2F] rounded-2xl border border-dashed border-white/10 text-center">
                                <TrendingUp className="mx-auto text-gray-700 mb-4" size={40} />
                                <p className="text-gray-500 font-bold">Discovery Engine Idle</p>
                                <p className="text-xs text-gray-600 mt-1">Keep growing your network to see new deals.</p>
                            </div>
                        ) : (
                            highPotentialStartups.map((startup) => (
                                <HighPotentialCard
                                    key={startup.id}
                                    startup={startup}
                                    onView={setSelectedStartup}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
