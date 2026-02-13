import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0F0F14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-violet-600/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-1/4 w-full h-64 bg-indigo-600/5 rounded-full blur-[120px]" />

            {/* Main Content Container */}
            <main className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                {/* Logo Section */}
                <div className="mb-12 text-center group">
                    <Link to="/" className="inline-flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-purple/20 p-3 group-hover:bg-brand-purple/30 transition-all duration-500 border border-brand-purple/30 flex items-center justify-center transform group-hover:rotate-6 shadow-2xl shadow-purple-900/40">
                                <img
                                    src={logo}
                                    alt="Vanguard Logo"
                                    className="w-full h-full object-contain rounded-xl mix-blend-screen"
                                />
                            </div>
                            <div className="absolute -inset-2 bg-brand-purple/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter text-white transition-colors leading-none">Vanguard</span>
                            <span className="text-xs font-bold text-brand-purple tracking-[0.4em] uppercase leading-none mt-2">Ecosystem</span>
                        </div>
                    </Link>
                </div>

                {children}
            </main>
        </div>
    );
};

export default AuthLayout;
