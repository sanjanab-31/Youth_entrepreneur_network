
import React, { useState, useEffect, useRef } from 'react';
import {
    Rocket,
    Target,
    Users,
    TrendingUp,
    CheckCircle2,
    FileText,
    Plus,
    Layout,
    ClipboardList,
    AlertCircle,
    Download,
    Zap,
    Save,
    Trash2,
    Edit3,
    X,
    MoreVertical,
    Check,
    Clock,
    Upload,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStartup, calculateExecutionScore } from '../../../context/StartupContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getSystem } from '../../../utils/system';
import { MessageSquare, UserCheck } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title, children }) => (
    <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
            <Icon className="text-[#8B5CF6]" size={20} />
            {title}
        </h3>
        {children}
    </div>
);

const Toast = ({ message, visible }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 right-8 z-50 bg-[#8B5CF6] text-white px-6 py-3 rounded-xl shadow-2xl shadow-[#8B5CF6]/40 flex items-center gap-2 font-bold"
            >
                <Check size={18} />
                {message}
            </motion.div>
        )}
    </AnimatePresence>
);

const MetricItem = ({ label, value, onEdit }) => (
    <div className="p-4 rounded-xl bg-[#1E1E2F] border border-white/5 relative group hover:border-[#8B5CF6]/30 transition-all cursor-pointer overflow-hidden" onClick={onEdit}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest relative z-10">{label}</p>
        <p className="text-lg font-bold text-white mt-1 relative z-10">{value}</p>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all z-10">
            <Edit3 size={14} className="text-[#8B5CF6]" />
        </div>
    </div>
);

const MyStartup = () => {
    const {
        startup,
        updateStartup,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addDocument,
        deleteDocument,
        renameDocument,
        createStartup,
        loading
    } = useStartup();
    const { user } = useAuth();
    const navigate = useNavigate();
    const role = user?.role === 'co-founder' ? 'co-founder' : 'founder';

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "" });
    const [editingSection, setEditingSection] = useState(null); // 'problem', 'solution', 'audience'
    const [editValue, setEditValue] = useState("");
    const fileInputRef = useRef(null);

    // Hydrate mentor details from SSOT
    const system = getSystem();
    const allUsers = system.users || {};
    const mentor = startup?.mentorAssigned ? allUsers[startup.mentorAssigned] : null;
    const mentorName = mentor?.name || mentor?.email?.split('@')[0] || 'Unknown Mentor';

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: "" }), 3000);
    };

    if (loading) return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="text-[#8B5CF6] animate-spin" size={48} />
        </div>
    );

    if (!startup && role === 'founder') {
        return (
            <div className="max-w-4xl mx-auto py-10 px-6">
                <div className="bg-[#1E1E2F] rounded-3xl border border-white/10 p-10 shadow-2xl">
                    <div className="flex items-center gap-6 mb-10 pb-6 border-b border-white/5">
                        <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center border border-[#8B5CF6]/30">
                            <Rocket className="text-[#8B5CF6]" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white">Let's Build Your Venture</h2>
                            <p className="text-gray-400 font-medium">Initialize your Startup OS to unlock the full founder experience.</p>
                        </div>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = Object.fromEntries(formData.entries());
                        createStartup(data);
                    }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Startup Name</label>
                                <input name="startupName" required placeholder="Vanguard OS" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Primary Sector</label>
                                <select name="sector" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all">
                                    <option value="" className="bg-[#1E1E2F]">Select Sector</option>
                                    <option value="fintech" className="bg-[#1E1E2F]">Fintech</option>
                                    <option value="edtech" className="bg-[#1E1E2F]">Edtech</option>
                                    <option value="healthtech" className="bg-[#1E1E2F]">Healthtech</option>
                                    <option value="saas" className="bg-[#1E1E2F]">SaaS</option>
                                    <option value="ai" className="bg-[#1E1E2F]">AI/ML</option>
                                    <option value="other" className="bg-[#1E1E2F]">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Venture Mission (Problem Statement)</label>
                            <textarea name="problemStatement" required placeholder="What problem are you solving? (max 150 words)" rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all resize-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Stage</label>
                                <select name="stage" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all">
                                    <option value="Idea" className="bg-[#1E1E2F]">Idea</option>
                                    <option value="Validation" className="bg-[#1E1E2F]">Validation</option>
                                    <option value="MVP" className="bg-[#1E1E2F]">MVP</option>
                                    <option value="Revenue" className="bg-[#1E1E2F]">Revenue</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Team Size</label>
                                <input name="teamSize" type="number" min="1" defaultValue="1" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Key Skill Gaps</label>
                                <input name="lookingFor" placeholder="e.g., CTO, Marketing" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-5 bg-[#8B5CF6] text-white font-black rounded-xl shadow-xl shadow-[#8B5CF6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                            <Rocket size={20} />
                            Launch Startup OS
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!startup) return null;

    const handleUpdate = (data, message = "Changes saved") => {
        updateStartup(data);
        showToast(message);
    };

    const handleInlineSave = (section) => {
        if (section === 'audience') {
            const arr = editValue.split('\n').filter(t => t.trim() !== "");
            handleUpdate({ targetAudience: arr });
        } else if (section === 'focusAreas') {
            const arr = editValue.split('\n').filter(t => t.trim() !== "");
            handleUpdate({ focusAreas: arr });
        } else {
            handleUpdate({ [section]: editValue });
        }
        setEditingSection(null);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const size = (file.size / (1024 * 1024)).toFixed(1) + "MB";
            addDocument(file.name, size);
            showToast("Document added");
        }
    };

    const executionPercentage = calculateExecutionScore(startup);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <Toast {...toast} />

            {/* Modal for Startup Info */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsEditModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full h-full md:h-auto md:max-w-lg bg-[#1E1E2F] border border-white/10 md:rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white">Edit Startup Info</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white transition-colors p-2">
                                    <X size={28} />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = {
                                    startupName: formData.get('startupName'),
                                    stage: formData.get('stage'),
                                    fundingGoal: formData.get('fundingGoal'),
                                    activeUsers: parseInt(formData.get('activeUsers')),
                                    burnRate: parseInt(formData.get('burnRate'))
                                };
                                handleUpdate(data, "Updated Successfully");
                                setIsEditModalOpen(false);
                            }}>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Startup Name</label>
                                    <input name="startupName" defaultValue={startup.startupName} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Stage</label>
                                    <select name="stage" defaultValue={startup.stage} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all appearance-none">
                                        <option value="Idea">Idea</option>
                                        <option value="Validation">Validation</option>
                                        <option value="MVP">MVP</option>
                                        <option value="Revenue">Revenue</option>
                                        <option value="Scale">Scale</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Funding Goal</label>
                                        <input name="fundingGoal" defaultValue={startup.fundingGoal} placeholder="e.g. $500k Pre-Seed" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Users</label>
                                        <input type="number" name="activeUsers" defaultValue={startup.activeUsers} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Burn Rate ($)</label>
                                    <input type="number" name="burnRate" defaultValue={startup.burnRate} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6] transition-all" />
                                </div>
                                <button type="submit" className="w-full py-4 bg-[#8B5CF6] text-white font-black rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-2 mt-4">
                                    <Save size={20} /> Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <span className="w-fit px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/30">
                            Founder View
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 sm:w-32 h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-purple-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${startup.profileCompletion}%` }}
                                />
                            </div>
                            <span className="text-gray-400 text-[10px] md:text-xs font-bold whitespace-nowrap">Profile Completion: {startup.profileCompletion}%</span>
                        </div>
                    </div>
                    <div className="group relative flex items-center gap-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            {startup.startupName} <span className="text-[#8B5CF6]">Platform</span>
                        </h1>
                        <button
                            onClick={() => {
                                const newName = prompt("Rename Startup:", startup.startupName);
                                if (newName) handleUpdate({ startupName: newName });
                            }}
                            className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 shrink-0"
                        >
                            <Edit3 size={18} className="text-[#8B5CF6]" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 bg-[#1E1E2F] text-white text-xs md:text-sm font-bold rounded-xl border border-white/5 hover:border-white/10 transition-all w-full sm:w-auto">
                        <Download size={18} /> Export Pitch Deck
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-5 py-3 md:py-2.5 bg-[#8B5CF6] text-white text-xs md:text-sm font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Edit3 size={18} /> Edit Startup Info
                    </button>
                </div>
            </div>

            {/* Structured Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricItem label="Current Stage" value={startup.stage} onEdit={() => setIsEditModalOpen(true)} />
                <MetricItem label="Funding Goal" value={startup.fundingGoal || "No funding goal set."} onEdit={() => setIsEditModalOpen(true)} />
                <MetricItem label="Internal Team" value={`${startup.teamSize || 0} Members`} onEdit={() => setIsEditModalOpen(true)} />
                <MetricItem label="Burn Rate" value={`$${(startup.burnRate || 0).toLocaleString()} / Mo`} onEdit={() => setIsEditModalOpen(true)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Identity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Problem & Solution */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 space-y-8">
                        <div>
                            <SectionHeader icon={AlertCircle} title="Problem Statement">
                                {editingSection !== 'problemStatement' && (
                                    <button
                                        onClick={() => {
                                            setEditingSection('problemStatement');
                                            setEditValue(startup.problemStatement);
                                        }}
                                        className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}
                            </SectionHeader>
                            {editingSection === 'problemStatement' ? (
                                <div className="space-y-4">
                                    <textarea
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full bg-white/5 border border-[#8B5CF6]/50 rounded-xl p-4 text-gray-300 focus:outline-none h-32"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
                                        <button onClick={() => handleInlineSave('problemStatement')} className="px-4 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-lg shadow-lg">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    onClick={() => {
                                        setEditingSection('problemStatement');
                                        setEditValue(startup.problemStatement);
                                    }}
                                    className="text-gray-400 leading-relaxed font-medium cursor-pointer hover:text-gray-300 transition-colors"
                                >
                                    {startup.problemStatement || "No problem statement defined."}
                                </p>
                            )}
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <SectionHeader icon={Zap} title="Solution Overview">
                                {editingSection !== 'solutionOverview' && (
                                    <button
                                        onClick={() => {
                                            setEditingSection('solutionOverview');
                                            setEditValue(startup.solutionOverview);
                                        }}
                                        className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}
                            </SectionHeader>
                            {editingSection === 'solutionOverview' ? (
                                <div className="space-y-4">
                                    <textarea
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full bg-white/5 border border-[#8B5CF6]/50 rounded-xl p-4 text-gray-300 focus:outline-none h-32"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
                                        <button onClick={() => handleInlineSave('solutionOverview')} className="px-4 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-lg shadow-lg">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p
                                    onClick={() => {
                                        setEditingSection('solutionOverview');
                                        setEditValue(startup.solutionOverview);
                                    }}
                                    className="text-gray-400 leading-relaxed font-medium cursor-pointer hover:text-gray-300 transition-colors"
                                >
                                    {startup.solutionOverview || "No solution overview defined."}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Milestone Checklist */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={ClipboardList} title="Milestone Checklist">
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Execution Completion</p>
                                    <p className="text-lg font-black text-[#8B5CF6]">{executionPercentage}%</p>
                                </div>
                                <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="18"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-white/5"
                                        />
                                        <motion.circle
                                            cx="24"
                                            cy="24"
                                            r="18"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeDasharray={`${2 * Math.PI * 18}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                                            animate={{ strokeDashoffset: (2 * Math.PI * 18) * (1 - executionPercentage / 100) }}
                                            className="text-[#8B5CF6]"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </SectionHeader>

                        {startup.milestones.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-center">
                                <ClipboardList className="text-gray-700 mb-4" size={40} />
                                <p className="text-gray-500 font-bold">No milestones added yet.</p>
                                <p className="text-gray-600 text-xs mt-1">Start building your execution roadmap.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {startup.milestones.map((item, i) => (
                                    <motion.div
                                        layout
                                        key={i}
                                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${item.status === 'completed' ? 'bg-green-500/5 border-green-500/20' :
                                            item.status === 'in-progress' ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20' :
                                                'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => updateMilestone(item.id, { status: e.target.value })}
                                                    className="opacity-0 absolute inset-0 cursor-pointer w-full z-10"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${item.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                                    item.status === 'in-progress' ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' :
                                                        'border-gray-700 hover:border-[#8B5CF6]'
                                                    }`}>
                                                    {item.status === 'completed' && <Check size={14} />}
                                                    {item.status === 'in-progress' && <Clock size={14} />}
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`font-bold text-sm ${item.status === 'completed' ? 'text-gray-300' : 'text-white'}`}>{item.title}</span>
                                                <div className="flex gap-2 mt-1">
                                                    {item.status === 'completed' && <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Completed</span>}
                                                    {item.status === 'in-progress' && <span className="text-[9px] font-black text-[#8B5CF6] uppercase tracking-widest">In Progress</span>}
                                                    {item.status === 'pending' && <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Pending</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteMilestone(item.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => {
                                const t = prompt("Milestone title:");
                                if (t) addMilestone(t);
                            }}
                            className="w-full mt-6 py-3 border-2 border-dashed border-white/5 rounded-xl text-gray-500 hover:text-white hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Add New Milestone
                        </button>
                    </div>

                    {/* Mentorship Focus Areas (Shared with Mentor) */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Target size={120} />
                        </div>
                        <SectionHeader icon={Rocket} title="Mentorship Focus">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest rounded border border-[#8B5CF6]/30">Collaborative</span>
                            </div>
                        </SectionHeader>

                        {mentor ? (
                            <div className="mb-8 p-6 bg-[#8B5CF6]/5 rounded-2xl border border-[#8B5CF6]/20 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl flex-shrink-0">
                                    {mentorName[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-black text-lg">{mentorName}</h4>
                                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-black uppercase tracking-widest rounded border border-green-500/20">Active Mentor</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium line-clamp-1">{mentor.expertise || 'General Strategy'} • {mentor.sector || 'Expert'}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <button
                                            onClick={() => navigate(`/${role}/messages`, { state: { openChat: { startupId: startup.startupId, type: 'mentor' } } })}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8B5CF6] hover:text-[#7C3AED] transition-all"
                                        >
                                            <MessageSquare size={12} /> Message Mentor
                                        </button>
                                        <div className="h-3 w-px bg-white/10" />
                                        <button
                                            onClick={() => navigate(`/${role}/mentors#my-mentor`)}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8 p-6 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 flex items-center gap-4">
                                <AlertCircle className="text-yellow-500 flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-white font-bold text-sm">No mentor assigned yet</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Request a mentor in the Discover Network to accelerate your growth.</p>
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
                            These focus areas are set in collaboration with your mentor to guide your current execution sprint.
                        </p>

                        {!Array.isArray(startup.focusAreas) || startup.focusAreas.length === 0 ? (
                            <div className="py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                                <p className="text-gray-500 text-xs font-bold">No mentorship focus areas defined yet.</p>
                                <p className="text-[9px] text-gray-600 uppercase font-black mt-2">Will be updated by your assigned mentor</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {startup.focusAreas.map((area, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl text-white font-bold text-sm group/tag">
                                        <Zap size={14} className="text-[#8B5CF6]" />
                                        {area}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Execution & Needs */}
                <div className="space-y-8">
                    {/* Target Audience */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={Target} title="Target Audience">
                            <button
                                onClick={() => {
                                    setEditingSection('audience');
                                    setEditValue(startup.targetAudience.join('\n'));
                                }}
                                className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest hover:underline"
                            >
                                Edit
                            </button>
                        </SectionHeader>
                        {editingSection === 'audience' ? (
                            <div className="space-y-4">
                                <p className="text-[10px] text-gray-500 font-bold italic">One audience per line</p>
                                <textarea
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-full bg-white/5 border border-[#8B5CF6]/50 rounded-xl p-4 text-gray-300 focus:outline-none h-32"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
                                    <button onClick={() => handleInlineSave('audience')} className="px-4 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-lg shadow-lg">Save</button>
                                </div>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {startup.targetAudience.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">No target audience defined.</p>
                                ) : (
                                    startup.targetAudience.map((t, i) => (
                                        <li key={i} className="flex items-center group justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
                                                <span className="text-sm font-bold text-gray-300">{t}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const updated = startup.targetAudience.filter((_, idx) => idx !== i);
                                                    handleUpdate({ targetAudience: updated });
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400"
                                            >
                                                <X size={12} />
                                            </button>
                                        </li>
                                    ))
                                )}
                                <button
                                    onClick={() => {
                                        const newAud = prompt("Add target audience:");
                                        if (newAud) handleUpdate({ targetAudience: [...startup.targetAudience, newAud] });
                                    }}
                                    className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest mt-4 flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                    <Plus size={12} /> Add New
                                </button>
                            </ul>
                        )}
                    </div>

                    {/* Skill Gap Highlight */}
                    <div className={`${startup.skillGapFilled ? 'bg-green-500/5 border-green-500/10' : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20'} p-8 rounded-2xl border relative overflow-hidden group transition-all duration-500`}>
                        <div className={`absolute -top-4 -right-4 w-24 h-24 ${startup.skillGapFilled ? 'bg-green-500/20' : 'bg-[#8B5CF6]/20'} blur-3xl rounded-full`} />
                        <SectionHeader icon={Users} title={startup.skillGapFilled ? "Team Status" : "Skill Gap"} />

                        {startup.skillGapFilled ? (
                            <div className="flex flex-col items-center text-center py-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-4 ring-2 ring-green-500/50"
                                >
                                    <CheckCircle2 size={32} />
                                </motion.div>
                                <p className="text-white font-black text-xl mb-1">Team Fully Formed <span className="text-green-400">✅</span></p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No active skill gaps</p>
                                <button
                                    onClick={() => handleUpdate({ skillGapFilled: false })}
                                    className="mt-6 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white"
                                >
                                    Add new gap
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {!startup.skillGap ? (
                                    <div className="py-4 text-center">
                                        <p className="text-gray-500 text-sm font-medium">Define your missing role to improve team strength.</p>
                                        <button
                                            onClick={() => {
                                                const gap = prompt("What role is missing?");
                                                if (gap) handleUpdate({ skillGap: gap });
                                            }}
                                            className="mt-4 px-4 py-2 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-black rounded-lg hover:bg-[#8B5CF6]/10 transition-all"
                                        >
                                            Add Skill Gap
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 group-hover:border-[#8B5CF6]/30 transition-all">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-black shrink-0">Looking For:</p>
                                                <div className="relative shrink-0">
                                                    <select
                                                        value={startup.skillGapPriority}
                                                        onChange={(e) => handleUpdate({ skillGapPriority: e.target.value })}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                    </select>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${startup.skillGapPriority === 'High' ? 'bg-red-500/20 text-red-500' :
                                                        startup.skillGapPriority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                            'bg-blue-500/20 text-blue-500'
                                                        }`}>
                                                        {startup.skillGapPriority} Priority
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-white font-black text-lg truncate">{startup.skillGap}</p>
                                                <button
                                                    onClick={() => {
                                                        const newGap = prompt("Update skill gap:", startup.skillGap);
                                                        if (newGap) handleUpdate({ skillGap: newGap });
                                                    }}
                                                    className="p-1 hover:bg-white/10 rounded shrink-0"
                                                >
                                                    <Edit3 size={14} className="text-gray-500" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleUpdate({ skillGapFilled: true })}
                                                className="w-full py-3 bg-[#8B5CF6] text-white text-xs font-black rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> Mark as Filled
                                            </button>
                                            <button className="w-full py-3 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-black rounded-xl hover:bg-[#8B5CF6]/10 transition-all">Match with Candidates</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={FileText} title="Documents">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                                <Plus size={12} /> Upload
                            </button>
                        </SectionHeader>

                        {startup.documents.length === 0 ? (
                            <div className="py-8 text-center flex flex-col items-center">
                                <FileText className="text-gray-700 mb-2" size={32} />
                                <p className="text-gray-500 text-xs font-bold">No documents uploaded.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {startup.documents.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                <FileText size={16} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold text-white truncate max-w-[140px]">{doc.name}</p>
                                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{doc.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    const newName = prompt("Rename document:", doc.name);
                                                    if (newName) {
                                                        renameDocument(i, newName);
                                                        showToast("Renamed successfully");
                                                    }
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete ${doc.name}?`)) {
                                                        deleteDocument(i);
                                                        showToast("Document deleted");
                                                    }
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full mt-6 py-3 border border-dashed border-white/10 hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 rounded-xl text-gray-500 text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Upload size={14} /> Upload New Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStartup;
