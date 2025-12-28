import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Github, Linkedin, Globe, FileText, Mail, MessageSquare } from 'lucide-react'
import api from '../api/client'

export default function Profile() {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/profiles/students/${id}/`)
            .then(res => {
                setProfile(res.data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="page-container max-w-3xl">
                <div className="animate-pulse">
                    <div className="card p-8">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 rounded-full bg-dark-700" />
                            <div className="flex-1">
                                <div className="h-8 bg-dark-700 rounded w-48 mb-3" />
                                <div className="h-4 bg-dark-700 rounded w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="page-container text-center">
                <h1 className="text-2xl font-bold text-dark-100 mb-4">Profile Not Found</h1>
                <Link to="/explore" className="btn-primary">Back to Explore</Link>
            </div>
        )
    }

    return (
        <div className="page-container max-w-3xl">
            {/* Profile Header */}
            <div className="card p-8 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="avatar w-24 h-24 text-3xl">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-dark-100 mb-1">{profile.full_name}</h1>
                        <p className="text-dark-400 mb-3">
                            {profile.department} • {profile.year_display}
                        </p>
                        {profile.tagline && (
                            <p className="text-dark-300">{profile.tagline}</p>
                        )}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                            {profile.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener" className="btn-ghost p-2">
                                    <Github size={20} />
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener" className="btn-ghost p-2">
                                    <Linkedin size={20} />
                                </a>
                            )}
                            {profile.portfolio_url && (
                                <a href={profile.portfolio_url} target="_blank" rel="noopener" className="btn-ghost p-2">
                                    <Globe size={20} />
                                </a>
                            )}
                            {profile.resume_url && (
                                <a href={profile.resume_url} target="_blank" rel="noopener" className="btn-ghost p-2">
                                    <FileText size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {profile.bio && (
                <div className="card p-6 mb-6">
                    <h2 className="text-lg font-semibold text-dark-100 mb-4">About</h2>
                    <p className="text-dark-300 leading-relaxed">{profile.bio}</p>
                </div>
            )}

            {/* Skills */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold text-dark-100 mb-4">Skills</h2>
                {profile.skills_detail?.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                        {profile.skills_detail.map((skill, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                                <span className="text-dark-200">{skill.name}</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`w-2 h-2 rounded-full ${level <= skill.proficiency ? 'bg-primary-500' : 'bg-dark-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-dark-400">No skills listed yet.</p>
                )}
            </div>

            {/* Stats */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-dark-100 mb-4">Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-dark-800 rounded-lg text-center">
                        <p className="text-2xl font-bold gradient-text">{profile.view_count}</p>
                        <p className="text-sm text-dark-400">Profile Views</p>
                    </div>
                    <div className="p-4 bg-dark-800 rounded-lg text-center">
                        <p className="text-2xl font-bold gradient-text">{profile.skills_detail?.length || 0}</p>
                        <p className="text-sm text-dark-400">Skills</p>
                    </div>
                    <div className="p-4 bg-dark-800 rounded-lg text-center">
                        <p className="text-sm text-dark-400 mt-1">
                            {profile.looking_for_team ? (
                                <span className="badge-success">Looking for team</span>
                            ) : (
                                <span className="badge-primary">Not available</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
