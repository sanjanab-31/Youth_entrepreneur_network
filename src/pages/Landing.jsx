import React from 'react';

import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhoCanUseYEN from '../components/WhoCanUseYEN';
import HeroSection from '../components/HeroSection';

const Landing = () => {



    // TESTIMONIALS CONFIGURATION - EASY MANUAL SIZE ADJUSTMENT
    const testimonialWidth = "150px";  // Change pixels here
    const testimonialHeight = "190px"; // Change pixels here

    const testimonialItems = [
        { left: "-9.8%", top: "12%", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop" },
        { left: "-9.8%", top: "45%", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop" },
        { left: "3.5%", top: "2%", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop" },
        { left: "3.5%", top: "34%", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&h=600&fit=crop" },
        { left: "17%", top: "12%", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=600&fit=crop" },
        { left: "30.5%", top: "-3%", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop" },
        { left: "44%", top: "7%", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop" },
        { left: "57.5%", top: "-3%", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop" },
        { left: "71%", top: "12%", img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=600&fit=crop" },
        { left: "84.5%", top: "2%", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop" },
        { left: "84.5%", top: "34%", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop", zIndex: 20 },
        { left: "97.5%", top: "12%", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop" },
        { left: "97.5%", top: "45%", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop" },
    ];



    // GRID CONFIGURATION - Change size and positions for background squares
    const gridTileSize = "150px";
    const gridTileSizee = "180px";
    const testimonialGridItems = [
        { left: "1.5%", top: "-2%" },
        { left: "12.5%", top: "-9%" },
        { left: "23.5%", top: "-2%" },
        { left: "34.3%", top: "-12%" },
        { left: "45.3%", top: "-5%" },
        { left: "56%", top: "-12%" },
        { left: "67%", top: "-2%" },
        { left: "78%", top: "-9%" },
        { left: "88.5%", top: "-2%" },
    ];


    return (
        <div className="min-h-screen">
            <Header/>
            {/* New Hero Section with Purple Globe */}
            <HeroSection />



            {/* WHO CAN USE YEN SECTION */}
            <WhoCanUseYEN />
            {/* TESTIMONIALS SECTION */}
            <section className="py-32 bg-sky-950 overflow-hidden relative" id="testimonials">

                {/* Background Decoration - Manual Grid */}
                <div
                    className="absolute inset-0 opacity-[0.1] pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                    }}
                >
                    {testimonialGridItems.map((grid, i) => (
                        <div
                            key={i}
                            className="bg-sky-500 rounded-xl absolute"
                            style={{
                                left: grid.left,
                                top: grid.top,
                                width: gridTileSize,
                                height: gridTileSizee
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">

                    {/* Vertical Lines */}
                    <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/5 pointer-events-none"></div>
                    <div className="absolute top-0 bottom-0 left-[85%] w-px bg-white/5 pointer-events-none"></div>

                    {/* Floating Faces Cloud */}
                    <div className="relative h-[650px] -mb-80">
                        {testimonialItems.map((item, index) => (
                            <div
                                key={index}
                                className="absolute rounded-2xl overflow-hidden shadow-xl transition-all duration-700 hover:scale-110 hover:z-50 group bg-white/5 backdrop-blur-md ring-1 ring-white/10"
                                style={{
                                    left: item.left,
                                    top: item.top,
                                    width: testimonialWidth,
                                    height: testimonialHeight,
                                    zIndex: item.zIndex || 1
                                }}
                            >
                                <img
                                    src={item.img}
                                    alt="Leader"
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                />

                                {/* Premium light overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent group-hover:from-sky-500/30 transition-all"></div>
                            </div>
                        ))}
                    </div>

                    {/* Center Content */}
                    <div className="text-center relative z-30 max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-sky-900/50 text-sky-400 mb-6 border border-sky-800/50 backdrop-blur-sm type-label">
                            Real Impact
                        </div>

                        <h2 className="type-h2 text-white mb-6 tracking-tight leading-tight">
                            Trusted by <span className="text-sky-500">Visionaries</span>
                        </h2>

                        <p className="type-body text-sky-100/70 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                            Join thousands of founders who have accelerated their growth through our professional network.
                        </p>

                        <button
                            className="bg-sky-500 text-white px-12 py-5 rounded-full font-bold flex items-center gap-3 mx-auto hover:bg-sky-400 transition-all group shadow-2xl shadow-sky-900/50 transform hover:-translate-y-1"
                        >
                            Read Success Stories
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
};

export default Landing;
