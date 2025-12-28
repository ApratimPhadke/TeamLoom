import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    Users, MessageSquare, Github, ExternalLink, Clock,
    UserPlus, LogOut, Check, X, Send, ChevronRight, Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchGroupById, joinGroup, leaveGroup } from '../store/groupsSlice'
import api from '../api/client'

export default function GroupDetail() {
    const { id } = useParams()
    const [message, setMessage] = useState('')
    const [showJoinModal, setShowJoinModal] = useState(false)
    const [requests, setRequests] = useState([])
    const [leaveRequests, setLeaveRequests] = useState([])
    const [showChat, setShowChat] = useState(false)
    const [showLeaveModal, setShowLeaveModal] = useState(false)
    const [leaveReason, setLeaveReason] = useState('')
    const { currentGroup: group, loading } = useSelector((state) => state.groups)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchGroupById(id))
    }, [dispatch, id])

    useEffect(() => {
        // Fetch pending requests if user is leader
        if (group?.leader?.id === user?.id) {
            api.get(`/groups/${id}/requests/`).then(res => setRequests(res.data))
            api.get(`/groups/${id}/leave_requests/`).then(res => setLeaveRequests(res.data))
        }
    }, [group, user, id])

    const handleJoinRequest = async () => {
        const result = await dispatch(joinGroup({ groupId: id, message }))
        if (joinGroup.fulfilled.match(result)) {
            toast.success('Join request sent!')
            setShowJoinModal(false)
            dispatch(fetchGroupById(id))
        } else {
            toast.error(result.payload?.message || 'Failed to send request')
        }
    }

    const handleLeave = async () => {
        try {
            await api.post(`/groups/${id}/leave/`, { reason: leaveReason })
            toast.success('Leave request submitted! Waiting for leader approval.')
            setShowLeaveModal(false)
            setLeaveReason('')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit leave request')
        }
    }

    const handleReviewRequest = async (requestId, action) => {
        try {
            await api.post(`/groups/${id}/requests/${requestId}/review/`, { action })
            toast.success(action === 'accept' ? 'Member added!' : 'Request rejected')
            setRequests(requests.filter(r => r.id !== requestId))
            dispatch(fetchGroupById(id))
        } catch (err) {
            toast.error('Failed to review request')
        }
    }

    const handleReviewLeaveRequest = async (requestId, action) => {
        try {
            await api.post(`/groups/${id}/leave_requests/${requestId}/review/`, { action })
            toast.success(action === 'approve' ? 'Member removed from group' : 'Leave request rejected')
            setLeaveRequests(leaveRequests.filter(r => r.id !== requestId))
            dispatch(fetchGroupById(id))
        } catch (err) {
            toast.error('Failed to review leave request')
        }
    }

    const handleDeleteGroup = async () => {
        if (confirm('Are you sure you want to DELETE this group? This action cannot be undone.')) {
            try {
                await api.delete(`/groups/${id}/`)
                toast.success('Group deleted')
                navigate('/groups/my')
            } catch (err) {
                toast.error('Failed to delete group')
            }
        }
    }

    const handleToggleComplete = async () => {
        try {
            const res = await api.post(`/groups/${id}/complete/`)
            toast.success(res.data.message)
            dispatch(fetchGroupById(id))
            dispatch(fetchMyGroups())
        } catch (err) {
            toast.error('Failed to update group status')
        }
    }

    if (loading || !group) {
        return (
            <div className="page-container">
                <div className="animate-pulse">
                    <div className="h-8 bg-dark-700 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-dark-700 rounded w-2/3 mb-8" />
                    <div className="card p-6">
                        <div className="h-40 bg-dark-700 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    const isLeader = group.leader?.id === user?.id
    const isMember = group.is_member
    const hasPendingRequest = group.has_pending_request

    return (
        <div className="page-container">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-dark-400 mb-6">
                <Link to="/explore" className="hover:text-dark-200">Explore</Link>
                <ChevronRight size={14} />
                <span className="text-dark-200">{group.name}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="card p-6">
                        <div className="flex items-start justify-between mb-4">
                            <span className={`badge ${group.type === 'research' ? 'badge-accent' :
                                group.type === 'hackathon' ? 'badge-warning' :
                                    group.type === 'startup' ? 'badge-accent' :
                                        'badge-primary'
                                }`}>
                                {group.type_display}
                            </span>
                            {group.status === 'completed' && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                    Completed
                                </span>
                            )}
                            <span className={`badge ${group.status === 'forming' ? 'badge-warning' :
                                group.status === 'active' ? 'badge-success' :
                                    'badge-primary'
                                }`}>
                                {group.status_display}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 mb-4">
                            {group.name}
                        </h1>

                        <p className="text-dark-300 leading-relaxed mb-6">
                            {group.description}
                        </p>

                        {/* Tags */}
                        {group.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {group.tags.map((tag, i) => (
                                    <span key={i} className="skill-badge">#{tag}</span>
                                ))}
                            </div>
                        )}

                        {/* Links */}
                        {(group.github_url || group.project_url) && (
                            <div className="flex gap-4 pt-4 border-t border-dark-700">
                                {group.github_url && (
                                    <a
                                        href={group.github_url}
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-2 text-dark-300 hover:text-primary-400"
                                    >
                                        <Github size={18} />
                                        GitHub
                                    </a>
                                )}
                                {group.project_url && (
                                    <a
                                        href={group.project_url}
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-2 text-dark-300 hover:text-primary-400"
                                    >
                                        <ExternalLink size={18} />
                                        Project
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Required Skills */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-dark-100 mb-4">
                            Required Skills
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {group.required_skills_detail?.map((skill, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                                    <span className="text-dark-200">{skill.name}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`w-2 h-2 rounded-full ${level <= skill.min_proficiency
                                                    ? 'bg-primary-500'
                                                    : 'bg-dark-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Requests (Leader Only) */}
                    {isLeader && requests.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-dark-100 mb-4">
                                Pending Requests ({requests.length})
                            </h2>
                            <div className="space-y-4">
                                {requests.map((req) => (
                                    <div key={req.id} className="flex items-start gap-4 p-4 bg-dark-800 rounded-lg">
                                        {req.user?.avatar_url ? (
                                            <img
                                                src={req.user.avatar_url}
                                                alt={req.user.full_name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="avatar w-10 h-10">
                                                {req.user?.first_name?.[0]}{req.user?.last_name?.[0]}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-dark-100">{req.user?.full_name}</p>
                                            {req.message && (
                                                <p className="text-sm text-dark-400 mt-1">{req.message}</p>
                                            )}
                                            {req.user_profile && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {req.user_profile.skills_detail?.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-dark-700 text-dark-300">
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReviewRequest(req.id, 'accept')}
                                                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReviewRequest(req.id, 'reject')}
                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Leave Requests (Leader Only) */}
                    {isLeader && leaveRequests.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-dark-100 mb-4">
                                Leave Requests ({leaveRequests.length})
                            </h2>
                            <div className="space-y-4">
                                {leaveRequests.map((req) => (
                                    <div key={req.id} className="flex items-start gap-4 p-4 bg-dark-800 rounded-lg">
                                        {req.user?.avatar_url ? (
                                            <img
                                                src={req.user.avatar_url}
                                                alt={req.user.full_name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="avatar w-10 h-10">
                                                {req.user?.full_name?.[0] || '?'}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-dark-100">{req.user?.full_name}</p>
                                            {req.reason && (
                                                <p className="text-sm text-dark-400 mt-1">Reason: {req.reason}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReviewLeaveRequest(req.id, 'approve')}
                                                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                title="Approve (Remove member)"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReviewLeaveRequest(req.id, 'reject')}
                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                title="Reject (Keep member)"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Capacity Card */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-dark-200">Team Capacity</h3>
                            <Users size={18} className="text-dark-400" />
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-dark-400">{group.member_count} members</span>
                                <span className={group.is_full ? 'text-red-400' : 'text-green-400'}>
                                    {group.available_spots} spots left
                                </span>
                            </div>
                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                                    style={{ width: `${(group.member_count / group.capacity) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isMember && !hasPendingRequest && !group.is_full && (
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="btn-primary w-full"
                            >
                                <UserPlus size={18} className="mr-2" />
                                Request to Join
                            </button>
                        )}
                        {hasPendingRequest && (
                            <div className="text-center py-3 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <p className="text-yellow-400 text-sm">Request Pending</p>
                            </div>
                        )}
                        {isMember && !isLeader && (
                            <button onClick={() => setShowLeaveModal(true)} className="btn-danger w-full">
                                <LogOut size={18} className="mr-2" />
                                Request to Leave
                            </button>
                        )}
                        {isMember && (
                            <button
                                onClick={() => setShowChat(true)}
                                className="btn-secondary w-full mt-3"
                            >
                                <MessageSquare size={18} className="mr-2" />
                                Open Chat
                            </button>
                        )}
                        {isLeader && (
                            <>
                                <button
                                    onClick={handleToggleComplete}
                                    className={`btn-${group.status === 'completed' ? 'secondary' : 'primary'} w-full mt-3`}
                                >
                                    <Check size={18} className="mr-2" />
                                    {group.status === 'completed' ? 'Mark as Active' : 'Mark as Completed'}
                                </button>
                                <button
                                    onClick={handleDeleteGroup}
                                    className="btn-danger w-full mt-3"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    Delete Group
                                </button>
                            </>
                        )}
                    </div>

                    {/* Members */}
                    <div className="card p-6">
                        <h3 className="font-medium text-dark-200 mb-4">Team Members</h3>
                        <div className="space-y-3">
                            {group.members?.map((member) => (
                                <Link
                                    key={member.id}
                                    to={`/profile/${member.user?.id}`}
                                    className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-dark-800"
                                >
                                    {member.user?.avatar_url ? (
                                        <img
                                            src={member.user.avatar_url}
                                            alt={member.user.full_name}
                                            className="w-8 h-8 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="avatar w-8 h-8 text-sm">
                                            {member.user?.first_name?.[0]}{member.user?.last_name?.[0]}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark-200 truncate">
                                            {member.user?.full_name}
                                        </p>
                                        <p className="text-xs text-dark-400 capitalize">{member.role}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Created Info */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 text-sm text-dark-400">
                            <Clock size={14} />
                            <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Join Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80">
                    <div className="card p-6 w-full max-w-md animate-scale-in">
                        <h2 className="text-xl font-semibold text-dark-100 mb-4">
                            Request to Join
                        </h2>
                        <p className="text-dark-400 mb-4">
                            Add a message to introduce yourself to the group leader.
                        </p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Why do you want to join? What skills can you contribute?"
                            className="input min-h-[100px] resize-none mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowJoinModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoinRequest}
                                className="btn-primary flex-1"
                            >
                                <Send size={18} className="mr-2" />
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Request Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80">
                    <div className="card p-6 w-full max-w-md animate-scale-in">
                        <h2 className="text-xl font-semibold text-dark-100 mb-4">
                            Request to Leave
                        </h2>
                        <p className="text-dark-400 mb-4">
                            Your leave request will be sent to the group leader for approval.
                        </p>
                        <textarea
                            value={leaveReason}
                            onChange={(e) => setLeaveReason(e.target.value)}
                            placeholder="Reason for leaving (optional)"
                            className="input min-h-[100px] resize-none mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLeave}
                                className="btn-danger flex-1"
                            >
                                <LogOut size={18} className="mr-2" />
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
