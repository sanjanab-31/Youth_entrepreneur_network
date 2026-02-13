import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Briefcase, Zap, Globe, MessageSquare, TrendingUp, Shield, Star, ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.jpg';

const Section = ({ children, className = "" }) => (
    <section className={`py-20 px-6 ${className}`}>
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
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", // Modern Workspace/Structure
            title: "Build Your Startup With Structure.",
            subtitle: "Vanguard is the first execution platform that replaces chaos with a structured path to incubation.",
            badge: "STRUCTURED EXECUTION"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", // Team/Co-founders
            title: "Connect With Vetted Co-Founders.",
            subtitle: "Stop searching in random groups. Find skill-matched partners who are as serious as you are.",
            badge: "SKILL MATCHING"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop", // Growth/Incubator
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
    }, []);

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

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="relative z-10 h-full  px-6 flex flex-col justify-center items-center text-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, transition: { duration: 0.5 } }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-7xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm"
                        >
                            <Zap size={12} fill="currentColor" />
                            {slides[currentSlide].badge}
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-lg"
                        >
                            {slides[currentSlide].title.split(" ").map((word, i) => (
                                i > 2 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400"> {word}</span> : " " + word
                            ))}
                        </motion.h1>

                        <motion.p
                            className="text-xl text-gray-200 mb-10 leading-relaxed max-w-7xl mx-auto shadow-black drop-shadow-md"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/auth/role-selection')}
                                className="px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2"
                            >
                                Get Started <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-lg backdrop-blur-md transition-all">
                                View Demo
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-12 left-6 md:left-20 flex gap-3">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="group cursor-pointer py-2"
                        >
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-12 bg-brand-purple' : 'w-6 bg-white/20 group-hover:bg-white/40'}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Landing = () => {
    const [activeMentor, setActiveMentor] = React.useState(0);

    return (
        <div className="min-h-screen bg-brand-black selection:bg-brand-purple selection:text-white overflow-x-hidden">
            <Navbar />

            {/* HERO SECTION - DYNAMIC CAROUSEL */}
            <section className="relative h-screen min-h-[800px] overflow-hidden">
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
            <section className="py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap size={12} fill="currentColor" />
                            Get Started
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Explore All Programs
                        </h2>

                        <p className="text-brand-muted max-w-2xl">
                            Choose your role and access a structured startup ecosystem.
                        </p>
                    </div>


                </div>

                <div className="flex gap-6 overflow-x-auto pb-12 snap-x px-6 md:px-20 scrollbar-hide">

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
                            className="group relative min-w-[500px]  rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-brand-purple/20"

                        >
                            <div className="relative h-[500px]">

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

                                {/* Badge */}
                                <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
                                    <span className="bg-gray-800/90 backdrop-blur text-purple-300 px-4 py-1.5 rounded-full text-xs font-semibold">
                                        {card.tag}
                                    </span>
                                </div>

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

                                    <div className="flex gap-3 w-full max-w-md">
                                        <button
                                            onClick={() => navigate(`/auth/login?role=${card.role.toLowerCase().includes('founder') ? 'founder' : card.role.toLowerCase().includes('mentor') ? 'mentor' : 'incubator'}`)}
                                            className="flex-1 border border-gray-600 rounded-full py-3 hover:bg-gray-800"
                                        >
                                            Login
                                        </button>

                                        <button
                                            onClick={() => navigate(`/auth/signup?role=${card.role.toLowerCase().includes('founder') ? 'founder' : card.role.toLowerCase().includes('mentor') ? 'mentor' : 'incubator'}`)}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full py-3 shadow-lg shadow-purple-500/40"
                                        >
                                            {card.btnMain}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    ))}

                </div>
            </section>


            {/* MENTOR SPOTLIGHT (Accordion) */}
            <Section className="relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content Section */}
                    <div>
                        <h2 className="text-5xl font-bold mb-4 leading-tight">
                            Learn From <span className="text-brand-purple">Builders.</span> <span className="text-gray-500">Not Theorists.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
                            Connect with mentors who have actually walked the path. Get operational advice, not just high-level theory.
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            {[
                                { label: "ONLINE", dot: true },
                                { label: "SELF-PACED", dot: true },
                                { label: "CERTIFICATE", dot: true }
                            ].map((tag, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    {tag.dot && (
                                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-brand-purple' : 'bg-white/50'}`}></div>
                                        </div>
                                    )}
                                    <span className="tracking-wider text-xs font-bold">{tag.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Mentor Cards Accordion */}
                    <div className="flex gap-4 h-[500px] w-full">
                        {[
                            { name: "Gabriella Hersham", company: "HUCKLETREE", role: "Founder of Huckletree", quote: "Building communities that inspire innovation.", img: "photo-1573496359142-b8d87734a5a2" },
                            { name: "Caen Contee", company: "LIME", role: "Co-Founder", quote: "Fall in love with the problem, not the solution.", img: "photo-1507003211169-0a1dd7228f2d" },
                            { name: "Uri Levine", company: "WAZE", role: "Co-Founder", quote: "Disrupting industries through innovation.", img: "photo-1472099645785-5658abf4ff4e" },
                            { name: "Alex Rivera", company: "PAYFAST", role: "Founder & CEO", quote: "Scaling fintech from zero to $10M ARR.", img: "photo-1500648767791-00dcc994a43e" }
                        ].map((mentor, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setActiveMentor(i)}
                                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out bg-cover bg-center ${activeMentor === i ? 'flex-[3]' : 'flex-[1]'}`}
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/${mentor.img}?w=600&h=800&fit=crop')`
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 transition-opacity duration-300 ${activeMentor === i ? 'opacity-100' : 'opacity-80'}`} />

                                <div className="absolute bottom-0 left-0 right-0 p-6 whitespace-nowrap overflow-hidden">
                                    <div className={`transition-all duration-500 transform ${activeMentor === i ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                        <div className="text-brand-purple text-xs font-bold tracking-widest uppercase mb-1">{mentor.company}</div>
                                        <div className="text-gray-300 text-xs mb-2">{mentor.role}</div>
                                    </div>

                                    <h3
                                        className={`text-white font-bold transition-all duration-300 origin-bottom-left whitespace-nowrap
                                        ${activeMentor === i
                                                ? 'text-2xl mb-2 translate-x-0 translate-y-0 rotate-0 relative'
                                                : 'text-3xl absolute bottom-8 left-8 -rotate-90 translate-x-0 translate-y-0'
                                            }`}
                                    >
                                        {mentor.name}
                                    </h3>

                                    <p className={`text-gray-400 text-xs leading-relaxed max-w-xs whitespace-normal transition-all duration-500 delay-100 ${activeMentor === i ? 'opacity-100 h-auto' : 'opacity-0 h-0 pointer-events-none'}`}>
                                        "{mentor.quote}"
                                    </p>
                                </div>

                                <div className={`absolute inset-0 border-2 rounded-3xl transition-colors duration-300 ${activeMentor === i ? 'border-brand-purple/50' : 'border-transparent'}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
            {/* HOW VANGUARD WORKS */}
            <Section className="relative overflow-hidden">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">How Vanguard <span className="text-brand-purple">Works</span></h2>
                    <p className="text-brand-muted max-w-2xl mx-auto">A structured path from idea to incubation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {[
                        { step: "01", title: "Create Your Profile", desc: "Build a structured startup profile with stage, traction, and skill gaps." },
                        { step: "02", title: "Find The Right Match", desc: "Connect with co-founders and mentors based on real needs and compatibility." },
                        { step: "03", title: "Execute With Structure", desc: "Track milestones, mentorship sessions, and startup progress in one place." },
                        { step: "04", title: "Become Incubator Ready", desc: "Apply with verified execution data and structured startup visibility." }
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="relative group pt-8 px-8 rounded-3xl bg-brand-card/20 border border-white/5 hover:border-brand-purple/30 transition-all duration-300 hover:bg-brand-card/40 h-full overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-purple to-transparent">{item.step}</span>
                                </div>

                                <div className="relative z-10 pt-30">
                                    <h3 className="text-xl font-bold text-white mb-3 ">{item.title}</h3>
                                    <p className="text-brand-muted text-sm leading-relaxed mb-4">{item.desc}</p>
                                </div>

                                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-purple to-transparent w-0 group-hover:w-full transition-all duration-500" />
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>
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
        </div>
    );
};

export default Landing;
