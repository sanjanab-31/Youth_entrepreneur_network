import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const MentorSignup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        // Section 1: Basic Account Information
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        city: '',
        country: '',

        // Section 2: Professional Identity
        currentRole: '',
        yearsOfExperience: '',
        industryExpertise: [],
        hasStartupExperience: '',
        companiesWorkedWith: '',

        // Section 3: Mentoring Profile
        mentoringAreas: [],
        startupStages: [],
        availabilityHours: '',
        mentoringMode: [],

        // Section 4: Online Presence
        linkedinUrl: '',
        personalWebsite: '',

        // Section 5: Profile Description
        bio: '',

        // Section 6: Consent
        acceptTerms: false,
        acceptCodeOfConduct: false,
        acceptDataPolicy: false
    });

    const industryOptions = [
        'SaaS', 'FinTech', 'EdTech', 'HealthTech', 'AI/ML',
        'E-commerce', 'Marketing', 'Sales', 'Enterprise Software',
        'Consumer Apps', 'Hardware', 'Blockchain', 'Gaming'
    ];

    const mentoringAreasOptions = [
        'Fundraising', 'Product Development', 'Marketing',
        'Technology', 'Legal', 'Sales', 'Operations',
        'Business Strategy', 'Team Building', 'Growth Hacking'
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

        // Bio word count (100-300 words)
        const wordCount = formData.bio.trim().split(/\s+/).length;
        if (wordCount < 100 || wordCount > 300) {
            setError('Bio must be between 100-300 words');
            return false;
        }

        // Required fields
        const requiredFields = [
            'fullName', 'email', 'password', 'mobileNumber', 'city', 'country',
            'currentRole', 'yearsOfExperience', 'companiesWorkedWith',
            'availabilityHours', 'linkedinUrl', 'bio'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill in all required fields`);
                return false;
            }
        }

        // Multi-select validations
        if (formData.industryExpertise.length === 0) {
            setError('Please select at least one industry expertise');
            return false;
        }

        if (formData.mentoringAreas.length === 0) {
            setError('Please select at least one mentoring area');
            return false;
        }

        if (formData.startupStages.length === 0) {
            setError('Please select at least one startup stage');
            return false;
        }

        if (formData.mentoringMode.length === 0) {
            setError('Please select at least one mentoring mode');
            return false;
        }

        // Consent validations
        if (!formData.acceptTerms || !formData.acceptCodeOfConduct || !formData.acceptDataPolicy) {
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
            // Remove confirmPassword before saving
            const { confirmPassword, ...mentorData } = formData;
            await signup(mentorData, 'mentor');
            navigate('/dashboard/mentor');
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
                        <h2 className="text-3xl font-bold text-gray-900">Join as a Mentor</h2>
                        <p className="text-gray-500 mt-2">Share your expertise and guide the next generation of entrepreneurs</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Account Information */}
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
                            <Input
                                name="country"
                                label="Country *"
                                placeholder="United States"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </Section>

                        {/* Section 2: Professional Identity */}
                        <Section title="2. Professional Identity">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Current Role *</label>
                                    <select
                                        name="currentRole"
                                        value={formData.currentRole}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="founder">Founder</option>
                                        <option value="ceo">CEO</option>
                                        <option value="cto">CTO</option>
                                        <option value="cfo">CFO</option>
                                        <option value="coo">COO</option>
                                        <option value="investor">Investor</option>
                                        <option value="consultant">Consultant</option>
                                        <option value="advisor">Advisor</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <Input
                                    name="yearsOfExperience"
                                    type="number"
                                    label="Total Years of Experience *"
                                    placeholder="10"
                                    min="0"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <MultiSelect
                                label="Industry Expertise * (Select all that apply)"
                                options={industryOptions}
                                selected={formData.industryExpertise}
                                onToggle={(value) => handleMultiSelect('industryExpertise', value)}
                            />

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Startup Experience *</label>
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
                                name="companiesWorkedWith"
                                label="Companies Founded or Worked With *"
                                placeholder="Google, Startup XYZ, etc."
                                value={formData.companiesWorkedWith}
                                onChange={handleChange}
                                required
                            />
                        </Section>

                        {/* Section 3: Mentoring Profile */}
                        <Section title="3. Mentoring Profile">
                            <MultiSelect
                                label="Mentoring Areas * (Select all that apply)"
                                options={mentoringAreasOptions}
                                selected={formData.mentoringAreas}
                                onToggle={(value) => handleMultiSelect('mentoringAreas', value)}
                            />

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Startup Stages Interested In *</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Idea', 'MVP', 'Growth'].map(stage => (
                                        <label key={stage} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.startupStages.includes(stage)}
                                                onChange={() => handleMultiSelect('startupStages', stage)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">{stage}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Input
                                name="availabilityHours"
                                type="number"
                                label="Availability (Hours per week) *"
                                placeholder="5"
                                min="1"
                                value={formData.availabilityHours}
                                onChange={handleChange}
                                required
                            />

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Preferred Mentoring Mode *</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Video', 'Chat'].map(mode => (
                                        <label key={mode} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.mentoringMode.includes(mode)}
                                                onChange={() => handleMultiSelect('mentoringMode', mode)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">{mode}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Section 4: Online Presence & Verification */}
                        <Section title="4. Online Presence & Verification">
                            <Input
                                name="linkedinUrl"
                                type="url"
                                label="LinkedIn Profile URL *"
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="personalWebsite"
                                type="url"
                                label="Personal Website (Optional)"
                                placeholder="https://yourwebsite.com"
                                value={formData.personalWebsite}
                                onChange={handleChange}
                            />
                        </Section>

                        {/* Section 5: Profile Description */}
                        <Section title="5. Profile Description">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">
                                    Short Bio / About You * (100-300 words)
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your experience, achievements, and what drives you to mentor..."
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all min-h-[150px]"
                                    required
                                />
                                <p className="text-xs text-gray-500 ml-1">
                                    Word count: {formData.bio.trim() ? formData.bio.trim().split(/\s+/).length : 0}
                                </p>
                            </div>
                        </Section>

                        {/* Section 6: Consent & Platform Rules */}
                        <Section title="6. Consent & Platform Rules">
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
                                    Create Mentor Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login/mentor" className="font-medium text-gray-900 hover:underline">
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

export default MentorSignup;
