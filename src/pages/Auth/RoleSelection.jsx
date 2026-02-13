import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Building2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

const FlipCard = ({ title, description, icon: Icon, onClick, index, color = "purple" }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative w-full aspect-square cursor-pointer perspective-1000 group"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={onClick}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-[#1E1E2F]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-end group-hover:border-purple-500/30 transition-colors">
                    <h3 className="text-2xl font-black text-white leading-tight">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h3>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-900/40 to-[#1E1E2F] backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-purple-500/10"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <Icon size={20} className="text-purple-400" />
                        </div>
                        <p className="text-gray-200 text-sm font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-white text-xs font-bold tracking-tight uppercase">Portal</span>
                        <ArrowRight className="text-purple-400" size={18} />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'founder',
            title: 'Startup Founder',
            description: 'Execute your vision with structured paths and verified metrics. Find co-founders and incubation support.',
            icon: User
        },
        {
            id: 'co-founder',
            title: 'Technical Co-Founder',
            description: 'Join high-potential startups. Manage technical debt, collaboration, and milestone execution.',
            icon: Zap
        },
        {
            id: 'mentor',
            title: 'Expert Mentor',
            description: 'Guide the next generation of innovators with operational insights and structured feedback tools.',
            icon: Briefcase
        },
        {
            id: 'incubator',
            title: 'Venture Partner',
            description: 'Discover verified startups, manage institutional deal flow, and track portfolio performance.',
            icon: Building2
        },
        {
            id: 'admin',
            title: 'Platform Admin',
            description: 'Internal governance and management portal for the Vanguard ecosystem control center.',
            icon: ShieldCheck
        }
    ];

    return (
        <AuthLayout>
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>

            <div className="w-full h-full max-w-7xl px-6 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                        Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic">Command</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
                    {roles.map((role, idx) => (
                        <FlipCard
                            key={role.id}
                            index={idx}
                            title={role.title}
                            description={role.description}
                            icon={role.icon}
                            onClick={() => navigate(`/auth/login?role=${role.id}`)}
                        />
                    ))}
                </div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => navigate('/')}
                    className="mt-8 text-gray-500 hover:text-white font-bold transition-all text-sm uppercase tracking-[0.2em] flex items-center gap-3 group"
                >
                    <div className="w-8 h-[1px] bg-gray-500 group-hover:bg-white group-hover:w-12 transition-all" />
                    Abort to Home
                </motion.button>
            </div>
        </AuthLayout>
    );
};

export default RoleSelection;
