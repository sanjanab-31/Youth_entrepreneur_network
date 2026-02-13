import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    MapPin,
    Building,
    Layers,
    Users,
    DollarSign,
    Award,
    FileText,
    Edit3,
    Linkedin,
    Twitter,
    ExternalLink,
    CheckCircle2,
    Shield,
    Target
} from 'lucide-react';

const IncubatorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const profileData = {
        name: 'Vanguard Innovation Hub',
        website: 'vanguardhub.io',
        location: 'Bangalore, India',
        sectorFocus: ['FinTech', 'EdTech', 'AI / ML', 'SaaS'],
        stagePreference: 'Idea / MVP / Revenue',
        fundingSupport: 'Yes (Up to ₹50L Equity-free)',
        cohortSize: '15-20 Startups',
        successMetrics: [
            { label: 'Startups Funded', value: '12 / 20' },
            { label: 'Avg Funding', value: '₹25L' },
            { label: 'Exit Multiplier', value: '4.2x' }
        ],
        description: 'Vanguard is a global venture catalyst focused on empowering the next generation of mission-driven founders. We provide institutional-grade support, deep mentor networks, and strategic capital to bridge the gap between MVP and global scale. Our program is designed for rapid execution and technical excellence.',
        programHighlights: [
            '12-week intensive execution sprints',
            'Direct access to Tier-1 VC network',
            'AWS / GCP Cloud Credits up to $100k',
            'Dedicated legal and compliance desk'
        ]
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header / Hero Section */}
            <div className="relative group">
                <div className="h-64 rounded-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] via-[#1E1E2F] to-[#0F0F14]" />
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                </div>
                <div className="absolute -bottom-12 left-10 flex flex-col md:flex-row items-end gap-6">
                    <div className="w-32 h-32 rounded-3xl bg-[#1E1E2F] border-4 border-[#0F0F14] shadow-2xl flex items-center justify-center p-6">
                        <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-[#8B5CF6]/30">
                            V
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">{profileData.name}</h1>
                            <Shield className="text-blue-400" size={20} fill="rgba(96, 165, 250, 0.1)" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 font-bold mt-1">
                            <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#8B5CF6]" /> {profileData.website}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#8B5CF6]" /> {profileData.location}</span>
                        </div>
                    </div>
                </div>
                <button className="absolute bottom-4 right-4 px-6 py-2.5 bg-white/10 hover:bg-white text-gray-300 hover:text-[#0F0F14] backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2">
                    <Edit3 size={16} /> Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#8B5CF6]">About the Program</h3>
                        <p className="text-gray-300 leading-relaxed text-lg font-medium italic opacity-90">
                            "{profileData.description}"
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Program Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileData.programHighlights.map((highlight, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-300">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#8B5CF6]">Sector Focus</h3>
                        <div className="flex flex-wrap gap-3">
                            {profileData.sectorFocus.map((sector, i) => (
                                <span key={i} className="px-5 py-2 bg-[#8B5CF6]/10 text-white text-xs font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/20">
                                    {sector}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Success Metrics */}
                    <div className="p-8 bg-[#1E1E2F] rounded-3xl border border-white/5 space-y-6 shadow-2xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">Success Matrix</h3>
                        <div className="space-y-6">
                            {profileData.successMetrics.map((metric, i) => (
                                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <span className="text-sm text-gray-500 font-bold uppercase tracking-tight">{metric.label}</span>
                                    <span className="text-2xl font-black text-white">{metric.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Details */}
                    <div className="space-y-4">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Target className="text-[#8B5CF6]" size={18} />
                                <span className="text-xs font-bold text-gray-400 uppercase">Stage Pref.</span>
                            </div>
                            <span className="text-xs font-bold text-white uppercase">{profileData.stagePreference}</span>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-emerald-400" size={18} />
                                <span className="text-xs font-bold text-gray-400 uppercase">Funding</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-400">AVAILABLE</span>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Layers className="text-blue-400" size={18} />
                                <span className="text-xs font-bold text-gray-400 uppercase">Batch Size</span>
                            </div>
                            <span className="text-xs font-bold text-white">{profileData.cohortSize}</span>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex gap-4">
                        <button className="flex-1 p-4 bg-white/5 hover:bg-blue-600/20 rounded-2xl border border-white/10 hover:border-blue-600/30 transition-all flex items-center justify-center gap-2 group">
                            <Linkedin size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-white transition-colors">LinkedIn</span>
                        </button>
                        <button className="flex-1 p-4 bg-white/5 hover:bg-sky-500/20 rounded-2xl border border-white/10 hover:border-sky-500/30 transition-all flex items-center justify-center gap-2 group">
                            <Twitter size={20} className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-white transition-colors">Twitter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorProfile;
