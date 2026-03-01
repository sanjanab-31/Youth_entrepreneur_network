import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    MessageSquare,
    User,
    ArrowRight,
    Search,
    Filter,
    Mail,
    Calendar,
    Briefcase
} from 'lucide-react';
import { useStartup } from '../../../context/StartupContext';

const JoinRequests = () => {
    const { joinRequests, acceptJoinRequest, rejectJoinRequest, startup } = useStartup();

    // Filter requests for the current startup
    const activeRequests = joinRequests.filter(r => r.startupId === startup?.startupId);

    if (activeRequests.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                    <Users className="text-gray-600" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No Requests Yet</h3>
                <p className="text-gray-500 max-w-xs font-medium">When co-founders request to join your venture, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Co-Founder <span className="text-[#8B5CF6]">Requests</span></h1>
                <p className="text-gray-500 mt-2 font-medium">Review talent looking to join your founding team.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {activeRequests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1E1E2F] p-8 rounded-[2rem] border border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-[#8B5CF6]/30 transition-all shadow-xl"
                        >
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#8B5CF6] to-indigo-600 flex items-center justify-center font-black text-3xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0">
                                {req.requesterName[0]}
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                        <h3 className="text-2xl font-black text-white">{req.requesterName}</h3>
                                        <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black uppercase rounded border border-[#8B5CF6]/20">
                                            Candidate
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative">
                                    <MessageSquare size={16} className="absolute -top-2 -left-2 text-[#8B5CF6]" />
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "{req.message || "No message provided."}"
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                {req.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => acceptJoinRequest(req.id)}
                                            className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Accept
                                        </button>
                                        <button
                                            onClick={() => rejectJoinRequest(req.id)}
                                            className="px-6 py-3 bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={16} /> Decline
                                        </button>
                                    </>
                                ) : (
                                    <div className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border ${req.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        {req.status === 'accepted' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                        {req.status}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JoinRequests;
