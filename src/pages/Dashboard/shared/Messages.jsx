
import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Send,
    MessageSquare,
    Users,
    Shield,
    Clock,
    ChevronLeft,
    Building2,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useMessaging } from '../../../context/MessagingContext';

const Messages = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { conversations, messages, sendMessage, markAsRead, getConversationMessages, loading } = useMessaging();
    const [selectedConvo, setSelectedConvo] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef(null);

    // Auto-select chat from navigation state
    useEffect(() => {
        if (!loading && location.state?.openChat) {
            const { startupId, type, participantId } = location.state.openChat;
            const convo = conversations.find(c =>
                c.startupId === startupId
                && c.type === type
                && (!participantId || c.participantId === participantId)
            );
            if (convo) setSelectedConvo(convo);
        }
    }, [loading, location.state, conversations]);

    // Auto-scroll on new messages or selection change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, selectedConvo]);

    // Update unread status when a conversation is focused
    useEffect(() => {
        if (selectedConvo) {
            markAsRead(selectedConvo);
        }
    }, [selectedConvo, markAsRead]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedConvo) return;

        sendMessage({
            startupId: selectedConvo.startupId,
            conversationType: selectedConvo.type,
            receiverId: selectedConvo.participantId || selectedConvo.id,
            message: messageText
        });
        setMessageText('');
    };

    const filteredConvos = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Role-based filtering: mentors should only see mentor (and direct) conversations
    const roleFilteredConvos = user.role === 'mentor'
        ? filteredConvos.filter(c => c.type === 'mentor' || c.type === 'direct')
        : filteredConvos;

    const activeMessages = selectedConvo
        ? getConversationMessages(selectedConvo)
        : [];

    const StatusBadge = ({ role }) => {
        const styles = {
            mentor: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
            founder: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            incubator: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'co-founder': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            cofounder: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
        };
        return (
            <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest border ${styles[role] || 'bg-gray-500/10 text-gray-500'}`}>
                {role}
            </span>
        );
    };

    if (loading) return null;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Vanguard <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Comms</span>
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic text-sm">
                        Centralized, relational messaging layer.
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-[#1E1E2F] rounded-[2.5rem] border border-white/5 overflow-hidden flex shadow-2xl relative">
                {/* Sidebar - Conversation List */}
                <aside className={`w-full md:w-80 border-r border-white/5 flex flex-col bg-[#15151e]/50 ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-white/5">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#8B5CF6] transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-[#8B5CF6]/30 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {roleFilteredConvos.map((convo) => (
                            <button
                                key={`${convo.id}_${convo.type}_${convo.participantId || 'none'}`}
                                onClick={() => setSelectedConvo(convo)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group border ${selectedConvo?.id === convo.id && selectedConvo?.type === convo.type && selectedConvo?.participantId === convo.participantId
                                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 shadow-lg'
                                    : 'hover:bg-white/5 border-transparent opacity-80 hover:opacity-100'
                                    }`}
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-white shadow-lg border border-white/10 transition-transform group-hover:scale-110 ${selectedConvo?.id === convo.id && selectedConvo?.type === convo.type && selectedConvo?.participantId === convo.participantId ? 'bg-[#8B5CF6]' : 'bg-white/5'
                                    }`}>
                                    {convo.name[0]}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-white truncate text-sm">{convo.name}</h4>
                                        {convo.unreadCount > 0 && (
                                            <span className="bg-[#8B5CF6] text-white text-[9px] font-black px-1.5 rounded-full h-5 min-w-5 flex items-center justify-center shadow-lg animate-pulse-slow">
                                                {convo.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-[#8B5CF6] font-bold uppercase tracking-widest truncate mt-0.5 italic">{convo.type} chat</p>
                                    <p className="text-[10px] text-gray-600 font-medium truncate mt-1">
                                        {convo.lastMessage ? convo.lastMessage.message : 'No messages yet'}
                                    </p>
                                </div>
                            </button>
                        ))}
                        {filteredConvos.length === 0 && (
                            <div className="text-center py-12 px-6">
                                <Building2 size={32} className="mx-auto text-gray-800 mb-4" />
                                <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No relational links found</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Chat Window */}
                <main className={`flex-1 flex flex-col bg-[#0F0F14]/20 ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
                    {!selectedConvo ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 bg-[#8B5CF6]/10 rounded-[2.5rem] flex items-center justify-center text-[#8B5CF6] mb-8 shadow-inner border border-[#8B5CF6]/20"
                            >
                                <MessageSquare size={40} />
                            </motion.div>
                            <h3 className="text-2xl font-black text-white mb-2">Select conversation</h3>
                            <p className="text-gray-500 max-w-xs font-medium italic text-sm">Synchronized comms across all role portals.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#1E1E2F]/40 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedConvo(null)}
                                        className="md:hidden p-2 bg-white/5 rounded-xl text-gray-400"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center font-black text-[#8B5CF6]">
                                        {selectedConvo.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{selectedConvo.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-[#8B5CF6] font-bold uppercase tracking-[0.2em] italic">
                                                {selectedConvo.type} channel
                                            </span>
                                            <Shield size={10} className="text-emerald-500/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden lg:flex items-center gap-4">
                                    <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 transition-all hover:bg-white/10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time active</span>
                                    </div>
                                </div>
                            </header>

                            {/* Message Thread */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
                            >
                                {activeMessages.length > 0 ? (
                                    groupMessagesByDate(activeMessages).map((group, idx) => (
                                        <div key={idx} className="space-y-8">
                                            <div className="flex justify-center">
                                                <span className="px-5 py-2 bg-white/5 rounded-full text-[9px] font-black text-gray-600 uppercase tracking-widest border border-white/5 backdrop-blur-sm">
                                                    {group.date}
                                                </span>
                                            </div>
                                            {group.messages.map((m) => {
                                                const isMine = m.senderId === user.uid;
                                                return (
                                                    <motion.div
                                                        initial={{ y: 10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        key={m.id}
                                                        className={`flex gap-4 max-w-[90%] lg:max-w-[70%] ${isMine ? 'self-end flex-row-reverse text-right ml-auto' : ''}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg border border-white/10 ${isMine ? 'bg-[#8B5CF6]' : 'bg-white/5'}`}>
                                                            {m.senderName[0]}
                                                        </div>
                                                        <div className={`space-y-2 flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                                            <div className="flex items-center gap-2">
                                                                {!isMine && <span className="text-[10px] font-black text-white/90">{m.senderName}</span>}
                                                                <StatusBadge role={m.senderRole} />
                                                            </div>
                                                            <div className={`p-4 rounded-2xl font-medium text-sm leading-relaxed shadow-xl border ${isMine
                                                                ? 'bg-[#8B5CF6] text-white rounded-tr-none border-[#8B5CF6]/20'
                                                                : 'bg-[#1E1E2F] text-gray-200 rounded-tl-none border-white/5'
                                                                }`}>
                                                                {m.message}
                                                            </div>
                                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5 mt-1 italic">
                                                                <Clock size={10} /> {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                        <MessageSquare size={48} className="mb-6 text-gray-600" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Initialize Relay Connection</p>
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSend} className="p-8">
                                <div className="bg-[#15151e] border border-white/5 rounded-[2rem] p-3 flex items-center gap-4 shadow-2xl focus-within:border-[#8B5CF6]/30 transition-all group">
                                    <input
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        placeholder="Type strategic message..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm font-medium px-5 py-3 placeholder:text-gray-800 placeholder:italic"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="w-14 h-14 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-20 disabled:hover:bg-[#8B5CF6] rounded-2xl flex items-center justify-center text-white transition-all shadow-xl shadow-[#8B5CF6]/20 group-hover:scale-105 active:scale-95"
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

// Messaging Helpers
const groupMessagesByDate = (messages) => {
    const groups = [];
    messages.forEach(m => {
        const dateObj = new Date(m.createdAt);
        const date = dateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
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
