/**
 * Loading Spinner Component - Flat Minimalist Style
 * Simple, performant, GPU-accelerated
 */

// Simple rotating spinner
export function LoadingSpinner({ className = "w-6 h-6", color = "currentColor" }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="3"
            />
            <path
                className="opacity-75"
                fill={color}
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

// Dots loading animation
export function LoadingDots({ className = "w-16 h-4" }) {
    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    );
}

// Pulse ring loading
export function LoadingPulse({ className = "w-12 h-12" }) {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 rounded-full bg-teal-500 opacity-25 animate-ping" />
            <div className="relative flex items-center justify-center w-full h-full rounded-full bg-teal-500">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
            </div>
        </div>
    );
}

// Compass spinning loader
export function LoadingCompass({ className = "w-12 h-12" }) {
    return (
        <div className={`relative ${className}`}>
            <svg className="w-full h-full animate-spin-slow" viewBox="0 0 48 48" fill="none">
                {/* Outer ring */}
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-secondary dark:text-secondary-dark" />
                {/* Cardinal points */}
                <text x="24" y="8" textAnchor="middle" fill="currentColor" className="text-teal-500 text-xs font-bold">N</text>
                <text x="24" y="44" textAnchor="middle" fill="currentColor" className="text-paragraph dark:text-paragraph-dark text-xs">S</text>
                <text x="6" y="26" textAnchor="middle" fill="currentColor" className="text-paragraph dark:text-paragraph-dark text-xs">W</text>
                <text x="42" y="26" textAnchor="middle" fill="currentColor" className="text-paragraph dark:text-paragraph-dark text-xs">E</text>
            </svg>
            {/* Needle */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[20px] border-b-coral-500 transform -translate-y-1" />
            </div>
        </div>
    );
}

// Progress bar with plane
export function LoadingProgress({ progress = 0, className = "w-full" }) {
    return (
        <div className={className}>
            <div className="relative h-2 bg-secondary dark:bg-secondary-dark rounded-full overflow-hidden">
                <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div 
                className="relative -mt-4 transition-all duration-300 ease-out"
                style={{ marginLeft: `${Math.max(0, progress - 4)}%` }}
            >
                <svg className="w-6 h-6 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
            </div>
        </div>
    );
}

export default {
    LoadingSpinner,
    LoadingDots,
    LoadingPulse,
    LoadingCompass,
    LoadingProgress,
};
