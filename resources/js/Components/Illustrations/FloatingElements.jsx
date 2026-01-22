/**
 * Floating Elements - Animated background decorations
 * Plane, clouds, hot air balloon for hero sections
 */

/**
 * Floating Plane - Animated plane flying across
 */
export function FloatingPlane({ className = "w-16 h-auto" }) {
    return (
        <svg
            className={`${className} animate-plane-float`}
            viewBox="0 0 80 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Plane body */}
            <path 
                d="M5 20 L35 18 L40 10 L45 18 L75 20 L45 22 L40 30 L35 22 Z" 
                fill="white" 
                stroke="#94a3b8" 
                strokeWidth="1"
            />
            {/* Windows */}
            <circle cx="25" cy="20" r="3" fill="#0ea5e9" />
            <circle cx="32" cy="20" r="2" fill="#0ea5e9" />
            {/* Wing detail */}
            <path d="M40 15 L55 18" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M40 25 L55 22" stroke="#cbd5e1" strokeWidth="1" />
            {/* Contrail */}
            <path 
                d="M75 20 Q85 20 95 22" 
                stroke="white" 
                strokeWidth="3" 
                opacity="0.6" 
                strokeLinecap="round"
            />
            <path 
                d="M75 20 Q88 19 100 21" 
                stroke="white" 
                strokeWidth="2" 
                opacity="0.4" 
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * Floating Clouds - Soft animated clouds
 */
export function FloatingClouds({ className = "w-full h-auto", variant = "default" }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Cloud 1 - Large, slow */}
            <svg
                className="absolute top-10 -left-20 w-40 h-20 animate-cloud-drift opacity-60"
                style={{ animationDuration: '35s' }}
                viewBox="0 0 160 80"
                fill="none"
            >
                <ellipse cx="80" cy="50" rx="60" ry="25" fill="white" />
                <ellipse cx="50" cy="45" rx="35" ry="20" fill="white" />
                <ellipse cx="110" cy="45" rx="40" ry="22" fill="white" />
                <ellipse cx="70" cy="35" rx="30" ry="18" fill="white" />
            </svg>

            {/* Cloud 2 - Medium, medium speed */}
            <svg
                className="absolute top-32 -left-16 w-32 h-16 animate-cloud-drift opacity-50"
                style={{ animationDuration: '28s', animationDelay: '10s' }}
                viewBox="0 0 128 64"
                fill="none"
            >
                <ellipse cx="64" cy="40" rx="50" ry="20" fill="white" />
                <ellipse cx="40" cy="35" rx="28" ry="16" fill="white" />
                <ellipse cx="88" cy="36" rx="32" ry="18" fill="white" />
            </svg>

            {/* Cloud 3 - Small, faster */}
            <svg
                className="absolute top-20 -left-10 w-24 h-12 animate-cloud-drift opacity-40"
                style={{ animationDuration: '22s', animationDelay: '5s' }}
                viewBox="0 0 96 48"
                fill="none"
            >
                <ellipse cx="48" cy="30" rx="40" ry="15" fill="white" />
                <ellipse cx="30" cy="26" rx="22" ry="12" fill="white" />
                <ellipse cx="66" cy="27" rx="25" ry="13" fill="white" />
            </svg>

            {variant === 'full' && (
                <>
                    {/* Additional clouds for full variant */}
                    <svg
                        className="absolute top-48 -left-24 w-36 h-18 animate-cloud-drift opacity-30"
                        style={{ animationDuration: '40s', animationDelay: '15s' }}
                        viewBox="0 0 144 72"
                        fill="none"
                    >
                        <ellipse cx="72" cy="45" rx="55" ry="22" fill="white" />
                        <ellipse cx="45" cy="40" rx="30" ry="17" fill="white" />
                        <ellipse cx="100" cy="41" rx="35" ry="19" fill="white" />
                    </svg>
                </>
            )}
        </div>
    );
}

/**
 * Hot Air Balloon - Floating decoration
 */
export function HotAirBalloon({ className = "w-20 h-auto" }) {
    return (
        <svg
            className={`${className} animate-float-slow`}
            viewBox="0 0 80 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Balloon */}
            <ellipse cx="40" cy="40" rx="35" ry="42" fill="#fb7185" />
            
            {/* Stripes */}
            <path d="M12 25 Q40 -10 68 25" stroke="white" strokeWidth="4" fill="none" />
            <path d="M8 45 Q40 10 72 45" stroke="white" strokeWidth="4" fill="none" />
            <path d="M10 65 Q40 40 70 65" stroke="#fda4af" strokeWidth="4" fill="none" />
            
            {/* Bottom of balloon */}
            <path d="M20 75 Q40 90 60 75" fill="#e11d48" />
            
            {/* Ropes */}
            <line x1="25" y1="82" x2="30" y2="95" stroke="#92400e" strokeWidth="1.5" />
            <line x1="55" y1="82" x2="50" y2="95" stroke="#92400e" strokeWidth="1.5" />
            <line x1="40" y1="85" x2="40" y2="95" stroke="#92400e" strokeWidth="1.5" />
            
            {/* Basket */}
            <rect x="27" y="95" width="26" height="18" fill="#d97706" rx="3" />
            <rect x="30" y="98" width="20" height="6" fill="#fbbf24" rx="2" />
            
            {/* Basket weave pattern */}
            <line x1="35" y1="98" x2="35" y2="113" stroke="#b45309" strokeWidth="1" />
            <line x1="45" y1="98" x2="45" y2="113" stroke="#b45309" strokeWidth="1" />
        </svg>
    );
}

/**
 * Floating decorative dots/particles
 */
export function FloatingParticles({ className = "w-full h-full" }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Various floating dots */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-40 animate-float" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-coral-400 rounded-full opacity-30 animate-float-slow" />
            <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-amber-400 rounded-full opacity-25 animate-float-delayed" />
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-indigo-400 rounded-full opacity-35 animate-float" />
            <div className="absolute top-2/3 left-1/5 w-3 h-3 bg-teal-300 rounded-full opacity-20 animate-float-slow" />
            <div className="absolute bottom-1/4 right-1/5 w-2 h-2 bg-coral-300 rounded-full opacity-30 animate-float-delayed" />
        </div>
    );
}

/**
 * Map Pin Marker - Animated bounce
 */
export function MapPinMarker({ className = "w-8 h-auto", color = "#f25042" }) {
    return (
        <svg
            className={`${className} animate-bounce-gentle`}
            viewBox="0 0 32 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Shadow */}
            <ellipse cx="16" cy="42" rx="8" ry="2" fill="black" opacity="0.2" />
            
            {/* Pin */}
            <path 
                d="M16 2 C8 2 2 8 2 16 C2 28 16 42 16 42 S30 28 30 16 C30 8 24 2 16 2" 
                fill={color}
            />
            
            {/* Inner circle */}
            <circle cx="16" cy="16" r="6" fill="white" />
            
            {/* Shine */}
            <ellipse cx="12" cy="12" rx="3" ry="2" fill="white" opacity="0.4" transform="rotate(-30, 12, 12)" />
        </svg>
    );
}

export default {
    FloatingPlane,
    FloatingClouds,
    HotAirBalloon,
    FloatingParticles,
    MapPinMarker,
};
