import { Users, FolderKanban, MessageSquare, Bell, Search, UserPlus } from 'lucide-react'

const illustrations = {
    groups: (
        <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <FolderKanban className="w-16 h-16 text-primary-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-accent-500/30 flex items-center justify-center animate-pulse-soft">
                <Users className="w-6 h-6 text-accent-400" />
            </div>
        </div>
    ),
    messages: (
        <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <MessageSquare className="w-16 h-16 text-primary-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                <span className="text-lg">💬</span>
            </div>
        </div>
    ),
    notifications: (
        <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <Bell className="w-16 h-16 text-primary-400" />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center animate-bounce">
                <span className="text-white text-sm">✓</span>
            </div>
        </div>
    ),
    search: (
        <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <Search className="w-16 h-16 text-primary-400" />
            </div>
        </div>
    ),
    requests: (
        <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <UserPlus className="w-16 h-16 text-primary-400" />
            </div>
        </div>
    ),
}

export default function EmptyState({
    type = 'groups',
    title,
    description,
    actionLabel,
    onAction,
    actionHref
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            {illustrations[type]}

            <h3 className="mt-6 text-xl font-semibold text-dark-100">
                {title}
            </h3>

            <p className="mt-2 text-dark-400 max-w-sm">
                {description}
            </p>

            {(actionLabel && (onAction || actionHref)) && (
                actionHref ? (
                    <a href={actionHref} className="btn-primary mt-6">
                        {actionLabel}
                    </a>
                ) : (
                    <button onClick={onAction} className="btn-primary mt-6">
                        {actionLabel}
                    </button>
                )
            )}
        </div>
    )
}

// Preset empty states for common scenarios
export const EmptyGroups = ({ onAction }) => (
    <EmptyState
        type="groups"
        title="No groups yet"
        description="Start your first project or discover groups looking for your skills!"
        actionLabel="Start Your First Project"
        onAction={onAction}
    />
)

export const EmptyMessages = () => (
    <EmptyState
        type="messages"
        title="No messages yet"
        description="Start a conversation with your team! Share ideas, files, and updates."
        actionLabel="Say Hello 👋"
    />
)

export const EmptyNotifications = () => (
    <EmptyState
        type="notifications"
        title="All caught up!"
        description="You have no new notifications. We'll let you know when something happens."
    />
)

export const EmptySearchResults = ({ query }) => (
    <EmptyState
        type="search"
        title="No results found"
        description={`We couldn't find any groups matching "${query}". Try different keywords or filters.`}
        actionLabel="Clear Filters"
    />
)

export const EmptyJoinRequests = () => (
    <EmptyState
        type="requests"
        title="No pending requests"
        description="When students request to join your group, they'll appear here for review."
    />
)
