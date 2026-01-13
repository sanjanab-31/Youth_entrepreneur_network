import React from 'react';

import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhoCanUseYEN from '../components/WhoCanUseYEN';
import HeroSection from '../components/HeroSection';
import WhyYENSection from '../components/WhyYENSection';

const Landing = () => {






    return (
        <div className="min-h-screen">
            <Header />
            {/* New Hero Section with Purple Globe */}
            <HeroSection />

            {/* WHY YEN SECTION */}
            <WhyYENSection />

            {/* WHO CAN USE YEN SECTION */}
            <WhoCanUseYEN />







            <Footer />
        </div>
    );
};

export default Landing;
