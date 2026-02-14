import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Zap, ChevronDown, Sparkles } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 20);

            // Hide navbar if scrolled past hero (approx 100vh)
            // Only do this on the landing page (if possible, but let's assume global behavior for now as per user request)
            if (scrollY > window.innerHeight * 0.9) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Features', href: '#features' },
        { name: 'For Founders', href: '#founders' },
        { name: 'For Mentors', href: '#mentors' },
        { name: 'For Incubators', href: '#incubators' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    } ${isScrolled
                        ? 'py-4'
                        : 'py-8'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div
                        className={`transition-all duration-700 ease-in-out flex items-center justify-between px-6 px-8 rounded-[2rem] border transition-all duration-500 ${isScrolled
                            ? 'bg-brand-black/40 backdrop-blur-2xl border-white/10 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                            : 'bg-transparent border-transparent py-4'
                            }`}
                    >
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-4 group relative">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-[0.9rem] md:rounded-2xl overflow-hidden bg-gradient-to-br from-brand-purple/20 to-brand-purple/5 p-[1px] transition-all duration-500 border border-brand-purple/30 group-hover:border-brand-purple/60 shadow-lg shadow-purple-500/10"
                                >
                                    <div className="w-full h-full rounded-[0.8rem] md:rounded-[0.9rem] overflow-hidden bg-brand-black">
                                        <img
                                            src={logo}
                                            alt="Vanguard Logo"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                        />
                                    </div>
                                </motion.div>
                                {/* Interactive Glow */}
                                <div className="absolute -inset-3 bg-brand-purple/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg md:text-2xl font-black tracking-tighter text-white group-hover:text-brand-purple transition-all duration-300 leading-none">
                                    VANGUARD
                                </span>
                                <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                                    <motion.span
                                        initial={{ width: 16 }}
                                        whileHover={{ width: 32 }}
                                        className="h-[1px] bg-brand-purple/50 transition-all duration-500"
                                    />
                                    <span className="text-[8px] md:text-[10px] font-bold text-brand-purple tracking-[0.4em] uppercase leading-none opacity-80 group-hover:opacity-100">
                                        Ecosystem
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2 bg-white/[0.03] backdrop-blur-md rounded-full px-2 py-1.5 border border-white/5 ring-1 ring-white/5">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-5 py-2 text-sm font-bold text-brand-muted hover:text-white transition-all duration-300 rounded-full group overflow-hidden"
                                >
                                    <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 block">
                                        {link.name}
                                    </span>
                                    <span className="absolute left-1/2 -translate-x-1/2 top-full group-hover:top-2 text-brand-purple opacity-0 group-hover:opacity-100 transition-all duration-300 text-[10px]">
                                        <Sparkles size={8} className="animate-pulse" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                to="/auth/role-selection"
                                className="text-sm font-bold text-white/60 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                            >
                                <span className="relative py-1">
                                    Sign In
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-purple rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                                </span>
                            </Link>
                            <Link
                                to="/auth/role-selection"
                                className="group relative px-8 py-4 rounded-full bg-brand-purple text-white text-[13px] font-black tracking-wider overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                                <span className="relative flex items-center gap-2.5">
                                    JOIN NETWORK
                                    <div className="relative">
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        <div className="absolute inset-0 blur-sm bg-white/50 opacity-0 group-hover:opacity-100 animate-pulse" />
                                    </div>
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden relative w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10 group"
                        >
                            <div className="absolute inset-0 bg-brand-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <X size={26} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Menu size={26} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:hidden absolute top-full left-6 right-6 mt-4 p-8 bg-brand-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col gap-10">
                                <div className="flex flex-col gap-6">
                                    {navLinks.map((link, index) => (
                                        <motion.a
                                            key={link.name}
                                            href={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-3xl font-bold text-brand-muted hover:text-white transition-all flex items-center justify-between group"
                                        >
                                            <span className="group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                                            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-brand-purple/50 group-hover:bg-brand-purple/10 transition-all">
                                                <ArrowRight className="text-brand-purple transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>

                                <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        to="/auth/role-selection"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="py-5 text-center rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-lg"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/auth/role-selection"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="py-5 text-center rounded-2xl bg-brand-purple text-white font-black shadow-[0_10px_30px_rgba(139,92,246,0.3)] text-lg"
                                    >
                                        Join Now
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative background elements for mobile menu */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;
