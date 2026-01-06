import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const FounderSignup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        // Section 1: Basic Account Info
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        city: '',
        country: '',
        college: '',
        course: '',

        // Section 2: Startup Identity
        startupName: '',
        startupIdea: '',
        industry: '',
        startupStage: '',
        problemSolved: '',
        targetCustomers: '',
        businessModel: '',

        // Section 3: Founder Profile
        skills: [],
        hasStartupExperience: '',
        linkedinUrl: '',
        portfolio: '',

        // Section 4: What Help Do You Need
        mentorshipAreas: [],
        fundingInterest: '',
        incubatorInterest: '',

        // Section 5: Agreements
        acceptTerms: false,
        acceptDataPolicy: false,
        acceptCodeOfConduct: false
    });

    const skillsOptions = [
        'Technology', 'Marketing', 'Sales', 'Product Management',
        'Design', 'Finance', 'Operations', 'Business Development'
    ];

    const mentorshipAreasOptions = [
        'Product Development', 'Marketing Strategy', 'Fundraising',
        'Technology', 'Sales', 'Legal', 'Operations', 'Team Building'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleMultiSelect = (name, value) => {
        setFormData(prev => {
            const currentValues = prev[name] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [name]: newValues };
        });
    };

    const validateForm = () => {
        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        // Password strength
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        // Required fields
        const requiredFields = [
            'fullName', 'email', 'password', 'mobileNumber', 'city', 'country',
            'college', 'course', 'startupName', 'startupIdea', 'industry',
            'startupStage', 'problemSolved', 'targetCustomers', 'businessModel'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setError('Please fill in all required fields');
                return false;
            }
        }

        // Multi-select validations
        if (formData.skills.length === 0) {
            setError('Please select at least one skill');
            return false;
        }

        if (formData.mentorshipAreas.length === 0) {
            setError('Please select at least one mentorship area');
            return false;
        }

        // Consent validations
        if (!formData.acceptTerms || !formData.acceptDataPolicy || !formData.acceptCodeOfConduct) {
            setError('Please accept all terms and conditions');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...founderData } = formData;
            await signup(founderData, 'student');
            navigate('/dashboard/student');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="text-center mb-8 mt-4">
                        <h2 className="text-3xl font-bold text-gray-900">Join as a Founder</h2>
                        <p className="text-gray-500 mt-2">Start your entrepreneurial journey with YEN</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Account Info */}
                        <Section title="1. Basic Account Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="fullName"
                                    label="Full Name *"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    label="Email Address *"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="password"
                                    type="password"
                                    label="Password *"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    label="Confirm Password *"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="mobileNumber"
                                    type="tel"
                                    label="Mobile Number *"
                                    placeholder="+1 234 567 8900"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="city"
                                    label="City *"
                                    placeholder="San Francisco"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="country"
                                    label="Country *"
                                    placeholder="United States"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="college"
                                    label="College / University *"
                                    placeholder="Stanford University"
                                    value={formData.college}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Input
                                name="course"
                                label="Course / Degree *"
                                placeholder="B.Tech Computer Science"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            />
                        </Section>

                        {/* Section 2: Startup Identity */}
                        <Section title="2. Startup Identity">
                            <Input
                                name="startupName"
                                label="Startup Name *"
                                placeholder="My Awesome Startup"
                                value={formData.startupName}
                                onChange={handleChange}
                                required
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    Startup Idea / Description *
                                </label>
                                <textarea
                                    name="startupIdea"
                                    value={formData.startupIdea}
                                    onChange={handleChange}
                                    placeholder="Describe your startup idea..."
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="industry"
                                    label="Industry / Sector *"
                                    placeholder="FinTech, EdTech, etc."
                                    value={formData.industry}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Startup Stage *</label>
                                    <select
                                        name="startupStage"
                                        value={formData.startupStage}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="idea">Idea</option>
                                        <option value="mvp">MVP</option>
                                        <option value="early-revenue">Early Revenue</option>
                                        <option value="growth">Growth</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    Problem Being Solved *
                                </label>
                                <textarea
                                    name="problemSolved"
                                    value={formData.problemSolved}
                                    onChange={handleChange}
                                    placeholder="What problem does your startup solve?"
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all min-h-[80px]"
                                    required
                                />
                            </div>
                            <Input
                                name="targetCustomers"
                                label="Target Customers *"
                                placeholder="Small businesses, Students, etc."
                                value={formData.targetCustomers}
                                onChange={handleChange}
                                required
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Business Model *</label>
                                <select
                                    name="businessModel"
                                    value={formData.businessModel}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                    required
                                >
                                    <option value="">Select Business Model</option>
                                    <option value="b2b">B2B</option>
                                    <option value="b2c">B2C</option>
                                    <option value="saas">SaaS</option>
                                    <option value="marketplace">Marketplace</option>
                                    <option value="subscription">Subscription</option>
                                    <option value="freemium">Freemium</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </Section>

                        {/* Section 3: Founder Profile */}
                        <Section title="3. Founder Profile">
                            <MultiSelect
                                label="Skills * (Select all that apply)"
                                options={skillsOptions}
                                selected={formData.skills}
                                onToggle={(value) => handleMultiSelect('skills', value)}
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Previous Startup Experience *</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hasStartupExperience"
                                            value="yes"
                                            checked={formData.hasStartupExperience === 'yes'}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hasStartupExperience"
                                            value="no"
                                            checked={formData.hasStartupExperience === 'no'}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>
                            <Input
                                name="linkedinUrl"
                                type="url"
                                label="LinkedIn Profile URL"
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                            />
                            <Input
                                name="portfolio"
                                type="url"
                                label="Portfolio / Website (Optional)"
                                placeholder="https://yourportfolio.com"
                                value={formData.portfolio}
                                onChange={handleChange}
                            />
                        </Section>

                        {/* Section 4: What Help Do You Need */}
                        <Section title="4. What Help Do You Need">
                            <MultiSelect
                                label="Mentorship Areas Needed * (Select all that apply)"
                                options={mentorshipAreasOptions}
                                selected={formData.mentorshipAreas}
                                onToggle={(value) => handleMultiSelect('mentorshipAreas', value)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Funding Interest *</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="fundingInterest"
                                                value="yes"
                                                checked={formData.fundingInterest === 'yes'}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-gray-700">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="fundingInterest"
                                                value="no"
                                                checked={formData.fundingInterest === 'no'}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-gray-700">No</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Incubator Interest *</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="incubatorInterest"
                                                value="yes"
                                                checked={formData.incubatorInterest === 'yes'}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-gray-700">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="incubatorInterest"
                                                value="no"
                                                checked={formData.incubatorInterest === 'no'}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-gray-700">No</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Section 5: Agreements */}
                        <Section title="5. Agreements">
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 rounded"
                                        required
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        I accept the <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
                                    </span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="acceptDataPolicy"
                                        checked={formData.acceptDataPolicy}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 rounded"
                                        required
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        I accept the <Link to="/data-policy" className="text-blue-600 hover:underline">Data Usage Policy</Link>
                                    </span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="acceptCodeOfConduct"
                                        checked={formData.acceptCodeOfConduct}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 rounded"
                                        required
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        I accept the <Link to="/code-of-conduct" className="text-blue-600 hover:underline">Code of Conduct</Link>
                                    </span>
                                </label>
                            </div>
                        </Section>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-black hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Create Founder Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login/student" className="font-medium text-gray-900 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const Section = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const Input = ({ label, ...props }) => (
    <div className="space-y-1">
        {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
        <input
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            {...props}
        />
    </div>
);

const MultiSelect = ({ label, options, selected, onToggle }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
        <div className="flex flex-wrap gap-2">
            {options.map(option => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onToggle(option)}
                    className={`px-4 py-2 rounded-lg border transition-all ${selected.includes(option)
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
);

export default FounderSignup;
