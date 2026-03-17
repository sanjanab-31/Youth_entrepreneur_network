
import React, { useEffect, useMemo, useState } from 'react';
import {
    Building,
    Layers,
    Target,
    ClipboardCheck,
    ShieldCheck,
    Edit3,
    Eye,
    AlertCircle
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const IncubatorManagement = () => {
    const [systemData, setSystemData] = useState(() => getSystem());

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const incubators = useMemo(() => {
        const cohortList = systemData.cohorts || [];
        const apps = systemData.applications || [];
        const users = systemData.users || {};

        return (systemData.incubators || []).map((incubator, index) => {
            const id = incubator.id || incubator.uid || `incubator-${index}`;
            const user = users[id] || {};
            const focus = incubator.sectorFocus;
            const status = incubator.verified || user.verified ? 'Verified' : 'Pending';

            return {
                id,
                name: incubator.incubatorName || incubator.name || user.name || 'Unnamed Incubator',
                focus: Array.isArray(focus) && focus.length > 0 ? focus.join(' / ') : 'General',
                cohorts: cohortList.filter((cohort) => cohort.incubatorId === id).length,
                applications: apps.filter((app) => app.incubatorId === id).length,
                status,
            };
        });
    }, [systemData]);

    const updateIncubator = (incubatorId, updater) => {
        const sys = getSystem();
        sys.incubators = (sys.incubators || []).map((incubator, index) => {
            const id = incubator.id || incubator.uid || `incubator-${index}`;
            return id === incubatorId ? updater(incubator) : incubator;
        });

        if (sys.users?.[incubatorId]) {
            const updatedUser = updater(sys.users[incubatorId]);
            sys.users[incubatorId] = {
                ...sys.users[incubatorId],
                verified: Boolean(updatedUser.verified),
                status: updatedUser.status || sys.users[incubatorId].status,
            };
        }

        saveSystem(sys);

        const profileKey = `profile_${incubatorId}`;
        const raw = localStorage.getItem(profileKey);
        if (raw) {
            try {
                const profile = JSON.parse(raw);
                const updatedProfile = updater(profile);
                localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
            } catch {
                // Ignore malformed profile cache.
            }
        }
        setSystemData(getSystem());
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Incubator Management</h1>
                <p className="text-gray-400">Institutional verification and partner lifecycle management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {incubators.length === 0 && (
                    <div className="md:col-span-2 bg-[#1E1E2F] p-10 rounded-2xl border border-white/5 text-center text-gray-500">
                        No incubators registered yet.
                    </div>
                )}
                {incubators.map((incubator) => (
                    <div key={incubator.id} className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20">
                                <Building size={32} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${incubator.status === 'Verified' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                {incubator.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8B5CF6] transition-colors">{incubator.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                            <Target size={14} className="text-[#8B5CF6]" />
                            {incubator.focus}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Active Cohorts</p>
                                <div className="flex items-center gap-2">
                                    <Layers size={16} className="text-white/40" />
                                    <span className="text-lg font-bold text-white">{incubator.cohorts}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Total Apps</p>
                                <div className="flex items-center gap-2">
                                    <ClipboardCheck size={16} className="text-white/40" />
                                    <span className="text-lg font-bold text-white">{incubator.applications}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-white/5">
                            {incubator.status === 'Pending' ? (
                                <button
                                    onClick={() => updateIncubator(incubator.id, (inc) => ({ ...inc, verified: true, status: 'active' }))}
                                    className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck size={16} /> Approve Account
                                </button>
                            ) : (
                                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                                    <Eye size={16} /> View Details
                                </button>
                            )}
                            <button
                                onClick={() => updateIncubator(incubator.id, (inc) => ({ ...inc, verified: !inc.verified }))}
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all border border-white/5"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={() => updateIncubator(incubator.id, (inc) => ({ ...inc, status: inc.status === 'suspended' ? 'active' : 'suspended' }))}
                                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/10"
                            >
                                <AlertCircle size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncubatorManagement;
