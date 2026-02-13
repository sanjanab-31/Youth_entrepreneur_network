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

const Mentors = () => {
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);

    const mentors = [
        {
            id: 1,
            name: 'Dr. Jane Smith',
            expertise: 'AI / Machine Learning',
            experience: '15+ Years',
            company: 'Ex-Google Brain',
            activeMentees: 4,
            responseRate: '98%',
            rating: 4.9,
            tags: ['Technical Architecture', 'ML Ops', 'Scale'],
            about: 'Specializes in scaling deep tech infrastructure and data governance.',
            linkedin: 'https://linkedin.com/in/janesmith',
        },
        {
            id: 2,
            name: 'Mark Cuban',
            expertise: 'Business Strategy / Growth',
            experience: '25+ Years',
            company: 'Serial Entrepreneur',
            activeMentees: 2,
            responseRate: '85%',
            rating: 4.8,
            tags: ['Investment', 'Media Strategy', 'Retail'],
            about: 'Focused on high-growth consumer products and market disruption.',
            linkedin: 'https://linkedin.com/in/markcuban',
        },
        {
            id: 3,
            name: 'Sarah Jenkins',
            expertise: 'Product Design / UX',
            experience: '10+ Years',
            company: 'Lead Designer @ Airbnb',
            activeMentees: 6,
            responseRate: '92%',
            rating: 4.7,
            tags: ['Product-Market Fit', 'UX Design', 'Branding'],
            about: 'Helping early-stage startups build user-centric products that stick.',
            linkedin: 'https://linkedin.com/in/sjenk',
        }
    ];

    const startups = ['EcoTrace AI', 'FinFlow', 'HealthSync', 'EduQuest'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mentor Intelligence</h1>
                    <p className="text-sm text-gray-400">Assign experts to accelerate startup execution</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm font-bold text-white transition-all">
                        <Plus size={18} />
                        Invite Mentor
                    </button>
                    <button className="px-3 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-white shadow-lg shadow-[#8B5CF6]/20 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by expertise, company, or name..."
                    className="w-full bg-[#1E1E2F] border border-white/5 rounded-2xl py-4 px-12 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all shadow-xl"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor, index) => (
                    <motion.div
                        key={mentor.id}
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
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-lg">
                                <div className="w-full h-full rounded-[14px] bg-[#1E1E2F] flex items-center justify-center font-bold text-xl text-white">
                                    {mentor.name[0]}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{mentor.name}</h3>
                                <p className="text-xs text-[#8B5CF6] font-bold">{mentor.expertise}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Building size={14} className="text-[#8B5CF6]" />
                                <span className="text-xs font-medium">{mentor.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Briefcase size={14} className="text-[#8B5CF6]" />
                                <span className="text-xs font-medium">{mentor.experience} Experience</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Mentees</p>
                                <p className="text-sm font-bold text-white">{mentor.activeMentees}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Response</p>
                                <p className="text-sm font-bold text-emerald-400">{mentor.responseRate}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {mentor.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-[#8B5CF6]/5 text-[10px] font-bold text-gray-400 rounded-lg border border-[#8B5CF6]/10">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setSelectedMentor(mentor); setIsAssigning(true); }}
                                className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#8B5CF6]/20 flex items-center justify-center gap-2"
                            >
                                <Users size={16} />
                                Assign Startup
                            </button>
                            <button
                                onClick={() => setSelectedMentor(mentor)}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all"
                            >
                                <User size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
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
                            <div className="p-8 border-b border-white/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-1">
                                        <div className="w-full h-full rounded-[22px] bg-[#1E1E2F] flex items-center justify-center text-3xl font-black text-white">
                                            {selectedMentor.name[0]}
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedMentor(null); setIsAssigning(false); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
                                        <X size={24} />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedMentor.name}</h2>
                                <p className="text-[#8B5CF6] font-bold text-sm mb-4">{selectedMentor.expertise}</p>
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
                                            <Rocket size={16} /> Select Startup to Assign
                                        </h3>
                                        <div className="space-y-3">
                                            {startups.map((s, i) => (
                                                <button
                                                    key={i}
                                                    className="w-full p-4 bg-white/5 hover:bg-[#8B5CF6]/10 border border-white/5 hover:border-[#8B5CF6]/30 rounded-2xl flex items-center justify-between group transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:text-[#8B5CF6]">
                                                            {s[0]}
                                                        </div>
                                                        <span className="font-bold text-white text-sm">{s}</span>
                                                    </div>
                                                    <ChevronRight size={18} className="text-gray-500 group-hover:text-[#8B5CF6]" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Professional Profile</h3>
                                            <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
                                                {selectedMentor.about}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Engagement Stats</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Mentored</p>
                                                    <p className="text-xl font-bold text-white">42 Startups</p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Average Rating</p>
                                                    <p className="text-xl font-bold text-amber-500">4.92 / 5.0</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Success Highlights</h3>
                                            <div className="space-y-3">
                                                {[
                                                    'Guided FinPay to Series A (₹15Cr)',
                                                    'Mentored 12 teams in AI Hub Batch 2024',
                                                    'Voted "Most Impactful Mentor" Q4 2024'
                                                ].map((h, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                        <CheckCircle2 size={16} className="text-[#8B5CF6]" />
                                                        {h}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#1E1E2F]">
                                {isAssigning ? (
                                    <button
                                        onClick={() => setIsAssigning(false)}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-400 transition-all"
                                    >
                                        Back to Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsAssigning(true)}
                                        className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-2xl text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[#8B5CF6]/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Rocket size={20} />
                                        Initialize Mentor Session
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mentors;
