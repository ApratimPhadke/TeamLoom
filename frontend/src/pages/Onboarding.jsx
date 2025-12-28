import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ChevronRight, ChevronLeft, Sparkles, Code, Users, Rocket, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/client'

const PROJECT_TYPES = [
    { id: 'student', icon: '📚', title: 'Course Project', desc: 'Academic assignment or capstone' },
    { id: 'hackathon', icon: '⚡', title: 'Hackathon', desc: 'Competition or time-bound event' },
    { id: 'research', icon: '🔬', title: 'Research', desc: 'Academic research with faculty' },
    { id: 'startup', icon: '🚀', title: 'Startup Idea', desc: 'Building a product or company' },
    { id: 'open_source', icon: '🌐', title: 'Open Source', desc: 'Contributing to public projects' },
    { id: 'exploring', icon: '🔍', title: 'Just Exploring', desc: 'Looking for opportunities' },
]

export default function Onboarding() {
    const [step, setStep] = useState(1)
    const [projectType, setProjectType] = useState(null)
    const [selectedSkills, setSelectedSkills] = useState([])
    const [allSkills, setAllSkills] = useState([])
    const [skillSearch, setSkillSearch] = useState('')
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/profiles/skills/').then(res => setAllSkills(res.data)).catch(() => { })
    }, [])

    useEffect(() => {
        if (step === 3 && selectedSkills.length > 0) {
            setLoading(true)
            api.get('/groups/recommended/').then(res => {
                setRecommendations(res.data.slice(0, 5))
                setLoading(false)
            }).catch(() => setLoading(false))
        }
    }, [step, selectedSkills])

    const filteredSkills = allSkills.filter(s =>
        s.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !selectedSkills.find(sel => sel.id === s.id)
    ).slice(0, 12)

    const toggleSkill = (skill) => {
        if (selectedSkills.find(s => s.id === skill.id)) {
            setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id))
        } else if (selectedSkills.length < 5) {
            setSelectedSkills([...selectedSkills, skill])
        }
    }

    const handleComplete = async () => {
        try {
            // Save skills to profile
            await api.put('/profiles/me/', {
                skills: selectedSkills.map(s => ({ skill_id: s.id, proficiency: 3 })),
                looking_for_team: true
            })
            toast.success('Profile updated!')
            navigate('/explore')
        } catch (err) {
            toast.error('Failed to save preferences')
        }
    }

    const canProceed = () => {
        if (step === 1) return !!projectType
        if (step === 2) return selectedSkills.length >= 1
        return true
    }

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s < step ? 'bg-primary-500 text-white' :
                                    s === step ? 'bg-primary-500/20 text-primary-400 ring-2 ring-primary-500' :
                                        'bg-dark-800 text-dark-400'
                                }`}>
                                {s < step ? <Check size={20} /> : s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 mx-2 rounded ${s < step ? 'bg-primary-500' : 'bg-dark-700'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Project Type */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <Rocket className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-dark-100 mb-2">What are you building?</h1>
                            <p className="text-dark-400">Help us find the right teams for you</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {PROJECT_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setProjectType(type.id)}
                                    className={`p-4 rounded-xl text-left transition-all ${projectType === type.id
                                            ? 'bg-primary-500/20 border-2 border-primary-500 ring-2 ring-primary-500/30'
                                            : 'bg-dark-800 border-2 border-dark-700 hover:border-dark-500'
                                        }`}
                                >
                                    <span className="text-3xl mb-2 block">{type.icon}</span>
                                    <h3 className="font-semibold text-dark-100">{type.title}</h3>
                                    <p className="text-xs text-dark-400 mt-1">{type.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Skills */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <Code className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-dark-100 mb-2">What are your top skills?</h1>
                            <p className="text-dark-400">Select up to 5 skills you're best at</p>
                        </div>

                        {/* Selected */}
                        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                            {selectedSkills.map(skill => (
                                <button
                                    key={skill.id}
                                    onClick={() => toggleSkill(skill)}
                                    className="skill-badge bg-primary-500/20 border-primary-500 text-primary-300"
                                >
                                    {skill.name} ✕
                                </button>
                            ))}
                            {selectedSkills.length === 0 && (
                                <span className="text-dark-500 text-sm">Click skills below to add them</span>
                            )}
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            value={skillSearch}
                            onChange={(e) => setSkillSearch(e.target.value)}
                            placeholder="Search skills..."
                            className="input mb-4"
                        />

                        {/* Skill grid */}
                        <div className="flex flex-wrap gap-2">
                            {filteredSkills.map(skill => (
                                <button
                                    key={skill.id}
                                    onClick={() => toggleSkill(skill)}
                                    className="skill-badge hover:border-primary-500/50"
                                >
                                    {skill.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Recommendations */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <Sparkles className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-dark-100 mb-2">Groups that match you!</h1>
                            <p className="text-dark-400">Based on your skills, here are some recommendations</p>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="card p-4 animate-pulse">
                                        <div className="h-5 bg-dark-700 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-dark-700 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="space-y-3">
                                {recommendations.map(group => (
                                    <div key={group.id} className="card p-4 flex items-center justify-between hover:border-primary-500/50">
                                        <div>
                                            <h3 className="font-medium text-dark-100">{group.name}</h3>
                                            <p className="text-sm text-dark-400">{group.available_spots} spots • {group.type}</p>
                                        </div>
                                        <span className="badge badge-success">Match!</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-dark-400">
                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No perfect matches yet, but check out Explore!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={() => setStep(s => s - 1)}
                        disabled={step === 1}
                        className="btn-secondary disabled:opacity-30"
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canProceed()}
                            className="btn-primary disabled:opacity-50"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button onClick={handleComplete} className="btn-primary">
                            Get Started <Sparkles size={20} className="ml-1" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
