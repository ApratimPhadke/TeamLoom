import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search, Sparkles, Users, Flame, RefreshCw } from 'lucide-react'
import { fetchGroups, fetchRecommended } from '../store/groupsSlice'
import { SkeletonGroupGrid } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import FilterChips, { QuickFilters } from '../components/ui/FilterChips'
import { MatchBadge, getGroupBadges } from '../components/ui/MatchBadge'
import api from '../api/client'

export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [trendingGroups, setTrendingGroups] = useState([])
    const { groups, recommended, loading } = useSelector((state) => state.groups)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroups())
        dispatch(fetchRecommended())
        fetchTrending()
    }, [dispatch])

    const fetchTrending = async () => {
        try {
            const res = await api.get('/groups/', { params: { ordering: '-view_count', page_size: 3 } })
            setTrendingGroups(res.data.results || res.data.slice?.(0, 3) || [])
        } catch (err) {
            console.error('Failed to fetch trending')
        }
    }

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true)
        await Promise.all([
            dispatch(fetchGroups()),
            dispatch(fetchRecommended()),
            fetchTrending()
        ])
        setIsRefreshing(false)
    }, [dispatch])

    const handleSearch = (e) => {
        e.preventDefault()
        dispatch(fetchGroups({ search: searchQuery }))
    }

    const handleQuickFilter = (filter) => {
        if (filter === 'trending') {
            dispatch(fetchGroups({ ordering: '-view_count' }))
        } else if (filter === 'new') {
            dispatch(fetchGroups({ ordering: '-created_at' }))
        } else if (filter === 'available') {
            dispatch(fetchGroups({ has_slots: true }))
        }
    }

    const filteredGroups = groups.filter(group => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            if (!group.name.toLowerCase().includes(q) &&
                !group.description?.toLowerCase().includes(q)) {
                return false
            }
        }
        return true
    })

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-dark-100 mb-1">Explore Groups</h1>
                    <p className="text-dark-400">Discover teams looking for your skills</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="btn-ghost p-2"
                >
                    <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Quick Filters */}
            <div className="mb-6">
                <QuickFilters onFilter={handleQuickFilter} />
            </div>

            {/* 🔥 Hot Groups Section */}
            {trendingGroups.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="text-orange-400" size={20} />
                        <h2 className="text-lg font-semibold text-dark-100">Hot Groups</h2>
                        <MatchBadge type="trending" showIcon={false} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {trendingGroups.map((group) => (
                            <GroupCard key={group.id} group={group} badges={['trending']} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Section */}
            {recommended.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-accent-400" size={20} />
                        <h2 className="text-lg font-semibold text-dark-100">Recommended for You</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommended.slice(0, 3).map((group) => (
                            <GroupCard key={group.id} group={group} featured badges={['perfect_match']} />
                        ))}
                    </div>
                </div>
            )}

            {/* Search and Advanced Filters */}
            <div className="mb-6 space-y-4">
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search groups by name, skills, or topic..."
                            className="input pl-10"
                        />
                    </div>
                </form>

                <FilterChips
                    activeFilters={activeFilters}
                    onChange={setActiveFilters}
                    onClear={() => setActiveFilters([])}
                />
            </div>

            {/* All Groups */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-dark-100">All Groups</h2>
            </div>

            {loading ? (
                <SkeletonGroupGrid count={6} />
            ) : filteredGroups.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    type="search"
                    title="No groups found"
                    description={searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your filters or create your own group!"}
                    actionLabel="Create a Group"
                    actionHref="/groups/create"
                />
            )}
        </div>
    )
}

function GroupCard({ group, featured = false, badges = [] }) {
    const computedBadges = badges.length > 0 ? badges : getGroupBadges(group)

    return (
        <Link
            to={`/groups/${group.id}`}
            className={`card-hover p-6 block ${featured ? 'border-primary-500/30 bg-primary-500/5' : ''}`}
        >
            <div className="flex items-start justify-between mb-3">
                <span className={`badge ${group.type === 'research' ? 'badge-accent' :
                    group.type === 'hackathon' ? 'badge-warning' :
                        'badge-primary'
                    }`}>
                    {group.type_display || group.type}
                </span>
                <div className="flex gap-1">
                    {computedBadges.slice(0, 2).map(badge => (
                        <MatchBadge key={badge} type={badge} showLabel={false} />
                    ))}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-dark-100 mb-2 line-clamp-1">
                {group.name}
            </h3>

            <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                {group.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {group.required_skills_detail?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-dark-800 text-dark-300">
                        {skill.name}
                    </span>
                ))}
                {group.required_skills_detail?.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-dark-800 text-dark-400">
                        +{group.required_skills_detail.length - 3}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                <div className="flex items-center gap-2">
                    {group.leader_avatar ? (
                        <img
                            src={group.leader_avatar}
                            alt={group.leader_name}
                            className="w-6 h-6 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="avatar w-6 h-6 text-xs">
                            {group.leader_name?.[0] || 'T'}
                        </div>
                    )}
                    <span className="text-sm text-dark-300">{group.leader_name}</span>
                </div>
                <div className="text-sm">
                    <span className={`font-medium ${group.is_full ? 'text-red-400' : 'text-green-400'}`}>
                        {group.available_spots}
                    </span>
                    <span className="text-dark-400">/{group.capacity}</span>
                </div>
            </div>
        </Link>
    )
}
