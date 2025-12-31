import { Link } from 'react-router-dom'
import { Users, ArrowRight, Sparkles, Target, MessageSquare, Zap, Rocket, Heart, Star } from 'lucide-react'
import AnimatedBackground from '../components/ui/AnimatedBackground'

const features = [
    {
        icon: Target,
        title: 'Skill-Based Matching',
        description: 'Find teammates whose skills complement yours perfectly.',
        emoji: '🎯',
    },
    {
        icon: Users,
        title: 'Build Dream Teams',
        description: 'Create project groups and recruit talented collaborators.',
        emoji: '👥',
    },
    {
        icon: MessageSquare,
        title: 'Real-Time Chat',
        description: 'Collaborate instantly with built-in group messaging.',
        emoji: '💬',
    },
    {
        icon: Zap,
        title: 'Smart Recommendations',
        description: 'AI-powered suggestions for your next team or project.',
        emoji: '⚡',
    },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-dark-950 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Animated Background */}
                <AnimatedBackground variant="hero" intensity="high" />

                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-accent-900/20" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        {/* Floating emoji decorations */}
                        <div className="hidden lg:block">
                            <span className="absolute top-32 left-20 text-4xl animate-float">🚀</span>
                            <span className="absolute top-40 right-32 text-3xl animate-float-delayed">✨</span>
                            <span className="absolute bottom-40 left-32 text-3xl animate-float-slow">💡</span>
                            <span className="absolute bottom-32 right-20 text-4xl animate-float">🎯</span>
                        </div>

                        {/* Logo with glow */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-50 animate-glow-pulse" />
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-lg">
                                    <span className="text-white font-bold text-4xl">T</span>
                                </div>
                            </div>
                        </div>

                        {/* Headline with animated gradient */}
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6">
                            <span className="gradient-text-animated">Find Your Perfect</span>
                            <br />
                            <span className="text-dark-100 text-glow">Team</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop searching through WhatsApp groups. TeamLoom matches you with
                            complementary teammates for academic projects using{' '}
                            <span className="text-primary-400 font-medium">intelligent skill-based recommendations</span>.
                        </p>

                        {/* CTA Buttons with enhanced styling */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link to="/register" className="btn-neon text-lg px-8 py-4 rounded-xl">
                                <span className="flex items-center gap-2">
                                    Get Started Free
                                    <Rocket className="inline-block animate-bounce-subtle" size={20} />
                                </span>
                            </Link>
                            <Link to="/login" className="btn-secondary text-lg px-8 py-4 rounded-xl border-2">
                                Sign In
                                <ArrowRight className="inline-block ml-2" size={20} />
                            </Link>
                        </div>

                        {/* Social Proof with animated avatars */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-dark-400">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 border-3 border-dark-950 flex items-center justify-center text-white text-sm font-medium hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-glow"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm">
                                    <span className="text-dark-100 font-bold text-lg">500+</span>{' '}
                                    students already collaborating
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
                    <div className="w-6 h-10 rounded-full border-2 border-dark-500 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-dark-400 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <AnimatedBackground variant="subtle" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="badge-neon mb-4 text-sm px-4 py-1">
                            <Sparkles size={14} className="mr-2" />
                            Features
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold text-dark-100 mb-4">
                            Everything You Need to{' '}
                            <span className="gradient-text">Build Great Teams</span>
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto text-lg">
                            From discovery to collaboration, TeamLoom streamlines the entire
                            team formation process.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card-glass p-6 group hover:scale-105 transition-all duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                                        <feature.icon className="text-primary-400" size={24} />
                                    </div>
                                    <span className="text-2xl">{feature.emoji}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-dark-100 mb-2 group-hover:text-primary-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-dark-100 mb-4">
                            How <span className="gradient-text">TeamLoom</span> Works
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto text-lg">
                            Get started in minutes and find your perfect team
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { num: '1', title: 'Create Your Profile', desc: 'Add your skills, experience level, and availability. Our system uses this to match you with compatible teammates.', color: 'primary', emoji: '👤' },
                            { num: '2', title: 'Find or Create Groups', desc: 'Browse existing projects looking for your skills, or create your own group and recruit talented collaborators.', color: 'accent', emoji: '🔍' },
                            { num: '3', title: 'Collaborate & Build', desc: 'Use built-in real-time chat, share files, and work together seamlessly on your academic projects.', color: 'primary', emoji: '🚀' },
                        ].map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6">
                                    <div className={`w-20 h-20 rounded-2xl bg-${step.color}-500/20 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-glow transition-all duration-300`}>
                                        <span className={`text-3xl font-bold text-${step.color}-400`}>{step.num}</span>
                                    </div>
                                    <span className="absolute -top-2 -right-2 text-2xl animate-wiggle">{step.emoji}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-dark-100 mb-3 group-hover:text-primary-400 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-dark-400 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What You Can Do Section */}
            <section className="py-24 relative">
                <AnimatedBackground variant="subtle" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-dark-100 mb-4">
                            What You Can <span className="gradient-text">Do</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: '🎯', title: 'Explore Projects', desc: 'Browse hackathons, research projects, startup ideas, and course projects. Filter by skills needed, team size, and project type.', border: 'primary' },
                            { icon: '🚀', title: 'Create Your Own Group', desc: 'Have an idea? Create a group, specify required skills, and let talented students apply to join your team.', border: 'accent' },
                            { icon: '💬', title: 'Real-Time Chat', desc: 'Communicate instantly with your team using built-in messaging. Share ideas, files, and coordinate your project work.', border: 'green' },
                            { icon: '📊', title: 'Track Activity', desc: 'Get notifications for join requests, messages, and team updates. Never miss important project updates.', border: 'yellow' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`card-glass p-6 border-l-4 border-l-${item.border}-500 hover:scale-[1.02] transition-all duration-300`}
                            >
                                <h3 className="text-lg font-semibold text-dark-100 mb-2 flex items-center gap-2">
                                    <span className="text-2xl">{item.icon}</span>
                                    {item.title}
                                </h3>
                                <p className="text-dark-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="card-animated">
                        <div className="card-animated-inner p-12 text-center">
                            <span className="text-5xl mb-6 block animate-bounce-subtle">🎉</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
                                Ready to Find Your <span className="gradient-text">Dream Team</span>?
                            </h2>
                            <p className="text-dark-300 mb-8 max-w-xl mx-auto text-lg">
                                Join TeamLoom today and start collaborating with talented students
                                who complement your skills.
                            </p>
                            <Link to="/register" className="btn-neon text-lg px-10 py-4 rounded-xl inline-flex items-center gap-2">
                                Create Free Account
                                <Heart className="animate-pulse" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-dark-800 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:shadow-glow transition-all">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="font-semibold text-dark-200 group-hover:text-primary-400 transition-colors">TeamLoom</span>
                        </div>
                        <div className="flex gap-6 text-sm text-dark-400">
                            <Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link>
                            <span>Made with 💜 for students</span>
                            <span>© 2024 TeamLoom</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
