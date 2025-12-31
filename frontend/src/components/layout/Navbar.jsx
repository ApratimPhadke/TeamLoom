import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, Search, Menu, X, LogOut, User, Settings, Sparkles } from 'lucide-react'
import { logout } from '../../store/authSlice'

export default function Navbar() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user } = useSelector((state) => state.auth)
    const { unreadCount } = useSelector((state) => state.notifications)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/30">
            {/* Animated gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x" />

            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link to="/explore" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">T</span>
                                </div>
                            </div>
                            <span className="text-xl font-bold gradient-text hidden sm:block">
                                TeamLoom
                            </span>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search groups, skills, people..."
                                className="input pl-10 bg-dark-800/50 border-dark-700/50 focus:border-primary-500/50 focus:bg-dark-800"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <Link
                            to="/notifications"
                            className="relative p-2 rounded-lg hover:bg-dark-800 transition-all hover:scale-105"
                        >
                            <Bell size={20} className="text-dark-300 hover:text-primary-400 transition-colors" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs flex items-center justify-center text-white font-medium animate-pulse shadow-glow">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-800 transition-all hover:scale-105 group"
                            >
                                {user?.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.first_name}
                                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-primary-500/50 transition-all"
                                    />
                                ) : (
                                    <div className="avatar w-8 h-8 text-sm group-hover:shadow-glow transition-all">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </div>
                                )}
                                <span className="hidden sm:block text-sm font-medium text-dark-200 group-hover:text-primary-400 transition-colors">
                                    {user?.first_name}
                                </span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-dark-700/50 py-2 animate-fade-in overflow-hidden">
                                    {/* User info header */}
                                    <div className="px-4 py-3 border-b border-dark-700/50 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
                                        <p className="text-sm font-medium text-dark-100">{user?.first_name} {user?.last_name}</p>
                                        <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 text-dark-200 hover:bg-primary-500/10 hover:text-primary-400 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User size={16} />
                                        My Profile
                                        <Sparkles size={12} className="ml-auto text-accent-400" />
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 text-dark-200 hover:bg-primary-500/10 hover:text-primary-400 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <hr className="my-2 border-dark-700/50" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 w-full transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="lg:hidden glass border-t border-dark-700/30 animate-slide-down">
                    <div className="px-4 py-4 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input pl-10 w-full"
                            />
                        </div>
                        <nav className="space-y-1">
                            <Link to="/explore" className="block px-3 py-2 rounded-lg hover:bg-dark-800 text-dark-200 hover:text-primary-400 transition-colors">
                                Explore Groups
                            </Link>
                            <Link to="/groups/create" className="block px-3 py-2 rounded-lg hover:bg-dark-800 text-dark-200 hover:text-primary-400 transition-colors">
                                Create Group
                            </Link>
                            <Link to="/my-groups" className="block px-3 py-2 rounded-lg hover:bg-dark-800 text-dark-200 hover:text-primary-400 transition-colors">
                                My Groups
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </nav>
    )
}
