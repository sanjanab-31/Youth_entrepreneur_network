import React from 'react';
import { Twitter, Youtube, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#111111] text-gray-400 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

                    {/* Left Section: Branding */}
                    <div className="flex-shrink-0">
                        <span className="text-3xl font-bold text-white tracking-wider">YEN Footer</span>
                    </div>

                    {/* Vertical Separator (Only desktop) */}
                    <div className="hidden md:block w-px h-16 bg-gray-800 mx-12"></div>

                    {/* Middle Section: Links & Copyright */}
                    <div className="flex-grow flex flex-col items-center md:items-start space-y-2">
                        <nav className="flex items-center space-x-6">
                            <a href="#about" className="hover:text-white transition-colors text-sm font-medium">About</a>
                            <a href="#benefits" className="hover:text-white transition-colors text-sm font-medium">Benefits</a>
                            <a href="#career" className="hover:text-white transition-colors text-sm font-medium">Career</a>
                            <a href="#support" className="hover:text-white transition-colors text-sm font-medium">Support</a>
                        </nav>
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Mudassar. All right reserved.
                        </p>
                    </div>

                    {/* Right Section: Social & Support */}
                    <div className="flex flex-col items-center md:items-end space-y-3">
                        <div className="flex items-center space-x-5">
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors text-gray-400">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors text-gray-400">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            Support: <span className="text-gray-400">mudassar@gmail.com</span>
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
