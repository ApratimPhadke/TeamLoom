// Skeleton loading components for various UI elements

export function SkeletonPulse({ className = '' }) {
    return (
        <div className={`animate-pulse bg-dark-700 rounded ${className}`} />
    )
}

export function SkeletonCard() {
    return (
        <div className="card p-6 space-y-4">
            <div className="flex items-start justify-between">
                <SkeletonPulse className="h-5 w-20 rounded-full" />
                <SkeletonPulse className="h-5 w-16 rounded-full" />
            </div>
            <SkeletonPulse className="h-6 w-3/4" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
                <SkeletonPulse className="h-6 w-16 rounded-full" />
                <SkeletonPulse className="h-6 w-20 rounded-full" />
                <SkeletonPulse className="h-6 w-14 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <div className="flex items-center gap-2">
                    <SkeletonPulse className="h-8 w-8 rounded-full" />
                    <SkeletonPulse className="h-4 w-24" />
                </div>
                <SkeletonPulse className="h-4 w-16" />
            </div>
        </div>
    )
}

export function SkeletonGroupGrid({ count = 6 }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

export function SkeletonProfile() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card p-8">
                <div className="flex items-center gap-6">
                    <SkeletonPulse className="w-24 h-24 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <SkeletonPulse className="h-8 w-48" />
                        <SkeletonPulse className="h-4 w-32" />
                        <SkeletonPulse className="h-4 w-64" />
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="card p-6 space-y-4">
                <SkeletonPulse className="h-6 w-24" />
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonPulse key={i} className="h-12" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function SkeletonMessage() {
    return (
        <div className="flex gap-3 animate-pulse">
            <SkeletonPulse className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <SkeletonPulse className="h-4 w-24" />
                    <SkeletonPulse className="h-3 w-12" />
                </div>
                <SkeletonPulse className="h-4 w-3/4" />
                <SkeletonPulse className="h-4 w-1/2" />
            </div>
        </div>
    )
}

export function SkeletonMessageList({ count = 5 }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonMessage key={i} />
            ))}
        </div>
    )
}

export function SkeletonNotification() {
    return (
        <div className="card p-4 flex gap-4 items-start animate-pulse">
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <SkeletonPulse className="h-4 w-3/4" />
                <SkeletonPulse className="h-3 w-1/2" />
                <SkeletonPulse className="h-3 w-20" />
            </div>
        </div>
    )
}

export function SkeletonNotificationList({ count = 4 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonNotification key={i} />
            ))}
        </div>
    )
}

export function SkeletonText({ width = 'w-full', height = 'h-4' }) {
    return <SkeletonPulse className={`${width} ${height}`} />
}

export function SkeletonAvatar({ size = 'w-10 h-10' }) {
    return <SkeletonPulse className={`${size} rounded-full`} />
}
