import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Briefcase, TrendingUp, Building2, ShieldCheck, ArrowLeft } from 'lucide-react';

const PortalSelection = () => {
    const navigate = useNavigate();
    const { action } = useParams(); // 'login' or 'signup'

    const portals = [
        {
            id: 'student',
            title: 'Founder / Student',
            icon: User,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            hoverBg: 'hover:bg-emerald-100',
            description: 'For entrepreneurs and students building startups'
        },
        {
            id: 'mentor',
            title: 'Mentor',
            icon: Briefcase,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            hoverBg: 'hover:bg-emerald-100',
            description: 'For experienced professionals guiding entrepreneurs'
        },
        {
            id: 'investor',
            title: 'Investor',
            icon: TrendingUp,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            hoverBg: 'hover:bg-emerald-100',
            description: 'For investors seeking promising startups'
        },
        {
            id: 'incubator',
            title: 'Incubator / College',
            icon: Building2,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            hoverBg: 'hover:bg-emerald-100',
            description: 'For institutions supporting entrepreneurship'
        },
        {
            id: 'admin',
            title: 'Admin',
            icon: ShieldCheck,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            hoverBg: 'hover:bg-emerald-100',
            description: 'For platform administrators',
            loginOnly: true
        }
    ];

    const handlePortalSelect = (portalId) => {
        navigate(`/${action}/${portalId}`);
    };

    const isSignup = action === 'signup';
    const filteredPortals = isSignup ? portals.filter(p => !p.loginOnly) : portals;

    return (
        <div className="min-h-screen bg-[#fcfdfd] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl w-full relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-12 flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors font-semibold group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </button>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        {isSignup ? 'Create Your Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choosing the right portal ensures you get the tools and network {isSignup ? 'to build your legacy' : 'to scale your impact'}.
                    </p>
                </div>

                {/* Portal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredPortals.map((portal) => (
                        <button
                            key={portal.id}
                            onClick={() => handlePortalSelect(portal.id)}
                            className={`bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all duration-500 p-8 flex flex-col items-center text-center group border-2 border-transparent hover:border-emerald-500 transform hover:-translate-y-2`}
                        >
                            <div className={`p-6 rounded-2xl ${portal.bg} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <portal.icon className={`w-12 h-12 ${portal.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{portal.title}</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{portal.description}</p>
                            <div className="mt-auto">
                                <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-2">
                                    {isSignup ? 'Get Started' : 'Enter Portal'}
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Text */}
                <div className="text-center mt-20">
                    <div className="inline-block glass-effect px-8 py-4 rounded-full">
                        <p className="text-gray-600 font-medium">
                            {isSignup ? (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => navigate('/portal-select/login')}
                                        className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                                    >
                                        Login here
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => navigate('/portal-select/signup')}
                                        className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                                    >
                                        Sign up here
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PortalSelection;
