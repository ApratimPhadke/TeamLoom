import { NavLink, useLocation } from 'react-router-dom'
import { Compass, FolderKanban, MessageSquare, Bell, User } from 'lucide-react'
import { useSelector } from 'react-redux'

const navItems = [
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/groups/my', icon: FolderKanban, label: 'Groups' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/notifications', icon: Bell, label: 'Alerts' },
    { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
    const location = useLocation()
    const { unreadCount } = useSelector((state) => state.notifications)

    // Hide on certain pages
    const hiddenPaths = ['/login', '/register', '/onboarding', '/']
    if (hiddenPaths.includes(location.pathname)) return null

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-dark-700/50 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map(({ to, icon: Icon, label }) => {
                    const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
                    const showBadge = to === '/notifications' && unreadCount > 0

                    return (
                        <NavLink
                            key={to}
                            to={to}
                            className="flex flex-col items-center justify-center flex-1 py-2 relative"
                        >
                            <div className="relative">
                                <Icon
                                    size={22}
                                    className={`transition-colors ${isActive ? 'text-primary-400' : 'text-dark-400'
                                        }`}
                                />
                                {showBadge && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-[10px] mt-1 transition-colors ${isActive ? 'text-primary-400 font-medium' : 'text-dark-500'
                                    }`}
                            >
                                {label}
                            </span>
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                            )}
                        </NavLink>
                    )
                })}
            </div>
        </nav>
    )
}
