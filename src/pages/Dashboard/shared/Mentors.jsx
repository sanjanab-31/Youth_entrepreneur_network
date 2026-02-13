
import React, { useState } from 'react';
import {
    Briefcase,
    Search,
    Filter,
    MessageSquare,
    Star,
    ChevronRight,
    X,
    Shield,
    Calendar,
    ArrowRight,
    MapPin,
    Target,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Mentors = () => {
    const [selectedMentor, setSelectedMentor] = useState(null);

    const mentors = [
        { id: 1, n: 'Anant Goenka', s: 'Fintech / Scalability', ex: 'Founder @ NeoPay (Ex-Paytm)', r: '98%', p: 'Solving infra bottlenecks & regulation.', t: 'One-on-One', img: 'AG' },
        { id: 2, n: 'Meera Iyer', s: 'D2C / Branding', ex: 'Marketing Head @ Urban Co', r: '92%', p: 'Brand positioning & customer acquisition.', t: 'Group Workshop', img: 'MI' },
        { id: 3, n: 'Varun Aggarwal', s: 'AI / Deep Tech', ex: 'Core Dev @ DeepMind', r: '85%', p: 'Model deployment & edge optimization.', t: 'Deep Dive Session', img: 'VA' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-500/30">
                            Expert Guidance
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Verified Mentors</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Vanguard <span className="text-orange-400">Mentors</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Global Filters */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                            <Filter size={16} className="text-orange-400" /> Filter Expertise
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Sector Focus</label>
                                <select className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none">
                                    <option>SaaS / Enterprise</option>
                                    <option>Fintech</option>
                                    <option>Edtech</option>
                                    <option>Deep Tech</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Startup Stage</label>
                                <div className="space-y-2">
                                    {['Idea Stage', 'MVP / Validation', 'Revenue / Growth'].map((st, i) => (
                                        <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                            <div className="w-4 h-4 rounded border border-white/10 group-hover:border-orange-400/50 transition-colors" />
                                            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{st}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20">
                        <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                            <Star size={14} className="text-orange-400" /> Premium Matching
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">Get matched with mentors based on your execution path milestones.</p>
                    </div>
                </aside>

                {/* Mentor Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentors.map((mentor) => (
                        <div
                            key={mentor.id}
                            className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden group hover:border-orange-500/30 transition-all cursor-pointer flex flex-col"
                            onClick={() => setSelectedMentor(mentor)}
                        >
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-0.5 shadow-lg shadow-orange-500/10">
                                        <div className="w-full h-full bg-[#1E1E2F] rounded-[14px] flex items-center justify-center font-black text-xl text-white">
                                            {mentor.img}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-orange-400 font-black text-xs uppercase mb-1">
                                            <Shield size={10} /> Verified
                                        </div>
                                        <div className="text-xs text-green-400 font-bold">{mentor.r} Response Rate</div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors mb-1">{mentor.n}</h3>
                                <p className="text-sm font-bold text-gray-500 mb-4">{mentor.ex}</p>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Expertise</p>
                                        <p className="text-xs font-bold text-gray-300">{mentor.s}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Mentorship Focus</p>
                                        <p className="text-xs font-bold text-gray-400 line-clamp-2">{mentor.p}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto border-t border-white/5 p-4 flex items-center justify-between group-hover:bg-white/5 transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">{mentor.t}</span>
                                <button className="text-xs font-black text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                    View Profile <ChevronRight size={14} className="text-orange-400" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty Slot */}
                    <div className="border border-dashed border-white/5 rounded-2xl flex items-center justify-center p-8 group hover:border-orange-500/20 transition-all">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} className="text-gray-600 group-hover:text-orange-400" />
                            </div>
                            <p className="text-xs font-bold text-gray-600 mb-1">Request New Sector</p>
                            <p className="text-[10px] text-gray-700 uppercase font-black">Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Form Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1E1E2F] w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-orange-400/20 flex items-center justify-center font-black text-orange-400 text-2xl border border-orange-400/30">
                                            {selectedMentor.img}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white mb-1">Request Mentorship</h2>
                                            <p className="text-orange-400 font-bold text-sm">with {selectedMentor.n}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSelectedMentor(null); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Exact Problem</label>
                                            <textarea
                                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 min-h-[120px]"
                                                placeholder="Describe the technical or business blocker you are facing..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">What has been tried?</label>
                                            <textarea
                                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 min-h-[120px]"
                                                placeholder="List your attempts to solve this blocker so far..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Expected Outcome</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                                            placeholder="What would a successful session look like for you?"
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3"
                                        >
                                            Confirm Request <ArrowRight size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedMentor(null)}
                                            className="px-8 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:text-white transition-all border border-white/5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mentors;
