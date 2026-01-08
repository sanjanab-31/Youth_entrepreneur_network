import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ArrowRight, Sparkles, Users, TrendingUp, Lightbulb, AlertCircle, UserX, DollarSign, Building, Rocket, Target, Settings, Globe } from 'lucide-react';
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

    // TESTIMONIALS CONFIGURATION - EASY MANUAL SIZE ADJUSTMENT
    const testimonialWidth = "150px";  // Change pixels here
    const testimonialHeight = "190px"; // Change pixels here

    const testimonialItems = [
        { left: "-9.8%", top: "20%", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop" },
        { left: "-9.8%", top: "53%", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop" },
        { left: "3.5%", top: "10%", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop" },
        { left: "3.5%", top: "42%", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&h=600&fit=crop" },
        { left: "17%", top: "20%", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=600&fit=crop" },
        { left: "30.5%", top: "5%", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop" },
        { left: "44%", top: "15%", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop" },
        { left: "57.5%", top: "5%", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop" },
        { left: "71%", top: "20%", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=600&fit=crop" },
        { left: "84.5%", top: "10%", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop" },
        { left: "84.5%", top: "42%", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop", zIndex: 20 },
        { left: "97.5%", top: "20%", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop" },
        { left: "97.5%", top: "53%", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop" },
    ];

    // GRID CONFIGURATION - Change size and positions for background squares
    const gridTileSize = "150px";
    const gridTileSizee = "180px";
    const testimonialGridItems = [
        { left: "1.5%", top: "6%" }, { left: "12.5%", top: "-1%" }, { left: "23.5%", top: "6%" }, { left: "34.3%", top: "-4%" }, { left: "45.3%", top: "3%" }, { left: "56%", top: "-4%" }, { left: "67%", top: "6%" }, { left: "78%", top: "-1%" }, { left: "88.5%", top: "6%" },
    ];

    return (
        <div className="min-h-screen">
            <Header />

            {/* HERO SECTION */}
            <section className="min-h-screen bg-[#fcfdfd] relative pt-32 pb-20 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -skew-x-12 translate-x-1/4 pointer-events-none"></div>

                <div className="max-w-[1400px] mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full border border-emerald-100">
                                <Sparkles className="w-3 h-3" />
                                <span className="text-[10px] font-bold tracking-wide uppercase">Youth Entrepreneur Network</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-semibold text-gray-900 leading-[1.1]">
                                Disrupt Ideas
                                <span className="block text-emerald-600 mt-2">
                                    Build Empires
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                                Connect with world-class mentors, find visionary investors, and scale your startup with YEN's premium ecosystem.
                            </p>

                            <div className="flex flex-wrap gap-5 pt-4">
                                <button
                                    onClick={() => navigate('/portal-select/signup')}
                                    className="bg-emerald-600 text-white rounded-full pl-4 pr-0.5 py-0.5 text-sm font-bold hover:bg-emerald-50 transition-all flex items-center gap-3 whitespace-nowrap"
                                >
                                    Try out
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <ArrowUpRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </div>
                                </button>
                                <button
                                    onClick={() => navigate('/portal-select/login')}
                                    className="pl-4 pr-0.5 py-0.5 bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-all font-bold border-1 border-gray-100 flex items-center gap-1"
                                >
                                    Learn more
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <ArrowUpRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </div>
                                </button>
                            </div>
                        </div>


                        {/* Right Content - Animated Images */}
                        <div className={`relative h-[650px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            {/* Animated Image Columns */}
                            <div className="flex gap-6 h-full overflow-hidden">
                                {/* Column 1 - Moves Up */}
                                <div className="flex-1 space-y-6 animate-scroll-up">
                                    {[1, 2, 1, 2].map((num, i) => (
                                        <div key={i} className="relative group rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 aspect-[3/4] bg-emerald-100">
                                            <img
                                                src={`/src/assets/hero-${num}.jpg`}
                                                alt="Entrepreneurship"
                                                className="w-full h-full object-cover transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = num === 1
                                                        ? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop'
                                                        : 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=800&fit=crop';
                                                }}
                                            />
                                            {/* Ask Me A Question Bar */}
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                                                <div className="bg-black/80 backdrop-blur-md rounded-full pl-6 pr-1.5 py-1.5 flex items-center gap-3 w-full border border-white/10 group-hover:scale-[1.03] transition-transform duration-300">
                                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Ask Me A Question</span>
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ml-auto">
                                                        <ArrowDownLeft className="w-4 h-4 text-black" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Floating Badge (Ref Image) */}
                                            {i === 1 && (
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 text-[10px] font-bold text-gray-900 shadow-lg border border-white/50">
                                                    Try Out
                                                    <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Column 2 - Moves Down */}
                                <div className="flex-1 space-y-6 animate-scroll-down">
                                    {[3, 4, 3, 4].map((num, i) => (
                                        <div key={i} className="relative group rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 aspect-[3/4] bg-emerald-100">
                                            <img
                                                src={`/src/assets/hero-${num}.jpg`}
                                                alt="Growth"
                                                className="w-full h-full object-cover transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = num === 3
                                                        ? 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=800&fit=crop'
                                                        : 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop';
                                                }}
                                            />
                                            {/* Ask Me A Question Bar */}
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                                                <div className="bg-black/80 backdrop-blur-md rounded-full pl-6 pr-1.5 py-1.5 flex items-center gap-3 w-full border border-white/10 group-hover:scale-[1.03] transition-transform duration-300">
                                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Ask Me A Question</span>
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ml-auto">
                                                        <ArrowDownLeft className="w-4 h-4 text-black" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom CSS for animations */}
                <style jsx>{`
                    @keyframes scrollUp {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    @keyframes scrollDown {
                        0% { transform: translateY(-50%); }
                        100% { transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-scroll-up { animation: scrollUp 15s linear infinite; }
                    .animate-scroll-down { animation: scrollDown 15s linear infinite; }
                    .animate-float { animation: float 3s ease-in-out infinite; }
                    .animate-float-delayed { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
                `}</style>
            </section>

            {/* WHY YEN SECTION */}
            <section className="py-32 bg-white" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 italic-not">
                            The Startup Ecosystem <span className="text-emerald-600">Reimagined</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            We've identified the core barriers for young founders and built a professional system to dismantle them.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-20">
                        {problems.map((problem) => (
                            <div
                                key={problem.id}
                                className="group bg-neutral-50 rounded-[2rem] p-8 hover:bg-emerald-600 transition-all duration-500 relative flex flex-col h-[320px] shadow-sm border border-neutral-100"
                            >
                                <div className="mb-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <problem.icon className="w-7 h-7 text-emerald-600" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors">
                                        {problem.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-emerald-100 transition-colors">
                                        {problem.description}
                                    </p>
                                </div>

                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <button
                            onClick={() => navigate('/portal-select/signup')}
                            className="px-10 py-4 bg-gray-900 text-white rounded-full hover:bg-emerald-600 transition-all shadow-xl font-bold transform hover:-translate-y-1"
                        >
                            Get Started Now
                        </button>
                        <button
                            onClick={() => navigate('/about')}
                            className="px-10 py-4 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 transition-all font-bold border-2 border-emerald-100"
                        >
                            Explore Platform
                        </button>
                    </div>
                </div>
            </section>


            {/* BENEFITS SECTION */}
            {/* <section className="py-20 bg-gray-50 z-10">
                <div className="max-w-7xl mx-auto px-6"> */}
            {/* Header */}
            {/* <div className="text-center mb-16">
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
                    </div> */}

            {/* Benefit Rows */}
            {/* <div className="space-y-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.id} className="grid grid-cols-2 gap-8"> */}
            {/* Left Card */}
            {/* <div className="bg-white rounded-[2rem] p-10 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-6">
                                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                                            <benefit.left.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl text-gray-500 font-medium mb-4">{benefit.left.title}</h3>
                                        <p className="text-xl text-gray-900 leading-relaxed font-medium">
                                            {benefit.left.description}
                                        </p>
                                    </div>
                                </div> */}

            {/* Right Card */}
            {/* <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-[2rem] p-10 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <h3 className="text-3xl font-bold text-gray-900 text-center max-w-lg relative z-10">
                                        {benefit.right.text}
                                    </h3> */}

            {/* Subtle hover effect overlay */}
            {/* <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* TESTIMONIALS SECTION */}
            <section className="py-32 bg-emerald-950 overflow-hidden relative" id="testimonials">
                {/* Background Decoration - Manual Grid */}
                <div
                    className="absolute inset-0 opacity-[0.1] pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                    }}
                >
                    {testimonialGridItems.map((grid, i) => (
                        <div
                            key={i}
                            className="bg-emerald-500 rounded-xl absolute"
                            style={{
                                left: grid.left,
                                top: grid.top,
                                width: gridTileSize,
                                height: gridTileSizee
                            }}
                        ></div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    {/* Vertical Lines */}
                    <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/5 pointer-events-none"></div>
                    <div className="absolute top-0 bottom-0 left-[85%] w-px bg-white/5 pointer-events-none"></div>

                    {/* Staggered Leader Headshots Cloud */}
                    <div className="relative h-[650px] -mb-80">
                        {testimonialItems.map((item, index) => (
                            <div
                                key={index}
                                className="absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 hover:scale-110 hover:z-50 group"
                                style={{
                                    left: item.left,
                                    top: item.top,
                                    width: testimonialWidth,
                                    height: testimonialHeight,
                                    zIndex: item.zIndex || 1
                                }}
                            >
                                <img
                                    src={item.img}
                                    alt="Leader"
                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-emerald-600/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                        ))}
                    </div>

                    {/* Central Content */}
                    <div className="text-center relative z-30 max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-400 text-sm font-bold mb-6 border border-emerald-800/50 backdrop-blur-sm">
                            Real Impact
                        </div>

                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Trusted by <span className="text-emerald-500">Visionaries</span>
                        </h2>

                        <p className="text-xl text-emerald-100/70 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                            Join thousands of founders who have accelerated their growth through our professional network.
                        </p>

                        <button
                            className="bg-emerald-600 text-white px-12 py-5 rounded-full font-bold flex items-center gap-3 mx-auto hover:bg-emerald-500 transition-all group shadow-2xl shadow-emerald-900/50 transform hover:-translate-y-1"
                        >
                            Read Success Stories
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
};

export default Landing;
