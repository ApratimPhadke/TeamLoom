import { useState } from 'react'
import { X, Filter } from 'lucide-react'

const FILTER_OPTIONS = [
    { id: 'has_slots', label: 'Has open slots', icon: '🟢' },
    { id: 'active_24h', label: 'Active last 24h', icon: '⚡' },
    { id: 'beginner', label: 'Beginner-friendly', icon: '🌱' },
    { id: 'cross_dept', label: 'Cross-department', icon: '🌐' },
    { id: 'professor_led', label: 'Professor-led', icon: '👨‍🏫' },
    { id: 'high_match', label: 'High skill match', icon: '🎯' },
]

export default function FilterChips({ activeFilters = [], onChange, onClear }) {
    const [showAll, setShowAll] = useState(false)

    const toggleFilter = (filterId) => {
        if (activeFilters.includes(filterId)) {
            onChange(activeFilters.filter(f => f !== filterId))
        } else {
            onChange([...activeFilters, filterId])
        }
    }

    const displayFilters = showAll ? FILTER_OPTIONS : FILTER_OPTIONS.slice(0, 4)

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
                {displayFilters.map(filter => {
                    const isActive = activeFilters.includes(filter.id)
                    return (
                        <button
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50'
                                    : 'bg-dark-800 text-dark-300 border border-dark-600 hover:border-dark-400'
                                }`}
                        >
                            <span>{filter.icon}</span>
                            {filter.label}
                            {isActive && <X size={14} className="ml-1" />}
                        </button>
                    )
                })}

                {!showAll && FILTER_OPTIONS.length > 4 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-sm text-primary-400 hover:text-primary-300"
                    >
                        +{FILTER_OPTIONS.length - 4} more
                    </button>
                )}

                {showAll && (
                    <button
                        onClick={() => setShowAll(false)}
                        className="text-sm text-dark-400 hover:text-dark-300"
                    >
                        Show less
                    </button>
                )}
            </div>

            {activeFilters.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-dark-400">
                        {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} active
                    </span>
                    <button
                        onClick={onClear}
                        className="text-sm text-red-400 hover:text-red-300"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    )
}

export function QuickFilters({ onFilter }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => onFilter('trending')} className="shrink-0 px-4 py-2 rounded-full bg-dark-800 text-dark-200 text-sm hover:bg-dark-700 flex items-center gap-1">
                🔥 Trending
            </button>
            <button onClick={() => onFilter('new')} className="shrink-0 px-4 py-2 rounded-full bg-dark-800 text-dark-200 text-sm hover:bg-dark-700 flex items-center gap-1">
                ✨ New
            </button>
            <button onClick={() => onFilter('match')} className="shrink-0 px-4 py-2 rounded-full bg-dark-800 text-dark-200 text-sm hover:bg-dark-700 flex items-center gap-1">
                🎯 Best Match
            </button>
            <button onClick={() => onFilter('available')} className="shrink-0 px-4 py-2 rounded-full bg-dark-800 text-dark-200 text-sm hover:bg-dark-700 flex items-center gap-1">
                🟢 Open Slots
            </button>
        </div>
    )
}
