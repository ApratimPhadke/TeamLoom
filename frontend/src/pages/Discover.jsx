import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Bell, User as UserIcon, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchRecommended, fetchGroups } from '../store/groupsSlice'

export default function Discover() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentSlide, setCurrentSlide] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState('All Groups')

    const { recommended, loading } = useSelector((state) => state.groups)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchRecommended())
        dispatch(fetchGroups())
    }, [dispatch])

    const topPicks = [
        {
            id: 1,
            gradient: 'from-blue-900 to-blue-600',
            categories: ['Computer Science', 'Sustainability'],
            match: 98,
            name: 'EcoCampus Resource Tracker',
            description: 'Developing a campus-wide IoT network to monitor energy usage and waste management in real-time. We are building the future of green universities.',
            matchReasons: [
                { skill: 'Python Expert', icon: '✓', color: 'text-emerald-400' },
                { skill: 'Data Viz', icon: '✓', color: 'text-emerald-400' },
                { skill: 'Docker (Nice to have!)', icon: '', color: 'text-gray-400' }
            ],
            leader: { name: 'Sarah Jenkins', role: 'Project Lead • Senior', avatar: null, initials: 'SJ', color: '#10b981' }
        },
        {
            id: 2,
            gradient: 'from-purple-900 to-purple-600',
            categories: ['FinTech', 'Mobile App'],
            match: 92,
            name: 'Peer-to-Peer Wallet',
            description: 'Creating a secure mobile wallet for students to split bills and manage expenses without fees. We are challenging Venmo.',
            matchReasons: [
                { skill: 'React Native', icon: '✓', color: 'text-emerald-400' },
                { skill: 'UI Design', icon: '✓', color: 'text-emerald-400' }
            ],
            leader: { name: 'David Chen', role: 'Full Stack • Junior', avatar: null, initials: 'DC', color: '#8b5cf6' }
        }
    ]

    const exploreGroups = [
        {
            id: 1,
            category: 'RESEARCH',
            badge: { text: '86% Match', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
            name: 'Quantum Computing 101',
            description: 'A study group for beginners interested in quantum mechanics and qiskit. Weekly readings and...',
            members: [
                { initials: 'AA', color: '#3b82f6' },
                { initials: 'BB', color: '#8b5cf6' }
            ],
            additionalMembers: 4,
            accentColor: 'border-t-orange-500'
        },
        {
            id: 2,
            category: 'HACKATHON',
            badge: { text: '82% Match', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
            name: 'HackMit Team Alpha',
            description: 'Looking for a frontend designer and a backend engineer for upcoming university hackathon.',
            members: [
                { initials: 'XY', color: '#3b82f6' }
            ],
            additionalMembers: 1,
            accentColor: 'border-t-purple-500'
        },
        {
            id: 3,
            category: 'SOCIAL',
            badge: { text: '65% Match', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
            name: 'Campus Gardeners',
            description: 'Join us every Saturday morning to maintain our community garden. No experience needed!',
            members: [
                { initials: 'PQ', color: '#10b981' },
                { initials: 'RS', color: '#06b6d4' },
                { initials: 'TU', color: '#8b5cf6' }
            ],
            additionalMembers: 25,
            accentColor: 'border-t-green-500'
        },
        {
            id: 4,
            category: 'MARKETING',
            badge: { text: '50% Match', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' },
            name: 'Brand Ambassadors',
            description: 'Promote campus events and earn rewards. Perfect for creative minds who love social media content.',
            members: [
                { initials: 'MN', color: '#ec4899' }
            ],
            additionalMembers: 6,
            accentColor: 'border-t-pink-500'
        },
        {
            id: 5,
            category: 'STARTUP',
            badge: { text: '45% Match', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' },
            name: 'EduTech Founders',
            description: 'Connect with other students building education technology startups. Monthly mixer.',
            members: [
                { initials: 'EF', color: '#f97316' },
                { initials: 'GH', color: '#eab308' }
            ],
            additionalMembers: 2,
            accentColor: 'border-t-orange-500'
        },
        {
            id: 6,
            category: 'GAMING',
            badge: { text: '30% Match', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' },
            name: 'Game Dev Club',
            description: 'Unity and Unreal Engine workshops. Collaborative game jams every semester.',
            members: [
                { initials: 'IJ', color: '#3b82f6' },
                { initials: 'KL', color: '#06b6d4' },
                { initials: 'MN', color: '#8b5cf6' }
            ],
            additionalMembers: 16,
            accentColor: 'border-t-blue-500'
        }
    ]

    const categories = ['All Groups', 'Engineering', 'Business', 'Arts & Design']

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % topPicks.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + topPicks.length) % topPicks.length)
    }

    return (
        <div className="min-h-screen bg-[#0f1419] pt-16">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1419] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white">TeamLoom</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6">
                                <Link to="/app/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                                <Link to="/app/discover" className="text-primary-400 font-medium border-b-2 border-primary-400 pb-4 -mb-4">Discover</Link>
                                <Link to="/app/my-groups" className="text-gray-400 hover:text-white transition-colors">My Groups</Link>
                                <Link to="/app/messages" className="text-gray-400 hover:text-white transition-colors">Messages</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden lg:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search skills, topics..."
                                    className="pl-10 pr-4 py-2 w-64 bg-[#1e2936] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <button className="relative p-2 hover:bg-[#1e2936] rounded-lg transition-colors">
                                <Bell size={20} className="text-gray-400" />
                                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            </button>
                            <Link to="/app/profile" className="p-2 hover:bg-[#1e2936] rounded-lg transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-medium">
                                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Top Picks Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Sparkles size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Top Picks for You</h2>
                                <p className="text-gray-400 text-sm">
                                    Our algorithm found these groups based on your verified skills in{' '}
                                    <span className="text-primary-400 font-medium">Python</span>,{' '}
                                    <span className="text-primary-400 font-medium">UX Design</span>, and your leadership history.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevSlide}
                                className="p-2 bg-[#1e2936] hover:bg-[#2a3441] rounded-lg border border-gray-700 transition-colors"
                            >
                                <ChevronLeft size={20} className="text-gray-400" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-2 bg-[#1e2936] hover:bg-[#2a3441] rounded-lg border border-gray-700 transition-colors"
                            >
                                <ChevronRight size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {topPicks.map((pick, index) => (
                            <div
                                key={pick.id}
                                className={`relative rounded-2xl p-8 bg-gradient-to-br ${pick.gradient} overflow-hidden transition-all duration-500 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                                    }`}
                            >
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                                </div>

                                <div className="relative z-10">
                                    {/* Categories and Match */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-wrap gap-2">
                                            {pick.categories.map((cat) => (
                                                <span key={cat} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium border border-white/30">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/30 border border-emerald-400/50 rounded-full">
                                            <TrendingUp size={14} className="text-emerald-300" />
                                            <span className="text-sm font-bold text-white">{pick.match}% Match</span>
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <h3 className="text-2xl font-bold text-white mb-3">{pick.name}</h3>
                                    <p className="text-white/80 mb-6 leading-relaxed">{pick.description}</p>

                                    {/* Match Reasons */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                <Sparkles size={12} className="text-white" />
                                            </div>
                                            <span className="text-sm font-semibold text-white uppercase tracking-wide">Why You Matched</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {pick.matchReasons.map((reason, i) => (
                                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                                                    {reason.icon && (
                                                        <span className={`text-sm ${reason.color}`}>{reason.icon}</span>
                                                    )}
                                                    <span className="text-sm text-white">{reason.skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white border-2 border-white/30"
                                                style={{ backgroundColor: pick.leader.color }}
                                            >
                                                {pick.leader.initials}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{pick.leader.name}</p>
                                                <p className="text-white/60 text-xs">{pick.leader.role}</p>
                                            </div>
                                        </div>
                                        <button className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explore More Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Explore More Groups</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1e2936] hover:bg-[#2a3441] border border-gray-700 rounded-lg text-gray-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center gap-3 mb-6">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-[#1e2936] text-gray-400 hover:bg-[#2a3441] border border-gray-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Groups Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exploreGroups.map((group) => (
                            <Link
                                key={group.id}
                                to={`/app/groups/${group.id}`}
                                className={`group bg-[#1e2936] border-2 border-transparent ${group.accentColor} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className="p-6">
                                    {/* Category and Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-gray-800 rounded">
                                                <TrendingUp size={12} className="text-gray-500" />
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium uppercase">{group.category}</span>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${group.badge.color}`}>
                                            {group.badge.text}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                        {group.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{group.description}</p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                        <div className="flex items-center -space-x-2">
                                            {group.members.map((member, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-[#1e2936]"
                                                    style={{ backgroundColor: member.color }}
                                                >
                                                    {member.initials}
                                                </div>
                                            ))}
                                            {group.additionalMembers > 0 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 border-2 border-[#1e2936]">
                                                    +{group.additionalMembers}
                                                </div>
                                            )}
                                        </div>
                                        <button className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Join
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
