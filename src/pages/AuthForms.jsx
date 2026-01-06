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
        if (isLogin) return null; // Only email/pass needed for login, which are default

        switch (role) {
            case 'student':
                return (
                    <>
                        <Input name="fullName" label="Full Name" placeholder="John Doe" onChange={handleChange} />
                        <Input name="college" label="College / City" placeholder="MIT / Boston" onChange={handleChange} />
                        <Input name="skills" label="Key Skills" placeholder="React, Marketing, design..." onChange={handleChange} />
                        <textarea
                            name="idea"
                            placeholder="Startup Idea (Optional)"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            onChange={handleChange}
                        />
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
                        <select name="type" onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 mb-4">
                            <option value="">Select Investor Type</option>
                            <option value="angel">Angel Investor</option>
                            <option value="vc">Venture Capital</option>
                            <option value="individual">Individual</option>
                        </select>
                        <Input name="industry" label="Industry Interest" onChange={handleChange} />
                    </>
                );
            case 'incubator':
                return (
                    <>
                        <Input name="orgName" label="Organization Name" onChange={handleChange} />
                        <select name="type" onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 mb-4">
                            <option value="college">College E-Cell</option>
                            <option value="incubator">Incubator</option>
                            <option value="accelerator">Accelerator</option>
                        </select>
                        <Input name="city" label="City" onChange={handleChange} />
                        <Input name="contactPerson" label="Contact Person" onChange={handleChange} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="text-center mb-8 mt-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isLogin ? 'Welcome Back' : 'Join YEN'}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {isLogin ? `Login as ${getRoleTitle(role)}` : `Create ${getRoleTitle(role)} Account`}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && renderFields()}

                    <Input name="email" type="email" label="Email Address" placeholder="you@example.com" onChange={handleChange} required />
                    <Input name="password" type="password" label="Password" placeholder="••••••••" onChange={handleChange} required />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-black hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Link
                        to={`/${isLogin ? 'signup' : 'login'}/${role}`}
                        className="font-medium text-gray-900 hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
        <input
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            {...props}
        />
    </div>
);

export default AuthForms;
