import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserX, Users, DollarSign, Building } from 'lucide-react';

const WhyYEN = () => {
    const navigate = useNavigate();

    const problems = [
        {
            id: 1,
            title: 'No Real Startup System',
            description: 'Founders use WhatsApp, Google Forms, and Excel to run startups. Nothing is connected or tracked.',
            icon: AlertCircle
        },
        {
            id: 2,
            title: 'Founders Have No Proof',
            description: 'Young founders lack verified profiles, traction data, and credibility.',
            icon: UserX
        },
        {
            id: 3,
            title: 'Mentorship Is Random',
            description: 'Students struggle to find real mentors who can guide them professionally.',
            icon: Users
        },
        {
            id: 4,
            title: 'Capital Is Inaccessible',
            description: 'Without networks, students can\'t reach investors even with great ideas.',
            icon: DollarSign
        },
        {
            id: 5,
            title: 'Incubators Are Disconnected',
            description: 'Colleges and incubators run programs using PDFs instead of real startup platforms.',
            icon: Building
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Why YEN Exists
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        The startup ecosystem is broken for young founders — YEN is built to fix it.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-5 gap-6 mb-12">
                    {problems.map((problem) => (
                        <div
                            key={problem.id}
                            className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-64"
                        >
                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {problem.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {problem.description}
                                </p>
                            </div>

                            {/* Icon at bottom */}
                            <div className="mt-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <problem.icon className="w-5 h-5 text-gray-700" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/portal-select/signup')}
                        className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-semibold"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => navigate('/about')}
                        className="px-8 py-3 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-semibold border border-gray-300"
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhyYEN;
