import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Calendar,
    Users,
    Lock,
    Shield,
    Globe,
    Mail,
    Smartphone,
    Clock,
    Save,
    Trash2,
    Plus,
    CheckCircle2
} from 'lucide-react';

const Settings = () => {
    const [notifications, setNotifications] = useState({
        newApplications: true,
        mentorMessages: true,
        cohortUpdates: true,
        systemAlerts: false
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Hub Configuration</h1>
                <p className="text-sm text-gray-400">Manage incubator operational parameters and security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'general', label: 'General Parameters', icon: Globe },
                        { id: 'notifications', label: 'Communication', icon: Bell },
                        { id: 'team', label: 'Team Management', icon: Users },
                        { id: 'security', label: 'Security & Privacy', icon: Shield },
                    ].map(item => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${item.id === 'general' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Settings Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Operational Parameters */}
                    <section className="bg-[#1E1E2F] border border-white/5 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <Clock className="text-[#8B5CF6]" size={20} />
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Batch & Program Limits</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cohort Maximum Capacity</label>
                                    <input
                                        type="number"
                                        defaultValue={20}
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Program Duration (Weeks)</label>
                                    <input
                                        type="number"
                                        defaultValue={12}
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Application Deadline</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="date"
                                        defaultValue="2025-04-30"
                                        className="w-full bg-[#0F0F14] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notification Toggles */}
                    <section className="bg-[#1E1E2F] border border-white/5 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <Bell className="text-[#8B5CF6]" size={20} />
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Communication Preferences</h3>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(notifications).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                    <div>
                                        <p className="text-sm font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Via Email & Push</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification(key)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Team Members */}
                    <section className="bg-[#1E1E2F] border border-white/5 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <Users className="text-[#8B5CF6]" size={20} />
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Administrative Team</h3>
                            </div>
                            <button className="p-2 bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white rounded-lg transition-all">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Admin Vanguard', role: 'Super Admin', email: 'admin@vanguard.io' },
                                { name: 'Sarah Wilson', role: 'Cohort Manager', email: 'sarah@vanguard.io' },
                            ].map((member, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                                            {member.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{member.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{member.role} • {member.email}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Action Bar */}
                    <div className="pt-4 flex gap-4">
                        <button className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-[#8B5CF6]/30 transition-all flex items-center justify-center gap-2">
                            <Save size={20} /> Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
