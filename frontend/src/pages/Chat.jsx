import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MessageSquare, Users, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import api from '../api/client'
import ChatRoom from '../components/chat/ChatRoom'
import { SkeletonCard } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function Chat() {
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [loading, setLoading] = useState(true)
    const [unreadCounts, setUnreadCounts] = useState({})

    useEffect(() => {
        fetchUserGroups()
    }, [])

    const fetchUserGroups = async () => {
        try {
            const res = await api.get('/groups/my_groups/')
            setGroups(res.data.results || res.data)
            setLoading(false)

            // Fetch unread counts for each group
            for (const group of res.data.results || res.data) {
                try {
                    const countRes = await api.get(`/chat/groups/${group.id}/unread/`)
                    setUnreadCounts(prev => ({ ...prev, [group.id]: countRes.data.unread_count }))
                } catch (err) {
                    // Ignore errors for unread counts
                }
            }
        } catch (err) {
            console.error('Failed to fetch groups')
            setLoading(false)
        }
    }

    return (
        <div className="page-container">
            <h1 className="text-3xl font-bold text-dark-100 mb-2">Messages</h1>
            <p className="text-dark-400 mb-6">Chat with your team members</p>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Group List */}
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">
                        Your Groups
                    </h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="card p-4 animate-pulse">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-dark-700 rounded-full" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-dark-700 rounded w-3/4 mb-2" />
                                            <div className="h-3 bg-dark-700 rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : groups.length === 0 ? (
                        <EmptyState
                            type="messages"
                            title="No groups yet"
                            description="Join a group to start chatting with team members"
                            actionLabel="Find Groups"
                            actionHref="/explore"
                        />
                    ) : (
                        groups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                                className={`w-full card p-4 text-left transition-all ${selectedGroup?.id === group.id
                                    ? 'border-primary-500 bg-primary-500/5'
                                    : 'hover:border-dark-500'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold shrink-0">
                                        {group.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-dark-100 truncate">
                                                {group.name}
                                            </h3>
                                            {unreadCounts[group.id] > 0 && (
                                                <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                                                    {unreadCounts[group.id]}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-dark-400 truncate">
                                            {group.member_count} members
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2">
                    {selectedGroup ? (
                        <ChatRoom
                            groupId={selectedGroup.id}
                            groupName={selectedGroup.name}
                            onBack={() => setSelectedGroup(null)}
                        />
                    ) : (
                        <div className="h-[600px] rounded-xl border border-dark-700 bg-dark-900 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="text-primary-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-dark-100 mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-dark-400 max-w-sm">
                                Choose a group from the left to start chatting with your teammates
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
