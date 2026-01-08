import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const cards = [
    {
        label: "Startup Founders",
        title: "Build. Launch. Scale.",
        description: "YEN gives young founders a structured path from idea to execution. Create a startup profile, track progress, connect with mentors, join incubator programs, and pitch directly to investors — all in one platform.",
        footerTitle: "For: Student Entrepreneurs & Early-Stage Founders",
        footerSub: "People turning ideas into real startups",
        role: "Founders",
        color: "from-emerald-600 to-emerald-400",
        accent: "text-emerald-600",
        bgAccent: "bg-emerald-600",
        borderColor: "border-emerald-100",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
    },
    {
        label: "Startup Mentors",
        title: "Guide the Next Unicorns",
        description: "YEN allows experienced founders, professionals, and industry experts to discover promising startups, provide 1-on-1 guidance, join accelerator programs, and help shape the next generation of entrepreneurs.",
        footerTitle: "For: Mentors, Coaches & Industry Experts",
        footerSub: "People who guide startups to success",
        role: "Mentors",
        color: "from-blue-600 to-blue-400",
        accent: "text-blue-600",
        bgAccent: "bg-blue-600",
        borderColor: "border-blue-100",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop",
    },
    {
        label: "Startup Investors",
        title: "Discover High-Potential Startups",
        description: "YEN gives investors access to verified early-stage startups, structured pitch decks, founder traction, and incubator-backed teams — making it easier to find and fund the right opportunities.",
        footerTitle: "For: Angel Investors & Venture Funds",
        footerSub: "People who back future-defining startups",
        role: "Investors",
        color: "from-amber-600 to-amber-400",
        accent: "text-amber-600",
        bgAccent: "bg-amber-600",
        borderColor: "border-amber-100",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=800&fit=crop",
    },
    {
        label: "Incubators & Institutions",
        title: "Run Startups at Scale",
        description: "YEN enables incubators and colleges to manage startup cohorts, track founder progress, host demo days, and showcase their ecosystem — all from a centralized digital dashboard.",
        footerTitle: "For: Incubators, Accelerators & Colleges",
        footerSub: "Organizations that build startup ecosystems",
        role: "Incubators & Colleges",
        color: "from-rose-600 to-rose-400",
        accent: "text-rose-600",
        bgAccent: "bg-rose-600",
        borderColor: "border-rose-100",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
    },
];

const Card = ({ card, index, progress, targetScale, range }) => {
    const scale = useTransform(progress, range, [1, targetScale]);
    const opacity = useTransform(progress, range, [1, 0.4]);
    const blur = useTransform(progress, range, [0, 8]);

    return (
        <div className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{
                    scale,
                    filter: `blur(${blur}px)`,
                    opacity,
                    top: `calc(2vh + ${index * 20}px)`,
                }}
                className="relative w-full max-w-7xl h-[60vh] md:h-[65vh] bg-white rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-gray-50 group"
            >
                {/* Step Indicator (1, 2, 3, 4) */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20">
                    {cards.map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${i === index
                                    ? `${card.bgAccent} text-white scale-110 shadow-lg`
                                    : "bg-gray-100 text-gray-400"
                                }`}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Left Side: Content */}
                <div className="flex-[1.2] p-10 md:p-16 lg:pl-32 lg:pr-10 flex flex-col justify-between relative z-10">
                    <div className="space-y-6">
                        <div className={`inline-flex px-4 py-1.5 rounded-full border-2 ${card.borderColor} ${card.accent} text-[11px] font-black uppercase tracking-[0.2em]`}>
                            {card.label}
                        </div>

                        <h3 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight">
                            {card.title}
                        </h3>

                        <p className="text-md text-gray-500 leading-relaxed max-w-lg font-medium">
                            {card.description}
                        </p>
                    </div>

                    {/* Footer Style Infobox */}
                    <div className="mt-2 pt-4">
                        <p className="text-sm font-bold text-gray-900 mb-1">{card.footerTitle}</p>
                        <p className="text-xs text-gray-500">{card.footerSub}</p>
                    </div>
                </div>

                {/* Right Side: Image with Floating Button */}
                <div className="flex-1 relative h-full overflow-hidden p-6 md:p-12">
                    <div className="absolute inset-x-0 inset-y-0 z-10 w-full h-full pointer-events-none" />

                    <div className="relative w-full h-full overflow-hidden rounded-[60px]">
                        <motion.img
                            initial={{ scale: 1.1, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Ask-me-style Button Overlay */}
                        <div className="absolute bottom-5 right-5 flex items-center justify-center">
                            <button className="bg-black/90 backdrop-blur-md rounded-full pl-6 pr-1.5 py-1.5 flex items-center  gap-2 w-full border border-white/10 hover:scale-[1.02] transition-transform duration-300">
                                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">Explore more</span>
                                <div className={`w-8 h-8 ${card.bgAccent} rounded-full flex items-center justify-center `}>
                                    <ArrowUpRight className="w-4 h-4 text-white" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const WhoCanUseYEN = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <section ref={container} className="relative bg-[#f8fafc] ">
            <div className="max-w-7xl mx-auto pt-10 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-gray-950 mb-6 tracking-tight">
                        Built For Every <span className="text-emerald-500">Startup Role</span>
                    </h2>
                    <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Whether you’re building, guiding, funding, or scaling — YEN gives you the tools to win.
                    </p>
                </motion.div>
            </div>

            <div className="relative">
                {cards.map((card, index) => {
                    const targetScale = 1 - ((cards.length - index) * 0.05);
                    const end = (index + 1) * 0.25;

                    return (
                        <Card
                            key={index}
                            card={card}
                            index={index}
                            progress={scrollYProgress}
                            range={[end, end + 0.1]}
                            targetScale={targetScale}
                        />
                    );
                })}
            </div>

            <div className="h-[50vh]" />
        </section>
    );
};

export default WhoCanUseYEN;
