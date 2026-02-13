
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

const RoleCard = ({ title, description, icon: Icon, onClick, accentColor = "purple", index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={onClick}
            className="group relative bg-[#1E1E2F]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-[#1E1E2F]/60 transition-all duration-500 cursor-pointer hover:border-purple-500/50 flex flex-col items-start text-left h-full shadow-lg hover:shadow-purple-500/10"
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:border-${accentColor}-500/50 group-hover:bg-${accentColor}-500/10 transition-all duration-500`}>
                <Icon className={`w-7 h-7 text-gray-400 group-hover:text-${accentColor}-400 transition-colors duration-500`} />
            </div>

            <div className="relative z-10 flex flex-col h-full w-full">
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-300 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed mb-8 flex-grow">
                    {description}
                </p>

                <div className="flex items-center justify-between w-full pt-6 border-t border-white/5 mt-auto">
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">
                        Select Role
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600 transition-all duration-500 group-hover:rotate-[-45deg]">
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/auth/login?role=${role}`);
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <CheckCircle2 size={14} />
                        Identity Verification
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6"
                    >
                        Who are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">building</span> for?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-450 text-xl max-w-2xl mx-auto font-medium"
                    >
                        Step into the Vanguard ecosystem with a specialized interface tailored to your professional objectives.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
                    <RoleCard
                        index={0}
                        title="Founder"
                        description="Scale your vision with structured execution paths. Connect with co-founders and secure incubation."
                        icon={User}
                        onClick={() => handleRoleSelect('founder')}
                        accentColor="purple"
                    />

                    <RoleCard
                        index={1}
                        title="Mentor"
                        description="Professional guidance for high-growth startups. Share expertise through a structured tracking system."
                        icon={Briefcase}
                        onClick={() => handleRoleSelect('mentor')}
                        accentColor="purple"
                    />

                    <RoleCard
                        index={2}
                        title="Incubator"
                        description="Optimize portfolio management and institutional deal flow with verified performance metrics."
                        icon={Building2}
                        onClick={() => handleRoleSelect('incubator')}
                        accentColor="purple"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center border-t border-white/5 pt-12"
                >
                    <p className="text-gray-500 text-sm mb-6 font-medium">Internal Administration Access</p>
                    <button
                        onClick={() => handleRoleSelect('admin')}
                        className="group flex items-center px-8 py-3 rounded-2xl bg-[#1E1E2F] border border-white/5 text-gray-400 hover:text-white hover:border-purple-500/30 transition-all duration-300 shadow-xl"
                    >
                        <ShieldCheck className="w-5 h-5 mr-3 group-hover:text-purple-400 transition-colors" />
                        <span className="font-bold tracking-tight">Access Control Portal</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-8 text-gray-600 hover:text-gray-400 text-sm font-bold transition-colors"
                    >
                        Back to Landing
                    </button>
                </motion.div>
            </div>
        </AuthLayout>
    );
};

export default RoleSelection;
