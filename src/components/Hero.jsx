import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, TrendingUp, Lightbulb } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        { icon: Users, text: 'Connect with Mentors' },
        { icon: TrendingUp, text: 'Find Investors' },
        { icon: Lightbulb, text: 'Grow Your Startup' },
    ];

    return (
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
                            {features.map((feature, index) => (
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

                        {/* <div className="flex items-center space-x-8 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">10K+</div>
                                <div className="text-sm text-gray-600">Active Users</div>
                            </div>
                            <div className="w-px h-12 bg-gray-300"></div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">500+</div>
                                <div className="text-sm text-gray-600">Startups Funded</div>
                            </div>
                            <div className="w-px h-12 bg-gray-300"></div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">1000+</div>
                                <div className="text-sm text-gray-600">Mentors</div>
                            </div>
                        </div> */}
                    </div>

                    {/* Right Content - Animated Images */}
                    <div className={`relative h-[600px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {/* Floating Icons
                        <div className="absolute -left-4 top-20 bg-white p-3 rounded-2xl shadow-lg animate-float">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-700 text-xl">💡</span>
                            </div>
                        </div>
                        <div className="absolute -right-4 top-40 bg-white p-3 rounded-2xl shadow-lg animate-float-delayed">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-700 text-xl">🚀</span>
                            </div>
                        </div>
                        <div className="absolute left-10 bottom-20 bg-white p-3 rounded-2xl shadow-lg animate-float">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-700 text-xl">📊</span>
                            </div>
                        </div> */}

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
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-33.33%);
                    }
                }

                @keyframes scrollDown {
                    0% {
                        transform: translateY(-33.33%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-scroll-up {
                    animation: scrollUp 20s linear infinite;
                }

                .animate-scroll-down {
                    animation: scrollDown 20s linear infinite;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 1.5s;
                }
            `}</style>
        </section>
    );
};

export default Hero;
