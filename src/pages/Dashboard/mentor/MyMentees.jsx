
import React, { useState } from 'react';
import {
    Users,
    Rocket,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    TrendingUp,
    ChevronRight,
    MessageSquare,
    ListTodo,
    ChevronLeft,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MenteeCard = ({ mentee, onSelect }) => (
    <div
        onClick={() => onSelect(mentee)}
        className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all group cursor-pointer"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-black/20 group-hover:scale-105 transition-transform">
                    {mentee.startupName[0]}
                </div>
                <div>
                    <h4 className="text-white font-black group-hover:text-[#8B5CF6] transition-colors">{mentee.startupName}</h4>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{mentee.founderName}</p>
                </div>
            </div>
            <div className={`p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1`}>
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase">{mentee.growth}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Last Session</p>
                <p className="text-xs font-bold text-gray-300">{mentee.lastSession}</p>
            </div>
            <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">
                <p className="text-[9px] text-[#8B5CF6] font-black uppercase mb-1">Next Session</p>
                <p className="text-xs font-bold text-white">{mentee.nextSession}</p>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{mentee.stage}</span>
            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#8B5CF6] group-hover:translate-x-1 transition-transform">
                Open Progress View <ChevronRight size={14} />
            </span>
        </div>
    </div>
);

const ProgressView = ({ mentee, onBack }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-10"
    >
        <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
            <ChevronLeft size={16} /> Back to Mentees
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar Information */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Rocket size={100} /></div>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-xl mb-6 mx-auto">
                        {mentee.startupName[0]}
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-white mb-2">{mentee.startupName}</h2>
                        <p className="text-[#8B5CF6] font-bold text-xs uppercase tracking-widest mb-6">{mentee.stage}</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400">FinTech</span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400">B2B SaaS</span>
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Founder</p>
                            <p className="text-white font-bold">{mentee.founderName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Focus</p>
                            <p className="text-white font-bold">Scaling Enterprise Sales</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-[#8B5CF6] to-indigo-600 rounded-3xl text-white shadow-xl shadow-[#8B5CF6]/20">
                    <h4 className="font-black text-sm mb-4 uppercase tracking-wider">Quick Note</h4>
                    <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">Founders are highly responsive. Last advice on pricing tiers was implemented within 48 hours.</p>
                    <button className="w-full py-3 bg-white text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all">Send Message</button>
                </div>
            </div>

            {/* Main Progress Content */}
            <div className="lg:col-span-3 space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Revenue</p>
                        <p className="text-2xl font-black text-white">$14.2k <span className="text-green-400 text-xs">↑ 12%</span></p>
                    </div>
                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Users</p>
                        <p className="text-2xl font-black text-white">2.8k <span className="text-green-400 text-xs">↑ 5%</span></p>
                    </div>
                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Burn Rate</p>
                        <p className="text-2xl font-black text-white">$4.2k <span className="text-orange-400 text-xs">↓ 2%</span></p>
                    </div>
                </div>

                {/* Milestone Checklist */}
                <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <ListTodo className="text-[#8B5CF6]" size={20} /> Milestone Checklist
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Finalize Tier-1 Pricing Model', completed: true },
                            { label: 'Hire First SDR for Outreach', completed: true },
                            { label: 'Integrate PayBolt API', completed: false },
                            { label: 'Close 3 Enterprise Pilots', completed: false },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${item.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                        {item.completed ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 bg-gray-700 rounded-full" />}
                                    </div>
                                    <span className={`text-sm font-bold ${item.completed ? 'text-gray-300 line-through' : 'text-white'}`}>{item.label}</span>
                                </div>
                                {!item.completed && <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest">In Progress</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section className="space-y-6">
                        <h3 className="text-lg font-black text-white flex items-center gap-3">
                            <MessageSquare className="text-orange-400" size={18} /> Previous Session Notes
                        </h3>
                        <div className="p-6 bg-[#0F0F14] rounded-2xl border border-white/5">
                            <p className="text-sm font-medium text-gray-400 leading-relaxed italic">
                                "Focused on the transition from B2B individuals to team-wide licenses. Founder needs to refactor the landing page to target CTOs specifically rather than just devs."
                            </p>
                            <p className="text-[10px] font-black text-gray-600 mt-4 uppercase tracking-widest text-right">— Oct 12, 2026</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-lg font-black text-white flex items-center gap-3">
                            <Zap className="text-yellow-400" size={18} /> Action Items
                        </h3>
                        <div className="space-y-3">
                            {['Review Sales Deck V2', 'Intro to Elena at Global Capital', 'Set OKRs for Q4'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </motion.div>
);

const MyMentees = () => {
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [mentees] = useState([
        { id: 1, startupName: 'EcoFlow', founderName: 'Sarah Jenkins', stage: 'Seed Stage', lastSession: 'Oct 12, 2026', nextSession: 'Oct 24, 2026', growth: 'Users ↑ 12%' },
        { id: 2, startupName: 'Nexus AI', founderName: 'Alex Rivera', stage: 'Validation Stage', lastSession: 'Oct 08, 2026', nextSession: 'Oct 25, 2026', growth: 'MRR ↑ 8%' },
        { id: 3, startupName: 'PayBolt', founderName: 'Michael Chen', stage: 'Revenue Stage', lastSession: 'Oct 15, 2026', nextSession: 'Oct 28, 2026', growth: 'Vloume ↑ 22%' },
        { id: 4, startupName: 'VibeHealth', founderName: 'Elena Rossi', stage: 'MVP Stage', lastSession: 'Oct 02, 2026', nextSession: 'Oct 21, 2026', growth: 'Waitlist ↑ 40%' },
    ]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {!selectedMentee ? (
                <>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Mentees</span>
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium">Track progress and manage your advisory relationship with founders.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-1 px-3 bg-[#1E1E2F] rounded-xl border border-white/5 flex items-center gap-2">
                                <Users size={14} className="text-gray-500" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">{mentees.length} Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Mentee Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentees.map((mentee) => (
                            <MenteeCard
                                key={mentee.id}
                                mentee={mentee}
                                onSelect={setSelectedMentee}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <ProgressView
                    mentee={selectedMentee}
                    onBack={() => setSelectedMentee(null)}
                />
            )}
        </div>
    );
};

export default MyMentees;
