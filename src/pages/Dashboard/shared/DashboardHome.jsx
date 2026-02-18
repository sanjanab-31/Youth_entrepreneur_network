import React, { useState, useMemo } from 'react';
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
    FileText,
    Trash2,
    X,
    Save,
    Check,
    Calendar,
    UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { calculateExecutionScore } from '../../../utils/executionScore';

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

const DashboardHome = ({ role: propsRole }) => {
    const { user } = useAuth();
    const { startup, updateStartup, addMilestone, updateMilestone, deleteMilestone, addActivity, loading } = useStartup();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Ensure we use the role from the user object if available, fallback to props
    const role = user?.role || propsRole;
    const isFounder = role === 'founder';

    if (loading || !startup) return null;

    const stages = [
        { id: 'Idea', label: 'Idea' },
        { id: 'Validation', label: 'Validation' },
        { id: 'MVP', label: 'MVP' },
        { id: 'Revenue', label: 'Revenue' },
        { id: 'Scale', label: 'Scale' }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === startup.stage);
    // Always compute from shared utility — never read stored field
    const executionScore = calculateExecutionScore(startup);
    const profileCompletion = startup.profileCompletion || 0;

    // Hydrate assigned mentor name from users array
    const allUsers = JSON.parse(localStorage.getItem('vanguard_users') || '[]');
    const assignedMentor = startup.mentorAssigned
        ? allUsers.find(u => u.id === startup.mentorAssigned) || null
        : null;
    const assignedMentorName = assignedMentor?.name || assignedMentor?.email?.split('@')[0] || null;

    // Founder sessions from shared sessions array
    const allSessions = JSON.parse(localStorage.getItem('vanguard_sessions') || '[]');
    const founderSessions = allSessions
        .filter(s => s.startupId === startup.startupId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const handleUpdateTraction = () => {
        const newUsers = (startup.activeUsers || 0) + 100;
        updateStartup({ activeUsers: newUsers });
        addActivity(`Traction updated: ${newUsers.toLocaleString()} users`, 'milestone');
        triggerToast();
    };

    const triggerToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleAddMilestone = (e) => {
        e.preventDefault();
        const title = e.target.milestoneTitle.value;
        if (title) {
            addMilestone(title);
            e.target.reset();
            setIsMilestoneModalOpen(false);
            triggerToast();
        }
    };

    const getQuickActions = () => {
        if (startup.stage === 'Validation') {
            return [
                { label: "Update Traction", icon: TrendingUp, variant: "primary", onClick: handleUpdateTraction },
                { label: "Add Customer Interviews", icon: Users, onClick: () => setIsMilestoneModalOpen(true) },
                { label: "Request Mentor", icon: MessageSquare, onClick: () => alert("Mentor request sent!") }
            ];
        } else if (startup.stage === 'MVP') {
            return [
                { label: "Add Feature Release", icon: Zap, variant: "primary", onClick: () => setIsMilestoneModalOpen(true) },
                { label: "Improve Retention", icon: Activity, onClick: () => alert("Retention campaign started!") },
                { label: "Apply to Incubator", icon: Rocket, onClick: () => alert("Application submitted!") }
            ];
        } else if (startup.stage === 'Revenue' || startup.stage === 'Scale') {
            return [
                { label: "Scale Marketing", icon: TrendingUp, variant: "primary", onClick: () => alert("Marketing spend increased!") },
                { label: "Prepare Funding Deck", icon: FileText, onClick: () => alert("Deck generator started...") },
                { label: "Track Growth Metrics", icon: BarChart3, onClick: handleUpdateTraction }
            ];
        }
        return [
            { label: "Define Problem", icon: Target, variant: "primary", onClick: () => setIsEditModalOpen(true) },
            { label: "Research Market", icon: Search, onClick: () => setIsMilestoneModalOpen(true) },
            { label: "Build MVP", icon: Rocket, onClick: () => updateStartup({ stage: 'MVP' }) }
        ];
    };

    const alerts = [
        { t: 'No mentor assigned yet', condition: !startup.mentorAssigned, type: 'warning' },
        { t: 'Traction not updated in 14 days', condition: (new Date() - new Date(startup.lastTractionUpdate || 0)) > 14 * 24 * 60 * 60 * 1000, type: 'danger' },
        { t: 'Skill gap not filled', condition: startup.skillGap && !startup.skillGapFilled, type: 'warning' },
        { t: 'Profile incomplete (< 70%)', condition: profileCompletion < 70, type: 'warning' }
    ].filter(a => a.condition);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[110] bg-[#8B5CF6] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-black text-sm"
                    >
                        <Check size={18} />
                        Saved Successfully
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-[#8B5CF6]/20 shadow-sm">
                            {role} Portal
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Deployment: Active</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                        Welcome back, <span className="text-[#8B5CF6]">{user?.fullName?.split(' ')[0] || 'Founder'}</span>
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-3 mt-4">
                        <div className="flex items-center gap-2">
                            <Rocket size={14} className="text-[#8B5CF6]" />
                            <span className="text-xs md:text-sm font-bold text-gray-400">Startup: <span className="text-white">{startup.startupName}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-[#8B5CF6]" />
                            <span className="text-xs md:text-sm font-bold text-gray-400">Current Stage: <span className="text-white">{startup.stage}</span></span>
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

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="px-5 py-3 md:py-2.5 bg-[#1E1E2F] text-white text-xs font-bold rounded-xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all shadow-xl w-full sm:w-auto"
                    >
                        View Public Profile
                    </button>
                    {isFounder && (
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-5 py-3 md:py-2.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                        >
                            Edit Startup OS
                        </button>
                    )}
                </div>
            </div>

            {/* Structured Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Startup Stage" value={startup.stage} icon={Target} color="purple" />
                <StatCard label="Users / Traction" value={(startup.activeUsers || 0).toLocaleString()} subtext="active users" icon={Flame} color="orange" />
                <StatCard label="Burn Rate" value={`$${(startup.burnRate || 0).toLocaleString()}`} subtext="/ month" icon={Activity} color="red" />
                <StatCard label="Team Strength" value={`${startup.teamSize || 0} Members`} subtext={startup.skillGapFilled ? "fully formed" : "growing"} icon={Users2} color="blue" />
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

                        {/* Desktop Horizontal View */}
                        <div className="hidden md:block relative py-12 px-2">
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
                                                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center border-4 border-[#1E1E2F] transition-all duration-500
                                                    ${isCompleted || isCurrent
                                                        ? 'bg-[#8B5CF6] text-white shadow-xl shadow-[#8B5CF6]/20'
                                                        : 'bg-[#0F0F14] text-gray-700 border-[#0F0F14]'}`}
                                            >
                                                {isCompleted ? <CheckCircle2 size={18} /> : (isCurrent ? <Zap size={18} fill="currentColor" /> : <span className="text-sm font-bold">{idx + 1}</span>)}
                                            </motion.div>
                                            <div className="absolute mt-14 lg:mt-16 text-center">
                                                <p className={`text-[9px] lg:text-[10px] font-black uppercase tracking-tighter ${isCompleted || isCurrent ? 'text-white' : 'text-gray-700'}`}>
                                                    {stage.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile Vertical Stepper View */}
                        <div className="md:hidden space-y-4">
                            {stages.map((stage, idx) => {
                                const isCompleted = idx < currentStageIndex;
                                const isCurrent = idx === currentStageIndex;
                                return (
                                    <div key={stage.id} className="flex items-center gap-4 relative">
                                        {idx !== stages.length - 1 && (
                                            <div className={`absolute left-5 top-10 w-0.5 h-8 ${isCompleted ? 'bg-[#8B5CF6]' : 'bg-white/5'}`} />
                                        )}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#1E1E2F] shrink-0
                                            ${isCompleted || isCurrent ? 'bg-[#8B5CF6] text-white' : 'bg-[#0F0F14] text-gray-700'}`}>
                                            {isCompleted ? <CheckCircle2 size={16} /> : (isCurrent ? <Zap size={16} fill="currentColor" /> : <span className="text-xs font-bold">{idx + 1}</span>)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                                {stage.label}
                                            </p>
                                            {isCurrent && <span className="text-[10px] text-[#8B5CF6] font-bold">Currently Active</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Milestone List */}
                        {startup.milestones.length === 0 ? (
                            <div className="mt-20 p-10 rounded-2xl border border-dashed border-white/10 text-center">
                                <p className="text-gray-500 font-bold mb-4">No milestones added yet. Start building your roadmap.</p>
                                <button
                                    onClick={() => setIsMilestoneModalOpen(true)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all"
                                >
                                    Define First Milestone
                                </button>
                            </div>
                        ) : (
                            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {startup.milestones.slice(0, 4).map((ms) => (
                                    <div key={ms.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => updateMilestone(ms.id, { status: ms.status === 'completed' ? 'pending' : 'completed' })}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${ms.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}
                                            >
                                                {ms.status === 'completed' ? <CheckCircle2 size={18} /> : (ms.status === 'in-progress' ? <Zap size={18} /> : <Clock size={18} />)}
                                            </button>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{ms.status}</p>
                                                <p className={`text-sm font-bold truncate max-w-[150px] ${ms.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{ms.title}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteMilestone(ms.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setIsMilestoneModalOpen(true)}
                            className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-xs font-black text-gray-500 hover:text-white hover:border-[#8B5CF6]/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Add New Milestone
                        </button>
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
                            {alerts.length === 0 ? (
                                <div className="p-6 rounded-xl border border-green-500/10 bg-green-500/5 text-center">
                                    <ShieldCheck className="text-green-500 mx-auto mb-2" size={24} />
                                    <p className="text-xs font-bold text-green-400">All systems clear. Execution optimal.</p>
                                </div>
                            ) : (
                                alerts.map((alert, i) => (
                                    <div key={i} className={`p-4 rounded-xl border flex gap-3 ${alert.type === 'danger' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                                        <AlertTriangle size={16} className={alert.type === 'danger' ? 'text-red-400' : 'text-yellow-400'} />
                                        <p className={`text-xs font-bold leading-relaxed ${alert.type === 'danger' ? 'text-red-300' : 'text-yellow-300'}`}>{alert.t}</p>
                                    </div>
                                ))
                            )}
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

                        {/* Mentor Assignment Status */}
                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <UserCheck className="text-[#8B5CF6]" size={18} /> Mentorship
                            </h4>
                            {assignedMentor ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-[#8B5CF6]/5 rounded-2xl border border-[#8B5CF6]/20">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center font-bold text-white uppercase text-lg flex-shrink-0">
                                            {assignedMentorName?.[0] || 'M'}
                                        </div>
                                        <div>
                                            <p className="text-white font-black">{assignedMentorName}</p>
                                            <p className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest">Active Mentor</p>
                                            {startup.mentorshipStartDate && (
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    Since {new Date(startup.mentorshipStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-green-500/5 rounded-xl border border-green-500/20">
                                        <ShieldCheck size={14} className="text-green-400" />
                                        <span className="text-xs font-bold text-green-400">Mentorship Active</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-[11px] text-gray-500 font-bold mb-4">No mentor assigned yet. Request one to accelerate growth.</p>
                                    <button
                                        onClick={() => alert("Redirecting to Mentor Network...")}
                                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-black hover:bg-white/10 transition-all"
                                    >
                                        Browse Mentor Network
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Founder Sessions Panel */}
                        {founderSessions.length > 0 && (
                            <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Calendar className="text-[#8B5CF6]" size={18} /> Sessions
                                </h4>
                                <div className="space-y-3">
                                    {founderSessions.map(session => (
                                        <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div>
                                                <p className="text-xs font-bold text-white">{session.date} · {session.time}</p>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${session.status === 'completed' ? 'text-green-400' :
                                                        session.status === 'upcoming' ? 'text-[#8B5CF6]' : 'text-gray-500'
                                                    }`}>{session.status}</p>
                                            </div>
                                            {session.status === 'completed' && session.notes && (
                                                <CheckCircle2 size={16} className="text-green-400" />
                                            )}
                                        </div>
                                    ))}
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
            {/* Dashboard Modals */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center md:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full h-full md:h-auto md:max-w-lg bg-[#1E1E2F] border border-white/10 md:rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white">Startup Configuration</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white p-2"><X size={24} /></button>
                            </div>
                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                updateStartup({
                                    startupName: formData.get('startupName'),
                                    stage: formData.get('stage'),
                                    activeUsers: parseInt(formData.get('activeUsers')),
                                    burnRate: parseInt(formData.get('burnRate')),
                                    teamSize: parseInt(formData.get('teamSize'))
                                });
                                setIsEditModalOpen(false);
                                triggerToast();
                            }}>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Startup Name</label>
                                    <input name="startupName" defaultValue={startup.startupName} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Stage</label>
                                        <select name="stage" defaultValue={startup.stage} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6]">
                                            {stages.map(s => <option key={s.id} value={s.id} className="bg-[#1E1E2F]">{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Active Users</label>
                                        <input name="activeUsers" type="number" defaultValue={startup.activeUsers} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Burn Rate ($)</label>
                                        <input name="burnRate" type="number" defaultValue={startup.burnRate} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Team Size</label>
                                        <input name="teamSize" type="number" defaultValue={startup.teamSize} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6]" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full mt-6 py-4 bg-[#8B5CF6] text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2">
                                    <Save size={20} /> Deploy Changes
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isMilestoneModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center md:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMilestoneModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full h-full md:h-auto md:max-w-md bg-[#1E1E2F] border border-white/10 md:rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-white">New Milestone</h2>
                                <button onClick={() => setIsMilestoneModalOpen(false)} className="text-gray-500 hover:text-white p-2"><X size={24} /></button>
                            </div>
                            <form className="space-y-6" onSubmit={handleAddMilestone}>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Milestone Objective</label>
                                    <textarea name="milestoneTitle" required placeholder="e.g., Finalize Series A Pitch Deck" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] h-32" />
                                </div>
                                <button type="submit" className="w-full py-4 bg-[#8B5CF6] text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2">
                                    <Check size={20} /> Add to Roadmap
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isPreviewModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center md:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPreviewModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full h-full md:h-auto md:max-w-2xl bg-[#0F0F14] border border-white/10 md:rounded-3xl p-1 overflow-hidden shadow-2xl overflow-y-auto">
                            <div className="bg-[#1E1E2F] md:rounded-[22px] p-6 md:p-8 h-full md:h-auto overflow-y-auto">
                                <div className="flex justify-between items-start mb-8 md:mb-12">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest rounded border border-[#8B5CF6]/30">Vanguard Verified</span>
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-white mb-2">{startup.startupName}</h2>
                                        <p className="text-xs md:text-gray-500 font-bold">{startup.stage} Stage • {startup.expertiseSector || 'Tech'}</p>
                                    </div>
                                    <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors transition-colors"><X size={24} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">The Problem</h4>
                                            <p className="text-sm text-gray-300 leading-relaxed">{startup.problemStatement}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Execution Score</h4>
                                            <div className="flex items-center gap-4">
                                                <div className="text-3xl font-black text-[#8B5CF6]">{executionScore}%</div>
                                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#8B5CF6]" style={{ width: `${executionScore}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Core Metrics</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">Active Users</span>
                                                <span className="text-sm font-bold text-white">{startup.activeUsers.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">Team Size</span>
                                                <span className="text-sm font-bold text-white">{startup.teamSize}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">Milestones</span>
                                                <span className="text-sm font-bold text-white">{startup.milestones.length} defined</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors">
                                    Contact Founder
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardHome;
