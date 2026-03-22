
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    CheckCircle2,
    Zap,
    Activity,
    Rocket,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMentorUsers, getSystem } from '../../../utils/system';

const normalizeSectorLabel = (value) => {
    const normalized = (value || '').toString().trim().toLowerCase();
    const map = {
        tech: 'Technology',
        technology: 'Technology',
        finance: 'Finance',
        fintech: 'Fintech',
        marketing: 'Marketing',
        operations: 'Operations',
        general: 'General',
        ai: 'AI/ML',
        'ai/ml': 'AI/ML',
        saas: 'SaaS',
        edtech: 'Edtech',
        healthtech: 'Healthtech'
    };

    if (!normalized) return 'General';
    return map[normalized] || value;
};

const Mentors = () => {
    const { user } = useAuth();
    const { startup, requestMentorship, mentorRequests, removeAssignedMentor } = useStartup();
    const location = useLocation();
    const navigate = useNavigate();
    const role = user?.role === 'co-founder' ? 'co-founder' : 'founder';

    // --- State Management ---
    const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-mentor'
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [requestingMentor, setRequestingMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    const closeProfileModal = () => setSelectedMentor(null);
    const closeRequestModal = () => setRequestingMentor(null);

    // Sync active tab with location hash
    useEffect(() => {
        if (location.hash === '#my-mentor' && startup?.mentorAssigned) {
            setActiveTab('my-mentor');
        } else {
            setActiveTab('explore');
        }
    }, [location.hash, startup?.mentorAssigned]);

    // Filter State
    const [filters, setFilters] = useState({
        sector: 'All',
        stages: [],
        expertise: 'All',
        verifiedOnly: false
    });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const modalRef = useRef(null);
    const requestModalRef = useRef(null);

    // Scroll modal to top when opening
    useEffect(() => {
        if (selectedMentor && modalRef.current) {
            modalRef.current.scrollTo(0, 0);
        }
    }, [selectedMentor]);

    useEffect(() => {
        if (requestingMentor && requestModalRef.current) {
            requestModalRef.current.scrollTo(0, 0);
        }
    }, [requestingMentor]);

    // Keep modal exits consistent across desktop and mobile.
    useEffect(() => {
        const onEsc = (event) => {
            if (event.key !== 'Escape') return;

            if (requestingMentor) {
                closeRequestModal();
                return;
            }

            if (selectedMentor) {
                closeProfileModal();
            }
        };

        if (selectedMentor || requestingMentor) {
            window.addEventListener('keydown', onEsc);
        }

        return () => {
            window.removeEventListener('keydown', onEsc);
        };
    }, [selectedMentor, requestingMentor]);

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
                // Fetch mentors from global system
                const system = getSystem();
                const allUsers = system.users || {};

                const toArray = (value) => {
                    if (Array.isArray(value)) return value.filter(Boolean);
                    if (typeof value === 'string') {
                        return value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean);
                    }
                    return [];
                };

                const stageLabel = (value) => {
                    const normalized = (value || '').toString().trim().toLowerCase();
                    const map = {
                        idea: 'Idea',
                        validation: 'Validation',
                        mvp: 'MVP',
                        revenue: 'Revenue',
                        scale: 'Scale'
                    };
                    return map[normalized] || null;
                };

                const mentorsList = getMentorUsers({ users: allUsers })
                    .map((m, idx) => ({
                        ...(() => {
                            const rawFocusAreas = toArray(m.profileData?.focusAreas || m.expertise || m.primarySkills);
                            const normalizedStage = stageLabel(m.profileData?.stageSupport || m.stageSupport || m.stage);
                            const stages = Array.isArray(m.profileData?.supportedStages)
                                ? m.profileData.supportedStages
                                : normalizedStage
                                    ? [normalizedStage]
                                    : ['Idea', 'MVP', 'Revenue'];

                            const experienceYears = Number(m.profileData?.yearsExp || m.yearsExp);
                            const experienceText = Number.isFinite(experienceYears) && experienceYears > 0
                                ? `${experienceYears}+ Years of Mentorship`
                                : (m.profileData?.experience || m.experience || 'Experienced Startup Mentor');

                            return {
                                focusAreas: rawFocusAreas.length > 0 ? rawFocusAreas : ['Strategy', 'Product', 'Fundraising'],
                                supportedStages: stages,
                                expertiseSector: normalizeSectorLabel(m.profileData?.expertiseSector || m.expertiseSector || m.industry),
                                shortBio: m.profileData?.shortBio || m.bio || 'Professional mentor helping startups scale.',
                                experience: experienceText,
                                title: m.profileData?.currentRole || m.profileData?.title || m.title || 'Expert Mentor'
                            };
                        })(),
                        id: m.uid || `mentor-${idx}`,
                        name: m.name || m.profileData?.fullName || m.email.split('@')[0],
                        initials: (m.name || m.email.split('@')[0]).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        mentorshipFocus: m.profileData?.mentorshipFocus || 'Scaling & Growth',
                        expertise: Array.isArray(m.expertise) ? m.expertise : [],
                        responseRate: m.profileData?.responseRate || 95,
                        verified: (m.badge || '').toLowerCase() === 'verified' || m.profileData?.verified === true,
                        badge: m.badge || m.profileData?.badge || 'Verified',
                        availabilityStatus: m.availability?.status || m.profileData?.availability?.status || 'Available',
                        availability: m.availability || m.profileData?.availability || { status: 'Available', days: [], workload: 0, sessionType: '1:1' },
                        capacity: Number(m.portalData?.capacity) || 5,
                        totalMentees: m.profileData?.totalMentees || 0,
                        rating: m.profileData?.rating || 5.0,
                        mentorshipStyle: m.profileData?.mentorshipStyle || 'Direct & Strategic with a focus on measurable KPIs.',
                        mentorshipHistory: m.profileData?.mentorshipHistory || [
                            { company: 'Nexus AI', result: 'Seed to Series A', stage: 'Scaling' },
                            { company: 'SwiftPay', result: 'Acquired by Stripe', stage: 'Exit' },
                            { company: 'EduFlow', result: '10x User Growth', stage: 'Growth' }
                        ]
                    }));
                setMentors(mentorsList);
            } catch (err) {
                console.error("Error fetching mentors:", err);
            } finally {
                setLoading(false);
            }
        };

        queueMicrotask(refreshData);
        const handleStorage = () => refreshData();
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // --- Logic: Dynamic Response Rate ---
    const processedMentors = useMemo(() => {
        const system = getSystem();
        const allRequests = system.mentorRequests || [];
        const allStartups = system.startups || [];
        return mentors.map(m => {
            const mentorRequests = allRequests.filter(r => r.mentorId === m.id);
            const acceptedRequests = mentorRequests.filter(r => r.status === 'accepted').length;
            const assignedStartups = allStartups.filter(startupItem => startupItem.mentorAssigned === m.id).length;

            let calculatedRate = m.responseRate;
            if (mentorRequests.length > 0) {
                const ratio = acceptedRequests / mentorRequests.length;
                calculatedRate = Math.floor(70 + (ratio * 28)); // Adjusted math for realistic premium feel
            }

            return {
                ...m,
                dynamicResponseRate: calculatedRate,
                assignedStartups,
                workload: `${assignedStartups}/${m.capacity}`
            };
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

        if (filters.expertise !== 'All') {
            result = result.filter(m =>
                m.expertise.includes(filters.expertise) || m.focusAreas.includes(filters.expertise)
            );
        }

        if (filters.verifiedOnly) {
            result = result.filter(m => m.verified);
        }

        const founderSector = normalizeSectorLabel(startup?.sector || startup?.expertiseSector || '');
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

    const sectorOptions = useMemo(() => {
        return ['All', ...new Set(processedMentors.map(mentor => mentor.expertiseSector).filter(Boolean))];
    }, [processedMentors]);

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
            expertise: 'All',
            verifiedOnly: false
        });
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();

        const message = `Problem: ${requestForm.problem}\n\nTried: ${requestForm.tried}\n\nOutcome: ${requestForm.outcome}`;
        requestMentorship(requestingMentor.id, message);

        setRequestForm({ problem: '', tried: '', outcome: '' });
        setRequestingMentor(null);
    };

    const hasRequested = (mentorId) => {
        const system = getSystem();
        return (system.mentorRequests || []).some(r => r.mentorId === mentorId && r.startupId === startup?.startupId && r.status === 'pending');
    };

    const isAccessRestricted = !['founder', 'co-founder'].includes(user?.role);
    const canRequest = user?.role === 'founder' && !!startup || (user?.role === 'co-founder' && startup?.coFounderPermissions?.mentorship);

    const expertiseOptions = useMemo(() => {
        return ['All', ...new Set(processedMentors.flatMap(mentor => mentor.expertise || []).filter(Boolean))];
    }, [processedMentors]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <RefreshCw size={32} className="text-[#8B5CF6] animate-spin" />
            <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Loading Vanguard Network...</p>
        </div>
    );

    if (isAccessRestricted || (user?.role === 'founder' && !startup)) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-3xl border border-white/5 mx-6">
                <Shield size={48} className="text-[#8B5CF6] mb-6" />
                <h2 className="text-2xl font-black text-white mb-2">{!startup ? 'Startup Required' : 'Access Restricted'}</h2>
                <p className="text-gray-400 text-center max-w-md">
                    {!startup
                        ? 'You must create or join a startup before you can request mentorship from the Vanguard network.'
                        : 'The Vanguard Mentorship system is exclusive to Founders and authorized Co-Founders.'}
                </p>
                {!startup && user?.role === 'founder' && (
                    <button
                        onClick={() => navigate('/founder/dashboard')}
                        className="mt-8 px-8 py-3 bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all"
                    >
                        Go to Dashboard
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header & Tabs */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-2 md:px-0">
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                            <span className="w-fit px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8B5CF6]/30 shadow-lg shadow-[#8B5CF6]/5">
                                Expert Global Network
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className="text-gray-400 text-[10px] md:text-sm font-medium tracking-tight">Access Top-Tier Strategic Advisors</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Vanguard <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-purple-400">Mentors</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {(mentorRequests || []).length > 0 && (
                            <div className="flex items-center gap-3 px-5 py-4 bg-[#8B5CF6]/5 rounded-2xl border border-[#8B5CF6]/20 shadow-xl">
                                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                                <span className="text-xs md:text-sm font-bold text-[#8B5CF6] tracking-tight">{(mentorRequests || []).length} Requests Pending</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-4 p-1.5 bg-[#1E1E2F] rounded-[2rem] w-fit border border-white/5 mx-2 md:mx-0">
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`flex items-center gap-2 px-8 py-3.5 rounded-[1.7rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'explore'
                            ? 'bg-[#8B5CF6] text-white shadow-xl shadow-[#8B5CF6]/20'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        <Search size={16} /> Explore Mentors
                    </button>
                    <button
                        onClick={() => setActiveTab('my-mentor')}
                        className={`flex items-center gap-2 px-8 py-3.5 rounded-[1.7rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my-mentor'
                            ? 'bg-[#8B5CF6] text-white shadow-xl shadow-[#8B5CF6]/20'
                            : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        <User size={16} /> My Mentor
                    </button>
                </div>
            </div>

            {activeTab === 'explore' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Global Filters */}
                    <aside className={`${isFilterMenuOpen ? 'block' : 'hidden lg:block'} lg:col-span-1 space-y-6 animate-in slide-in-from-top lg:animate-none`}>
                        <div className="bg-[#1E1E2F] p-8 rounded-3xl border border-white/5 shadow-2xl sticky top-8">
                            <div className="flex items-center justify-between mb-8 text-white">
                                <h3 className="text-lg font-black flex items-center gap-3 uppercase tracking-[0.2em] text-[10px]">
                                    <Filter size={14} className="text-[#8B5CF6]" /> Filter Profile
                                </h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-[10px] font-black text-[#8B5CF6] uppercase hover:underline hover:text-white transition-colors"
                                >
                                    Reset All
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Sector Filter */}
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block tracking-widest pl-1">Sector Focus</label>
                                    <select
                                        value={filters.sector}
                                        onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                                        className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-gray-300 focus:outline-none focus:border-[#8B5CF6]/50 transition-all cursor-pointer"
                                    >
                                        {sectorOptions.map((sector) => (
                                            <option key={sector} value={sector}>{sector === 'All' ? 'All Sectors' : sector}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Expertise Filter */}
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase mb-3 block tracking-widest pl-1">Expertise</label>
                                    <select
                                        value={filters.expertise}
                                        onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}
                                        className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl p-4 text-sm text-gray-300 focus:outline-none focus:border-[#8B5CF6]/50 transition-all cursor-pointer"
                                    >
                                        {expertiseOptions.map((expertise) => (
                                            <option key={expertise} value={expertise}>{expertise === 'All' ? 'All Expertise' : expertise}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stage Filter */}
                                <div>
                                    <label className="text-[10px] text-gray-500 font-black uppercase mb-4 block tracking-widest pl-1">Target Startup Stage</label>
                                    <div className="space-y-4">
                                        {['Idea', 'Validation', 'MVP', 'Revenue', 'Scale'].map(st => (
                                            <div
                                                key={st}
                                                className="flex items-center gap-3 group cursor-pointer"
                                                onClick={() => toggleStageFilter(st)}
                                            >
                                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${filters.stages.includes(st)
                                                    ? 'bg-[#8B5CF6] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20'
                                                    : 'border-white/10 group-hover:border-[#8B5CF6]/50 bg-[#0F0F14]'
                                                    }`}>
                                                    {filters.stages.includes(st) && <CheckCircle2 size={12} className="text-white" />}
                                                </div>
                                                <span className={`text-[13px] font-bold transition-colors ${filters.stages.includes(st) ? 'text-white' : 'text-gray-500 group-hover:text-white'
                                                    }`}>{st} Stage</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Verified Toggle */}
                                <div className="pt-6 border-t border-white/5">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[11px] text-gray-400 font-bold">Vanguard Verified</span>
                                        <div
                                            onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${filters.verifiedOnly ? 'bg-[#8B5CF6]' : 'bg-[#0F0F14] border border-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${filters.verifiedOnly ? 'right-1 bg-white shadow-md' : 'left-1 bg-gray-700'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#8B5CF6]/20 to-purple-900/10 p-8 rounded-3xl border border-[#8B5CF6]/30 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                                <Target size={120} />
                            </div>
                            <h4 className="font-black text-white text-sm mb-3 flex items-center gap-2 relative z-10">
                                <Star size={14} className="text-[#8B5CF6]" fill="currentColor" /> Strategic Ranking
                            </h4>
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed relative z-10">
                                The network is currently optimized to surface mentors who specialize in <span className="text-white font-bold">{startup?.stage || 'Idea'}</span> stage startups within the <span className="text-white font-bold">{normalizeSectorLabel(startup?.sector || startup?.expertiseSector || 'General')}</span> sector.
                            </p>
                        </div>
                    </aside>

                    {/* Mentor Cards */}
                    <div className="lg:col-span-3">
                        {filteredMentors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-[2.5rem] border border-dashed border-white/10 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-gray-700">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Boundary Exceeded</h3>
                                <p className="text-gray-500 max-w-sm font-medium">No mentors currently match your specific strategic filters. Try expanding your search criteria.</p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-8 px-8 py-4 bg-[#8B5CF6] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#7C3AED] transition-all shadow-xl shadow-[#8B5CF6]/20"
                                >
                                    Reset Search Parameters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredMentors.map((mentor) => (
                                    <motion.div
                                        layout
                                        key={mentor.id}
                                        className="bg-[#1E1E2F] rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-[#8B5CF6]/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)] transition-all flex flex-col relative"
                                    >
                                        {mentor.isBestMatch && (
                                            <div className="absolute top-6 left-6 z-10">
                                                <span className="px-3 py-1 bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white text-[9px] font-black uppercase rounded-lg shadow-xl shadow-[#8B5CF6]/40 flex items-center gap-1.5">
                                                    <Zap size={10} fill="currentColor" /> Strategic Alpha Match
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-10 pb-6 flex-1">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#1E1E2F] to-[#0F0F14] p-[1px] shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                                                    <div className="w-full h-full bg-[#1E1E2F] rounded-[1.9rem] flex items-center justify-center font-black text-2xl text-[#8B5CF6] border border-white/5">
                                                        {mentor.initials}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0F0F14] rounded-full border border-white/10 flex items-center justify-center text-[#8B5CF6] shadow-lg">
                                                        <Star size={10} fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-green-400 font-black text-[9px] uppercase tracking-widest mb-2">
                                                        <Shield size={12} className="fill-green-400/10" /> {mentor.badge}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{mentor.dynamicResponseRate}% Global Response</div>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-2xl font-black text-white group-hover:text-[#8B5CF6] transition-colors mb-2 leading-tight">{mentor.name}</h3>
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{mentor.title}</p>
                                            </div>

                                            <div className="space-y-6 pt-6 border-t border-white/5">
                                                <div className="flex flex-wrap gap-2">
                                                    <div className="px-3 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#8B5CF6]/20">
                                                        {mentor.expertiseSector}
                                                    </div>
                                                    <div className="px-3 py-1.5 bg-white/5 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                                                        {mentor.workload} Workload
                                                    </div>
                                                    <div className="px-3 py-1.5 bg-white/5 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                                                        {mentor.availabilityStatus}
                                                    </div>
                                                    {mentor.supportedStages.slice(0, 2).map(s => (
                                                        <div key={s} className="px-3 py-1.5 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                                                            {s}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div>
                                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-3">Core Expertise</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {mentor.focusAreas.map(area => (
                                                            <span key={area} className="text-[11px] font-bold text-gray-400 py-1 px-2 bg-[#0F0F14] rounded-lg border border-white/5">{area}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto border-t border-white/5 p-6 flex items-center justify-between group-hover:bg-white/5 transition-colors group-hover:pb-8 duration-500">
                                            <button
                                                onClick={() => setSelectedMentor(mentor)}
                                                className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-500"
                                            >
                                                View Profile <ChevronRight size={16} className="text-[#8B5CF6]" />
                                            </button>

                                            <button
                                                disabled={hasRequested(mentor.id) || !!startup?.mentorAssigned || !canRequest || mentor.availabilityStatus === 'unavailable'}
                                                onClick={() => setRequestingMentor(mentor)}
                                                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${startup?.mentorAssigned === mentor.id
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : hasRequested(mentor.id)
                                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 cursor-not-allowed'
                                                        : !!startup?.mentorAssigned || !canRequest
                                                            ? 'bg-gray-800 text-gray-600 border border-white/5 cursor-not-allowed opacity-50'
                                                            : 'bg-[#8B5CF6] text-white hover:bg-indigo-600 shadow-lg shadow-[#8B5CF6]/20'
                                                    }`}
                                            >
                                                {startup?.mentorAssigned === mentor.id ? (
                                                    'Active Partner'
                                                ) : hasRequested(mentor.id) ? (
                                                    'Request Sent'
                                                ) : startup?.mentorAssigned ? (
                                                    'Request Locked'
                                                ) : !canRequest ? (
                                                    'Access Locked'
                                                ) : (
                                                    'Request Mentorship'
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Request New Sector */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="border border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center p-10 group hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all cursor-pointer"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-90 transition-all duration-500">
                                            <Plus size={32} className="text-gray-600 group-hover:text-[#8B5CF6]" />
                                        </div>
                                        <h4 className="text-white font-black text-lg mb-1 leading-tight">Can't find a fit?</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Request Specific Sector Expert</p>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* My Mentor Section */
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {startup?.mentorAssigned ? (() => {
                        const myMentor = processedMentors.find(m => m.id === startup.mentorAssigned);
                        if (!myMentor) return null;

                        const system = getSystem();
                        const mySessions = (system.sessions || []).filter(s => s.startupId === startup.startupId);
                        const nextSession = mySessions.find(s => s.status === 'upcoming' || s.status === 'pending_confirmation');

                        return (
                            <div className="max-w-6xl mx-auto space-y-12">
                                <div className="bg-[#1E1E2F] rounded-[3rem] border border-[#8B5CF6]/30 overflow-hidden shadow-2xl relative">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/5 blur-[120px] -mr-64 -mt-64 pointer-events-none" />

                                    <div className="p-12 md:p-20 relative z-10">
                                        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#8B5CF6] to-indigo-600 p-1 shadow-2xl shadow-[#8B5CF6]/20 shrink-0">
                                                <div className="w-full h-full bg-[#1E1E2F] rounded-[2.3rem] flex items-center justify-center text-4xl font-black text-white">
                                                    {myMentor.initials}
                                                </div>
                                            </div>
                                            <div className="text-center md:text-left flex-1">
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{myMentor.name}</h2>
                                                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-green-500/20">Active Partner</span>
                                                </div>
                                                <p className="text-sm font-black text-[#8B5CF6] uppercase tracking-[0.3em] mb-8">{myMentor.title}</p>

                                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                    <button
                                                        onClick={() => navigate(`/${role}/messages`, { state: { openChat: { startupId: startup.startupId, type: 'mentor' } } })}
                                                        className="px-8 py-4 bg-[#8B5CF6] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-xl shadow-[#8B5CF6]/20"
                                                    >
                                                        <MessageSquare size={16} /> Message Mentor
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/${role}/sessions`)}
                                                        className="px-8 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                                                    >
                                                        <Calendar size={16} /> Schedule Session
                                                    </button>
                                                    <button
                                                        onClick={removeAssignedMentor}
                                                        className="px-8 py-4 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                                                    >
                                                        Remove Mentor
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedMentor(myMentor)}
                                                        className="px-8 py-4 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:text-white transition-all"
                                                    >
                                                        Performance Data
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* Status Card */}
                                            <div className="p-8 bg-black/20 rounded-3xl border border-white/5 space-y-6">
                                                <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <RefreshCw size={12} className="text-[#8B5CF6]" /> Advisory Status
                                                </h4>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">Protocol Type</p>
                                                    <p className="text-lg font-black text-white">1-on-1 Strategic Deep Dive</p>
                                                </div>
                                                <div className="pt-4 border-t border-white/5">
                                                    <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">Next Interaction</p>
                                                    {nextSession ? (
                                                        <p className="text-lg font-black text-[#8B5CF6]">{nextSession.date} at {nextSession.time}</p>
                                                    ) : (
                                                        <p className="text-lg font-black text-gray-600 italic uppercase">Unscheduled</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Focus Areas Card */}
                                            <div className="lg:col-span-2 p-8 bg-black/20 rounded-3xl border border-white/5">
                                                <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                                                    <Target size={12} className="text-[#8B5CF6]" /> Evolution Focus
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {(startup.focusAreas || myMentor.focusAreas).map((area, idx) => (
                                                        <div key={idx} className="px-5 py-3 bg-[#8B5CF6]/10 text-white font-black text-xs rounded-2xl border border-[#8B5CF6]/20 flex items-center gap-2 group">
                                                            <Zap size={14} className="text-[#8B5CF6] group-hover:scale-125 transition-transform" /> {area}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="mt-6 text-[10px] text-gray-600 font-bold italic">Focus areas are collaborative and updated by your mentor as the venture matures.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mentorship Logs / Session History */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-white uppercase tracking-widest px-4 flex items-center gap-3">
                                        <Activity size={20} className="text-[#8B5CF6]" /> Mission logs
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {mySessions.filter(s => s.status === 'completed').length > 0 ? (
                                            mySessions.filter(s => s.status === 'completed').map(s => (
                                                <div key={s.id} className="p-8 bg-[#1B1B2B] rounded-3xl border border-white/5 hover:border-[#8B5CF6]/20 transition-all group">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[8px] font-black uppercase rounded border border-green-500/20">Execution Log</div>
                                                        <span className="text-[10px] text-gray-600 font-black uppercase">{s.date}</span>
                                                    </div>
                                                    <h5 className="text-white font-black text-sm mb-4 leading-relaxed group-hover:text-[#8B5CF6] transition-colors">"{s.notes || 'Strategic advisory session completed. Base milestones established.'}"</h5>
                                                    <div className="space-y-2">
                                                        {s.actionItems?.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                                                <div className="w-1 h-1 bg-[#8B5CF6] rounded-full" /> {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full p-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 text-center">
                                                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs italic">No advisory logs found. Complete a session to see strategic history.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })() : (() => {
                        const system = getSystem();
                        const myRequests = (system.mentorRequests || []).filter(r => r.startupId === startup?.startupId);
                        const pendingRequest = myRequests.find(r => r.status === 'pending');
                        const rejectedRequests = myRequests.filter(r => r.status === 'rejected');

                        if (pendingRequest) {
                            const mentor = processedMentors.find(m => m.id === pendingRequest.mentorId);
                            return (
                                <div className="flex flex-col items-center justify-center p-32 bg-[#1E1E2F] rounded-[3rem] border border-[#8B5CF6]/30 text-center mx-2 md:mx-0 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                                        <Clock size={200} />
                                    </div>
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-indigo-600 rounded-[2rem] flex items-center justify-center mb-10 text-white shadow-xl shadow-[#8B5CF6]/20">
                                        <Clock size={40} className="animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-3">Handshake Pending</h3>
                                    <p className="text-gray-500 max-w-sm font-medium italic text-lg line-height-relaxed mb-8">
                                        Your request to <span className="text-white font-black">{mentor?.name || 'Mentor'}</span> is currently being reviewed.
                                    </p>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="px-6 py-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-2xl">
                                            <p className="text-[10px] text-[#8B5CF6] font-black uppercase tracking-widest">Awaiting Mentor Protocol Verification</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('explore')}
                                            className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            Explore other mentors
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="flex flex-col items-center justify-center p-32 bg-[#1E1E2F] rounded-[3rem] border border-dashed border-white/10 text-center mx-2 md:mx-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                                    <Rocket size={200} />
                                </div>
                                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 text-gray-700 shadow-inner">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-3">Strategic Void Detected</h3>
                                <p className="text-gray-500 max-w-sm font-medium italic text-lg line-height-relaxed">
                                    {rejectedRequests.length > 0
                                        ? "Your previous request was declined. Explore the network to find a new strategic partner."
                                        : "\"Request a mentor to start strategic advisory support and accelerate your execution lifecycle.\""}
                                </p>
                                <button
                                    onClick={() => setActiveTab('explore')}
                                    className="mt-12 px-10 py-5 bg-[#8B5CF6] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#7C3AED] transition-all shadow-2xl shadow-[#8B5CF6]/20 flex items-center gap-3"
                                >
                                    Browse Global Network <ArrowRight size={18} />
                                </button>
                                {rejectedRequests.length > 0 && (
                                    <p className="mt-8 text-[9px] text-gray-600 font-black uppercase tracking-widest">Previous attempt: Protocol Terminated</p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) closeProfileModal();
                        }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex items-center justify-center md:p-10"
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-[#1E1E2F] w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-[3rem] border border-white/10 overflow-y-auto overflow-x-hidden shadow-2xl relative"
                        >
                            {/* Modal Header Decorations */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/5 blur-[120px] -mr-48 -mt-48 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] -ml-48 -mb-48 pointer-events-none" />

                            <div className="p-10 md:p-16">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
                                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#8B5CF6] to-indigo-600 p-1 shadow-2xl shadow-[#8B5CF6]/20">
                                            <div className="w-full h-full bg-[#1E1E2F] rounded-[2.3rem] flex items-center justify-center text-4xl font-black text-white border border-white/10">
                                                {selectedMentor.initials}
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{selectedMentor.name}</h2>
                                                {selectedMentor.verified && (
                                                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                                                        <Shield size={20} fill="currentColor" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-black text-[#8B5CF6] uppercase tracking-[0.3em]">{selectedMentor.title}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeProfileModal}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all border border-white/10 group sticky top-0 bg-[#1E1E2F]/80 backdrop-blur-md z-20"
                                    >
                                        <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                                    <div className="md:col-span-7 space-y-12">
                                        <section>
                                            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <div className="w-6 h-px bg-[#8B5CF6]" /> Biography
                                            </h4>
                                            <p className="text-gray-400 text-lg font-medium leading-[1.8] italic">
                                                "{selectedMentor.shortBio}"
                                            </p>
                                        </section>

                                        <section className="bg-white/5 rounded-[2.5rem] border border-white/5 p-10">
                                            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-8">Strategic Match Metrics</h4>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                                <div className="text-center lg:text-left">
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Impact Score</p>
                                                    <p className="text-2xl font-black text-white">{selectedMentor.rating}</p>
                                                </div>
                                                <div className="text-center lg:text-left">
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Mentees</p>
                                                    <p className="text-2xl font-black text-white">{selectedMentor.totalMentees}+</p>
                                                </div>
                                                <div className="text-center lg:text-left">
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Response</p>
                                                    <p className="text-2xl font-black text-green-400">{selectedMentor.dynamicResponseRate}%</p>
                                                </div>
                                                <div className="text-center lg:text-left">
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Veracity</p>
                                                    <p className="text-2xl font-black text-[#8B5CF6]">Gold</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="md:col-span-5 space-y-12">
                                        <section>
                                            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-6">Expertise Domains</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[11px] font-black uppercase tracking-widest rounded-xl border border-[#8B5CF6]/20">
                                                    {selectedMentor.expertiseSector}
                                                </div>
                                                {selectedMentor.focusAreas.map(area => (
                                                    <div key={area} className="px-4 py-2 bg-white/5 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                                                        {area}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-6">Execution Lifecycle Alignment</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMentor.supportedStages.map(stage => (
                                                    <span key={stage} className="px-4 py-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-white text-[11px] font-black uppercase tracking-widest rounded-xl border border-white/5">
                                                        {stage} Stage
                                                    </span>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <div className="w-6 h-px bg-[#8B5CF6]" /> Experience & Style
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Briefcase size={14} className="text-[#8B5CF6]" />
                                                    <span className="text-sm text-gray-300 font-bold">{selectedMentor.experience}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Target size={14} className="text-[#8B5CF6]" />
                                                    <span className="text-sm text-gray-300 font-bold">{selectedMentor.mentorshipStyle}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <div className="w-6 h-px bg-[#8B5CF6]" /> Mentorship History
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {(selectedMentor.mentorshipHistory || []).map((h, i) => (
                                                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                                                        <p className="text-white font-black text-sm">{h.company}</p>
                                                        <p className="text-[#8B5CF6] text-[10px] font-bold uppercase tracking-widest">{h.result}</p>
                                                        <div className="mt-2 text-[9px] text-gray-600 font-black uppercase">{h.stage} Stage</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="pt-8">
                                            <button
                                                disabled={hasRequested(selectedMentor.id) || !!startup?.mentorAssigned || selectedMentor.availabilityStatus === 'unavailable' || !canRequest}
                                                onClick={() => {
                                                    setRequestingMentor(selectedMentor);
                                                    setSelectedMentor(null);
                                                }}
                                                className={`w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 text-[10px] shadow-2xl relative overflow-hidden group ${startup?.mentorAssigned === selectedMentor.id
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : (hasRequested(selectedMentor.id) || !!startup?.mentorAssigned)
                                                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5 opacity-50'
                                                        : 'bg-[#8B5CF6] text-white hover:bg-indigo-600 hover:shadow-[#8B5CF6]/30'
                                                    }`}
                                            >
                                                {startup?.mentorAssigned === selectedMentor.id ? (
                                                    <>Active Partner <Shield size={18} /></>
                                                ) : startup?.mentorAssigned ? (
                                                    'Request Locked'
                                                ) : hasRequested(selectedMentor.id) ? (
                                                    <>Handshake Pending <Clock size={18} /></>
                                                ) : !canRequest ? (
                                                    'Access Locked'
                                                ) : (
                                                    <>Request Mentorship <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" /></>
                                                )}
                                            </button>
                                            {!canRequest && user?.role === 'co-founder' && (
                                                <p className="text-[8px] text-gray-600 text-center mt-4 uppercase font-black tracking-widest">Founder clearance required to modify advisory board</p>
                                            )}
                                        </div>
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
                        onClick={(e) => {
                            if (e.target === e.currentTarget) closeRequestModal();
                        }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[160] flex items-center justify-center md:p-10"
                    >
                        <motion.div
                            ref={requestModalRef}
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-[#1E1E2F] w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-[3rem] border border-white/10 overflow-y-auto overflow-x-hidden shadow-2xl"
                        >
                            <div className="p-12 md:p-16">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#8B5CF6] to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-[#8B5CF6]/20">
                                            {requestingMentor.initials}
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-white mb-1 tracking-tight">Mentorship Request</h2>
                                            <p className="text-[#8B5CF6] font-black text-sm uppercase tracking-[0.2em] italic">Strategic Deep Dive with {requestingMentor.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeRequestModal}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form className="space-y-12" onSubmit={handleRequestSubmit}>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <div>
                                                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] pl-1 mb-4 block">Execution Phase</label>
                                                <div className="w-full bg-[#0F0F14] border border-white/5 rounded-2xl p-5 text-sm text-gray-500 font-bold border-l-4 border-l-[#8B5CF6]">
                                                    {startup?.stage || 'Idea'} Stage Protocol (Automated)
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] pl-1 mb-4 block">Critical Blocker</label>
                                                <textarea
                                                    required
                                                    value={requestForm.problem}
                                                    onChange={(e) => setRequestForm({ ...requestForm, problem: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-[2rem] p-6 text-[15px] text-white placeholder-gray-800 focus:outline-none focus:border-[#8B5CF6]/50 transition-all min-h-[160px] leading-relaxed"
                                                    placeholder="Define the core strategic or technical friction point..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] pl-1 mb-4 block">Execution History</label>
                                                <textarea
                                                    required
                                                    value={requestForm.tried}
                                                    onChange={(e) => setRequestForm({ ...requestForm, tried: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-[2rem] p-6 text-[15px] text-white placeholder-gray-800 focus:outline-none focus:border-[#8B5CF6]/50 transition-all min-h-[160px] leading-relaxed"
                                                    placeholder="Document previous attempts to resolve this friction..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] pl-1 mb-4 block">Definition of Success</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={requestForm.outcome}
                                                    onChange={(e) => setRequestForm({ ...requestForm, outcome: e.target.value })}
                                                    className="w-full bg-[#0F0F14] border border-white/5 rounded-[1.5rem] p-6 text-[15px] text-white placeholder-gray-800 focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                                                    placeholder="What is the mission-critical objective of this session?"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 pt-6">
                                        <button
                                            type="submit"
                                            className="flex-[2] bg-gradient-to-r from-[#8B5CF6] to-indigo-600 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-[#8B5CF6]/20 hover:shadow-[#8B5CF6]/40 hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4"
                                        >
                                            Transmit Request <ArrowRight size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeRequestModal}
                                            className="flex-1 bg-white/5 text-gray-500 font-black py-6 rounded-[1.5rem] hover:text-white hover:bg-white/10 transition-all border border-white/10 text-[10px] uppercase tracking-[0.2em]"
                                        >
                                            Abort
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
