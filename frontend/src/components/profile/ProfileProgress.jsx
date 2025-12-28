import { Check, Github, FileText, User, Briefcase, Code, Camera } from 'lucide-react'

const PROFILE_FIELDS = [
    { key: 'skills', label: 'Add your skills', icon: Code, weight: 25, check: (p) => p?.skills?.length >= 3 },
    { key: 'bio', label: 'Write a bio', icon: User, weight: 20, check: (p) => p?.bio?.length >= 50 },
    { key: 'department', label: 'Set department', icon: Briefcase, weight: 15, check: (p) => !!p?.department },
    { key: 'github', label: 'Link GitHub', icon: Github, weight: 15, check: (p) => !!p?.github_url },
    { key: 'portfolio', label: 'Add portfolio', icon: FileText, weight: 10, check: (p) => !!p?.portfolio_url },
    { key: 'avatar', label: 'Add photo', icon: Camera, weight: 15, check: (p) => !!p?.avatar_url },
]

export default function ProfileProgress({ profile, onFieldClick }) {
    const completedFields = PROFILE_FIELDS.filter(f => f.check(profile))
    const progress = completedFields.reduce((sum, f) => sum + f.weight, 0)
    const incompleteFields = PROFILE_FIELDS.filter(f => !f.check(profile))

    const getProgressColor = () => {
        if (progress >= 80) return 'from-green-500 to-emerald-400'
        if (progress >= 50) return 'from-primary-500 to-accent-400'
        if (progress >= 25) return 'from-yellow-500 to-orange-400'
        return 'from-red-500 to-orange-400'
    }

    const getProgressMessage = () => {
        if (progress >= 100) return '🎉 Profile complete! You stand out!'
        if (progress >= 80) return '🔥 Almost there! Just a few more details'
        if (progress >= 50) return '💪 Good progress! Keep going'
        if (progress >= 25) return '🚀 Great start! Add more to get noticed'
        return '👋 Let teams know who you are!'
    }

    return (
        <div className="card p-6 mb-6 bg-gradient-to-r from-dark-900/80 to-dark-800/80">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-dark-100">Profile Strength</h3>
                    <p className="text-sm text-dark-400">{getProgressMessage()}</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold gradient-text">{progress}%</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-dark-700 rounded-full overflow-hidden mb-6">
                <div
                    className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Field checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROFILE_FIELDS.map((field) => {
                    const isComplete = field.check(profile)
                    const Icon = field.icon

                    return (
                        <button
                            key={field.key}
                            onClick={() => !isComplete && onFieldClick?.(field.key)}
                            className={`flex items-center gap-2 p-3 rounded-lg transition-all ${isComplete
                                    ? 'bg-green-500/10 border border-green-500/30 cursor-default'
                                    : 'bg-dark-800 border border-dark-600 hover:border-primary-500/50 hover:bg-dark-700 cursor-pointer'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-500/20' : 'bg-dark-700'
                                }`}>
                                {isComplete ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Icon className="w-4 h-4 text-dark-400" />
                                )}
                            </div>
                            <span className={`text-sm ${isComplete ? 'text-green-400' : 'text-dark-300'}`}>
                                {field.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Tip for incomplete profiles */}
            {progress < 80 && incompleteFields.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
                    <p className="text-sm text-primary-300">
                        <span className="font-medium">Pro tip:</span> Complete profiles get 3x more views!
                        {incompleteFields[0] && ` Try adding your ${incompleteFields[0].label.toLowerCase()}.`}
                    </p>
                </div>
            )}
        </div>
    )
}
