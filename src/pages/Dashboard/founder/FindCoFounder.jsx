
import React, { useState, useEffect, useMemo } from 'react';
import {
    UserPlus,
    Search,
    Filter,
    MapPin,
    Award,
    DollarSign,
    Clock,
    ChevronRight,
    Briefcase,
    Zap,
    X,
    CheckCircle2,
    Bookmark,
    Building2,
    Activity,
    Info
} from 'lucide-react';
import { useStartup } from '../../../context/StartupContext';

const FindCoFounder = () => {
    const { startup } = useStartup();
    const [user, setUser] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [connections, setConnections] = useState([]);
    const [savedCandidates, setSavedCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        primarySkill: 'All',
        equityRange: [],
        commitment: 'All',
        verifiedOnly: false
    });
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Load Data
    useEffect(() => {
        const refreshData = () => {
            // Load Current User
            const storedUser = localStorage.getItem('vanguard_currentUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            // Load Candidates (Users with role 'co-founder')
            const allUsers = JSON.parse(localStorage.getItem('vanguard_users') || '[]');
            const coFounders = allUsers
                .filter(u => u.role === 'co-founder')
                .map(u => ({
                    id: u.id,
                    name: u.name || u.profileData?.fullName || u.email.split('@')[0],
                    primarySkill: u.profileData?.primarySkill || 'Generalist',
                    skills: u.profileData?.skills || [],
                    experienceTitle: u.profileData?.experienceTitle || 'Professional',
                    location: u.profileData?.location || 'Remote',
                    equityExpectation: u.profileData?.equityExpectation || 'Negotiable',
                    commitmentType: u.profileData?.commitmentType || 'Full-time',
                    verifiedStatus: u.profileData?.verified || true,
                    shortBio: u.profileData?.shortBio || 'Ready to join a high-impact startup.',
                    previousExperience: u.profileData?.previousExperience || ''
                }));
            setCandidates(coFounders);

            // Load Connections
            const storedConnections = JSON.parse(localStorage.getItem('vanguard_connections') || '[]');
            setConnections(storedConnections);

            // Load Saved
            const storedSaved = JSON.parse(localStorage.getItem('vanguard_savedCandidates') || '[]');
            setSavedCandidates(storedSaved);
        };

        refreshData();
    }, []);

    // Role-Aware Logic
    if (user && user.role === 'co-founder') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-500">
                    <Info size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-400 max-w-sm">The "Find Co-Founder" portal is only available to Founder accounts looking for talent.</p>
                </div>
            </div>
        );
    }

    // Dynamic Compatibility Score Calculation
    const calculateScore = (candidatePrimarySkill) => {
        if (!startup?.skillGap) return { score: 50, label: 'Medium Match' };

        const gap = startup.skillGap.toLowerCase();
        const skill = (candidatePrimarySkill || '').toLowerCase();

        if (gap === skill) return { score: 95, label: 'High Compatibility' };
        if (gap.includes(skill) || (skill && skill.includes(gap))) return { score: 75, label: 'Strong Match' };

        const gapWords = gap.split(' ');
        const skillWords = skill.split(' ');
        const overlap = gapWords.filter(w => skillWords.includes(w) && w.length > 3);

        if (overlap.length > 0) return { score: 65, label: 'Partial Match' };

        return { score: 35, label: 'Low Compatibility' };
    };

    // Connection Logic
    const handleConnect = (candidateId) => {
        const newConnection = {
            id: `conn_${Date.now()}`,
            candidateId,
            founderId: user?.id,
            requestStatus: 'pending',
            timestamp: new Date().toISOString()
        };

        const updatedConnections = [...connections, newConnection];
        setConnections(updatedConnections);
        localStorage.setItem('vanguard_connections', JSON.stringify(updatedConnections));
    };

    // Saved Logic
    const toggleSave = (candidateId) => {
        let updatedSaved;
        if (savedCandidates.includes(candidateId)) {
            updatedSaved = savedCandidates.filter(id => id !== candidateId);
        } else {
            updatedSaved = [...savedCandidates, candidateId];
        }
        setSavedCandidates(updatedSaved);
        localStorage.setItem('vanguard_savedCandidates', JSON.stringify(updatedSaved));
    };

    // Filtering Logic
    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.primarySkill && c.primarySkill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (c.skills && c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()));

            // Skill filter
            const matchesSkill = filters.primarySkill === 'All' || c.primarySkill === filters.primarySkill;

            // Commitment filter
            const matchesCommitment = filters.commitment === 'All' || c.commitmentType === filters.commitment;

            // Verified filter
            const matchesVerified = !filters.verifiedOnly || c.verifiedStatus;

            // Equity filter
            const matchesEquity = filters.equityRange.length === 0 || filters.equityRange.includes(c.equityExpectation);

            return matchesSearch && matchesSkill && matchesCommitment && matchesVerified && matchesEquity;
        });
    }, [candidates, searchTerm, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleEquityFilter = (range) => {
        setFilters(prev => {
            const next = prev.equityRange.includes(range)
                ? prev.equityRange.filter(r => r !== range)
                : [...prev.equityRange, range];
            return { ...prev, equityRange: next };
        });
    };

    const resetFilters = () => {
        setFilters({
            primarySkill: 'All',
            equityRange: [],
            commitment: 'All',
            verifiedOnly: false
        });
        setSearchTerm('');
    };

    const openProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/30">
                            Founder Exclusive
                        </span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                        <span className="text-gray-400 text-[10px] md:text-sm font-medium">Talent Acquisition</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        Find <span className="text-[#8B5CF6]">Co-Founder</span>
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:max-w-2xl">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by skill, sector or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1E1E2F] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        className="lg:hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E1E2F] border border-white/5 rounded-2xl text-white font-bold transition-all hover:bg-white/5"
                    >
                        <Filter size={20} className={isFilterMenuOpen ? "text-[#8B5CF6]" : "text-gray-500"} />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filter Panel */}
                <div className={`${isFilterMenuOpen ? 'block' : 'hidden md:hidden lg:block'} lg:col-span-1 space-y-8 animate-in slide-in-from-top lg:animate-none`}>
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Filter size={18} className="text-[#8B5CF6]" /> Filters
                            </h3>
                            <button
                                onClick={resetFilters}
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 block">Primary Skill</label>
                                <select
                                    value={filters.primarySkill}
                                    onChange={(e) => handleFilterChange('primarySkill', e.target.value)}
                                    className="w-full bg-[#0F0F14] border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-[#8B5CF6]/50"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Marketing / GTM">Marketing / GTM</option>
                                    <option value="Backend Engineering">Backend Engineering</option>
                                    <option value="Product Design">Product Design</option>
                                    <option value="Sales / Operations">Sales / Operations</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 block">Equity Range</label>
                                <div className="space-y-2">
                                    {['5-10%', '10-20%', '20%+', 'Negotiable'].map((e, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => toggleEquityFilter(e)}
                                                className={`w-5 h-5 rounded border border-white/10 flex items-center justify-center transition-all ${filters.equityRange.includes(e) ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]' : 'group-hover:border-[#8B5CF6]/50'}`}
                                            >
                                                {filters.equityRange.includes(e) && <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-sm" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${filters.equityRange.includes(e) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{e}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 block">Commitment</label>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Full-time', 'Part-time', 'Contract'].map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleFilterChange('commitment', c)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border transition-all ${filters.commitment === c ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#8B5CF6]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1E1E2F] to-[#0F0F14] p-8 rounded-2xl border border-[#8B5CF6]/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={48} /></div>
                        <h4 className="font-bold text-white text-sm mb-2">Vanguard Verified</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">Show only candidates with verified execution history.</p>
                        <div
                            onClick={() => handleFilterChange('verifiedOnly', !filters.verifiedOnly)}
                            className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all duration-300 ${filters.verifiedOnly ? 'bg-[#8B5CF6]/40 border-[#8B5CF6]' : 'bg-gray-800 border-white/10'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300 ${filters.verifiedOnly ? 'right-1' : 'left-1'}`} />
                        </div>
                    </div>
                </div>

                {/* Candidate List */}
                <div className="lg:col-span-3 space-y-6">
                    {filteredCandidates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-[#1E1E2F] rounded-2xl border border-white/5 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">No Candidates Found</h3>
                            <p className="text-gray-500 max-w-xs">No candidates match your filters. Try adjusting search criteria or resetting filters.</p>
                            <button
                                onClick={resetFilters}
                                className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-xl border border-white/10 transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        filteredCandidates.map((c, i) => {
                            const comp = calculateScore(c.primarySkill);
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => openProfile(c)}
                                    className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/2 group-hover:bg-[#8B5CF6]/5 transition-all rounded-bl-[100px] flex items-start justify-end p-6">
                                        <ChevronRight className="text-gray-700 group-hover:text-white transition-colors" />
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-[#8B5CF6] to-indigo-600 p-0.5 shadow-lg group-hover:rotate-3 transition-transform">
                                                <div className="w-full h-full bg-[#1E1E2F] rounded-[22px] flex items-center justify-center font-black text-2xl text-white">
                                                    {c.name[0]}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSave(c.id);
                                                }}
                                                className={`absolute -top-2 -left-2 w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all ${savedCandidates.includes(c.id) ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'bg-[#1E1E2F]/80 border-white/10 text-gray-500 hover:text-white'}`}
                                            >
                                                <Bookmark size={14} fill={savedCandidates.includes(c.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-xl md:text-2xl font-black text-white">{c.name}</h3>
                                                        {c.verifiedStatus && (
                                                            <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded border border-green-500/20 flex items-center gap-1">
                                                                <CheckCircle2 size={10} /> Verified hero
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[#8B5CF6] font-bold text-xs md:text-sm">{c.primarySkill} • <span className="text-gray-500">{c.experienceTitle}</span></p>
                                                </div>
                                                <div className="flex items-center gap-3 self-end sm:self-center">
                                                    <div className="flex flex-col items-end mr-2 md:mr-4">
                                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">Match</span>
                                                        <span className="text-sm font-black text-[#8B5CF6]">{comp.score}% Score</span>
                                                    </div>
                                                    {c.connectionStatus === 'pending' ? (
                                                        <button
                                                            disabled
                                                            className="px-4 py-2.5 bg-gray-500/10 text-gray-500 cursor-not-allowed text-xs font-black rounded-xl border border-white/5"
                                                        >
                                                            Pending
                                                        </button>
                                                    ) : c.connectionStatus === 'connected' ? (
                                                        <button
                                                            disabled
                                                            className="px-4 py-2.5 bg-green-500/10 text-green-500 cursor-not-allowed text-xs font-black rounded-xl border border-green-500/20"
                                                        >
                                                            Applied ✅
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleConnect(c.id);
                                                            }}
                                                            className="px-6 py-2.5 bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all text-xs font-black rounded-xl"
                                                        >
                                                            Connect
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <MapPin size={14} /> <span className="text-xs font-bold text-gray-300">{c.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <DollarSign size={14} /> <span className="text-xs font-bold text-gray-300">{c.equityExpectation} Equity</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock size={14} /> <span className="text-xs font-bold text-gray-300">{c.commitmentType}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Award size={14} /> <span className="text-xs font-bold text-gray-300">{comp.label}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {c.skills.map((s, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-gray-400 group-hover:border-[#8B5CF6]/30 transition-all">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Profile Modal */}
            {isModalOpen && selectedCandidate && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center md:p-4 bg-[#0F0F14]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#1E1E2F] border border-white/10 md:rounded-[32px] w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-white/5 border border-white/5 rounded-full text-gray-400 hover:text-white transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-6 md:p-10">
                            <div className="flex flex-col md:flex-row gap-8 mb-10">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-gradient-to-tr from-[#8B5CF6] to-indigo-600 p-1 flex-shrink-0 shadow-2xl mx-auto md:mx-0">
                                    <div className="w-full h-full bg-[#1E1E2F] rounded-[30px] md:rounded-[38px] flex items-center justify-center font-black text-4xl md:text-5xl text-white">
                                        {selectedCandidate.name[0]}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <h2 className="text-3xl md:text-4xl font-black text-white">{selectedCandidate.name}</h2>
                                        {selectedCandidate.verifiedStatus && <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded border border-green-500/20">Verified Hero</div>}
                                    </div>
                                    <p className="text-lg md:text-xl text-[#8B5CF6] font-bold">{selectedCandidate.primarySkill}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                            <MapPin size={14} className="text-gray-500" />
                                            <span className="text-xs font-bold text-gray-300">{selectedCandidate.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                            <DollarSign size={14} className="text-gray-500" />
                                            <span className="text-xs font-bold text-gray-300">{selectedCandidate.equityExpectation} Equity</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                            <Clock size={14} className="text-gray-500" />
                                            <span className="text-xs font-bold text-gray-300">{selectedCandidate.commitmentType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="col-span-2 space-y-8">
                                    <div>
                                        <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">About Candidate</h4>
                                        <p className="text-gray-400 leading-relaxed font-medium">{selectedCandidate.shortBio}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Core Competencies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.skills.map((s, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-purple-500/5 border border-purple-500/10 rounded-xl text-sm font-bold text-purple-400">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Execution History</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                                                <Building2 size={20} className="text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-white font-bold">{selectedCandidate.experienceTitle}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{selectedCandidate.previousExperience}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-3xl text-center space-y-3">
                                        <Activity size={32} className="text-[#8B5CF6] mx-auto" />
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Compatibility</p>
                                            <p className="text-3xl font-black text-white">{calculateScore(selectedCandidate.primarySkill).score}%</p>
                                        </div>
                                        <p className="text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 py-1 rounded-full px-3">{calculateScore(selectedCandidate.primarySkill).label}</p>
                                    </div>

                                    {candidates.find(cand => cand.id === selectedCandidate.id)?.connectionStatus === 'none' ? (
                                        <button
                                            onClick={() => handleConnect(selectedCandidate.id)}
                                            className="w-full py-4 bg-[#8B5CF6] text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-1"
                                        >
                                            Send Connection Request
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full py-4 bg-gray-800 text-gray-500 font-black rounded-2xl border border-white/5 cursor-not-allowed"
                                        >
                                            {candidates.find(cand => cand.id === selectedCandidate.id)?.connectionStatus === 'pending' ? 'Request Already Sent' : 'Already Connected'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => toggleSave(selectedCandidate.id)}
                                        className={`w-full py-4 font-black rounded-2xl border transition-all flex items-center justify-center gap-2 ${savedCandidates.includes(selectedCandidate.id) ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        <Bookmark size={16} fill={savedCandidates.includes(selectedCandidate.id) ? "currentColor" : "none"} />
                                        {savedCandidates.includes(selectedCandidate.id) ? 'Saved to Bookmarks' : 'Save for Later'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindCoFounder;
