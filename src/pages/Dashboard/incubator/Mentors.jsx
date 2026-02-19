import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    User,
    Briefcase,
    Star,
    Zap,
    Clock,
    ChevronRight,
    Plus,
    Filter,
    Linkedin,
    MessageSquare,
    Users,
    CheckCircle2,
    X,
    Rocket,
    Building
} from 'lucide-react';

import { useIncubator } from '../../../context/IncubatorContext';

const Mentors = () => {
    const { mentors, pipeline, onboardMentor, assignMentorToStartup, removeMentorAssignment } = useIncubator();
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardData, setOnboardData] = useState({ name: '', email: '', expertise: '', bio: '' });

    const handleOnboardSubmit = (e) => {
        e.preventDefault();
        onboardMentor({
            ...onboardData,
            expertise: onboardData.expertise.split(',').map(s => s.trim())
        });
        setShowOnboardModal(false);
        setOnboardData({ name: '', email: '', expertise: '', bio: '' });
    };

    const filteredMentors = mentors.filter(m =>
        (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.expertise || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getMentorMentees = (mentorId) => {
        return pipeline.filter(s => s.mentorAssigned === mentorId);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mentor Intelligence</h1>
                    <p className="text-sm text-gray-400">Assign experts to accelerate startup execution</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowOnboardModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-xs font-bold text-white uppercase tracking-widest transition-all focus:outline-none shadow-lg shadow-[#8B5CF6]/20"
                    >
                        <Plus size={18} />
                        Add Mentor
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by expertise, company, or name..."
                    className="w-full bg-[#1E1E2F] border border-white/5 rounded-2xl py-4 px-12 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all shadow-xl font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor, index) => {
                    const mentees = getMentorMentees(mentor.uid || mentor.id);
                    const workload = (mentees.length / 5) * 100; // Assume max 5 for UI progress

                    return (
                        <motion.div
                            key={mentor.uid || mentor.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1E1E2F] border border-white/5 rounded-2xl p-6 hover:border-[#8B5CF6]/30 transition-all group relative"
                        >
                            <div className="absolute top-6 right-6 flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg text-amber-500 font-bold text-xs">
                                <Star size={12} fill="currentColor" />
                                {mentor.rating}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] p-0.5 shadow-lg">
                                    <div className="w-full h-full rounded-[14px] bg-[#1E1E2F] flex items-center justify-center font-bold text-xl text-white uppercase">
                                        {(mentor.name || 'M')[0]}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{mentor.name}</h3>
                                    <p className="text-xs text-[#8B5CF6] font-bold uppercase tracking-tighter">{mentor.expertise}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Briefcase size={14} className="text-[#8B5CF6]" />
                                    <span className="text-xs font-bold text-gray-300">Workload ({mentees.length})</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${workload}%` }}
                                        className={`h-full ${workload > 80 ? 'bg-rose-500' : 'bg-[#8B5CF6]'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Company</p>
                                    <p className="text-[11px] font-bold text-white truncate px-1">{mentor.company}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Score</p>
                                    <p className="text-[11px] font-bold text-emerald-400">92% Match</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setSelectedMentor(mentor); setIsAssigning(true); }}
                                    className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#8B5CF6]/20 flex items-center justify-center gap-2"
                                >
                                    <Rocket size={16} />
                                    Assign
                                </button>
                                <button
                                    onClick={() => setSelectedMentor(mentor)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all"
                                >
                                    <User size={20} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Mentor Detail / Assign Sidebar */}
            <AnimatePresence>
                {selectedMentor && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setSelectedMentor(null); setIsAssigning(false); }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-[#1E1E2F] border-l border-white/10 z-[110] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 bg-[#1E1E2F]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] p-0.5">
                                        <div className="w-full h-full rounded-[22px] bg-[#1E1E2F] flex items-center justify-center text-3xl font-black text-white uppercase">
                                            {selectedMentor.name[0]}
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedMentor(null); setIsAssigning(false); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
                                        <X size={24} />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedMentor.name}</h2>
                                <p className="text-[#8B5CF6] font-bold text-sm mb-4 uppercase tracking-widest">{selectedMentor.expertise}</p>
                                <div className="flex gap-3">
                                    <a href={selectedMentor.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all">
                                        <Linkedin size={20} />
                                    </a>
                                    <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                                        <MessageSquare size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {isAssigning ? (
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Rocket size={16} /> Assign to Active Startup
                                        </h3>
                                        <div className="space-y-3">
                                            {pipeline.filter(s => (s.mentorId || s.mentorAssigned) !== selectedMentor.uid).map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        assignMentorToStartup(selectedMentor.uid, s.startupId);
                                                        setIsAssigning(false);
                                                        setSelectedMentor(null);
                                                    }}
                                                    className="w-full p-4 bg-white/5 hover:bg-[#8B5CF6]/10 border border-white/5 hover:border-[#8B5CF6]/30 rounded-2xl flex items-center justify-between group transition-all"
                                                >
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:text-[#8B5CF6] uppercase">
                                                            {(s.startupName || 'V')[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-sm">{s.startupName || 'Unnamed Venture'}</p>
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{s.stage} • {s.sector}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="text-gray-500 group-hover:text-[#8B5CF6]" />
                                                </button>
                                            ))}
                                            {pipeline.filter(s => s.mentorId !== selectedMentor.id).length === 0 && (
                                                <div className="py-10 text-center text-gray-500 italic">No available startups for assignment.</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Professional Profile</h3>
                                            <p className="text-sm text-gray-300 font-medium leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 italic">
                                                "{selectedMentor.bio || selectedMentor.about || 'Senior expert with deep experience in selected domains.'}"
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Active Assignments</h3>
                                            <div className="space-y-3">
                                                {getMentorMentees(selectedMentor.uid || selectedMentor.id).map(s => (
                                                    <div key={s.startupId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                                                        <div className="flex items-center gap-3">
                                                            <Rocket size={16} className="text-[#8B5CF6]" />
                                                            <span className="text-sm font-bold text-white">{s.startupName}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeMentorAssignment(selectedMentor.uid || selectedMentor.id, s.startupId)}
                                                            className="text-[10px] font-black uppercase text-rose-500 border border-rose-500/20 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                                        >
                                                            Unassign
                                                        </button>
                                                    </div>
                                                ))}
                                                {getMentorMentees(selectedMentor.uid || selectedMentor.id).length === 0 && (
                                                    <p className="text-xs text-gray-500 italic">No startups currently assigned.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Engagement Stats</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Mentored</p>
                                                    <p className="text-xl font-bold text-white">42</p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Average Rating</p>
                                                    <p className="text-xl font-bold text-amber-500">4.92</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#1E1E2F]">
                                {isAssigning ? (
                                    <button
                                        onClick={() => setIsAssigning(false)}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 transition-all"
                                    >
                                        Cancel Assignment
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsAssigning(true)}
                                        className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-[#8B5CF6]/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Assign New Startup
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Onboarding Mentor Modal */}
            <AnimatePresence>
                {showOnboardModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOnboardModal(false)}
                            className="absolute inset-0 bg-[#0F0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-[#1E1E2F] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Onboard New Mentor</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manual ecosystem entry</p>
                                </div>
                                <button onClick={() => setShowOnboardModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleOnboardSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Full Name</label>
                                        <input
                                            required
                                            value={onboardData.name}
                                            onChange={(e) => setOnboardData({ ...onboardData, name: e.target.value })}
                                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all shadow-inner"
                                            placeholder="e.g. Dr. Sarah Chen"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Official Email</label>
                                        <input
                                            type="email"
                                            value={onboardData.email}
                                            onChange={(e) => setOnboardData({ ...onboardData, email: e.target.value })}
                                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                            placeholder="sarah@experts.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Expertise Areas (comma separated)</label>
                                    <input
                                        required
                                        value={onboardData.expertise}
                                        onChange={(e) => setOnboardData({ ...onboardData, expertise: e.target.value })}
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all shadow-inner"
                                        placeholder="e.g. Fintech, GTM, Seed Funding"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Mentor Bio</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={onboardData.bio}
                                        onChange={(e) => setOnboardData({ ...onboardData, bio: e.target.value })}
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all resize-none"
                                        placeholder="Professional background and focus..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-black uppercase tracking-widest text-white rounded-2xl shadow-xl shadow-[#8B5CF6]/30 transition-all mt-4"
                                >
                                    Add to Ecosystem
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mentors;
