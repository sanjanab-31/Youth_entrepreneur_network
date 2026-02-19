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
    Users,
    Target,
    BarChart3
} from 'lucide-react';
import { useStartup } from '../../../context/StartupContext';
import { useAuth } from '../../../context/AuthContext';
import { calculateExecutionScore } from '../../../utils/executionScore';

const StartupOverview = () => {
    const { startup, loading } = useStartup();
    const { user } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
    );

    if (!startup) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10">
            <Rocket className="text-gray-700 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-500">No Startup Linked</h2>
            <p className="text-gray-600 mt-2">You haven't been assigned to a startup yet.</p>
        </div>
    );

    const executionScore = calculateExecutionScore(startup);
    const completedMilestones = startup.milestones?.filter(m => m.status === 'completed') || [];
    const pendingMilestones = startup.milestones?.filter(m => m.status !== 'completed') || [];

    // Filter sessions for this startup
    const allSessions = JSON.parse(localStorage.getItem('vanguard_sessions') || '[]');
    const startupSessions = allSessions
        .filter(s => s.startupId === startup.startupId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const nextSession = startupSessions.find(s => s.status === 'upcoming');

    // Get lead founder name
    const allUsersRaw = localStorage.getItem('vanguard_users');
    let allUsers = {};
    try {
        allUsers = JSON.parse(allUsersRaw || '{}');
        if (Array.isArray(allUsers)) {
            allUsers = allUsers.reduce((acc, u) => {
                if (u.uid || u.id) acc[u.uid || u.id] = u;
                return acc;
            }, {});
        }
    } catch (e) { allUsers = {}; }

    const founder = allUsers[startup.founderId];
    const founderName = founder?.name || founder?.email?.split('@')[0] || 'Original Founder';

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
                        <span className="text-gray-400 text-sm font-medium">{startup.startupName} Portfolio</span>
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
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xl text-white">
                                    {startup.startupName?.[0] || 'S'}
                                </div>
                                <div>
                                    <p className="font-black text-white">{startup.startupName}</p>
                                    <p className="text-xs text-gray-500">{startup.oneLiner || 'Strategic Innovation'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase mb-2">Stage</p>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">{startup.stage}</span>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase mb-4">Lead Founder</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs border border-orange-500/30">
                                        {founderName[0]}
                                    </div>
                                    <span className="font-bold text-gray-300">{founderName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Execution Status */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 border-l-4 border-l-[#8B5CF6]">
                        <h3 className="text-lg font-black text-white mb-4">Market Presence</h3>
                        <p className="text-xs text-gray-500 mb-6">Current visibility status in the Vanguard network.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-400">Execution Score</span>
                                <span className="text-sm font-black text-white">{executionScore}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#8B5CF6]" style={{ width: `${executionScore}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Responsibilities & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Focus Areas (instead of static responsibilities) */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8">
                            <Shield className="text-blue-400" size={20} />
                            Active Focus Areas
                        </h3>
                        {startup.focusAreas?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {startup.focusAreas.map((area, i) => (
                                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                                        <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors uppercase text-xs tracking-widest">{area}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">Strategic priority for {startup.stage} phase.</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No specific focus areas defined for this startup yet.</p>
                        )}
                    </div>

                    {/* Milestone Progress */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <TrendingUp className="text-green-400" size={20} />
                                Technical Milestone Progress
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {startup.milestones?.length > 0 ? (
                                startup.milestones.slice(0, 4).map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="font-bold text-gray-200">{item.title}</p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.status}</p>
                                            </div>
                                            <span className={`text-sm font-black ${item.status === 'completed' ? 'text-green-500' : 'text-blue-400'}`}>
                                                {item.status === 'completed' ? '100%' : 'In Progress'}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${item.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'}`}
                                                style={{ width: item.status === 'completed' ? '100%' : '50%' }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-sm">No milestones tracked in the OS yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Mentorship Sessions */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                            <Users className="text-orange-400" size={20} />
                            Upcoming Mentorship
                        </h3>
                        {nextSession ? (
                            <div className="rounded-xl border border-white/5 overflow-hidden">
                                <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                        <Clock size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-sm">Advisory Session</p>
                                        <p className="text-xs text-gray-500 font-medium">{nextSession.date} at {nextSession.time}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white/5 text-xs font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-all">Join Link</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No upcoming sessions scheduled.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupOverview;
