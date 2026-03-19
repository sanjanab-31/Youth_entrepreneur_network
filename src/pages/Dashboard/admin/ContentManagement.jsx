
import React, { useEffect, useMemo, useState } from 'react';
import {
    Megaphone,
    Star,
    Calendar,
    Plus,
    Search,
    Edit3,
    Trash2,
    Bell,
    Send
} from 'lucide-react';
import { getSystem, saveSystem } from '../../../utils/system';

const ContentManagement = () => {
    const [systemData, setSystemData] = useState(() => getSystem());
    const [searchQuery, setSearchQuery] = useState('');
    const [target, setTarget] = useState('All Users');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const refresh = () => setSystemData(getSystem());
        window.addEventListener('storage', refresh);
        return () => window.removeEventListener('storage', refresh);
    }, []);

    const announcements = useMemo(() => {
        return (systemData.announcements || [])
            .map((item, index) => ({
                id: item.id || `announcement-${index}`,
                title: item.title || 'Untitled Announcement',
                type: item.type || 'Announcement',
                target: item.target || 'All',
                date: item.date || item.createdAt || new Date().toISOString(),
                status: item.status || 'Draft',
                body: item.body || '',
            }))
            .filter((item) => {
                const q = searchQuery.toLowerCase();
                return !q ||
                    item.title.toLowerCase().includes(q) ||
                    item.type.toLowerCase().includes(q) ||
                    item.target.toLowerCase().includes(q);
            });
    }, [searchQuery, systemData]);

    const formatDate = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const createAnnouncement = () => {
        if (!message.trim()) return;
        const sys = getSystem();
        const next = {
            id: null,
            title: message.trim().slice(0, 60),
            type: 'System',
            target,
            body: message.trim(),
            status: 'Published',
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
        sys.announcements = [next, ...(sys.announcements || [])];
        saveSystem(sys);
        setMessage('');
        setSystemData(getSystem());
    };

    const updateAnnouncement = (id, updater) => {
        const sys = getSystem();
        sys.announcements = (sys.announcements || []).map((item, index) => {
            const itemId = item.id || `announcement-${index}`;
            return itemId === id ? updater(item) : item;
        });
        saveSystem(sys);
        setSystemData(getSystem());
    };

    const deleteAnnouncement = (id) => {
        const sys = getSystem();
        sys.announcements = (sys.announcements || []).filter((item, index) => {
            const itemId = item.id || `announcement-${index}`;
            return itemId !== id;
        });
        saveSystem(sys);
        setSystemData(getSystem());
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
                    <p className="text-gray-400">Control announcements, featured entities and platform communication</p>
                </div>
                <button className="px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2">
                    <Plus size={18} /> New Broadcast
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Broadcast List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1E1E2F] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Live Content</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-black/20 border border-white/5 rounded-lg py-1.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#8B5CF6]/50"
                                />
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-white/5">
                                {announcements.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No announcements yet</td>
                                    </tr>
                                )}
                                {announcements.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/2 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                                                    <Megaphone size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{item.title}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-black">{item.type} • {item.target}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">{formatDate(item.date)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${item.status === 'Published' ? 'bg-green-500 text-white shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                                                    item.status === 'Scheduled' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-500'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => updateAnnouncement(item.id, (a) => ({
                                                        ...a,
                                                        status: a.status === 'Published' ? 'Draft' : 'Published'
                                                    }))}
                                                    className="p-2 text-gray-400 hover:text-white transition-all"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => deleteAnnouncement(item.id)} className="p-2 text-red-400 hover:text-red-300 transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/20 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                                    <Star size={24} />
                                </div>
                                <h4 className="font-bold text-white">Feature Startup</h4>
                            </div>
                            <p className="text-sm text-gray-500">Promote high-quality startups on the landing page spotlight.</p>
                        </div>
                        <div className="bg-[#1E1E2F] p-6 rounded-2xl border border-white/5 hover:border-[#8B5CF6]/20 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                                    <Calendar size={24} />
                                </div>
                                <h4 className="font-bold text-white">Deadlines</h4>
                            </div>
                            <p className="text-sm text-gray-500">Publish or update application deadlines for active cohorts.</p>
                        </div>
                    </div>
                </div>

                {/* Quick Broadcast Widget */}
                <div className="space-y-6">
                    <div className="bg-[#1E1E2F] p-8 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6 font-bold text-white">
                            <Bell size={20} className="text-[#8B5CF6]" />
                            Direct Broadcast
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-1 block">Recipient Group</label>
                                <select
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50"
                                >
                                    <option>All Users</option>
                                    <option>Founders Only</option>
                                    <option>Mentors Only</option>
                                    <option>Incubators Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-1 block">Message Content</label>
                                <textarea
                                    rows="4"
                                    placeholder="Enter system announcement..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 resize-none"
                                />
                            </div>
                            <button onClick={createAnnouncement} className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                <Send size={16} /> Publish Now
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-transparent p-6 border-l-2 border-[#8B5CF6] rounded-r-2xl">
                        <p className="text-xs text-gray-400 italic leading-relaxed">
                            Announcements are automatically sent as push notifications and emails based on user preference settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
