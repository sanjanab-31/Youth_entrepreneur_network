import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, TrendingUp, Lightbulb, AlertCircle, UserX, DollarSign, Building, Rocket, Target, Settings, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Landing = () => {
    const navigate = useNavigate();

    // Hero Section Logic
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const heroFeatures = [
        { icon: Users, text: 'Connect with Mentors' },
        { icon: TrendingUp, text: 'Find Investors' },
        { icon: Lightbulb, text: 'Grow Your Startup' },
    ];

    // Why YEN Section Logic
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

    // Benefits Section Logic
    const benefits = [
        {
            id: 1,
            left: {
                title: 'Founder Growth',
                description: 'YEN gives young founders a structured startup journey with profiles, mentors, funding access, and incubator programs — all in one place instead of scattered tools.',
                icon: Rocket
            },
            right: {
                text: 'We are here to Elevate Startup Success'
            }
        },
        {
            id: 2,
            left: {
                title: 'Investor Visibility',
                description: 'Startups on YEN gain professional credibility through verified profiles, traction data, and pitch decks that investors can trust and evaluate.',
                icon: Globe
            },
            right: {
                text: 'We are here to Elevate Startup Discovery'
            }
        },
        {
            id: 3,
            left: {
                title: 'Mentor Access',
                description: 'Founders connect with real industry mentors instead of random advice, ensuring the right guidance at every stage of their startup journey.',
                icon: Users
            },
            right: {
                text: 'We are here to Elevate Founder Guidance'
            }
        },
        {
            id: 4,
            left: {
                title: 'Incubator Efficiency',
                description: 'Colleges and incubators can manage cohorts, demo days, progress tracking, and startup data in one digital system instead of Excel and PDFs.',
                icon: Settings
            },
            right: {
                text: 'We are here to Elevate Incubator Operations'
            }
        }
    ];

    return (
        <div className="min-h-screen">
            <Header />

            {/* HERO SECTION */}
            <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">Youth Entrepreneur Network</span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Empower Your
                                <span className="block text-gray-900">
                                    Entrepreneurial Journey
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                Connect with mentors, investors, and fellow entrepreneurs.
                                Build your network, access resources, and transform your innovative ideas into successful ventures.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {heroFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                                        <feature.icon className="w-5 h-5 text-gray-700" />
                                        <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button
                                    onClick={() => navigate('/portal-select/signup')}
                                    className="group px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/portal-select/login')}
                                    className="px-8 py-4 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-semibold border border-gray-200"
                                >
                                    Login
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Animated Images */}
                        <div className={`relative h-[600px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            {/* Animated Image Columns */}
                            <div className="flex gap-4 h-full">
                                {/* Column 1 - Moves Up */}
                                <div className="flex-1 space-y-4 animate-scroll-up">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src="/src/assets/hero-1.jpg"
                                            alt="Entrepreneur working"
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src="/src/assets/hero-2.jpg"
                                            alt="Team collaboration"
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src="/src/assets/hero-1.jpg"
                                            alt="Entrepreneur working"
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Column 2 - Moves Down */}
                                <div className="flex-1 space-y-4 animate-scroll-down">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src="/src/assets/hero-3.jpg"
                                            alt="Startup meeting"
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src="/src/assets/hero-4.jpg"
                                            alt="Innovation and tech"
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src="/src/assets/hero-3.jpg"
                                            alt="Startup meeting"
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom CSS for animations */}
                <style jsx>{`
                    @keyframes scrollUp {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-33.33%); }
                    }
                    @keyframes scrollDown {
                        0% { transform: translateY(-33.33%); }
                        100% { transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-scroll-up { animation: scrollUp 20s linear infinite; }
                    .animate-scroll-down { animation: scrollDown 20s linear infinite; }
                    .animate-float { animation: float 3s ease-in-out infinite; }
                    .animate-float-delayed { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
                `}</style>
            </section>

            {/* WHY YEN SECTION */}
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

            {/* BENEFITS SECTION */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-full mb-6">
                            <Target className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-500">Unlocking Value</span>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">
                            Our Benefits
                        </h2>
                        <p className="text-lg text-gray-600">
                            How YEN transforms students into real founders
                        </p>
                    </div>

                    {/* Benefit Rows */}
                    <div className="space-y-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.id} className="grid grid-cols-2 gap-8">
                                {/* Left Card */}
                                <div className="bg-white rounded-[2rem] p-10 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-6">
                                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                                            <benefit.left.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl text-gray-500 font-medium mb-4">{benefit.left.title}</h3>
                                        <p className="text-xl text-gray-900 leading-relaxed font-medium">
                                            {benefit.left.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Card */}
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-[2rem] p-10 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <h3 className="text-3xl font-bold text-gray-900 text-center max-w-lg relative z-10">
                                        {benefit.right.text}
                                    </h3>

                                    {/* Subtle hover effect overlay */}
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
