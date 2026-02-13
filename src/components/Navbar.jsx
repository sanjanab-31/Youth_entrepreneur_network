import React from 'react';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-purple/20 p-2 group-hover:bg-brand-purple/40 transition-colors border border-brand-purple/30 flex items-center justify-center">
                        <img
                            src={logo}
                            alt="Vanguard Logo"
                            className="w-full h-full object-contain rounded-full mix-blend-screen"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-purple transition-colors">Vanguard</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#about" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">About</a>
                    <a href="#features" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Features</a>
                    <a href="#founders" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">For Founders</a>
                    <a href="#mentors" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">For Mentors</a>
                    <a href="#incubators" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">For Incubators</a>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <Link to="/auth/login?role=founder" className="hidden sm:block px-5 py-2 rounded-full border border-brand-purple text-brand-purple text-sm font-medium hover:bg-brand-purple/10 transition-all">
                        Login
                    </Link>
                    <Link to="/auth/role-selection" className="px-5 py-2 rounded-full bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple-hover shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
