import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"> */}
                        {/* <span className="text-white font-bold text-xl">Y</span> */}
                    {/* </div> */}
                    <span className="text-2xl font-bold text-gray-900">YEN</span>
                </div>

                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">About</a>
                    <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Benefits</a>
                    <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
                    <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Contact Us</a>
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/portal-select/login')}
                        className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/portal-select/signup')}
                        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-medium"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
