import { formatDistanceToNow } from 'date-fns'

export default function LastActive({ date, showDot = true }) {
    if (!date) return null

    const lastActiveDate = new Date(date)
    const now = new Date()
    const diffMs = now - lastActiveDate
    const diffHours = diffMs / (1000 * 60 * 60)

    const getStatus = () => {
        if (diffHours < 1) return { label: 'Online now', color: 'bg-green-500', textColor: 'text-green-400' }
        if (diffHours < 24) return { label: `Active ${formatDistanceToNow(lastActiveDate, { addSuffix: true })}`, color: 'bg-green-500', textColor: 'text-green-400' }
        if (diffHours < 72) return { label: 'Active this week', color: 'bg-yellow-500', textColor: 'text-yellow-400' }
        return { label: 'Away', color: 'bg-dark-500', textColor: 'text-dark-400' }
    }

    const status = getStatus()

    return (
        <div className="flex items-center gap-1.5">
            {showDot && (
                <span className={`w-2 h-2 rounded-full ${status.color} ${diffHours < 1 ? 'animate-pulse' : ''}`} />
            )}
            <span className={`text-xs ${status.textColor}`}>
                {status.label}
            </span>
        </div>
    )
}

export function LastActiveIndicator({ date, size = 'sm' }) {
    if (!date) return null

    const lastActiveDate = new Date(date)
    const now = new Date()
    const diffHours = (now - lastActiveDate) / (1000 * 60 * 60)

    const getColor = () => {
        if (diffHours < 1) return 'bg-green-500'
        if (diffHours < 24) return 'bg-green-500'
        if (diffHours < 72) return 'bg-yellow-500'
        return 'bg-dark-500'
    }

    const sizeClass = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'

    return (
        <span
            className={`absolute bottom-0 right-0 ${sizeClass} rounded-full ${getColor()} ring-2 ring-dark-900 ${diffHours < 1 ? 'animate-pulse' : ''}`}
            title={`Active ${formatDistanceToNow(lastActiveDate, { addSuffix: true })}`}
        />
    )
}
