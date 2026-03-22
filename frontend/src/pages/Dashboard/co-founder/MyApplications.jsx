import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Trash2,
    Rocket,
    ExternalLink,
    Building2,
    Users,
    Calendar,
    AlertCircle,
    ArrowRight,
    MessageSquare,
    Zap
} from 'lucide-react';
import { useStartup } from '../../../context/StartupContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
    const { startup, joinRequests, allStartups, withdrawJoinRequest, removeJoinRequest, isUserLinked } = useStartup();
    const { user } = useAuth();
    const linked = isUserLinked();
    const navigate = useNavigate();

    // --- REDIRECT LOGIC REMOVED ---
    // Co-Founder can view My Applications even when linked to a startup.

    const [filter, setFilter] = useState('All');

    const myRequests = joinRequests.filter(r => r.requesterId === user?.uid);

    const filteredRequests = myRequests.filter(r => {
        if (filter === 'All') return true;
        return r.status.toLowerCase() === filter.toLowerCase();
    });

    const getStartupDetails = (startupId) => {
        return allStartups.find(s => s.startupId === startupId) || {};
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            accepted: 'bg-green-500/10 text-green-400 border-green-500/20',
            rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            withdrawn: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        };

        const icons = {
            pending: <Clock size={14} />,
            accepted: <CheckCircle2 size={14} />,
            rejected: <XCircle size={14} />,
            withdrawn: <Trash2 size={14} />
        };

        return (
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${styles[status] || styles.pending}`}>
                {icons[status] || icons.pending}
                {status === 'pending' ? 'Pending Review' : status}
            </div>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    {linked ? (
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-500/20 shadow-sm">
                                Active in {startup?.startupName}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-[#8B5CF6]/20 shadow-sm">
                                Co-Founder Portal
                            </span>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Applications</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">Track your journey to joining a founding team.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 bg-[#1E1E2F] p-1.5 rounded-2xl border border-white/5 shadow-xl">
                    {['All', 'Pending', 'Accepted', 'Rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((req, index) => {
                            const startup = getStartupDetails(req.startupId);
                            return (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#1E1E2F] rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-[#8B5CF6]/30 transition-all shadow-xl"
                                >
                                    <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">
                                        {/* Startup Icon */}
                                        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#15151e] to-[#1E1E2F] border border-white/10 flex items-center justify-center text-3xl font-black text-[#8B5CF6] group-hover:scale-110 transition-transform duration-500 shrink-0 shadow-inner">
                                            {startup.startupName ? startup.startupName[0] : 'S'}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-3xl font-black text-white group-hover:text-[#8B5CF6] transition-colors">
                                                        {startup.startupName || 'Unknown Startup'}
                                                    </h3>
                                                    <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Building2 size={14} /> {startup.sector || 'General'}
                                                        </span>
                                                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Rocket size={14} /> {startup.stage || 'Idea'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <StatusBadge status={req.status} />
                                            </div>

                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative">
                                                <MessageSquare size={16} className="absolute -top-2 -left-2 text-[#8B5CF6]" />
                                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                                    "{req.message || "Applied to join the team."}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-600" />
                                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Applied: {new Date(req.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {startup.executionScore && (
                                                    <div className="flex items-center gap-2">
                                                        <Zap size={14} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{startup.executionScore}% Score</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="shrink-0 flex flex-col gap-3 min-w-[160px]">
                                            {req.status === 'pending' && (
                                                <button
                                                    onClick={() => withdrawJoinRequest(req.id)}
                                                    className="w-full py-4 bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 text-[10px] font-black uppercase rounded-2xl border border-white/10 hover:border-rose-500/20 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={16} /> Withdraw
                                                </button>
                                            )}
                                            {req.status === 'accepted' && (
                                                <button
                                                    onClick={() => navigate('/cofounder/dashboard')}
                                                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink size={16} /> Go to Workspace
                                                </button>
                                            )}
                                            {(req.status === 'rejected' || req.status === 'withdrawn') && (
                                                <button
                                                    onClick={() => removeJoinRequest(req.id)}
                                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white text-[10px] font-black uppercase rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="min-h-[40vh] flex flex-col items-center justify-center text-center p-10 bg-[#1E1E2F] rounded-[3rem] border border-white/5 border-dashed"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                                <AlertCircle size={32} className="text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">No Applications Found</h3>
                            <p className="text-gray-500 max-w-xs font-medium mx-auto mb-8">You haven't sent any join requests to startups yet.</p>
                            <button
                                onClick={() => navigate('/cofounder/discover-startups')}
                                className="px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center gap-2"
                            >
                                Discover Startups <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyApplications;
