import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const IncubatorSignup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        // Section 1: Organization Details
        organizationName: '',
        incubatorType: '',
        yearEstablished: '',
        city: '',
        country: '',

        // Section 2: Contact Person
        contactPersonName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        designation: '',

        // Section 3: Program Information
        programsOffered: [],
        industriesSupported: [],
        startupsSupported: '',
        fundingSupport: '',

        // Section 4: Online Presence
        organizationWebsite: '',
        linkedinPage: '',

        // Section 5: Agreements
        acceptTerms: false,
        acceptDataPolicy: false,
        acceptVerification: false
    });

    const programsOptions = [
        'Incubation', 'Acceleration', 'Hackathons', 'Workshops',
        'Mentorship Programs', 'Networking Events', 'Funding Support'
    ];

    const industriesOptions = [
        'Technology', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
        'SaaS', 'AI/ML', 'Hardware', 'Social Impact', 'All Industries'
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
            'organizationName', 'incubatorType', 'yearEstablished', 'city', 'country',
            'contactPersonName', 'email', 'password', 'mobileNumber', 'designation',
            'startupsSupported', 'organizationWebsite'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setError('Please fill in all required fields');
                return false;
            }
        }

        // Multi-select validations
        if (formData.programsOffered.length === 0) {
            setError('Please select at least one program offered');
            return false;
        }

        if (formData.industriesSupported.length === 0) {
            setError('Please select at least one industry supported');
            return false;
        }

        // Consent validations
        if (!formData.acceptTerms || !formData.acceptDataPolicy || !formData.acceptVerification) {
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
            const { confirmPassword, ...incubatorData } = formData;
            await signup(incubatorData, 'incubator');
            navigate('/dashboard/incubator');
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
                        <h2 className="text-3xl font-bold text-gray-900">Join as an Incubator</h2>
                        <p className="text-gray-500 mt-2">Support and nurture the next generation of startups</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Organization Details */}
                        <Section title="1. Organization Details">
                            <Input
                                name="organizationName"
                                label="Organization Name *"
                                placeholder="ABC Incubator"
                                value={formData.organizationName}
                                onChange={handleChange}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Incubator Type *</label>
                                    <select
                                        name="incubatorType"
                                        value={formData.incubatorType}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="college">College E-Cell</option>
                                        <option value="incubator">Incubator</option>
                                        <option value="accelerator">Accelerator</option>
                                        <option value="government">Government</option>
                                        <option value="corporate">Corporate</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                                <Input
                                    name="yearEstablished"
                                    type="number"
                                    label="Year Established *"
                                    placeholder="2020"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={formData.yearEstablished}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="city"
                                    label="City *"
                                    placeholder="Bangalore"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="country"
                                    label="Country *"
                                    placeholder="India"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Section>

                        {/* Section 2: Contact Person */}
                        <Section title="2. Contact Person">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="contactPersonName"
                                    label="Full Name *"
                                    placeholder="Jane Smith"
                                    value={formData.contactPersonName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    label="Email *"
                                    placeholder="jane@incubator.com"
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
                                    placeholder="+91 98765 43210"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="designation"
                                    label="Designation *"
                                    placeholder="Director, Manager, etc."
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Section>

                        {/* Section 3: Program Information */}
                        <Section title="3. Program Information">
                            <MultiSelect
                                label="Programs Offered * (Select all that apply)"
                                options={programsOptions}
                                selected={formData.programsOffered}
                                onToggle={(value) => handleMultiSelect('programsOffered', value)}
                            />
                            <MultiSelect
                                label="Industries Supported * (Select all that apply)"
                                options={industriesOptions}
                                selected={formData.industriesSupported}
                                onToggle={(value) => handleMultiSelect('industriesSupported', value)}
                            />
                            <Input
                                name="startupsSupported"
                                type="number"
                                label="Number of Startups Supported *"
                                placeholder="50"
                                min="0"
                                value={formData.startupsSupported}
                                onChange={handleChange}
                                required
                            />
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Funding Support Available *</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fundingSupport"
                                            value="yes"
                                            checked={formData.fundingSupport === 'yes'}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fundingSupport"
                                            value="no"
                                            checked={formData.fundingSupport === 'no'}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>
                        </Section>

                        {/* Section 4: Online Presence */}
                        <Section title="4. Online Presence">
                            <Input
                                name="organizationWebsite"
                                type="url"
                                label="Organization Website *"
                                placeholder="https://yourincubator.com"
                                value={formData.organizationWebsite}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="linkedinPage"
                                type="url"
                                label="LinkedIn Page (Optional)"
                                placeholder="https://linkedin.com/company/yourincubator"
                                value={formData.linkedinPage}
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
                                        name="acceptVerification"
                                        checked={formData.acceptVerification}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 rounded"
                                        required
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        I consent to <Link to="/verification" className="text-blue-600 hover:underline">Organization Verification</Link>
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
                                    Create Incubator Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login/incubator" className="font-medium text-gray-900 hover:underline">
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

export default IncubatorSignup;
