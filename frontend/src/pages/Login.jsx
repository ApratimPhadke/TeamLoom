import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Users } from 'lucide-react'
import { login, googleLogin, clearError } from '../store/authSlice'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { loading, error } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(clearError())

        const result = await dispatch(login({ email, password }))
        if (login.fulfilled.match(result)) {
            navigate('/app/explore')
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        dispatch(clearError())
        const result = await dispatch(googleLogin(credentialResponse.credential))
        if (googleLogin.fulfilled.match(result)) {
            navigate('/app/explore')
        }
    }

    const handleGoogleError = () => {
        dispatch(clearError())
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero/Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1a2332] via-[#0f1419] to-[#1a2332] relative overflow-hidden items-center justify-center p-12">
                {/* Animated network background */}
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        {/* Network nodes and connections */}
                        <defs>
                            <radialGradient id="nodeGradient">
                                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                            </radialGradient>
                        </defs>

                        {/* Connections */}
                        <g stroke="#0ea5e9" strokeWidth="1" opacity="0.2">
                            <line x1="20%" y1="30%" x2="45%" y2="50%" className="animate-pulse" />
                            <line x1="45%" y1="50%" x2="70%" y2="40%" className="animate-pulse delay-200" />
                            <line x1="70%" y1="40%" x2="80%" y2="60%" className="animate-pulse delay-300" />
                            <line x1="45%" y1="50%" x2="60%" y2="75%" className="animate-pulse delay-100" />
                            <line x1="20%" y1="30%" x2="30%" y2="60%" className="animate-pulse delay-400" />
                            <line x1="30%" y1="60%" x2="60%" y2="75%" className="animate-pulse delay-200" />
                        </g>

                        {/* Nodes */}
                        <circle cx="20%" cy="30%" r="40" fill="url(#nodeGradient)" className="animate-pulse" />
                        <circle cx="45%" cy="50%" r="50" fill="url(#nodeGradient)" className="animate-pulse delay-200" />
                        <circle cx="70%" cy="40%" r="35" fill="url(#nodeGradient)" className="animate-pulse delay-300" />
                        <circle cx="80%" cy="60%" r="30" fill="url(#nodeGradient)" className="animate-pulse delay-400" />
                        <circle cx="30%" cy="60%" r="35" fill="url(#nodeGradient)" className="animate-pulse delay-100" />
                        <circle cx="60%" cy="75%" r="40" fill="url(#nodeGradient)" className="animate-pulse delay-300" />
                    </svg>
                </div>

                {/* User icons floating */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/40 to-accent-500/40 flex items-center justify-center animate-float">
                    <Users size={20} className="text-primary-300" />
                </div>
                <div className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-gradient-to-br from-accent-500/40 to-primary-500/40 flex items-center justify-center animate-float delay-200">
                    <Users size={18} className="text-accent-300" />
                </div>
                <div className="absolute bottom-1/4 left-1/3 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500/40 to-accent-500/40 flex items-center justify-center animate-float delay-300">
                    <Users size={22} className="text-primary-300" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">TeamLoom</span>
                        </Link>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6">
                        Find your perfect project team.
                    </h1>

                    <div className="space-y-4 text-gray-300">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>Skill-based matching algorithms</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>College-native verified profiles</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>Seamless project collaboration</span>
                        </div>
                    </div>

                    <div className="mt-12 text-sm text-gray-500">
                        © 2024 TeamLoom Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 bg-[#0f1419]">
                <div className="max-w-md w-full">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">TeamLoom</span>
                        </Link>
                    </div>

                    {/* Welcome text */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                        <p className="text-gray-400">Connect, collaborate, and build something amazing.</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="text-red-400 shrink-0" size={20} />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Google Sign In */}
                    <div className="mb-6">
                        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1e2936] hover:bg-[#2a3441] border border-gray-700 rounded-lg text-white transition-all duration-200">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-700" />
                        <span className="text-gray-500 text-sm uppercase tracking-wide">or continue with email</span>
                        <div className="flex-1 h-px bg-gray-700" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                University Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#1e2936] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="student@university.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-[#1e2936] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Log In
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="mt-6 text-center text-gray-400">
                        New to TeamLoom?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .delay-200 {
                    animation-delay: 200ms;
                }
                
                .delay-300 {
                    animation-delay: 300ms;
                }
                
                .delay-400 {
                    animation-delay: 400ms;
                }
            `}</style>
        </div>
    )
}
