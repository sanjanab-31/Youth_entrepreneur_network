import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    FileText,
    Layers,
    Star,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    MapPin,
    Briefcase,
    Globe,
    ExternalLink,
    Clock,
    CheckCircle2
} from 'lucide-react';

const IncubatorDashboard = () => {
    const stats = [
        { label: 'Total Startups in Pipeline', value: '124', icon: Users, trend: '+12% this month', color: 'from-blue-500 to-cyan-500' },
        { label: 'Applications This Month', value: '48', icon: FileText, trend: '+8% from last month', color: 'from-purple-500 to-indigo-500' },
        { label: 'Active Cohorts', value: '4', icon: Layers, trend: '2 in progress', color: 'from-[#8B5CF6] to-[#7C3AED]' },
        { label: 'Shortlisted Startups', value: '12', icon: Star, trend: 'Next review in 2 days', color: 'from-amber-500 to-orange-500' },
    ];

    const highPotentialStartups = [
        {
            name: 'EcoTrace AI',
            founder: 'Sarah Chen',
            sector: 'Sustainability / AI',
            stage: 'MVP',
            metrics: '2.5k Beta Users',
            logo: 'E',
            color: 'bg-emerald-500/20 text-emerald-400'
        },
        {
            name: 'FinFlow',
            founder: 'Alex Rivera',
            sector: 'FinTech',
            stage: 'Revenue',
            metrics: '₹12L MRR',
            logo: 'F',
            color: 'bg-blue-500/20 text-blue-400'
        },
        {
            name: 'HealthSync',
            founder: 'Dr. Priya Shah',
            sector: 'HealthTech',
            stage: 'MVP',
            metrics: '15 Clinic Pilots',
            logo: 'H',
            color: 'bg-rose-500/20 text-rose-400'
        }
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Vanguard Innovation Hub</h1>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold rounded-full border border-[#8B5CF6]/20 tracking-wider uppercase">
                            FinTech
                        </span>
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold rounded-full border border-[#8B5CF6]/20 tracking-wider uppercase">
                            EdTech
                        </span>
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold rounded-full border border-[#8B5CF6]/20 tracking-wider uppercase">
                            AI & ML
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-[#1E1E2F] p-2 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                        <Calendar className="text-white" size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Next Batch</p>
                        <p className="text-sm font-bold text-white">Starts April 2025</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-[#1E1E2F] rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <stat.icon size={24} className="text-[#8B5CF6]" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* High Potential Startups */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Star className="text-amber-400" size={20} />
                            High-Potential Startups
                        </h2>
                        <button className="text-sm font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors">View All Pipeline</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {highPotentialStartups.map((startup, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="p-5 bg-[#1E1E2F] rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${startup.color}`}>
                                            {startup.logo}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{startup.name}</h4>
                                            <p className="text-xs text-gray-400">{startup.founder}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-white/5 text-[10px] font-bold text-gray-400 rounded-md border border-white/5 uppercase">
                                        {startup.stage}
                                    </span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Sector</span>
                                        <span className="text-gray-300 font-medium">{startup.sector}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Traction</span>
                                        <span className="text-[#8B5CF6] font-bold">{startup.metrics}</span>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-white/5 hover:bg-[#8B5CF6] text-sm font-bold text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                    View Profile
                                    <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Application Deadlines & Status */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-blue-400" size={20} />
                        Batch Status
                    </h2>
                    <div className="p-6 bg-[#1E1E2F] rounded-2xl border border-white/5 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Current Cohort</p>
                            <h3 className="text-lg font-bold text-white">Spring 2025 – AI Lab</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Application Status</span>
                                <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-400/10 rounded-md">OPEN</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-black tracking-tighter text-gray-500">
                                <span>12 MAR</span>
                                <span>DEADLINE: 30 APR</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Clock size={16} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-300 font-bold">18 Days Remaining</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Until Cohort Lockdown</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-300 font-bold">42 Applications Total</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Awaiting Initial Screening</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-bold text-white rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all">
                            Manage Applications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorDashboard;
