import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { register, clearError } from '../store/authSlice'

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        role: 'student',
    })
    const [showPassword, setShowPassword] = useState(false)
    const { loading, error } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(clearError())

        const result = await dispatch(register(formData))
        if (register.fulfilled.match(result)) {
            navigate('/profile')
        }
    }

    const passwordStrength = () => {
        const { password } = formData
        if (password.length === 0) return null
        if (password.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' }
        if (password.length < 8) return { level: 2, text: 'Fair', color: 'bg-yellow-500' }
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { level: 3, text: 'Strong', color: 'bg-green-500' }
        }
        return { level: 2, text: 'Good', color: 'bg-primary-500' }
    }

    const strength = passwordStrength()

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent-900/40 via-dark-900 to-primary-900/40 items-center justify-center p-12">
                <div className="max-w-lg">
                    <h2 className="text-3xl font-bold text-dark-100 mb-6">
                        Join the Community
                    </h2>
                    <div className="space-y-6">
                        {[
                            { icon: '🎯', text: 'Match with teammates based on complementary skills' },
                            { icon: '💬', text: 'Collaborate in real-time with group chat' },
                            { icon: '🏆', text: 'Build your portfolio with completed projects' },
                            { icon: '🌟', text: 'Get endorsed by peers and professors' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 card">
                                <span className="text-2xl">{item.icon}</span>
                                <p className="text-dark-200">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">T</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-dark-100">Create your account</h1>
                        <p className="text-dark-400 mt-2">Start collaborating in minutes</p>
                    </div>

                    {/* Error message */}
                    {error && typeof error === 'string' && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="text-red-400 shrink-0" size={20} />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input pl-10 ${error?.email ? 'input-error' : ''}`}
                                    placeholder="you@university.edu"
                                    required
                                />
                            </div>
                            {error?.email && (
                                <p className="text-red-400 text-sm mt-1">{error.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="student">Student</option>
                                <option value="professor">Professor</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input pl-10 pr-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {strength && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${strength.color} transition-all`}
                                            style={{ width: `${(strength.level / 3) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-dark-400">{strength.text}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password_confirm"
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    className={`input pl-10 ${formData.password_confirm && formData.password !== formData.password_confirm
                                            ? 'input-error'
                                            : ''
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {formData.password_confirm && formData.password === formData.password_confirm && (
                                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                                )}
                            </div>
                            {formData.password_confirm && formData.password !== formData.password_confirm && (
                                <p className="text-red-400 text-sm mt-1">Passwords don't match</p>
                            )}
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="w-4 h-4 mt-0.5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                            />
                            <label htmlFor="terms" className="text-sm text-dark-300">
                                I agree to the{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-300">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-300">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || formData.password !== formData.password_confirm}
                            className="btn-primary w-full py-3 mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className="mt-8 text-center text-dark-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
