
import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Send,
    Paperclip,
    Users,
    MessageSquare,
    Briefcase,
    Building,
    Phone,
    Video,
    Info,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

const Messages = () => {
    const [activeTab, setActiveTab] = useState('team');
    const [selectedChat, setSelectedChat] = useState(null);

    const tabs = [
        { id: 'team', label: 'Team', icon: Users },
        { id: 'mentors', label: 'Mentors', icon: Briefcase },
        { id: 'incubators', label: 'Incubators', icon: Building }
    ];

    const chats = {
        team: [
            { id: 1, n: 'Siddharth Sharma', l: 'Can we check the ML latency?', t: '2:14 PM', u: 0, o: true, i: 'SS' },
            { id: 2, n: 'Priya Kapoor', l: 'Design assets are ready.', t: 'Yesterday', u: 2, o: true, i: 'PK' },
            { id: 3, n: 'Alex Mercer', l: 'Reviewing the PR now.', t: 'Yesterday', u: 0, o: false, i: 'AM' }
        ],
        mentors: [
            { id: 4, n: 'Anant Goenka', l: 'Good progress on the seed prep.', t: '3h ago', u: 1, o: false, i: 'AG' },
            { id: 5, n: 'Meera Iyer', l: 'Focus on retention metrics first.', t: '2 days ago', u: 0, o: false, i: 'MI' }
        ],
        incubators: [
            { id: 6, n: 'NSRCEL IIMB', l: 'Application status updated.', t: 'Mon', u: 1, o: false, i: 'II' }
        ]
    };

    return (
        <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
            {/* Page Header */}
            <div className={`mb-6 md:mb-8 px-2 md:px-0 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Messages</h1>
            </div>

            <div className="flex-1 bg-[#1E1E2F] md:rounded-3xl border border-white/5 overflow-hidden flex shadow-2xl">
                {/* Chat Sidebar */}
                <aside className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-white/5 flex-col`}>
                    {/* Tabs */}
                    <div className="flex p-2 gap-1 border-b border-white/5 bg-[#0F0F14]/30">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                    ${activeTab === tab.id ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'text-gray-600 hover:text-white'}`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="p-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#8B5CF6] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-[#0F0F14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-[#8B5CF6]/30 font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 p-2">
                        {chats[activeTab].map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group ${selectedChat?.id === chat.id ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/20' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-gray-500 border border-white/10 group-hover:border-white/20 transition-all">
                                        {chat.i}
                                    </div>
                                    {chat.o && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1E1E2F] rounded-full" />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className="font-bold text-gray-200 text-sm truncate">{chat.n}</p>
                                        <span className="text-[9px] font-black text-gray-600 uppercase whitespace-nowrap">{chat.t}</span>
                                    </div>
                                    <p className={`text-xs truncate ${chat.u > 0 ? 'text-white font-bold' : 'text-gray-500'}`}>{chat.l}</p>
                                </div>
                                {chat.u > 0 && (
                                    <div className="w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-[#8B5CF6]/20">
                                        {chat.u}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Chat Main Area */}
                <main className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#0F0F14]/20 backdrop-blur-sm h-full`}>
                    {!selectedChat ? (
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-[#8B5CF6]/10 rounded-3xl flex items-center justify-center text-[#8B5CF6] mb-6">
                                <MessageSquare size={40} />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Your Conversations</h3>
                            <p className="text-gray-500 max-w-xs font-medium">Select a chat to start collaborating with your team, mentors, or incubators.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <header className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#1E1E2F]/50">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                                    >
                                        <ChevronRight size={24} className="rotate-180" />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gray-400">
                                        {selectedChat.i}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{selectedChat.n}</h3>
                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-4">
                                    <button className="p-2 text-gray-600 hover:text-white transition-colors"><Phone size={18} md:size={20} /></button>
                                    <button className="p-2 text-gray-600 hover:text-white transition-colors"><Video size={18} md:size={20} /></button>
                                    <span className="hidden sm:block w-[1px] h-6 bg-white/5" />
                                    <button className="hidden sm:block text-gray-600 hover:text-white transition-colors"><Info size={18} md:size={20} /></button>
                                </div>
                            </header>

                            {/* Message Area */}
                            <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-8 flex flex-col justify-end">
                                <div className="flex justify-center">
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest border border-white/5">Today</span>
                                </div>

                                <div className="flex gap-4 max-w-[85%] md:max-w-lg">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                                        {selectedChat.i}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="bg-[#1E1E2F] p-4 rounded-2xl rounded-tl-none border border-white/5">
                                            <p className="text-sm text-gray-300 leading-relaxed font-medium">Hey, did we find a way to reduce the inference time for the edge models yet? The benchmark is still over 200ms.</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-600 uppercase pl-1">2:14 PM</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 max-w-[85%] md:max-w-lg self-end flex-row-reverse">
                                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">Y</div>
                                    <div className="space-y-2 text-right">
                                        <div className="bg-[#8B5CF6] p-4 rounded-2xl rounded-tr-none text-white shadow-xl shadow-[#8B5CF6]/10">
                                            <p className="text-sm leading-relaxed font-bold">Working on the Quantization strategy now. Expecting to cut it down to ~120ms by tomorrow's build.</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-[#8B5CF6] uppercase pr-1">2:45 PM • Read</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <footer className="p-4 md:p-6 md:pt-0">
                                <div className="bg-[#0F0F14] border border-white/10 rounded-2xl p-2 md:p-4 flex items-end gap-2 md:gap-4 shadow-2xl">
                                    <button className="p-2 text-gray-600 hover:text-blue-400 transition-colors"><Paperclip size={18} md:size={20} /></button>
                                    <textarea
                                        placeholder="Type your message..."
                                        rows="1"
                                        className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm placeholder-gray-700 py-2 resize-none"
                                    />
                                    <button className="w-10 h-10 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#8B5CF6]/20">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </footer>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Messages;
