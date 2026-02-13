
import React from 'react';
import {
    User,
    Shield,
    Bell,
    Zap,
    ArrowRight,
    Lock,
    Globe,
    Smartphone,
    Eye,
    Settings as SettingsIcon,
    Users
} from 'lucide-react';

const Settings = ({ role }) => {
    const isFounder = role === 'founder';

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Platform <span className="text-[#8B5CF6]">Settings</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your command identity and notification protocols.</p>
                </div>
                <button className="px-8 py-3 bg-[#8B5CF6] text-white text-sm font-black rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all">Save All Changes</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Internal Nav */}
                <aside className="lg:col-span-1 space-y-2">
                    {[
                        { l: 'Personal Profile', i: User, a: true },
                        { l: 'Command Security', i: Lock, a: false },
                        { l: 'Notification Pulse', i: Bell, a: false },
                        { l: 'Ecosystem Visibility', i: Eye, a: false },
                        { l: 'Advanced Labs', i: Zap, a: false }
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${item.a ? 'bg-white/5 text-white border border-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                            <item.i size={18} className={item.a ? 'text-[#8B5CF6]' : ''} />
                            {item.l}
                        </button>
                    ))}
                </aside>

                {/* Main Settings Panel */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Personal Info */}
                    <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                <User className="text-[#8B5CF6]" size={20} /> Personal Command Info
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Full Identity Name</label>
                                    <input type="text" defaultValue="Siddharth Sharma" className="w-full bg-[#0F0F14] border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Verified Email</label>
                                    <input type="email" defaultValue="sid@nebulaai.io" className="w-full bg-[#0F0F14] border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 font-medium opacity-70 cursor-not-allowed" disabled />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider">Commitment Level</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Full-time', 'Part-time', 'Consulting'].map((lv, i) => (
                                    <button key={i} className={`py-4 px-6 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${i === 0 ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]' : 'bg-[#0F0F14] border-white/5 text-gray-600 hover:text-white'}`}>
                                        {lv}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Role Specific Settings */}
                    {isFounder && (
                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                <Users className="text-[#8B5CF6]" size={20} /> Team Role Management
                            </h2>
                            <p className="text-sm text-gray-500 mb-8 font-medium">As a Founder, you have authorization to manage internal team access and responsibility tiers.</p>

                            <div className="space-y-4">
                                {[
                                    { n: 'Technical Co-Founder', e: 'Full Authorization', s: true },
                                    { n: 'Product Mentor', e: 'Advisory Access', s: true },
                                    { n: 'Platform Auditor', e: 'Read-only Access', s: false }
                                ].map((role_item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-white">{role_item.n}</p>
                                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{role_item.e}</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all ${role_item.s ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/30' : 'bg-white/5 border-white/10'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${role_item.s ? 'right-1 bg-[#8B5CF6]' : 'left-1 bg-gray-600'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-4 border border-dashed border-white/10 rounded-2xl text-xs font-black text-gray-600 uppercase tracking-widest hover:text-white transition-all">Invite New Command Member</button>
                        </div>
                    )}

                    {!isFounder && (
                        <div className="bg-[#1E1E2F]/50 p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                <Shield size={24} />
                            </div>
                            <h4 className="text-gray-400 font-bold mb-1">Administrative Lockdown</h4>
                            <p className="text-xs text-gray-600 max-w-[300px]">Team role management is restricted to the Lead Founder. Contact your administrator for permission updates.</p>
                        </div>
                    )}

                    {/* Visibility & Notifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <Eye size={16} className="text-blue-500" /> Visibility Control
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">Public Profile</span>
                                    <div className="w-10 h-5 bg-green-500/20 border border-green-500/30 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-green-500 rounded-full" /></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">Expert Matching</span>
                                    <div className="w-10 h-5 bg-green-500/20 border border-green-500/30 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-green-500 rounded-full" /></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500">Show Traction</span>
                                    <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-gray-600 rounded-full" /></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5">
                            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <Bell size={16} className="text-orange-400" /> Notification Pulse
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">Email Alerts</span>
                                    <div className="w-10 h-5 bg-green-500/20 border border-green-500/30 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-green-500 rounded-full" /></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">Mobile Push</span>
                                    <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-gray-600 rounded-full" /></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">Team Mentions</span>
                                    <div className="w-10 h-5 bg-green-500/20 border border-green-500/30 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-green-500 rounded-full" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
