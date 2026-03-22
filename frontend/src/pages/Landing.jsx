import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Briefcase, Zap, Globe, MessageSquare, TrendingUp, Shield, Star, ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.jpg';

const Section = ({ children, className = "", id }) => (
    <section id={id} className={`py-12 md:py-20 px-4 md:px-6 scroll-mt-20 ${className}`}>
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
    </section>
);

const FadeIn = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
            title: "Build Your Startup With Real Structure.",
            subtitle: "Vanguard replaces startup chaos with a structured execution path — from idea to incubator readiness.",
            badge: "STRUCTURED EXECUTION"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
            title: "Connect With Vetted Co-Founders.",
            subtitle: "Stop searching in random groups. Find skill-matched partners who are as serious as you are.",
            badge: "SKILL MATCHING"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
            title: "Get Incubator Ready.",
            subtitle: "Track your traction, build your data room, and get direct access to our partner incubators.",
            badge: "INCUBATOR ACCESS"
        }
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="absolute inset-0 w-full h-full bg-brand-black">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-105"
                        style={{
                            backgroundImage: `url(${slides[currentSlide].image})`,
                            transform: "scale(1.1)" // Slow zoom effect
                        }}
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/70" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Subtle Pulse Radial Glow behind content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[120px] opacity-20 animate-slow-pulse pointer-events-none z-0" />

            {/* Content Container */}
            <div className="relative z-10 h-full px-4 md:px-6 flex flex-col justify-center items-center text-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, transition: { duration: 0.5 } }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-7xl w-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(139,92,246,0.15)] border border-brand-purple/30 text-brand-purple text-[9px] md:text-[11px] font-bold uppercase tracking-widest mb-8 backdrop-blur-sm"
                        >
                            <Zap size={10} md:size={12} fill="currentColor" />
                            {slides[currentSlide].badge}
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-5xl lg:text-7xl w-full font-bold leading-[1.1] mb-8 text-white drop-shadow-lg"
                        >
                            {slides[currentSlide].title.split(" ").map((word, i) => {
                                // Logic for gradient highlighting:
                                // Slide 1: Highlight from 4th word onwards ("With Real Structure.")
                                // Slide 2: Highlight last word ("Co-Founders.")
                                // Slide 3: Highlight last two words ("Incubator Ready.")
                                const isSlide1Highlight = currentSlide === 0 && i > 2;
                                const isSlide2Highlight = currentSlide === 1 && i > 2;
                                const isSlide3Highlight = currentSlide === 2 && i > 0;

                                if (isSlide1Highlight || isSlide2Highlight || isSlide3Highlight) {
                                    return (
                                        <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                                            {" "}{word}
                                        </span>
                                    );
                                }
                                return i === 0 ? word : " " + word;
                            })}
                        </motion.h1>

                        <motion.p
                            className="text-sm md:text-lg text-[#E5E7EB] mb-12 leading-relaxed max-w-[650px] mx-auto drop-shadow-md"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>

                        <div className="flex flex-col items-center justify-center">
                            <button
                                onClick={() => navigate('/auth/role-selection')}
                                className="w-full sm:w-auto px-12 py-4 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-base md:text-lg shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2"
                            >
                                Get Started <ArrowRight size={20} />
                            </button>
                            {/* <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-xs text-gray-400 mt-6 font-normal"
                            >
                                Built for serious early-stage founders.
                            </motion.p> */}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center md:justify-start md:left-20 flex gap-3 px-6">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="group cursor-pointer py-2"
                        >
                            <div className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 md:w-12 bg-brand-purple' : 'w-4 md:w-6 bg-white/20 group-hover:bg-white/40'}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Landing = () => {
    const [activeMentor, setActiveMentor] = React.useState(0);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-black selection:bg-brand-purple selection:text-white overflow-x-hidden">
            <Navbar />

            {/* HERO SECTION - DYNAMIC CAROUSEL */}
            <section id="home" className="relative h-screen min-h-[800px] overflow-hidden scroll-mt-20">
                <HeroCarousel />
            </section>

            {/* PROBLEM SECTION */}
            {/* <Section className="bg-brand-black/50">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">The Startup Ecosystem Is <span className="text-gradient">Fragmented.</span></h2>
                        <p className="text-brand-muted max-w-2xl mx-auto">Founders are disconnected, mentors are inaccessible, and incubators are swamped with noise. We fix that.</p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Users size={32} />,
                            title: "Scattered Networking",
                            desc: "Founders struggle across WhatsApp and LinkedIn without structured visibility."
                        },
                        {
                            icon: <Shield size={32} />,
                            title: "Wrong Mentor Matching",
                            desc: "Generic advice wastes time without stage-based filtering and compatibility."
                        },
                        {
                            icon: <Zap size={32} />,
                            title: "Low Visibility",
                            desc: "Serious startups get lost in noisy applications and chaotic ecosystems."
                        }
                    ].map((card, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="p-8 rounded-2xl h-full transition-all duration-300 hover:-translate-y-2 border border-white/5 hover:border-brand-purple/50 bg-gradient-to-b from-white/5 to-transparent hover:bg-brand-purple/5 group relative overflow-hidden text-center">
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-purple/10 text-brand-purple mb-6 group-hover:scale-110 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                                <p className="text-brand-muted text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section> */}

            {/* ROLE SELECTION SECTION (Redesigned Premium Cards) */}
            {/* ROLE SELECTION SECTION (Redesigned Premium Cards) */}
            <section id="programs" className="py-12 md:py-20 relative scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap size={10} md:size={12} fill="currentColor" />
                            Get Started
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Explore All Programs
                        </h2>

                        <p className="text-brand-muted max-w-2xl text-sm md:text-base">
                            Choose your role and access a structured startup ecosystem.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 md:gap-6 overflow-x-auto pt-10 pb-12 snap-x px-6 md:px-36 scrollbar-hide">

                    {[
                        {
                            role: "The Founder Program",
                            tag: "MOST POPULAR",
                            desc: "Build your startup with structure. Find the right co-founder and connect with mentors to become incubator-ready.",
                            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000",
                            rating: "4.9",
                            reviews: "1.2k+ reviews",
                            avatars: [
                                "https://i.pravatar.cc/150?u=1",
                                "https://i.pravatar.cc/150?u=2",
                                "https://i.pravatar.cc/150?u=3",
                                "https://i.pravatar.cc/150?u=4"
                            ],
                            btnMain: "Get Started",
                            btnSec: "View Demo"
                        },
                        {
                            role: "The Co-Founder Program",
                            tag: "SKILL MATCHING",
                            desc: "Match your skills with high-potential startups. Connect with founders who need your expertise to scale their vision.",
                            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000",
                            rating: "4.9",
                            reviews: "800+ connections",
                            avatars: [
                                "https://i.pravatar.cc/150?u=13",
                                "https://i.pravatar.cc/150?u=14",
                                "https://i.pravatar.cc/150?u=15",
                                "https://i.pravatar.cc/150?u=16"
                            ],
                            btnMain: "Find Startups",
                            btnSec: "View Roles"
                        },
                        {
                            role: "The Mentor Network",
                            tag: "MOST STRUCTURED",
                            desc: "Guide serious founders with focused mentorship and structured startup tracking tools designed for impact.",
                            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000",
                            rating: "5.0",
                            reviews: "500+ active mentors",
                            avatars: [
                                "https://i.pravatar.cc/150?u=5",
                                "https://i.pravatar.cc/150?u=6",
                                "https://i.pravatar.cc/150?u=7",
                                "https://i.pravatar.cc/150?u=8"
                            ],
                            btnMain: "Join Network",
                            btnSec: "View Panel"
                        },
                        {
                            role: "The Incubator Hub",
                            tag: "VERIFIED DEAL FLOW",
                            desc: "Discover verified startups, filter by traction, and manage structured cohorts efficiently with our pipeline tools.",
                            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
                            rating: "4.8",
                            reviews: "50+ partner incubators",
                            avatars: [
                                "https://i.pravatar.cc/150?u=9",
                                "https://i.pravatar.cc/150?u=10",
                                "https://i.pravatar.cc/150?u=11",
                                "https://i.pravatar.cc/150?u=12"
                            ],
                            btnMain: "Partner With Us",
                            btnSec: "View Demo"
                        }
                    ].map((card, i) => (

                        <div
                            key={i}
                            className="group relative min-w-[280px] sm:min-w-[400px] md:min-w-[500px] snap-center rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] border border-purple-500 shadow-2xl shadow-black/50 hover:z-2"
                        >
                            <div className="relative h-[450px] md:h-[500px]">

                                {/* Image */}
                                <img
                                    src={card.image}
                                    alt={card.role}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Gradient */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(to top, #000 0%, #000 35%, rgba(0,0,0,0.8) 60%, transparent 100%)"
                                    }}
                                />


                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col items-center text-center">

                                    <h3 className="text-white text-3xl font-bold mb-4">
                                        {card.role}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-yellow-400">★</span>
                                        <span className="text-white font-bold">{card.rating}</span>
                                        <span className="text-gray-400 text-sm">{card.reviews}</span>
                                    </div>

                                    <p className="text-gray-300 text-sm mb-6 max-w-md">
                                        {card.desc}
                                    </p>

                                    <div className="flex -space-x-3 mb-6">
                                        {card.avatars.map((src, idx) => (
                                            <img
                                                key={idx}
                                                src={src}
                                                className="w-10 h-10 rounded-full border-2 border-black"
                                            />
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-700 flex items-center justify-center text-xs text-white">
                                            +12
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                                        <button
                                            onClick={() => {
                                                const lowerRole = card.role.toLowerCase();
                                                const roleKey = lowerRole.includes('co-founder') ? 'co-founder' :
                                                    lowerRole.includes('founder') ? 'founder' :
                                                        lowerRole.includes('mentor') ? 'mentor' :
                                                            'incubator';
                                                navigate(`/auth/login?role=${roleKey}`);
                                            }}
                                            className="flex-1 border border-gray-600 rounded-full py-2.5 md:py-3 hover:bg-gray-800 text-sm md:text-base transition-colors"
                                        >
                                            Login
                                        </button>

                                        <button
                                            onClick={() => {
                                                const lowerRole = card.role.toLowerCase();
                                                const roleKey = lowerRole.includes('co-founder') ? 'co-founder' :
                                                    lowerRole.includes('founder') ? 'founder' :
                                                        lowerRole.includes('mentor') ? 'mentor' :
                                                            'incubator';
                                                navigate(`/auth/signup?role=${roleKey}`);
                                            }}
                                            className="flex-1 bg-gradient-to-r from-brand-purple to-purple-600 text-white hover:opacity-90 rounded-full py-2.5 md:py-3 text-sm md:text-base font-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                                        >
                                            {card.btnMain}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    ))}

                </div>
            </section >


            {/* MENTOR SPOTLIGHT (Accordion) */}
            <Section id="mentors" className="relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />

                {/* Background Depth Gradient */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/15 rounded-full blur-[120px] pointer-events-none animate-pulse z-0" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">
                            EXECUTION MENTOR NETWORK
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] text-white">
                            Learn From Builders — <span className="text-gray-500">Not Theorists.</span>
                        </h2>

                        <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed max-w-lg">
                            Connect with founders who’ve raised, scaled, failed, and rebuilt.
                            <br className="hidden md:block" />
                            Get operational execution support — not classroom theory.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <button
                                onClick={() => navigate('/auth/role-selection')}
                                className="px-8 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm md:text-base shadow-xl shadow-brand-purple/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                Explore Mentors <ArrowRight size={18} />
                            </button>
                            <button className="px-8 py-3.5 rounded-full border border-gray-700 hover:border-brand-purple text-gray-300 hover:text-white font-bold text-sm md:text-base transition-all hover:bg-white/5">
                                Request a Mentor
                            </button>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            {[
                                "Founder-Led Mentorship",
                                "Stage-Specific Advice",
                                "Direct Application Support"
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                                    <span className="text-[10px] md:text-[11px] font-bold tracking-tight text-gray-300 uppercase">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Mentor Cards Accordion */}
                    <div className="flex flex-col sm:flex-row gap-3 h-auto sm:h-[600px] w-full [perspective:1000px]">
                        {[
                            { name: "Gabriella Hersham", company: "HUCKLETREE", role: "Founder of Huckletree", quote: "Building communities that inspire innovation.", img: "photo-1573496359142-b8d87734a5a2" },
                            { name: "Caen Contee", company: "LIME", role: "Co-Founder", quote: "Fall in love with the problem, not the solution.", img: "photo-1507003211169-0a1dd7228f2d" },
                            { name: "Uri Levine", company: "WAZE", role: "Co-Founder", quote: "Disrupting industries through innovation.", img: "photo-1472099645785-5658abf4ff4e" },
                            { name: "Alex Rivera", company: "PAYFAST", role: "Founder & CEO", quote: "Scaling fintech from zero to $10M ARR.", img: "photo-1500648767791-00dcc994a43e" }
                        ].map((mentor, i) => (
                            <motion.div
                                key={i}
                                onMouseEnter={() => setActiveMentor(i)}
                                onClick={() => setActiveMentor(i)}
                                whileHover={{
                                    rotateY: activeMentor === i ? 0 : 5,
                                    z: 10
                                }}
                                className={`relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-cover bg-center 
                                    ${activeMentor === i
                                        ? 'flex-[12] h-[400px] sm:h-full shadow-[0_20px_50px_rgba(139,92,246,0.35)]'
                                        : 'flex-[1.5] h-[100px] sm:h-full opacity-60 grayscale-[0.6] hover:opacity-80 hover:grayscale-0 blur-[1px] hover:blur-0'}`}
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/${mentor.img}?w=800&h=1200&fit=crop')`,
                                }}
                            >
                                {/* Active Glow Effect */}
                                {activeMentor === i && (
                                    <div className="absolute inset-0 bg-brand-purple/10 animate-pulse pointer-events-none" />
                                )}

                                <div className={`absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95 transition-opacity duration-500 ${activeMentor === i ? 'opacity-100' : 'opacity-80'}`} />

                                <div className="absolute bottom-0 left-0 right-0 p-8 whitespace-nowrap overflow-hidden">
                                    <div className={`transition-all duration-700 delay-100 transform ${activeMentor === i ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                                        <div className="text-brand-purple text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-2 drop-shadow-sm">{mentor.company}</div>
                                        <div className="text-gray-300 text-[10px] sm:text-xs font-medium mb-3">{mentor.role}</div>
                                    </div>

                                    <h3
                                        className={`text-white font-black transition-all duration-500 origin-bottom-left whitespace-nowrap
                                        ${activeMentor === i
                                                ? 'text-2xl sm:text-3xl mb-3 translate-x-0 translate-y-0 rotate-0 relative'
                                                : 'text-2xl sm:text-4xl absolute bottom-10 left-10 -rotate-90 translate-x-0 translate-y-0'
                                            }`}
                                    >
                                        {mentor.name}
                                    </h3>

                                    <p className={`text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs whitespace-normal transition-all duration-700 delay-200 ${activeMentor === i ? 'opacity-100 h-auto translate-y-0' : 'opacity-0 h-0 translate-y-4 pointer-events-none'}`}>
                                        "{mentor.quote}"
                                    </p>
                                </div>

                                {/* Selection Border */}
                                <div className={`absolute inset-0 border-[3px] rounded-[2rem] transition-all duration-700 ${activeMentor === i ? 'border-brand-purple/40 scale-100' : 'border-transparent scale-95'}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section >
            {/* HOW VANGUARD WORKS */}
            <Section id="how-it-works" className="relative overflow-hidden bg-[#0F0F14]">
                {/* Subtle Background Depth */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none animate-slow-pulse z-0" />

                <div className="text-center mb-20 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
                    >
                        From Idea to Incubator — <span className="text-brand-purple">Structured.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-brand-muted text-base md:text-lg max-w-2xl mx-auto"
                    >
                        A structured path from idea to incubation.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Visual Flow Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-purple/15 hidden lg:block -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {[
                            {
                                step: "01",
                                title: "Define Your Startup DNA",
                                desc: "Structure your stage, traction, and execution gaps."
                            },
                            {
                                step: "02",
                                title: "Match With Operators",
                                desc: "Connect with co-founders and mentors aligned with your stage."
                            },
                            {
                                step: "03",
                                title: "Execute With Discipline",
                                desc: "Track milestones, mentorship, and traction in one command center."
                            },
                            {
                                step: "04",
                                title: "Become Incubator-Ready",
                                desc: "Apply with verified execution data — not just a pitch deck."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                whileHover={{
                                    y: -6,
                                    borderColor: "rgba(139, 92, 246, 0.4)",
                                    boxShadow: "0 20px 40px -15px rgba(139, 92, 246, 0.15)"
                                }}
                                className="relative group p-8 rounded-[2.5rem] bg-[#16161D] border border-white/5 transition-all duration-300 h-full overflow-hidden"
                            >
                                {/* Step Number Styling */}
                                <div className="absolute top-4 right-8 select-none pointer-events-none">
                                    <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-purple/20 to-transparent opacity-40">
                                        {item.step}
                                    </span>
                                </div>

                                <div className="relative z-10 pt-12">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-8 group-hover:scale-110 transition-transform duration-300">
                                        {i === 0 && <Info size={24} />}
                                        {i === 1 && <Users size={24} />}
                                        {i === 2 && <Zap size={24} />}
                                        {i === 3 && <Briefcase size={24} />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-purple transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-brand-muted text-sm leading-[1.6]">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Hover Border Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 text-center relative z-10"
                >
                    <button
                        onClick={() => navigate('/auth/role-selection')}
                        className="px-10 py-4 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-base shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] transition-all hover:scale-105 active:scale-95"
                    >
                        Start Your Structured Path
                    </button>
                </motion.div>
            </Section >
            {/* SOCIAL PROOF
            <Section className="bg-gradient-to-b from-brand-black to-brand-card/20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Built For <span className="text-brand-purple">Serious Founders.</span></h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { num: "1,200+", label: "Founders" },
                        { num: "300+", label: "Mentors" },
                        { num: "50+", label: "Incubators" },
                        { num: "90%", label: "Completion Rate" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-6 border-r last:border-0 border-white/5">
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">{stat.num}</div>
                            <div className="text-brand-purple font-medium text-sm uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Section> */}

            {/* CTA SECTION */}
            {/* <Section className="pb-32">
                <div className="relative glass-card rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-brand-purple/30">
                    <div className="absolute inset-0 bg-brand-purple/5 mix-blend-overlay pointer-events-none" />
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-brand-purple/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />

                    <h2 className="text-4xl md:text-6xl font-bold mb-6 relative z-10">Stop Networking. <br />Start <span className="text-white">Building.</span></h2>
                    <p className="text-lg text-brand-muted max-w-xl mx-auto mb-10 relative z-10">
                        Join Vanguard and execute your startup with clarity and structure. A premium ecosystem for those who are serious about success.
                    </p>

                    <button className="px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:scale-105 transition-all duration-300 relative z-10">
                        Join Vanguard Today
                    </button>
                </div>
            </Section> */}

            <Footer />
        </div >
    );
};

export default Landing;
