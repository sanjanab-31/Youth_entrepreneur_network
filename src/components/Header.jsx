import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, ArrowUpRight } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-8 inset-x-0 z-50 flex items-center justify-center pointer-events-none px-">
            <div className="flex items-center gap-4 w-full max-w-[1400px]">

                {/* Left: Logo & Contact */}
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div
                        className="pl-2 pr-5 py-2 flex items-center gap-3 cursor-pointer  group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-9 h-9 ">
                            <img src={logo} alt="YEN Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-gray-900">YEN</span>
                    </div>

                    <button className="glass-effect rounded-full px-5 py-2.5 flex items-center gap-2 border border-white/40 shadow-xl shadow-emerald-900/5 hover:bg-emerald-50 transition-all text-sm font-bold text-gray-700">
                        Contact Us
                        <Plus className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                </div>

                {/* Center: Navigation Pill */}
                <nav className="hidden lg:flex flex-1 items-center justify-center pointer-events-auto mx-4">
                    <div className="glass-effect rounded-full px-6 py-2.5 border border-white/40 shadow-xl shadow-emerald-900/5 flex items-center gap-7">
                        <a href="/" className="text-gray-900 hover:text-emerald-600 transition-colors">
                            <Home className="w-5 h-5 focus-ring-emerald-500" />
                        </a>
                        {['About', 'Benefits', 'App', 'Features', 'Reviews', 'Plans'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 pointer-events-auto ml-auto">
                    
                    <button
                        onClick={() => navigate('/portal-select/login')}
                        className="bg-gray-900 text-white rounded-full pl-6 pr-0 text-sm font-bold hover:bg-black transition-all flex items-center gap-2"
                    >
                        Login
                        <button
                        onClick={() => navigate('/portal-select/signup')}
                        className="bg-white text-gray-900 rounded-full px-6 py-3 text-sm font-bold hover:bg-emerald-50 transition-all flex items-center gap-3 whitespace-nowrap"
                    >
                        Start Growing
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                    </button>
                    </button>
                    
                    
                </div>

            </div>
        </header>
    );
};

export default Header;

