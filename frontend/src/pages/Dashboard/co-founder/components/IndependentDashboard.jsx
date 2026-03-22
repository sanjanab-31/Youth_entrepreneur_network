import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    Search,
    Link,
    Plus,
    ArrowUpRight,
    SearchCheck,
    MailCheck,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useStartup } from '../../../../context/StartupContext';
import { useNavigate } from 'react-router-dom';

const IndependentDashboard = () => {
    const { user } = useAuth();
    const { acceptInvitation } = useStartup();
    const navigate = useNavigate();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleAcceptInvite = () => {
        setError('');
        if (!inviteCode) return;

        const ok = acceptInvitation(inviteCode);
        if (ok) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/cofounder'); // Force reload/sync state
            }, 1500);
        } else {
            setError('Invalid Code or Email. Please check with the Founder.');
        }
    };

    const handleExplore = () => {
        navigate('/cofounder/discover-startups');
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px] mb-8"
            >
                <div className="w-full h-full rounded-3xl bg-[#0F0F14] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Rocket size={40} className="text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                No Startup Joined Yet
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-12 font-medium">
                You are not currently part of any startup workspace. Join a venture to start building.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <button
                    onClick={handleExplore}
                    className="flex-1 px-8 py-4 bg-white text-black text-sm font-black rounded-2xl shadow-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    <Search size={18} /> Explore Startups
                </button>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex-1 px-8 py-4 bg-purple-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:bg-purple-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    <Link size={18} /> Accept Invitation
                </button>
            </div>

            <button
                onClick={() => navigate('/auth/signup?role=founder')} // Or internal logic to promote
                className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
                <Plus size={14} /> Create Startup instead
            </button>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !success && setShowInviteModal(false)} />
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-[#1E1E2F] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-2xl"
                    >
                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">Welcome Aboard!</h3>
                                <p className="text-gray-400 font-medium">Invitation accepted. Joining workspace...</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-white mb-2">Accept Invitation</h3>
                                <p className="text-gray-400 text-sm mb-8">Enter your unique invite code or the email address of the founder who invited you.</p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            value={inviteCode}
                                            onChange={(e) => setInviteCode(e.target.value)}
                                            placeholder="Code or Founder Email"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-colors"
                                        />
                                        <SearchCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    </div>

                                    {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

                                    <button
                                        onClick={handleAcceptInvite}
                                        className="w-full py-4 bg-white text-black text-sm font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        Validate & Join <ArrowUpRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => setShowInviteModal(false)}
                                        className="w-full py-4 text-gray-500 text-xs font-bold hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default IndependentDashboard;
