
import React from 'react';
import {
    ClipboardList,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Search as SearchIcon,
    AlertCircle
} from 'lucide-react';

const ApplicationsControl = () => {
    const applications = [
        { id: 1, startup: 'PayFlow', incubator: 'Peak Accelerate', stage: 'Round 1', status: 'Pending', date: 'Feb 12, 2026' },
        { id: 2, startup: 'Vision AI', incubator: 'DeepTech Ventures', stage: 'Final Review', status: 'Accepted', date: 'Feb 10, 2026' },
        { id: 3, startup: 'EcoGrid', incubator: 'Peak Accelerate', stage: 'Interview', status: 'In Review', date: 'Feb 05, 2026' },
        { id: 4, startup: 'HealthSync', incubator: 'GreenHouse Africa', stage: 'Round 1', status: 'Stalled', date: 'Jan 28, 2026' },
        { id: 5, startup: 'LogiLink', incubator: 'DeepTech Ventures', stage: 'Round 1', status: 'Rejected', date: 'Jan 15, 2026' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Applications Control</h1>
                    <p className="text-gray-400">Platform-wide monitoring of incubator selection processes</p>
                </div>
                <div className="flex bg-[#1E1E2F] rounded-xl border border-white/5 p-1">
                    <button className="px-4 py-1.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-[#8B5CF6]/20">Active Apps</button>
                    <button className="px-4 py-1.5 text-gray-500 text-xs font-bold rounded-lg hover:text-white transition-all">Stalled</button>
                    <button className="px-4 py-1.5 text-gray-500 text-xs font-bold rounded-lg hover:text-white transition-all">Archive</button>
                </div>
            </div>

            <div className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/2 flex gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by startup or incubator..."
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
                        {applications.map((app, index) => (
                            <tr key={index} className="hover:bg-white/2 transition-all group">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-white mb-0.5">{app.startup}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">ID: #APP-{2000 + app.id}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300 font-medium">{app.incubator}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                        <span className="text-sm text-gray-300">{app.stage}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Accepted' ? 'bg-green-500/10 text-green-400' :
                                            app.status === 'Stalled' ? 'bg-red-500/10 text-red-400 animate-pulse' :
                                                app.status === 'Rejected' ? 'bg-gray-500/10 text-gray-500' :
                                                    'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{app.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg transition-all" title="View Application">
                                            <ArrowRight size={18} />
                                        </button>
                                        {app.status === 'Stalled' && (
                                            <button className="p-2 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-all" title="Intervene / Notify Admin">
                                                <AlertCircle size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
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
