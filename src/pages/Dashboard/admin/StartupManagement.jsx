
import React, { useEffect, useMemo, useState } from 'react';
import {
    Rocket,
    Search,
    CheckCircle2,
    AlertTriangle,
    Flag,
    Star,
    TrendingUp,
    Users,
    DollarSign
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const StartupManagement = () => {
    const [systemData, setSystemData] = useState(() => getSystem());
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('all');

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const startups = useMemo(() => {
        const users = systemData.users || {};
        return (systemData.startups || [])
            .map((startup, index) => {
                const founder = users[startup.founderId] || users[startup.uid] || {};
                const completion = Number(
                    startup.profileCompletion || startup.completion ||
                    (startup.description ? 40 : 10) +
                    (startup.pitch ? 20 : 0) +
                    (startup.sector ? 15 : 0) +
                    (startup.stage ? 15 : 0) +
                    ((startup.teamSize || 1) > 1 ? 10 : 0)
                );
                return {
                    id: startup.id || startup.uid || startup.startupId || `startup-${index}`,
                    startupName: startup.startupName || startup.name || 'Unnamed Startup',
                    founderName: founder.name || startup.founderName || startup.founder || 'Unknown Founder',
                    stage: startup.stage || 'Idea',
                    traction: startup.traction || `${startup.activeUsers || 0} active users`,
                    revenue: startup.revenue || '$0',
                    completion: Math.min(100, Math.max(0, completion)),
                    verified: Boolean(startup.verified),
                    featured: Boolean(startup.featured),
                    flagged: Boolean(startup.flagged),
                };
            })
            .filter((startup) => {
                const q = searchQuery.toLowerCase();
                const matchesSearch = !q ||
                    startup.startupName.toLowerCase().includes(q) ||
                    startup.founderName.toLowerCase().includes(q);
                const matchesMode =
                    viewMode === 'all' ||
                    (viewMode === 'pending' && !startup.verified) ||
                    (viewMode === 'featured' && startup.featured);
                return matchesSearch && matchesMode;
            });
    }, [searchQuery, systemData, viewMode]);

    const updateStartup = (id, updater) => {
        const sys = getSystem();
        const next = (sys.startups || []).map((startup, index) => {
            const startupId = startup.id || startup.uid || startup.startupId || `startup-${index}`;
            if (startupId !== id) return startup;
            return updater(startup);
        });
        sys.startups = next;
        saveSystem(sys);
        setSystemData(getSystem());
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Startup Management</h1>
                <p className="text-gray-400">Review and verify startup profiles across the ecosystem</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search startups..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1E1E2F] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('pending')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            viewMode === 'pending'
                                ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20'
                                : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        Pending Verification ({(systemData.startups || []).filter(s => !s.verified).length})
                    </button>
                    <button
                        onClick={() => setViewMode('featured')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            viewMode === 'featured'
                                ? 'bg-white/15 text-white border-white/20'
                                : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        Featured Startups
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            viewMode === 'all'
                                ? 'bg-white/15 text-white border-white/20'
                                : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {startups.length === 0 && (
                    <div className="col-span-full bg-[#1E1E2F] p-10 rounded-2xl border border-white/5 text-center text-gray-500">
                        No startups found for this filter.
                    </div>
                )}
                {startups.map((startup) => (
                    <div key={startup.id} className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            {startup.verified ? (
                                <div title="Verified Profile" className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                    <CheckCircle2 size={16} />
                                </div>
                            ) : (
                                <div title="Unverified" className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                                    <AlertTriangle size={16} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-indigo-500/20 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{startup.startupName}</h3>
                                <p className="text-sm text-gray-400">by {startup.founderName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                                    <TrendingUp size={10} /> Stage
                                </div>
                                <p className="text-sm font-bold text-white">{startup.stage}</p>
                            </div>
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                                    <DollarSign size={10} /> Revenue
                                </div>
                                <p className="text-sm font-bold text-white">{startup.revenue}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs text-gray-400 font-medium">Profile Completion</span>
                                    <span className="text-xs text-[#8B5CF6] font-bold">{startup.completion}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-indigo-500 rounded-full"
                                        style={{ width: `${startup.completion}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users size={14} className="text-[#8B5CF6]" />
                                <span className="font-medium text-gray-300">{startup.traction}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-white/5">
                            {!startup.verified ? (
                                <button
                                    onClick={() => updateStartup(startup.id, s => ({ ...s, verified: true }))}
                                    className="flex-1 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-lg transition-all"
                                >
                                    Approve
                                </button>
                            ) : (
                                <button
                                    onClick={() => updateStartup(startup.id, s => ({ ...s, featured: !s.featured }))}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Star size={12} className="text-yellow-400" /> Feature
                                </button>
                            )}
                            <button
                                onClick={() => updateStartup(startup.id, s => ({ ...s, flagged: false }))}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all"
                            >
                                Clear Flag
                            </button>
                            <button
                                onClick={() => updateStartup(startup.id, s => ({ ...s, flagged: !s.flagged }))}
                                className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                title={startup.flagged ? 'Remove Flag' : 'Flag Startup'}
                            >
                                <Flag size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StartupManagement;
