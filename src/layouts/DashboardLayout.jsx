import React, { useState, useEffect } from 'react';
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
import { useStartup } from '../context/StartupContext';
import { useMessaging } from '../context/MessagingContext';
import logo from '../assets/logo.jpg';

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const { startup } = useStartup();
    const { conversations } = useMessaging();
    const location = useLocation();

    const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setIsSidebarOpen(false);
                setIsTablet(false);
            } else if (width < 1024) {
                setIsSidebarOpen(false);
                setIsTablet(true);
            } else {
                setIsSidebarOpen(true);
                setIsTablet(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isFounder = role === 'founder';
    const isCoFounder = role === 'co-founder' || role === 'cofounder';
    const isMentor = role === 'mentor';
    const isIncubator = role === 'incubator';
    const isAdmin = role === 'admin';

    const getMenuItems = () => {
        if (isAdmin) {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
                { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
                { id: 'startups', label: 'Startup Management', icon: Rocket, path: '/admin/startups' },
                { id: 'mentors', label: 'Mentor Management', icon: Briefcase, path: '/admin/mentors' },
                { id: 'incubators', label: 'Incubator Management', icon: Building, path: '/admin/incubators' },
                { id: 'applications', label: 'Applications Control', icon: ClipboardList, path: '/admin/applications' },
                { id: 'reports', label: 'Reports & Moderation', icon: ShieldAlert, path: '/admin/reports' },
                { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
                { id: 'content', label: 'Content Management', icon: Megaphone, path: '/admin/content' },
                { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
            ];
        }

        if (isIncubator) {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
                { id: 'startup-pipeline', label: 'Startup Pipeline', icon: Rocket, path: `/${role}/startup-pipeline` },
                { id: 'applications', label: 'Applications', icon: FileText, path: `/${role}/applications` },
                { id: 'cohorts', label: 'Cohorts', icon: Users, path: `/${role}/cohorts` },
                { id: 'mentors', label: 'Mentors', icon: Briefcase, path: `/${role}/mentors` },
                { id: 'analytics', label: 'Analytics', icon: Activity, path: `/${role}/analytics` },
                { id: 'profile', label: 'Profile', icon: User, path: `/${role}/profile` },
                { id: 'settings', label: 'Settings', icon: Settings, path: `/${role}/settings` },
            ];
        }

        if (isMentor) {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
                { id: 'founder-requests', label: 'Founder Requests', icon: Briefcase, path: `/${role}/founder-requests` },
                { id: 'my-mentees', label: 'My Mentees', icon: Users, path: `/${role}/my-mentees` },
                { id: 'sessions', label: 'Meetings', icon: Calendar, path: `/${role}/sessions` },
                { id: 'messages', label: 'Messages', icon: MessageSquare, path: `/${role}/messages` },
                { id: 'activity-feed', label: 'Activity Feed', icon: Activity, path: `/${role}/activity-feed` },
                { id: 'profile', label: 'Profile', icon: User, path: `/${role}/profile` },
                { id: 'settings', label: 'Settings', icon: Settings, path: `/${role}/settings` },
            ];
        }

        if (isCoFounder) {
            if (startup) {
                return [
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
                    { id: 'my-startup', label: 'My Startup', icon: Rocket, path: `/${role}/my-startup` },
                    { id: 'my-applications', label: 'My Applications', icon: ClipboardList, path: `/${role}/my-applications` },
                    { id: 'mentors', label: 'Startup Mentors', icon: Briefcase, path: `/${role}/mentors` },
                    { id: 'team', label: 'Team', icon: Users, path: `/${role}/team` },
                    { id: 'sessions', label: 'Meetings', icon: Calendar, path: `/${role}/sessions` },
                    { id: 'messages', label: 'Messages', icon: MessageSquare, path: `/${role}/messages` },
                    { id: 'profile', label: 'Profile', icon: User, path: `/${role}/profile` },
                    { id: 'settings', label: 'Settings', icon: Settings, path: `/${role}/settings` },
                ];
            } else {
                return [
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
                    { id: 'discover-startups', label: 'Discover Startups', icon: Rocket, path: `/${role}/discover-startups` },
                    { id: 'my-applications', label: 'My Applications', icon: ClipboardList, path: `/${role}/my-applications` },
                    { id: 'sessions', label: 'Meetings', icon: Calendar, path: `/${role}/sessions` },
                    { id: 'messages', label: 'Messages', icon: MessageSquare, path: `/${role}/messages` },
                    { id: 'profile', label: 'Profile', icon: User, path: `/${role}/profile` },
                    { id: 'settings', label: 'Settings', icon: Settings, path: `/${role}/settings` },
                ];
            }
        }

        if (isFounder) {
            return [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `/${role}/dashboard` },
                { id: 'my-startup', label: 'My Startup', icon: Rocket, path: `/${role}/my-startup` },
                { id: 'find-co-founder', label: 'Find Co-Founder', icon: UserPlus, path: `/${role}/find-co-founder` },
                { id: 'co-founder-requests', label: 'Join Requests', icon: Users, path: `/${role}/co-founder-requests` },
                { id: 'sessions', label: 'Meetings', icon: Calendar, path: `/${role}/sessions` },
                { id: 'mentors', label: 'Mentors', icon: Briefcase, path: `/${role}/mentors` },
                { id: 'incubators', label: 'Incubators', icon: Building, path: `/${role}/incubators` },
                { id: 'messages', label: 'Messages', icon: MessageSquare, path: `/${role}/messages` },
                { id: 'activity-feed', label: 'Activity Feed', icon: Activity, path: `/${role}/activity-feed` },
                { id: 'settings', label: 'Settings', icon: Settings, path: `/${role}/settings` },
            ];
        }

        return [];
    };

    const menuItems = getMenuItems();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-[#0F0F14] text-white flex overflow-x-hidden">
            <aside
                className={`fixed left-0 top-0 h-full bg-[#15151e] border-r border-white/5 transition-all duration-500 z-50 flex flex-col hidden md:flex
                    ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative flex-shrink-0">
                            <div className={`rounded-xl overflow-hidden bg-brand-purple/20 p-2 group-hover:bg-brand-purple/30 transition-all duration-300 border border-brand-purple/30 flex items-center justify-center transform group-hover:rotate-6 ${isSidebarOpen ? 'w-10 h-10' : 'w-8 h-8 mx-auto'}`}>
                                <img
                                    src={logo}
                                    alt="Vanguard Logo"
                                    className="w-full h-full object-contain rounded-lg mix-blend-screen"
                                />
                            </div>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-white group-hover:text-brand-purple transition-colors leading-none">
                                    Vanguard
                                </span>
                                <span className="text-[8px] font-bold text-brand-purple tracking-[0.2em] uppercase leading-none mt-1">
                                    {isFounder || (isCoFounder && startup) ? 'Startup OS' : (isCoFounder ? 'Opportunity Network' : 'Ecosystem')}
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-1 mt-6 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        // Robust Active Highlighting Logic
                        const isDashboardRoot = item.id === 'dashboard' && (
                            location.pathname === `/${role}` ||
                            location.pathname === `/${role}/` ||
                            location.pathname === `/${role}/dashboard` ||
                            location.pathname.startsWith(`/${role}/dashboard/`)
                        );

                        const isActive = isDashboardRoot || (
                            item.id !== 'dashboard' &&
                            location.pathname.startsWith(item.path)
                        );

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-white transition-colors'} />
                                {isSidebarOpen && <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>}

                                {item.id === 'messages' && totalUnread > 0 && (
                                    <span className={`absolute ${isSidebarOpen ? 'right-4' : 'right-2 -top-1'} bg-red-500 text-white text-[10px] font-black px-1.5 rounded-full h-5 min-w-5 flex items-center justify-center shadow-lg border-2 border-[#15151e] animate-pulse-slow`}>
                                        {totalUnread}
                                    </span>
                                )}

                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1E1E2F] border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        to={`/${role}/settings`}
                        className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                            {user?.fullName?.[0] || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate text-white">{user?.fullName || 'User'}</p>
                                <p className="text-[10px] uppercase font-black text-brand-purple opacity-70 tracking-widest">{role}</p>
                            </div>
                        )}
                    </Link>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest group
                            ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>

                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center border-4 border-[#0F0F14] hover:scale-110 transition-transform flex shadow-lg shadow-purple-600/40 z-[60]"
                >
                    <ChevronRight size={10} className={`text-white transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                </button>
            </aside>

            <header className="md:hidden fixed top-0 w-full bg-[#1E1E2F]/80 backdrop-blur-xl border-b border-white/5 p-4 z-40 flex justify-between items-center shadow-lg">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-purple/20 p-1.5 border border-brand-purple/30">
                        <img
                            src={logo}
                            className="w-full h-full object-contain mix-blend-screen"
                            alt="Logo"
                        />
                    </div>
                    <span className="font-black tracking-tight text-lg">Vanguard</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
                >
                    <Menu size={24} />
                </button>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-full w-72 bg-[#1E1E2F] z-[70] p-6 md:hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <Link to="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-purple/20 p-1.5 border border-brand-purple/30">
                                        <img
                                            src={logo}
                                            className="w-full h-full object-contain mix-blend-screen"
                                            alt="Logo"
                                        />
                                    </div>
                                    <span className="font-bold text-xl">Vanguard</span>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                                    <X size={24} />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item) => {
                                    const isDashboardRoot = item.id === 'dashboard' && (
                                        location.pathname === `/${role}` ||
                                        location.pathname === `/${role}/` ||
                                        location.pathname === `/${role}/dashboard` ||
                                        location.pathname.startsWith(`/${role}/dashboard/`)
                                    );

                                    const isActive = isDashboardRoot || (
                                        item.id !== 'dashboard' &&
                                        location.pathname.startsWith(item.path)
                                    );

                                    return (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-brand-purple text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
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

            <main className={`flex-1 min-h-screen transition-all duration-300 pt-20 md:pt-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
