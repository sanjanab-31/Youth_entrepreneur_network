
import React, { useState, useEffect, useMemo } from 'react';
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
    CheckCircle2,
    UserCheck,
    Star
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSystem } from '../../../utils/system';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [systemData, setSystemData] = useState(() => getSystem());

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const stats = useMemo(() => {
        const users = Object.values(systemData.users || {});
        const founders = users.filter(u => u.role === 'founder');
        const mentors = users.filter(u => u.role === 'mentor');
        const coFounders = users.filter(u => ['co-founder', 'cofounder'].includes(u.role));
        const incubators = systemData.incubators || [];
        const applications = systemData.applications || [];

        return [
            { label: 'Total Users', value: users.length, icon: Users, color: '#8B5CF6' },
            { label: 'Founders', value: founders.length, icon: Rocket, color: '#8B5CF6' },
            { label: 'Co-Founders', value: coFounders.length, icon: Users, color: '#3B82F6' },
            { label: 'Mentors', value: mentors.length, icon: Briefcase, color: '#10B981' },
            { label: 'Incubators', value: incubators.length, icon: Building, color: '#F59E0B' },
            { label: 'Applications', value: applications.length, icon: ClipboardList, color: '#EF4444' },
        ];
    }, [systemData]);

    const qualityIndicators = useMemo(() => {
        const users = Object.values(systemData.users || {});
        const verified = users.filter(u => u.verified);
        const applications = systemData.applications || [];
        const pending = applications.filter(a => a.status === 'pending');
        const withAll = users.filter(u => u.name && u.email && u.role);
        const completionRate = users.length > 0 ? Math.round((withAll.length / users.length) * 100) : 0;
        const verifiedRate = users.length > 0 ? Math.round((verified.length / users.length) * 100) : 0;
        const assignedMentors = (systemData.startups || []).filter(s => s.mentorAssigned).length;

        return [
            { label: 'Profile Completion', value: `${completionRate}%`, icon: TrendingUp, status: completionRate >= 70 ? 'positive' : 'warning' },
            { label: 'Verified Users', value: `${verifiedRate}%`, icon: ShieldCheck, status: verifiedRate >= 60 ? 'positive' : 'warning' },
            { label: 'Pending Applications', value: pending.length, icon: AlertCircle, status: pending.length > 5 ? 'warning' : 'positive' },
            { label: 'Mentors Assigned', value: assignedMentors, icon: CheckCircle2, status: 'positive' },
        ];
    }, [systemData]);

    const recentActivity = useMemo(() => {
        const items = [];

        Object.values(systemData.users || {})
            .filter(u => u.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
            .forEach(u => items.push({
                icon: 'user',
                message: `New ${u.role} joined: ${u.name || u.email}`,
                time: u.createdAt
            }));

        (systemData.applications || [])
            .filter(a => a.appliedDate)
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
            .slice(0, 4)
            .forEach(a => items.push({
                icon: 'app',
                message: `Application: ${a.startupName || 'Startup'} applied to incubator`,
                time: a.appliedDate
            }));

        (systemData.mentorRequests || [])
            .filter(r => r.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
            .forEach(r => items.push({
                icon: 'mentor',
                message: `Mentor request: ${r.status}`,
                time: r.createdAt
            }));

        return items
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 6);
    }, [systemData]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name || 'Admin'}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">System Control Portal</span>
                    <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold rounded-full border border-[#8B5CF6]/20 uppercase tracking-wider">
                        Authoritative Access
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="admin-panel-soft admin-panel-hover p-6 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 ring-1 ring-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <stat.icon size={20} style={{ color: stat.color }} />
                        </div>
                        <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 admin-panel p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="admin-section-title">Recent Platform Activity</h3>
                            <p className="admin-subtitle">Latest events across all portals</p>
                        </div>
                    </div>
                    <div className="space-y-3 flex-1">
                        {recentActivity.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm py-12">No activity yet</div>
                        ) : recentActivity.map((act, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-white/2 rounded-xl border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
                                    {act.icon === 'user' ? <UserCheck size={14} className="text-[#8B5CF6]" /> :
                                        act.icon === 'app' ? <ClipboardList size={14} className="text-[#10B981]" /> :
                                            <Star size={14} className="text-amber-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-300 font-medium truncate">{act.message}</p>
                                    <p className="text-[10px] text-gray-500">{new Date(act.time).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-panel p-8 space-y-4">
                    <h3 className="admin-section-title mb-2">Quality Indicators</h3>
                    {qualityIndicators.map((indicator, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 admin-panel-hover">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-[#8B5CF6]">
                                    <indicator.icon size={16} />
                                </div>
                                <span className="text-sm text-gray-300 font-medium">{indicator.label}</span>
                            </div>
                            <span className={`text-lg font-bold ${
                                indicator.status === 'danger' ? 'text-red-400' :
                                indicator.status === 'warning' ? 'text-yellow-400' : 'text-[#8B5CF6]'
                            }`}>
                                {indicator.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
