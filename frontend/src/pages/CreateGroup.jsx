import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createGroup } from '../store/groupsSlice'
import api from '../api/client'

export default function CreateGroup() {
    const [formData, setFormData] = useState({
        name: '', description: '', type: 'student', capacity: 5,
        required_skills: [], tags: [], github_url: '', project_url: '', is_public: true
    })
    const [allSkills, setAllSkills] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/profiles/skills/').then(res => setAllSkills(res.data))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const result = await dispatch(createGroup(formData))
        if (createGroup.fulfilled.match(result)) {
            toast.success('Group created!')
            navigate(`/groups/${result.payload.id}`)
        } else {
            toast.error('Failed to create group')
        }
        setLoading(false)
    }

    const addSkill = (skillId) => {
        if (!formData.required_skills.find(s => s.skill_id === skillId)) {
            setFormData({
                ...formData,
                required_skills: [...formData.required_skills, { skill_id: skillId, min_proficiency: 2 }]
            })
        }
    }

    const removeSkill = (skillId) => {
        setFormData({
            ...formData,
            required_skills: formData.required_skills.filter(s => s.skill_id !== skillId)
        })
    }

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
            setTagInput('')
        }
    }

    return (
        <div className="page-container max-w-2xl">
            <h1 className="text-3xl font-bold text-dark-100 mb-2">Create Group</h1>
            <p className="text-dark-400 mb-8">Start a new project and find teammates</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card p-6">
                    <h2 className="font-semibold text-dark-100 mb-4">Basic Info</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Group Name *</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input" placeholder="e.g., AI Image Recognition Project" required />
                        </div>
                        <div>
                            <label className="label">Description *</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input min-h-[100px]" placeholder="Describe your project goals..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input">
                                    <option value="student">Student Project</option>
                                    <option value="research">Research</option>
                                    <option value="hackathon">Hackathon</option>
                                    <option value="startup">Startup</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Team Size</label>
                                <input type="number" min="2" max="20" value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="input" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h2 className="font-semibold text-dark-100 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.required_skills.map(s => (
                            <span key={s.skill_id} className="skill-badge">
                                {allSkills.find(sk => sk.id === s.skill_id)?.name}
                                <button type="button" onClick={() => removeSkill(s.skill_id)}><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                    <select onChange={(e) => addSkill(parseInt(e.target.value))} className="input" value="">
                        <option value="">+ Add skill</option>
                        {allSkills.filter(s => !formData.required_skills.find(rs => rs.skill_id === s.id))
                            .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div className="card p-6">
                    <h2 className="font-semibold text-dark-100 mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map(tag => (
                            <span key={tag} className="skill-badge">
                                #{tag}
                                <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })}><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="input" placeholder="Add tag..." />
                        <button type="button" onClick={addTag} className="btn-secondary"><Plus size={18} /></button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                        {loading ? 'Creating...' : 'Create Group'}
                    </button>
                </div>
            </form>
        </div>
    )
}
