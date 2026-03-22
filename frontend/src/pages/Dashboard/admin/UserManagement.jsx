
import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    ShieldCheck,
    Ban
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const UserManagement = () => {
    const [filterRole, setFilterRole] = useState('All Roles');
    const [filterVerified, setFilterVerified] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [systemData, setSystemData] = useState(() => getSystem());

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const users = useMemo(() => {
        return Object.values(systemData.users || {})
            .map(u => ({
                uid: u.uid || u.id,
                name: u.name || u.email?.split('@')[0] || 'Unknown',
                email: u.email || '',
                role: (u.role || 'user'),
                roleLabel: (u.role || 'user').charAt(0).toUpperCase() + (u.role || 'user').slice(1),
                sector: Array.isArray(u.expertise) ? u.expertise[0] :
                    (u.sector || u.portalData?.sector || 'General'),
                joinDate: u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—',
                verified: Boolean(u.verified),
                active: u.status !== 'suspended' && u.status !== 'banned',
            }))
            .filter(u => {
                const matchRole = filterRole === 'All Roles' || u.roleLabel.toLowerCase() === filterRole.toLowerCase();
                const matchVerify = filterVerified === 'All' ||
                    (filterVerified === 'Verified' && u.verified) ||
                    (filterVerified === 'Unverified' && !u.verified);
                const q = searchQuery.toLowerCase();
                const matchSearch = !q || u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) || (u.uid || '').toLowerCase().includes(q);
                return matchRole && matchVerify && matchSearch;
            });
    }, [systemData, filterRole, filterVerified, searchQuery]);

    const toggleVerify = (uid) => {
        if (!uid) return;
        const sys = getSystem();
        if (sys.users?.[uid]) {
            sys.users[uid].verified = !sys.users[uid].verified;
            saveSystem(sys);
        }
        setSystemData(getSystem());
    };

    const toggleSuspend = (uid) => {
        if (!uid) return;
        const sys = getSystem();
        if (sys.users?.[uid]) {
            const current = sys.users[uid].status || 'active';
            sys.users[uid].status = current === 'suspended' ? 'active' : 'suspended';
            saveSystem(sys);
        }
        setSystemData(getSystem());
    };

    const roleCounts = useMemo(() => {
        const all = Object.values(systemData.users || {});
        return {
            All: all.length,
            Founder: all.filter(u => u.role === 'founder').length,
            Mentor: all.filter(u => u.role === 'mentor').length,
            Incubator: all.filter(u => u.role === 'incubator').length,
            'Co-Founder': all.filter(u => ['co-founder', 'cofounder'].includes(u.role)).length,
        };
    }, [systemData]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-gray-400">Monitor and control all platform participants</p>
                </div>
                <div className="flex gap-3">
                    {Object.entries(roleCounts).map(([role, count]) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role === 'All' ? 'All Roles' : role)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all border ${
                                (filterRole === 'All Roles' && role === 'All') || filterRole === role
                                    ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30'
                                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            {role} ({count})
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#1E1E2F] p-4 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                        value={filterVerified}
                        onChange={e => setFilterVerified(e.target.value)}
                    >
                        <option>All</option>
                        <option>Verified</option>
                        <option>Unverified</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sector</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No users found</td>
                            </tr>
                        ) : users.map((user, index) => (
                            <tr key={user.uid || index} className="hover:bg-white/2 transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                        user.role === 'founder' ? 'bg-blue-500/10 text-blue-400' :
                                        user.role === 'mentor' ? 'bg-purple-500/10 text-purple-400' :
                                        user.role === 'incubator' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-gray-500/10 text-gray-400'
                                    }`}>
                                        {user.roleLabel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">{user.sector}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{user.joinDate}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.verified ? 'bg-green-500' : 'bg-gray-600'}`} />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">{user.verified ? 'Verified' : 'Unverified'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">{user.active ? 'Active' : 'Suspended'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            title={user.verified ? 'Remove Verification' : 'Verify User'}
                                            onClick={() => toggleVerify(user.uid)}
                                            className={`p-2 rounded-lg transition-all ${
                                                user.verified ? 'hover:bg-green-500/20 text-green-400' : 'hover:bg-gray-500/20 text-gray-400'
                                            }`}
                                        >
                                            <ShieldCheck size={18} />
                                        </button>
                                        <button
                                            title={user.active ? 'Suspend User' : 'Restore User'}
                                            onClick={() => toggleSuspend(user.uid)}
                                            className={`p-2 rounded-lg transition-all ${
                                                user.active ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-green-500/20 text-green-400'
                                            }`}
                                        >
                                            <Ban size={18} />
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

export default UserManagement;
