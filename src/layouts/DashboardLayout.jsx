
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Rocket,
    Users,
    MessageSquare,
    Bell,
    Settings,
    LogOut,
    ChevronRight,
    Search,
    UserPlus,
    Building,
    Activity,
    Menu,
    X,
    Briefcase,
    Calendar,
    User,
    FileText,
    ClipboardList,
    ShieldAlert,
    BarChart3,
    Megaphone,
    Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isFounder = role === 'founder';
    const isCoFounder = role === 'co-founder';
    const isMentor = role === 'mentor';
    const isIncubator = role === 'incubator';
    const isAdmin = role === 'admin';

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
        ...(isAdmin ? [
            { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
            { id: 'startups', label: 'Startup Management', icon: Rocket, path: '/admin/startups' },
            { id: 'mentors', label: 'Mentor Management', icon: Briefcase, path: '/admin/mentors' },
            { id: 'incubators', label: 'Incubator Management', icon: Building, path: '/admin/incubators' },
            { id: 'applications', label: 'Applications Control', icon: ClipboardList, path: '/admin/applications' },
            { id: 'reports', label: 'Reports & Moderation', icon: ShieldAlert, path: '/admin/reports' },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
            { id: 'content', label: 'Content Management', icon: Megaphone, path: '/admin/content' },
        ] : []),
        ...(isIncubator ? [
            { id: 'startup-pipeline', label: 'Startup Pipeline', icon: Rocket, path: `/${role}/startup-pipeline` },
            { id: 'applications', label: 'Applications', icon: FileText, path: `/${role}/applications` },
            { id: 'cohorts', label: 'Cohorts', icon: Users, path: `/${role}/cohorts` },
            { id: 'mentors', label: 'Mentors', icon: Briefcase, path: `/${role}/mentors` },
            { id: 'analytics', label: 'Analytics', icon: Activity, path: `/${role}/analytics` },
            { id: 'profile', label: 'Profile', icon: User, path: `/${role}/profile` },
        ] : []),
        ...(isFounder ? [
            { id: 'my-startup', label: 'My Startup', icon: Rocket, path: `/${role}/my-startup` },
            { id: 'find-co-founder', label: 'Find Co-Founder', icon: UserPlus, path: `/${role}/find-co-founder` }
        ] : []),
        ...(isCoFounder ? [
            { id: 'startup-overview', label: 'Startup Overview', icon: Rocket, path: `/${role}/startup-overview` },
            { id: 'team-collaboration', label: 'Team Collaboration', icon: Users, path: `/${role}/team-collaboration` }
        ] : []),
        ...(!isIncubator && isMentor ? [
            { id: 'founder-requests', label: 'Founder Requests', icon: Briefcase, path: `/${role}/founder-requests` },
            { id: 'my-mentees', label: 'My Mentees', icon: Users, path: `/${role}/my-mentees` },
            { id: 'sessions', label: 'Sessions', icon: Calendar, path: `/${role}/sessions` },
        ] : []),
        ...(!isMentor && !isIncubator && !isAdmin ? [
            { id: 'mentors', label: 'Mentors', icon: Briefcase, path: `/${role}/mentors` },
            { id: 'incubators', label: 'Incubators', icon: Building, path: `/${role}/incubators` },
        ] : []),
        ...(!isIncubator && !isAdmin ? (isMentor ? [
            { id: 'activity-feed', label: 'Activity Feed', icon: Activity, path: `/${role}/activity-feed` },
            { id: 'profile', label: 'Profile', icon: User, path: `/${role}/profile` },
        ] : [
            { id: 'messages', label: 'Messages', icon: MessageSquare, path: `/${role}/messages` },
            { id: 'activity-feed', label: 'Activity Feed', icon: Activity, path: `/${role}/activity-feed` },
        ]) : []),
        { id: 'settings', label: 'Settings', icon: Settings, path: `/${role}/settings` },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-[#0F0F14] text-white flex">
            {/* Sidebar Desktop */}
            <aside
                className={`fixed left-0 top-0 h-full bg-[#1E1E2F] border-r border-white/5 transition-all duration-300 z-50 flex flex-col
                    ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
                        <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg flex-shrink-0" />
                        <span className="font-bold text-xl tracking-tight">Vanguard</span>
                    </div>
                    {!isSidebarOpen && <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-lg mx-auto" />}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname.includes('/dashboard'));

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                            >
                                <Icon size={20} className={isActive ? 'text-[#8B5CF6]' : 'group-hover:text-white'} />
                                {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-[#1E1E2F] border border-white/10 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-white/5">
                    <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
                            {user?.fullName?.[0] || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate text-white">{user?.fullName || 'User'}</p>
                                <p className="text-[10px] uppercase font-black text-[#8B5CF6] opacity-70 tracking-widest">{role}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all group
                            ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-10 w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center border-4 border-[#0F0F14] hover:scale-110 transition-transform hidden lg:flex"
                >
                    <ChevronRight size={10} className={`text-white transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
                </button>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 w-full bg-[#1E1E2F] border-bottom border-white/5 p-4 z-40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#8B5CF6] rounded-md" />
                    <span className="font-bold">Vanguard</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-full w-72 bg-[#1E1E2F] z-[70] p-6 lg:hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#8B5CF6] rounded-lg" />
                                    <span className="font-bold text-xl">Vanguard</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-6 border-t border-white/5">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 min-h-screen transition-all duration-300 pt-20 lg:pt-0 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
