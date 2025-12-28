import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Users, FolderKanban, ChevronRight } from 'lucide-react'
import { fetchMyGroups } from '../store/groupsSlice'

export default function MyGroups() {
    const { myGroups, loading } = useSelector((state) => state.groups)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchMyGroups())
    }, [dispatch])

    return (
        <div className="page-container">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-100">My Groups</h1>
                    <p className="text-dark-400 mt-1">Groups you're a member of</p>
                </div>
                <Link to="/groups/create" className="btn-primary">
                    <Plus size={18} className="mr-2" />
                    Create Group
                </Link>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card p-6 animate-pulse">
                            <div className="h-6 bg-dark-700 rounded w-3/4 mb-4" />
                            <div className="h-4 bg-dark-700 rounded w-full mb-2" />
                        </div>
                    ))}
                </div>
            ) : myGroups.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGroups.map((group) => (
                        <Link key={group.id} to={`/groups/${group.id}`} className="card-hover p-6 block">
                            <div className="flex items-start justify-between mb-3">
                                <span className="badge badge-primary">{group.type}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-dark-100 mb-2">{group.name}</h3>
                            <p className="text-dark-400 text-sm mb-4 line-clamp-2">{group.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                                <div className="flex items-center gap-2 text-dark-400">
                                    <Users size={16} />
                                    <span className="text-sm">{group.member_count} members</span>
                                </div>
                                <ChevronRight size={18} className="text-dark-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <FolderKanban className="mx-auto text-dark-500 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-dark-200 mb-2">No groups yet</h3>
                    <p className="text-dark-400 mb-6">Create or join a group</p>
                    <Link to="/groups/create" className="btn-primary">Create Group</Link>
                </div>
            )}
        </div>
    )
}
