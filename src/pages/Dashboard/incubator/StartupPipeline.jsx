import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Rocket,
    TrendingUp,
    ChevronRight,
    CheckCircle2,
    X,
    FileText,
    Globe,
    Milestone,
    Clock,
    MapPin,
    Plus,
    User,
    Users as UsersIcon,
    Shield,
    Target,
    Zap
} from 'lucide-react';

import { useIncubator } from '../../../context/IncubatorContext';
import { calculateExecutionScore } from '../../../context/StartupContext';
import { getSystem } from '../../../utils/system';

const DAY_MS = 24 * 60 * 60 * 1000;

const StartupPipeline = () => {
    const { pipeline, onboardStartup, mentors } = useIncubator();
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardData, setOnboardData] = useState({ name: '', sector: '', stage: '', oneLiner: '' });
    const [filters, setFilters] = useState({
        sector: 'all',
        stage: 'all',
        execution: 'all',
        mentor: 'all',
        recent: 'all'
    });

    const system = getSystem();
    const usersById = system.users || {};

    const getFounderName = (startup) => {
        const founder = usersById[startup.founderId];
        return founder?.name || founder?.email?.split('@')[0] || 'Unknown Founder';
    };

    const getCoFounderNames = (startup) => {
        return (startup.coFounders || []).map((uid) => {
            const user = usersById[uid];
            return user?.name || user?.email?.split('@')[0] || uid;
        });
    };

    const getMentor = (startup) => {
        const mentorId = startup.mentorAssigned || startup.mentorId;
        if (!mentorId) return null;
        return mentors.find(m => m.uid === mentorId) || usersById[mentorId] || null;
    };

    const getLastUpdatedTimestamp = (startup) => {
        const times = [startup.updatedAt, startup.createdAt]
            .filter(Boolean)
            .map(v => new Date(v).getTime())
            .filter(Number.isFinite);

        (startup.activity || []).forEach((act) => {
            const t = new Date(act.timestamp).getTime();
            if (Number.isFinite(t)) times.push(t);
        });

        (startup.milestones || []).forEach((ms) => {
            const t = new Date(ms.updatedAt || ms.createdAt || ms.timestamp).getTime();
            if (Number.isFinite(t)) times.push(t);
        });

        (startup.documents || []).forEach((doc) => {
            const t = new Date(doc.uploadedAt || doc.updatedAt || doc.createdAt).getTime();
            if (Number.isFinite(t)) times.push(t);
        });

        return times.length ? Math.max(...times) : null;
    };

    const formatLastUpdated = (timestamp) => {
        if (!timestamp) return 'No updates';
        const delta = Date.now() - timestamp;
        if (delta < DAY_MS) return 'Today';
        if (delta < 2 * DAY_MS) return '1 day ago';
        if (delta < 30 * DAY_MS) return `${Math.floor(delta / DAY_MS)} days ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    const isNewStartup = (startup) => {
        const createdAt = startup.createdAt ? new Date(startup.createdAt).getTime() : null;
        if (!createdAt) return false;
        return (Date.now() - createdAt) < (3 * DAY_MS);
    };

    const getTractionData = (startup) => {
        const hasTractionString = typeof startup.traction === 'string' && startup.traction.trim().length > 0;
        const hasUsers = typeof startup.activeUsers === 'number' && startup.activeUsers > 0;
        const hasGrowth = typeof startup.growth === 'string' && startup.growth.trim().length > 0;
        const hasRevenue = typeof startup.revenue === 'string' && startup.revenue.trim().length > 0;
        const hasAny = hasTractionString || hasUsers || hasGrowth || hasRevenue;

        return {
            hasAny,
            traction: hasTractionString ? startup.traction : null,
            users: hasUsers ? startup.activeUsers : null,
            growth: hasGrowth ? startup.growth : null,
            revenue: hasRevenue ? startup.revenue : null
        };
    };

    const getRoadmapProgress = (startup) => {
        const milestones = startup.milestones || [];
        if (!milestones.length) return 0;
        const completed = milestones.filter(m => m.status === 'completed').length;
        return Math.round((completed / milestones.length) * 100);
    };

    const sectorOptions = useMemo(() => {
        return [...new Set(pipeline.map(s => s.sector).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    }, [pipeline]);

    const stageOptions = useMemo(() => {
        return [...new Set(pipeline.map(s => s.stage).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    }, [pipeline]);

    const filteredStartups = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return pipeline
            .filter((startup) => {
                const founderName = getFounderName(startup).toLowerCase();
                const startupName = (startup.startupName || '').toLowerCase();
                const sector = (startup.sector || '').toLowerCase();
                const score = calculateExecutionScore(startup);
                const hasMentor = Boolean(startup.mentorAssigned || startup.mentorId);
                const lastUpdated = getLastUpdatedTimestamp(startup);

                const searchMatch = !term
                    || startupName.includes(term)
                    || sector.includes(term)
                    || founderName.includes(term);

                const sectorMatch = filters.sector === 'all' || startup.sector === filters.sector;
                const stageMatch = filters.stage === 'all' || startup.stage === filters.stage;

                const executionMatch = filters.execution === 'all'
                    || (filters.execution === 'lt40' && score < 40)
                    || (filters.execution === '40to70' && score >= 40 && score <= 70)
                    || (filters.execution === 'gt70' && score > 70);

                const mentorMatch = filters.mentor === 'all'
                    || (filters.mentor === 'with' && hasMentor)
                    || (filters.mentor === 'without' && !hasMentor);

                const recentMatch = filters.recent === 'all'
                    || (filters.recent === '7' && lastUpdated && (Date.now() - lastUpdated) <= 7 * DAY_MS)
                    || (filters.recent === '14' && lastUpdated && (Date.now() - lastUpdated) <= 14 * DAY_MS);

                return searchMatch && sectorMatch && stageMatch && executionMatch && mentorMatch && recentMatch;
            })
            .sort((a, b) => (getLastUpdatedTimestamp(b) || 0) - (getLastUpdatedTimestamp(a) || 0));
    }, [pipeline, searchTerm, filters]);

    const handleOnboardSubmit = (e) => {
        e.preventDefault();
        onboardStartup(onboardData);
        setShowOnboardModal(false);
        setOnboardData({ name: '', sector: '', stage: '', oneLiner: '' });
    };

    return (
        <div className="space-y-6 relative min-h-[80vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Startup Pipeline</h1>
                    <p className="text-sm text-gray-400">Live evaluation dashboard for startups assigned to your incubator</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowOnboardModal(true)}
                        className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        <Plus size={16} /> Manual Onboard Startup
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by startup, sector, founder"
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

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-[#1B1B2B] rounded-2xl border border-[#8B5CF6]/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Sector</label>
                                <select
                                    value={filters.sector}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                                >
                                    <option value="all">All Sectors</option>
                                    {sectorOptions.map((sector) => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Stage</label>
                                <select
                                    value={filters.stage}
                                    onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                                >
                                    <option value="all">All Stages</option>
                                    {stageOptions.map((stage) => (
                                        <option key={stage} value={stage}>{stage}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Execution Score</label>
                                <select
                                    value={filters.execution}
                                    onChange={(e) => setFilters(prev => ({ ...prev, execution: e.target.value }))}
                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                                >
                                    <option value="all">All Scores</option>
                                    <option value="lt40">Below 40</option>
                                    <option value="40to70">40 to 70</option>
                                    <option value="gt70">Above 70</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Mentor</label>
                                <select
                                    value={filters.mentor}
                                    onChange={(e) => setFilters(prev => ({ ...prev, mentor: e.target.value }))}
                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                                >
                                    <option value="all">All</option>
                                    <option value="with">With Mentor</option>
                                    <option value="without">Without Mentor</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Recently Updated</label>
                                <select
                                    value={filters.recent}
                                    onChange={(e) => setFilters(prev => ({ ...prev, recent: e.target.value }))}
                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none"
                                >
                                    <option value="all">Any Time</option>
                                    <option value="7">Last 7 days</option>
                                    <option value="14">Last 14 days</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStartups.map((startup, index) => {
                    const executionScore = calculateExecutionScore(startup);
                    const traction = getTractionData(startup);
                    const mentor = getMentor(startup);
                    const founderName = getFounderName(startup);
                    const lastUpdated = getLastUpdatedTimestamp(startup);

                    return (
                        <motion.div
                            key={startup.startupId || startup.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 rounded-xl flex items-center justify-center border border-[#8B5CF6]/20 shrink-0 mt-1">
                                        <Rocket className="text-[#8B5CF6]" size={24} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-white group-hover:text-[#8B5CF6] transition-colors leading-tight">
                                                {startup.startupName || 'Unnamed Venture'}
                                            </h3>
                                            {mentor && (
                                                <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded border border-purple-500/20">
                                                    Mentor
                                                </span>
                                            )}
                                            {isNewStartup(startup) && (
                                                <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded border border-blue-500/20">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Globe size={12} /> {startup.sector || 'Not provided'}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <User size={12} /> {founderName}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border bg-amber-500/10 border-amber-500/20 text-amber-400">
                                    {startup.stage || 'Unknown'}
                                </span>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        <span>Traction</span>
                                        {traction.hasAny ? (
                                            <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={10} /> Available</span>
                                        ) : (
                                            <span className="text-gray-500">No traction data</span>
                                        )}
                                    </div>
                                    {traction.hasAny && (
                                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-300">
                                            <span>Users: {traction.users ?? 'N/A'}</span>
                                            <span>Growth: {traction.growth || 'N/A'}</span>
                                            <span className="col-span-2">Revenue: {traction.revenue || 'N/A'}</span>
                                        </div>
                                    )}
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${executionScore}%` }}
                                            className="h-full bg-[#8B5CF6]"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        <span>Execution Score</span>
                                        <span>{executionScore}%</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Clock size={12} /> Last Updated</span>
                                    <span>{formatLastUpdated(lastUpdated)}</span>
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
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredStartups.length === 0 && (
                <div className="p-6 bg-[#1E1E2F] rounded-2xl border border-white/5 text-sm text-gray-400">
                    No startups match your current search and filters.
                </div>
            )}

            <AnimatePresence>
                {selectedStartup && (() => {
                    const mentor = getMentor(selectedStartup);
                    const founderName = getFounderName(selectedStartup);
                    const coFounderNames = getCoFounderNames(selectedStartup);
                    const executionScore = calculateExecutionScore(selectedStartup);
                    const milestones = selectedStartup.milestones || [];
                    const completedMilestones = milestones.filter(m => m.status === 'completed');
                    const roadmapProgress = getRoadmapProgress(selectedStartup);
                    const traction = getTractionData(selectedStartup);
                    const docs = selectedStartup.documents || [];
                    const activities = [...(selectedStartup.activity || [])]
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 15);

                    return (
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
                                className="fixed right-0 top-0 h-full w-full md:w-[700px] bg-[#1E1E2F] border-l border-white/10 z-[110] shadow-2xl overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-[#1E1E2F]/90 backdrop-blur-xl p-6 border-b border-white/5 flex justify-between items-center z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
                                            <Rocket className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white tracking-tight">{selectedStartup.startupName || 'Unnamed Venture'}</h2>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <MapPin size={12} /> {selectedStartup.location || 'Location not provided'}
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

                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#8B5CF6]">Basic Info</h3>
                                            <p className="text-sm text-gray-300">Startup: <span className="text-white font-bold">{selectedStartup.startupName || 'Not provided'}</span></p>
                                            <p className="text-sm text-gray-300">Sector: <span className="text-white font-bold">{selectedStartup.sector || 'Not provided'}</span></p>
                                            <p className="text-sm text-gray-300">Stage: <span className="text-white font-bold">{selectedStartup.stage || 'Not provided'}</span></p>
                                            <p className="text-sm text-gray-300">Founder: <span className="text-white font-bold">{founderName}</span></p>
                                            <p className="text-sm text-gray-300">Team Size: <span className="text-white font-bold">{selectedStartup.teamSize || (1 + (selectedStartup.coFounders || []).length)}</span></p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#8B5CF6]">Execution Data</h3>
                                            <p className="text-sm text-gray-300">Execution Score: <span className="text-white font-bold">{executionScore}%</span></p>
                                            <p className="text-sm text-gray-300">Milestones: <span className="text-white font-bold">{milestones.length}</span></p>
                                            <p className="text-sm text-gray-300">Completed: <span className="text-white font-bold">{completedMilestones.length}</span></p>
                                            <p className="text-sm text-gray-300">Roadmap Progress: <span className="text-white font-bold">{roadmapProgress}%</span></p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                                <Target size={14} /> Problem Statement
                                            </h3>
                                            <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                                {selectedStartup.problemStatement || 'Not provided'}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                                <Zap size={14} /> Solution / Mission
                                            </h3>
                                            <p className="text-sm text-gray-300 leading-relaxed bg-[#8B5CF6]/5 p-4 rounded-xl border border-[#8B5CF6]/10">
                                                {selectedStartup.solutionOverview || selectedStartup.oneLiner || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Users</p>
                                            <p className="text-white font-bold">{traction.users ?? 'Not provided'}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Growth</p>
                                            <p className="text-white font-bold">{traction.growth || 'Not provided'}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Revenue</p>
                                            <p className="text-white font-bold">{traction.revenue || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <UsersIcon size={16} /> Team
                                        </h3>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 text-sm text-gray-300">
                                            <p>Founder: <span className="text-white font-bold">{founderName}</span></p>
                                            <p>Co-Founders: <span className="text-white font-bold">{coFounderNames.length ? coFounderNames.join(', ') : 'None'}</span></p>
                                            <p>Mentor: <span className="text-white font-bold">{mentor?.name || mentor?.email?.split('@')[0] || 'Not assigned'}</span></p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Milestone size={16} /> Milestones
                                        </h3>
                                        {milestones.length > 0 ? (
                                            <div className="space-y-2">
                                                {milestones.map((ms, idx) => (
                                                    <div key={ms.id || idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                        <span className="text-sm text-gray-300 font-medium">{ms.title || 'Untitled milestone'}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${ms.status === 'completed' ? 'text-emerald-400' : ms.status === 'in-progress' ? 'text-blue-400' : 'text-gray-500'}`}>
                                                            {ms.status || 'pending'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">No milestones defined yet.</p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <FileText size={16} /> Documents & Links
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedStartup.pitchDeckLink && (
                                                <a href={selectedStartup.pitchDeckLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xs font-bold text-white">
                                                    <FileText size={16} className="text-rose-400" /> Pitch Deck Link
                                                </a>
                                            )}
                                            {selectedStartup.demoLink && (
                                                <a href={selectedStartup.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xs font-bold text-white">
                                                    <Globe size={16} className="text-blue-400" /> Demo Link
                                                </a>
                                            )}
                                            {docs.map((doc, idx) => (
                                                <div key={`${doc.name || 'doc'}-${idx}`} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-white font-bold">
                                                    <span className="truncate">{doc.name || 'Document'}</span>
                                                    <span className="text-gray-500">{doc.size || 'Unknown size'}</span>
                                                </div>
                                            ))}
                                            {!selectedStartup.pitchDeckLink && !selectedStartup.demoLink && docs.length === 0 && (
                                                <p className="text-xs text-gray-500 italic">No documents or links provided.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Shield size={16} /> Activity Feed
                                        </h3>
                                        {activities.length > 0 ? (
                                            <div className="space-y-2">
                                                {activities.map((act, idx) => (
                                                    <div key={act.id || idx} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                                        <p className="text-sm text-gray-300">{act.message || 'Activity update'}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                                            {act.timestamp ? new Date(act.timestamp).toLocaleString() : 'No timestamp'}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">No activity updates yet.</p>
                                        )}
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            onClick={() => setSelectedStartup(null)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-rose-500/10 text-sm font-black uppercase tracking-widest text-gray-300 hover:text-rose-400 rounded-2xl border border-white/10 hover:border-rose-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={18} /> Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    );
                })()}
            </AnimatePresence>

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
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Manual Startup Onboarding</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Optional incubator intake</p>
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
                                        <input
                                            required
                                            value={onboardData.sector}
                                            onChange={(e) => setOnboardData({ ...onboardData, sector: e.target.value })}
                                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                            placeholder="e.g. Fintech"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Current Stage</label>
                                        <input
                                            required
                                            value={onboardData.stage}
                                            onChange={(e) => setOnboardData({ ...onboardData, stage: e.target.value })}
                                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                            placeholder="e.g. Validation"
                                        />
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
                                    Add to Pipeline
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
