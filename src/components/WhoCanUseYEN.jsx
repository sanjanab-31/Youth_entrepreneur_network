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
        color: "from-purple-600 to-violet-400",
        accent: "text-purple-400",
        bgAccent: "bg-purple-600",
        borderColor: "border-purple-500/30",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
    },
    {
        label: "Startup Mentors",
        title: "Guide the Next Unicorns",
        description: "YEN allows experienced founders, professionals, and industry experts to discover promising startups, provide 1-on-1 guidance, join accelerator programs, and help shape the next generation of entrepreneurs.",
        footerTitle: "For: Mentors, Coaches & Industry Experts",
        footerSub: "People who guide startups to success",
        role: "Mentors",
        color: "from-purple-600 to-violet-400",
        accent: "text-purple-400",
        bgAccent: "bg-purple-600",
        borderColor: "border-purple-500/30",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop",
    },
    {
        label: "Startup Investors",
        title: "Discover High-Potential Startups",
        description: "YEN gives investors access to verified early-stage startups, structured pitch decks, founder traction, and incubator-backed teams — making it easier to find and fund the right opportunities.",
        footerTitle: "For: Angel Investors & Venture Funds",
        footerSub: "People who back future-defining startups",
        role: "Investors",
        color: "from-purple-600 to-violet-400",
        accent: "text-purple-400",
        bgAccent: "bg-purple-600",
        borderColor: "border-purple-500/30",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&h=800&fit=crop",
    },
    {
        label: "Incubators & Institutions",
        title: "Run Startups at Scale",
        description: "YEN enables incubators and colleges to manage startup cohorts, track founder progress, host demo days, and showcase their ecosystem — all from a centralized digital dashboard.",
        footerTitle: "For: Incubators, Accelerators & Colleges",
        footerSub: "Organizations that build startup ecosystems",
        role: "Incubators & Colleges",
        color: "from-purple-600 to-violet-400",
        accent: "text-purple-400",
        bgAccent: "bg-purple-600",
        borderColor: "border-purple-500/30",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
    },
];

const Card = ({ card, index, progress, targetScale, range }) => {
    const scale = useTransform(progress, range, [1, targetScale]);
    const opacity = useTransform(progress, range, [1, 0.4]);
    const blur = useTransform(progress, range, [0, 8]);

    return (
        <div className="h-auto md:h-screen flex items-center justify-center relative md:sticky md:top-0 py-10 md:py-0">
            <motion.div
                style={{
                    scale,
                    filter: `blur(${blur}px)`,
                    opacity,
                    top: `calc(2vh + ${index * 20}px)`,
                }}
                className="relative w-full max-w-7xl h-[80vh] md:h-[65vh] bg-neutral-900/40 backdrop-blur-3xl rounded-[2rem] md:rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-purple-500/20 group"
            >
                {/* Step Indicator (1, 2, 3, 4) */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20">
                    {cards.map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${i === index
                                ? `${card.bgAccent} text-white scale-110 shadow-[0_0_15px_rgba(168,85,247,0.4)]`
                                : "bg-white/5 text-gray-500 border border-white/10"
                                }`}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Left Side: Content */}
                <div className="flex-[1.2] p-8 md:p-16 lg:pl-32 lg:pr-10 flex flex-col justify-between relative z-10">
                    <div className="space-y-4 md:space-y-6">
                        <div className={`inline-flex px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 ${card.accent} type-label`}>
                            {card.label}
                        </div>

                        <h3 className="type-h2 leading-tight">
                            {card.title}
                        </h3>

                        <p className="type-body-lg max-w-lg">
                            {card.description}
                        </p>
                    </div>

                    {/* Footer Style Infobox */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="type-label text-white mb-1">{card.footerTitle}</p>
                        <p className="type-small text-purple-400/80">{card.footerSub}</p>
                    </div>
                </div>

                {/* Right Side: Image with Floating Button */}
                <div className="flex-1 relative h-48 md:h-full overflow-hidden p-4 md:p-12">
                    <div className="absolute inset-x-0 inset-y-0 z-10 w-full h-full pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    <div className="relative w-full h-full overflow-hidden rounded-[20px] md:rounded-[40px] border border-white/10 shadow-2xl">
                        <motion.img
                            initial={{ scale: 1.1, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        />

                        <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 flex items-center justify-center translate-z-10">
                            <button className="btn-sm bg-black/80 backdrop-blur-xl border border-white/20 hover:border-purple-500/50 hover:scale-[1.05] group/btn">
                                <span className="uppercase tracking-widest text-[10px]">Connect Now</span>
                                <div className={`w-6 h-6 md:w-8 md:h-8 ${card.bgAccent} rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover/btn:scale-110 transition-transform`}>
                                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative background glow inside card */}
                <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none"></div>
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
        <section ref={container} className="relative bg-black">
            {/* Top background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-purple-900/10 blur-[160px] pointer-events-none rounded-full"></div>

            <div className="max-w-7xl mx-auto pt-10 px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="type-h1 mb-6">
                        Built For Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500">Startup Role</span>
                    </h2>
                    <p className="type-body-lg max-w-3xl mx-auto mb-10">
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

            <div className="h-[10vh]" />
        </section>
    );
};

export default WhoCanUseYEN;
