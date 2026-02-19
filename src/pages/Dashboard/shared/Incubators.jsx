
import React, { useState, useEffect, useMemo } from 'react';
import {
    Building,
    MapPin,
    Calendar,
    TrendingUp,
    Award,
    Search,
    Filter,
    ChevronRight,
    ArrowRight,
    Globe,
    Zap,
    Plus,
    X,
    Shield,
    CheckCircle2,
    RefreshCw,
    Target,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';

const Incubators = () => {
    const { user } = useAuth();
    const { startup, applyToIncubator } = useStartup();

    // --- State Management ---
    const [incubators, setIncubators] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedIncubator, setSelectedIncubator] = useState(null);
    const [applyingIncubator, setApplyingIncubator] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        sector: 'All',
        stages: [],
        verifiedOnly: false
    });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Application Form State
    const [appForm, setAppForm] = useState({
        problem: '',
        traction: '',
        reason: '',
        funding: ''
    });

    // --- Initialization ---
    useEffect(() => {
        const refreshData = () => {
            setLoading(true);
            try {
                // Fetch incubators from global users
                const allUsersRaw = localStorage.getItem('vanguard_users');
                let allUsers = {};
                try {
                    allUsers = JSON.parse(allUsersRaw || '{}');
                    if (Array.isArray(allUsers)) {
                        allUsers = allUsers.reduce((acc, u) => {
                            if (u.uid || u.id) acc[u.uid || u.id] = u;
                            return acc;
                        }, {});
                    }
                } catch (e) { allUsers = {}; }

                const incubatorsList = Object.values(allUsers)
                    .filter(u => u.role === 'incubator')
                    .map(inc => ({
                        id: inc.uid,
                        name: inc.name || inc.profileData?.fullName || inc.email.split('@')[0],
                        location: inc.profileData?.location || 'India',
                        supportedStages: inc.profileData?.supportedStages || ['Idea', 'MVP', 'Revenue'],
                        focus: inc.profileData?.sector || 'General',
                        timeline: inc.profileData?.timeline || 'Rolling Admissions',
                        metrics: inc.profileData?.metrics || 'N/A',
                        initials: (inc.name || inc.email.split('@')[0]).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        verified: inc.profileData?.verified || true,
                        shortBio: inc.profileData?.shortBio || 'Incubator supporting early-stage startups.',
                        totalStartups: inc.profileData?.totalStartups || 0,
                        fundingCap: inc.profileData?.fundingCap || '$0'
                    }));
                setIncubators(incubatorsList);

                // Fetch applications for this founder
                const allApps = JSON.parse(localStorage.getItem('vanguard_applications') || '[]');
                setApplications(allApps.filter(a => a.founderId === user.uid));
            } catch (err) {
                console.error("Error fetching incubators:", err);
            } finally {
                setLoading(false);
            }
        };

        refreshData();
    }, [user.uid]);

    // --- Logic: Premium Matching & Filtering ---
    const filteredIncubators = useMemo(() => {
        let result = [...incubators];

        if (searchQuery) {
            result = result.filter(inc =>
                inc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inc.focus.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.sector !== 'All') {
            result = result.filter(inc => inc.focus === filters.sector);
        }

        if (filters.stages.length > 0) {
            result = result.filter(inc =>
                inc.supportedStages.some(stage => filters.stages.includes(stage))
            );
        }

        if (filters.verifiedOnly) {
            result = result.filter(inc => inc.verified);
        }

        const founderSector = startup?.sector || 'Fintech';
        const founderStage = startup?.stage || 'Idea';

        result = result.map(inc => {
            const sectorMatch = inc.focus === founderSector;
            const stageMatch = inc.supportedStages.includes(founderStage);
            const matchScore = (sectorMatch ? 2 : 0) + (stageMatch ? 1 : 0);
            return { ...inc, matchScore, isBestMatch: matchScore >= 2 };
        });

        result.sort((a, b) => {
            if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
            return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
        });

        return result;
    }, [incubators, filters, searchQuery, startup]);

    // --- Helpers ---
    const toggleStageFilter = (stage) => {
        setFilters(prev => ({
            ...prev,
            stages: prev.stages.includes(stage)
                ? prev.stages.filter(s => s !== stage)
                : [...prev.stages, stage]
        }));
    };

    const resetFilters = () => {
        setFilters({
            sector: 'All',
            stages: [],
            verifiedOnly: false
        });
        setSearchQuery('');
    };

    const handleApplicationSubmit = (e) => {
        e.preventDefault();

        const message = `Problem: ${appForm.problem}\n\nTraction: ${appForm.traction}\n\nReason: ${appForm.reason}\n\nFunding: ${appForm.funding}`;
        applyToIncubator(applyingIncubator.id, message);

        // Re-fetch applications
        const allApps = JSON.parse(localStorage.getItem('vanguard_applications') || '[]');
        setApplications(allApps.filter(a => a.founderId === user.uid));

        setAppForm({ problem: '', traction: '', reason: '', funding: '' });
        setApplyingIncubator(null);
    };

    const hasApplied = (incubatorId) => {
        return applications.some(app => app.incubatorId === incubatorId);
    };

    const isAccessRestricted = !['founder', 'co-founder'].includes(user?.role);
    const canApply = user?.role === 'founder' || (user?.role === 'co-founder' && startup?.coFounderPermissions?.applications);

    if (loading) return <div className="p-20 text-center text-gray-400">Loading Incubators...</div>;

    if (isAccessRestricted) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-3xl border border-white/5 mx-6">
                <Shield size={48} className="text-red-400 mb-6" />
                <h2 className="text-2xl font-black text-white mb-2">Access Restricted</h2>
                <p className="text-gray-400 text-center max-w-md">
                    Incubator applications are reserved for Founders and Co-Founders.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-2 md:px-0">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <span className="w-fit px-3 py-1 bg-blue-500/20 text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                            Growth Accelerators
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="text-gray-400 text-[10px] md:text-sm font-medium">Verified Institutions</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                            Startup <span className="text-blue-500">Incubators</span>
                        </h1>
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E1E2F] border border-white/5 rounded-2xl text-white font-bold transition-all hover:bg-white/5"
                        >
                            <Filter size={20} className={isFilterMenuOpen ? "text-blue-500" : "text-gray-500"} />
                            <span className="text-sm">Filters</span>
                        </button>
                    </div>
                </div>

                {applications.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1E1E2F] rounded-xl border border-white/5 self-start sm:self-auto">
                        <Target size={16} className="text-blue-500" />
                        <span className="text-xs md:text-sm font-bold text-white">{applications.length} Active Applications</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search & Filter */}
                <aside className={`${isFilterMenuOpen ? 'block' : 'hidden lg:block'} lg:col-span-1 space-y-6 animate-in slide-in-from-top lg:animate-none`}>
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Filter size={14} className="text-blue-500" /> Filters
                            </h3>
                            <button
                                onClick={resetFilters}
                                className="text-[10px] font-black text-blue-500 uppercase hover:underline"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Search */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search institutions..."
                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/30 font-bold"
                                />
                            </div>

                            {/* Sector Filter */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Sector Focus</label>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'SaaS', 'Fintech', 'Deep Tech', 'AI', 'Sustainability'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setFilters({ ...filters, sector: s })}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${filters.sector === s
                                                ? 'bg-blue-500/20 border-blue-500/40 text-white'
                                                : 'bg-white/5 border-white/5 text-gray-600 hover:text-white'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preferred Stage */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Startup Stage</label>
                                <div className="space-y-3">
                                    {['Idea', 'MVP', 'Revenue'].map((st) => (
                                        <div
                                            key={st}
                                            className="flex items-center gap-3 group cursor-pointer"
                                            onClick={() => toggleStageFilter(st)}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.stages.includes(st)
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-white/10 group-hover:border-blue-500/50'
                                                }`}>
                                                {filters.stages.includes(st) && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${filters.stages.includes(st) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                }`}>{st} Stage</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verified institution Toggle */}
                            <div className="pt-4 border-t border-white/5">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-[10px] text-gray-500 font-black uppercase">Verified Only</span>
                                    <div
                                        onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                                        className={`w-10 h-5 rounded-full relative transition-all ${filters.verifiedOnly ? 'bg-blue-500' : 'bg-[#0F0F14] border border-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${filters.verifiedOnly ? 'right-1 bg-white' : 'left-1 bg-gray-600'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E2F] to-[#0F0F14] border border-blue-500/10 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={64} /></div>
                        <h4 className="text-white font-bold text-sm mb-2">Auto-Fill Active</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">Vanguard has synced your system profiles with external portal requirements.</p>
                        <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                            <Zap size={10} fill="currentColor" /> Ready to Apply
                        </div>
                    </div>
                </aside>

                {/* Incubator Cards */}
                <div className="lg:col-span-3 space-y-6">
                    {filteredIncubators.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10 text-center">
                            <RefreshCw size={40} className="text-gray-600 mb-4 animate-spin-slow" />
                            <h3 className="text-xl font-bold text-white mb-2">No institutions match your refined criteria</h3>
                            <p className="text-gray-400 max-w-sm">Adjust your filters or startup stage to discover growth opportunities.</p>
                            <button
                                onClick={resetFilters}
                                className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        filteredIncubators.map((inc) => (
                            <motion.div
                                layout
                                key={inc.id}
                                className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden shadow-xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/2 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/5 transition-all" />

                                {inc.isBestMatch && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-md shadow-lg shadow-blue-600/20">
                                            Best Match
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                                            {inc.initials}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{inc.name}</h3>
                                                    {inc.verified && <Shield size={16} className="text-blue-400" />}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> {inc.location}</span>
                                                    <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-green-500" /> {inc.focus} Focus</span>
                                                </div>
                                            </div>
                                            <button
                                                disabled={hasApplied(inc.id) || !canApply}
                                                onClick={() => setApplyingIncubator(inc)}
                                                className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black border transition-all shadow-xl ${hasApplied(inc.id)
                                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                    : !canApply
                                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-transparent'
                                                        : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                                                    }`}
                                            >
                                                {hasApplied(inc.id) ? (
                                                    <>Applied <CheckCircle2 size={18} /></>
                                                ) : !canApply ? (
                                                    'Access Locked'
                                                ) : (
                                                    <>Apply Now <ArrowRight size={18} /></>
                                                )}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                        <Calendar size={10} /> Batch Timeline
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-300">{inc.timeline}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                        <Award size={10} /> Success Metrics
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-300">{inc.metrics}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-end space-y-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-600 font-black uppercase mb-2 tracking-widest">Target Stages</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {inc.supportedStages.map(stage => (
                                                            <span key={stage} className="px-3 py-1 bg-white/5 text-[10px] font-bold text-blue-400 rounded-lg border border-blue-500/10 transition-all">{stage}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedIncubator(inc)}
                                                    className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 hover:translate-x-1 transition-transform"
                                                >
                                                    View Full Details <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            disabled={hasApplied(inc.id) || !canApply}
                                            onClick={() => setApplyingIncubator(inc)}
                                            className={`md:hidden mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black transition-all ${hasApplied(inc.id)
                                                ? 'bg-green-500/20 text-green-400'
                                                : !canApply
                                                    ? 'bg-gray-800 text-gray-500'
                                                    : 'bg-blue-600 text-white shadow-lg'
                                                }`}
                                        >
                                            {hasApplied(inc.id) ? 'Applied' : 'Apply Now'} <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}

                    <div className="p-8 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-center group hover:bg-white/5 transition-all">
                        <div>
                            <p className="text-xs font-bold text-gray-600">Showing {filteredIncubators.length} of 124 Growth Hubs</p>
                            <button className="mt-4 text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 mx-auto">Discover More <Plus size={12} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedIncubator && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center md:p-6"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-[#1E1E2F] w-full h-full md:h-auto md:max-w-3xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="relative">
                                <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700" />
                                <button
                                    onClick={() => setSelectedIncubator(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                                <div className="px-10 -mt-16 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="flex items-end gap-6">
                                        <div className="w-32 h-32 rounded-3xl bg-[#1E1E2F] border-8 border-[#1E1E2F] overflow-hidden shadow-2xl">
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl font-black text-blue-500">
                                                {selectedIncubator.initials}
                                            </div>
                                        </div>
                                        <div className="pb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedIncubator.name}</h2>
                                                {selectedIncubator.verified && <CheckCircle2 size={24} className="text-blue-400" />}
                                            </div>
                                            <p className="text-gray-400 font-bold flex items-center gap-2"><MapPin size={16} className="text-blue-500" /> {selectedIncubator.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-10">
                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">About Institution</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{selectedIncubator.shortBio}</p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Program Statistics</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#0F0F14] p-4 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Startups</p>
                                                <p className="text-xl font-black text-white">{selectedIncubator.totalStartups}+</p>
                                            </div>
                                            <div className="bg-[#0F0F14] p-4 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Max Funding</p>
                                                <p className="text-xl font-black text-blue-400">{selectedIncubator.fundingCap}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-10">
                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Sector Focus</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-4 py-2 bg-blue-500/10 text-white text-xs font-bold rounded-xl border border-blue-500/20">
                                                {selectedIncubator.focus}
                                            </span>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Eligibility</h4>
                                        <div className="space-y-3">
                                            {selectedIncubator.supportedStages.map(stage => (
                                                <div key={stage} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    {stage} Stage Startups
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-6">
                                        <button
                                            disabled={hasApplied(selectedIncubator.id) || !canApply}
                                            onClick={() => {
                                                setApplyingIncubator(selectedIncubator);
                                                setSelectedIncubator(null);
                                            }}
                                            className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 ${hasApplied(selectedIncubator.id)
                                                ? 'bg-green-600/20 text-green-400 border border-green-500/20'
                                                : !canApply
                                                    ? 'bg-gray-800 text-gray-500'
                                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                                                }`}
                                        >
                                            {hasApplied(selectedIncubator.id) ? (
                                                <>Application Sent <CheckCircle2 size={20} /></>
                                            ) : !canApply ? (
                                                'Founder Access Only'
                                            ) : (
                                                <>Start Application <ArrowRight size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Application Modal */}
            <AnimatePresence>
                {applyingIncubator && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[160] flex items-center justify-center md:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1E1E2F] w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6 md:p-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center font-black text-blue-500 text-xl md:text-2xl border border-blue-500/20">
                                            {applyingIncubator.initials}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Program Application</h2>
                                            <p className="text-blue-400 font-bold text-xs md:text-sm tracking-wide line-clamp-1">Applying to {applyingIncubator.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setApplyingIncubator(null)}
                                        className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form className="space-y-8" onSubmit={handleApplicationSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-3 block">Startup Snapshot</label>
                                                <div className="bg-[#0F0F14] rounded-2xl p-4 border border-white/5">
                                                    <p className="text-sm font-black text-white mb-1">{startup?.startupName || 'Default Startup'}</p>
                                                    <p className="text-[10px] font-bold text-blue-500 uppercase">{startup?.stage || 'Idea'} Stage</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-3 block">Market Gap / Problem</label>
                                                <textarea
                                                    required
                                                    value={appForm.problem}
                                                    onChange={(e) => setAppForm({ ...appForm, problem: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 min-h-[140px]"
                                                    placeholder="Briefly describe the core problem you are solving..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-3 block">Current Traction</label>
                                                <textarea
                                                    required
                                                    value={appForm.traction}
                                                    onChange={(e) => setAppForm({ ...appForm, traction: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 min-h-[100px]"
                                                    placeholder="Users, revenue, Pilot project status..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-3 block">Why this Incubator?</label>
                                                <textarea
                                                    required
                                                    value={appForm.reason}
                                                    onChange={(e) => setAppForm({ ...appForm, reason: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 min-h-[100px]"
                                                    placeholder="How does this program fit your growth path?"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-3 block">Anticipated Funding Needs</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={appForm.funding}
                                                    onChange={(e) => setAppForm({ ...appForm, funding: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                                                    placeholder="e.g. $50k for MVP development"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-5 pt-6 border-t border-white/5">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-3"
                                        >
                                            Submit Application <Globe size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setApplyingIncubator(null)}
                                            className="px-10 bg-white/5 text-gray-400 font-bold py-5 rounded-2xl hover:text-white transition-all border border-white/10"
                                        >
                                            Discard Draft
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Incubators;
