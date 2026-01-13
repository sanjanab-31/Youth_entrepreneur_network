import React from 'react';
import { Twitter, Youtube, Instagram, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-20 border-t border-purple-900/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 overflow-hidden rounded-xl border border-purple-500/20 shadow-lg shadow-purple-900/20">
                                <img src={logo} alt="YEN" className="w-full h-full object-cover" />
                            </div>
                            <span className="type-h3 tracking-tight">YEN</span>
                        </div>
                        <p className="type-small leading-relaxed max-w-xs">
                            Empowering the next generation of founders with a world-class startup ecosystem.
                        </p>
                    </div>

                    {/* Navigation Section */}
                    <div className="sm:col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h4 className="type-label tracking-widest text-white">Platform</h4>
                            <nav className="flex flex-col space-y-3 type-small">
                                <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
                                <a href="#benefits" className="hover:text-purple-400 transition-colors">Benefits</a>
                                <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How it Works</a>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h4 className="type-label tracking-widest text-white">Company</h4>
                            <nav className="flex flex-col space-y-3 type-small">
                                <a href="/about" className="hover:text-purple-400 transition-colors">About Us</a>
                                <a href="/careers" className="hover:text-purple-400 transition-colors">Careers</a>
                                <a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h4 className="type-label tracking-widest text-white">Support</h4>
                            <nav className="flex flex-col space-y-3 type-small">
                                <a href="/help" className="hover:text-purple-400 transition-colors">Help Center</a>
                                <a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</a>
                                <a href="/terms" className="hover:text-purple-400 transition-colors">Terms</a>
                            </nav>
                        </div>
                    </div>

                    {/* Contact/Social Section */}
                    <div className="space-y-6">
                        <h4 className="type-label tracking-widest text-white">Follow Us</h4>
                        <div className="flex items-center space-x-4">
                            {[Twitter, Youtube, Instagram, MessageCircle].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all transform hover:-translate-y-1 border border-white/5">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <div className="pt-4">
                            <p className="type-label text-purple-500 mb-1">Contact Support</p>
                            <p className="type-small text-white font-medium">hello@yennetwork.com</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/20">
                    <p>© {new Date().getFullYear()} Youth Entrepreneur Network</p>
                    <p>Built for Success • Growing Founders</p>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
