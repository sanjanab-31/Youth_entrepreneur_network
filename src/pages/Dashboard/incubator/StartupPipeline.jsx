import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Rocket,
    User,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Star,
    CheckCircle2,
    X,
    FileText,
    Globe,
    Linkedin,
    Target,
    Zap,
    Users as UsersIcon,
    DollarSign,
    Milestone,
    Clock,
    MapPin,
    Plus
} from 'lucide-react';

import { useIncubator } from '../../../context/IncubatorContext';

const StartupPipeline = () => {
    const { pipeline, onboardStartup, inviteToApply } = useIncubator();
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardData, setOnboardData] = useState({ name: '', sector: '', stage: '', oneLiner: '' });

    const handleOnboardSubmit = (e) => {
        e.preventDefault();
        onboardStartup(onboardData);
        setShowOnboardModal(false);
        setOnboardData({ name: '', sector: '', stage: '', oneLiner: '' });
    };

    const filteredStartups = pipeline.filter(s =>
        (s.startupName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.sector || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative min-h-[80vh]">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Startup Pipeline</h1>
                    <p className="text-sm text-gray-400">Discover and evaluate high-potential ventures</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowOnboardModal(true)}
                        className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        <Plus size={16} /> Add Startup
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search startups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1E1E2F] border border-white/5 rounded-xl py-2 px-10 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all shadow-lg"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-xl border transition-all ${showFilters ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'bg-[#1E1E2F] border-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Filters Panel - Simplified for now but kept UI structure */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-[#1B1B2B] rounded-2xl border border-[#8B5CF6]/20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Sector</label>
                                <select className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none">
                                    <option>All Sectors</option>
                                    <option>Fintech</option>
                                    <option>SaaS</option>
                                    <option>AI</option>
                                    <option>Greentech</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Stage</label>
                                <select className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none">
                                    <option>All Stages</option>
                                    <option>Pre-seed</option>
                                    <option>Seed</option>
                                    <option>Growth</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Sort By</label>
                                <select className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none">
                                    <option>Execution Score</option>
                                    <option>Last Updated</option>
                                    <option>Watchlist First</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Location</label>
                                <input placeholder="City or Country" className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none" />
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6] peer-checked:after:bg-white"></div>
                                    <span className="ml-3 text-xs font-medium text-gray-400">Verified Only</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Startup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStartups.map((startup, index) => (
                    <motion.div
                        key={startup.startupId || startup.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 rounded-xl flex items-center justify-center border border-[#8B5CF6]/20">
                                    <Rocket className="text-[#8B5CF6]" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{startup.startupName || startup.name || 'Unnamed Venture'}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Globe size={12} /> {startup.sector}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${startup.stage === 'Growth' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                startup.stage === 'Seed' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                }`}>
                                {startup.stage}
                            </span>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Traction</span>
                                    <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> {startup.traction}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${startup.executionScore}%` }}
                                        className="h-full bg-[#8B5CF6]"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                    <span>Execution Score</span>
                                    <span>{startup.executionScore}%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={12} /> Last Updated</span>
                                <span>{new Date(startup.lastUpdated).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedStartup(startup)}
                                className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-bold text-white rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                            >
                                View Profile
                                <ChevronRight size={14} />
                            </button>
                            <button
                                onClick={() => toggleWatchlist(startup.id)}
                                className={`p-2.5 rounded-xl border transition-all ${startup.watchlist
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-amber-400'
                                    }`}
                            >
                                <Star size={20} fill={startup.watchlist ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Selection Modal / Sidebar Detail View */}
            <AnimatePresence>
                {selectedStartup && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStartup(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#1E1E2F] border-l border-white/10 z-[110] shadow-2xl overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-[#1E1E2F]/80 backdrop-blur-xl p-6 border-b border-white/5 flex justify-between items-center z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
                                        <Rocket className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">{selectedStartup.startupName}</h2>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin size={12} /> {selectedStartup.location || 'Remote'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStartup(null)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded-full border border-white/10">
                                        {selectedStartup.sector}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                                        {selectedStartup.stage} Stage
                                    </span>
                                    {selectedStartup.verified && (
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} /> Verified Profile
                                        </span>
                                    )}
                                </div>

                                {/* Problem & Solution */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Target size={14} /> The Problem
                                        </h3>
                                        <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 font-medium italic">
                                            "{selectedStartup.problemStatement || 'Not specified'}"
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Zap size={14} /> The Mission
                                        </h3>
                                        <p className="text-sm text-gray-300 leading-relaxed bg-[#8B5CF6]/5 p-4 rounded-xl border border-[#8B5CF6]/10 font-medium">
                                            {selectedStartup.oneLiner || 'Strategic mission in progress.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Metrics & Team */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/10">
                                        <UsersIcon className="mx-auto mb-2 text-blue-400" size={20} />
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Team Size</p>
                                        <p className="text-lg font-bold text-white">{selectedStartup.team?.split(',')[0] || selectedStartup.teamSize || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/10">
                                        <DollarSign className="mx-auto mb-2 text-emerald-400" size={20} />
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Revenue</p>
                                        <p className="text-lg font-bold text-white">{selectedStartup.revenue || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/10">
                                        <TrendingUp className="mx-auto mb-2 text-purple-400" size={20} />
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Growth</p>
                                        <p className="text-lg font-bold text-white">{selectedStartup.growth || selectedStartup.traction || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Execution Checklist */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                        <Milestone size={16} /> Milestone Checklist
                                    </h3>
                                    <div className="space-y-3">
                                        {(selectedStartup.milestones || []).map((ms, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                </div>
                                                <span className="text-sm text-gray-300 font-medium">{ms}</span>
                                            </div>
                                        ))}
                                        {(!selectedStartup.milestones || selectedStartup.milestones.length === 0) && (
                                            <p className="text-xs text-gray-500 italic">No milestones defined yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Documentation Links */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Documentation & Links</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xs font-bold text-white">
                                            <FileText size={16} className="text-rose-400" /> Pitch Deck.pdf
                                        </button>
                                        <button className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xs font-bold text-white">
                                            <Globe size={16} className="text-blue-400" /> Demo Link
                                        </button>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="pt-10 flex gap-4">
                                    <button
                                        onClick={() => {
                                            inviteToApply(selectedStartup);
                                            setSelectedStartup(null);
                                        }}
                                        className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-black uppercase tracking-widest text-white rounded-2xl shadow-xl shadow-[#8B5CF6]/30 transition-all"
                                    >
                                        Invite to Apply
                                    </button>
                                    <button className="px-6 py-4 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 rounded-2xl border border-white/10 hover:border-rose-500/20 transition-all flex items-center justify-center">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Onboarding Modal */}
            <AnimatePresence>
                {showOnboardModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOnboardModal(false)}
                            className="absolute inset-0 bg-[#0F0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-[#1E1E2F] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Onboard New Venture</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manual ecosystem entry</p>
                                </div>
                                <button onClick={() => setShowOnboardModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleOnboardSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Startup Name</label>
                                    <input
                                        required
                                        value={onboardData.name}
                                        onChange={(e) => setOnboardData({ ...onboardData, name: e.target.value })}
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all shadow-inner"
                                        placeholder="e.g. Acme AI"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Sector</label>
                                        <select
                                            required
                                            value={onboardData.sector}
                                            onChange={(e) => setOnboardData({ ...onboardData, sector: e.target.value })}
                                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                        >
                                            <option value="">Select Sector</option>
                                            <option value="Fintech">Fintech</option>
                                            <option value="SaaS">SaaS</option>
                                            <option value="AI/ML">AI/ML</option>
                                            <option value="Healthtech">Healthtech</option>
                                            <option value="Edtech">Edtech</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Current Stage</label>
                                        <select
                                            required
                                            value={onboardData.stage}
                                            onChange={(e) => setOnboardData({ ...onboardData, stage: e.target.value })}
                                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                        >
                                            <option value="">Select Stage</option>
                                            <option value="Idea">Idea</option>
                                            <option value="MVP">MVP</option>
                                            <option value="Pre-Seed">Pre-Seed</option>
                                            <option value="Seed">Seed</option>
                                            <option value="Growth">Growth</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">One Liner</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={onboardData.oneLiner}
                                        onChange={(e) => setOnboardData({ ...onboardData, oneLiner: e.target.value })}
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all resize-none"
                                        placeholder="Briefly describe what they do..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-black uppercase tracking-widest text-white rounded-2xl shadow-xl shadow-[#8B5CF6]/30 transition-all mt-4"
                                >
                                    Add to Ecosystem
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StartupPipeline;
