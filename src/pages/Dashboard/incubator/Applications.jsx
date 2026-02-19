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

import { useIncubator } from '../../../context/IncubatorContext';

const Applications = () => {
    const { applications, acceptApplication, rejectApplication, cohorts, mentors, assignMentorToStartup } = useIncubator();
    const [selectedApp, setSelectedApp] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCohort, setSelectedCohort] = useState('');
    const [selectedMentor, setSelectedMentor] = useState('');

    const filteredApplications = applications.filter(app => {
        if (activeTab === 'All') return true;
        return app.status.toLowerCase() === activeTab.toLowerCase();
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Program Applications</h1>
                    <p className="text-sm text-gray-400">Manage batches and evaluate enrollments</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full bg-[#1E1E2F] border border-white/5 rounded-xl py-2 px-10 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Tabs */}
            <div className="flex gap-2 p-1 bg-[#1E1E2F] rounded-xl w-fit border border-white/5 font-bold">
                {['All', 'Pending', 'Accepted', 'Rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs rounded-lg transition-all ${activeTab === tab ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
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
                                <th className="text-left py-6 px-8">Startup Name</th>
                                <th className="text-left py-6 px-4">Sector</th>
                                <th className="text-left py-6 px-4">Team Size</th>
                                <th className="text-left py-6 px-4">Applied Date</th>
                                <th className="text-left py-6 px-4">Status</th>
                                <th className="text-right py-6 px-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredApplications.map((app) => (
                                <tr
                                    key={app.id}
                                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    onClick={() => setSelectedApp(app)}
                                >
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold border border-[#8B5CF6]/20 group-hover:scale-110 transition-transform">
                                                {(app.startupName || 'V')[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{app.startupName || 'Unnamed Venture'}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{app.sector}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 font-medium italic">
                                        <span className="text-sm text-gray-300 font-medium">{app.sector}</span>
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className="text-sm font-bold text-white">{app.teamSize || 0} Members</span>
                                    </td>
                                    <td className="py-5 px-4 text-sm text-gray-500 font-medium tracking-tight">
                                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="py-5 px-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredApplications.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-500">
                                        No applications found in this category.
                                    </td>
                                </tr>
                            )}
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
                                        {(selectedApp.startupName || 'V')[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedApp.startupName}</h2>
                                        <p className="text-xs text-gray-400">{selectedApp.sector} • Application</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {/* Problem & Solution */}
                                <section className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Pitch Overview</h3>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 font-medium italic text-gray-300">
                                            "{selectedApp.problemStatement || 'No detail provided.'}"
                                        </div>
                                    </div>
                                </section>

                                {/* Assignment Section */}
                                <section className="space-y-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Decision & Assignment</h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Select Cohort (Required for Acceptance)</label>
                                            <select
                                                value={selectedCohort}
                                                onChange={(e) => setSelectedCohort(e.target.value)}
                                                className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                                            >
                                                <option value="">Move to Pipeline Only</option>
                                                {cohorts.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Assign Mentor (Optional)</label>
                                            <select
                                                value={selectedMentor}
                                                onChange={(e) => setSelectedMentor(e.target.value)}
                                                className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                                            >
                                                <option value="">Assign Later</option>
                                                {mentors.map(m => (
                                                    <option key={m.uid} value={m.uid}>{m.name} ({m.expertise || m.industry})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Documents */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#8B5CF6]">Submitted Documents</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedApp.documents?.map((doc, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all">
                                                <FileText size={18} className="text-rose-400" />
                                                <span className="text-xs font-bold text-gray-300 truncate">{doc}</span>
                                            </div>
                                        )) || <p className="text-xs text-gray-500 italic">No documents attached.</p>}
                                    </div>
                                </section>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#1E1E2F] flex gap-4">
                                <button
                                    onClick={() => {
                                        acceptApplication(selectedApp.id, selectedCohort);
                                        if (selectedMentor) {
                                            assignMentorToStartup(selectedMentor, selectedApp.startupId);
                                        }
                                        setSelectedApp(null);
                                    }}
                                    className="flex-1 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={20} /> Accept Venture
                                </button>
                                <button
                                    onClick={() => {
                                        rejectApplication(selectedApp.id);
                                        setSelectedApp(null);
                                    }}
                                    className="px-6 py-4 bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 rounded-2xl border border-white/10 hover:border-rose-500/20 transition-all flex items-center justify-center font-bold"
                                >
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
