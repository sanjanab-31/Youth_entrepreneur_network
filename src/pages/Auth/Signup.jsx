
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { signup } = useAuth();

    const role = searchParams.get('role');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    // Redirect admin away from signup
    useEffect(() => {
        if (!role || role === 'admin') {
            navigate('/auth/login?role=admin');
        }
    }, [role, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (step < 3) {
            setStep(prev => prev + 1);
            return;
        }

        setLoading(true);
        try {
            const { email, password, ...profileData } = formData;

            // Convert comma-separated strings to arrays for relational consistency
            const processedProfileData = {
                ...profileData,
                sectorFocus: profileData.sectorFocus ? profileData.sectorFocus.split(',').map(s => s.trim()) : [],
                primarySkills: profileData.primarySkills ? profileData.primarySkills.split(',').map(s => s.trim()) : [],
                areas: profileData.areas ? profileData.areas.split(',').map(s => s.trim()) : []
            };

            await signup(email, password, role, processedProfileData);
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Render Helpers ---

    const renderStepIndicator = () => {
        const totalSteps = 3;
        return (
            <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === s
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : step > s
                                ? 'bg-green-500 text-white'
                                : 'bg-white/10 text-gray-500'
                            }`}>
                            {step > s ? <CheckCircle size={18} /> : s}
                        </div>
                        {s < totalSteps && (
                            <div className={`w-12 h-1 mx-2 rounded-full transition-colors duration-300 ${step > s ? 'bg-green-500' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderFounderForm = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Personal Details</h3>
                        <input name="fullName" placeholder="Full Name" className="steps-input" onChange={handleInputChange} required />
                        <input name="email" type="email" placeholder="Email Address" className="steps-input" onChange={handleInputChange} required />
                        <input name="password" type="password" placeholder="Password" className="steps-input" onChange={handleInputChange} required />
                        <input name="linkedin" placeholder="LinkedIn Profile (Optional)" className="steps-input" onChange={handleInputChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="location" placeholder="Location" className="steps-input" onChange={handleInputChange} required />
                            <select name="commitment" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Commitment</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                            </select>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Startup Information</h3>
                        <input name="startupName" placeholder="Startup Name" className="steps-input" onChange={handleInputChange} required />
                        <div className="grid grid-cols-2 gap-4">
                            <select name="sector" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Sector</option>
                                <option value="fintech">Fintech</option>
                                <option value="edtech">Edtech</option>
                                <option value="healthtech">Healthtech</option>
                                <option value="saas">SaaS</option>
                                <option value="ai">AI/ML</option>
                                <option value="other">Other</option>
                            </select>
                            <select name="stage" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Stage</option>
                                <option value="idea">Idea</option>
                                <option value="validation">Validation</option>
                                <option value="mvp">MVP</option>
                                <option value="revenue">Revenue</option>
                            </select>
                        </div>
                        <textarea name="problemStatement" placeholder="Short Problem Statement (max 150 words)" rows="3" className="steps-input resize-none" onChange={handleInputChange} maxLength={500} required />
                        <input name="teamSize" type="number" placeholder="Current Team Size" className="steps-input" onChange={handleInputChange} required />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Skills & Needs</h3>
                        <input name="primarySkills" placeholder="Your Primary Skills (comma separated)" className="steps-input" onChange={handleInputChange} required />
                        <input name="lookingFor" placeholder="Looking For (Skill Gap)" className="steps-input" onChange={handleInputChange} required />
                        <select name="equity" className="steps-input" onChange={handleInputChange}>
                            <option value="">Equity Range (Optional)</option>
                            <option value="0-5">0-5%</option>
                            <option value="5-10">5-10%</option>
                            <option value="10-20">10-20%</option>
                            <option value="negotiable">Negotiable</option>
                        </select>
                    </div>
                );
            default: return null;
        }
    };

    const renderMentorForm = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Personal Info</h3>
                        <input name="fullName" placeholder="Full Name" className="steps-input" onChange={handleInputChange} required />
                        <input name="email" type="email" placeholder="Email Address" className="steps-input" onChange={handleInputChange} required />
                        <input name="password" type="password" placeholder="Password" className="steps-input" onChange={handleInputChange} required />
                        <input name="linkedin" placeholder="LinkedIn Profile" className="steps-input" onChange={handleInputChange} required />
                        <input name="yearsExp" type="number" placeholder="Years of Experience" className="steps-input" onChange={handleInputChange} required />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Expertise</h3>
                        <select name="industry" className="steps-input" onChange={handleInputChange} required>
                            <option value="">Primary Industry</option>
                            <option value="tech">Technology</option>
                            <option value="finance">Finance</option>
                            <option value="marketing">Marketing</option>
                            <option value="operations">Operations</option>
                        </select>
                        <input name="areas" placeholder="Areas of Mentorship (comma separated)" className="steps-input" onChange={handleInputChange} required />
                        <div className="grid grid-cols-2 gap-4">
                            <select name="stageSupport" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Startup Stage</option>
                                <option value="idea">Idea</option>
                                <option value="mvp">MVP</option>
                                <option value="scale">Scale</option>
                            </select>
                            <select name="sessionType" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Session Type</option>
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                                <option value="equity">Equity</option>
                            </select>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Availability</h3>
                        <select name="hours" className="steps-input" onChange={handleInputChange} required>
                            <option value="">Availability Hours / Week</option>
                            <option value="1-3">1-3 Hours</option>
                            <option value="3-5">3-5 Hours</option>
                            <option value="5+">5+ Hours</option>
                        </select>
                        <textarea name="bio" placeholder="Short Bio (max 150 words)" rows="4" className="steps-input resize-none" onChange={handleInputChange} maxLength={500} required />
                    </div>
                );
            default: return null;
        }
    };

    const renderIncubatorForm = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Organization Info</h3>
                        <input name="incubatorName" placeholder="Incubator Name" className="steps-input" onChange={handleInputChange} required />
                        <input name="email" type="email" placeholder="Official Email" className="steps-input" onChange={handleInputChange} required />
                        <input name="password" type="password" placeholder="Password" className="steps-input" onChange={handleInputChange} required />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="website" placeholder="Website URL" className="steps-input" onChange={handleInputChange} required />
                            <input name="location" placeholder="Location" className="steps-input" onChange={handleInputChange} required />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">Program Details</h3>
                        <input name="sectorFocus" placeholder="Sector Focus (comma separated)" className="steps-input" onChange={handleInputChange} required />
                        <div className="grid grid-cols-2 gap-4">
                            <select name="stagePref" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Stage Preference</option>
                                <option value="early">Early Stage</option>
                                <option value="growth">Growth Stage</option>
                            </select>
                            <select name="funding" className="steps-input" onChange={handleInputChange} required>
                                <option value="">Funding Support</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                        <input name="cohortSize" type="number" placeholder="Cohort Size" className="steps-input" onChange={handleInputChange} required />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-semibold text-white mb-4">About Program</h3>
                        <textarea name="description" placeholder="Short Description (max 200 words)" rows="5" className="steps-input resize-none" onChange={handleInputChange} maxLength={800} required />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <AuthLayout>
            <style>{`
                .steps-input {
                    display: block;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .steps-input:focus {
                     border-color: rgba(139, 92, 246, 0.5);
                     background: rgba(255, 255, 255, 0.08);
                     box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
                }
                .steps-input::placeholder {
                    color: rgba(156, 163, 175, 0.8);
                }
                select.steps-input {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                }
                select.steps-input option {
                    background-color: #1E1E2F;
                    color: white;
                }
            `}</style>

            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-[#1E1E2F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
                    {/* Role Badge */}
                    <div className="absolute top-6 right-6 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-500/30">
                        {role} Signup
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join Vanguard as a {role}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center">
                            <span className="flex-1">{error}</span>
                        </div>
                    )}

                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                        <div className="flex-1">
                            {(role === 'founder' || role === 'co-founder' || role === 'cofounder') && renderFounderForm()}
                            {role === 'mentor' && renderMentorForm()}
                            {role === 'incubator' && renderIncubatorForm()}
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center text-gray-400 hover:text-white transition-colors font-medium px-4 py-2 hover:bg-white/5 rounded-lg"
                                >
                                    <ArrowLeft size={18} className="mr-2" /> Back
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => navigate('/auth/role-selection')}
                                    className="flex items-center text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="submit"
                                    className="flex items-center bg-white text-brand-black px-6 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all transform active:scale-95"
                                >
                                    Next Step <ArrowRight size={18} className="ml-2" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Complete Registration"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout >
    );
};

export default Signup;
