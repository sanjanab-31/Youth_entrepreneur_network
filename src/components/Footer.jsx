import React from 'react';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brand-black border-t border-white/5 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-6">Vanguard</h3>
                        <p className="text-brand-muted text-sm leading-relaxed mb-6">
                            A structured startup execution platform where founders find co-founders, connect with mentors, and access incubator opportunities.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:bg-brand-purple hover:text-white transition-all">
                                <Twitter size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:bg-brand-purple hover:text-white transition-all">
                                <Linkedin size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:bg-brand-purple hover:text-white transition-all">
                                <Github size={14} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-brand-muted">
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Enterprise</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-brand-muted">
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-brand-muted">
                            <li><a href="#" className="hover:text-brand-purple transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-brand-muted">
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Terms</a></li>
                            <li><a href="#" className="hover:text-brand-purple transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-brand-muted">© 2024 Vanguard Platform Inc. All rights reserved.</p>
                    <div className="flex gap-8 text-xs text-brand-muted">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
