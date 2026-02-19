
import React, { useState, useEffect, useMemo } from 'react';
import {
    Briefcase,
    Search,
    Filter,
    MessageSquare,
    Star,
    ChevronRight,
    X,
    Shield,
    Calendar,
    ArrowRight,
    MapPin,
    Target,
    Plus,
    RefreshCw,
    User,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';

const Mentors = () => {
    const { user } = useAuth();
    const { startup, requestMentor } = useStartup();

    // --- State Management ---
    const [mentors, setMentors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [requestingMentor, setRequestingMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [filters, setFilters] = useState({
        sector: 'All',
        stages: [],
        sessionType: 'All',
        verifiedOnly: false
    });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Request Form State
    const [requestForm, setRequestForm] = useState({
        problem: '',
        tried: '',
        outcome: ''
    });

    // --- Initialization ---
    useEffect(() => {
        const refreshData = () => {
            setLoading(true);
            try {
                // Fetch mentors from global users
                const allUsersRaw = localStorage.getItem('vanguard_users');
                let allUsers = {};
                try {
                    allUsers = JSON.parse(allUsersRaw || '{}');
                    if (Array.isArray(allUsers)) {
                        allUsers = allUsers.reduce((acc, u) => {
                            if (u.uid || u.id) acc[u.uid || u.id] = u;
                            return acc;
                        }, {});
                    }
                } catch (e) { allUsers = {}; }

                const mentorsList = Object.values(allUsers)
                    .filter(u => u.role === 'mentor')
                    .map(m => ({
                        id: m.uid,
                        name: m.name || m.profileData?.fullName || m.email.split('@')[0],
                        initials: (m.name || m.email.split('@')[0]).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        title: m.profileData?.title || 'Expert Mentor',
                        expertiseSector: m.profileData?.expertiseSector || 'General',
                        mentorshipFocus: m.profileData?.mentorshipFocus || 'Scaling & Growth',
                        supportedStages: m.profileData?.supportedStages || ['Idea', 'MVP', 'Revenue'],
                        responseRate: m.profileData?.responseRate || 95,
                        verified: m.profileData?.verified || true,
                        sessionType: m.profileData?.sessionType || 'one-on-one',
                        availabilityStatus: m.profileData?.availabilityStatus || 'available',
                        shortBio: m.profileData?.shortBio || 'Professional mentor helping startups scale.',
                        totalMentees: m.profileData?.totalMentees || 0,
                        rating: m.profileData?.rating || 5.0
                    }));
                setMentors(mentorsList);

                // Fetch requests for this founder
                const allRequests = JSON.parse(localStorage.getItem('vanguard_mentorRequests') || '[]');
                const founderRequests = allRequests.filter(r => r.founderId === user.uid);
                setRequests(founderRequests);
            } catch (err) {
                console.error("Error fetching mentors:", err);
            } finally {
                setLoading(false);
            }
        };

        refreshData();
    }, [user.uid]);

    // --- Logic: Dynamic Response Rate ---
    // Hydrate assigned mentor name from users object (SSOT)
    const allUsersRaw = localStorage.getItem('vanguard_users');
    let allUsers = {};
    try {
        allUsers = JSON.parse(allUsersRaw || '{}');
        if (Array.isArray(allUsers)) {
            allUsers = allUsers.reduce((acc, u) => {
                if (u.uid || u.id) acc[u.uid || u.id] = u;
                return acc;
            }, {});
        }
    } catch (e) { allUsers = {}; }

    const assignedMentor = startup.mentorAssigned ? allUsers[startup.mentorAssigned] : null;
    const assignedMentorName = assignedMentor?.name || assignedMentor?.email?.split('@')[0] || null;

    const processedMentors = useMemo(() => {
        const allRequests = JSON.parse(localStorage.getItem('vanguard_mentorRequests') || '[]');
        return mentors.map(m => {
            const mentorRequests = allRequests.filter(r => r.mentorId === m.id);
            const acceptedRequests = mentorRequests.filter(r => r.status === 'accepted').length;

            let calculatedRate = m.responseRate;
            if (mentorRequests.length > 0) {
                const ratio = acceptedRequests / mentorRequests.length;
                calculatedRate = Math.floor(60 + (ratio * 38));
            }

            return { ...m, dynamicResponseRate: calculatedRate };
        });
    }, [mentors]);

    // --- Logic: Premium Matching & Filtering ---
    const filteredMentors = useMemo(() => {
        let result = [...processedMentors];

        if (filters.sector !== 'All') {
            result = result.filter(m => m.expertiseSector === filters.sector);
        }

        if (filters.stages.length > 0) {
            result = result.filter(m =>
                m.supportedStages.some(stage => filters.stages.includes(stage))
            );
        }

        if (filters.sessionType !== 'All') {
            result = result.filter(m =>
                m.sessionType === filters.sessionType.toLowerCase() || m.sessionType === 'both'
            );
        }

        if (filters.verifiedOnly) {
            result = result.filter(m => m.verified);
        }

        const founderSector = startup?.sector || '';
        const founderStage = startup?.stage || 'Idea';

        result = result.map(m => {
            const sectorMatch = m.expertiseSector === founderSector;
            const stageMatch = m.supportedStages.includes(founderStage);
            const matchScore = (sectorMatch ? 2 : 0) + (stageMatch ? 1 : 0);
            return { ...m, matchScore, isBestMatch: matchScore >= 2 };
        });

        result.sort((a, b) => {
            if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
            return b.dynamicResponseRate - a.dynamicResponseRate;
        });

        return result;
    }, [processedMentors, filters, startup]);

    // --- Helpers ---
    const toggleStageFilter = (stage) => {
        setFilters(prev => ({
            ...prev,
            stages: prev.stages.includes(stage)
                ? prev.stages.filter(s => s !== stage)
                : [...prev.stages, stage]
        }));
    };

    const resetFilters = () => {
        setFilters({
            sector: 'All',
            stages: [],
            sessionType: 'All',
            verifiedOnly: false
        });
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();

        const message = `Problem: ${requestForm.problem}\n\nTried: ${requestForm.tried}\n\nOutcome: ${requestForm.outcome}`;
        requestMentor(requestingMentor.id, message);

        // Re-fetch requests
        const allRequests = JSON.parse(localStorage.getItem('vanguard_mentorRequests') || '[]');
        setRequests(allRequests.filter(r => r.founderId === user.uid));

        setRequestForm({ problem: '', tried: '', outcome: '' });
        setRequestingMentor(null);
    };

    const hasRequested = (mentorId) => {
        return requests.some(r => r.mentorId === mentorId);
    };

    const isAccessRestricted = !['founder', 'co-founder'].includes(user?.role);
    const canRequest = user?.role === 'founder' || (user?.role === 'co-founder' && startup?.coFounderPermissions?.mentorship);

    if (loading) return <div className="p-20 text-center text-gray-400">Loading Mentors...</div>;

    if (isAccessRestricted) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-3xl border border-white/5 mx-6">
                <Shield size={48} className="text-red-400 mb-6" />
                <h2 className="text-2xl font-black text-white mb-2">Access Restricted</h2>
                <p className="text-gray-400 text-center max-w-md">
                    The Vanguard Mentorship system is exclusive to Founders and authorized Co-Founders.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-2 md:px-0">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <span className="w-fit px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/30">
                            Expert Guidance
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="text-gray-400 text-[10px] md:text-sm font-medium">Verified Mentors</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                            Vanguard <span className="text-[#8B5CF6]">Mentors</span>
                        </h1>
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E1E2F] border border-white/5 rounded-2xl text-white font-bold transition-all hover:bg-white/5"
                        >
                            <Filter size={20} className={isFilterMenuOpen ? "text-[#8B5CF6]" : "text-gray-500"} />
                            <span className="text-sm">Filters</span>
                        </button>
                    </div>
                </div>

                {requests.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1E1E2F] rounded-xl border border-white/5 self-start sm:self-auto">
                        <MessageSquare size={16} className="text-[#8B5CF6]" />
                        <span className="text-xs md:text-sm font-bold text-white">{requests.length} Requests Sent</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Global Filters */}
                <aside className={`${isFilterMenuOpen ? 'block' : 'hidden lg:block'} lg:col-span-1 space-y-6 animate-in slide-in-from-top lg:animate-none`}>
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-white flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                                <Filter size={16} className="text-[#8B5CF6]" /> Filters
                            </h3>
                            <button
                                onClick={resetFilters}
                                className="text-[10px] font-black text-[#8B5CF6] uppercase hover:underline"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Sector Filter */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Sector Focus</label>
                                <select
                                    value={filters.sector}
                                    onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-[#8B5CF6]/50"
                                >
                                    <option value="All">All Sectors</option>
                                    <option value="Fintech">Fintech</option>
                                    <option value="D2C">D2C / Branding</option>
                                    <option value="Deep Tech">Deep Tech</option>
                                    <option value="SaaS">SaaS / Enterprise</option>
                                    <option value="Edtech">Edtech</option>
                                </select>
                            </div>

                            {/* Session Type Filter */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Session Type</label>
                                <select
                                    value={filters.sessionType}
                                    onChange={(e) => setFilters({ ...filters, sessionType: e.target.value })}
                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-[#8B5CF6]/50"
                                >
                                    <option value="All">All Types</option>
                                    <option value="One-on-One">One-on-One</option>
                                    <option value="Group">Group Workshop</option>
                                </select>
                            </div>

                            {/* Stage Filter */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block">Startup Stage</label>
                                <div className="space-y-3">
                                    {['Idea', 'MVP', 'Revenue'].map((st) => (
                                        <div
                                            key={st}
                                            className="flex items-center gap-3 group cursor-pointer"
                                            onClick={() => toggleStageFilter(st)}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.stages.includes(st)
                                                ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                                                : 'border-white/10 group-hover:border-[#8B5CF6]/50'
                                                }`}>
                                                {filters.stages.includes(st) && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${filters.stages.includes(st) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                }`}>{st} Stage</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verified Toggle */}
                            <div className="pt-4 border-t border-white/5">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-[10px] text-gray-500 font-black uppercase">Verified Only</span>
                                    <div
                                        onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                                        className={`w-10 h-5 rounded-full relative transition-all ${filters.verifiedOnly ? 'bg-[#8B5CF6]' : 'bg-[#0F0F14] border border-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${filters.verifiedOnly ? 'right-1 bg-white' : 'left-1 bg-gray-600'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#8B5CF6]/10 p-6 rounded-2xl border border-[#8B5CF6]/20">
                        <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                            <Star size={14} className="text-[#8B5CF6]" /> Premium Matching
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">We've ranked mentors based on your current {startup?.stage || 'Idea'} stage and sector expertise.</p>
                    </div>
                </aside>

                {/* Mentor Cards */}
                <div className="lg:col-span-3">
                    {filteredMentors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-3xl border border-dashed border-white/10">
                            <RefreshCw size={40} className="text-gray-600 mb-4 animate-spin-slow" />
                            <h3 className="text-xl font-bold text-white mb-2">No mentors match your filters</h3>
                            <p className="text-gray-400">Try adjusting your criteria or resetting filters.</p>
                            <button
                                onClick={resetFilters}
                                className="mt-6 px-6 py-2 bg-[#8B5CF6] text-white font-bold rounded-xl hover:bg-[#7C3AED] transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredMentors.map((mentor) => (
                                <motion.div
                                    layout
                                    key={mentor.id}
                                    className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden group hover:border-[#8B5CF6]/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all flex flex-col relative"
                                >
                                    {mentor.isBestMatch && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-2 py-1 bg-[#8B5CF6] text-white text-[8px] font-black uppercase rounded-md shadow-lg shadow-[#8B5CF6]/20">
                                                Best Match
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-8 pb-4">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] p-0.5 shadow-lg shadow-[#8B5CF6]/10">
                                                <div className="w-full h-full bg-[#1E1E2F] rounded-[14px] flex items-center justify-center font-black text-xl text-white">
                                                    {mentor.initials}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {mentor.verified && (
                                                    <div className="flex items-center gap-1 text-green-400 font-black text-xs uppercase mb-1">
                                                        <Shield size={10} /> Verified
                                                    </div>
                                                )}
                                                <div className="text-xs text-green-400 font-bold">{mentor.dynamicResponseRate}% Response Rate</div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white group-hover:text-[#8B5CF6] transition-colors mb-1">{mentor.name}</h3>
                                        <p className="text-sm font-bold text-gray-500 mb-4">{mentor.title}</p>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-white/5 text-gray-300 text-[10px] font-bold rounded-md border border-white/5">
                                                    {mentor.expertiseSector}
                                                </span>
                                                {mentor.supportedStages.map(s => (
                                                    <span key={s} className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-bold rounded-md border border-[#8B5CF6]/10">
                                                        {s} Stage
                                                    </span>
                                                ))}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Focus</p>
                                                <p className="text-xs font-bold text-gray-400 line-clamp-2">{mentor.mentorshipFocus}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto border-t border-white/5 p-4 flex items-center justify-between group-hover:bg-white/5 transition-colors">
                                        <div className="flex gap-2">
                                            {mentor.sessionType === 'one-on-one' || mentor.sessionType === 'both' ? (
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/20">1-on-1</span>
                                            ) : null}
                                            {mentor.sessionType === 'group' || mentor.sessionType === 'both' ? (
                                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-[8px] font-black uppercase rounded border border-yellow-500/20">Workshop</span>
                                            ) : null}
                                        </div>
                                        <button
                                            onClick={() => setSelectedMentor(mentor)}
                                            className="text-xs font-black text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                                        >
                                            View Profile <ChevronRight size={14} className="text-[#8B5CF6]" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Empty Slot */}
                            <div className="border border-dashed border-white/5 rounded-2xl flex items-center justify-center p-8 group hover:border-[#8B5CF6]/20 transition-all cursor-pointer">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Plus size={24} className="text-gray-600 group-hover:text-[#8B5CF6]" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 mb-1">Request New Sector</p>
                                    <p className="text-[10px] text-gray-700 uppercase font-black">Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center md:p-6"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-[#1E1E2F] w-full h-full md:h-auto md:max-w-3xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="relative">
                                <div className="h-32 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]" />
                                <button
                                    onClick={() => setSelectedMentor(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                                <div className="px-8 -mt-12 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="flex items-end gap-6">
                                        <div className="w-24 h-24 rounded-3xl bg-[#1E1E2F] border-4 border-[#1E1E2F] overflow-hidden shadow-2xl">
                                            <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-4xl font-black text-white">
                                                {selectedMentor.initials}
                                            </div>
                                        </div>
                                        <div className="pb-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-3xl font-black text-white">{selectedMentor.name}</h2>
                                                {selectedMentor.verified && <CheckCircle2 size={24} className="text-green-400" />}
                                            </div>
                                            <p className="text-gray-400 font-bold">{selectedMentor.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pb-2">
                                        <div className="bg-[#0F0F14] px-4 py-2 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] text-gray-500 font-black uppercase">Rating</p>
                                            <p className="text-lg font-black text-white">{selectedMentor.rating}</p>
                                        </div>
                                        <div className="bg-[#0F0F14] px-4 py-2 rounded-xl border border-white/5 text-center">
                                            <p className="text-[10px] text-gray-500 font-black uppercase">Mentees</p>
                                            <p className="text-lg font-black text-white">{selectedMentor.totalMentees}+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <section>
                                        <h4 className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest mb-3">Professional Bio</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{selectedMentor.shortBio}</p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest mb-3">Industry Experience</h4>
                                        <p className="text-white font-bold">{selectedMentor.expertiseSector}</p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest mb-3">Availability</h4>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedMentor.availabilityStatus === 'available' ? 'bg-green-500' :
                                                selectedMentor.availabilityStatus === 'limited' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} />
                                            <p className="text-sm font-bold text-gray-300 capitalize">{selectedMentor.availabilityStatus}</p>
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <h4 className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest mb-3">Mentorship Focus</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{selectedMentor.mentorshipFocus}</p>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest mb-3">Supported Stages</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMentor.supportedStages.map(stage => (
                                                <span key={stage} className="px-3 py-1 bg-white/5 text-white text-xs font-bold rounded-full border border-white/10">
                                                    {stage} Stage
                                                </span>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-6">
                                        <button
                                            disabled={hasRequested(selectedMentor.id) || !!startup?.mentorAssigned || selectedMentor.availabilityStatus === 'unavailable' || !canRequest}
                                            onClick={() => {
                                                setRequestingMentor(selectedMentor);
                                                setSelectedMentor(null);
                                            }}
                                            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl ${startup?.mentorAssigned === selectedMentor.id
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : (hasRequested(selectedMentor.id) || !!startup?.mentorAssigned)
                                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                                                    : selectedMentor.availabilityStatus === 'unavailable' || !canRequest
                                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] hover:shadow-[#8B5CF6]/20'
                                                }`}
                                        >
                                            {startup?.mentorAssigned === selectedMentor.id ? (
                                                <>Mentorship Active <CheckCircle2 size={18} /></>
                                            ) : startup?.mentorAssigned ? (
                                                'Mentor Already Assigned'
                                            ) : hasRequested(selectedMentor.id) ? (
                                                <>Request Sent <CheckCircle2 size={18} /></>
                                            ) : selectedMentor.availabilityStatus === 'unavailable' ? (
                                                'Unavailable'
                                            ) : !canRequest ? (
                                                'Permissions Required'
                                            ) : (
                                                <>Request Mentorship <ArrowRight size={18} /></>
                                            )}
                                        </button>
                                        {!canRequest && user?.role === 'co-founder' && (
                                            <p className="text-[8px] text-gray-600 text-center mt-2 uppercase font-black">Only Founders or authorized Co-Founders can send mentorship requests</p>
                                        )}
                                        {startup?.mentorAssigned && startup.mentorAssigned !== selectedMentor.id && (
                                            <p className="text-[8px] text-gray-600 text-center mt-2 uppercase font-black">You already have an active mentor assigned to your startup</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Request Form Modal */}
            <AnimatePresence>
                {requestingMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[160] flex items-center justify-center md:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1E1E2F] w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center font-black text-[#8B5CF6] text-2xl border border-[#8B5CF6]/30">
                                            {requestingMentor.initials}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white mb-1">Request Mentorship</h2>
                                            <p className="text-[#8B5CF6] font-bold text-sm">with {requestingMentor.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setRequestingMentor(null)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form className="space-y-8" onSubmit={handleRequestSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-2 block">Startup Stage</label>
                                                <div className="w-full bg-[#0F0F14] border border-white/5 rounded-2xl p-4 text-sm text-gray-400 font-bold">
                                                    {startup?.stage || 'Idea'} Stage (Auto-filled)
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-2 block">Exact Problem</label>
                                                <textarea
                                                    required
                                                    value={requestForm.problem}
                                                    onChange={(e) => setRequestForm({ ...requestForm, problem: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 min-h-[120px]"
                                                    placeholder="Describe the technical or business blocker you are facing..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-2 block">What has been tried?</label>
                                                <textarea
                                                    required
                                                    value={requestForm.tried}
                                                    onChange={(e) => setRequestForm({ ...requestForm, tried: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 min-h-[120px]"
                                                    placeholder="List your attempts to solve this blocker so far..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-2 block">Expected Outcome</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={requestForm.outcome}
                                                    onChange={(e) => setRequestForm({ ...requestForm, outcome: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#8B5CF6]/50"
                                                    placeholder="What would a successful session look like?"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/40 transition-all flex items-center justify-center gap-3"
                                        >
                                            Confirm Request <ArrowRight size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRequestingMentor(null)}
                                            className="px-8 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:text-white transition-all border border-white/5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mentors;
