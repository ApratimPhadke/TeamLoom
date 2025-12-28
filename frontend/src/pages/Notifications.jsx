import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Bell, Check, CheckCheck, Users, UserPlus, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fetchNotifications, markAsRead, markAllAsRead } from '../store/notificationsSlice'

const iconMap = {
    join_request: UserPlus,
    request_accepted: Check,
    request_rejected: Users,
    new_member: Users,
    new_message: MessageSquare,
    default: Bell
}

export default function Notifications() {
    const { notifications, loading } = useSelector((state) => state.notifications)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchNotifications())
    }, [dispatch])

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead())
    }

    const handleClick = (notification) => {
        if (!notification.is_read) {
            dispatch(markAsRead(notification.id))
        }
    }

    return (
        <div className="page-container max-w-2xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-100">Notifications</h1>
                    <p className="text-dark-400 mt-1">Stay updated on your groups and requests</p>
                </div>
                <button onClick={handleMarkAllRead} className="btn-ghost text-sm">
                    <CheckCheck size={16} className="mr-2" />Mark all read
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card p-4 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-dark-700 rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 bg-dark-700 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-dark-700 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const Icon = iconMap[notification.notification_type] || iconMap.default
                        return (
                            <Link
                                key={notification.id}
                                to={notification.link || '#'}
                                onClick={() => handleClick(notification)}
                                className={`card p-4 flex gap-4 items-start ${!notification.is_read ? 'bg-primary-500/5 border-primary-500/20' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.is_read ? 'bg-primary-500/20' : 'bg-dark-800'
                                    }`}>
                                    <Icon size={20} className={!notification.is_read ? 'text-primary-400' : 'text-dark-400'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${!notification.is_read ? 'text-dark-100' : 'text-dark-300'}`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-dark-400 line-clamp-2">{notification.message}</p>
                                    <p className="text-xs text-dark-500 mt-1">
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                {!notification.is_read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />}
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Bell className="mx-auto text-dark-500 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-dark-200 mb-2">No notifications</h3>
                    <p className="text-dark-400">You're all caught up!</p>
                </div>
            )}
        </div>
    )
}
