import { useMemo } from 'react'

/**
 * Animated floating background blobs for a modern, dynamic feel
 * Inspired by Discord, Notion, and Figma aesthetics
 */
export default function AnimatedBackground({ variant = 'default', intensity = 'normal' }) {
    const blobs = useMemo(() => {
        const configs = {
            default: [
                { color: 'from-primary-500/30', size: 'w-96 h-96', position: 'top-20 -left-48', animation: 'animate-float' },
                { color: 'from-accent-500/30', size: 'w-[30rem] h-[30rem]', position: 'bottom-20 -right-48', animation: 'animate-float-delayed' },
                { color: 'from-primary-600/20', size: 'w-72 h-72', position: 'top-1/2 left-1/3', animation: 'animate-float-slow' },
            ],
            hero: [
                { color: 'from-primary-500/40', size: 'w-[40rem] h-[40rem]', position: 'top-0 -left-64', animation: 'animate-float' },
                { color: 'from-accent-500/40', size: 'w-[35rem] h-[35rem]', position: 'bottom-0 -right-64', animation: 'animate-float-delayed' },
                { color: 'from-neon-pink/20', size: 'w-96 h-96', position: 'top-1/3 right-1/4', animation: 'animate-float-slow' },
                { color: 'from-neon-blue/15', size: 'w-64 h-64', position: 'bottom-1/4 left-1/4', animation: 'animate-float' },
            ],
            subtle: [
                { color: 'from-primary-500/20', size: 'w-64 h-64', position: 'top-10 right-10', animation: 'animate-float-slow' },
                { color: 'from-accent-500/15', size: 'w-48 h-48', position: 'bottom-20 left-20', animation: 'animate-float' },
            ],
        }
        return configs[variant] || configs.default
    }, [variant])

    const opacityClass = intensity === 'high' ? 'opacity-100' : intensity === 'low' ? 'opacity-50' : 'opacity-75'

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${opacityClass}`}>
            {blobs.map((blob, index) => (
                <div
                    key={index}
                    className={`absolute rounded-full blur-3xl bg-gradient-radial ${blob.color} to-transparent ${blob.size} ${blob.position} ${blob.animation}`}
                />
            ))}

            {/* Subtle grid overlay for depth */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />
        </div>
    )
}

/**
 * Floating particles effect
 */
export function FloatingParticles({ count = 20 }) {
    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 10,
            opacity: Math.random() * 0.3 + 0.1,
        }))
    }, [count])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-primary-400"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.left}%`,
                        opacity: particle.opacity,
                        animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                        bottom: '-10px',
                    }}
                />
            ))}
        </div>
    )
}

/**
 * Gradient orbs that follow mouse (optional interactive effect)
 */
export function GlowOrb({ color = 'primary', size = 'lg' }) {
    const sizeClasses = {
        sm: 'w-32 h-32',
        md: 'w-48 h-48',
        lg: 'w-64 h-64',
        xl: 'w-96 h-96',
    }

    const colorClasses = {
        primary: 'from-primary-500/30',
        accent: 'from-accent-500/30',
        neon: 'from-neon-green/20',
    }

    return (
        <div
            className={`absolute rounded-full blur-3xl bg-gradient-radial ${colorClasses[color]} to-transparent ${sizeClasses[size]} animate-float`}
        />
    )
}
