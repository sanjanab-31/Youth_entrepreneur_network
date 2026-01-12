import React from "react";

const WhyYENSection = () => {
    const features = [
        {
            title: "Startup Profiles",
            description: "Your startup lives here — team, idea, traction, and growth.",
        },
        {
            title: "Founder Learning Hub",
            description: "Learn how to build, pitch, and scale real companies.",
        },
        {
            title: "Mentor Access",
            description: "Get guidance from experienced founders and experts.",
        },
        {
            title: "Investor Discovery",
            description: "Pitch your startup and get funding opportunities.",
        },
        {
            title: "Incubator Programs",
            description: "Join structured startup cohorts and accelerators.",
        },
        {
            title: "Community Network",
            description: "Connect with students, founders, and builders.",
        },
        {
            title: "Events & Demo Days",
            description: "Showcase your startup to investors and mentors.",
        },
        {
            title: "Collaboration Tools",
            description: "Chat, share files, and work as a startup team.",
        },
        {
            title: "Progress Tracking",
            description: "Track milestones, goals, and startup growth.",
        },
        {
            title: "Opportunity Board",
            description: "Find internships, co-founders, and startup roles.",
        },
    ];

    return (
        <section className="relative min-h-screen bg-black py-24 px-6 overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-medium text-white leading-tight ">
                            Why Youth Entrepreneur Network
                        </h2>

                        <div className="relative w-full h-[500px] mb-8 flex items-center justify-center scale-90 mt-25">
                            {/* Circular Rings with fading gradient */}
                            <div className="absolute w-[250px] h-[250px] rounded-full p-[1px] opacity-60" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent)' }}>
                                <div className="w-full h-full rounded-full bg-black"></div>
                            </div>
                            <div className="absolute w-[350px] h-[350px] rounded-full p-[1px] opacity-40" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent)' }}>
                                <div className="w-full h-full rounded-full bg-black"></div>
                            </div>
                            <div className="absolute w-[450px] h-[450px] rounded-full p-[1px] opacity-30" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent)' }}>
                                <div className="w-full h-full rounded-full bg-black"></div>
                            </div>
                            <div className="absolute w-[550px] h-[550px] rounded-full p-[1px] opacity-20" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1),  transparent)' }}>
                                <div className="w-full h-full rounded-full bg-black"></div>
                            </div>
                            <div className="absolute w-[650px] h-[650px] rounded-full p-[1px] opacity-30" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent)' }}>
                                <div className="w-full h-full rounded-full bg-black"></div>
                            </div>
                            {/* Center Visual */}
                            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                                <div className="text-sm font-bold text-purple-400 mb-1">FOUNDER ENGINE</div>
                                <div className="text-4xl font-bold text-white mb-4">Startup<br />Universe</div>
                                <button className="px-6 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full text-xs font-bold text-white hover:bg-purple-600/30 transition-all">
                                    Join Network
                                </button>
                            </div>

                            {/* Static Background Glow */}
                            <div className="absolute w-80 h-80 rounded-full bg-purple-600/10 blur-[100px]"></div>

                            {/* Premium Profile Pills */}
                            {/* Top Right */}
                            <div className="absolute top-[10%] right-[0%] z-20 flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(167,139,250,0.1)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <div className="w-6 h-6 rounded-full bg-purple-400/30"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-white leading-tight">Malick Murtaza</span>
                                    <span className="text-[10px] text-purple-400 font-medium">CEO PRODIGI</span>
                                </div>
                            </div>

                            {/* Center Left */}
                            <div className="absolute top-[45%] -left-[15%] z-20 flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(167,139,250,0.1)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <div className="w-6 h-6 rounded-full bg-purple-400/30"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-white leading-tight">Syed Muhammad</span>
                                    <span className="text-[10px] text-purple-400 font-medium">CTO PRODIGI</span>
                                </div>
                            </div>

                            {/* Bottom Right */}
                            <div className="absolute bottom-[10%] right-[5%] z-20 flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(167,139,250,0.1)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <div className="w-6 h-6 rounded-full bg-purple-400/30"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-white leading-tight">Saifullah Mushtaq</span>
                                    <span className="text-[10px] text-purple-400 font-medium">Web Developer</span>
                                </div>
                            </div>

                            {/* Top Left */}
                            <div className="absolute top-[5%] left-[5%] z-20 flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(167,139,250,0.1)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        <div className="w-6 h-6 rounded-full bg-purple-400/30"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-white leading-tight">Haseeb Arshad</span>
                                    <span className="text-[10px] text-purple-400 font-medium">3D Lead</span>
                                </div>
                            </div>

                            {/* Small static dots */}
                            <div className="absolute top-[-2.5%] left-[35%] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]"></div>
                            <div className="absolute bottom-[30%] left-[16.5%] w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(167,139,250,0.3)]"></div>
                            <div className="absolute top-[50%] right-[13%] w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(167,139,250,0.5)]"></div>
                            <div className="absolute top-[17%] left-[60%] w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(167,139,250,0.3)]"></div>
                            <div className="absolute top-[30%] left-[8%] w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(167,139,250,0.3)]"></div>

                            {/* Repositioned sentence */}
                            <p className="absolute bottom-[5%] left-[0%] z-30 text-2xl text-gray-300 leading-relaxed max-w-[320px]">
                                It's not just a community, but a real startup engine.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative p-3 rounded-2xl bg-gradient-to-br from-purple-950/40 via-black/60 to-violet-950/40 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30"
                                style={{
                                    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
                                }}
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-violet-500/0 group-hover:from-purple-500/10 group-hover:via-violet-500/5 group-hover:to-purple-500/10 transition-all duration-300"></div>

                                <div className="relative z-10">
                                    <h3 className="text-[16px] font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[14px] text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </section>
    );
};

export default WhyYENSection;
