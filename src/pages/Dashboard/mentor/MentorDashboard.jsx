
import React from 'react';
import {
    Users,
    Calendar,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    Zap
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
                animate={{ width: '70%' }}
                className={`h-full bg-${color}-500/50`}
            />
        </div>
    </motion.div>
);

const UpcomingSessionCard = ({ session }) => (
    <div className="bg-[#1E1E2F] p-5 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group">
        <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
                    {session.founderName[0]}
                </div>
                <div>
                    <h4 className="text-white font-bold">{session.founderName}</h4>
                    <p className="text-gray-500 text-xs font-medium">{session.startupName} • <span className="text-[#8B5CF6]">{session.stage}</span></p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {session.time}</span>
                    </div>
                </div>
            </div>
            <button className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all whitespace-nowrap">
                Join Session
            </button>
        </div>
    </div>
);

const HighPotentialCard = ({ startup }) => (
    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={48} />
        </div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-lg font-black text-white group-hover:text-[#8B5CF6] transition-colors">{startup.name}</h4>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{startup.sector}</span>
                </div>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest rounded border border-green-500/20">
                    {startup.stage}
                </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-6">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Traction Snapshot</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">{startup.traction}</p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-gray-300 hover:text-white transition-all">
                View Profile <ArrowUpRight size={14} />
            </button>
        </div>
    </div>
);

const MentorDashboard = () => {
    const stats = [
        { label: 'Pending Requests', value: '08', icon: MessageSquare, color: 'blue' },
        { label: 'Active Mentees', value: '12', icon: Users, color: 'purple' },
        { label: 'Sessions This Week', value: '05', icon: Calendar, color: 'green' },
        { label: 'Response Rate', value: '92%', icon: Zap, color: 'orange' },
    ];

    const upcomingSessions = [
        { id: 1, founderName: 'Sarah Jenkins', startupName: 'EcoFlow', stage: 'Seed', date: 'Oct 24, 2026', time: '10:30 AM' },
        { id: 2, founderName: 'Alex Rivera', startupName: 'Nexus AI', stage: 'MVP', date: 'Oct 25, 2026', time: '02:00 PM' },
        { id: 3, founderName: 'Michael Chen', startupName: 'PayBolt', stage: 'Revenue', date: 'Oct 25, 2026', time: '04:30 PM' },
    ];

    const highPotentialStartups = [
        { id: 1, name: 'CloudScale', sector: 'DevOps / SaaS', stage: 'Revenue', traction: '$42k MRR | 120% YoY' },
        { id: 2, name: 'BioSense', sector: 'HealthTech', stage: 'MVP', traction: 'FDA Phase 1 Clear | 2 Partnerships' },
        { id: 3, name: 'Vortex Crypto', sector: 'FinTech / Web3', stage: 'Seed', traction: '25k Waitlist | $2M Vol/Day' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/30">
                            Mentor Badge
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">FinTech | 12+ Years Experience</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Arjun</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Your guidance is shaping the next billion-dollar ideas.</p>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-all">
                        View Public Profile
                    </button>
                    <button className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all">
                        Edit Availability
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Upcoming Sessions */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Calendar className="text-[#8B5CF6]" size={20} />
                            Upcoming Sessions
                        </h3>
                        <button className="text-xs font-bold text-[#8B5CF6] hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                            <UpcomingSessionCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>

                {/* High Potential Startups */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Zap className="text-yellow-400" size={20} />
                            High-Potential Startups
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {highPotentialStartups.map((startup) => (
                            <HighPotentialCard key={startup.id} startup={startup} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
