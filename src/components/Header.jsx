import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, ArrowUpRight } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 md:top-8 inset-x-0 z-50 flex items-center justify-center pointer-events-none px-4 md:px-0">
            <div className="flex items-center justify-between gap-2 md:gap-4 w-full max-w-[1400px] pt-4 md:pt-0">

                {/* Left: Logo & Contact */}
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div
                        className="pl-2 pr-2 md:pr-5 py-2 flex items-center gap-2 md:gap-3 cursor-pointer group bg-black/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-full border border-white/10 md:border-transparent"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9">
                            <img src={logo} alt="YEN Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg" />
                        </div>
                        <span className="type-h3 text-white">YEN</span>
                    </div>

                    <button className="hidden md:flex glass-effect rounded-full px-5 py-2.5 items-center gap-2 border border-white/20 shadow-xl backdrop-blur-md hover:bg-white/10 transition-all type-small font-bold text-white">
                        Contact Us
                        <Plus className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                </div>

                {/* Center: Navigation Pill */}
                <nav className="hidden xl:flex flex-1 items-center justify-center pointer-events-auto mx-4">
                    <div className="glass-effect rounded-full px-6 py-2.5 border border-white/20 shadow-xl backdrop-blur-md flex items-center gap-7">
                        <a href="/" className="text-white/80 hover:text-white transition-colors">
                            <Home className="w-5 h-5" />
                        </a>
                        {['About', 'Benefits', 'App', 'Features', 'Reviews', 'Plans'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="type-small font-bold text-white/60 hover:text-white transition-colors whitespace-nowrap"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 pointer-events-auto ml-auto">

                    <div className="bg-black/50 md:bg-white/10 backdrop-blur-md rounded-full pl-4 md:pl-2 pr-1 py-1 flex items-center gap-2 border border-white/20">
                        <button
                            onClick={() => navigate('/portal-select/login')}
                            className="type-small font-bold text-white hover:text-purple-300 transition-colors px-4"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/portal-select/signup')}
                            className="btn-sm bg-white text-gray-900 hover:bg-purple-50"
                        >
                            <span className="hidden xs:inline">Start Growing</span>
                            <span className="xs:hidden">Join</span>
                            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                                <ArrowUpRight className="w-3 h-3 text-purple-600" />
                            </div>
                        </button>
                    </div>

                </div>

            </div>
        </header>
    );
};

export default Header;

