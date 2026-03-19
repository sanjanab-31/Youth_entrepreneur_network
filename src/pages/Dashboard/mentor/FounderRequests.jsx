
import React, { useState, useMemo } from 'react';
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
    ArrowRight,
    Target,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMentor } from '../../../context/MentorContext';
import { getSystem } from '../../../utils/system';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Given a raw request (IDs only), hydrate it with live startup + founder data
 * fetched from the in-memory system state every render.
 */
const hydrateRequest = (request) => {
    const system = getSystem();
    const allStartups = system.startups || [];
    const allUsers = system.users || {};

    const startup = allStartups.find(s => s.startupId === request.startupId) || null;
    const founder = startup ? allUsers[startup.founderId] : null;

    return {
        ...request,
        // Relational data — always fresh
        startup,
        founderName: founder?.name || founder?.email?.split('@')[0] || 'Unknown Founder',
        // Convenience aliases for quick display
        startupName: startup?.startupName || '—',
        stage: startup?.stage || '—',
        sector: startup?.sector || '—',
        traction: startup?.traction || null,
        executionScore: startup?.executionScore ?? null,
        problemStatement: startup?.problemStatement || null,
        solutionOverview: startup?.solutionOverview || null,
        milestones: Array.isArray(startup?.milestones) ? startup.milestones : [],
        fundingGoal: startup?.fundingGoal || null,
        teamSize: startup?.teamSize ?? null,
    };
};

// ─── RequestCard ──────────────────────────────────────────────────────────────

const RequestCard = ({ hydrated, onAccept, onDecline, onViewProfile }) => {
    const completedMilestones = hydrated.milestones.filter(m => m.status === 'completed').length;

    return (
        <motion.div
            layout
            className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group flex flex-col"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] font-black text-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        {hydrated.startupName?.[0] || '?'}
                    </div>
                    <div>
                        <h4 className="text-white font-bold group-hover:text-[#8B5CF6] transition-colors">
                            {hydrated.founderName}
                        </h4>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                            {hydrated.startupName}
                            {hydrated.stage !== '—' && (
                                <> • <span className="text-[#8B5CF6]">{hydrated.stage}</span></>
                            )}
                        </p>
                    </div>
                </div>
                {hydrated.executionScore !== null && (
                    <div className="text-right">
                        <p className="text-[9px] text-gray-600 font-black uppercase">Exec Score</p>
                        <p className={`text-sm font-black ${hydrated.executionScore >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {hydrated.executionScore}%
                        </p>
                    </div>
                )}
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-black mb-1 uppercase">Sector</p>
                    <p className="text-xs font-bold text-white truncate">{hydrated.sector}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-black mb-1 uppercase">Milestones</p>
                    <p className="text-xs font-bold text-white">
                        {hydrated.milestones.length === 0
                            ? <span className="text-gray-600 italic">None yet</span>
                            : <>{completedMilestones}/{hydrated.milestones.length} done</>
                        }
                    </p>
                </div>
            </div>

            {/* Traction */}
            <div className="mb-4">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Traction</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">
                    {hydrated.traction || <span className="italic text-gray-600">No traction data added yet.</span>}
                </p>
            </div>

            {/* Problem Summary */}
            <div className="mb-6">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Problem</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">
                    {hydrated.problemStatement || <span className="italic text-gray-600">No problem statement added yet.</span>}
                </p>
            </div>

            {/* Message from founder */}
            {hydrated.message && (
                <div className="mb-5 p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">
                    <p className="text-[10px] text-[#8B5CF6] font-black uppercase mb-1">Founder's Message</p>
                    <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-3">"{hydrated.message}"</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto">
                <div className="flex gap-2">
                    <button
                        onClick={() => onAccept(hydrated.id)}
                        className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => onDecline(hydrated.id)}
                        className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10"
                    >
                        Decline
                    </button>
                </div>
                <button
                    onClick={() => onViewProfile(hydrated)}
                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-[#8B5CF6] hover:text-[#7C3AED] transition-all flex items-center justify-center gap-2"
                >
                    View Full Startup Profile <ExternalLink size={12} />
                </button>
            </div>
        </motion.div>
    );
};

// ─── StartupDetailModal ───────────────────────────────────────────────────────

const StartupDetailModal = ({ hydrated, onClose, onAccept, onDecline }) => {
    if (!hydrated) return null;

    const completedMilestones = hydrated.milestones.filter(m => m.status === 'completed');
    const pendingMilestones = hydrated.milestones.filter(m => m.status !== 'completed');

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
                className="bg-[#1E1E2F] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
            >
                {/* Modal Header */}
                <div className="sticky top-0 p-8 border-b border-white/5 bg-[#1E1E2F]/95 backdrop-blur-md flex justify-between items-start z-10">
                    <div className="flex gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-xl flex-shrink-0">
                            {hydrated.startupName?.[0] || '?'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-black text-white">{hydrated.startupName}</h2>
                                {hydrated.stage !== '—' && (
                                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                                        {hydrated.stage}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 font-medium">
                                {hydrated.founderName} • Founder
                                {hydrated.sector !== '—' && <> · <span className="text-[#8B5CF6]">{hydrated.sector}</span></>}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-xl transition-all flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Problem Statement */}
                        <section>
                            <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Brain size={14} /> Problem Statement
                            </h3>
                            {hydrated.problemStatement ? (
                                <p className="text-gray-300 font-medium leading-relaxed">{hydrated.problemStatement}</p>
                            ) : (
                                <p className="text-gray-600 italic text-sm">No problem statement added yet.</p>
                            )}
                        </section>

                        {/* Solution Overview */}
                        <section>
                            <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} /> Solution Overview
                            </h3>
                            {hydrated.solutionOverview ? (
                                <p className="text-gray-300 font-medium leading-relaxed">{hydrated.solutionOverview}</p>
                            ) : (
                                <p className="text-gray-600 italic text-sm">No solution overview added yet.</p>
                            )}
                        </section>

                        {/* Milestones */}
                        <section>
                            <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingUp size={14} /> Milestones ({hydrated.milestones.length})
                            </h3>
                            {hydrated.milestones.length === 0 ? (
                                <p className="text-gray-600 italic text-sm">No milestones created yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {completedMilestones.map((m, i) => (
                                        <div key={m.id || i} className="flex items-center gap-4 p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                                                <Check size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-300">{m.title}</span>
                                        </div>
                                    ))}
                                    {pendingMilestones.map((m, i) => (
                                        <div key={m.id || i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-500 flex-shrink-0">
                                                <Clock size={12} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-500">{m.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Founder's Message */}
                        {hydrated.message && (
                            <section>
                                <h3 className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Target size={14} /> Founder's Message
                                </h3>
                                <div className="p-5 bg-[#8B5CF6]/5 rounded-2xl border border-[#8B5CF6]/10">
                                    <p className="text-gray-300 italic leading-relaxed">"{hydrated.message}"</p>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column — Metrics */}
                    <div className="space-y-6">
                        {/* Traction */}
                        <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Traction</h4>
                            {hydrated.traction ? (
                                <p className="text-sm font-bold text-white leading-relaxed">{hydrated.traction}</p>
                            ) : (
                                <p className="text-gray-600 italic text-xs">No traction data added yet.</p>
                            )}
                        </div>

                        {/* Key Metrics */}
                        <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5 space-y-5">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Key Metrics</h4>

                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Funding Goal</p>
                                {hydrated.fundingGoal ? (
                                    <p className="text-lg font-black text-[#8B5CF6]">{hydrated.fundingGoal}</p>
                                ) : (
                                    <p className="text-gray-600 italic text-xs">Not set</p>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Execution Score</p>
                                {hydrated.executionScore !== null ? (
                                    <p className={`text-lg font-black ${hydrated.executionScore >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {hydrated.executionScore}%
                                    </p>
                                ) : (
                                    <p className="text-gray-600 italic text-xs">Not calculated</p>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Team Size</p>
                                <p className="text-sm font-black text-white">
                                    {hydrated.teamSize ? `${hydrated.teamSize} members` : <span className="text-gray-600 italic text-xs">Not set</span>}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Milestones</p>
                                <p className="text-sm font-black text-white">
                                    {hydrated.milestones.length === 0
                                        ? <span className="text-gray-600 italic text-xs">None yet</span>
                                        : <>{completedMilestones.length}/{hydrated.milestones.length} completed</>
                                    }
                                </p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => { onAccept(hydrated.id); onClose(); }}
                                className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={16} /> Accept Mentorship
                            </button>
                            <button
                                onClick={() => { onDecline(hydrated.id); onClose(); }}
                                className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10"
                            >
                                Decline Request
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── FounderRequests ──────────────────────────────────────────────────────────

const FounderRequests = () => {
    const { requests, acceptRequest, declineRequest } = useMentor();
    const [selectedHydrated, setSelectedHydrated] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // pending | accepted | declined

    // Hydrate all requests with live startup data on every render
    const hydratedRequests = useMemo(() => {
        return requests.map(hydrateRequest);
    }, [requests]);

    const filtered = useMemo(() => {
        return hydratedRequests.filter(r => {
            const matchesTab = r.status === activeTab;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q ||
                r.startupName.toLowerCase().includes(q) ||
                r.founderName.toLowerCase().includes(q) ||
                r.sector.toLowerCase().includes(q);
            return matchesTab && matchesSearch;
        });
    }, [hydratedRequests, activeTab, searchQuery]);

    const counts = useMemo(() => ({
        pending: hydratedRequests.filter(r => r.status === 'pending').length,
        accepted: hydratedRequests.filter(r => r.status === 'accepted').length,
        declined: hydratedRequests.filter(r => r.status === 'declined').length,
    }), [hydratedRequests]);

    const handleAccept = (id) => {
        acceptRequest(id);
        setSelectedHydrated(null);
    };

    const handleDecline = (id) => {
        declineRequest(id);
        setSelectedHydrated(null);
    };

    const tabs = [
        { key: 'pending', label: 'Pending', color: 'yellow' },
        { key: 'accepted', label: 'Accepted', color: 'green' },
        { key: 'declined', label: 'Declined', color: 'red' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Founder <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Requests</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Evaluate and select high-potential founders to guide.</p>
            </div>

            {/* Search + Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 min-w-[260px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by startup, founder, or sector..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-[#1E1E2F] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#8B5CF6]/50 transition-all placeholder:text-gray-600 shadow-xl shadow-black/20"
                    />
                </div>

                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.key
                                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                                : 'bg-[#1E1E2F] border border-white/5 text-gray-500 hover:text-white'
                                }`}
                        >
                            {tab.label}
                            {counts[tab.key] > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                                    {counts[tab.key]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Request Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <Users className="mx-auto text-gray-700 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-500">
                            {activeTab === 'pending' ? 'No pending requests' : `No ${activeTab} requests`}
                        </h3>
                        <p className="text-gray-600 mt-1">
                            {activeTab === 'pending'
                                ? 'Check back later for new mentorship opportunities.'
                                : `Requests you've ${activeTab} will appear here.`}
                        </p>
                    </div>
                ) : (
                    filtered.map((hydrated) => (
                        activeTab === 'pending' ? (
                            <RequestCard
                                key={hydrated.id}
                                hydrated={hydrated}
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                                onViewProfile={setSelectedHydrated}
                            />
                        ) : (
                            // Accepted / Declined — read-only card
                            <motion.div
                                key={hydrated.id}
                                layout
                                className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 flex flex-col gap-4"
                            >
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] font-black text-lg flex-shrink-0">
                                        {hydrated.startupName?.[0] || '?'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold">{hydrated.founderName}</h4>
                                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                            {hydrated.startupName}
                                            {hydrated.stage !== '—' && <> · <span className="text-[#8B5CF6]">{hydrated.stage}</span></>}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${hydrated.status === 'accepted'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {hydrated.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Sector</p>
                                        <p className="text-xs font-bold text-white truncate">{hydrated.sector}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Milestones</p>
                                        <p className="text-xs font-bold text-white">
                                            {hydrated.milestones.length === 0
                                                ? <span className="text-gray-600 italic">None</span>
                                                : <>{hydrated.milestones.filter(m => m.status === 'completed').length}/{hydrated.milestones.length}</>
                                            }
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedHydrated(hydrated)}
                                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-[#8B5CF6] hover:text-[#7C3AED] transition-all flex items-center justify-center gap-2 border border-[#8B5CF6]/20 rounded-xl hover:bg-[#8B5CF6]/5"
                                >
                                    View Startup <ExternalLink size={12} />
                                </button>
                            </motion.div>
                        )
                    ))
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedHydrated && (
                    <StartupDetailModal
                        hydrated={selectedHydrated}
                        onClose={() => setSelectedHydrated(null)}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FounderRequests;
