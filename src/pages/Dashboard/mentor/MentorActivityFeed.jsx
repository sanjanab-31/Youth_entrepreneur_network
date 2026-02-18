
import React from 'react';
import {
    CheckCircle2,
    Building,
    Zap,
    Calendar,
    ArrowRight,
    Filter,
    Clock,
    TrendingUp,
    Rocket,
    MessageSquare,
    AlertCircle,
    Check,
    XCircle
} from 'lucide-react';
import { useMentor } from '../../../context/MentorContext';
import { motion } from 'framer-motion';

const MentorActivityFeed = () => {
    const { activity, mentees, stats } = useMentor();

    const getActivityIcon = (type) => {
        switch (type) {
            case 'success': return CheckCircle2;
            case 'warning': return AlertCircle;
            case 'error': return XCircle;
            case 'request': return MessageSquare;
            case 'session': return Calendar;
            default: return Zap;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'success': return 'green';
            case 'warning': return 'yellow';
            case 'error': return 'red';
            case 'request': return 'blue';
            case 'session': return 'purple';
            default: return 'orange';
        }
    };

    // Helper to format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Activity <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Log</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Tracking your impact across the ecosystem in real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-bold hover:text-white transition-all text-xs uppercase tracking-widest"><Filter size={14} /> Filter Feed</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-4">
                    {activity.length === 0 ? (
                        <div className="py-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                            <Clock className="mx-auto text-gray-700 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-500">Silence is Golden</h3>
                            <p className="text-gray-600">Your activity will appear here once you start interacting.</p>
                        </div>
                    ) : (
                        activity.map((act) => {
                            const Icon = getActivityIcon(act.type);
                            const color = getActivityColor(act.type);
                            return (
                                <div key={act.id} className="group bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all relative overflow-hidden">
                                    <div className="flex gap-6 relative z-10">
                                        <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 border border-${color}-500/20 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{act.message}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{act.type} event</span>
                                                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase"><Clock size={10} /> {formatTime(act.timestamp)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {activity.length > 5 && (
                        <button className="w-full py-6 bg-white/5 border border-dashed border-white/10 rounded-2xl text-xs font-black text-gray-600 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            View Older Updates <ArrowRight size={14} />
                        </button>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 shadow-xl shadow-black/20">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Activity Stats</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Impact Range</span>
                                <span className="text-sm font-black text-white">+12%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-indigo-500"
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Active Mentees</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{stats.activeMentees}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Responded Requests</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{stats.responseRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all border-dashed">
                        <h4 className="text-white font-black text-xs mb-3 flex items-center gap-2">
                            <Zap className="text-yellow-400" size={14} /> Power Level
                        </h4>
                        <p className="text-gray-500 text-[10px] font-bold leading-relaxed">
                            Your consistent feedback is driving 2x faster execution in your mentees.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorActivityFeed;
