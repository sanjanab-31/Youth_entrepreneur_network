
import React from 'react';
import {
    Users,
    Flame,
    Users2,
    MessageSquare,
    Plus,
    Zap,
    Search,
    TrendingUp,
    CheckCircle2,
    Clock,
    Target,
    Rocket,
    AlertTriangle,
    ShieldCheck,
    BarChart3,
    Activity,
    ArrowUpRight,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';

const StatCard = ({ label, value, icon: Icon, color, subtext }) => {
    const colorMap = {
        purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', shadow: 'shadow-purple-500/5', bar: 'from-purple-500/50 to-purple-500/20' },
        orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', shadow: 'shadow-orange-500/5', bar: 'from-orange-500/50 to-orange-500/20' },
        red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', shadow: 'shadow-red-500/5', bar: 'from-red-500/50 to-red-500/20' },
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', shadow: 'shadow-blue-500/5', bar: 'from-blue-500/50 to-blue-500/20' },
    };

    const styles = colorMap[color] || colorMap.purple;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all shadow-xl shadow-black/20 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Icon size={64} />
            </div>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${styles.bg} border ${styles.border} shadow-lg ${styles.shadow}`}>
                    <Icon className={styles.text} size={24} />
                </div>
            </div>
            <div>
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">{value}</span>
                    {subtext && <span className="text-[10px] text-gray-400 font-bold">{subtext}</span>}
                </div>
            </div>
            <div className="mt-4 h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${styles.bar}`}
                />
            </div>
        </motion.div>
    );
};

const QuickAction = ({ label, icon: Icon, onClick, variant = "default" }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 p-4 rounded-xl transition-all group w-full text-left border ${variant === "primary"
            ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20"
            : "bg-[#1E1E2F] border-white/5 hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5"
            }`}
    >
        <div className={`p-2 rounded-lg ${variant === "primary" ? "bg-[#8B5CF6]/20" : "bg-white/5 group-hover:bg-[#8B5CF6]/20 transition-colors"}`}>
            <Icon size={18} className={variant === "primary" ? "text-[#8B5CF6]" : "text-gray-400 group-hover:text-[#8B5CF6]"} />
        </div>
        <span className={`font-bold text-sm ${variant === "primary" ? "text-white" : "text-gray-300 group-hover:text-white"}`}>{label}</span>
        <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#8B5CF6]" />
    </button>
);

const DashboardHome = ({ role: initialRole }) => {
    const { user } = useAuth();
    const { startup, addMilestone, updateStartup, addActivity, loading } = useStartup();

    if (loading || !startup) return null;

    const stages = [
        { id: 'Idea', label: 'Idea' },
        { id: 'Validation', label: 'Validation' },
        { id: 'MVP', label: 'MVP' },
        { id: 'Early Traction', label: 'Early Traction' },
        { id: 'Scaling', label: 'Scaling' }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === startup.stage);
    const executionScore = startup.milestones?.length > 0
        ? Math.round((startup.milestones.filter(m => m.status === 'completed').length / startup.milestones.length) * 100)
        : 0;

    const profileCompletion = startup.profileCompletion || 0;

    const handleUpdateTraction = () => {
        const newUsers = (startup.activeUsers || 0) + 50;
        updateStartup({ activeUsers: newUsers });
        addActivity(`Traction updated: ${newUsers.toLocaleString()} users`, 'milestone');
    };

    const handleRequestMentor = () => {
        updateStartup({ mentor: { name: "Sarah Chen", role: "Growth Expert" } });
        addActivity("Mentor requested: Sarah Chen", 'session');
        alert("Mentor request sent to Sarah Chen!");
    };

    const handleApplyIncubator = () => {
        addActivity("Applied to Vanguard Accelerator", "milestone");
        alert("Application submitted to Vanguard Accelerator!");
    };

    const getQuickActions = () => {
        if (startup.stage === 'Idea') {
            return [
                { label: "Add Problem Validation", icon: Target, variant: "primary", onClick: () => addMilestone("Problem Validation Phase 1") },
                { label: "Add Customer Interview", icon: Users, onClick: () => addMilestone("Customer Interview #5") },
                { label: "Request Mentor", icon: MessageSquare, onClick: handleRequestMentor }
            ];
        } else if (startup.stage === 'MVP' || startup.stage === 'Validation') {
            return [
                { label: "Update Traction", icon: TrendingUp, variant: "primary", onClick: handleUpdateTraction },
                { label: "Add Feature Release", icon: Zap, onClick: () => addMilestone("New Feature: Analytics Dashboard") },
                { label: "Apply to Incubator", icon: Rocket, onClick: handleApplyIncubator }
            ];
        }
        return [
            { label: "Update Metrics", icon: BarChart3, variant: "primary", onClick: handleUpdateTraction },
            { label: "Scale Operations", icon: Rocket, onClick: () => addActivity("Operation scaling initiated", "milestone") },
            { label: "Investor Pitch", icon: FileText, onClick: () => alert("Generating pitch deck...") }
        ];
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-[#8B5CF6]/20 shadow-sm">
                            {initialRole} Portal
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Deployment: Active</span>
                    </div>

                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        Welcome back, <span className="text-[#8B5CF6]">{user?.fullName?.split(' ')[0] || 'Founder'}</span>
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                        <div className="flex items-center gap-2">
                            <Rocket size={14} className="text-[#8B5CF6]" />
                            <span className="text-sm font-bold text-gray-400">Startup: <span className="text-white">{startup.startupName}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-[#8B5CF6]" />
                            <span className="text-sm font-bold text-gray-400">Current Stage: <span className="text-white">{startup.stage}</span></span>
                        </div>
                    </div>

                    {/* Profile Completion Bar */}
                    <div className="mt-8 max-w-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Profile Completion</span>
                            <span className="text-[10px] font-black text-white">{profileCompletion}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${profileCompletion}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#8B5CF6] to-purple-400 rounded-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-[#1E1E2F] text-white text-xs font-bold rounded-xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all shadow-xl">
                        View Public Profile
                    </button>
                    <button className="px-5 py-2.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:scale-105 active:scale-95 transition-all">
                        Edit Startup OS
                    </button>
                </div>
            </div>

            {/* Structured Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Startup Stage" value={startup.stage} icon={Target} color="purple" />
                <StatCard label="Users / Traction" value={(startup.activeUsers || 0).toLocaleString()} subtext="active users" icon={Flame} color="orange" />
                <StatCard label="Burn Rate" value={`$${(startup.burnRate || 0).toLocaleString()}`} subtext="/ month" icon={Activity} color="red" />
                <StatCard label="Team Strength" value={`${startup.teamSize || 0} Members`} subtext="fully formed" icon={Users2} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Execution Roadmap */}
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                            <div>
                                <h3 className="text-xl font-black text-white flex items-center gap-3 mb-1">
                                    <BarChart3 className="text-[#8B5CF6]" size={20} />
                                    Execution Roadmap
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">Strategic milestones to reach the next stage</p>
                            </div>
                            <div className="bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Execution Score</span>
                                <span className="text-xl font-black text-[#8B5CF6]">{executionScore}%</span>
                            </div>
                        </div>

                        <div className="relative py-12 px-2">
                            {/* Connector Line */}
                            <div className="absolute top-[48px] left-0 right-0 h-[2px] bg-white/5 rounded-full" />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute top-[48px] left-0 h-[2px] bg-gradient-to-r from-purple-600 to-[#8B5CF6] rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] z-0"
                            />

                            <div className="relative flex justify-between z-10">
                                {stages.map((stage, idx) => {
                                    const isCompleted = idx < currentStageIndex;
                                    const isCurrent = idx === currentStageIndex;
                                    return (
                                        <div key={stage.id} className="flex flex-col items-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-[#1E1E2F] transition-all duration-500
                                                    ${isCompleted || isCurrent
                                                        ? 'bg-[#8B5CF6] text-white shadow-xl shadow-[#8B5CF6]/20'
                                                        : 'bg-[#0F0F14] text-gray-700 border-[#0F0F14]'}`}
                                            >
                                                {isCompleted ? <CheckCircle2 size={20} /> : (isCurrent ? <Zap size={20} fill="currentColor" /> : <span className="text-sm font-bold">{idx + 1}</span>)}
                                            </motion.div>
                                            <div className="absolute mt-16 text-center">
                                                <p className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted || isCurrent ? 'text-white' : 'text-gray-700'}`}>
                                                    {stage.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Milestone Empty State Example */}
                        {startup.milestones.length === 0 ? (
                            <div className="mt-20 p-10 rounded-2xl border border-dashed border-white/10 text-center">
                                <p className="text-gray-500 font-bold">No milestones added yet. Start building execution roadmap.</p>
                                <button className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all">
                                    Define First Milestone
                                </button>
                            </div>
                        ) : (
                            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {startup.milestones.slice(0, 2).map((ms, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ms.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                            {ms.status === 'completed' ? <CheckCircle2 size={18} /> : (ms.status === 'in-progress' ? <Zap size={18} /> : <Clock size={18} />)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{ms.status === 'completed' ? 'Completed' : 'Active Milestone'}</p>
                                            <p className="text-sm font-bold text-white truncate max-w-[200px]">{ms.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Skill Gap & Activity Feed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Skill Gap Card */}
                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 flex flex-col">
                            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Users size={16} /> Team Growth
                            </h4>
                            <div className={`mt-auto p-6 rounded-2xl border ${startup.skillGapFilled ? 'bg-green-500/5 border-green-500/20' : 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20'} relative overflow-hidden group`}>
                                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
                                    <Users2 size={60} />
                                </div>
                                {startup.skillGapFilled ? (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <p className="text-white font-black text-lg">Team Fully Formed</p>
                                        <p className="text-xs text-gray-500 font-bold mt-1">Core foundational roles assigned ✅</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Looking For:</p>
                                        <p className="text-white font-black text-xl mb-2">{startup.skillGap || "Talent"}</p>
                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[8px] font-black uppercase rounded">High Priority</span>
                                        <button className="w-full mt-6 py-2.5 bg-[#8B5CF6] text-white text-xs font-black rounded-lg hover:shadow-lg transition-all">
                                            Search Candidates
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity size={16} /> Activity Stream
                            </h4>
                            <div className="space-y-6">
                                {(startup.activity || []).slice(0, 5).map((act, i) => (
                                    <div key={act.id || i} className="flex gap-4 relative">
                                        {i !== Math.min((startup.activity || []).length, 5) - 1 && <div className="absolute left-2.5 top-7 bottom-0 w-px bg-white/5" />}
                                        <div className={`w-5 h-5 rounded-full mt-1 flex items-center justify-center z-10 ${act.type === 'milestone' ? 'bg-purple-500' : 'bg-blue-500'} ring-4 ring-[#1E1E2F]`}>
                                            {act.type === 'milestone' ? <Zap size={10} className="text-white" /> : <MessageSquare size={10} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-300 leading-snug">{act.msg}</p>
                                            <p className="text-[10px] text-gray-600 font-bold mt-1">{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Side Panel) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Execution Alerts */}
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500" size={18} />
                            Execution Alerts
                        </h4>
                        <div className="space-y-4">
                            {[
                                { t: 'No mentor assigned', type: 'warning', condition: !startup.mentor },
                                { t: 'Traction not updated in 14 days', type: 'danger', condition: true },
                                { t: 'Skill gap not filled', type: 'warning', condition: !startup.coFounder }
                            ].filter(a => a.condition).map((alert, i) => (
                                <div key={i} className={`p-4 rounded-xl border flex gap-3 ${alert.type === 'danger' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                                    <AlertTriangle size={16} className={alert.type === 'danger' ? 'text-red-400' : 'text-yellow-400'} />
                                    <p className={`text-xs font-bold leading-relaxed ${alert.type === 'danger' ? 'text-red-300' : 'text-yellow-300'}`}>{alert.t}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap className="text-yellow-400" size={18} />
                            Contextual Focus
                        </h4>
                        <div className="space-y-4">
                            {getQuickActions().map((action, i) => (
                                <QuickAction key={i} {...action} />
                            ))}
                        </div>

                        {/* No Mentor Empty State */}
                        {!startup.mentor && (
                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <p className="text-[11px] text-gray-500 font-bold mb-4">Request your first mentor to accelerate growth.</p>
                                <button
                                    onClick={handleRequestMentor}
                                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-black hover:bg-white/10 transition-all"
                                >
                                    Browse Mentor Network
                                </button>
                            </div>
                        )}
                        {startup.mentor && (
                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white uppercase">
                                    {startup.mentor.name[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white">{startup.mentor.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{startup.mentor.role}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pro Upgrade Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                            <Rocket size={100} />
                        </div>
                        <h4 className="text-white font-black text-xl mb-3 relative z-10">Scale Your Vision</h4>
                        <p className="text-white/80 text-xs leading-relaxed mb-6 relative z-10 font-medium">Get priority access to top-tier investors and specialized incubators to fuel your next stage.</p>
                        <button className="px-6 py-3 bg-white text-[#8B5CF6] text-xs font-black rounded-xl relative z-10 hover:shadow-2xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                            Upgrade Plan <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
