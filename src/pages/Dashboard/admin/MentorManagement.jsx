
import React, { useEffect, useMemo, useState } from 'react';
import {
    Users,
    ShieldCheck,
    Search,
    Award,
    Ban
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const MentorManagement = () => {
    const [systemData, setSystemData] = useState(() => getSystem());
    const [searchQuery, setSearchQuery] = useState('');
    const [verificationFilter, setVerificationFilter] = useState('all');

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const mentors = useMemo(() => {
        const users = Object.values(systemData.users || {});
        const startups = systemData.startups || [];
        const sessions = systemData.sessions || [];

        return users
            .filter((user) => user.role === 'mentor')
            .map((mentor) => {
                const uid = mentor.uid || mentor.id;
                const mentees = startups.filter((startup) => startup.mentorAssigned === uid).length;
                const mentorSessions = sessions.filter((session) => session.mentorId === uid);
                const completed = mentorSessions.filter((session) => session.status === 'completed').length;
                const responseRate = mentor.responseRate || (mentorSessions.length > 0
                    ? `${Math.round((completed / mentorSessions.length) * 100)}%`
                    : '0%');

                return {
                    uid,
                    name: mentor.name || mentor.email?.split('@')[0] || 'Mentor',
                    industry: mentor.sector || mentor.portalData?.sector || 'General',
                    experience: Number(mentor.yearsExperience || mentor.portalData?.yearsExperience || 0),
                    mentees,
                    responseRate,
                    verified: Boolean(mentor.verified),
                    status: mentor.status || 'active',
                };
            })
            .filter((mentor) => {
                const q = searchQuery.toLowerCase();
                const matchesSearch = !q ||
                    mentor.name.toLowerCase().includes(q) ||
                    mentor.industry.toLowerCase().includes(q);
                const matchesVerification = verificationFilter === 'all' ||
                    (verificationFilter === 'verified' && mentor.verified) ||
                    (verificationFilter === 'pending' && !mentor.verified);
                return matchesSearch && matchesVerification;
            });
    }, [searchQuery, systemData, verificationFilter]);

    const updateMentorUser = (uid, updater) => {
        if (!uid) return;
        const sys = getSystem();
        if (sys.users?.[uid]) {
            sys.users[uid] = updater(sys.users[uid]);
            saveSystem(sys);
        }

        const profileKey = `profile_${uid}`;
        const raw = localStorage.getItem(profileKey);
        if (raw) {
            try {
                const profile = JSON.parse(raw);
                const updated = updater(profile);
                localStorage.setItem(profileKey, JSON.stringify(updated));
            } catch {
                // Ignore malformed profile cache.
            }
        }
        setSystemData(getSystem());
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Mentor Management</h1>
                    <p className="text-gray-400">Ensure high-quality mentorship quality control</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                        Mentors ({mentors.length})
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                            value={verificationFilter}
                            onChange={(e) => setVerificationFilter(e.target.value)}
                        >
                            <option value="all">All Verification</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
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
                        {mentors.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No mentors found</td>
                            </tr>
                        )}
                        {mentors.map((mentor) => (
                            <tr key={mentor.uid} className="hover:bg-white/2 transition-all">
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
                                            <p className="text-xs text-gray-500">UID: {mentor.uid}</p>
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
                                            <button
                                                onClick={() => updateMentorUser(mentor.uid, (u) => ({ ...u, verified: true }))}
                                                className="px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[10px] uppercase font-black rounded-lg transition-all"
                                            >
                                                Verify
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => updateMentorUser(mentor.uid, (u) => ({ ...u, featured: !u.featured }))}
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#8B5CF6] text-[10px] uppercase font-black rounded-lg transition-all border border-white/5"
                                            >
                                                {systemData.users?.[mentor.uid]?.featured ? 'Unfeature' : 'Feature'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => updateMentorUser(mentor.uid, (u) => ({
                                                ...u,
                                                status: (u.status || 'active') === 'suspended' ? 'active' : 'suspended'
                                            }))}
                                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] uppercase font-black rounded-lg transition-all border border-red-500/10"
                                        >
                                            {mentor.status === 'suspended' ? 'Restore' : 'Suspend'}
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
