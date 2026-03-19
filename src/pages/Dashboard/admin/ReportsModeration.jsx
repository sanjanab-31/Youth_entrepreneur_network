
import React, { useEffect, useMemo, useState } from 'react';
import {
    ShieldAlert,
    Flag,
    Clock,
    MoreVertical,
    AlertTriangle,
    Ban,
    CheckCircle,
    UserX,
    Bell
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const ReportsModeration = () => {
    const [systemData, setSystemData] = useState(() => getSystem());

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const reports = useMemo(() => {
        const users = systemData.users || {};
        const reportList = (systemData.reports || []).map((report, index) => {
            const user = users[report.userId] || users[report.targetId] || {};
            return {
                id: report.id || `report-${index}`,
                userId: report.userId || report.targetId || '',
                user: user.name || report.user || report.targetName || 'Unknown User',
                reason: report.reason || report.message || 'Unspecified report reason',
                date: report.date || report.createdAt || new Date().toISOString(),
                status: report.status || 'Pending',
                severity: report.severity || 'Medium',
            };
        });

        const suspendedUsers = Object.values(users)
            .filter((user) => ['suspended', 'banned'].includes((user.status || '').toLowerCase()))
            .map((user, index) => ({
                id: `status-${user.uid || user.id || index}`,
                userId: user.uid || user.id,
                user: user.name || user.email || 'User',
                reason: `Account currently marked as ${(user.status || '').toLowerCase()}`,
                date: user.updatedAt || user.createdAt || new Date().toISOString(),
                status: 'In Review',
                severity: user.status === 'banned' ? 'High' : 'Medium',
            }));

        return [...reportList, ...suspendedUsers];
    }, [systemData]);

    const activeAlerts = reports.filter((report) => report.status !== 'Resolved').length;

    const updateUserStatus = (uid, nextStatus) => {
        if (!uid) return;
        const sys = getSystem();
        if (sys.users?.[uid]) {
            sys.users[uid].status = nextStatus;
            saveSystem(sys);
        }
        setSystemData(getSystem());
    };

    const resolveReport = (reportId) => {
        const sys = getSystem();
        sys.reports = (sys.reports || []).map((report, index) => {
            const id = report.id || `report-${index}`;
            return id === reportId ? { ...report, status: 'Resolved' } : report;
        });
        saveSystem(sys);
        setSystemData(getSystem());
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reports & Moderation</h1>
                    <p className="text-gray-400">Security monitoring and community standard enforcement</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#1E1E2F] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-sm font-bold text-white">{activeAlerts} Active Alerts</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white px-2">Recent Incidents</h3>
                    {reports.length === 0 && (
                        <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 text-center text-gray-500">
                            No incidents reported yet.
                        </div>
                    )}
                    {reports.map((report) => (
                        <div key={report.id} className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 flex items-start justify-between group hover:border-red-500/30 transition-all">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.severity === 'High' ? 'bg-red-500/10 text-red-400' :
                                        report.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white">{report.user}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${report.severity === 'High' ? 'bg-red-500 text-white' :
                                                'bg-white/10 text-gray-400'
                                            }`}>
                                            {report.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3">{report.reason}</p>
                                    <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(report.date).toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><Flag size={12} /> {report.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => resolveReport(report.id)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-all">
                                    Investigate
                                </button>
                                <button onClick={() => updateUserStatus(report.userId, 'banned')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all">
                                    <Ban size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Automation & Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-6">Moderation Controls</h3>
                        <div className="space-y-4">
                            <button onClick={() => updateUserStatus(Object.keys(systemData.users || {})[0], 'banned')} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-red-500/10 rounded-xl border border-white/5 group transition-all">
                                <div className="flex items-center gap-3">
                                    <UserX size={18} className="text-red-400" />
                                    <span className="text-sm font-bold text-gray-300">Ban User</span>
                                </div>
                                <MoreVertical size={16} className="text-gray-600" />
                            </button>
                            <button onClick={() => resolveReport(reports[0]?.id)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-amber-500/10 rounded-xl border border-white/5 group transition-all">
                                <div className="flex items-center gap-3">
                                    <Bell size={18} className="text-amber-400" />
                                    <span className="text-sm font-bold text-gray-300">Send Warning</span>
                                </div>
                                <MoreVertical size={16} className="text-gray-600" />
                            </button>
                            <button onClick={() => updateUserStatus(Object.keys(systemData.users || {})[0], 'active')} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-green-500/10 rounded-xl border border-white/5 group transition-all">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-400" />
                                    <span className="text-sm font-bold text-gray-300">Whitelist Entity</span>
                                </div>
                                <MoreVertical size={16} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1E1E2F] to-[#2D1F4E]/20 p-8 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                                <AlertTriangle size={16} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Spam Detection</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">
                            AI-powered monitoring is currently flagging 12 conversations for review.
                        </p>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-[#8B5CF6]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsModeration;
