import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const InvestorSignup = () => {
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

        // Section 2: Investment Profile
        investorType: '',
        organizationName: '',
        yearsOfExperience: '',
        industriesOfInterest: [],
        preferredStartupStage: [],

        // Section 3: Investment Capacity
        investmentRange: '',
        startupsInvestedIn: '',
        investmentGeography: [],

        // Section 4: Online Presence
        linkedinUrl: '',
        companyWebsite: '',

        // Section 5: Agreements
        acceptTerms: false,
        acceptDataPolicy: false,
        acceptInvestorCode: false
    });

    const industriesOptions = [
        'FinTech', 'SaaS', 'HealthTech', 'EdTech', 'E-commerce',
        'AI/ML', 'Enterprise Software', 'Consumer Apps', 'Hardware',
        'Blockchain', 'Gaming', 'CleanTech'
    ];

    const geographyOptions = [
        'India', 'Asia', 'North America', 'Europe', 'Global'
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
            'investorType', 'organizationName', 'yearsOfExperience',
            'investmentRange', 'startupsInvestedIn', 'linkedinUrl'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setError('Please fill in all required fields');
                return false;
            }
        }

        // Multi-select validations
        if (formData.industriesOfInterest.length === 0) {
            setError('Please select at least one industry of interest');
            return false;
        }

        if (formData.preferredStartupStage.length === 0) {
            setError('Please select at least one preferred startup stage');
            return false;
        }

        if (formData.investmentGeography.length === 0) {
            setError('Please select at least one investment geography');
            return false;
        }

        // Consent validations
        if (!formData.acceptTerms || !formData.acceptDataPolicy || !formData.acceptInvestorCode) {
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
            const { confirmPassword, ...investorData } = formData;
            await signup(investorData, 'investor');
            navigate('/dashboard/investor');
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
                        <h2 className="text-3xl font-bold text-gray-900">Join as an Investor</h2>
                        <p className="text-gray-500 mt-2">Discover and invest in promising startups</p>
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
                                    placeholder="John Investor"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    label="Email Address *"
                                    placeholder="john@investment.com"
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
                                    placeholder="New York"
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

                        {/* Section 2: Investment Profile */}
                        <Section title="2. Investment Profile">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Investor Type *</label>
                                    <select
                                        name="investorType"
                                        value={formData.investorType}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="angel">Angel Investor</option>
                                        <option value="vc">Venture Capital</option>
                                        <option value="corporate">Corporate VC</option>
                                        <option value="syndicate">Syndicate</option>
                                        <option value="family-office">Family Office</option>
                                        <option value="individual">Individual</option>
                                    </select>
                                </div>
                                <Input
                                    name="organizationName"
                                    label="Organization / Fund Name *"
                                    placeholder="ABC Ventures"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Input
                                name="yearsOfExperience"
                                type="number"
                                label="Years of Investment Experience *"
                                placeholder="5"
                                min="0"
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                                required
                            />
                            <MultiSelect
                                label="Industries of Interest * (Select all that apply)"
                                options={industriesOptions}
                                selected={formData.industriesOfInterest}
                                onToggle={(value) => handleMultiSelect('industriesOfInterest', value)}
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Preferred Startup Stage * (Select all that apply)</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Idea', 'MVP', 'Growth', 'Scale'].map(stage => (
                                        <label key={stage} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.preferredStartupStage.includes(stage)}
                                                onChange={() => handleMultiSelect('preferredStartupStage', stage)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">{stage}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Section 3: Investment Capacity */}
                        <Section title="3. Investment Capacity">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Typical Investment Range *</label>
                                <select
                                    name="investmentRange"
                                    value={formData.investmentRange}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                    required
                                >
                                    <option value="">Select Range</option>
                                    <option value="5l-50l">₹5L - ₹50L</option>
                                    <option value="50l-5cr">₹50L - ₹5Cr</option>
                                    <option value="5cr-25cr">₹5Cr - ₹25Cr</option>
                                    <option value="25cr+">₹25Cr+</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                            <Input
                                name="startupsInvestedIn"
                                type="number"
                                label="Number of Startups Invested In *"
                                placeholder="10"
                                min="0"
                                value={formData.startupsInvestedIn}
                                onChange={handleChange}
                                required
                            />
                            <MultiSelect
                                label="Investment Geography * (Select all that apply)"
                                options={geographyOptions}
                                selected={formData.investmentGeography}
                                onToggle={(value) => handleMultiSelect('investmentGeography', value)}
                            />
                        </Section>

                        {/* Section 4: Online Presence */}
                        <Section title="4. Online Presence">
                            <Input
                                name="linkedinUrl"
                                type="url"
                                label="LinkedIn Profile *"
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="companyWebsite"
                                type="url"
                                label="Company Website (Optional)"
                                placeholder="https://yourcompany.com"
                                value={formData.companyWebsite}
                                onChange={handleChange}
                            />
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
                                        name="acceptInvestorCode"
                                        checked={formData.acceptInvestorCode}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 rounded"
                                        required
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        I accept the <Link to="/investor-code" className="text-blue-600 hover:underline">Investor Code of Conduct</Link>
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
                                    Create Investor Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login/investor" className="font-medium text-gray-900 hover:underline">
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

export default InvestorSignup;
