import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Calendar,
    Users,
    ChevronRight,
    Plus,
    X,
    TrendingUp,
    Milestone,
    User,
    UserCheck,
    Target
} from 'lucide-react';

import { useIncubator } from '../../../context/IncubatorContext';

const Cohorts = () => {
    const {
        cohorts,
        createCohort,
        pipeline,
        mentors,
        applications,
        assignStartupToCohort,
        removeStartupFromCohort
    } = useIncubator();

    const [selectedCohortId, setSelectedCohortId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCohort, setNewCohort] = useState({
        name: '',
        startDate: '',
        endDate: '',
        maxCapacity: 20,
        sectorFocus: ''
    });

    const getCohortStatus = (cohort) => {
        const now = new Date();
        const start = new Date(cohort.startDate);
        const end = new Date(cohort.endDate);

        if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
            return 'upcoming';
        }

        if (now < start) return 'upcoming';
        if (now > end) return 'completed';
        return 'active';
    };

    const getCohortStartups = (cohortId) => pipeline.filter(startup => startup.cohortId === cohortId);

    const getCohortProgress = (startups) => {
        if (!startups.length) return 0;
        const totalScore = startups.reduce((sum, startup) => sum + (startup.executionScore || 0), 0);
        return Math.round(totalScore / startups.length);
    };

    const getMilestoneCompletion = (startups) => {
        const milestones = startups.flatMap(startup => startup.milestones || []);
        if (!milestones.length) return 0;

        const completed = milestones.filter(ms => {
            if (typeof ms !== 'object') return false;
            return ms.completed || ms.status === 'completed' || ms.status === 'done';
        }).length;

        return Math.round((completed / milestones.length) * 100);
    };

    const getMentorName = (startup) => {
        const mentor = mentors.find(m => m.uid === startup.mentorAssigned || m.uid === startup.mentorId);
        return mentor?.name || 'Unassigned';
    };

    const getRecentActivity = (startups) => {
        const startupActivity = startups.flatMap(startup =>
            (startup.activity || []).map(item => ({
                id: item.id || `${startup.startupId}_${item.timestamp}`,
                startupName: startup.startupName || 'Unnamed Startup',
                type: item.type || 'info',
                message: item.message || 'Activity update',
                timestamp: item.timestamp || startup.updatedAt || startup.createdAt
            }))
        );

        const milestoneActivity = startups.flatMap(startup =>
            (startup.milestones || [])
                .filter(ms => typeof ms === 'object')
                .map(ms => ({
                    id: `ms_${startup.startupId}_${ms.id || ms.title || Math.random().toString(36).slice(2)}`,
                    startupName: startup.startupName || 'Unnamed Startup',
                    type: 'milestone',
                    message: `${ms.title || 'Milestone'}: ${ms.status || (ms.completed ? 'completed' : 'updated')}`,
                    timestamp: ms.updatedAt || ms.completedAt || ms.createdAt || startup.updatedAt || startup.createdAt
                }))
        );

        return [...startupActivity, ...milestoneActivity]
            .filter(item => item.timestamp)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 12);
    };

    const cohortCards = useMemo(() => {
        return cohorts
            .map(cohort => {
                const startups = getCohortStartups(cohort.id);
                const progress = getCohortProgress(startups);
                const milestoneCompletion = getMilestoneCompletion(startups);
                const status = getCohortStatus(cohort);
                const capacity = Number(cohort.maxCapacity) || 20;
                const utilization = Math.min(100, Math.round((startups.length / capacity) * 100));
                const activeStartups = startups.filter(startup => startup.status !== 'inactive').length;
                const inactiveStartups = Math.max(0, startups.length - activeStartups);
                const acceptedApplications = applications.filter(app => app.status === 'accepted' && app.cohortId === cohort.id).length;

                return {
                    ...cohort,
                    status,
                    startups,
                    progress,
                    milestoneCompletion,
                    utilization,
                    activeStartups,
                    inactiveStartups,
                    acceptedApplications
                };
            })
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [cohorts, pipeline, applications]);

    const selectedCohort = useMemo(
        () => cohortCards.find(cohort => cohort.id === selectedCohortId) || null,
        [cohortCards, selectedCohortId]
    );

    const assignableStartups = useMemo(() => {
        if (!selectedCohort) return [];
        return pipeline.filter(startup => startup.cohortId !== selectedCohort.id);
    }, [pipeline, selectedCohort]);

    const handleCreate = (e) => {
        e.preventDefault();

        if (!newCohort.name || !newCohort.startDate || !newCohort.endDate) return;
        if (new Date(newCohort.startDate) > new Date(newCohort.endDate)) return;

        createCohort({
            name: newCohort.name.trim(),
            startDate: newCohort.startDate,
            endDate: newCohort.endDate,
            maxCapacity: Number(newCohort.maxCapacity) || 20,
            sectorFocus: newCohort.sectorFocus.trim()
        });

        setShowCreateModal(false);
        setNewCohort({ name: '', startDate: '', endDate: '', maxCapacity: 20, sectorFocus: '' });
    };

    const statusClasses = {
        active: 'bg-emerald-500/20 text-emerald-400',
        upcoming: 'bg-blue-500/20 text-blue-300',
        completed: 'bg-gray-500/20 text-gray-300'
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Cohort Management</h1>
                    <p className="text-sm text-gray-400">Create, assign, and monitor startup batches in real time</p>
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
                {cohortCards.map((cohort, index) => (
                    <motion.button
                        key={cohort.id}
                        type="button"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.06 }}
                        className="text-left bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group cursor-pointer relative overflow-hidden"
                        onClick={() => setSelectedCohortId(cohort.id)}
                    >
                        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-black uppercase tracking-widest ${statusClasses[cohort.status] || statusClasses.upcoming}`}>
                            {cohort.status}
                        </div>

                        <div className="flex items-start gap-5 mb-7">
                            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-300">
                                <Layers size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8B5CF6] transition-colors">{cohort.name}</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                                    {cohort.sectorFocus || 'General Focus'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Startups</p>
                                <div className="flex items-center gap-2 text-sm text-white font-bold">
                                    <Users size={14} className="text-[#8B5CF6]" />
                                    {cohort.startups.length}
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Capacity</p>
                                <div className="flex items-center gap-2 text-sm text-white font-bold">
                                    <Target size={14} className="text-emerald-400" />
                                    {cohort.startups.length}/{Number(cohort.maxCapacity) || 20}
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Start Date</p>
                                <div className="flex items-center gap-2 text-sm text-white font-bold">
                                    <Calendar size={14} className="text-blue-400" />
                                    {new Date(cohort.startDate).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">End Date</p>
                                <div className="flex items-center gap-2 text-sm text-white font-bold">
                                    <Calendar size={14} className="text-rose-400" />
                                    {new Date(cohort.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-widest">Cohort Progress</span>
                                <span className="text-[#8B5CF6] font-black">{cohort.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cohort.progress}%` }}
                                    transition={{ duration: 0.8 }}
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
                                />
                            </div>
                            <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                                <span>Milestones {cohort.milestoneCompletion}% complete</span>
                                <span>Utilization {cohort.utilization}%</span>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-between items-center">
                            <div className="text-xs text-gray-400 font-semibold">
                                {cohort.activeStartups} active / {cohort.inactiveStartups} inactive
                            </div>
                            <span className="text-xs font-bold text-[#8B5CF6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                Detailed Review
                                <ChevronRight size={16} />
                            </span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {cohortCards.length === 0 && (
                <div className="p-10 rounded-2xl border border-dashed border-white/10 bg-[#1A1A2B] text-center text-gray-400">
                    No cohorts found. Launch your first cohort to start tracking batches.
                </div>
            )}

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
                                        placeholder="e.g. Batch 2026 Feb"
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Capacity</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            value={newCohort.maxCapacity}
                                            onChange={(e) => setNewCohort({ ...newCohort, maxCapacity: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sector Focus</label>
                                        <input
                                            value={newCohort.sectorFocus}
                                            onChange={(e) => setNewCohort({ ...newCohort, sectorFocus: e.target.value })}
                                            placeholder="Optional"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8B5CF6]"
                                        />
                                    </div>
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
                                        className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
                                    >
                                        Launch
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedCohort && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCohortId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed inset-4 md:inset-8 lg:inset-12 bg-[#1E1E2F] border border-white/10 z-[110] shadow-2xl rounded-3xl flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 bg-[#1E1E2F] flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white">
                                        <Layers size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedCohort.name}</h2>
                                        <p className="text-sm text-gray-400">Track cohort performance and startup operations</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCohortId(null)}
                                    className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={26} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-7">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Users size={20} className="text-[#8B5CF6]" />
                                            Startups in Cohort
                                        </h3>

                                        {selectedCohort.startups.length === 0 && (
                                            <div className="py-8 text-center text-gray-500 italic rounded-2xl bg-white/5 border border-white/5">
                                                No startups assigned yet.
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            {selectedCohort.startups.map(startup => (
                                                <div key={startup.startupId} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <div className="flex flex-wrap justify-between gap-3">
                                                        <div>
                                                            <p className="font-bold text-white">{startup.startupName || 'Unnamed Startup'}</p>
                                                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                                                                Stage: {startup.stage || 'Unknown'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-400 font-bold uppercase">Execution</p>
                                                            <p className="text-base text-white font-black">{startup.executionScore || 0}%</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500"
                                                            style={{ width: `${Math.min(100, Math.max(0, startup.executionScore || 0))}%` }}
                                                        />
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                                        <div className="text-xs text-gray-300 flex items-center gap-2">
                                                            <UserCheck size={14} className="text-blue-300" />
                                                            Mentor: {getMentorName(startup)}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStartupFromCohort(startup.startupId, selectedCohort.id)}
                                                            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Plus size={18} className="text-[#8B5CF6]" />
                                            Assign Startups
                                        </h3>
                                        <div className="space-y-3">
                                            {assignableStartups.length === 0 && (
                                                <div className="py-6 text-center text-gray-500 italic rounded-2xl bg-white/5 border border-white/5">
                                                    All incubator startups are already in this cohort.
                                                </div>
                                            )}
                                            {assignableStartups.map(startup => (
                                                <div key={startup.startupId} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-bold text-white">{startup.startupName || 'Unnamed Startup'}</p>
                                                        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                                                            {startup.stage || 'Unknown'} | Execution {startup.executionScore || 0}%
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => assignStartupToCohort(startup.startupId, selectedCohort.id)}
                                                        className="text-xs px-3 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg font-bold"
                                                    >
                                                        Assign
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-5 bg-[#161625] rounded-2xl border border-[#8B5CF6]/20 space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <TrendingUp size={16} /> Cohort Analytics
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between text-gray-300">
                                                <span>Average execution</span>
                                                <span className="font-bold text-white">{selectedCohort.progress}%</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Total startups</span>
                                                <span className="font-bold text-white">{selectedCohort.startups.length}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Active vs Inactive</span>
                                                <span className="font-bold text-white">{selectedCohort.activeStartups}/{selectedCohort.inactiveStartups}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Milestone completion</span>
                                                <span className="font-bold text-white">{selectedCohort.milestoneCompletion}%</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Accepted applications</span>
                                                <span className="font-bold text-white">{selectedCohort.acceptedApplications}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Milestone size={16} /> Activity Feed
                                        </h3>
                                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                            {getRecentActivity(selectedCohort.startups).length === 0 && (
                                                <p className="text-xs text-gray-500">No cohort activity yet.</p>
                                            )}
                                            {getRecentActivity(selectedCohort.startups).map(item => (
                                                <div key={item.id} className="p-3 rounded-xl bg-black/20 border border-white/5">
                                                    <p className="text-xs text-white font-semibold">{item.startupName}</p>
                                                    <p className="text-xs text-gray-300 mt-1">{item.message}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1.5">{new Date(item.timestamp).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2"><Calendar size={14} className="text-blue-300" /> {new Date(selectedCohort.startDate).toLocaleDateString()} - {new Date(selectedCohort.endDate).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2"><User size={14} className="text-purple-300" /> Capacity {selectedCohort.startups.length}/{Number(selectedCohort.maxCapacity) || 20}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{selectedCohort.sectorFocus || 'General Focus'}</div>
                                    </div>
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
