import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Rocket,
    TrendingUp,
    DollarSign,
    PieChart,
    BarChart3,
    Activity,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Zap
} from 'lucide-react';

const Analytics = () => {
    const mainStats = [
        { label: 'Total Ecosystem Value', value: '₹14.2Cr', trend: '+18.4%', positive: true, icon: DollarSign },
        { label: 'Average Growth Rate', value: '24.5%', trend: '+4.2%', positive: true, icon: TrendingUp },
        { label: 'Funding Success Rate', value: '68%', trend: '-2.1%', positive: false, icon: Target },
        { label: 'Network Multiplier', value: '4.2x', trend: '+0.5x', positive: true, icon: Activity },
    ];

    const sectorData = [
        { label: 'FinTech', value: 35, color: '#8B5CF6' },
        { label: 'AI / ML', value: 28, color: '#7C3AED' },
        { label: 'HealthTech', value: 15, color: '#6366F1' },
        { label: 'SaaS', value: 12, color: '#4F46E5' },
        { label: 'Others', value: 10, color: '#312E81' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Ecosystem Analytics</h1>
                <p className="text-sm text-gray-400">Quantitative insights into incubator performance and startup traction</p>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#8B5CF6] group-hover:scale-110 transition-transform">
                                <stat.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sector Distribution */}
                <div className="lg:col-span-1 bg-[#1E1E2F] border border-white/5 rounded-3xl p-8 space-y-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                            <PieChart size={16} /> Sector Composition
                        </h3>
                    </div>

                    {/* Simple Donut Visualization */}
                    <div className="relative w-48 h-48 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                            {sectorData.map((d, i) => {
                                let offset = 0;
                                for (let j = 0; j < i; j++) offset += sectorData[j].value;
                                return (
                                    <circle
                                        key={i}
                                        cx="24"
                                        cy="24"
                                        r="18"
                                        fill="transparent"
                                        stroke={d.color}
                                        strokeWidth="4"
                                        strokeDasharray={`${d.value} ${100 - d.value}`}
                                        strokeDashoffset={-offset}
                                        className="transition-all duration-1000"
                                        viewBox="0 0 48 48"
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">42</span>
                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Startups</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sectorData.map((d, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs font-medium text-gray-300">{d.label}</span>
                                </div>
                                <span className="text-xs font-bold text-white">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cohort Performance Chart */}
                <div className="lg:col-span-2 bg-[#1E1E2F] border border-white/5 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                            <BarChart3 size={16} /> Cohort Growth Matrix
                        </h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-gray-400">Monthly</button>
                            <button className="px-3 py-1 bg-[#8B5CF6]/20 rounded-lg text-[10px] font-bold text-[#8B5CF6]">Yearly</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {[45, 62, 38, 85, 55, 72, 95].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="w-full relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ delay: i * 0.1, duration: 1 }}
                                        className="w-full bg-gradient-to-t from-[#8B5CF6]/20 to-[#8B5CF6] rounded-t-xl relative group-hover:to-[#7C3AED] transition-all"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}%
                                        </div>
                                    </motion.div>
                                </div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">B{2020 + i}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Retention</p>
                            <p className="text-lg font-bold text-white">92%</p>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Exit Rate</p>
                            <p className="text-lg font-bold text-white">12.5%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Avg Ticket</p>
                            <p className="text-lg font-bold text-white">₹45L</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geographic Impact */}
            <div className="bg-[#1E1E2F] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Globe size={180} className="text-[#8B5CF6]" />
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                            <Zap size={16} /> Geographic Presence
                        </h3>
                        <div className="space-y-4">
                            {[
                                { city: 'Bangalore, India', count: 18, growth: '+12%' },
                                { city: 'Singapore', count: 8, growth: '+5%' },
                                { city: 'Mumbai, India', count: 12, growth: '+22%' },
                                { city: 'London, UK', count: 4, growth: '+2%' },
                            ].map((loc, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold text-xs border border-[#8B5CF6]/20">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{loc.city}</p>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{loc.count} Active startups</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-400">{loc.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="p-8 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-3xl shadow-2xl shadow-[#8B5CF6]/20 group/card overflow-hidden relative">
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover/card:scale-150 transition-transform duration-700" />
                            <h4 className="text-lg font-black uppercase tracking-[0.2em] text-white/70 mb-2">Total Funding Facilitated</h4>
                            <p className="text-5xl font-black text-white mb-6">₹52.4Cr</p>
                            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors">
                                View Funding Log <ArrowUpRight size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Avg Valuation</p>
                                <p className="text-xl font-bold text-white">₹8.5Cr</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Active Mentors</p>
                                <p className="text-xl font-bold text-white">124</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
