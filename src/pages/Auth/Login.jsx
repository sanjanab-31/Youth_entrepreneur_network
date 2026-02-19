
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const role = searchParams.get('role') || 'founder'; // Default to founder if no role specified

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log("Attempting login with role:", role);
            await login(email, password, role);
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please try again.');
            } else if (err.code === 'auth/profile-not-found') {
                setError('Account found but local profile data is missing. Please sign up again to restore your dashboard access.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('An error occurred during login. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = () => {
        navigate(`/auth/signup?role=${role}`);
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md mx-auto">
                <div className="bg-[#1E1E2F]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-3xl relative overflow-hidden">
                    <div className="flex items-center gap-5 mb-10 pb-6 border-b border-white/5">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-purple/30 to-brand-purple/5 p-3 border border-brand-purple/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
                                <img
                                    src={logo}
                                    alt="Vanguard Logo"
                                    className="w-full h-full object-contain mix-blend-screen"
                                />
                            </div>
                            <div className="absolute -inset-2 bg-brand-purple/20 blur-xl rounded-full opacity-50" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-2">Welcome Back</h2>
                            <p className="text-brand-purple/80 text-[10px] font-bold tracking-[0.3em] uppercase leading-none">
                                {role} Portal
                            </p>
                        </div>
                    </div>


                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center">
                            <span className="flex-1">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                                placeholder="name@vanguard.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {role !== 'admin' && (
                        <div className="mt-6 pt-6 border-t border-white/5 text-center">
                            <p className="text-gray-400/80 text-sm mb-4">Don't have an account yet?</p>
                            <button
                                onClick={handleCreateAccount}
                                className="w-full bg-white/5 border border-white/10 text-white/90 font-medium py-3 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                Create Account
                            </button>
                        </div>
                    )}
                </div>

                {role !== 'admin' && (
                    <button
                        onClick={() => navigate('/auth/role-selection')}
                        className="w-full mt-6 text-gray-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        ← Back to Role Selection
                    </button>
                )}
            </div>
        </AuthLayout>
    );
};

export default Login;
