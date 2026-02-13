
import React from 'react';
import {
    CheckCircle2,
    UserPlus,
    Building,
    Zap,
    Calendar,
    ArrowRight,
    Filter,
    Clock,
    TrendingUp,
    Rocket
} from 'lucide-react';

const MentorActivityFeed = () => {
    const activities = [
        { id: 1, type: 'startup', title: 'New Startup Joined', desc: 'EcoFlow (CleanTech) just joined the network. They are looking for GTM guidance.', time: '1h ago', meta: 'Ecosystem', icon: Rocket, color: 'blue' },
        { id: 2, type: 'milestone', title: 'Milestone Completed', desc: 'Sarah Jenkins (EcoFlow) finished their Market Validation phase.', time: '3h ago', meta: 'Mentee Update', icon: CheckCircle2, color: 'green' },
        { id: 3, type: 'incubator', title: 'Incubator Applications Open', desc: 'Peak XV Surge 09 is now accepting early-stage fintech startups.', time: '6h ago', meta: 'Growth Opportunity', icon: Building, color: 'orange' },
        { id: 4, type: 'ranking', title: 'Mentor Ranking Update', desc: 'You have moved into the Top 5% of Fintech mentors this quarter.', time: '1d ago', meta: 'Reputation', icon: TrendingUp, color: 'purple' },
        { id: 5, type: 'milestone', title: 'Action Item Completed', desc: 'Michael Chen (PayBolt) updated their Sales Deck based on your feedback.', time: '2d ago', meta: 'Mentee Update', icon: Zap, color: 'pink' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Updates</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Real-time alerts for your mentees and sector opportunities.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-bold hover:text-white transition-all text-xs uppercase tracking-widest"><Filter size={14} /> Filter Feed</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-4">
                    {activities.map((act) => (
                        <div key={act.id} className="group bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex gap-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-${act.color}-500/10 flex items-center justify-center text-${act.color}-400 border border-${act.color}-500/20 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <act.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-black text-white group-hover:text-[#8B5CF6] transition-colors">{act.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{act.meta}</span>
                                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase"><Clock size={10} /> {act.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">{act.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="w-full py-6 bg-white/5 border border-dashed border-white/10 rounded-2xl text-xs font-black text-gray-600 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        View Older Updates <ArrowRight size={14} />
                    </button>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-xs">Activity Stats</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Impact Velocity</span>
                                <span className="text-sm font-black text-white">+18%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[82%] bg-gradient-to-r from-[#8B5CF6] to-indigo-500" />
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Mentee Progress</span>
                                    </div>
                                    <span className="text-xs font-black text-white">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Ecosystem Hits</span>
                                    </div>
                                    <span className="text-xs font-black text-white">42</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#8B5CF6] to-indigo-600 p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={48} /></div>
                        <h4 className="text-white font-black text-sm mb-2 relative z-10">Mentor Power</h4>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider relative z-10">Your reputation score is increasing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorActivityFeed;
