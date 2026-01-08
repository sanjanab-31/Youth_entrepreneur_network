import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, Rocket, Users, BookOpen, Trophy } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { role } = useParams();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardConfig = () => {
        const baseConfig = {
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100'
        };

        switch (user?.role || role) {
            case 'student':
                return {
                    ...baseConfig,
                    stats: [
                        { label: 'My Ideas', value: '3', icon: Rocket },
                        { label: 'Mentors met', value: '12', icon: Users },
                        { label: 'Courses', value: '5', icon: BookOpen }
                    ]
                };
            case 'mentor':
                return {
                    ...baseConfig,
                    stats: [
                        { label: 'Mentees', value: '8', icon: Users },
                        { label: 'Sessions', value: '45', icon: BookOpen },
                        { label: 'Rating', value: '4.9', icon: Trophy }
                    ]
                };
            case 'investor':
                return {
                    ...baseConfig,
                    stats: [
                        { label: 'Invested', value: '$1.2M', icon: Trophy },
                        { label: 'Portfolio', value: '7', icon: Rocket },
                        { label: 'Requests', value: '23', icon: Users }
                    ]
                };
            default:
                return {
                    ...baseConfig,
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
        <div className="min-h-screen bg-[#fcfdfd] flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col shadow-xl shadow-emerald-900/5">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 overflow-hidden rounded-xl border border-emerald-100 shadow-lg shadow-emerald-900/5">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">YEN</h1>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest pl-1">{user?.role || role} Portal</p>
                </div>

                <nav className="flex-1 px-6 space-y-2">
                    <button className="w-full text-left px-5 py-3.5 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center gap-3 transition-all border border-emerald-100">
                        <Rocket className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button className="w-full text-left px-5 py-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 font-semibold flex items-center gap-3 transition-all">
                        <Users className="w-5 h-5" />
                        Network
                    </button>
                    <button className="w-full text-left px-5 py-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 font-semibold flex items-center gap-3 transition-all">
                        <BookOpen className="w-5 h-5" />
                        Resources
                    </button>
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-4 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-bold"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 flex-1 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 mt-2">Welcome back, {user?.name || 'Explorer'}!</h2>
                        <p className="text-gray-500 font-medium italic-not">Empowering your startup success, one step at a time.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{user?.name || 'Explorer'}</p>
                            <p className="text-xs text-gray-400 font-medium">Free Plan</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 overflow-hidden border-2 border-white shadow-lg ring-4 ring-emerald-50">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'yen'}`} alt="avatar" />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {config.stats.map((stat, index) => (
                        <div key={index} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-gray-50 flex items-center justify-between group hover:border-emerald-200 transition-all duration-300">
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{stat.value}</h3>
                            </div>
                            <div className={`p-5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-gray-50 p-10 min-h-[500px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                        <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-6 p-6 hover:bg-emerald-50/50 rounded-3xl transition-all duration-300 cursor-pointer border-b border-gray-50 last:border-0 group">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                    <Rocket className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Ecosystem Update</h4>
                                    <p className="text-gray-500 font-medium">A new opportunity in the AI sector matches your profile.</p>
                                </div>
                                <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};


export default Dashboard;
