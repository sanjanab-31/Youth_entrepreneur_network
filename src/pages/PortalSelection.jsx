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
            color: 'text-gray-700',
            bg: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-200',
            description: 'For entrepreneurs and students building startups'
        },
        {
            id: 'mentor',
            title: 'Mentor',
            icon: Briefcase,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-200',
            description: 'For experienced professionals guiding entrepreneurs'
        },
        {
            id: 'investor',
            title: 'Investor',
            icon: TrendingUp,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-200',
            description: 'For investors seeking promising startups'
        },
        {
            id: 'incubator',
            title: 'Incubator / College',
            icon: Building2,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-200',
            description: 'For institutions supporting entrepreneurship'
        },
        {
            id: 'admin',
            title: 'Admin',
            icon: ShieldCheck,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-200',
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-6xl w-full">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Home</span>
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        {/* <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center"> */}
                            {/* <span className="text-white font-bold text-2xl">Y</span> */}
                        {/* </div> */}
                        {/* <span className="text-3xl font-bold text-gray-900">YEN</span> */}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {isSignup ? 'Create Your Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-xl text-gray-600">
                        Select your portal to {isSignup ? 'get started' : 'continue'}
                    </p>
                </div>

                {/* Portal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPortals.map((portal) => (
                        <button
                            key={portal.id}
                            onClick={() => handlePortalSelect(portal.id)}
                            className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center group border-2 border-transparent hover:border-black ${portal.hoverBg}`}
                        >
                            <div className={`p-5 rounded-2xl ${portal.bg} mb-4 group-hover:scale-110 transition-transform`}>
                                <portal.icon className={`w-10 h-10 ${portal.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{portal.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{portal.description}</p>
                            <div className="mt-auto">
                                <span className="text-gray-900 font-semibold group-hover:underline">
                                    {isSignup ? 'Create Account' : 'Login'} →
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Text */}
                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        {isSignup ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/portal-select/login')}
                                    className="text-gray-900 font-semibold hover:underline"
                                >
                                    Login here
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/portal-select/signup')}
                                    className="text-gray-900 font-semibold hover:underline"
                                >
                                    Sign up here
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortalSelection;
