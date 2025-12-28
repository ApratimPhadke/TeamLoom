import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
    Compass,
    Users,
    PlusCircle,
    User,
    Bell,
    MessageSquare,
    FolderKanban,
    Sparkles,
} from 'lucide-react'
import { fetchMyGroups } from '../../store/groupsSlice'

const navItems = [
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/groups/my', icon: FolderKanban, label: 'My Groups' },
    { to: '/groups/create', icon: PlusCircle, label: 'Create Group' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
]

export default function Sidebar() {
    const dispatch = useDispatch()
    const { recommended, myGroups } = useSelector((state) => state.groups)
    const { isAuthenticated } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchMyGroups())
        }
    }, [dispatch, isAuthenticated])

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-dark-700/50 hidden lg:block overflow-y-auto">
            <div className="p-4">
                {/* Main Navigation */}
                <nav className="space-y-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-500/20 text-primary-400 font-medium'
                                    : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Recommendations Section */}
                {recommended.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2 px-4 mb-3">
                            <Sparkles size={16} className="text-accent-400" />
                            <h3 className="text-sm font-medium text-dark-300">Recommended</h3>
                        </div>
                        <div className="space-y-2">
                            {recommended.slice(0, 3).map((group) => (
                                <NavLink
                                    key={group.id}
                                    to={`/groups/${group.id}`}
                                    className="block px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors"
                                >
                                    <p className="text-sm font-medium text-dark-100 truncate">
                                        {group.name}
                                    </p>
                                    <p className="text-xs text-dark-400">
                                        {group.available_spots} spots left
                                    </p>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="mt-8 px-4">
                    <div className="card p-4">
                        <h4 className="text-sm font-medium text-dark-300 mb-3">Your Activity</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-bold gradient-text">
                                    {myGroups?.filter(g => g.status !== 'completed').length || 0}
                                </p>
                                <p className="text-xs text-dark-400">Active</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold gradient-text">
                                    {myGroups?.filter(g => g.status === 'completed').length || 0}
                                </p>
                                <p className="text-xs text-dark-400">Completed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 px-8 pb-4">
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `text-sm font-medium ${isActive ? 'text-primary-400' : 'text-dark-400 hover:text-dark-200'} transition-colors`
                    }
                >
                    About TeamLoom
                </NavLink>
                <p className="text-xs text-dark-500 mt-2">© 2024 TeamLoom</p>
            </div>
        </aside>
    )
}
