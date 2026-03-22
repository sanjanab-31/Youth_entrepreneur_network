import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Platform",
            links: ["Features", "Founder Program", "Mentor Network", "Incubator Hub"]
        },
        {
            title: "Company",
            links: ["About Us", "Contact", "Privacy Policy", "Terms of Service"]
        }
    ];

    const socialLinks = [
        { icon: <Twitter size={18} />, href: "#", name: "Twitter" },
        { icon: <Linkedin size={18} />, href: "#", name: "LinkedIn" },
        { icon: <Github size={18} />, href: "#", name: "GitHub" },
        { icon: <Mail size={18} />, href: "#", name: "Email" },
    ];

    return (
        <footer className="relative bg-brand-black pt-24 pb-12 overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-5">
                        <Link to="/" className="flex items-center gap-3 group mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-purple/5 border border-brand-purple/30 flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                                <span className="text-xl font-black text-brand-purple">V</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase group-hover:text-brand-purple transition-colors duration-300">
                                VANGUARD
                            </span>
                        </Link>
                        <p className="text-brand-muted text-lg leading-relaxed max-w-md mb-10">
                            The premier ecosystem for serious founders. We replace chaos with structured execution to accelerate your startup's growth.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -4 }}
                                    className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-brand-muted hover:text-white hover:border-brand-purple/50 transition-all duration-300 group"
                                    title={social.name}
                                >
                                    <div className="relative z-10">{social.icon}</div>
                                    <div className="absolute inset-0 bg-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                            {footerLinks.map((column, i) => (
                                <div key={i}>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">
                                        {column.title}
                                    </h4>
                                    <ul className="space-y-4">
                                        {column.links.map((link, j) => (
                                            <li key={j}>
                                                <a
                                                    href="#"
                                                    className="group flex items-center gap-2 text-brand-muted hover:text-white transition-all duration-300"
                                                >
                                                    <span className="text-[15px]">{link}</span>
                                                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* Newsletter / Contact Hint */}
                            <div className="col-span-2 md:col-span-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-8">
                                    Join the Elite
                                </h4>
                                <div className="space-y-4">
                                    <p className="text-sm text-brand-muted leading-relaxed">
                                        Get exclusive insights on startup execution.
                                    </p>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            placeholder="Enter email"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple/50 transition-all"
                                        />
                                        <button className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-brand-purple text-white hover:bg-brand-purple-hover transition-colors">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
                        <p className="text-sm text-brand-muted/60">
                            © {currentYear} Vanguard Ecosystem. All rights reserved.
                        </p>
                        <div className="h-4 w-px bg-white/5 hidden md:block" />
                        <div className="flex gap-6 text-sm text-brand-muted/60">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-brand-muted tracking-widest uppercase">
                            Systems Operational
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </footer>
    );
};

export default Footer;

