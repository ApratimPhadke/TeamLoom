import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Save, Github, Linkedin, Globe, FileText, Plus, X, Eye, Check, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { updateUser } from '../store/authSlice'
import ProfileProgress from '../components/profile/ProfileProgress'
import { SkeletonProfile } from '../components/ui/Skeleton'

export default function MyProfile() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [profile, setProfile] = useState(null)
    const [skills, setSkills] = useState([])
    const [allSkills, setAllSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showSkillPicker, setShowSkillPicker] = useState(false)
    const [profileViews, setProfileViews] = useState({ today_views: 0, total_views: 0, recent_views: [] })
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchProfile()
        fetchAllSkills()
        fetchProfileViews()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profiles/me/')
            setProfile(res.data)
            setSkills(res.data.skills || [])
            setAvatarPreview(res.data.avatar_url || user?.avatar_url)
            setLoading(false)
        } catch (err) {
            toast.error('Failed to load profile')
            setLoading(false)
        }
    }

    const fetchAllSkills = async () => {
        try {
            const res = await api.get('/profiles/skills/')
            setAllSkills(res.data)
        } catch (err) {
            console.error('Failed to fetch skills')
        }
    }

    const fetchProfileViews = async () => {
        try {
            const res = await api.get('/profiles/views/')
            setProfileViews(res.data)
        } catch (err) {
            console.error('Failed to fetch profile views')
        }
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB')
            return
        }

        // Show preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
            setAvatarPreview(e.target.result)
        }
        reader.readAsDataURL(file)

        // Upload to server
        setUploadingAvatar(true)
        try {
            const formData = new FormData()
            formData.append('avatar', file)
            const res = await api.post('/auth/upload-avatar/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setAvatarPreview(res.data.avatar_url)
            dispatch(updateUser({ avatar_url: res.data.avatar_url }))
            toast.success('Profile photo updated!')
        } catch (err) {
            toast.error('Failed to upload photo')
            // Revert preview
            setAvatarPreview(user?.avatar_url)
        }
        setUploadingAvatar(false)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await api.put('/profiles/me/', {
                ...profile,
                skills
            })
            setProfile(res.data)
            toast.success('Profile saved!')
        } catch (err) {
            toast.error('Failed to save profile')
        }
        setSaving(false)
    }

    const addSkill = (skillId) => {
        if (!skills.find(s => s.skill_id === skillId)) {
            setSkills([...skills, { skill_id: skillId, proficiency: 3 }])
        }
        setShowSkillPicker(false)
    }

    const removeSkill = (skillId) => {
        setSkills(skills.filter(s => s.skill_id !== skillId))
    }

    const updateProficiency = (skillId, proficiency) => {
        setSkills(skills.map(s =>
            s.skill_id === skillId ? { ...s, proficiency } : s
        ))
    }

    const getSkillName = (skillId) => {
        return allSkills.find(s => s.id === skillId)?.name || 'Unknown'
    }

    if (loading) {
        return (
            <div className="page-container max-w-4xl">
                <SkeletonProfile />
            </div>
        )
    }

    return (
        <div className="page-container max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-dark-100">My Profile</h1>
                    <p className="text-dark-400 mt-1">Manage your profile and skills</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                    <Save size={18} className="mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Profile Photo */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold text-dark-100 mb-6">Profile Photo</h2>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-2 border-dark-600"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </div>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute inset-0 rounded-full bg-dark-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            {uploadingAvatar ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Camera size={24} className="text-white" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="btn-secondary mb-2"
                        >
                            {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                        </button>
                        <p className="text-sm text-dark-400">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                </div>
            </div>

            {/* Profile Completion Progress */}
            <ProfileProgress profile={profile} />

            {/* Profile Views Analytics */}
            <div className="card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={18} className="text-primary-400" />
                    <h2 className="font-semibold text-dark-100">Profile Analytics</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-dark-800 rounded-lg">
                        <p className="text-2xl font-bold gradient-text">{profileViews.today_views}</p>
                        <p className="text-sm text-dark-400">Views Today</p>
                    </div>
                    <div className="p-4 bg-dark-800 rounded-lg">
                        <p className="text-2xl font-bold gradient-text">{profileViews.total_views}</p>
                        <p className="text-sm text-dark-400">Total Views</p>
                    </div>
                    <div className="p-4 bg-dark-800 rounded-lg">
                        <p className="text-2xl font-bold gradient-text">{profileViews.recent_views?.length || 0}</p>
                        <p className="text-sm text-dark-400">Recent Visitors</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Basic Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-dark-100 mb-6">Basic Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Department</label>
                            <input
                                type="text"
                                value={profile?.department || ''}
                                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                className="input"
                                placeholder="e.g., Computer Science"
                            />
                        </div>
                        <div>
                            <label className="label">Year</label>
                            <select
                                value={profile?.year || 1}
                                onChange={(e) => setProfile({ ...profile, year: parseInt(e.target.value) })}
                                className="input"
                            >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                                <option value={5}>Post-Graduate</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Tagline</label>
                            <input
                                type="text"
                                value={profile?.tagline || ''}
                                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                                className="input"
                                placeholder="A short description of yourself"
                                maxLength={150}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Bio</label>
                            <textarea
                                value={profile?.bio || ''}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="input min-h-[100px] resize-none"
                                placeholder="Tell others about yourself, your interests, and what you're looking for..."
                                maxLength={500}
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-dark-100">Skills</h2>
                        <button
                            onClick={() => setShowSkillPicker(true)}
                            className="btn-secondary text-sm"
                        >
                            <Plus size={16} className="mr-1" />
                            Add Skill
                        </button>
                    </div>

                    {skills.length === 0 ? (
                        <p className="text-dark-400 text-center py-8">
                            No skills added yet. Add your skills to get matched with the right teams!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {skills.map((skill) => (
                                <div key={skill.skill_id} className="flex items-center gap-4 p-3 bg-dark-800 rounded-lg">
                                    <span className="flex-1 text-dark-200">{getSkillName(skill.skill_id)}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-dark-400">Proficiency:</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => updateProficiency(skill.skill_id, level)}
                                                    className={`w-6 h-6 rounded-full border-2 transition-colors ${level <= skill.proficiency
                                                        ? 'bg-primary-500 border-primary-500'
                                                        : 'border-dark-600 hover:border-dark-400'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSkill(skill.skill_id)}
                                        className="p-1 text-dark-400 hover:text-red-400"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Links */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-dark-100 mb-6">Portfolio Links</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label flex items-center gap-2">
                                <Github size={16} /> GitHub URL
                            </label>
                            <input
                                type="url"
                                value={profile?.github_url || ''}
                                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                                className="input"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div>
                            <label className="label flex items-center gap-2">
                                <Linkedin size={16} /> LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={profile?.linkedin_url || ''}
                                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                                className="input"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                        <div>
                            <label className="label flex items-center gap-2">
                                <Globe size={16} /> Portfolio URL
                            </label>
                            <input
                                type="url"
                                value={profile?.portfolio_url || ''}
                                onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                                className="input"
                                placeholder="https://yourportfolio.com"
                            />
                        </div>
                        <div>
                            <label className="label flex items-center gap-2">
                                <FileText size={16} /> Resume URL
                            </label>
                            <input
                                type="url"
                                value={profile?.resume_url || ''}
                                onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                                className="input"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-dark-100 mb-6">Availability</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={profile?.looking_for_team || false}
                                onChange={(e) => setProfile({ ...profile, looking_for_team: e.target.checked })}
                                className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                            />
                            <div>
                                <p className="text-dark-200">Looking for a team</p>
                                <p className="text-sm text-dark-400">Show your profile to group leaders</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={profile?.open_to_mentorship || false}
                                onChange={(e) => setProfile({ ...profile, open_to_mentorship: e.target.checked })}
                                className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                            />
                            <div>
                                <p className="text-dark-200">Open to mentorship</p>
                                <p className="text-sm text-dark-400">Let professors know you're interested in research</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Skill Picker Modal */}
            {showSkillPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80">
                    <div className="card p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-dark-100">Add Skill</h2>
                            <button onClick={() => setShowSkillPicker(false)} className="text-dark-400 hover:text-dark-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {Object.entries(
                                allSkills.reduce((acc, skill) => {
                                    const cat = skill.category_display || skill.category
                                    if (!acc[cat]) acc[cat] = []
                                    acc[cat].push(skill)
                                    return acc
                                }, {})
                            ).map(([category, categorySkills]) => (
                                <div key={category} className="mb-6">
                                    <h3 className="text-sm font-medium text-dark-400 mb-2">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySkills.map((skill) => {
                                            const isAdded = skills.find(s => s.skill_id === skill.id)
                                            return (
                                                <button
                                                    key={skill.id}
                                                    onClick={() => !isAdded && addSkill(skill.id)}
                                                    disabled={isAdded}
                                                    className={`skill-badge ${isAdded ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500'}`}
                                                >
                                                    {skill.name}
                                                    {isAdded && <Check size={14} className="ml-1 text-green-400" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
