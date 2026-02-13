
import React from 'react';
import {
    Users,
    Briefcase,
    Star,
    CheckCircle2,
    ShieldCheck,
    Clock,
    MessageSquare,
    Search,
    Filter,
    Award,
    Ban
} from 'lucide-react';

const MentorManagement = () => {
    const mentors = [
        { id: 1, name: 'Dr. Sarah Jenkins', industry: 'Artificial Intelligence', experience: 12, mentees: 8, responseRate: '98%', verified: true },
        { id: 2, name: 'Marcus Kovac', industry: 'SaaS / Sales', experience: 15, mentees: 5, responseRate: '92%', verified: true },
        { id: 3, name: 'Jessica Wang', industry: 'FinTech', experience: 8, mentees: 12, responseRate: '85%', verified: false },
        { id: 4, name: 'Robert Miller', industry: 'UX Design', experience: 10, mentees: 3, responseRate: '100%', verified: true },
        { id: 5, name: 'Ananya Sharma', industry: 'CleanTech', experience: 7, mentees: 0, responseRate: '0%', verified: false },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Mentor Management</h1>
                    <p className="text-gray-400">Ensure high-quality mentorship quality control</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                        Applications (24)
                    </button>
                </div>
            </div>

            <div className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find mentors..."
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
                            <option>All Industries</option>
                        </select>
                        <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
                            <option>Verification</option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mentor Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Active Mentees</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Response Rate</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mentors.map((mentor, index) => (
                            <tr key={index} className="hover:bg-white/2 transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center">
                                            <Users size={20} className="text-[#8B5CF6]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-white">{mentor.name}</p>
                                                {mentor.verified && <ShieldCheck size={14} className="text-[#8B5CF6]" title="Verified Specialist" />}
                                            </div>
                                            <p className="text-xs text-gray-500">Member since 2025</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">{mentor.industry}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-amber-400" />
                                        <span className="text-sm text-gray-300">{mentor.experience} Years</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="px-3 py-1 bg-white/5 rounded-full inline-flex items-center gap-2">
                                        <span className="text-sm font-bold text-white">{mentor.mentees}</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-black">Active</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-[#8B5CF6]">{mentor.responseRate}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {!mentor.verified ? (
                                            <button className="px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] uppercase font-black rounded-lg transition-all">
                                                Verify
                                            </button>
                                        ) : (
                                            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#8B5CF6] text-[10px] uppercase font-black rounded-lg transition-all border border-white/5">
                                                Feature
                                            </button>
                                        )}
                                        <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] uppercase font-black rounded-lg transition-all border border-red-500/10">
                                            Suspend
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MentorManagement;
