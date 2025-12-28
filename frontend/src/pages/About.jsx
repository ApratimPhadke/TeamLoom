import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Target, Shield, Zap } from 'lucide-react'
import api from '../api/client'

export default function About() {
    const [creator, setCreator] = useState(null)

    useEffect(() => {
        async function fetchCreator() {
            try {
                // Search for Apratim
                const res = await api.get('/profiles/students/', { params: { search: 'Apratim' } })
                // Search returns array of results
                const results = res.data.results || res.data
                if (results && results.length > 0) {
                    setCreator(results[0])
                }
            } catch (err) {
                console.error('Failed to fetch team info')
            }
        }
        fetchCreator()
    }, [])

    return (
        <div className="pt-24 pb-16">
            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 text-center">
                <h1 className="text-4xl sm:text-6xl font-black text-dark-100 mb-6 tracking-tight">
                    We Are <span className="gradient-text">TeamLoom</span>
                </h1>
                <p className="text-xl text-dark-400 max-w-3xl mx-auto leading-relaxed">
                    Connecting talented students, researchers, and creators to build amazing things together.
                    We believe the best ideas happen when the right people connect.
                </p>
            </section>

            {/* Mission Section */}
            <section className="bg-dark-800/50 py-20 mb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-dark-100 mb-6">Our Mission</h2>
                            <p className="text-dark-300 text-lg leading-relaxed mb-6">
                                TeamLoom was born from a simple observation: students have amazing skills and brilliant ideas,
                                but they often struggle to find the right teammates to bring them to life.
                            </p>
                            <p className="text-dark-300 text-lg leading-relaxed">
                                Our platform breaks down departmental silos and connects you with potential collaborators
                                based on skills, interests, and availability—not just who you happen to know in your classes.
                            </p>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-6">
                            <div className="card p-6 border-l-4 border-l-primary-500">
                                <Users className="text-primary-400 mb-4" size={32} />
                                <h3 className="text-lg font-semibold text-dark-100 mb-2">Connect</h3>
                                <p className="text-dark-400 text-sm">Find peers with complementary skills</p>
                            </div>
                            <div className="card p-6 border-l-4 border-l-accent-500">
                                <Zap className="text-accent-400 mb-4" size={32} />
                                <h3 className="text-lg font-semibold text-dark-100 mb-2">Build</h3>
                                <p className="text-dark-400 text-sm">Launch projects faster with the right team</p>
                            </div>
                            <div className="card p-6 border-l-4 border-l-green-500">
                                <Target className="text-green-400 mb-4" size={32} />
                                <h3 className="text-lg font-semibold text-dark-100 mb-2">Achieve</h3>
                                <p className="text-dark-400 text-sm">Turn ideas into portfolio-worthy projects</p>
                            </div>
                            <div className="card p-6 border-l-4 border-l-yellow-500">
                                <Shield className="text-yellow-400 mb-4" size={32} />
                                <h3 className="text-lg font-semibold text-dark-100 mb-2">Trust</h3>
                                <p className="text-dark-400 text-sm">Verified profiles and safe collaboration</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-dark-100 mb-4">Meet the Team</h2>
                    <p className="text-dark-400">The creators behind TeamLoom</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Founder Card */}
                    <div className="card p-6 text-center group hover:bg-dark-800 transition-colors">
                        {creator?.avatar_url ? (
                            <img
                                src={creator.avatar_url}
                                alt={creator.full_name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-primary-500/20 group-hover:border-primary-500 transition-colors"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary-500/20 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary-400">
                                {creator?.full_name?.[0] || 'A'}
                            </div>
                        )}
                        <h3 className="text-xl font-semibold text-dark-100">
                            {creator?.full_name || 'Apratim'}
                        </h3>
                        <p className="text-primary-400 mb-3">
                            {creator?.tagline || 'Lead Developer'}
                        </p>
                        <p className="text-dark-400 text-sm">
                            Building the future of student collaboration.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center py-16 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-2xl mx-4">
                <h2 className="text-3xl font-bold text-dark-100 mb-6">Ready to find your team?</h2>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Get Started Today
                </Link>
            </section>
        </div>
    )
}
