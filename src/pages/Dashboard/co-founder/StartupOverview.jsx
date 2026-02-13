
import React from 'react';
import {
    Rocket,
    User,
    Shield,
    CheckCircle2,
    Clock,
    MessageSquare,
    Plus,
    TrendingUp,
    Layout,
    Users
} from 'lucide-react';

const StartupOverview = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                            Co-Founder View
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Nebula AI Portfolio</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Startup <span className="text-blue-400">Overview</span>
                    </h1>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-2">
                    <Plus size={18} /> Add Weekly Update
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Startup & Founder Info */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Startup Identity</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xl text-white">N</div>
                                <div>
                                    <p className="font-black text-white">Nebula AI</p>
                                    <p className="text-xs text-gray-500">Edge AI for Retailers</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase mb-2">Stage</p>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">Validation</span>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase mb-4">Lead Founder</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs border border-orange-500/30">SS</div>
                                    <span className="font-bold text-gray-300">Siddharth Sharma</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skill Gap Status */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 border-l-4 border-l-[#8B5CF6]">
                        <h3 className="text-lg font-black text-white mb-4">Market Presence</h3>
                        <p className="text-xs text-gray-500 mb-6">Current visibility status in the Vanguard network.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-400">Profile Quality</span>
                                <span className="text-sm font-black text-white">92%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[92%] bg-[#8B5CF6]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Responsibilities & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Assigned Responsibilities */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8">
                            <Shield className="text-blue-400" size={20} />
                            Your Responsibilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { t: 'Tech Architecture', s: 'Core infrastructure design & edge optimization' },
                                { t: 'Team Management', s: 'Overseeing junior developers & interns' },
                                { t: 'DevOps & Scaling', s: 'Cloud setup and automated deployment' },
                                { t: 'Product Roadmap', s: 'Defining technical milestones for MVP' }
                            ].map((item, i) => (
                                <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                                    <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.t}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.s}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Milestone Progress */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <TrendingUp className="text-green-400" size={20} />
                                Technical Milestone Progress
                            </h3>
                            <button className="text-blue-400 text-xs font-black uppercase hover:underline">View History</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { t: 'Edge Inference Optimization', p: 85, d: 'Due in 4 days' },
                                { t: 'Intermittent Sync Protocol', p: 40, d: 'Due in 12 days' },
                                { t: 'Admin Dashboard v1', p: 100, d: 'Completed' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-gray-200">{item.t}</p>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.d}</p>
                                        </div>
                                        <span className={`text-sm font-black ${item.p === 100 ? 'text-green-500' : 'text-blue-400'}`}>{item.p}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${item.p === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                            style={{ width: `${item.p}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mentorship Sessions */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                            <Users className="text-orange-400" size={20} />
                            Upcoming Technical Mentorship
                        </h3>
                        <div className="rounded-xl border border-white/5 overflow-hidden">
                            <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                    <Clock size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">Review on ML Edge Optimization</p>
                                    <p className="text-xs text-gray-500 font-medium">with Dr. Aman Singh • Tomorrow at 4:30 PM</p>
                                </div>
                                <button className="px-4 py-2 bg-white/5 text-xs font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-all">Join Link</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupOverview;
