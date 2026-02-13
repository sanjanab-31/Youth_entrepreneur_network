
import React from 'react';
import {
    ShieldAlert,
    User,
    Flag,
    Clock,
    MoreVertical,
    AlertTriangle,
    Ban,
    CheckCircle,
    UserX,
    Bell
} from 'lucide-react';

const ReportsModeration = () => {
    const reports = [
        { id: 1, user: 'Unknown_User', reason: 'Spam activity in Mentor chat', date: '2 hours ago', status: 'Pending', severity: 'High' },
        { id: 2, user: 'John Doe', reason: 'Suspicious login locations', date: '5 hours ago', status: 'In Review', severity: 'Medium' },
        { id: 3, user: 'StartupX', reason: 'Misleading profile data', date: '1 day ago', status: 'Pending', severity: 'Low' },
    ];

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
                        <span className="text-sm font-bold text-white">4 Active Alerts</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white px-2">Recent Incidents</h3>
                    {reports.map((report, index) => (
                        <div key={index} className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 flex items-start justify-between group hover:border-red-500/30 transition-all">
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
                                        <span className="flex items-center gap-1"><Clock size={12} /> {report.date}</span>
                                        <span className="flex items-center gap-1"><Flag size={12} /> {report.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-all">
                                    Investigate
                                </button>
                                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all">
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
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-red-500/10 rounded-xl border border-white/5 group transition-all">
                                <div className="flex items-center gap-3">
                                    <UserX size={18} className="text-red-400" />
                                    <span className="text-sm font-bold text-gray-300">Ban User</span>
                                </div>
                                <MoreVertical size={16} className="text-gray-600" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-amber-500/10 rounded-xl border border-white/5 group transition-all">
                                <div className="flex items-center gap-3">
                                    <Bell size={18} className="text-amber-400" />
                                    <span className="text-sm font-bold text-gray-300">Send Warning</span>
                                </div>
                                <MoreVertical size={16} className="text-gray-600" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-green-500/10 rounded-xl border border-white/5 group transition-all">
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
