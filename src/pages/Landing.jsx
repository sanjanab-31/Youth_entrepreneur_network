import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, TrendingUp, Building2, ShieldCheck } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const roles = [
        { id: 'student', title: 'Founder / Student', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'mentor', title: 'Mentor', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'investor', title: 'Investor', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'incubator', title: 'Incubator / College', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'admin', title: 'Admin', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' }
    ];

    const handleAction = (roleId, action) => {
        navigate(`/${action}/${roleId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Youth Entrepreneur Network
                </h1>
                <p className="text-xl text-gray-600">
                    Connect, Innovate, and Grow. Choose your role to get started.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl w-full">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group border border-gray-100"
                    >
                        <div className={`p-4 rounded-full ${role.bg} mb-4 group-hover:scale-110 transition-transform`}>
                            <role.icon className={`w-8 h-8 ${role.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">{role.title}</h3>

                        <div className="w-full space-y-3 mt-auto">
                            <button
                                onClick={() => handleAction(role.id, 'login')}
                                className="w-full py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-colors"
                            >
                                Login
                            </button>
                            {role.id !== 'admin' && (
                                <button
                                    onClick={() => handleAction(role.id, 'signup')}
                                    className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-sm transition-all hover:shadow-md"
                                >
                                    Create Account
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
