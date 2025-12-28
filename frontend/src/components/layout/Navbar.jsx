import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, Search, Menu, X, LogOut, User, Settings } from 'lucide-react'
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
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-dark-800"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link to="/explore" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-bold gradient-text hidden sm:block">
                                TeamLoom
                            </span>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search groups, skills, people..."
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <Link
                            to="/notifications"
                            className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors"
                        >
                            <Bell size={20} className="text-dark-300" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-800 transition-colors"
                            >
                                {user?.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.first_name}
                                        className="w-8 h-8 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="avatar w-8 h-8 text-sm">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </div>
                                )}
                                <span className="hidden sm:block text-sm font-medium text-dark-200">
                                    {user?.first_name}
                                </span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl border border-dark-700 py-2 animate-fade-in">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-dark-200 hover:bg-dark-800"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User size={16} />
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-dark-200 hover:bg-dark-800"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <hr className="my-2 border-dark-700" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-dark-800 w-full"
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
        </nav>
    )
}
