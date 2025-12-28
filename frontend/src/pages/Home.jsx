import { Link } from 'react-router-dom'
import { Users, ArrowRight, Sparkles, Target, MessageSquare, Zap } from 'lucide-react'

const features = [
    {
        icon: Target,
        title: 'Skill-Based Matching',
        description: 'Find teammates whose skills complement yours perfectly.',
    },
    {
        icon: Users,
        title: 'Build Dream Teams',
        description: 'Create project groups and recruit talented collaborators.',
    },
    {
        icon: MessageSquare,
        title: 'Real-Time Chat',
        description: 'Collaborate instantly with built-in group messaging.',
    },
    {
        icon: Zap,
        title: 'Smart Recommendations',
        description: 'AI-powered suggestions for your next team or project.',
    },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-dark-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-accent-900/20" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-lg">
                                <span className="text-white font-bold text-4xl">T</span>
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
                            <span className="gradient-text">Find Your Perfect</span>
                            <br />
                            <span className="text-dark-100">Team</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10">
                            Stop searching through WhatsApp groups. TeamLoom matches you with
                            complementary teammates for academic projects using intelligent
                            skill-based recommendations.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="btn-primary text-lg px-8 py-3">
                                Get Started Free
                                <ArrowRight className="inline-block ml-2" size={20} />
                            </Link>
                            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                                Sign In
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-dark-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 border-2 border-dark-950 flex items-center justify-center text-white text-sm font-medium"
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm">
                                <span className="text-dark-100 font-semibold">500+</span> students already collaborating
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="badge-accent mb-4">
                            <Sparkles size={14} className="mr-1" />
                            Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
                            Everything You Need to Build Great Teams
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto">
                            From discovery to collaboration, TeamLoom streamlines the entire
                            team formation process.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card-hover p-6 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="text-primary-400" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-dark-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-400 text-sm">
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
                            How TeamLoom Works
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto">
                            Get started in minutes and find your perfect team
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-primary-400">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-dark-100 mb-3">Create Your Profile</h3>
                            <p className="text-dark-400">
                                Add your skills, experience level, and availability.
                                Our system uses this to match you with compatible teammates.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-accent-500/20 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-accent-400">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-dark-100 mb-3">Find or Create Groups</h3>
                            <p className="text-dark-400">
                                Browse existing projects looking for your skills, or create
                                your own group and recruit talented collaborators.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-primary-400">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-dark-100 mb-3">Collaborate & Build</h3>
                            <p className="text-dark-400">
                                Use built-in real-time chat, share files, and work together
                                seamlessly on your academic projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What You Can Do Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
                            What You Can Do
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="card p-6 border-l-4 border-l-primary-500">
                            <h3 className="text-lg font-semibold text-dark-100 mb-2">🎯 Explore Projects</h3>
                            <p className="text-dark-400">
                                Browse hackathons, research projects, startup ideas, and course projects.
                                Filter by skills needed, team size, and project type.
                            </p>
                        </div>
                        <div className="card p-6 border-l-4 border-l-accent-500">
                            <h3 className="text-lg font-semibold text-dark-100 mb-2">🚀 Create Your Own Group</h3>
                            <p className="text-dark-400">
                                Have an idea? Create a group, specify required skills, and let
                                talented students apply to join your team.
                            </p>
                        </div>
                        <div className="card p-6 border-l-4 border-l-green-500">
                            <h3 className="text-lg font-semibold text-dark-100 mb-2">💬 Real-Time Chat</h3>
                            <p className="text-dark-400">
                                Communicate instantly with your team using built-in messaging.
                                Share ideas, files, and coordinate your project work.
                            </p>
                        </div>
                        <div className="card p-6 border-l-4 border-l-yellow-500">
                            <h3 className="text-lg font-semibold text-dark-100 mb-2">📊 Track Activity</h3>
                            <p className="text-dark-400">
                                Get notifications for join requests, messages, and team updates.
                                Never miss important project updates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="card p-12 bg-gradient-to-r from-primary-900/30 to-accent-900/30 border-primary-500/20">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-4">
                            Ready to Find Your Team?
                        </h2>
                        <p className="text-dark-300 mb-8 max-w-xl mx-auto">
                            Join TeamLoom today and start collaborating with talented students
                            who complement your skills.
                        </p>
                        <Link to="/register" className="btn-primary text-lg px-8 py-3">
                            Create Free Account
                            <ArrowRight className="inline-block ml-2" size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-dark-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="font-semibold text-dark-200">TeamLoom</span>
                        </div>
                        <div className="flex gap-6 text-sm text-dark-400">
                            <Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link>
                            <span>© 2024 TeamLoom</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
