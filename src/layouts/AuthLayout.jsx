
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0F0F14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-1/4 w-full h-64 bg-indigo-600/10 rounded-full blur-[120px]" />

            {/* Main Content Container */}
            <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
                {/* Logo or Brand header can go here if needed across all auth pages */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white tracking-tight">
                        VANGUARD
                    </h1>
                </div>

                {children}
            </main>
        </div>
    );
};

export default AuthLayout;
