
import React, { useState, useEffect, useMemo } from 'react';
import {
    PieChart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Users,
    Briefcase,
    ClipboardList,
    CheckCircle2
} from 'lucide-react';
import { getSystem } from '../../../utils/system';

const AdminAnalytics = () => {
    const [systemData, setSystemData] = useState(() => getSystem());

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const analytics = useMemo(() => {
        const users = Object.values(systemData.users || {});
        const startups = systemData.startups || [];
        const applications = systemData.applications || [];
        const incubators = systemData.incubators || [];
        const mentorRequests = systemData.mentorRequests || [];
        const sessions = systemData.sessions || [];
        const cohorts = systemData.cohorts || [];

        const founders = users.filter(u => u.role === 'founder');
        const mentors = users.filter(u => u.role === 'mentor');
        const coFounders = users.filter(u => ['co-founder', 'cofounder'].includes(u.role));
        const total = users.length;

        const assignedStartups = startups.filter(s => s.mentorAssigned).length;
        const matchRate = startups.length > 0 ? Math.round((assignedStartups / startups.length) * 100) : 0;
        const accepted = applications.filter(a => a.status === 'accepted').length;
        const acceptanceRate = applications.length > 0 ? Math.round((accepted / applications.length) * 100) : 0;
        const completedSessions = sessions.filter(s => s.status === 'completed').length;
        const acceptedRequests = mentorRequests.filter(r => r.status === 'accepted').length;

        // Sector from startups
        const sectorMap = {};
        startups.forEach(s => {
            const sec = (s.sector || 'General').trim();
            sectorMap[sec] = (sectorMap[sec] || 0) + 1;
        });
        const totalSectorCount = Object.values(sectorMap).reduce((a, b) => a + b, 0);
        const topSectors = Object.entries(sectorMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count]) => ({
                name,
                count,
                pct: totalSectorCount > 0 ? Math.round((count / totalSectorCount) * 100) : 0
            }));

        // Stage distribution
        const stageMap = {};
        startups.forEach(s => {
            const stage = s.stage || 'Unknown';
            stageMap[stage] = (stageMap[stage] || 0) + 1;
        });
        const topStages = Object.entries(stageMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return {
            metrics: [
                { label: 'Total Platform Users', value: total, trend: `${founders.length} founders`, up: true, icon: Users },
                { label: 'Active Startups', value: startups.filter(s => s.status !== 'inactive').length, trend: `${startups.length} total`, up: true, icon: TrendingUp },
                { label: 'Mentor Match Rate', value: `${matchRate}%`, trend: `${assignedStartups} assigned`, up: matchRate >= 50, icon: Briefcase },
                { label: 'App Acceptance Rate', value: `${acceptanceRate}%`, trend: `${accepted}/${applications.length}`, up: acceptanceRate >= 30, icon: ClipboardList },
            ],
            roleDistribution: [
                { name: 'Founders', count: founders.length, color: '#8B5CF6' },
                { name: 'Mentors', count: mentors.length, color: '#10B981' },
                { name: 'Co-Founders', count: coFounders.length, color: '#3B82F6' },
                { name: 'Incubators', count: incubators.length, color: '#F59E0B' },
            ],
            topSectors,
            topStages,
            completedSessions,
            acceptedRequests,
            totalApplications: applications.length,
            pendingApplications: applications.filter(a => a.status === 'pending').length,
            totalCohorts: cohorts.length,
        };
    }, [systemData]);

    const totalRoleCount = analytics.roleDistribution.reduce((s, r) => s + r.count, 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
                <p className="text-gray-400">Holistic performance tracking across all user segments</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analytics.metrics.map((m, i) => (
                    <div key={i} className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                                <m.icon size={18} className="text-[#8B5CF6]" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{m.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-bold text-white">{m.value}</h3>
                            <div className={`flex items-center gap-1 text-xs font-bold ${m.up ? 'text-green-400' : 'text-amber-400'}`}>
                                {m.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {m.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary counts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Completed Sessions', value: analytics.completedSessions, color: '#10B981' },
                    { label: 'Accepted Mentor Links', value: analytics.acceptedRequests, color: '#8B5CF6' },
                    { label: 'Pending Applications', value: analytics.pendingApplications, color: '#F59E0B' },
                    { label: 'Active Cohorts', value: analytics.totalCohorts, color: '#3B82F6' },
                ].map((item, i) => (
                    <div key={i} className="bg-[#1E1E2F] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                            <p className="text-xl font-bold text-white">{item.value}</p>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Distribution */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Role Distribution</h3>
                        <PieChart className="text-gray-500" size={20} />
                    </div>
                    {totalRoleCount === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">No users yet</div>
                    ) : (
                        <div className="space-y-5">
                            {analytics.roleDistribution.map((role, idx) => {
                                const pct = totalRoleCount > 0 ? Math.round((role.count / totalRoleCount) * 100) : 0;
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300 font-medium">{role.name}</span>
                                            <span className="text-white font-bold">{role.count} <span className="text-gray-500 text-xs">({pct}%)</span></span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, 1)}%`, backgroundColor: role.color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sector Activity */}
                <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white">Sector Activity</h3>
                        <Target className="text-gray-500" size={20} />
                    </div>
                    {analytics.topSectors.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">No startups yet</div>
                    ) : (
                        <div className="space-y-5">
                            {analytics.topSectors.map((sector, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300 font-medium">{sector.name}</span>
                                        <span className="text-white font-bold">{sector.count} <span className="text-[#8B5CF6] text-xs">({sector.pct}%)</span></span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-indigo-500 transition-all duration-700" style={{ width: `${Math.max(sector.pct, 1)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stage breakdown mini */}
                    {analytics.topStages.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-xs font-black text-gray-500 uppercase mb-3">Stage Breakdown</p>
                            <div className="flex flex-wrap gap-2">
                                {analytics.topStages.map(([stage, count], idx) => (
                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-bold">
                                        {stage}: {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
