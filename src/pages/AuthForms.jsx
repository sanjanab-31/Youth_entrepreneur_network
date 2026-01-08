import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AuthForms = ({ type }) => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({});

    const isLogin = type === 'login';

    const getRoleTitle = (r) => {
        const map = {
            student: 'Founder / Student',
            mentor: 'Mentor',
            investor: 'Investor',
            incubator: 'Incubator / College',
            admin: 'Admin'
        };
        return map[r] || 'User';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password, role);
            } else {
                await signup(formData, role);
            }
            navigate('/dashboard/' + role);
        } catch (err) {
            setError(err.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    const renderFields = () => {
        if (isLogin) return null;

        switch (role) {
            case 'student':
                return (
                    <>
                        <Input name="fullName" label="Full Name" placeholder="John Doe" onChange={handleChange} />
                        <Input name="college" label="College / City" placeholder="MIT / Boston" onChange={handleChange} />
                        <Input name="skills" label="Key Skills" placeholder="React, Marketing, design..." onChange={handleChange} />
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">Startup Idea (Optional)</label>
                            <textarea
                                name="idea"
                                placeholder="Tell us about your vision..."
                                className="w-full p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all min-h-[100px] bg-gray-50/50"
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            case 'mentor':
                return (
                    <>
                        <Input name="fullName" label="Full Name" onChange={handleChange} />
                        <Input name="expertise" label="Area of Expertise" placeholder="Finance, Tech, Sales..." onChange={handleChange} />
                        <Input name="experience" label="Years of Experience" type="number" onChange={handleChange} />
                        <Input name="linkedin" label="LinkedIn URL" onChange={handleChange} />
                    </>
                );
            case 'investor':
                return (
                    <>
                        <Input name="fullName" label="Full Name" onChange={handleChange} />
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">Investor Type</label>
                            <select name="type" onChange={handleChange} className="w-full p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-gray-50/50">
                                <option value="">Select Type</option>
                                <option value="angel">Angel Investor</option>
                                <option value="vc">Venture Capital</option>
                                <option value="individual">Individual</option>
                            </select>
                        </div>
                        <Input name="industry" label="Industry Interest" onChange={handleChange} />
                    </>
                );
            case 'incubator':
                return (
                    <>
                        <Input name="orgName" label="Organization Name" onChange={handleChange} />
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">Institution Type</label>
                            <select name="type" onChange={handleChange} className="w-full p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-gray-50/50">
                                <option value="college">College E-Cell</option>
                                <option value="incubator">Incubator</option>
                                <option value="accelerator">Accelerator</option>
                            </select>
                        </div>
                        <Input name="city" label="City" onChange={handleChange} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfd] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 w-full max-w-xl p-12 relative border border-gray-50 animate-fade-in">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-10 left-10 text-gray-400 hover:text-emerald-600 transition-all flex items-center gap-2 font-bold text-sm group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="text-center mb-10 mt-6">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Join the Network'}
                    </h2>
                    <p className="text-gray-500 font-medium">
                        {isLogin ? `Logging into the ${getRoleTitle(role)} Portal` : `Create your ${getRoleTitle(role)} account today.`}
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 font-medium flex items-center gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                        {!isLogin && renderFields()}
                        <Input name="email" type="email" label="Email Address" placeholder="alex@example.com" onChange={handleChange} required />
                        <Input name="password" type="password" label="Password" placeholder="••••••••" onChange={handleChange} required />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transform active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Enter Portal' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 font-medium">
                        {isLogin ? "Don't have an account? " : "Already part of the network? "}
                        <Link
                            to={`/${isLogin ? 'signup' : 'login'}/${role}`}
                            className="text-emerald-600 font-bold hover:underline ml-1"
                        >
                            {isLogin ? 'Sign up' : 'Login'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>}
        <input
            className="w-full p-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-gray-50/50 placeholder:text-gray-300 font-medium"
            {...props}
        />
    </div>
);


export default AuthForms;
