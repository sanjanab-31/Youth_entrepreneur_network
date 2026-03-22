
import React from 'react';
import {
    Users,
    CheckSquare,
    ListTodo,
    MessageSquare,
    MoreHorizontal,
    Plus,
    Calendar,
    Search,
    Filter,
    User
} from 'lucide-react';

const TeamCollaboration = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                            Co-Founder Portal
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-sm font-medium">Internal Command</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Team <span className="text-[#8B5CF6]">Collaboration</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="p-2.5 bg-[#1E1E2F] text-gray-400 rounded-xl border border-white/5 hover:text-white transition-all"><Search size={20} /></button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] transition-all">
                        <Plus size={18} /> New Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Team Members List */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Active Force</h3>
                    <div className="space-y-4">
                        {[
                            { n: 'Siddharth S.', r: 'CEO / Founder', i: 'SS', o: true },
                            { n: 'Priya K.', r: 'Product Lead', i: 'PK', o: true },
                            { n: 'Alex M.', r: 'UI/UX Design', i: 'AM', o: false },
                            { n: 'Vansh R.', r: 'Marketing', i: 'VR', o: true }
                        ].map((m, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-[#1E1E2F] rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all cursor-pointer">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-gray-400 border border-white/10">{m.i}</div>
                                    {m.o && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1E1E2F] rounded-full" />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold text-gray-200 text-sm truncate">{m.n}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{m.r}</p>
                                </div>
                                <MoreHorizontal size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-xs font-bold text-gray-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <Plus size={14} /> View All Members
                    </button>
                </div>

                {/* Task & Responsibility Tracker */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Task Board */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white flex items-center gap-3">
                                <ListTodo className="text-[#8B5CF6]" size={20} />
                                Active Task Board
                            </h3>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors">
                                    <Filter size={14} /> Filter
                                </button>
                                <span className="text-gray-700">|</span>
                                <button className="text-xs font-black text-[#8B5CF6] uppercase tracking-widest">My Tasks</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { t: 'Implement JWT session handling on backend', p: 'High', d: 'Today', s: 'In Progress', a: 'You' },
                                { t: 'User research documentation review', p: 'Medium', d: 'Tomorrow', s: 'Pending', a: 'Priya' },
                                { t: 'Edge inference latency testing', p: 'High', d: 'Nov 15', s: 'Stuck', a: 'You' },
                                { t: 'Landing page CTA copy update', p: 'Low', d: 'Done', s: 'Completed', a: 'Vansh' }
                            ].map((task, i) => (
                                <div key={i} className="group p-5 bg-white/5 rounded-2xl border border-white/5 border-l-4 hover:bg-white/10 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderLeftColor: task.s === 'Completed' ? '#10b981' : (task.s === 'In Progress' ? '#8B5CF6' : (task.s === 'Stuck' ? '#ef4444' : '#3b82f6')) }}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-white">{task.t}</span>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${task.p === 'High' ? 'bg-red-500/10 text-red-500' : (task.p === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500')}`}>
                                                {task.p}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Calendar size={10} /> {task.d}</span>
                                            <span className="flex items-center gap-1"><User size={10} /> {task.a}</span>
                                            <span className="text-[#8B5CF6]">{task.s}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-[#8B5CF6]/20 rounded-lg text-gray-500 hover:text-[#8B5CF6] transition-all"><CheckSquare size={18} /></button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"><MessageSquare size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <SectionHeader icon={MessageSquare} title="Internal Command Notes" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                                <p className="text-xs text-blue-400 font-bold uppercase mb-4 tracking-widest">Tech Debt Alert</p>
                                <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                                    "The current edge-sync protocol might fail under extremely low bandwidth (under 50kbps). Need to implement a chunk-based retry mechanism by EOW."
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-600 font-bold uppercase">Posted 2h ago</span>
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20" />
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                                <p className="text-xs text-purple-400 font-bold uppercase mb-4 tracking-widest">GTM Insight</p>
                                <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                                    "Pilot retailers in Indore reported the UI is too cluttered for small screens. Focus next PR on mobile-first optimization."
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-600 font-bold uppercase">Posted 5h ago</span>
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title }) => (
    <h3 className="text-xl font-black text-white flex items-center gap-3 mb-6">
        <Icon className="text-[#8B5CF6]" size={20} />
        {title}
    </h3>
);

export default TeamCollaboration;
