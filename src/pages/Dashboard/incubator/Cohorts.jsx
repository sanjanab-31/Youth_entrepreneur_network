import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Calendar,
    Users,
    DollarSign,
    ChevronRight,
    Search,
    Plus,
    Clock,
    TrendingUp,
    CheckCircle2,
    X,
    User,
    ArrowUpRight,
    Milestone
} from 'lucide-react';

const Cohorts = () => {
    const [selectedCohort, setSelectedCohort] = useState(null);

    const cohorts = [
        {
            id: 1,
            name: 'Batch 2025 – Spring AI',
            status: 'Active',
            startupsCount: 12,
            startDate: 'Mar 15, 2025',
            endDate: 'Jun 15, 2025',
            funding: '₹25L Equity-free',
            progress: 35,
            startups: [
                { name: 'EcoTrace AI', progress: 85, mentor: 'Dr. Jane Smith' },
                { name: 'FinFlow', progress: 60, mentor: 'Mark Cuban' },
                { name: 'HealthSync', progress: 40, mentor: 'Sarah Jenkins' },
            ]
        },
        {
            id: 2,
            name: 'Batch 2024 – Winter FinTech',
            status: 'Completed',
            startupsCount: 15,
            startDate: 'Oct 01, 2024',
            endDate: 'Jan 01, 2025',
            funding: '₹15L + Perks',
            progress: 100,
            startups: [
                { name: 'PayZ', progress: 100, mentor: 'Alex Lee' },
                { name: 'SecureBank', progress: 100, mentor: 'Dinesh Karthik' },
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Cohort Management</h1>
                    <p className="text-sm text-gray-400">Track batch progress and startup growth</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all">
                    <Plus size={18} />
                    Launch New Cohort
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cohorts.map((cohort, index) => (
                    <motion.div
                        key={cohort.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group cursor-pointer relative overflow-hidden"
                        onClick={() => setSelectedCohort(cohort)}
                    >
                        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest ${cohort.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                            {cohort.status}
                        </div>

                        <div className="flex items-start gap-5 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-300">
                                <Layers size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">{cohort.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Users size={14} className="text-[#8B5CF6]" />
                                        <span className="font-bold text-gray-300">{cohort.startupsCount} Startups</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <DollarSign size={14} className="text-emerald-400" />
                                        <span className="font-bold text-gray-300">{cohort.funding}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Start Date</p>
                                <div className="flex items-center gap-2 text-sm text-white font-bold">
                                    <Calendar size={14} className="text-blue-400" />
                                    {cohort.startDate}
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Graduation</p>
                                <div className="flex items-center gap-2 text-sm text-white font-bold">
                                    <Calendar size={14} className="text-rose-400" />
                                    {cohort.endDate}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-widest">Cohort Progress</span>
                                <span className="text-[#8B5CF6] font-black">{cohort.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cohort.progress}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <div className="flex -space-x-3 overflow-hidden">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-[#1E1E2F] bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                        {i}
                                    </div>
                                ))}
                                <div className="inline-block h-8 w-8 rounded-full border-2 border-[#1E1E2F] bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                    +{cohort.startupsCount - 4}
                                </div>
                            </div>
                            <span className="text-xs font-bold text-[#8B5CF6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                Detailed Review
                                <ChevronRight size={16} />
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cohort Detail View Modal */}
            <AnimatePresence>
                {selectedCohort && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCohort(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#1E1E2F] border border-white/10 z-[110] shadow-2xl rounded-3xl flex flex-col overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 bg-[#1E1E2F] flex justify-between items-center">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-xl shadow-[#8B5CF6]/20">
                                        <Layers size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">{selectedCohort.name}</h2>
                                        <p className="text-sm text-gray-400">Manage startups, mentors, and milestones for this batch</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedCohort(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Startup Tracking */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Rocket size={20} className="text-[#8B5CF6]" />
                                                    Active Startups Progress
                                                </h3>
                                                <button className="text-xs font-bold text-[#8B5CF6] hover:underline">Download Report</button>
                                            </div>
                                            <div className="space-y-4">
                                                {selectedCohort.startups.map((startup, idx) => (
                                                    <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[#8B5CF6]">
                                                                    {startup.name[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{startup.name}</p>
                                                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Mentor: {startup.mentor}</p>
                                                                </div>
                                                            </div>
                                                            <button className="p-2 hover:bg-[#8B5CF6]/10 rounded-lg text-gray-400 hover:text-[#8B5CF6] transition-colors">
                                                                <ArrowUpRight size={18} />
                                                            </button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-xs font-bold">
                                                                <span className="text-gray-500">Milestone Completion</span>
                                                                <span className="text-white">{startup.progress}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${startup.progress}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Growth Snapshot */}
                                        <div className="p-6 bg-[#161625] rounded-3xl border border-[#8B5CF6]/10 space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                                <TrendingUp size={16} /> Expansion Analytics
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-2xl font-bold text-white">₹1.2Cr</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Total Combined Revenue</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                        <CheckCircle2 size={14} /> +12%
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-2xl font-bold text-white">18.5k</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Active Beta Users</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                        <CheckCircle2 size={14} /> +24%
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-white transition-all uppercase tracking-widest">
                                                View Metric Detail
                                            </button>
                                        </div>

                                        {/* Milestone Checklist */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                                <Milestone size={16} /> Batch Milestones
                                            </h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Orientation Week', done: true },
                                                    { label: 'Product Architecture Review', done: true },
                                                    { label: 'Market Strategy Workshop', done: false },
                                                    { label: 'Seed Prep Day', done: false }
                                                ].map((m, i) => (
                                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60' : 'bg-white/5 border-white/5'}`}>
                                                        {m.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Clock size={16} className="text-gray-500" />}
                                                        <span className={`text-xs font-medium ${m.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{m.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#1E1E2F] flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1E1E2F] bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
                                                M{i}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">8 Lead Mentors Assigned</span>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
                                        Manage Mentors
                                    </button>
                                    <button className="px-8 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-xs font-bold text-white shadow-xl shadow-[#8B5CF6]/20 transition-all">
                                        Notify All Startups
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cohorts;
