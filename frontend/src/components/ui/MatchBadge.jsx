import { Target, Zap, Flame, Users, Star, Clock } from 'lucide-react'

const BADGE_CONFIG = {
    perfect_match: {
        icon: Target,
        label: 'Perfect Match',
        emoji: '🎯',
        className: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    trending: {
        icon: Flame,
        label: 'Trending',
        emoji: '🔥',
        className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    active: {
        icon: Zap,
        label: 'Active',
        emoji: '⚡',
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    filling_fast: {
        icon: Users,
        label: 'Filling Fast',
        emoji: '👥',
        className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    top_rated: {
        icon: Star,
        label: 'Top Rated',
        emoji: '⭐',
        className: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
    },
    new: {
        icon: Clock,
        label: 'New',
        emoji: '✨',
        className: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
    },
}

export function MatchBadge({ type, showIcon = true, showEmoji = true, size = 'sm' }) {
    const config = BADGE_CONFIG[type]
    if (!config) return null

    const Icon = config.icon
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

    return (
        <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.className} ${sizeClasses}`}>
            {showEmoji && <span>{config.emoji}</span>}
            {showIcon && <Icon size={size === 'sm' ? 12 : 14} />}
            {config.label}
        </span>
    )
}

export function MatchScore({ score, showLabel = true }) {
    const getScoreColor = () => {
        if (score >= 90) return 'text-green-400'
        if (score >= 70) return 'text-primary-400'
        if (score >= 50) return 'text-yellow-400'
        return 'text-dark-400'
    }

    const getScoreLabel = () => {
        if (score >= 90) return 'Perfect Match!'
        if (score >= 70) return 'Great Match'
        if (score >= 50) return 'Good Match'
        return 'Partial Match'
    }

    return (
        <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90">
                    <circle
                        cx="20" cy="20" r="16"
                        className="fill-none stroke-dark-700"
                        strokeWidth="3"
                    />
                    <circle
                        cx="20" cy="20" r="16"
                        className={`fill-none ${getScoreColor().replace('text-', 'stroke-')}`}
                        strokeWidth="3"
                        strokeDasharray={`${score} 100`}
                        strokeLinecap="round"
                    />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getScoreColor()}`}>
                    {score}
                </span>
            </div>
            {showLabel && (
                <span className={`text-sm font-medium ${getScoreColor()}`}>
                    {getScoreLabel()}
                </span>
            )}
        </div>
    )
}

// Calculate badges for a group based on its properties
export function getGroupBadges(group, userSkills = []) {
    const badges = []

    // Perfect match - user has all required skills
    if (group.required_skills_detail && userSkills.length > 0) {
        const requiredSkillIds = group.required_skills_detail.map(s => s.id)
        const userSkillIds = userSkills.map(s => s.skill_id)
        const matchCount = requiredSkillIds.filter(id => userSkillIds.includes(id)).length
        if (matchCount === requiredSkillIds.length && requiredSkillIds.length > 0) {
            badges.push('perfect_match')
        }
    }

    // Trending - high view count or join requests
    if (group.view_count > 50 || group.join_request_count > 5) {
        badges.push('trending')
    }

    // Filling fast - more than 70% filled
    if (group.capacity > 0 && (group.member_count / group.capacity) > 0.7) {
        badges.push('filling_fast')
    }

    // New - created in last 3 days
    const createdDate = new Date(group.created_at)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    if (createdDate > threeDaysAgo) {
        badges.push('new')
    }

    // Active - has recent activity
    if (group.last_activity) {
        const lastActive = new Date(group.last_activity)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        if (lastActive > oneDayAgo) {
            badges.push('active')
        }
    }

    return badges.slice(0, 2) // Max 2 badges per card
}

export default MatchBadge
