import React from 'react';
import { Twitter, Youtube, Instagram, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Footer = () => {
    return (
        <footer className="bg-emerald-950 text-emerald-100/60 py-20 border-t border-emerald-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 overflow-hidden rounded-xl border border-emerald-800/50 shadow-lg shadow-emerald-900/40">
                                <img src={logo} alt="YEN" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">YEN</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Empowering the next generation of founders with a world-class startup ecosystem.
                        </p>
                    </div>

                    {/* Navigation Section */}
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-white font-bold text-sm tracking-widest uppercase">Platform</h4>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
                                <a href="#benefits" className="hover:text-emerald-400 transition-colors">Benefits</a>
                                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-white font-bold text-sm tracking-widest uppercase">Company</h4>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <a href="/about" className="hover:text-emerald-400 transition-colors">About Us</a>
                                <a href="/careers" className="hover:text-emerald-400 transition-colors">Careers</a>
                                <a href="/contact" className="hover:text-emerald-400 transition-colors">Contact</a>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-white font-bold text-sm tracking-widest uppercase">Support</h4>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <a href="/help" className="hover:text-emerald-400 transition-colors">Help Center</a>
                                <a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</a>
                                <a href="/terms" className="hover:text-emerald-400 transition-colors">Terms</a>
                            </nav>
                        </div>
                    </div>

                    {/* Contact/Social Section */}
                    <div className="md:col-span-1 space-y-6">
                        <h4 className="text-white font-bold text-sm tracking-widest uppercase">Follow Us</h4>
                        <div className="flex items-center space-x-4">
                            {[Twitter, Youtube, Instagram, MessageCircle].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <div className="pt-4">
                            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Contact Support</p>
                            <p className="text-sm text-white font-medium italic-not">hello@yennetwork.com</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-emerald-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/30">
                    <p>© {new Date().getFullYear()} Youth Entrepreneur Network</p>
                    <p>Built for Success • Growing Founders</p>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
