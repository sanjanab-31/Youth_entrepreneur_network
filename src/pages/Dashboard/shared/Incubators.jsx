
import React from 'react';
import {
    Building,
    MapPin,
    Calendar,
    TrendingUp,
    Award,
    Search,
    Filter,
    ChevronRight,
    ArrowRight,
    Globe,
    Zap,
    Plus
} from 'lucide-react';

const Incubators = () => {
    const incubators = [
        {
            n: 'NSRCEL IIMB',
            l: 'Bangalore / Remote',
            s: 'Early Stage / Revenue',
            f: 'Tech / Sustainability',
            b: 'Jan 2026 - June 2026',
            m: '92% Survival Rate • $10M+ Funding Raised',
            img: 'II'
        },
        {
            n: 'Antler India',
            l: 'New Delhi / Hybrid',
            s: 'Pre-Seed / Idea',
            f: 'SaaS / Deep Tech',
            b: 'Cycles every 3 months',
            m: 'Global Network • High-Value Mentorship',
            img: 'AN'
        },
        {
            n: 'Venture Catalysts',
            l: 'Mumbai',
            s: 'Seed / Scale-up',
            f: 'Multi-sector',
            b: 'Rolling Admissions',
            m: 'Angel Network • $25M+ Exit Value',
            img: 'VC'
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                            Growth Accelerators
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Verified Institutions</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Startup <span className="text-blue-500">Incubators</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search & Filter */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Filter size={14} className="text-blue-500" /> Refine Focus
                        </h3>

                        <div className="space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search incubators..."
                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/30 font-bold"
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Sector Focus</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['All', 'Agri', 'Health', 'SaaS', 'AI'].map((s, i) => (
                                            <button key={i} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${i === 0 ? 'bg-blue-500/20 border-blue-500/40 text-white' : 'bg-white/5 border-white/5 text-gray-600 hover:text-white'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Preferred Stage</label>
                                    <div className="space-y-2">
                                        {['Pre-Seed', 'Seed', 'Growth'].map((st, i) => (
                                            <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                                <div className="w-4 h-4 rounded border border-white/10 group-hover:border-blue-500/50 transition-colors" />
                                                <span className="text-sm font-medium text-gray-500 group-hover:text-white transition-colors">{st}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E2F] to-[#0F0F14] border border-blue-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={64} /></div>
                        <h4 className="text-white font-bold text-sm mb-2">Auto-Fill Ready</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">Vanguard automatically syncs your startup data with incubator application forms.</p>
                        <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                            <Zap size={10} fill="currentColor" /> Feature Active
                        </div>
                    </div>
                </aside>

                {/* Incubator Cards */}
                <div className="lg:col-span-3 space-y-6">
                    {incubators.map((inc, i) => (
                        <div key={i} className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/2 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/5 transition-all" />

                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                                        {inc.img}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">{inc.n}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500" /> {inc.l}</span>
                                                <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-green-500" /> {inc.s}</span>
                                            </div>
                                        </div>
                                        <button className="hidden md:flex items-center gap-2 bg-[#1E1E2F] text-white px-5 py-2.5 rounded-xl text-sm font-black border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shadow-xl">
                                            Apply Now <ArrowRight size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                    <Calendar size={10} /> Batch Timeline
                                                </p>
                                                <p className="text-xs font-bold text-gray-300">{inc.b}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-600 font-black uppercase mb-1 flex items-center gap-2 tracking-widest">
                                                    <Award size={10} /> Success Metrics
                                                </p>
                                                <p className="text-xs font-bold text-gray-300">{inc.m}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <p className="text-[10px] text-gray-600 font-black uppercase mb-2 tracking-widest">Sector Focus</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-white/5 text-[10px] font-bold text-gray-400 rounded-lg group-hover:border-white/10 border border-transparent transition-all">{inc.f}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="md:hidden mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl text-sm font-black transition-all">
                                        Apply Now <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="p-8 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-center group hover:bg-white/5 transition-all">
                        <div>
                            <p className="text-xs font-bold text-gray-600">Showing 3 of 124 Incubators</p>
                            <button className="mt-4 text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 mx-auto">Load More <Plus size={12} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incubators;
