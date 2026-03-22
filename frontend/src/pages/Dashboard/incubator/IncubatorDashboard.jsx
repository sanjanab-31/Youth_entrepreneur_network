import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    FileText,
    Layers,
    Star,
    Calendar,
    ArrowUpRight,
    AlertCircle,
    Bell,
    CheckCircle
} from 'lucide-react';
import { useIncubator } from '../../../context/IncubatorContext';

const IncubatorDashboard = () => {
    const { profile, analytics, alerts, activityFeed, highPotentialStartups, nextBatch, loading } = useIncubator();

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Startups in Pipeline', value: analytics.totalStartups, icon: Users, trend: `${analytics.cohortSize} in cohorts`, color: 'from-blue-500 to-cyan-500' },
        { label: 'Pending Applications', value: analytics.pendingApplications, icon: FileText, trend: `${analytics.totalApplications} total applications`, color: 'from-purple-500 to-indigo-500' },
        { label: 'Acceptance Rate', value: analytics.acceptanceRateLabel, icon: Layers, trend: analytics.totalApplications > 0 ? `${analytics.acceptedApplications}/${analytics.totalApplications} accepted` : 'No applications yet', color: 'from-[#8B5CF6] to-[#7C3AED]' },
        { label: 'At-Risk Startups', value: analytics.atRiskStartups, icon: Star, trend: 'Needs immediate review', color: 'from-amber-500 to-orange-500' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">{profile.organizationName || profile.name}</h1>
                    <div className="flex flex-wrap gap-2">
                        {(profile.sectorFocus || []).map((sector, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold rounded-full border border-[#8B5CF6]/20 tracking-wider uppercase">
                                {sector}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-[#1E1E2F] p-2 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                        <Calendar className="text-white" size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Next Batch</p>
                        {nextBatch ? (
                            <>
                                <p className="text-sm font-bold text-white">{nextBatch.name || 'Upcoming Cohort'}</p>
                                <p className="text-xs text-gray-400">Starts {new Date(nextBatch.startDate).toLocaleDateString()}</p>
                            </>
                        ) : (
                            <p className="text-sm font-bold text-gray-400">No upcoming cohorts</p>
                        )}
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

            {/* Alerts Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertCircle className="text-amber-400" size={20} />
                    Critical Alerts
                </h2>
                {alerts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {alerts.slice(0, 4).map((alert, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 rounded-xl border flex items-center gap-3 ${alert.type === 'critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                    alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}
                            >
                                <AlertCircle size={18} />
                                <p className="text-sm font-medium">{alert.message}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                        <CheckCircle size={18} />
                        <p className="text-sm font-medium">No critical alerts right now.</p>
                    </div>
                )}
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
                        {highPotentialStartups.length > 0 ? (
                            highPotentialStartups.map((startup, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="p-5 bg-[#1E1E2F] rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-xl font-bold text-[#8B5CF6]">
                                                {(startup.startupName || 'V')[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{startup.startupName || 'Unnamed Venture'}</h4>
                                                <p className="text-xs text-gray-400">{startup.sector}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-white/5 text-[10px] font-bold text-gray-400 rounded-md border border-white/5 uppercase">
                                            {startup.stage}
                                        </span>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Execution Score</span>
                                            <span className="text-emerald-400 font-bold">{startup.executionScore}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Milestones</span>
                                            <span className="text-[#8B5CF6] font-bold">{(startup.milestones || []).length}</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-2.5 bg-white/5 hover:bg-[#8B5CF6] text-sm font-bold text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                        View Profile
                                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </button>
                                </motion.div>
                            ))
                        ) : (
                            <div className="md:col-span-2 p-6 bg-[#1E1E2F] rounded-2xl border border-white/5 text-gray-400 text-sm">
                                No high-performing startups yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Activity Feed */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Bell className="text-[#8B5CF6]" size={20} />
                        Global Activity
                    </h2>
                    <div className="bg-[#1E1E2F] rounded-2xl border border-white/5 p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {activityFeed.map((log, idx) => (
                            <div key={log.id} className="flex gap-3 relative">
                                {idx !== activityFeed.length - 1 && (
                                    <div className="absolute left-[15px] top-8 bottom-[-16px] w-[2px] bg-white/5" />
                                )}
                                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                    log.type === 'reject' ? 'bg-rose-500/10 text-rose-400' :
                                        'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                                    }`}>
                                    {log.type === 'success' ? <CheckCircle size={14} /> :
                                        log.type === 'reject' ? <AlertCircle size={14} /> :
                                            <ArrowUpRight size={14} />}
                                </div>
                                <div>
                                    <p className="text-xs text-[#8B5CF6] font-bold">{log.startupName || 'Startup'}</p>
                                    <p className="text-sm text-gray-300 font-medium">{log.message}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {activityFeed.length === 0 && (
                            <div className="text-sm text-gray-500 py-4">No activity logged yet.</div>
                        )}
                    </div>

                    {/* Mentor Utilization Card */}
                    <div className="p-6 bg-gradient-to-br from-[#1E1E2F] to-[#2A2A3F] rounded-2xl border border-white/5 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white">Mentor Utilization</h3>
                            <span className="text-lg font-bold text-[#8B5CF6]">{analytics.mentorUtilization || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${analytics.mentorUtilization || 0}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-[#8B5CF6]"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">
                            Based on {analytics.totalStartups} active pairs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorDashboard;
