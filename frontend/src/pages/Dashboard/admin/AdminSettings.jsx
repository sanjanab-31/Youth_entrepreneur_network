
import React, { useEffect, useMemo, useState } from 'react';
import {
    Shield,
    Zap,
    Mail,
    Eye,
    Database,
    Globe,
    Save
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const AdminSettings = () => {
    const [systemData, setSystemData] = useState(() => getSystem());

    const settings = useMemo(() => {
        const current = systemData.settings || {};
        return {
            publicSearchVisibility: current.publicSearchVisibility ?? true,
            founderDirectChat: current.founderDirectChat ?? true,
            openMentorApplications: current.openMentorApplications ?? false,
            automaticVerification: current.automaticVerification ?? true,
            verificationThreshold: Number(current.verificationThreshold ?? 50),
            templates: current.templates || [
                'Welcome Sequence',
                'Verification Success',
                'Match Found Notification',
                'Suspension Warning'
            ]
        };
    }, [systemData.settings]);

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const updateSettings = (updater) => {
        const sys = getSystem();
        const current = sys.settings || {};
        sys.settings = updater(current);
        saveSystem(sys);
        setSystemData(getSystem());
    };

    const saveAll = () => {
        const sys = getSystem();
        sys.settings = {
            ...(sys.settings || {}),
            ...settings
        };
        saveSystem(sys);
        setSystemData(getSystem());
    };

    const infraStats = {
        users: Object.keys(systemData.users || {}).length,
        startups: (systemData.startups || []).length,
        sessions: (systemData.sessions || []).length,
        pendingReports: (systemData.reports || []).filter(r => (r.status || '').toLowerCase() !== 'resolved').length,
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
                    <p className="text-gray-400">Configure core platform behavior and management rules</p>
                </div>
                <button onClick={saveAll} className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2">
                    <Save size={18} /> Save All Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feature Toggles */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap size={20} className="text-[#8B5CF6]" />
                        <h3 className="text-lg font-bold text-white">Platform Features</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { key: 'publicSearchVisibility', name: 'Public Search Visibility', desc: 'Allow indexers to crawl public profiles' },
                            { key: 'founderDirectChat', name: 'Direct founder-to-founder chat', desc: 'Enable messaging between founders' },
                            { key: 'openMentorApplications', name: 'Open Mentor Applications', desc: 'Allow new mentors to apply' },
                            { key: 'automaticVerification', name: 'Automatic Verification', desc: 'Use AI for initial profile scan' },
                        ].map((feat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white">{feat.name}</p>
                                    <p className="text-[10px] text-gray-500">{feat.desc}</p>
                                </div>
                                <div
                                    onClick={() => updateSettings((current) => ({
                                        ...current,
                                        [feat.key]: !current[feat.key]
                                    }))}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${settings[feat.key] ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings[feat.key] ? 'ml-6' : 'ml-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badge Management */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={20} className="text-[#8B5CF6]" />
                        <h3 className="text-lg font-bold text-white">Badge & Verification Rules</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                            <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">Verification Threshold</label>
                            <input
                                type="range"
                                className="w-full accent-[#8B5CF6]"
                                min={0}
                                max={100}
                                value={settings.verificationThreshold}
                                onChange={(e) => updateSettings((current) => ({
                                    ...current,
                                    verificationThreshold: Number(e.target.value)
                                }))}
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold tracking-widest uppercase">
                                <span>Lax</span>
                                <span>Balanced ({settings.verificationThreshold})</span>
                                <span>Strict</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-left group">
                                <p className="text-sm font-bold text-white group-hover:text-[#8B5CF6]">Customize "Verified"</p>
                                <p className="text-[10px] text-gray-500">Edit visual styling</p>
                            </button>
                            <button className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-left group">
                                <p className="text-sm font-bold text-white group-hover:text-[#8B5CF6]">Customize "Featured"</p>
                                <p className="text-[10px] text-gray-500">Edit logic conditions</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Comms */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail size={20} className="text-[#8B5CF6]" />
                        <h3 className="text-lg font-bold text-white">Email & Notif Templates</h3>
                    </div>
                    <div className="space-y-2">
                        {settings.templates.map((t, i) => (
                            <button key={i} className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-gray-300">
                                {t}
                                <Eye size={16} className="text-gray-600" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Infrastructure Stats */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Database size={20} className="text-[#8B5CF6]" />
                            <h3 className="text-lg font-bold text-white">System Logs</h3>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Total Users</span>
                                <span className="text-green-400 font-bold">{infraStats.users}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Registered Startups</span>
                                <span className="text-white font-bold">{infraStats.startups}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Sessions Logged</span>
                                <span className="text-amber-500 font-bold">{infraStats.sessions}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Pending Reports</span>
                                <span className="text-red-400 font-bold">{infraStats.pendingReports}</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2">
                        <Globe size={14} /> Global Status Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
