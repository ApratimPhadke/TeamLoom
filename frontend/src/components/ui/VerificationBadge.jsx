import { Check, Github, Award, Star, Shield, GraduationCap } from 'lucide-react'

const BADGE_CONFIG = {
    verified: {
        icon: Check,
        label: 'Verified',
        color: 'text-green-400 bg-green-500/20',
        description: 'Email verified',
    },
    github: {
        icon: Github,
        label: 'GitHub',
        color: 'text-purple-400 bg-purple-500/20',
        description: 'GitHub connected',
    },
    projects: {
        icon: Award,
        label: '5+ Projects',
        color: 'text-yellow-400 bg-yellow-500/20',
        description: 'Completed 5+ projects',
    },
    endorsed: {
        icon: Star,
        label: '10+ Endorsements',
        color: 'text-accent-400 bg-accent-500/20',
        description: 'Received 10+ skill endorsements',
    },
    professor: {
        icon: GraduationCap,
        label: 'Prof. Recommended',
        color: 'text-primary-400 bg-primary-500/20',
        description: 'Recommended by a professor',
    },
    early_adopter: {
        icon: Shield,
        label: 'Early Adopter',
        color: 'text-orange-400 bg-orange-500/20',
        description: 'Joined during beta',
    },
}

export function VerificationBadge({ type, showLabel = false, size = 'sm' }) {
    const config = BADGE_CONFIG[type]
    if (!config) return null

    const Icon = config.icon
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    }

    return (
        <div
            className={`inline-flex items-center gap-1 ${showLabel ? 'px-2 py-1 rounded-full' : ''} ${config.color}`}
            title={config.description}
        >
            <Icon className={sizeClasses[size]} />
            {showLabel && <span className="text-xs font-medium">{config.label}</span>}
        </div>
    )
}

export function VerificationBadgeList({ badges = [], max = 3 }) {
    const displayBadges = badges.slice(0, max)
    const remaining = badges.length - max

    return (
        <div className="flex items-center gap-1">
            {displayBadges.map(badge => (
                <VerificationBadge key={badge} type={badge} size="sm" />
            ))}
            {remaining > 0 && (
                <span className="text-xs text-dark-400 ml-1">+{remaining}</span>
            )}
        </div>
    )
}

// Calculate badges based on user profile
export function getUserBadges(profile) {
    const badges = []

    if (profile?.email_verified) badges.push('verified')
    if (profile?.github_url) badges.push('github')
    if (profile?.completed_projects >= 5) badges.push('projects')
    if (profile?.endorsement_count >= 10) badges.push('endorsed')
    if (profile?.professor_recommended) badges.push('professor')
    if (profile?.is_early_adopter) badges.push('early_adopter')

    return badges
}

export default VerificationBadge
