
import React from 'react';
import {
    UserPlus,
    Search,
    Filter,
    MapPin,
    Award,
    DollarSign,
    Clock,
    ChevronRight,
    Briefcase,
    Zap
} from 'lucide-react';

const FindCoFounder = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/30">
                            Founder Exclusive
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Talent Acquisition</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Find <span className="text-[#8B5CF6]">Co-Founder</span>
                    </h1>
                </div>
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by skill, sector or name..."
                        className="w-full bg-[#1E1E2F] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filter Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Filter size={18} className="text-[#8B5CF6]" /> Filters
                            </h3>
                            <button className="text-xs font-bold text-gray-500 hover:text-white">Reset</button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 block">Primary Skill</label>
                                <select className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none">
                                    <option>Marketing / GTM</option>
                                    <option>Backend Engineering</option>
                                    <option>Product Design</option>
                                    <option>Sales / Operations</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 block">Equity Range</label>
                                <div className="space-y-2">
                                    {['5-10%', '10-20%', '20%+', 'Negotiable'].map((e, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-[#8B5CF6]/50 transition-all">
                                                {i === 1 && <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-sm" />}
                                            </div>
                                            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{e}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 block">Commitment</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Full-time', 'Part-time', 'Contract'].map((c, i) => (
                                        <button key={i} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border transition-all ${i === 0 ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#8B5CF6]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1E1E2F] to-[#0F0F14] p-8 rounded-2xl border border-[#8B5CF6]/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={48} /></div>
                        <h4 className="font-bold text-white text-sm mb-2">Vanguard Verified</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">Show only candidates with verified execution history.</p>
                        <div className="w-12 h-6 bg-[#8B5CF6]/20 rounded-full relative cursor-pointer border border-[#8B5CF6]/30">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Candidate List */}
                <div className="lg:col-span-3 space-y-6">
                    {[
                        { n: 'Rahul Malhotra', s: 'Marketing / Growth', l: 'Indore', e: '15-20%', ex: 'Ex-Zomato Growth Lead', sk: ['GTM Strat', 'SEO', 'AdOps'] },
                        { n: 'Anjali Deshmukh', s: 'UI/UX Design', l: 'Pune', e: 'Negotiable', ex: 'Freelance Design Lead', sk: ['Figma', 'Prototyping', 'User Research'] },
                        { n: 'Vikram Singh', s: 'Sales / Ops', l: 'New Delhi', e: '10-15%', ex: 'Startup Operations (YC W21)', sk: ['B2B Sales', 'Strategy', 'CRM'] }
                    ].map((c, i) => (
                        <div key={i} className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/2 hover:bg-[#8B5CF6]/5 transition-all rounded-bl-[100px] flex items-start justify-end p-6">
                                <ChevronRight className="text-gray-700 group-hover:text-white transition-colors" />
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-[#8B5CF6] to-indigo-600 p-0.5 shadow-lg group-hover:rotate-3 transition-transform">
                                        <div className="w-full h-full bg-[#1E1E2F] rounded-[22px] flex items-center justify-center font-black text-2xl text-white">
                                            {c.n[0]}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-white">{c.n}</h3>
                                        <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded border border-green-500/20">Verified Hero</div>
                                    </div>
                                    <p className="text-[#8B5CF6] font-bold text-sm mb-4">{c.s} • <span className="text-gray-400">{c.ex}</span></p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin size={14} /> <span className="text-xs font-bold text-gray-300">{c.l}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <DollarSign size={14} /> <span className="text-xs font-bold text-gray-300">{c.e} Equity</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={14} /> <span className="text-xs font-bold text-gray-300">Full-time</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Award size={14} /> <span className="text-xs font-bold text-gray-300">Ind. Leader</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {c.sk.map((s, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-gray-400 group-hover:border-[#8B5CF6]/30 transition-all">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FindCoFounder;
