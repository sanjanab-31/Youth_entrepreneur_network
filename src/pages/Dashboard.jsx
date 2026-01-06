import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, Rocket, Users, BookOpen, Trophy } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { role } = useParams();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardConfig = () => {
        switch (user?.role || role) {
            case 'student':
                return {
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    stats: [
                        { label: 'My Ideas', value: '3', icon: Rocket },
                        { label: 'Mentors met', value: '12', icon: Users },
                        { label: 'Courses', value: '5', icon: BookOpen }
                    ]
                };
            case 'mentor':
                return {
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    stats: [
                        { label: 'Mentees', value: '8', icon: Users },
                        { label: 'Sessions', value: '45', icon: BookOpen },
                        { label: 'Rating', value: '4.9', icon: Trophy }
                    ]
                };
            case 'investor':
                return {
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    stats: [
                        { label: 'Invested', value: '$1.2M', icon: Trophy },
                        { label: 'Portfolio', value: '7', icon: Rocket },
                        { label: 'Requests', value: '23', icon: Users }
                    ]
                };
            default:
                return {
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    stats: [
                        { label: 'Activities', value: '12', icon: Rocket },
                        { label: 'Messages', value: '3', icon: Users },
                        { label: 'Updates', value: '5', icon: BookOpen }
                    ]
                };
        }
    };

    const config = getDashboardConfig();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar (Mock) */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">YEN</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mt-1 font-semibold">{user?.role}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className={`w-full text-left px-4 py-3 rounded-xl bg-gray-900 text-white font-medium`}>
                        Dashboard
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                        Messages
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                        Settings
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h2>
                        <p className="text-gray-500 mt-1">Here's what's happening with your startups today.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {config.stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-xl ${config.bg} ${config.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Feed</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Rocket className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">New Startup Joined</h4>
                                    <p className="text-sm text-gray-500">A new AI startup just joined your network.</p>
                                </div>
                                <span className="ml-auto text-sm text-gray-400">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
