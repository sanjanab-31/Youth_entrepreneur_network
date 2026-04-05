
import React, { useEffect, useMemo, useState } from 'react';
import {
    MoreHorizontal,
    ArrowRight,
    Search as SearchIcon,
    AlertCircle
} from 'lucide-react';
import {
    acceptApplication,
    deleteApplication,
    fetchApplications,
    rejectApplication,
    updateApplication,
    waitlistApplication
} from '../../../utils/applicationsApi';
import { getSystem } from '../../../utils/system';

const ApplicationsControl = () => {
    const [systemData] = useState(() => getSystem());
    const [applicationsData, setApplicationsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [tab, setTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const rows = await fetchApplications();
                setApplicationsData(rows);
            } catch (loadError) {
                setError(loadError.response?.data?.error || 'Failed to load applications');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const refreshApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const rows = await fetchApplications();
            setApplicationsData(rows);
        } catch (loadError) {
            setError(loadError.response?.data?.error || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const applications = useMemo(() => {
        const startupMap = (systemData.startups || []).reduce((acc, startup, index) => {
            const id = startup.id || startup.uid || startup.startupId || `startup-${index}`;
            acc[id] = startup;
            return acc;
        }, {});
        const incubatorMap = (systemData.incubators || []).reduce((acc, incubator, index) => {
            const id = incubator.id || incubator.uid || `incubator-${index}`;
            acc[id] = incubator;
            return acc;
        }, {});

        return applicationsData
            .map((application, index) => {
                const id = application.id || application.applicationId || `app-${index}`;
                const normalizedStatus = (application.status || 'pending').toLowerCase();
                const startup = startupMap[application.startupId] || {};
                const incubator = incubatorMap[application.incubatorId] || {};
                const submittedAt = application.createdAt || application.submittedAt || application.date;

                return {
                    id,
                    startup: startup.startupName || startup.name || application.startupName || 'Unknown Startup',
                    incubator: incubator.incubatorName || incubator.name || application.incubatorName || 'Unknown Incubator',
                    stage: application.stage || application.currentStage || 'Round 1',
                    status: normalizedStatus,
                    submittedAt,
                };
            })
            .filter((application) => {
                const q = searchQuery.toLowerCase();
                const matchesSearch = !q ||
                    application.startup.toLowerCase().includes(q) ||
                    application.incubator.toLowerCase().includes(q);
                const matchesTab = tab === 'all' ||
                    (tab === 'active' && ['pending', 'in review', 'in-review', 'accepted'].includes(application.status)) ||
                    (tab === 'stalled' && application.status === 'stalled') ||
                    (tab === 'archive' && ['rejected', 'withdrawn', 'waitlisted'].includes(application.status));
                return matchesSearch && matchesTab;
            });
    }, [applicationsData, searchQuery, systemData, tab]);

    const runWithRefresh = async (applicationId, fn, fallbackMessage) => {
        setActionId(applicationId);
        setError('');
        try {
            await fn();
        } catch (actionError) {
            setError(actionError.response?.data?.error || fallbackMessage);
        }
        await refreshApplications();
        setActionId(null);
    };

    const updateApplicationStatus = async (applicationId, nextStatus) => {
        await runWithRefresh(
            applicationId,
            async () => {
                await updateApplication(applicationId, { status: nextStatus });
            },
            'Failed to update application'
        );
    };

    const acceptApp = async (applicationId) => {
        await runWithRefresh(
            applicationId,
            async () => {
                await acceptApplication(applicationId);
            },
            'Failed to accept application'
        );
    };

    const rejectApp = async (applicationId) => {
        await runWithRefresh(
            applicationId,
            async () => {
                await rejectApplication(applicationId);
            },
            'Failed to reject application'
        );
    };

    const waitlistApp = async (applicationId) => {
        await runWithRefresh(
            applicationId,
            async () => {
                await waitlistApplication(applicationId);
            },
            'Failed to waitlist application'
        );
    };

    const deleteApp = async (applicationId) => {
        await runWithRefresh(
            applicationId,
            async () => {
                await deleteApplication(applicationId);
            },
            'Failed to delete application'
        );
    };

    const prettyStatus = (status) => {
        if (status === 'in review' || status === 'in-review') return 'In Review';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (value) => {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Applications Control</h1>
                    <p className="text-gray-400">Platform-wide monitoring of incubator selection processes</p>
                </div>
                <div className="flex bg-[#1E1E2F] rounded-xl border border-white/5 p-1">
                    <button onClick={() => setTab('active')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'active' ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-gray-500 hover:text-white'}`}>Active Apps</button>
                    <button onClick={() => setTab('stalled')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'stalled' ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-gray-500 hover:text-white'}`}>Stalled</button>
                    <button onClick={() => setTab('archive')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'archive' ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-gray-500 hover:text-white'}`}>Archive</button>
                    <button onClick={() => setTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'all' ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-gray-500 hover:text-white'}`}>All</button>
                </div>
            </div>

            <div className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/2 flex gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by startup or incubator..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50"
                        />
                    </div>
                    <button className="px-4 py-2 bg-black/20 border border-white/5 rounded-xl text-sm font-medium hover:bg-white/5 transition-all text-gray-400">
                        Date Range
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Startup</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Target Incubator</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Current Stage</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading applications...</td>
                            </tr>
                        )}
                        {!loading && error && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-red-400">{error}</td>
                            </tr>
                        )}
                        {!loading && !error && applications.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No applications found</td>
                            </tr>
                        )}
                        {!loading && !error && applications.map((app) => (
                            <tr key={app.id} className="hover:bg-white/2 transition-all group">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-white mb-0.5">{app.startup}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">ID: {app.id}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300 font-medium">{app.incubator}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                        <span className="text-sm text-gray-300">{app.stage}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                                            app.status === 'stalled' ? 'bg-red-500/10 text-red-400 animate-pulse' :
                                                app.status === 'rejected' ? 'bg-gray-500/10 text-gray-500' :
                                                    'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {prettyStatus(app.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(app.submittedAt)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => updateApplicationStatus(app.id, 'in review')} className="p-2 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg transition-all" title="Move to In Review">
                                            <ArrowRight size={18} />
                                        </button>
                                        {app.status === 'stalled' && (
                                            <button onClick={() => waitlistApp(app.id)} className="p-2 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-all" title="Move to Waitlist">
                                                <AlertCircle size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => (app.status === 'accepted' ? rejectApp(app.id) : acceptApp(app.id))}
                                            className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-all"
                                            title="Toggle Accepted/Rejected"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        {tab === 'archive' && (
                                            <button
                                                onClick={() => deleteApp(app.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                title="Delete Application"
                                            >
                                                <AlertCircle size={18} />
                                            </button>
                                        )}
                                        {actionId === app.id && (
                                            <span className="text-[10px] text-gray-500 font-bold">...</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Fairness Disclaimer */}
            <div className="bg-gradient-to-r from-[#8B5CF6]/5 to-transparent border-l-4 border-[#8B5CF6] p-6 rounded-r-2xl">
                <h4 className="text-sm font-bold text-[#8B5CF6] mb-1">Institutional Oversight</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                    This control panel allows administrative intervention in stalled recruitment processes.
                    Monitor response times to ensure ecosystem fairness and platform operational efficiency.
                </p>
            </div>
        </div>
    );
};

export default ApplicationsControl;
