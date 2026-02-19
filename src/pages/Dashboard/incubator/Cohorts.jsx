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

import { useIncubator } from '../../../context/IncubatorContext';

const Cohorts = () => {
    const { cohorts, createCohort, pipeline, mentors } = useIncubator();
    const [selectedCohort, setSelectedCohort] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCohort, setNewCohort] = useState({ name: '', startDate: '', endDate: '', funding: '' });

    const handleCreate = (e) => {
        e.preventDefault();
        createCohort(newCohort);
        setShowCreateModal(false);
        setNewCohort({ name: '', startDate: '', endDate: '', funding: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Cohort Management</h1>
                    <p className="text-sm text-gray-400">Track batch progress and startup growth</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all"
                >
                    <Plus size={18} />
                    Launch New Cohort
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cohorts.map((cohort, index) => {
                    const cohortStartups = pipeline.filter(s => s.cohortId === cohort.id);
                    return (
                        <motion.div
                            key={cohort.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group cursor-pointer relative overflow-hidden"
                            onClick={() => setSelectedCohort(cohort)}
                        >
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest ${cohort.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                {cohort.status}
                            </div>

                            <div className="flex items-start gap-5 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-300">
                                    <Layers size={28} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">{cohort.name}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Users size={14} className="text-[#8B5CF6]" />
                                            <span className="font-bold text-gray-300">{cohortStartups.length} Startups</span>
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
                                        {new Date(cohort.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Graduation</p>
                                    <div className="flex items-center gap-2 text-sm text-white font-bold">
                                        <Calendar size={14} className="text-rose-400" />
                                        {new Date(cohort.endDate).toLocaleDateString()}
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
                                    {cohortStartups.slice(0, 4).map((s, i) => (
                                        <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-[#1E1E2F] bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg uppercase">
                                            {(s.startupName || 'V')[0]}
                                        </div>
                                    ))}
                                    {cohortStartups.length > 4 && (
                                        <div className="inline-block h-8 w-8 rounded-full border-2 border-[#1E1E2F] bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                            +{cohortStartups.length - 4}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-bold text-[#8B5CF6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Detailed Review
                                    <ChevronRight size={16} />
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Create Cohort Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#1E1E2F] border border-white/10 p-8 rounded-3xl z-[110] shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Launch New Cohort</h2>
                            <form onSubmit={handleCreate} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cohort Name</label>
                                    <input
                                        required
                                        value={newCohort.name}
                                        onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                                        placeholder="e.g. Batch Spring 2025"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={newCohort.startDate}
                                            onChange={(e) => setNewCohort({ ...newCohort, startDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={newCohort.endDate}
                                            onChange={(e) => setNewCohort({ ...newCohort, endDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Funding/Perks</label>
                                    <input
                                        value={newCohort.funding}
                                        onChange={(e) => setNewCohort({ ...newCohort, funding: e.target.value })}
                                        placeholder="e.g. ₹25L Equity-free"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8B5CF6]"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold shadow-lg shadow-[#8B5CF6]/20 transition-all"
                                    >
                                        Launch
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
                                                    <Users size={20} className="text-[#8B5CF6]" />
                                                    Active Startups Progress
                                                </h3>
                                            </div>
                                            <div className="space-y-4">
                                                {pipeline.filter(s => s.cohortId === selectedCohort.id).map((startup, idx) => (
                                                    <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[#8B5CF6]">
                                                                    {(startup.startupName || 'V')[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{startup.startupName || 'Unnamed Venture'}</p>
                                                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                                                        Mentor: {mentors.find(m => m.uid === startup.mentorId || m.uid === startup.mentorAssigned)?.name || 'Assign Later'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-xs font-bold">
                                                                <span className="text-gray-500">Execution Level</span>
                                                                <span className="text-white">{startup.executionScore}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${startup.executionScore}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {pipeline.filter(s => s.cohortId === selectedCohort.id).length === 0 && (
                                                    <div className="py-10 text-center text-gray-500 italic">
                                                        No startups assigned to this cohort yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Snapshot */}
                                        <div className="p-6 bg-[#161625] rounded-3xl border border-[#8B5CF6]/10 space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                                <TrendingUp size={16} /> Cohort Overview
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                                                    <span className="text-white font-bold">{selectedCohort.status === 'active' ? '🌕 Active' : '🌑 Completed'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Duration</p>
                                                    <span className="text-white font-bold">{new Date(selectedCohort.startDate).toLocaleDateString()} - {new Date(selectedCohort.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Funding Package</p>
                                                    <span className="text-white font-bold">{selectedCohort.funding || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Basic Batch Milestones */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                                <Calendar size={16} /> Batch Phases
                                            </h3>
                                            <div className="space-y-3">
                                                {['Orientation', 'MVP Build', 'GTM Strategy', 'Demo Day'].map((m, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/5">
                                                        <Clock size={16} className="text-gray-500" />
                                                        <span className="text-xs font-medium text-gray-300">{m}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#1E1E2F] flex justify-between items-center">
                                <p className="text-xs text-gray-500 font-medium">Batch Management Control</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSelectedCohort(null)}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all"
                                    >
                                        Close Management
                                    </button>
                                    <button className="px-8 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-xs font-bold text-white shadow-xl shadow-[#8B5CF6]/20 transition-all">
                                        Export Cohort Data
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
