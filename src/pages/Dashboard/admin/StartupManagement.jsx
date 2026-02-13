
import React from 'react';
import {
    Rocket,
    Search,
    Filter,
    CheckCircle2,
    AlertTriangle,
    Flag,
    Star,
    ExternalLink,
    TrendingUp,
    Users,
    DollarSign
} from 'lucide-react';

const StartupManagement = () => {
    const startups = [
        { id: 1, name: 'PayFlow', founder: 'Alex Thompson', stage: 'Seed', traction: '10k+ MAU', revenue: '$5k/mo', completion: 95, verified: true },
        { id: 2, name: 'Vision AI', founder: 'Sarah Chen', stage: 'Pre-Seed', traction: 'Beta testing', revenue: '$0', completion: 82, verified: true },
        { id: 3, name: 'EcoGrid', founder: 'Elena Rodriguez', stage: 'Series A', traction: '50 Enterprise clients', revenue: '$45k/mo', completion: 100, verified: true },
        { id: 4, name: 'HealthSync', founder: 'Michael Ross', stage: 'Seed', traction: 'Partnering with 3 hospitals', revenue: '$12k/mo', completion: 60, verified: false },
        { id: 5, name: 'LogiLink', founder: 'David Miller', stage: 'Idea', traction: 'MVP complete', revenue: '$0', completion: 45, verified: false },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Startup Management</h1>
                <p className="text-gray-400">Review and verify startup profiles across the ecosystem</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search startups..."
                            className="bg-[#1E1E2F] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50"
                        />
                    </div>
                    <button className="px-4 py-2 bg-[#1E1E2F] border border-white/5 rounded-xl text-sm font-medium hover:bg-white/5 transition-all flex items-center gap-2">
                        <Filter size={16} /> Filters
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 rounded-xl text-sm font-bold hover:bg-[#8B5CF6]/20 transition-all">
                        Pending Verification (12)
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/5">
                        Featured Startups
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {startups.map((startup, index) => (
                    <div key={index} className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-300 group relative overflow-hidden">
                        {/* Status Badge */}
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
                                <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{startup.name}</h3>
                                <p className="text-sm text-gray-400">by {startup.founder}</p>
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
                                <button className="flex-1 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-lg transition-all">
                                    Approve
                                </button>
                            ) : (
                                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                                    <Star size={12} className="text-yellow-400" /> Feature
                                </button>
                            )}
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all">
                                View Full
                            </button>
                            <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all border border-transparent hover:border-red-500/20">
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
