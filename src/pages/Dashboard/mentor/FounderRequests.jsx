
import React, { useState } from 'react';
import {
    Filter,
    Search,
    Check,
    X,
    ExternalLink,
    Brain,
    TrendingUp,
    Users,
    Zap,
    MapPin,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestCard = ({ request, onAccept, onDecline, onViewProfile }) => (
    <motion.div
        layout
        className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] font-black group-hover:scale-110 transition-transform">
                    {request.founderName[0]}
                </div>
                <div>
                    <h4 className="text-white font-bold group-hover:text-[#8B5CF6] transition-colors">{request.founderName}</h4>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{request.startupName} • <span className="text-[#8B5CF6]">{request.stage}</span></p>
                </div>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Requested Area</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">{request.mentorshipArea}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-black mb-1 uppercase">Traction</p>
                    <p className="text-xs font-bold text-white">{request.traction}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-black mb-1 uppercase">Sector</p>
                    <p className="text-xs font-bold text-white">{request.sector}</p>
                </div>
            </div>

            <div>
                <p className="text-[10px] text-gray-500 font-black uppercase mb-2">Problem Summary</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{request.problemSummary}</p>
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <button
                    onClick={() => onAccept(request.id)}
                    className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all border border-[#8B5CF6]/20"
                >
                    Accept Request
                </button>
                <button
                    onClick={() => onDecline(request.id)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10"
                >
                    Decline
                </button>
            </div>
            <button
                onClick={() => onViewProfile(request)}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-[#8B5CF6] hover:text-[#7C3AED] transition-all flex items-center justify-center gap-2"
            >
                View Full Profile <ExternalLink size={12} />
            </button>
        </div>
    </motion.div>
);

const StartupDetailModal = ({ startup, onClose }) => {
    if (!startup) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F0F14]/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1E1E2F] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Modal Header */}
                <div className="sticky top-0 p-8 border-b border-white/5 bg-[#1E1E2F]/80 backdrop-blur-md flex justify-between items-start z-10">
                    <div className="flex gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-xl">
                            {startup.startupName[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-black text-white">{startup.startupName}</h2>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                                    {startup.stage}
                                </span>
                            </div>
                            <p className="text-gray-400 font-medium">{startup.founderName} • Founder & CEO</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column - Core Info */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Brain size={14} /> Problem Statement
                            </h3>
                            <p className="text-gray-300 font-medium leading-relaxed">
                                {startup.problemSummary || "Current market solutions are fragmented and expensive. We're building a unified layer that automates 80% of the workflow while reducing costs by 45%."}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} /> Solution Overview
                            </h3>
                            <p className="text-gray-300 font-medium leading-relaxed">
                                An AI-driven SaaS platform that integrates with existing legacy systems, providing real-time data synchronization and automated reporting for mid-to-large scale enterprises.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp size={14} /> Milestones Completed
                            </h3>
                            <div className="space-y-4">
                                {['MVP developed and deployed', 'First 10 pilot customers secured', 'Integration with top 3 CRM completed'].map((m, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300">{m}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Metrics & Team */}
                    <div className="space-y-8">
                        <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Traction Metrics</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Users / Growth</p>
                                    <p className="text-xl font-black text-white">{startup.traction}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Sector</p>
                                    <p className="text-xl font-black text-white">{startup.sector}</p>
                                </div>
                                <div className="h-[1px] w-full bg-white/5" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Funding Goal</p>
                                    <p className="text-lg font-black text-[#8B5CF6]">$500k Pre-Seed</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Team Info</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                                <p className="text-sm font-bold text-gray-300 uppercase tracking-tight">Full-time Founders</p>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all">
                            Accept Mentorship
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FounderRequests = () => {
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [requests, setRequests] = useState([
        { id: 1, founderName: 'Sarah Jenkins', startupName: 'EcoFlow', stage: 'MVP', traction: '500+ Active Users', sector: 'SaaS / CleanTech', mentorshipArea: 'GTM Strategy', problemSummary: 'Scaling from initial 100 users to 1000 with limited budget.' },
        { id: 2, founderName: 'Alex Rivera', startupName: 'Nexus AI', stage: 'Idea', traction: 'Waitlist of 2k+', sector: 'AI / DevTools', mentorshipArea: 'Product Validation', problemSummary: 'Verifying technical feasibility and core value prop.' },
        { id: 3, founderName: 'Michael Chen', startupName: 'PayBolt', stage: 'Revenue', traction: '$12k Monthly Vol', sector: 'FinTech / Web3', mentorshipArea: 'Regulatory Compliance', problemSummary: 'Navigating multi-state payment processing regulations.' },
        { id: 4, founderName: 'Elena Rossi', startupName: 'VibeHealth', stage: 'Seed', traction: '3 Clinical Trials', sector: 'HealthTech', mentorshipArea: 'Strategic Partnerships', problemSummary: 'Connecting with hospital networks for pilot deployment.' },
    ]);

    const handleAccept = (id) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const handleDecline = (id) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Founder <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Requests</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Evaluate and select high-potential founders to guide.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by startup or sector..."
                        className="w-full pl-12 pr-6 py-4 bg-[#1E1E2F] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-600 shadow-xl shadow-black/20"
                    />
                </div>

                <button className="px-6 py-4 bg-[#1E1E2F] border border-white/5 rounded-2xl text-gray-400 font-bold hover:text-white transition-all flex items-center gap-3">
                    <Filter size={18} /> Filter
                </button>

                <div className="flex items-center gap-3 px-6 py-4 bg-[#1E1E2F] border border-white/5 rounded-2xl cursor-pointer select-none">
                    <div className="w-10 h-6 bg-[#8B5CF6]/20 rounded-full relative p-1 transition-all">
                        <div className="w-4 h-4 bg-[#8B5CF6] rounded-full shadow-lg" />
                    </div>
                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Full-Time Only</span>
                </div>
            </div>

            {/* Request Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                    <RequestCard
                        key={request.id}
                        request={request}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onViewProfile={setSelectedStartup}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedStartup && (
                    <StartupDetailModal
                        startup={selectedStartup}
                        onClose={() => setSelectedStartup(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FounderRequests;
