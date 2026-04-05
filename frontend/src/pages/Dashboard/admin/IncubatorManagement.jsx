
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
import { fetchApplications } from '../../../utils/applicationsApi';
import { fetchCohorts } from '../../../utils/cohortsApi';
import { fetchIncubators, updateIncubator } from '../../../utils/incubatorsApi';

const IncubatorManagement = () => {
    const [incubatorsData, setIncubatorsData] = useState([]);
    const [cohortsData, setCohortsData] = useState([]);
    const [applicationsData, setApplicationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [incubators, cohorts, applications] = await Promise.all([
                    fetchIncubators(),
                    fetchCohorts(),
                    fetchApplications()
                ]);
                setIncubatorsData(incubators);
                setCohortsData(cohorts);
                setApplicationsData(applications);
            } catch (loadError) {
                setError(loadError.response?.data?.error || 'Failed to load incubator data');
                setIncubatorsData([]);
                setCohortsData([]);
                setApplicationsData([]);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    const refreshIncubatorData = async () => {
        setLoading(true);
        setError('');
        try {
            const [incubators, cohorts, applications] = await Promise.all([
                fetchIncubators(),
                fetchCohorts(),
                fetchApplications()
            ]);
            setIncubatorsData(incubators);
            setCohortsData(cohorts);
            setApplicationsData(applications);
        } catch (loadError) {
            setError(loadError.response?.data?.error || 'Failed to load incubator data');
        } finally {
            setLoading(false);
        }
    };

    const incubators = useMemo(() => {
        return incubatorsData.map((incubator, index) => {
            const id = incubator.id || incubator.uid || `incubator-${index}`;
            const focus = incubator.sectorFocus;
            const status = incubator.verified ? 'Verified' : 'Pending';

            return {
                id,
                name: incubator.incubatorName || incubator.name || 'Unnamed Incubator',
                focus: Array.isArray(focus) && focus.length > 0 ? focus.join(' / ') : 'General',
                cohorts: cohortsData.filter((cohort) => cohort.incubatorId === id).length,
                applications: applicationsData.filter((app) => app.incubatorId === id).length,
                status,
                verified: Boolean(incubator.verified),
                rawStatus: incubator.status || 'active'
            };
        });
    }, [applicationsData, cohortsData, incubatorsData]);

    const applyIncubatorUpdate = async (incubatorId, updater, fallbackMessage) => {
        const target = incubatorsData.find((incubator) => incubator.id === incubatorId || incubator.uid === incubatorId);
        if (!target) return;

        setActionId(incubatorId);
        setError('');
        try {
            const next = updater(target);
            await updateIncubator(incubatorId, next);
        } catch (updateError) {
            setError(updateError.response?.data?.error || fallbackMessage);
        }
        await refreshIncubatorData();
        setActionId(null);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Incubator Management</h1>
                    <p className="text-gray-400">Institutional verification and partner lifecycle management</p>
                </div>
                <div className="bg-[#1E1E2F] p-10 rounded-2xl border border-white/5 text-center text-gray-500">
                    Loading incubators...
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Incubator Management</h1>
                <p className="text-gray-400">Institutional verification and partner lifecycle management</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl text-sm font-semibold">
                    {error}
                </div>
            )}

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
                                    onClick={() => applyIncubatorUpdate(incubator.id, (inc) => ({ ...inc, verified: true, status: 'active' }), 'Failed to approve incubator')}
                                    disabled={actionId === incubator.id}
                                    className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck size={16} /> {actionId === incubator.id ? 'Working...' : 'Approve Account'}
                                </button>
                            ) : (
                                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                                    <Eye size={16} /> View Details
                                </button>
                            )}
                            <button
                                onClick={() => applyIncubatorUpdate(incubator.id, (inc) => ({ ...inc, verified: !Boolean(inc.verified) }), 'Failed to update incubator')}
                                disabled={actionId === incubator.id}
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all border border-white/5"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={() => applyIncubatorUpdate(incubator.id, (inc) => ({ ...inc, status: inc.status === 'suspended' ? 'active' : 'suspended' }), 'Failed to change incubator status')}
                                disabled={actionId === incubator.id}
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
