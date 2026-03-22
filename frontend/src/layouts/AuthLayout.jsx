import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const AuthLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen bg-[#0F0F14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-violet-600/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-1/4 w-full h-64 bg-indigo-600/5 rounded-full blur-[120px]" />

            {/* Main Content Container */}
            <main className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;
