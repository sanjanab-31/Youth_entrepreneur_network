
import React from 'react';
import {
    CheckCircle2,
    UserPlus,
    Building,
    Zap,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    Clock,
    MoreHorizontal
} from 'lucide-react';

const ActivityFeed = () => {
    const activities = [
        { id: 1, type: 'milestone', title: 'Milestone Completed', desc: 'Market Validation user interviews finished.', time: '2h ago', meta: 'User Testing', icon: CheckCircle2, color: 'green' },
        { id: 2, type: 'mentor', title: 'New Mentor Joined', desc: 'Anant Goenka is now available for Fintech guidance.', time: '5h ago', meta: 'Expert Network', icon: UserPlus, color: 'blue' },
        { id: 3, type: 'incubator', title: 'Incubator Deadline', desc: 'NSRCEL IIMB applications close in 3 days.', time: '8h ago', meta: 'Growth', icon: Building, color: 'orange' },
        { id: 4, type: 'team', title: 'Team Update', desc: 'Priya Kapoor uploaded new design assets for MVP.', time: '12h ago', meta: 'Internal', icon: Zap, color: 'purple' },
        { id: 5, type: 'milestone', title: 'New Milestone Set', desc: 'Execute Pilot Run - Phase 1.', time: 'Yesterday', meta: 'Execution', icon: Calendar, color: 'pink' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2 md:px-0">
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        Activity <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Feed</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">Real-time execution updates and ecosystem alerts.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button className="flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-bold hover:text-white transition-all text-xs uppercase tracking-widest"><Filter size={14} /> Filter</button>
                    <button className="flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl text-[#8B5CF6] font-bold text-xs uppercase tracking-widest">Mark All Read</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-4">
                    {activities.map((act) => (
                        <div key={act.id} className="group bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-${act.color}-500/10 flex items-center justify-center text-${act.color}-400 border border-${act.color}-500/20 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <act.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                        <div>
                                            <h3 className="text-base md:text-lg font-black text-white group-hover:text-[#8B5CF6] transition-colors">{act.title}</h3>
                                            <div className="flex items-center flex-wrap gap-2 md:gap-3 mt-1">
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{act.meta}</span>
                                                <span className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full" />
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase"><Clock size={10} /> {act.time}</span>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-700 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 flex self-end sm:self-auto"><MoreHorizontal size={20} /></button>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">{act.desc}</p>
                                </div>
                            </div>

                            {/* Accent Glow */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${act.color}-500/2 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-${act.color}-500/5 transition-all`} />
                        </div>
                    ))}

                    <button className="w-full py-6 bg-white/5 border border-dashed border-white/10 rounded-2xl text-xs font-black text-gray-600 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        View Older Activity <ArrowRight size={14} />
                    </button>
                </div>

                {/* Feed Summary / Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-xs">Activity Stats</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Weekly Velocity</span>
                                <span className="text-sm font-black text-white">+24%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-gradient-to-r from-[#8B5CF6] to-indigo-500" />
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Execution</span>
                                    </div>
                                    <span className="text-xs font-black text-white">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Growth</span>
                                    </div>
                                    <span className="text-xs font-black text-white">4</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Network</span>
                                    </div>
                                    <span className="text-xs font-black text-white">8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#8B5CF6] to-indigo-600 p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={48} /></div>
                        <h4 className="text-white font-black text-sm mb-2 relative z-10">Real-time Insights</h4>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider relative z-10">Command center is fully synchronized.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;
