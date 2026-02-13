
import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Rocket,
    Briefcase,
    Building,
    Activity,
    ClipboardList,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const stats = [
        { label: 'Total Users', value: '12,482', icon: Users, color: '#8B5CF6' },
        { label: 'Total Founders', value: '8,245', icon: Rocket, color: '#8B5CF6' },
        { label: 'Total Mentors', value: '1,120', icon: Briefcase, color: '#8B5CF6' },
        { label: 'Total Incubators', value: '45', icon: Building, color: '#8B5CF6' },
        { label: 'Active Users (7d)', value: '3,892', icon: Activity, color: '#10B981' },
        { label: 'Total Applications', value: '1,854', icon: ClipboardList, color: '#F59E0B' },
    ];

    const qualityIndicators = [
        { label: 'Profile Completion Rate', value: '84%', icon: TrendingUp, status: 'positive' },
        { label: 'Verified Users', value: '72%', icon: ShieldCheck, status: 'positive' },
        { label: 'Pending Approvals', value: '124', icon: AlertCircle, status: 'warning' },
        { label: 'Reported Accounts', value: '12', icon: CheckCircle2, status: 'danger' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.fullName || 'Admin'}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">System Control Portal</span>
                    <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold rounded-full border border-[#8B5CF6]/20 uppercase tracking-wider">
                        Authoritative Access
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <stat.icon size={20} style={{ color: stat.color }} />
                        </div>
                        <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Placeholder Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Platform Growth</h3>
                            <p className="text-sm text-gray-400">User & Startup Trends (Last 30 Days)</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                                <span className="text-xs text-gray-400">Users</span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                                <span className="text-xs text-gray-400">Applications</span>
                            </div>
                        </div>
                    </div>
                    {/* Simulated Chart */}
                    <div className="flex-1 flex items-end gap-2 px-2">
                        {[40, 60, 45, 70, 55, 80, 65, 90, 75, 100, 85, 95].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col gap-1 items-center group">
                                <div
                                    className="w-full bg-gradient-to-t from-[#8B5CF6]/5 to-[#8B5CF6]/40 rounded-t-sm group-hover:to-[#8B5CF6] transition-all"
                                    style={{ height: `${val}%` }}
                                />
                                <div
                                    className="w-full bg-gradient-to-t from-[#10B981]/5 to-[#10B981]/40 rounded-t-sm group-hover:to-[#10B981] transition-all"
                                    style={{ height: `${val * 0.6}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 space-y-6">
                    <h3 className="text-lg font-bold text-white mb-2">Quality Indicators</h3>
                    <div className="space-y-4">
                        {qualityIndicators.map((indicator, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-[#8B5CF6]">
                                        <indicator.icon size={16} />
                                    </div>
                                    <span className="text-sm text-gray-300 font-medium">{indicator.label}</span>
                                </div>
                                <span className={`text-lg font-bold ${indicator.status === 'danger' ? 'text-red-400' :
                                    indicator.status === 'warning' ? 'text-yellow-400' : 'text-[#8B5CF6]'
                                    }`}>
                                    {indicator.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
