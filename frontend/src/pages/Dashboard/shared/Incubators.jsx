import React, { useEffect, useMemo, useState } from 'react';
import {
    MapPin,
    Calendar,
    TrendingUp,
    Search,
    Filter,
    ChevronRight,
    Globe,
    Zap,
    X,
    Shield,
    CheckCircle2,
    RefreshCw,
    Target,
    Users,
    Clock,
    AlertCircle,
    Layers,
    CircleDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { createApplication, fetchApplications } from '../../../utils/applicationsApi';
import { fetchCohorts } from '../../../utils/cohortsApi';
import { fetchIncubators } from '../../../utils/incubatorsApi';

const normalizeToArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        return value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
    }
    if (!value) return [];
    return [String(value)];
};

const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date : null;
};

const formatDate = (value) => {
    const date = parseDate(value);
    return date ? date.toLocaleDateString() : 'TBD';
};

const getCohortStatus = (cohort) => {
    const now = new Date();
    const start = parseDate(cohort?.startDate);
    const end = parseDate(cohort?.endDate);

    if (start && end) {
        if (now < start) return 'upcoming';
        if (now > end) return 'completed';
        return 'active';
    }

    if (cohort?.status === 'active' || cohort?.status === 'completed' || cohort?.status === 'upcoming') {
        return cohort.status;
    }

    return 'upcoming';
};

const getCohortCurrentCapacity = (cohort, applications) => {
    const directCapacity = Array.isArray(cohort?.startupIds) ? cohort.startupIds.length : 0;
    if (directCapacity > 0) return directCapacity;

    return applications.filter(app => app.status === 'accepted' && app.cohortId === cohort.id).length;
};

const Incubators = () => {
    const { user } = useAuth();
    const { startup, allStartups } = useStartup();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyLoadingId, setApplyLoadingId] = useState(null);
    const [systemState, setSystemState] = useState({
        incubators: [],
        cohorts: [],
        applications: []
    });
    const [selectedIncubator, setSelectedIncubator] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        sector: 'All',
        stages: [],
        location: 'All',
        verifiedOnly: false
    });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        const refreshData = async () => {
            setLoading(true);
            setError('');
            try {
                const [incubators, cohorts, applications] = await Promise.all([
                    fetchIncubators(),
                    fetchCohorts(),
                    fetchApplications()
                ]);
                setSystemState({
                    incubators,
                    cohorts,
                    applications
                });
            } catch (error) {
                setError(error.response?.data?.error || 'Error loading incubator discovery data');
            } finally {
                setLoading(false);
            }
        };

        queueMicrotask(() => {
            void refreshData();
        });
        const handleStorage = () => {
            void refreshData();
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const currentStartup = useMemo(() => {
        if (!user) return null;

        if (startup?.startupId) {
            const fromSystem = (allStartups || []).find(s => s.startupId === startup.startupId);
            if (fromSystem) return fromSystem;
        }

        if (user.role === 'founder') {
            return (allStartups || []).find(s => s.founderId === user.uid) || null;
        }

        if (['co-founder', 'cofounder'].includes(user.role)) {
            return (
                (allStartups || []).find(
                    s => Array.isArray(s.coFounders) && s.coFounders.includes(user.uid)
                ) || null
            );
        }

        return null;
    }, [allStartups, startup, user]);

    const myApplications = useMemo(() => {
        if (!currentStartup) return [];
        return systemState.applications.filter(app => app.startupId === currentStartup.startupId);
    }, [systemState.applications, currentStartup]);

    const activeApplicationsCount = useMemo(
        () => myApplications.filter(app => app.status === 'pending').length,
        [myApplications]
    );

    const incubatorCards = useMemo(() => {
        const founderSector = (currentStartup?.sector || '').toLowerCase();
        const founderStage = (currentStartup?.stage || '').toLowerCase();

        return (systemState.incubators || [])
            .map(incubator => {
                const incubatorId = incubator.id || incubator.uid || incubator.incubatorId;
                if (!incubatorId) return null;

                const incubatorCohorts = systemState.cohorts
                    .filter(cohort => cohort.incubatorId === incubatorId)
                    .map(cohort => ({ ...cohort, derivedStatus: getCohortStatus(cohort) }))
                    .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));

                const activeCohort = incubatorCohorts.find(cohort => cohort.derivedStatus === 'active') || null;
                const upcomingCohort = incubatorCohorts.find(cohort => cohort.derivedStatus === 'upcoming') || null;
                const pastCohorts = incubatorCohorts.filter(cohort => cohort.derivedStatus === 'completed');

                let batchTimeline = 'No active cohort';
                if (activeCohort) {
                    batchTimeline = `Batch Active (${formatDate(activeCohort.startDate)} - ${formatDate(activeCohort.endDate)})`;
                } else if (upcomingCohort) {
                    batchTimeline = `Next Batch Starts: ${formatDate(upcomingCohort.startDate)}`;
                }

                const sectorFocus = normalizeToArray(incubator.sectorFocus);
                const stagePreference = normalizeToArray(incubator.stagePreference || incubator.supportedStages);

                const sectorMatch = sectorFocus.some(s => s.toLowerCase() === founderSector);
                const stageMatch = stagePreference.some(s => s.toLowerCase() === founderStage);
                const matchScore = (sectorMatch ? 2 : 0) + (stageMatch ? 1 : 0);

                const relatedApplication = myApplications.find(app => app.incubatorId === incubatorId) || null;

                return {
                    ...incubator,
                    id: incubatorId,
                    name: incubator.name || incubator.incubatorName || 'Unnamed Incubator',
                    location: incubator.location || 'Unknown',
                    sectorFocus,
                    stagePreference,
                    cohorts: incubatorCohorts,
                    activeCohort,
                    upcomingCohort,
                    pastCohorts,
                    activeCapacity: activeCohort ? getCohortCurrentCapacity(activeCohort, systemState.applications) : 0,
                    batchTimeline,
                    successStats: incubator.successStats && Object.keys(incubator.successStats).length > 0 ? incubator.successStats : null,
                    verified: Boolean(incubator.verified),
                    description: incubator.description || '',
                    fundingSupport: Boolean(incubator.fundingSupport),
                    mentors: normalizeToArray(incubator.mentors),
                    relatedApplication,
                    matchScore,
                    isBestMatch: matchScore >= 2,
                    initials: (incubator.name || incubator.incubatorName || 'IN')
                        .split(' ')
                        .filter(Boolean)
                        .map(part => part[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                };
            })
            .filter(Boolean)
            .sort((a, b) => {
                if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                if (a.name && b.name) return a.name.localeCompare(b.name);
                return 0;
            });
    }, [systemState.incubators, systemState.cohorts, systemState.applications, myApplications, currentStartup]);

    const sectorOptions = useMemo(() => {
        const options = new Set(['All']);
        incubatorCards.forEach(card => card.sectorFocus.forEach(sector => options.add(sector)));
        return Array.from(options);
    }, [incubatorCards]);

    const stageOptions = useMemo(() => {
        const options = new Set();
        incubatorCards.forEach(card => card.stagePreference.forEach(stage => options.add(stage)));
        return Array.from(options);
    }, [incubatorCards]);

    const locationOptions = useMemo(() => {
        const options = new Set(['All']);
        incubatorCards.forEach(card => {
            if (card.location) options.add(card.location);
        });
        return Array.from(options);
    }, [incubatorCards]);

    const filteredIncubators = useMemo(() => {
        let result = [...incubatorCards];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(incubator => {
                const searchableSectors = incubator.sectorFocus.join(' ').toLowerCase();
                return (
                    incubator.name.toLowerCase().includes(query) ||
                    incubator.location.toLowerCase().includes(query) ||
                    searchableSectors.includes(query)
                );
            });
        }

        if (filters.sector !== 'All') {
            result = result.filter(incubator => incubator.sectorFocus.includes(filters.sector));
        }

        if (filters.stages.length > 0) {
            result = result.filter(incubator =>
                incubator.stagePreference.some(stage => filters.stages.includes(stage))
            );
        }

        if (filters.location !== 'All') {
            result = result.filter(incubator => incubator.location === filters.location);
        }

        if (filters.verifiedOnly) {
            result = result.filter(incubator => incubator.verified);
        }

        return result;
    }, [incubatorCards, filters, searchQuery]);

    const toggleStageFilter = (stage) => {
        setFilters(prev => ({
            ...prev,
            stages: prev.stages.includes(stage)
                ? prev.stages.filter(item => item !== stage)
                : [...prev.stages, stage]
        }));
    };

    const resetFilters = () => {
        setFilters({
            sector: 'All',
            stages: [],
            location: 'All',
            verifiedOnly: false
        });
        setSearchQuery('');
    };

    const handleApply = async (incubator) => {
        if (!currentStartup || !user) return;

        const existing = myApplications.find(app => app.incubatorId === incubator.id);
        if (existing) return;

        setApplyLoadingId(incubator.id);
        setError('');
        try {
            await createApplication({
                founderId: currentStartup.founderId || user.uid,
                startupId: currentStartup.startupId,
                incubatorId: incubator.id,
                startupName: currentStartup.startupName || 'Unnamed Startup',
                sector: currentStartup.sector || 'General',
                teamSize: Number(currentStartup.teamSize) || 1,
                status: 'pending',
                message: ''
            });

            const applications = await fetchApplications();
            setSystemState((prev) => ({ ...prev, applications }));
        } catch (applyError) {
            setError(applyError.response?.data?.error || 'Failed to apply to incubator');
        }
        setApplyLoadingId(null);
    };

    const getApplicationState = (incubator) => {
        const application = incubator.relatedApplication;
        if (!application) return { label: 'Apply', tone: 'action' };
        if (application.status === 'accepted') return { label: 'Accepted', tone: 'accepted' };
        if (application.status === 'rejected') return { label: 'Rejected', tone: 'rejected' };
        return { label: 'Applied', tone: 'pending' };
    };

    const isAccessRestricted = !['founder', 'co-founder', 'cofounder'].includes(user?.role);
    const canApply =
        user?.role === 'founder' ||
        (['co-founder', 'cofounder'].includes(user?.role) && startup?.coFounderPermissions?.applications);

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
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-2 md:px-0">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <span className="w-fit px-3 py-1 bg-blue-500/20 text-blue-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                            Growth Accelerators
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="text-gray-400 text-[10px] md:text-sm font-medium">Live Discovery</span>
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
                            <Filter size={20} className={isFilterMenuOpen ? 'text-blue-500' : 'text-gray-500'} />
                            <span className="text-sm">Filters</span>
                        </button>
                    </div>
                </div>

                {currentStartup && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1E1E2F] rounded-xl border border-white/5 self-start sm:self-auto">
                        <Target size={16} className="text-blue-500" />
                        <span className="text-xs md:text-sm font-bold text-white">{activeApplicationsCount} Active Applications</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Sector Focus</label>
                                <div className="flex flex-wrap gap-2">
                                    {sectorOptions.map((sector) => (
                                        <button
                                            key={sector}
                                            onClick={() => setFilters(prev => ({ ...prev, sector }))}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${filters.sector === sector
                                                ? 'bg-blue-500/20 border-blue-500/40 text-white'
                                                : 'bg-white/5 border-white/5 text-gray-600 hover:text-white'
                                                }`}
                                        >
                                            {sector}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Startup Stage</label>
                                <div className="space-y-3">
                                    {stageOptions.map((stage) => (
                                        <div
                                            key={stage}
                                            className="flex items-center gap-3 group cursor-pointer"
                                            onClick={() => toggleStageFilter(stage)}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.stages.includes(stage)
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-white/10 group-hover:border-blue-500/50'
                                                }`}>
                                                {filters.stages.includes(stage) && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${filters.stages.includes(stage) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                {stage}
                                            </span>
                                        </div>
                                    ))}
                                    {stageOptions.length === 0 && <p className="text-xs text-gray-500">No stage data available.</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Location</label>
                                <select
                                    value={filters.location}
                                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500/30 font-bold"
                                >
                                    {locationOptions.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-[10px] text-gray-500 font-black uppercase">Verified Only</span>
                                    <div
                                        onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
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
                        <h4 className="text-white font-bold text-sm mb-2">Relational Sync Active</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">Cohorts, applications, and startup relevance update in real time.</p>
                        <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                            <Zap size={10} fill="currentColor" /> Live Data
                        </div>
                    </div>
                </aside>

                <div className="lg:col-span-3 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm font-semibold">
                            {error}
                        </div>
                    )}
                    {filteredIncubators.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10 text-center">
                            <RefreshCw size={40} className="text-gray-600 mb-4 animate-spin-slow" />
                            <h3 className="text-xl font-bold text-white mb-2">No institutions match your criteria</h3>
                            <p className="text-gray-400 max-w-sm">Adjust filters to discover relevant incubator programs.</p>
                            <button
                                onClick={resetFilters}
                                className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        filteredIncubators.map((incubator) => {
                            const state = getApplicationState(incubator);
                            const disableApply = state.tone !== 'action' || !canApply || !currentStartup;

                            return (
                                <motion.div
                                    layout
                                    key={incubator.id}
                                    className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all relative overflow-hidden shadow-xl"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/2 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/5 transition-all" />

                                    {incubator.isBestMatch && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-md shadow-lg shadow-blue-600/20">
                                                Best Match
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                                                {incubator.initials}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                                            {incubator.name}
                                                        </h3>
                                                        {incubator.verified && <Shield size={16} className="text-blue-400" />}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> {incubator.location}</span>
                                                        <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-green-500" /> {incubator.sectorFocus.join(', ') || 'General'}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleApply(incubator)}
                                                    className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black border transition-all shadow-xl ${state.tone === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                        state.tone === 'rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                                            state.tone === 'pending' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
                                                                !canApply || !currentStartup ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-transparent' :
                                                                    'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                                                        }`}
                                                    disabled={disableApply || applyLoadingId === incubator.id}
                                                >
                                                    {state.tone === 'accepted' ? (
                                                        <>Accepted <CheckCircle2 size={18} /></>
                                                    ) : state.tone === 'rejected' ? (
                                                        <>Rejected <AlertCircle size={18} /></>
                                                    ) : state.tone === 'pending' ? (
                                                        <>Applied <Clock size={18} /></>
                                                    ) : applyLoadingId === incubator.id ? (
                                                        'Applying...'
                                                    ) : !currentStartup ? (
                                                        'No Startup Linked'
                                                    ) : !canApply ? (
                                                        'Access Locked'
                                                    ) : (
                                                        'Apply'
                                                    )}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                            <Calendar size={10} /> Batch Timeline
                                                        </p>
                                                        <p className="text-xs font-bold text-gray-300">{incubator.batchTimeline}</p>
                                                    </div>

                                                    {incubator.activeCohort && (
                                                        <div>
                                                            <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                                <Users size={10} /> Active Cohort
                                                            </p>
                                                            <p className="text-xs font-bold text-gray-300">
                                                                {incubator.activeCohort.name} ({formatDate(incubator.activeCohort.startDate)} - {formatDate(incubator.activeCohort.endDate)})
                                                            </p>
                                                            <p className="text-[10px] font-semibold text-blue-400 mt-1">
                                                                Capacity: {incubator.activeCapacity}/{Number(incubator.activeCohort.maxCapacity) || 20}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {incubator.successStats && (
                                                        <div>
                                                            <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                                <Target size={10} /> Success Metrics
                                                            </p>
                                                            <div className="text-xs font-bold text-gray-300 space-y-1">
                                                                {Object.entries(incubator.successStats).map(([key, value]) => (
                                                                    <p key={key}>{key}: {String(value)}</p>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col justify-end space-y-4">
                                                    <div>
                                                        <p className="text-[10px] text-gray-600 font-black uppercase mb-2 tracking-widest">Target Stages</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {incubator.stagePreference.map(stage => (
                                                                <span key={stage} className="px-3 py-1 bg-white/5 text-[10px] font-bold text-blue-400 rounded-lg border border-blue-500/10 transition-all">
                                                                    {stage}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setSelectedIncubator(incubator)}
                                                        className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2 hover:translate-x-1 transition-transform"
                                                    >
                                                        View Full Details <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                disabled={disableApply}
                                                onClick={() => handleApply(incubator)}
                                                className={`md:hidden mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black transition-all ${state.tone === 'accepted'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : state.tone === 'rejected'
                                                        ? 'bg-rose-500/20 text-rose-400'
                                                        : state.tone === 'pending'
                                                            ? 'bg-amber-500/20 text-amber-400'
                                                            : !currentStartup || !canApply
                                                                ? 'bg-gray-800 text-gray-500'
                                                                : 'bg-blue-600 text-white shadow-lg'
                                                    }`}
                                            >
                                                {applyLoadingId === incubator.id ? 'Applying...' : state.label}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

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
                            className="bg-[#1E1E2F] w-full h-full md:h-auto md:max-w-4xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl overflow-y-auto"
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
                                            <p className="text-gray-400 font-bold flex items-center gap-2">
                                                <MapPin size={16} className="text-blue-500" /> {selectedIncubator.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">About Institution</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {selectedIncubator.description || 'No description available.'}
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Sector Focus</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedIncubator.sectorFocus.map(sector => (
                                                <span key={sector} className="px-4 py-2 bg-blue-500/10 text-white text-xs font-bold rounded-xl border border-blue-500/20">
                                                    {sector}
                                                </span>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Stage Preference</h4>
                                        <div className="space-y-2">
                                            {selectedIncubator.stagePreference.map(stage => (
                                                <div key={stage} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                                                    <CircleDot size={12} className="text-blue-500" />
                                                    {stage}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Funding Support</h4>
                                        <p className="text-sm font-bold text-gray-300">
                                            {selectedIncubator.fundingSupport ? 'Available' : 'Not listed'}
                                        </p>
                                    </section>
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Cohorts</h4>
                                        <div className="space-y-3">
                                            {selectedIncubator.activeCohort ? (
                                                <div className="bg-[#0F0F14] p-4 rounded-2xl border border-emerald-500/20">
                                                    <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">Active Cohort</p>
                                                    <p className="text-sm font-bold text-white">{selectedIncubator.activeCohort.name}</p>
                                                    <p className="text-xs text-gray-400">{formatDate(selectedIncubator.activeCohort.startDate)} - {formatDate(selectedIncubator.activeCohort.endDate)}</p>
                                                    <p className="text-xs text-blue-400 mt-1">Capacity {selectedIncubator.activeCapacity}/{Number(selectedIncubator.activeCohort.maxCapacity) || 20}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-[#0F0F14] p-4 rounded-2xl border border-white/10">
                                                    <p className="text-sm font-bold text-gray-300">No active cohort</p>
                                                </div>
                                            )}

                                            {selectedIncubator.upcomingCohort && (
                                                <div className="bg-[#0F0F14] p-4 rounded-2xl border border-blue-500/20">
                                                    <p className="text-[10px] text-blue-400 font-black uppercase mb-1">Upcoming Cohort</p>
                                                    <p className="text-sm font-bold text-white">{selectedIncubator.upcomingCohort.name}</p>
                                                    <p className="text-xs text-gray-400">Starts {formatDate(selectedIncubator.upcomingCohort.startDate)}</p>
                                                </div>
                                            )}

                                            {selectedIncubator.pastCohorts.length > 0 && (
                                                <div className="bg-[#0F0F14] p-4 rounded-2xl border border-white/10">
                                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-2">Past Cohorts</p>
                                                    <div className="space-y-2">
                                                        {selectedIncubator.pastCohorts.map(cohort => (
                                                            <p key={cohort.id} className="text-xs text-gray-300">
                                                                {cohort.name} ({formatDate(cohort.startDate)} - {formatDate(cohort.endDate)})
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {selectedIncubator.mentors.length > 0 && (
                                        <section>
                                            <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Mentors</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedIncubator.mentors.map(mentor => (
                                                    <span key={mentor} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 font-semibold">
                                                        {mentor}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {selectedIncubator.successStats && (
                                        <section>
                                            <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">Success Stats</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries(selectedIncubator.successStats).map(([key, value]) => (
                                                    <div key={key} className="bg-[#0F0F14] p-4 rounded-xl border border-white/10">
                                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">{key}</p>
                                                        <p className="text-sm font-bold text-white">{String(value)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    <div className="pt-2">
                                        {(() => {
                                            const state = getApplicationState(selectedIncubator);
                                            const disabled = state.tone !== 'action' || !canApply || !currentStartup;

                                            return (
                                                <button
                                                    disabled={disabled}
                                                    onClick={() => handleApply(selectedIncubator)}
                                                    className={`w-full py-4 rounded-2xl font-black transition-all shadow-xl ${state.tone === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                                        state.tone === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                                                            state.tone === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                                !currentStartup || !canApply ? 'bg-gray-800 text-gray-500' :
                                                                    'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
                                                        }`}
                                                >
                                                    {applyLoadingId === selectedIncubator.id ? 'Applying...' : state.label}
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Incubators;
