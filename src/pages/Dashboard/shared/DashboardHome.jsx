
import React from 'react';
import {
    Users,
    DollarSign,
    Users2,
    MessageSquare,
    Plus,
    Zap,
    Search,
    TrendingUp,
    CheckCircle2,
    Clock,
    Target,
    Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all shadow-xl shadow-black/20"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon className={`text-${color}-400`} size={24} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</span>
                <span className="text-2xl font-black text-white mt-1">{value}</span>
            </div>
        </div>
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className={`h-full bg-${color}-500/50`}
            />
        </div>
    </motion.div>
);

const QuickAction = ({ label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 bg-[#1E1E2F] hover:bg-[#8B5CF6]/10 border border-white/5 hover:border-[#8B5CF6]/30 p-4 rounded-xl transition-all group w-full text-left"
    >
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#8B5CF6]/20 transition-colors">
            <Icon size={18} className="text-gray-400 group-hover:text-[#8B5CF6]" />
        </div>
        <span className="font-semibold text-gray-300 group-hover:text-white">{label}</span>
    </button>
);

const DashboardHome = ({ role, user }) => {
    const isFounder = role === 'founder';

    const stages = [
        { id: 'idea', label: 'Idea', active: true },
        { id: 'validation', label: 'Validation', active: true },
        { id: 'mvp', label: 'MVP', active: false },
        { id: 'revenue', label: 'Revenue', active: false },
    ];

    const currentStageIndex = 1; // Validation

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/30">
                            {role}
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Command Center</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{user?.fullName?.split(' ')[0] || 'Commander'}</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <Rocket size={14} className="text-purple-400" />
                            <span className="text-sm font-bold text-gray-200">Nebula AI</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                            <Target size={14} className="text-green-400" />
                            <span className="text-sm font-bold text-green-400">Validation Stage</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1E1E2F] p-1.5 rounded-xl border border-white/5 flex gap-2">
                    <button className="px-4 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-lg shadow-lg shadow-[#8B5CF6]/20">Overview</button>
                    <button className="px-4 py-2 text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-colors">Analytics</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Users" value="1,284" icon={Users} color="blue" />
                <StatCard label="Revenue" value="$4,200" icon={DollarSign} color="green" />
                <StatCard label="Team Size" value="5" icon={Users2} color="purple" />
                <StatCard label="Mentorship" value="12" icon={MessageSquare} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Bar & Stage */}
                <div className="lg:col-span-2 bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#8B5CF6]/10 transition-all" />

                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <TrendingUp className="text-[#8B5CF6]" size={20} />
                            Startup Execution Path
                        </h3>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">45% Completed</span>
                    </div>

                    <div className="relative pt-8 pb-12">
                        {/* Progress Line Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full" />

                        {/* Progress Line Active */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-indigo-500 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        />

                        {/* Stage Points */}
                        <div className="relative flex justify-between">
                            {stages.map((stage, idx) => (
                                <div key={stage.id} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#1E1E2F] z-10 transition-all duration-500 
                                        ${idx <= currentStageIndex
                                            ? 'bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                                            : 'bg-[#0F0F14] text-gray-600 border-[#0F0F14]'}`}>
                                        {idx < currentStageIndex ? <CheckCircle2 size={18} /> : (idx === currentStageIndex ? <Zap size={18} fill="currentColor" /> : idx + 1)}
                                    </div>
                                    <span className={`absolute mt-12 text-xs font-black uppercase tracking-tighter transition-colors duration-500
                                        ${idx <= currentStageIndex ? 'text-white' : 'text-gray-600'}`}>
                                        {stage.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase">Current Focus</p>
                                <p className="text-sm font-bold text-white text-white">Market Validation & User Testing</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                                <Plus size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase">Next Milestone</p>
                                <p className="text-sm font-bold text-white">MVP Prototype Release</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Zap className="text-yellow-400" size={20} />
                        Quick Actions
                    </h3>

                    <div className="space-y-4">
                        <QuickAction label="Add Milestone" icon={Plus} />
                        {isFounder ? (
                            <>
                                <QuickAction label="Request Mentor" icon={MessageSquare} />
                                <QuickAction label="Find Co-Founder" icon={Search} />
                            </>
                        ) : (
                            <>
                                <QuickAction label="Update Task" icon={CheckCircle2} />
                                <QuickAction label="Request Mentor" icon={MessageSquare} />
                            </>
                        )}
                        <QuickAction label="Update Traction" icon={TrendingUp} />
                    </div>

                    <div className="mt-auto p-6 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                            <Rocket size={80} />
                        </div>
                        <h4 className="text-white font-black text-lg mb-2 relative z-10">Scale Your Vision</h4>
                        <p className="text-white/80 text-xs mb-4 relative z-10">Get priority access to top-tier investors and specialized incubators.</p>
                        <button className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg relative z-10 hover:shadow-xl transition-all">Upgrade Plan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
