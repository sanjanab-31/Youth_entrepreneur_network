import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MoreHorizontal,
    ChevronRight,
    Calendar,
    Star,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Filter,
    Edit3,
    ArrowUpDown,
    Check
} from 'lucide-react';

const Applications = () => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

    const applications = [
        {
            id: 1,
            name: 'CloudScale',
            sector: 'Cloud Infra',
            stage: 'Revenue',
            metrics: '₹4.2L MRR',
            date: 'Feb 12, 2025',
            status: 'Shortlisted',
            founder: 'James Wilson',
            notes: 'Strong technical team, but product-market fit needs validation in SEA.',
            score: 4.5,
            interviewScheduled: true,
        },
        {
            id: 2,
            name: 'BioGen',
            sector: 'BioTech',
            stage: 'MVP',
            metrics: '2 Clinical Pilots',
            date: 'Feb 10, 2025',
            status: 'Under Review',
            founder: 'Dr. Elena Rossi',
            notes: 'Very early stage, but IP is promising.',
            score: 3.8,
            interviewScheduled: false,
        },
        {
            id: 3,
            name: 'PayNext',
            sector: 'FinTech',
            stage: 'Idea',
            metrics: '1k Waitlist',
            date: 'Feb 08, 2025',
            status: 'Rejected',
            founder: 'Karan Mehra',
            notes: 'Market already saturated with similar solutions.',
            score: 2.1,
            interviewScheduled: false,
        },
        {
            id: 4,
            name: 'AgriSmart',
            sector: 'AgriTech',
            stage: 'MVP',
            metrics: '500 Farmers',
            date: 'Feb 05, 2025',
            status: 'Under Review',
            founder: 'Arjun Verma',
            notes: 'Interesting GTM strategy. Need to check unit economics.',
            score: 4.0,
            interviewScheduled: true,
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'Under Review': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Program Applications</h1>
                    <p className="text-sm text-gray-400">Manage Batch Spring 2025 enrollments</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full bg-[#1E1E2F] border border-white/5 rounded-xl py-2 px-10 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm font-bold text-white transition-all">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Quick Tabs */}
            <div className="flex gap-2 p-1 bg-[#1E1E2F] rounded-xl w-fit border border-white/5">
                {['All', 'Under Review', 'Shortlisted', 'Rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Applications Table */}
            <div className="bg-[#1E1E2F] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <th className="text-left py-6 px-8 flex items-center gap-2">Startup Name <ArrowUpDown size={12} /></th>
                                <th className="text-left py-6 px-4">Sector</th>
                                <th className="text-left py-6 px-4">Stage</th>
                                <th className="text-left py-6 px-4">Metrics</th>
                                <th className="text-left py-6 px-4">Applied Date</th>
                                <th className="text-left py-6 px-4">Status</th>
                                <th className="text-right py-6 px-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {applications.map((app) => (
                                <tr
                                    key={app.id}
                                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => setSelectedApp(app)}
                                >
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold border border-[#8B5CF6]/20 group-hover:scale-110 transition-transform">
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{app.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{app.founder}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className="text-sm text-gray-300 font-medium">{app.sector}</span>
                                    </td>
                                    <td className="py-5 px-4 font-bold">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase border ${app.stage === 'Revenue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-gray-400 border-white/5'
                                            }`}>
                                            {app.stage}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4">
                                        <p className="text-sm font-bold text-white">{app.metrics}</p>
                                    </td>
                                    <td className="py-5 px-4 text-sm text-gray-500">
                                        {app.date}
                                    </td>
                                    <td className="py-5 px-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Sidebar */}
            <AnimatePresence>
                {selectedApp && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApp(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#1E1E2F] border-l border-white/10 z-[110] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1E1E2F]/80 backdrop-blur-xl sticky top-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#8B5CF6]/20">
                                        {selectedApp.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedApp.name}</h2>
                                        <p className="text-xs text-gray-400">{selectedApp.sector} • Batch 2025</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {/* Program Status */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                        <Clock size={14} /> Evaluation Status
                                    </h3>
                                    <div className="flex gap-3">
                                        {['Under Review', 'Shortlisted', 'Rejected'].map(status => (
                                            <button
                                                key={status}
                                                className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${selectedApp.status === status
                                                        ? getStatusColor(status).replace('bg-', 'bg-opacity-20 bg-').replace('border-', 'border-opacity-100 border-')
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Internal Metrics */}
                                <section className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Scoring Index</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-bold text-white">{selectedApp.score}</span>
                                            <span className="text-sm text-gray-500 mb-1">/ 5.0</span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Interview Status</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {selectedApp.interviewScheduled ? (
                                                <span className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                                    <Calendar size={16} /> Scheduled
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 font-bold text-sm">Not Scheduled</span>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Internal Notes */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6] flex items-center gap-2">
                                            <Edit3 size={14} /> Internal Evaluation Notes
                                        </h3>
                                        <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">Edit Notes</button>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-sm text-gray-300 leading-relaxed italic">
                                            "{selectedApp.notes}"
                                        </p>
                                    </div>
                                </section>

                                {/* Execution Checklist / Score Breakdown */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Score Breakdown</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Market Opportunity', score: '90%' },
                                            { label: 'Technical Depth', score: '85%' },
                                            { label: 'Revenue Potential', score: '60%' },
                                            { label: 'Team Quality', score: '95%' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-gray-400">{item.label}</span>
                                                    <span className="text-white">{item.score}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#8B5CF6]" style={{ width: item.score }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Link to Full Profile */}
                                <button className="w-full py-4 bg-white/5 hover:bg-[#8B5CF6] text-white rounded-2xl border border-white/5 hover:border-[#8B5CF6] transition-all font-bold flex items-center justify-center gap-3 group">
                                    View Full Startup Execution Profile
                                    <ArrowUpDown size={16} className="rotate-90 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#1E1E2F] flex gap-4">
                                <button className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2">
                                    <Check size={20} /> Update Status
                                </button>
                                <button className="px-6 py-4 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 rounded-2xl border border-white/10 hover:border-rose-500/20 transition-all">
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Applications;
