
import React from 'react';
import {
    Building,
    Layers,
    Target,
    ClipboardCheck,
    ShieldCheck,
    Users,
    ArrowUpRight,
    Edit3,
    Eye,
    AlertCircle
} from 'lucide-react';

const IncubatorManagement = () => {
    const incubators = [
        { id: 1, name: 'Peak Accelerate', focus: 'B2B SaaS / FinTech', cohorts: 4, applications: 245, status: 'Verified' },
        { id: 2, name: 'DeepTech Ventures', focus: 'AI / Robotics', cohorts: 2, applications: 182, status: 'Verified' },
        { id: 3, name: 'GreenHouse Africa', focus: 'Social Impact / AgTech', cohorts: 6, applications: 560, status: 'Verified' },
        { id: 4, name: 'Innovation Hub NYC', focus: 'Web3 / DeFi', cohorts: 1, applications: 89, status: 'Pending' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Incubator Management</h1>
                <p className="text-gray-400">Institutional verification and partner lifecycle management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {incubators.map((incubator, index) => (
                    <div key={index} className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-300 group">
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
                                <button className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                    <ShieldCheck size={16} /> Approve Account
                                </button>
                            ) : (
                                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                                    <Eye size={16} /> View Details
                                </button>
                            )}
                            <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all border border-white/5">
                                <Edit3 size={16} />
                            </button>
                            <button className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/10">
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
