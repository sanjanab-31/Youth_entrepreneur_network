
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Activity, Settings } from 'lucide-react';

const Dashboard = ({ role }) => {
    const { user, logout } = useAuth();

    // Capitalize role for display
    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';

    return (
        <div className="min-h-screen bg-[#0F0F14] text-white flex">
            {/* Sidebar (Simulated) */}
            <aside className="w-64 border-r border-white/5 bg-[#1E1E2F]/50 hidden md:flex flex-col p-6">
                <div className="mb-10 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg"></div>
                    <span className="font-bold text-xl tracking-tight">Vanguard</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3 bg-purple-500/10 text-purple-400 px-4 py-3 rounded-xl border border-purple-500/20">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-colors cursor-pointer">
                        <Users size={20} />
                        <span className="font-medium">Network</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-colors cursor-pointer">
                        <Activity size={20} />
                        <span className="font-medium">Activity</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-colors cursor-pointer">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </div>
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center font-bold text-white shadow-lg">
                            {displayRole[0]}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-white">{user?.fullName || 'User Name'}</p>
                            <p className="text-xs text-purple-400 capitalize">{user?.role || role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 py-2.5 rounded-xl transition-all duration-300"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {displayRole} Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2">Welcome back to your command center.</p>
                    </div>

                    <div className="md:hidden">
                        <button onClick={logout} className="text-gray-400 hover:text-white">
                            <LogOut size={24} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Stat Card 1 */}
                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={64} className="text-purple-500" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Activity</h3>
                        <p className="text-3xl font-bold text-white">24</p>
                        <div className="mt-4 flex items-center text-green-400 text-sm">
                            <span>+12% from last week</span>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={64} className="text-blue-500" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Network Growth</h3>
                        <p className="text-3xl font-bold text-white">1,204</p>
                        <div className="mt-4 flex items-center text-purple-400 text-sm">
                            <span>+5 new connections</span>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LayoutDashboard size={64} className="text-pink-500" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Pending Actions</h3>
                        <p className="text-3xl font-bold text-white">3</p>
                        <div className="mt-4 flex items-center text-orange-400 text-sm">
                            <span>Needs attention</span>
                        </div>
                    </div>

                </div>

                {/* Profile Details Section */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-50" />

                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
                            Account Profile
                        </h3>

                        <div className="grid gap-4">
                            <div className="flex flex-col space-y-1 p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Verified Identity</span>
                                <span className="text-white font-medium text-lg">{user?.fullName || 'Simulated User'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Access Level</span>
                                    <span className="text-purple-400 font-bold capitalize">{user?.role || role}</span>
                                </div>
                                <div className="flex flex-col space-y-1 p-3 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Contact</span>
                                    <span className="text-white font-medium truncate">{user?.email}</span>
                                </div>
                            </div>

                            {/* Conditional Role-Specific Fields */}
                            {(user?.location || user?.startupName || user?.incubatorName || user?.industry) && (
                                <div className="pt-4 border-t border-white/5 mt-2">
                                    <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Metadata</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user?.location && (
                                            <div className="text-sm">
                                                <span className="text-gray-500 block">Baseline Location</span>
                                                <span className="text-white">{user.location}</span>
                                            </div>
                                        )}
                                        {user?.startupName && (
                                            <div className="text-sm">
                                                <span className="text-gray-500 block">Organization</span>
                                                <span className="text-white">{user.startupName}</span>
                                            </div>
                                        )}
                                        {user?.incubatorName && (
                                            <div className="text-sm">
                                                <span className="text-gray-500 block">Organization</span>
                                                <span className="text-white">{user.incubatorName}</span>
                                            </div>
                                        )}
                                        {user?.industry && (
                                            <div className="text-sm">
                                                <span className="text-gray-500 block">Expertise</span>
                                                <span className="text-white">{user.industry}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#1E1E2F]/50 border border-white/10 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
                            <Settings className="text-purple-400" size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">Next Steps</h4>
                        <p className="text-gray-400 text-sm max-w-[250px] mb-6">Completing your {user?.role || role} profile increases your visibility in the Vanguard network by 40%.</p>
                        <button className="px-6 py-2 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
                            Complete Setup
                        </button>
                    </div>
                </div>

                {/* Content Area Placeholder */}
                <div className="mt-8 bg-[#1E1E2F]/50 border border-white/5 rounded-2xl p-8 min-h-[300px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <p className="mb-4">Role-specific content for <span className="text-purple-400 font-bold">{displayRole}</span> will appear here.</p>
                        <div className="inline-block px-4 py-2 bg-purple-500/10 rounded-lg text-purple-300 text-sm border border-purple-500/20">
                            Feature Coming Soon
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
