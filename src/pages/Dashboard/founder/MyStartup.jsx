
import React from 'react';
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
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeader = ({ icon: Icon, title }) => (
    <h3 className="text-xl font-black text-white flex items-center gap-3 mb-6">
        <Icon className="text-[#8B5CF6]" size={20} />
        {title}
    </h3>
);

const MetricItem = ({ label, value }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold text-white mt-1">{value}</p>
    </div>
);

const MyStartup = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/30">
                            Founder View
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Startup OS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Nebula <span className="text-[#8B5CF6]">AI</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E1E2F] text-white text-sm font-bold rounded-xl border border-white/5 hover:border-white/10 transition-all">
                        <Download size={18} /> Export Pitch Deck
                    </button>
                    <button className="px-5 py-2.5 bg-[#8B5CF6] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all">
                        Edit Startup Info
                    </button>
                </div>
            </div>

            {/* Structured Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricItem label="Current Stage" value="Validation / Seed" />
                <MetricItem label="Active Users" value="1,280 Monthly" />
                <MetricItem label="Internal Team" value="5 Founding Members" />
                <MetricItem label="Burn Rate" value="$2,400 / Mo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Identity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Problem & Solution */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 space-y-8">
                        <div>
                            <SectionHeader icon={AlertCircle} title="Problem Statement" />
                            <p className="text-gray-400 leading-relaxed font-medium">
                                Small-scale retailers struggle with inventory forecasting, leading to a 35% average waste in perishable goods each month due to inefficient manual tracking and lack of predictive analytics.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <SectionHeader icon={Zap} title="Solution Overview" />
                            <p className="text-gray-400 leading-relaxed font-medium">
                                Nebula AI provides a low-cost, mobile-first inventory management system that uses lightweight ML models to predict demand patterns with 85% accuracy, specifically optimized for edge devices in low-connectivity areas.
                            </p>
                        </div>
                    </div>

                    {/* Milestone Checklist */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={ClipboardList} title="Milestone Checklist" />
                        <div className="space-y-4">
                            {[
                                { t: 'User Interview (20/20 Completed)', c: true },
                                { t: 'MVP Wireframes Finalized', c: true },
                                { t: 'Core ML Model Training', c: false, p: true },
                                { t: 'Beta Tester Recruitment', c: false },
                                { t: 'Infrastructure Setup', c: false },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${item.c ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${item.c ? 'bg-green-500 border-green-500 text-white' : 'border-gray-700'}`}>
                                            {item.c && <CheckCircle2 size={14} />}
                                        </div>
                                        <span className={`font-bold text-sm ${item.c ? 'text-gray-300' : 'text-gray-500'}`}>{item.t}</span>
                                    </div>
                                    {item.p && (
                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded">In Progress</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 transition-all font-bold text-sm flex items-center justify-center gap-2">
                            <Plus size={18} /> Add New Milestone
                        </button>
                    </div>
                </div>

                {/* Right Column: Execution & Needs */}
                <div className="space-y-8">
                    {/* Target Audience */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={Target} title="Target Audience" />
                        <ul className="space-y-4">
                            {['Tier 2/3 City Retailers', 'Agritech Supply Chains', 'Urban Tech-first Bodegas'].map((t, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Skill Gap Highlight */}
                    <div className="bg-[#8B5CF6]/10 p-8 rounded-2xl border border-[#8B5CF6]/20 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#8B5CF6]/20 blur-3xl rounded-full" />
                        <SectionHeader icon={Users} title="Skill Gap" />
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Looking For:</p>
                            <p className="text-white font-black">Marketing Co-Founder</p>
                        </div>
                        <p className="text-xs text-gray-400 mb-6">Need someone to lead GTM strategy and community building as we exit validation.</p>
                        <button className="w-full py-2.5 bg-[#8B5CF6] text-white text-xs font-black rounded-lg hover:shadow-lg transition-all">Match with Candidates</button>
                    </div>

                    {/* Documents */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={FileText} title="Documents" />
                        <div className="space-y-3">
                            {[
                                { n: 'Executive_Summary.pdf', s: '1.2MB' },
                                { n: 'Financial_Projections.xlsx', s: '450KB' },
                                { n: 'GTM_Strategy.pptx', s: '8.4MB' }
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-gray-500" />
                                        <span className="text-xs font-bold text-gray-300 truncate max-w-[120px]">{doc.n}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-black">{doc.s}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-gray-400 text-xs font-bold transition-all">Upload New</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStartup;
