import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search, Filter, TrendingUp, Users, Calendar, ChevronRight } from 'lucide-react'
import { fetchGroups, fetchRecommended } from '../store/groupsSlice'

export default function ExploreNew() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDepartments, setSelectedDepartments] = useState(['Computer Science'])
    const [selectedSkills, setSelectedSkills] = useState(['React / Frontend'])
    const [selectedType, setSelectedType] = useState('Capstone Project')
    const [sortBy, setSortBy] = useState('Best Match')

    const { groups, recommended, loading } = useSelector((state) => state.groups)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroups())
        dispatch(fetchRecommended())
    }, [dispatch])

    // Mock data for demonstration
    const mockGroups = [
        {
            id: 1,
            category: 'COMP SCI',
            match: 98,
            name: 'AI-Powered Study Assistant',
            description: 'Building a personalized study scheduler using NLP to analyze...',
            skills: ['Python', 'TensorFlow', 'API'],
            members: [{ initials: 'JB', color: '#0ea5e9' }, { initials: 'AC', color: '#d946ef' }],
            additionalMembers: 2,
            type: 'research'
        },
        {
            id: 2,
            category: 'BUSINESS',
            match: 85,
            name: 'Eco-Friendly Marketplace',
            description: 'A platform connecting students with sustainable local brands. We need a...',
            skills: ['React', 'Tailwind'],
            members: [{ initials: 'MK', color: '#f97316' }],
            additionalMembers: 1,
            type: 'startup'
        },
        {
            id: 3,
            category: 'ENGINEERING',
            match: 92,
            name: 'Smart Drone Delivery Net',
            description: 'Capstone project focused on optimizing drone flight paths in urba...',
            skills: ['C++', 'Algorithms', 'ROS'],
            members: [{ initials: 'TB', color: '#0ea5e9' }, { initials: 'XL', color: '#10b981' }, { initials: 'YT', color: '#d946ef' }],
            additionalMembers: 0,
            type: 'capstone'
        },
        {
            id: 4,
            category: 'DESIGN',
            match: 78,
            name: 'Campus Art VR Gallery',
            description: 'Creating a virtual reality experience to showcase student artwork in 3...',
            skills: ['Unity', 'Blender', 'C#'],
            members: [{ initials: 'AL', color: '#ec4899' }],
            additionalMembers: 3,
            type: 'creative'
        },
        {
            id: 5,
            category: 'FINANCE',
            match: 65,
            name: 'Crypto Portfolio Tracker',
            description: 'A minimal dashboard for tracking altcoins. Primarily looking for backe...',
            skills: ['Security', 'Blockchain'],
            members: [{ initials: 'GK', color: '#10b981' }],
            additionalMembers: 0,
            type: 'finance'
        },
        {
            id: 6,
            category: 'HEALTH TECH',
            match: 95,
            name: 'Wearable Health Monitor',
            description: 'Designing a non-invasive glucose monitor prototype. We need help wi...',
            skills: ['Data Science', 'IoT', 'Swift'],
            members: [{ initials: 'DR', color: '#ef4444' }, { initials: 'JM', color: '#3b82f6' }],
            additionalMembers: 0,
            type: 'health'
        }
    ]

    const departments = [
        { name: 'Computer Science', count: 12 },
        { name: 'Engineering', count: 8 },
        { name: 'Business & Admin', count: 5 },
        { name: 'Digital Arts', count: 3 }
    ]

    const skills = [
        { name: 'React / Frontend' },
        { name: 'Python / ML' },
        { name: 'UI/UX Design' },
        { name: 'Marketing' }
    ]

    const projectTypes = [
        { name: 'Any Type' },
        { name: 'Capstone Project' },
        { name: 'Hackathon' }
    ]

    const getMatchColor = (match) => {
        if (match >= 90) return 'text-emerald-400'
        if (match >= 80) return 'text-green-400'
        if (match >= 70) return 'text-yellow-400'
        return 'text-gray-400'
    }

    const getMatchBgColor = (match) => {
        if (match >= 90) return 'bg-emerald-500/10 border-emerald-500/30'
        if (match >= 80) return 'bg-green-500/10 border-green-500/30'
        if (match >= 70) return 'bg-yellow-500/10 border-yellow-500/30'
        return 'bg-gray-500/10 border-gray-500/30'
    }

    return (
        <div className="min-h-screen bg-[#0f1419] pt-20">
            <div className="flex max-w-[1600px] mx-auto">
                {/* Sidebar Filters */}
                <aside className="w-64 border-r border-gray-800 px-6 py-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">FILTERS</h3>
                        <button className="text-xs text-primary-400 hover:text-primary-300">Reset All</button>
                    </div>

                    {/* Department Filter */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter size={14} className="text-gray-400" />
                            <h4 className="text-sm font-medium text-white">Department</h4>
                        </div>
                        <div className="space-y-2">
                            {departments.map((dept) => (
                                <label key={dept.name} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedDepartments.includes(dept.name)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedDepartments([...selectedDepartments, dept.name])
                                            } else {
                                                setSelectedDepartments(selectedDepartments.filter(d => d !== dept.name))
                                            }
                                        }}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white flex-1">{dept.name}</span>
                                    <span className="text-xs text-gray-500">{dept.count}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Skills Needed Filter */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={14} className="text-gray-400" />
                            <h4 className="text-sm font-medium text-white">Skills Needed</h4>
                        </div>
                        <div className="space-y-2">
                            {skills.map((skill) => (
                                <label key={skill.name} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedSkills.includes(skill.name)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedSkills([...selectedSkills, skill.name])
                                            } else {
                                                setSelectedSkills(selectedSkills.filter(s => s !== skill.name))
                                            }
                                        }}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white">{skill.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Project Type Filter */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={14} className="text-gray-400" />
                            <h4 className="text-sm font-medium text-white">Project Type</h4>
                        </div>
                        <div className="space-y-2">
                            {projectTypes.map((type) => (
                                <label key={type.name} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="projectType"
                                        checked={selectedType === type.name}
                                        onChange={() => setSelectedType(type.name)}
                                        className="w-4 h-4 border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white">{type.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Explore Groups</h1>
                                <p className="text-gray-400">Recommended based on your profile and skills.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-[#1e2936] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option>Best Match</option>
                                    <option>Most Recent</option>
                                    <option>Most Popular</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for projects, skills, or keywords..."
                                className="w-full pl-12 pr-4 py-3 bg-[#1e2936] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Groups Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockGroups.map((group) => (
                            <Link
                                key={group.id}
                                to={`/app/groups/${group.id}`}
                                className="group relative bg-[#1e2936] border border-gray-700 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1"
                            >
                                {/* Header with category and match */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-gray-800 rounded-md">
                                            <Calendar size={14} className="text-gray-400" />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                            {group.category}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${getMatchBgColor(group.match)}`}>
                                        <TrendingUp size={12} className={getMatchColor(group.match)} />
                                        <span className={`text-xs font-semibold ${getMatchColor(group.match)}`}>
                                            {group.match}% Match
                                        </span>
                                    </div>
                                </div>

                                {/* Title and Description */}
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                    {group.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                    {group.description}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {group.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 bg-gray-800/50 border border-gray-700 rounded-md text-xs text-gray-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

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
                                    <div className="flex items-center gap-1 text-primary-400 group-hover:gap-2 transition-all">
                                        <span className="text-sm font-medium">View Details</span>
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="flex justify-center mt-12">
                        <button className="px-6 py-3 bg-[#1e2936] hover:bg-[#2a3441] border border-gray-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2">
                            Load More Projects
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}
