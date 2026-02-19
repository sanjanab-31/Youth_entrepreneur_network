
import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    ShieldCheck,
    XCircle,
    Ban,
    Eye,
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = () => {
    const [filterRole, setFilterRole] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const allUsers = JSON.parse(localStorage.getItem('vanguard_users') || '{}');
    const users = Object.values(allUsers).map((u, idx) => ({
        id: u.uid,
        name: u.name || u.email.split('@')[0],
        role: u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase(),
        sector: u.sector || u.expertise || 'General',
        joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Feb 2026',
        verified: u.verified !== undefined ? u.verified : true,
        active: u.status !== 'inactive',
        email: u.email
    })).filter(u => {
        const matchesRole = filterRole === 'All Roles' || u.role === filterRole;
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-gray-400">Monitor and control all platform participants</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                        <ArrowUpDown size={16} /> Export List
                    </button>
                    <button className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#8B5CF6]/20">
                        Add Single User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1E1E2F] p-4 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option>All Roles</option>
                        <option>Founder</option>
                        <option>Mentor</option>
                        <option>Incubator</option>
                        <option>Admin</option>
                    </select>
                    <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all">
                        <option>Verification Status</option>
                        <option>Verified Only</option>
                        <option>Unverified</option>
                    </select>
                    <select className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all">
                        <option>Activity Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Reported</option>
                    </select>
                </div>
            </div>

            {/* Table */}
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
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-white/2 transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500">ID: #YEN-{user.id.slice(0, 6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.role === 'Founder' ? 'bg-blue-500/10 text-blue-400' :
                                        user.role === 'Mentor' ? 'bg-purple-500/10 text-purple-400' :
                                            'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-300">{user.sector}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">{user.joinDate}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.verified ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`} />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">{user.verified ? 'Verified' : 'Pending'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.5)]'}`} />
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">{user.active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button title="View Profile" className="p-2 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg transition-all">
                                            <Eye size={18} />
                                        </button>
                                        <button title="Verify" className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-all">
                                            <ShieldCheck size={18} />
                                        </button>
                                        <button title="Suspend" className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all">
                                            <Ban size={18} />
                                        </button>
                                        <button title="More Options" className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-all">
                                            <MoreVertical size={18} />
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
