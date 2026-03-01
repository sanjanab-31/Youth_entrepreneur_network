
import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Send,
    MessageSquare,
    Users,
    Briefcase,
    Building,
    ChevronLeft,
    Clock,
    User,
    Shield,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useStartup } from '../../../context/StartupContext';
import { useMentor } from '../../../context/MentorContext';

const Messages = () => {
    const { user } = useAuth();
    const isMentor = user.role === 'mentor';
    const startupCtx = useStartup();
    const mentorCtx = useMentor();

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const scrollRef = useRef(null);

    // Dynamic Data Source
    const startup = startupCtx.startup; // For Founder/Co-Founder
    const mentees = mentorCtx.mentees || []; // For Mentor
    const allMessages = isMentor
        ? (mentorCtx.allStartups?.find(s => s.startupId === selectedChatId)?.messages || [])
        : (startup?.messages || []);

    // Layout Logic
    // Founder/Co-Founder sees: "Team" and "Assigned Mentor"
    // Mentor sees: List of assigned startups
    const chats = isMentor
        ? mentees.map(m => ({
            id: m.startupId,
            name: m.startupName,
            sub: 'Startup Mentee',
            type: 'startup',
            initial: m.startupName[0]
        }))
        : [
            { id: 'team', name: 'Team Chat', sub: 'Founders & Co-Founders', type: 'team', initial: 'T' },
            { id: 'mentor', name: 'Mentorship Chat', sub: startup?.mentorAssigned ? 'Assigned Mentor' : 'No Mentor Assigned', type: 'mentor', initial: 'M' }
        ];

    const filteredMessages = isMentor
        ? allMessages.filter(m => m.channel === 'mentor')
        : allMessages.filter(m => m.channel === selectedChatId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [filteredMessages, selectedChatId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedChatId) return;

        if (isMentor) {
            mentorCtx.sendMessage(selectedChatId, messageText);
        } else {
            startupCtx.sendMessage(messageText, selectedChatId);
        }
        setMessageText('');
    };

    const StatusBadge = ({ role }) => {
        const styles = {
            mentor: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
            founder: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            'co-founder': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            cofounder: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${styles[role] || 'bg-gray-500/10 text-gray-500'}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Relational <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Messages</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">
                        {isMentor ? "Strategic guidance for your assigned ventures." : "Coordinate with your team and mentor."}
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-[#1E1E2F] rounded-[2.5rem] border border-white/5 overflow-hidden flex shadow-2xl relative">
                {/* Sidebar */}
                <aside className={`w-full md:w-80 border-r border-white/5 flex flex-col bg-[#15151e]/50 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-white/5">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#8B5CF6] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search channels..."
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder-gray-700 focus:outline-none focus:border-[#8B5CF6]/30 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                disabled={chat.id === 'mentor' && !startup?.mentorAssigned && !isMentor}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group border ${selectedChatId === chat.id
                                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20'
                                    : 'hover:bg-white/5 border-transparent opacity-80 hover:opacity-100'
                                    } ${chat.id === 'mentor' && !startup?.mentorAssigned && !isMentor ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg border border-white/10 transition-transform group-hover:scale-110 ${selectedChatId === chat.id ? 'bg-[#8B5CF6]' : 'bg-white/5'
                                    }`}>
                                    {chat.initial}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <h4 className="font-bold text-white truncate text-sm">{chat.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{chat.sub}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Chat */}
                <main className={`flex-1 flex flex-col bg-[#0F0F14]/20 ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                    {!selectedChatId ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 bg-[#8B5CF6]/10 rounded-[2rem] flex items-center justify-center text-[#8B5CF6] mb-8 shadow-inner border border-[#8B5CF6]/20">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Select a Conversation</h3>
                            <p className="text-gray-500 max-w-xs font-medium italic">Communicate securely with your restricted relational network.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E2F]/40 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedChatId(null)}
                                        className="md:hidden p-2 bg-white/5 rounded-xl text-gray-400"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center font-black text-[#8B5CF6]">
                                        {chats.find(c => c.id === selectedChatId)?.initial}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{chats.find(c => c.id === selectedChatId)?.name}</h3>
                                        <p className="text-[10px] text-[#8B5CF6] font-bold uppercase tracking-[0.2em] italic">Relational Channel</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 uppercase text-[9px] font-black text-gray-500 tracking-widest">
                                        <Shield size={12} /> Encrypted
                                    </div>
                                </div>
                            </header>

                            {/* Messages Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
                            >
                                {filteredMessages.length > 0 ? (
                                    filteredSessionsGroup(filteredMessages).map((group, idx) => (
                                        <div key={idx} className="space-y-6">
                                            <div className="flex justify-center">
                                                <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                                                    {new Date(group.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            {group.messages.map((m) => {
                                                const isMine = m.senderId === user.uid;
                                                return (
                                                    <div
                                                        key={m.id}
                                                        className={`flex gap-4 max-w-[85%] lg:max-w-xl ${isMine ? 'self-end flex-row-reverse text-right ml-auto' : ''}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg ${isMine ? 'bg-[#8B5CF6]' : 'bg-white/10'
                                                            }`}>
                                                            {m.senderName[0]}
                                                        </div>
                                                        <div className={`space-y-1.5 ${isMine ? 'items-end' : ''}`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {!isMine && <span className="text-[10px] font-black text-white">{m.senderName}</span>}
                                                                <StatusBadge role={m.senderRole} />
                                                            </div>
                                                            <div className={`p-4 rounded-2xl font-medium text-sm leading-relaxed shadow-xl border ${isMine
                                                                ? 'bg-[#8B5CF6] text-white rounded-tr-none border-[#8B5CF6]/20'
                                                                : 'bg-[#1E1E2F] text-gray-200 rounded-tl-none border-white/5'
                                                                }`}>
                                                                {m.text}
                                                            </div>
                                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                                                <Clock size={10} /> {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                        <MessageSquare size={48} className="mb-4 text-gray-600" />
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">No messages yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="p-8">
                                <div className="bg-[#0F0F14] border border-white/10 rounded-[1.5rem] p-3 flex items-center gap-4 shadow-2xl focus-within:border-[#8B5CF6]/50 transition-all">
                                    <input
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        placeholder="Type your strategic message..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm font-medium px-4 py-2 placeholder:text-gray-800"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="w-12 h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-30 disabled:hover:bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white transition-all shadow-xl shadow-[#8B5CF6]/20"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

// Helper for date grouping
const filteredSessionsGroup = (messages) => {
    const groups = [];
    messages.forEach(m => {
        const date = m.timestamp.split('T')[0];
        let group = groups.find(g => g.date === date);
        if (!group) {
            group = { date, messages: [] };
            groups.push(group);
        }
        group.messages.push(m);
    });
    return groups;
};

export default Messages;
