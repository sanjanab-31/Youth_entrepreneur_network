import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Target,
    Trophy,
    LogOut,
    ExternalLink,
    ChevronRight,
    UserCheck,
    CheckCircle2,
    Calendar,
    Briefcase,
    User
} from 'lucide-react';
import { useStartup } from '../../../../context/StartupContext';
import { useAuth } from '../../../../context/AuthContext';

const StartupWorkspace = () => {
    const { startup, leaveStartup } = useStartup();
    const { user } = useAuth();

    const milestones = [
        { name: 'Idea Validated', status: 'completed' },
        { name: 'Prototype Built', status: 'completed' },
        { name: 'MVP Launched', status: 'current' },
        { name: 'Revenue Stage', status: 'upcoming' },
    ];

    if (!startup) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-green-500/20 shadow-sm">
                            Startup Workspace
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Collaboration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {startup?.name || 'My Startup'}
                    </h1>
                </div>

                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to leave this startup? Your access to the workspace will be removed.')) {
                            leaveStartup();
                        }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all group shadow-xl shadow-red-500/5 hover:shadow-red-500/20"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Leave Startup
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Startup Overview & Team */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Overview Card */}
                    <div className="bg-[#1E1E2F] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl shadow-black/40">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/5 blur-[128px] -mr-48 -mt-48 pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-8">
                                <div className="group">
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-2">Founder</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center font-black text-[#8B5CF6]">
                                            {(startup?.founderName?.[0] || 'F').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-white group-hover:text-[#8B5CF6] transition-colors leading-none">
                                                {startup?.founderName || 'Founder Name'}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Now</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-2">My Role</span>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-purple-500/10">
                                            <Briefcase size={20} className="text-purple-400" />
                                        </div>
                                        <p className="text-xl font-black text-purple-400">Co-Founder</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-2">Equity Stake</span>
                                    <div className="flex items-center gap-4">
                                        <p className="text-3xl font-black text-white">15.0%</p>
                                        <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[15%] bg-white/40" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-2">Startup Stage</span>
                                    <div className="flex">
                                        <div className="px-4 py-2 bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-purple-500/20 border border-white/10">
                                            {startup?.stage || 'MVP'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Panel */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Users className="text-[#8B5CF6]" size={20} />
                                </div>
                                Founding Team
                            </h2>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                Workspace Members: <span className="text-white">{startup?.members?.length || 3}</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: startup?.founderName || 'Founder', role: 'Founder & CEO', color: 'indigo' },
                                { name: user?.fullName || 'Me', role: 'Co-Founder', color: 'purple' },
                                { name: 'Sarah Chen', role: 'Co-Founder & Design', color: 'pink' },
                            ].map((member, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="bg-[#1E1E2F] p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center group shadow-xl hover:border-purple-500/20 transition-all"
                                >
                                    <div className={`w-20 h-20 rounded-[1.5rem] bg-${member.color}-500/10 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <User className={`text-${member.color}-400`} size={32} />
                                    </div>
                                    <p className="font-black text-white text-xl leading-tight">{member.name}</p>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Milestones */}
                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-2xl font-black text-white flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <Target className="text-orange-400" size={20} />
                        </div>
                        Growth Roadmap
                    </h2>

                    <div className="bg-[#1E1E2F] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="space-y-12 relative z-10">
                            {milestones.map((ms, i) => (
                                <div key={i} className="flex gap-6 relative">
                                    {i !== milestones.length - 1 && (
                                        <div className={`absolute left-[13px] top-10 bottom-[-48px] w-px ${ms.status === 'completed' ? 'bg-[#8B5CF6]' : 'bg-white/5'
                                            }`} />
                                    )}
                                    <div className={`w-[26px] h-[26px] rounded-full mt-1 shrink-0 z-10 flex items-center justify-center ring-8 ring-[#1E1E2F] ${ms.status === 'completed' ? 'bg-[#8B5CF6]' :
                                            ms.status === 'current' ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-black/20 border border-white/10'
                                        }`}>
                                        {ms.status === 'completed' ? (
                                            <CheckCircle2 size={14} className="text-white" />
                                        ) : (
                                            <div className={`w-1.5 h-1.5 rounded-full ${ms.status === 'current' ? 'bg-white animate-pulse' : 'bg-gray-600'}`} />
                                        )}
                                    </div>
                                    <div>
                                        <p className={`text-[15px] font-black tracking-tight ${ms.status === 'completed' ? 'text-gray-200' :
                                                ms.status === 'current' ? 'text-[#8B5CF6]' : 'text-gray-500'
                                            }`}>{ms.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${ms.status === 'completed' ? 'text-green-500/70' :
                                                    ms.status === 'current' ? 'text-orange-500' : 'text-gray-600'
                                                }`}>
                                                {ms.status === 'completed' ? 'Achieved' : ms.status === 'current' ? 'In Progress' : 'Planned'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 p-8 rounded-[2rem] bg-black/20 border border-white/5 group hover:border-purple-500/20 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 rounded-lg bg-yellow-500/10">
                                    <Trophy size={18} className="text-yellow-500" />
                                </div>
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Next Milestone</span>
                            </div>
                            <p className="text-[12px] text-gray-500 font-bold leading-relaxed group-hover:text-gray-300 transition-colors">
                                Finalize Seed Round Pitch Deck and secure initial commitments from Strategic Angel Investors.
                            </p>
                        </div>
                    </div>

                    {/* Analytics Teaser */}
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white shadow-xl">
                                <Building2 size={24} className="text-black" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm">Startup Analytics</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Performance Metrics</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupWorkspace;
