/**
 * Loading Planner Illustration - Detailed animated loading state
 * Map unfolding / Planning animation
 */

export default function LoadingPlannerIllustration({ className = "w-64 h-auto" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 300 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background circle pulse */}
            <circle cx="150" cy="125" r="80" fill="#0d9488" opacity="0.1" className="animate-pulse-soft" />
            <circle cx="150" cy="125" r="60" fill="#0d9488" opacity="0.15" className="animate-pulse-soft" style={{ animationDelay: '0.5s' }} />

            {/* Main map being drawn */}
            <g transform="translate(75, 50)">
                {/* Map paper */}
                <rect x="0" y="0" width="150" height="120" rx="8" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" />
                
                {/* Map fold lines */}
                <line x1="50" y1="0" x2="50" y2="120" stroke="#fde68a" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="100" y1="0" x2="100" y2="120" stroke="#fde68a" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Animated route being drawn */}
                <path 
                    d="M20 90 Q40 70 60 80 Q80 90 100 60 Q120 30 130 50" 
                    stroke="#0d9488" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    style={{
                        animation: 'drawRoute 2s ease-in-out infinite'
                    }}
                />
                
                {/* Location pins appearing */}
                <g className="animate-scale-in" style={{ animationDelay: '0.3s', transformOrigin: '20px 90px' }}>
                    <circle cx="20" cy="90" r="8" fill="#f25042" />
                    <circle cx="20" cy="90" r="3" fill="white" />
                </g>
                
                <g className="animate-scale-in" style={{ animationDelay: '0.8s', transformOrigin: '60px 80px' }}>
                    <circle cx="60" cy="80" r="6" fill="#fbbf24" />
                    <circle cx="60" cy="80" r="2" fill="white" />
                </g>
                
                <g className="animate-scale-in" style={{ animationDelay: '1.3s', transformOrigin: '100px 60px' }}>
                    <circle cx="100" cy="60" r="6" fill="#fbbf24" />
                    <circle cx="100" cy="60" r="2" fill="white" />
                </g>
                
                <g className="animate-scale-in" style={{ animationDelay: '1.8s', transformOrigin: '130px 50px' }}>
                    <circle cx="130" cy="50" r="8" fill="#0d9488" />
                    <circle cx="130" cy="50" r="3" fill="white" />
                </g>
                
                {/* Grid lines on map */}
                <g opacity="0.2">
                    <line x1="0" y1="30" x2="150" y2="30" stroke="#92400e" strokeWidth="1" />
                    <line x1="0" y1="60" x2="150" y2="60" stroke="#92400e" strokeWidth="1" />
                    <line x1="0" y1="90" x2="150" y2="90" stroke="#92400e" strokeWidth="1" />
                </g>
            </g>

            {/* Compass spinning */}
            <g transform="translate(230, 160)">
                <circle cx="25" cy="25" r="25" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                <g style={{ transformOrigin: '25px 25px' }} className="animate-spin-slow">
                    <polygon points="25,5 28,25 25,20 22,25" fill="#f25042" />
                    <polygon points="25,45 28,25 25,30 22,25" fill="#64748b" />
                </g>
                <circle cx="25" cy="25" r="4" fill="#374151" />
            </g>

            {/* Floating elements */}
            <g className="animate-float" transform="translate(40, 80)">
                <rect x="0" y="0" width="25" height="25" rx="5" fill="#a78bfa" opacity="0.8" />
                <text x="12.5" y="17" textAnchor="middle" fill="white" fontSize="12">📍</text>
            </g>
            
            <g className="animate-float-slow" transform="translate(250, 60)">
                <rect x="0" y="0" width="25" height="25" rx="5" fill="#fb7185" opacity="0.8" />
                <text x="12.5" y="17" textAnchor="middle" fill="white" fontSize="12">🗓</text>
            </g>

            {/* Loading text */}
            <g transform="translate(150, 210)">
                <text textAnchor="middle" fill="#0d9488" fontSize="14" fontWeight="600">
                    Merencanakan perjalanan
                </text>
                <g className="animate-pulse">
                    <text x="0" y="20" textAnchor="middle" fill="#64748b" fontSize="12">
                        <tspan className="animate-pulse" style={{ animationDelay: '0s' }}>.</tspan>
                        <tspan className="animate-pulse" style={{ animationDelay: '0.3s' }}>.</tspan>
                        <tspan className="animate-pulse" style={{ animationDelay: '0.6s' }}>.</tspan>
                    </text>
                </g>
            </g>

            {/* CSS for route animation */}
            <style>
                {`
                    @keyframes drawRoute {
                        0% { stroke-dashoffset: 200; }
                        50% { stroke-dashoffset: 0; }
                        100% { stroke-dashoffset: 0; }
                    }
                `}
            </style>
        </svg>
    );
}

/**
 * Simple loading state with traveling suitcase
 */
export function LoadingSuitcaseIllustration({ className = "w-48 h-auto" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Road */}
            <rect x="0" y="110" width="200" height="20" fill="#374151" rx="2" />
            <line x1="0" y1="120" x2="200" y2="120" stroke="#fbbf24" strokeWidth="2" strokeDasharray="15 10" />
            
            {/* Moving suitcase */}
            <g className="animate-bounce-gentle" style={{ transformOrigin: '100px 90px' }}>
                <g transform="translate(70, 50)">
                    {/* Suitcase body */}
                    <rect x="0" y="15" width="60" height="45" rx="5" fill="#0d9488" stroke="#0f766e" strokeWidth="2" />
                    <rect x="5" y="20" width="50" height="18" rx="3" fill="#14b8a6" />
                    
                    {/* Handle */}
                    <rect x="20" y="5" width="20" height="12" rx="3" fill="#475569" />
                    <rect x="24" y="0" width="12" height="8" rx="2" fill="#64748b" />
                    
                    {/* Buckles */}
                    <rect x="15" y="35" width="10" height="10" rx="2" fill="#fbbf24" />
                    <rect x="35" y="35" width="10" height="10" rx="2" fill="#fbbf24" />
                    
                    {/* Wheels */}
                    <circle cx="15" cy="62" r="5" fill="#374151" className="animate-spin" />
                    <circle cx="45" cy="62" r="5" fill="#374151" className="animate-spin" />
                </g>
            </g>
            
            {/* Speed lines */}
            <g opacity="0.4">
                <line x1="30" y1="75" x2="50" y2="75" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="85" x2="55" y2="85" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                <line x1="35" y1="95" x2="60" y2="95" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            </g>
        </svg>
    );
}
