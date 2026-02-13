
import React from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Rocket,
    Briefcase,
    Building,
    ArrowUpRight,
    ArrowDownRight,
    Target
} from 'lucide-react';

const AdminAnalytics = () => {
    const metrics = [
        { label: 'User Retention', value: '78.4%', trend: '+2.1%', up: true },
        { label: 'Founder Growth', value: '12%', trend: '+0.5%', up: true },
        { label: 'Mentor Match Rate', value: '64%', trend: '-1.4%', up: false },
        { label: 'Funding Facilitated', value: '$2.4M', trend: '+15%', up: true },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
                    <p className="text-gray-400">Holistic performance tracking across all user segments</p>
                </div>
                <div className="flex gap-2 bg-[#1E1E2F] p-1 rounded-xl border border-white/5">
                    {['30D', '90D', '1Y', 'ALL'].map(t => (
                        <button key={t} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${t === '30D' ? 'bg-[#8B5CF6] text-white' : 'text-gray-500 hover:text-white'
                            }`}>{t}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{m.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-white">{m.value}</h3>
                            <div className={`flex items-center gap-1 text-xs font-bold ${m.up ? 'text-green-400' : 'text-red-400'}`}>
                                {m.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {m.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-bold text-white">Role Distribution</h3>
                        <PieChart className="text-gray-500" size={20} />
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Founders', count: 8245, color: '#8B5CF6', pct: 65 },
                            { name: 'Mentors', count: 1120, color: '#10B981', pct: 15 },
                            { name: 'Incubators', count: 45, color: '#F59E0B', pct: 5 },
                            { name: 'Co-Founders', count: 3072, color: '#3B82F6', pct: 25 },
                        ].map((role, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300 font-medium">{role.name}</span>
                                    <span className="text-white font-bold">{role.count} <span className="text-gray-500 text-xs">({role.pct}%)</span></span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${role.pct}%`, backgroundColor: role.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sector Distribution */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-bold text-white">Sector Activity</h3>
                        <Target className="text-gray-500" size={20} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'FinTech', size: 'w-32 h-32', pct: 40 },
                            { name: 'AI/ML', size: 'w-28 h-28', pct: 30 },
                            { name: 'SaaS', size: 'w-24 h-24', pct: 20 },
                            { name: 'HealthTech', size: 'w-20 h-20', pct: 10 },
                            { name: 'EdTech', size: 'w-24 h-24', pct: 15 },
                            { name: 'Web3', size: 'w-20 h-20', pct: 8 },
                        ].map((sector, idx) => (
                            <div key={idx} className={`bg-gradient-to-br from-[#8B5CF6]/20 to-indigo-500/20 rounded-2xl border border-[#8B5CF6]/30 flex flex-col items-center justify-center p-4 transition-all hover:scale-105 cursor-pointer`}>
                                <span className="text-xs font-bold text-white mb-1">{sector.name}</span>
                                <span className="text-[10px] text-[#8B5CF6] font-black">{sector.pct}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-black/20 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-500 italic">
                            Sector distribution is calculated based on active startup profiles and verified mentor expertise.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
