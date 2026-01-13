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

            <div className="relative z-10 mx-auto px-6 pt-40 md:pt-56 pb-20">
                <div className="flex items-center justify-center text-center">

                    {/* CONTENT */}
                    <div className="space-y-6 text-center max-w-4xl">
                        <div className="type-h3 tracking-wide">
                            Education • Innovation • Startups
                        </div>

                        <h1 className="type-display px-4 md:px-0">
                            Where Founders Become Leaders
                        </h1>

                        <p className="type-body-lg max-w-2xl mx-auto px-4">
                            The all-in-one platform where young founders learn, connect,
                            and grow real startups.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 justify-center px-6">
                            <button className="group relative btn-base bg-gradient-to-r from-purple-600 to-violet-600 overflow-hidden text-white hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button className="btn-base text-white border-2 border-purple-500/50 backdrop-blur-xl bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30">
                                <div className="flex items-center justify-center gap-2">
                                    Explore Platform
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
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
