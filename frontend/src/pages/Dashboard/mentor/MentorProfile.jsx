
import React from 'react';
import {
    User,
    Briefcase,
    Globe,
    Clock,
    ShieldCheck,
    ExternalLink,
    Mail,
    Linkedin,
    Edit3,
    CheckCircle2,
    Zap,
    Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMentor } from '../../../context/MentorContext';

const ExpertiseBadge = ({ text }) => (
    <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/20">
        {text}
    </span>
);

const CompanyLogo = ({ name }) => (
    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
        <div className="w-10 h-10 rounded-lg bg-[#1E1E2F] flex items-center justify-center font-black text-gray-500 group-hover:text-white transition-colors uppercase">
            {name[0]}
        </div>
        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{name}</span>
    </div>
);

const MentorProfile = () => {
    const { profile, stats } = useMentor();

    if (!profile) return null;

    const mentorInfo = {
        name: profile.name || 'Arjun Malhotra',
        expertise: ['FinTech', 'SaaS Scaleup', 'B2B Sales', 'Seed Funding'],
        experience: profile.expertise || '12+ Years Experience',
        bio: 'Former VP of Growth at Stripe Asia. Serial entrepreneur with 2 successful exits in the fintech space. I specialize in helping seed-stage startups define their GTM strategy and scale their initial sales team from 0 to 10.',
        companies: ['Stripe', 'Revolut', 'Goldman Sachs', 'Y Combinator'],
        stages: ['Idea', 'MVP', 'Seed', 'Series A'],
        sessionType: profile.availability?.sessionType === '1:1' ? 'Personal 1:1 Advisory' : 'Group / Multi-Session',
        availability: `${profile.availability?.days?.join(', ') || 'Mon, Wed, Fri'} (10 AM - 4 PM IST)`,
        responseRate: `${stats.responseRate}%`,
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header / Profile Cover */}
            <div className="relative">
                <div className="h-48 w-full bg-gradient-to-r from-[#8B5CF6] to-indigo-900 rounded-3xl opacity-50 blur-sm" />
                <div className="absolute -bottom-10 left-10 flex flex-col md:flex-row md:items-end gap-8">
                    <div className="w-32 h-32 rounded-3xl bg-[#1E1E2F] border-4 border-[#0F0F14] shadow-2xl overflow-hidden p-1">
                        <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center text-4xl font-black text-white">
                            {mentorInfo.name[0]}
                        </div>
                    </div>
                    <div className="pb-2">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-white tracking-tight">{mentorInfo.name}</h1>
                            <CheckCircle2 size={24} className="text-[#8B5CF6]" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mentorInfo.expertise.map((tag, i) => <ExpertiseBadge key={i} text={tag} />)}
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 right-10 flex gap-4">
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all">
                        <Linkedin size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#8B5CF6] hover:text-white transition-all shadow-xl">
                        <Edit3 size={16} /> Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16 pt-10">
                {/* Left Side - Bio & Stats */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                            <Globe className="text-[#8B5CF6]" size={16} /> About Mentor
                        </h3>
                        <p className="text-lg text-gray-400 font-medium leading-relaxed">
                            {mentorInfo.bio}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                            <Briefcase className="text-[#8B5CF6]" size={16} /> Companies Worked With
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {mentorInfo.companies.map((c, i) => <CompanyLogo key={i} name={c} />)}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-[#1E1E2F] rounded-3xl border border-white/5">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Expertise Focus</h4>
                            <div className="space-y-4">
                                {mentorInfo.stages.map((stage, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-300">{stage} Stage</span>
                                        <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-[#1E1E2F] to-[#0F0F14] rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Zap size={80} /></div>
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Mentorship Style</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest mb-1">Session Pricing</p>
                                    <p className="text-white font-bold">{mentorInfo.sessionType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest mb-1">Availability</p>
                                    <p className="text-white font-bold">{mentorInfo.availability}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Credibility Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8 text-center">Mentor Scorecard</h4>
                        <div className="space-y-10">
                            <div className="text-center">
                                <p className="text-5xl font-black text-white mb-2">{mentorInfo.responseRate}</p>
                                <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest">Average Response Rate</p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Profile View / Mo</span>
                                    <span className="text-sm font-black text-white">420</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Hours Mentored</span>
                                    <span className="text-sm font-black text-white">1,200+</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Impact Score</span>
                                    <span className="text-sm font-black text-green-400">9.8/10</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-[#8B5CF6] rounded-3xl text-white shadow-xl shadow-[#8B5CF6]/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform">
                            <Building size={120} />
                        </div>
                        <h4 className="font-black text-xl mb-2 relative z-10">Ecosystem Status</h4>
                        <p className="text-white/80 text-xs font-medium relative z-10 mb-6">You are in the top 5% of Fintech mentors this quarter.</p>
                        <button className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl relative z-10">View Ranking</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfile;
