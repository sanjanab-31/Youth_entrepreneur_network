import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Zap, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
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
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                    ? 'py-3 bg-brand-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-900/10'
                    : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-purple/20 p-2 group-hover:bg-brand-purple/30 transition-all duration-300 border border-brand-purple/30 flex items-center justify-center transform group-hover:rotate-6">
                            <img
                                src={logo}
                                alt="Vanguard Logo"
                                className="w-full h-full object-contain rounded-lg mix-blend-screen"
                            />
                        </div>
                        <div className="absolute -inset-1 bg-brand-purple/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-purple transition-colors leading-none">Vanguard</span>
                        <span className="text-[10px] font-bold text-brand-purple tracking-[0.2em] uppercase leading-none mt-1">Ecosystem</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/5">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-white transition-all duration-300 rounded-full hover:bg-white/10"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/auth/login"
                        className="text-sm font-semibold text-white/70 hover:text-white transition-colors px-4"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/auth/role-selection"
                        className="group relative px-6 py-2.5 rounded-full bg-brand-purple text-white text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center gap-2">
                            Join Network <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:hidden bg-brand-black border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-brand-muted hover:text-brand-purple transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <hr className="border-white/5" />
                            <div className="flex flex-col gap-4">
                                <Link
                                    to="/auth/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-4 text-center rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/auth/role-selection"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-4 text-center rounded-2xl bg-brand-purple text-white font-bold shadow-lg shadow-purple-600/20"
                                >
                                    Join Network
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
