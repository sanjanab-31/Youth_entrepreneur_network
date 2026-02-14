
import React, { useState, useEffect } from 'react';
import { User, Bell, Eye, Shield, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = ({ role: initialRole }) => {
    const [user, setUser] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // Initialization Logic
    useEffect(() => {
        const savedUser = localStorage.getItem('vanguardUser');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            // Ensure structure is maintained if some fields are missing
            const mergedUser = {
                fullName: parsedUser.fullName || "User Name",
                email: parsedUser.email || "user@vanguard.io",
                role: parsedUser.role || initialRole || 'Founder',
                commitmentLevel: parsedUser.commitmentLevel || "Full-time",
                bio: parsedUser.bio || "",
                preferences: {
                    emailNotifications: true,
                    mentorAlerts: true,
                    ...(parsedUser.preferences || {})
                },
                visibility: {
                    profile: "public",
                    startup: "visible",
                    ...(parsedUser.visibility || {})
                }
            };
            setUser(mergedUser);
        } else {
            const defaultUser = {
                fullName: "Siddharth Sharma",
                email: "sid@nebulaai.io",
                role: initialRole || 'Founder',
                commitmentLevel: "Full-time",
                bio: "Building the next generation of neural networks for startup workflows.",
                preferences: {
                    emailNotifications: true,
                    mentorAlerts: true
                },
                visibility: {
                    profile: "public",
                    startup: "visible"
                }
            };
            localStorage.setItem('vanguardUser', JSON.stringify(defaultUser));
            setUser(defaultUser);
        }
    }, [initialRole]);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const updateField = (field, value) => {
        const newUser = { ...user, [field]: value };
        setUser(newUser);
        localStorage.setItem('vanguardUser', JSON.stringify(newUser));
        triggerToast("Changes Saved");
    };

    const updateNestedField = (section, field, value) => {
        const newUser = {
            ...user,
            [section]: {
                ...user[section],
                [field]: value
            }
        };
        setUser(newUser);
        localStorage.setItem('vanguardUser', JSON.stringify(newUser));
        triggerToast("Changes Saved");
    };

    const handleSaveAll = () => {
        triggerToast("All settings updated");
    };

    if (!user) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const isCoFounder = user.role.toLowerCase() === 'co-founder';

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your profile and platform preferences.</p>
                </div>
                <button
                    onClick={handleSaveAll}
                    className="px-6 py-3 bg-[#8B5CF6] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] hover:scale-105 active:scale-95 transition-all"
                >
                    Save All Changes
                </button>
            </div>

            {/* 1️⃣ PERSONAL PROFILE */}
            <section className="bg-[#1E1E2F] rounded-[16px] border border-white/5 overflow-hidden shadow-xl">
                <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <User className="text-[#8B5CF6]" size={20} /> Personal Profile
                    </h2>
                </div>
                <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Full Name */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                value={user.fullName}
                                onChange={(e) => updateField('fullName', e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all font-medium placeholder:text-gray-700"
                                placeholder="Enter your full name"
                            />
                        </div>
                        {/* Email */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-[#0F0F14]/50 border border-white/5 rounded-xl p-4 text-sm text-gray-500 font-medium cursor-not-allowed italic"
                                />
                                <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    {/* Commitment Level */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Commitment Level</label>
                        <div className="flex flex-wrap gap-2">
                            {['Full-time', 'Part-time', 'Consulting'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => updateField('commitmentLevel', level)}
                                    className={`px-6 py-3 rounded-xl text-xs font-bold transition-all border ${user.commitmentLevel === level
                                        ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                                        : 'bg-[#0F0F14] border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Bio</label>
                        <textarea
                            value={user.bio}
                            onChange={(e) => updateField('bio', e.target.value)}
                            rows={4}
                            className="w-full bg-[#0F0F14] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/20 transition-all font-medium resize-none placeholder:text-gray-700"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>
            </section>

            {/* 2️⃣ ACCOUNT PREFERENCES */}
            <section className="bg-[#1E1E2F] rounded-[16px] border border-white/5 overflow-hidden shadow-xl">
                <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <Bell className="text-[#8B5CF6]" size={20} /> Account Preferences
                    </h2>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5 transition-all hover:bg-white/[0.04]">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Email Notifications</p>
                            <p className="text-xs text-gray-500">Receive updates and activity logs via email.</p>
                        </div>
                        <button
                            onClick={() => updateNestedField('preferences', 'emailNotifications', !user.preferences.emailNotifications)}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 focus:outline-none ${user.preferences.emailNotifications ? 'bg-[#8B5CF6]' : 'bg-gray-700'
                                }`}
                        >
                            <motion.div
                                animate={{ x: user.preferences.emailNotifications ? 24 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    {/* Mentor Request Alerts */}
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5 transition-all hover:bg-white/[0.04]">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Mentor Request Alerts</p>
                            <p className="text-xs text-gray-500">Instant notification when a mentor responds or requests a session.</p>
                        </div>
                        <button
                            onClick={() => updateNestedField('preferences', 'mentorAlerts', !user.preferences.mentorAlerts)}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 focus:outline-none ${user.preferences.mentorAlerts ? 'bg-[#8B5CF6]' : 'bg-gray-700'
                                }`}
                        >
                            <motion.div
                                animate={{ x: user.preferences.mentorAlerts ? 24 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* 3️⃣ PRIVACY & VISIBILITY */}
            <section className="bg-[#1E1E2F] rounded-[16px] border border-white/5 overflow-hidden shadow-xl">
                <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <Eye className="text-[#8B5CF6]" size={20} /> Privacy & Visibility
                    </h2>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                    {/* Profile Visibility */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Visibility</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => updateNestedField('visibility', 'profile', 'public')}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${user.visibility.profile === 'public'
                                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-white'
                                    : 'bg-[#0F0F14] border-white/5 text-gray-500'
                                    }`}
                            >
                                <span className="text-sm font-bold">Public within Vanguard</span>
                                {user.visibility.profile === 'public' && <CheckCircle2 size={16} className="text-[#8B5CF6]" />}
                            </button>
                            <button
                                onClick={() => updateNestedField('visibility', 'profile', 'private')}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${user.visibility.profile === 'private'
                                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-white'
                                    : 'bg-[#0F0F14] border-white/5 text-gray-500'
                                    }`}
                            >
                                <span className="text-sm font-bold">Private</span>
                                {user.visibility.profile === 'private' && <CheckCircle2 size={16} className="text-[#8B5CF6]" />}
                            </button>
                        </div>
                    </div>

                    {/* Startup Visibility - Conditional Role Logic */}
                    {user.role.toLowerCase() === 'founder' && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Startup Visibility</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => updateNestedField('visibility', 'startup', 'visible')}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${user.visibility.startup === 'visible'
                                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-white'
                                        : 'bg-[#0F0F14] border-white/5 text-gray-500'
                                        }`}
                                >
                                    <span className="text-sm font-bold">Visible to Mentors & Incubators</span>
                                    {user.visibility.startup === 'visible' && <CheckCircle2 size={16} className="text-[#8B5CF6]" />}
                                </button>
                                <button
                                    onClick={() => updateNestedField('visibility', 'startup', 'hidden')}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${user.visibility.startup === 'hidden'
                                        ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-white'
                                        : 'bg-[#0F0F14] border-white/5 text-gray-500'
                                        }`}
                                >
                                    <span className="text-sm font-bold">Hidden</span>
                                    {user.visibility.startup === 'hidden' && <CheckCircle2 size={16} className="text-[#8B5CF6]" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-3 bg-[#1E1E2F] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl shadow-[#8B5CF6]/10"
                    >
                        <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#8B5CF6]" />
                        </div>
                        <span className="text-sm font-bold text-white">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Settings;

