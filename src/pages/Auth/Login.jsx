
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

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
            await login(email, password, role);
            // Redirect handled inside login for simplicity, but cleaner to handle here? UseAuth logic redirects.
        } catch (err) {
            setError('Invalid credentials. Please try again.');
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
                <div className="bg-[#1E1E2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Subtle top accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500" />

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400 capitalize">Login as {role}</p>
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
