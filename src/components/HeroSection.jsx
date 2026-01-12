import React from "react";
import { ArrowRight } from "lucide-react";
import herobg from "../assets/herobg.png";

const HeroSection = () => {

    return (
        <section
            className="relative h-[100vh] overflow-hidden bg-black"
            style={{
                backgroundImage: `url(${herobg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 mx-auto px-6 pt-56 pb-20">
                <div className="flex items-center justify-center text-center">

                    {/* CONTENT */}
                    <div className="space-y-6 text-center">
                        <div className="text-2xl font-semibold text-white tracking-wide leading-relaxed">
                            Education • Innovation • Startups
                        </div>

                        <h1 className="text-7xl font-semibold leading-[0.95] tracking-tight text-white">
                            Where Founders Become Leaders
                        </h1>

                        <p className="text-xl text-white leading-relaxed font-medium">
                            The all-in-one platform where young founders learn, connect,
                            and grow real startups.
                        </p>

                        <div className="flex gap-6 pt-6 justify-center">
                            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button className="px-8 py-4 rounded-full font-bold text-white border-2 border-purple-500/50 backdrop-blur-xl bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                                <div className="flex items-center gap-2">
                                    Explore Platform
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </section>
    );
};

export default HeroSection;
