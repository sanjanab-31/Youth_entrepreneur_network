import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Rocket,
    Users,
    UserPlus,
    Zap,
    Building,
    Target,
    Filter,
    ArrowUpRight,
    SearchX,
    ShieldCheck,
    MessageSquare,
    Clock,
    Send,
    X,
    TrendingUp,
    MapPin,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { getSystem } from '../../../utils/system';

const DiscoverStartups = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { startup, sendJoinRequest, joinRequests: myRequests, isUserLinked } = useStartup();
    const linked = isUserLinked();

    // --- REDIRECT LOGIC ---
    // --- REDIRECT LOGIC REMOVED ---
    // A Co-Founder can now browse startups even after joining one.

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('All');
    const [selectedStage, setSelectedStage] = useState('All');
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [joinMessage, setJoinMessage] = useState('');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // --- DATA FETCHING ---
    const system = getSystem();
    const allStartups = system.startups || [];

    // Filter out startups where user is already a founder or co-founder
    const browsableStartups = useMemo(() => {
        return allStartups.filter(s => {
            if (s.founderId === user.uid) return false;
            if (Array.isArray(s.coFounders) && s.coFounders.includes(user.uid)) return false;
            return true;
        });
    }, [allStartups, user.uid]);

    const filteredStartups = useMemo(() => {
        return browsableStartups.filter(s => {
            const matchesSearch = s.startupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.problemStatement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.skillGap?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = selectedSector === 'All' || s.expertiseSector === selectedSector;
            const matchesStage = selectedStage === 'All' || s.stage === selectedStage;
            return matchesSearch && matchesSector && matchesStage;
        }).sort((a, b) => (b.executionScore || 0) - (a.executionScore || 0));
    }, [browsableStartups, searchQuery, selectedSector, selectedStage]);

    // Unique sectors and stages for filters
    const availableSectors = ['All', ...new Set(allStartups.map(s => s.expertiseSector).filter(Boolean))];
    const availableStages = ['All', 'Idea', 'Validation', 'MVP', 'Revenue', 'Scale'];

    // --- HANDLERS ---
    const handleRequestToJoin = (startup) => {
        setSelectedStartup(startup);
        setIsRequestModalOpen(true);
    };

    const confirmJoinRequest = (e) => {
        e.preventDefault();
        if (!selectedStartup) return;

        const result = sendJoinRequest(selectedStartup.startupId, joinMessage);
        if (result.success) {
            setIsRequestModalOpen(false);
            setSelectedStartup(null);
            setJoinMessage('');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } else {
            alert(result.error || "Failed to send request");
        }
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
                        className="fixed bottom-8 right-8 z-[110] bg-brand-purple text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm"
                    >
                        <ShieldCheck size={20} />
                        Join Request Sent Successfully
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Startups</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">Find high-potential ventures looking for your <span className="text-white font-bold">Expertise</span>.</p>
                </div>
                {linked ? (
                    <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active in {startup?.startupName}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 px-4 py-2 bg-brand-purple/10 border border-brand-purple/20 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                        <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Unlinked Mode Active</span>
                    </div>
                )}
            </div>

            {/* Sub-Header / Filters */}
            <div className="bg-[#1E1E2F] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-purple transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, problem, or skill needs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="bg-[#0F0F14] border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-purple/50 cursor-pointer"
                        >
                            {availableSectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
                        </select>
                        <select
                            value={selectedStage}
                            onChange={(e) => setSelectedStage(e.target.value)}
                            className="bg-[#0F0F14] border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:border-brand-purple/50 cursor-pointer"
                        >
                            {availableStages.map(s => <option key={s} value={s}>{s === 'All' ? 'All Stages' : s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStartups.length > 0 ? (
                    filteredStartups.map((s) => {
                        const isPending = myRequests?.some(r => r.startupId === s.startupId && r.status === 'pending');
                        return (
                            <motion.div
                                key={s.startupId}
                                whileHover={{ y: -8 }}
                                className="bg-[#1E1E2F] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col group hover:border-brand-purple/30 transition-all shadow-xl shadow-black/20"
                            >
                                <div className="p-8 pb-4">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-purple/20 group-hover:scale-110 transition-transform">
                                            {s.startupName?.[0] || 'S'}
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-[8px] font-black text-brand-purple uppercase tracking-widest mb-1">
                                                <TrendingUp size={10} /> Execution
                                            </div>
                                            <span className="text-xl font-black text-white">{s.executionScore || 0}%</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-2 truncate group-hover:text-brand-purple transition-colors">{s.startupName}</h3>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-[8px] font-black uppercase rounded border border-brand-purple/20">{s.stage}</span>
                                        <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[8px] font-black uppercase rounded border border-white/10">{s.expertiseSector}</span>
                                    </div>

                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 h-12 font-medium italic mb-8">
                                        "{s.problemStatement || 'Solving critical challenges through innovation and scalable technology.'}"
                                    </p>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Skill Need</span>
                                            <span className="text-[10px] text-white font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-2 rounded">{s.skillGap || 'Elite Talent'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Team</span>
                                            <span className="text-[10px] text-white font-bold">{1 + (s.coFounders?.length || 0)} / 5</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-6 bg-[#0F0F14]/30 border-t border-white/5 grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => handleRequestToJoin(s)}
                                        disabled={isPending || linked}
                                        title={linked ? "You must resign from your current startup before applying" : ""}
                                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isPending
                                            ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30 cursor-default'
                                            : linked
                                                ? 'bg-gray-800 text-gray-400 border border-white/5 cursor-not-allowed opacity-50'
                                                : 'bg-brand-purple text-white hover:shadow-lg hover:shadow-brand-purple/20 active:scale-95'
                                            }`}
                                    >
                                        {isPending ? (
                                            <><Clock size={14} /> Request Pending</>
                                        ) : linked ? (
                                            <><ShieldCheck size={14} /> Active in Another Startup</>
                                        ) : (
                                            <><UserPlus size={14} /> Request to Join</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-32 bg-[#1E1E2F] rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-gray-800 mb-8">
                            <SearchX size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No Startups Found</h3>
                        <p className="text-gray-500 max-w-sm font-bold italic leading-relaxed">We couldn't find any startups matching your current filters. Try expanding your search horizons!</p>
                    </div>
                )}
            </div>

            {/* Join Request Modal */}
            <AnimatePresence>
                {isRequestModalOpen && selectedStartup && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setIsRequestModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-xl bg-[#1E1E2F] border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Rocket size={120} />
                            </div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-white mb-2">Join <span className="text-brand-purple">{selectedStartup.startupName}</span></h2>
                                    <p className="text-xs text-gray-500 font-bold italic">Tell the founder why you're the perfect fit.</p>
                                </div>
                                <button
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={confirmJoinRequest} className="space-y-8 relative z-10">
                                <div className="bg-[#0F0F14] border border-white/5 p-8 rounded-3xl">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Looking For</p>
                                            <p className="text-lg font-black text-white">{selectedStartup.skillGap || 'Co-Founder'}</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 my-6" />
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium italic">
                                        "{selectedStartup.problemStatement}"
                                    </p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-4 ml-1">Your Pitch</label>
                                    <textarea
                                        value={joinMessage}
                                        onChange={(e) => setJoinMessage(e.target.value)}
                                        required
                                        placeholder="Explain how your background in product design and seed-stage scaling will help them reach MVP faster..."
                                        className="w-full bg-[#0F0F14] border border-white/10 rounded-3xl px-8 py-6 text-sm font-medium text-white focus:outline-none focus:border-brand-purple/50 h-48 resize-none shadow-inner placeholder:text-gray-800"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsRequestModalOpen(false)}
                                        className="flex-1 py-5 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand-purple/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Send size={20} /> Submit Request
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

export default DiscoverStartups;
