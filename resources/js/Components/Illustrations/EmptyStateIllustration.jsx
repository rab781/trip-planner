/**
 * Empty State Illustration - Detailed Style
 * Lonely suitcase waiting for adventure
 */

export default function EmptyStateIllustration({ className = "w-64 h-auto" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 300 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="emptyFloorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#eaddcf" />
                    <stop offset="100%" stopColor="#d4c4b0" />
                </linearGradient>
            </defs>

            {/* Floor shadow */}
            <ellipse cx="150" cy="220" rx="120" ry="20" fill="url(#emptyFloorGradient)" />

            {/* Dotted path showing missing journey */}
            <path 
                d="M50 180 Q100 150 150 160 Q200 170 250 140" 
                stroke="#94a3b8" 
                strokeWidth="3" 
                strokeDasharray="8 8"
                fill="none"
                opacity="0.4"
            />

            {/* Small map pins faded */}
            <g opacity="0.3">
                <circle cx="60" cy="175" r="8" fill="#94a3b8" />
                <circle cx="60" cy="175" r="3" fill="white" />
            </g>
            <g opacity="0.2">
                <circle cx="240" cy="145" r="8" fill="#94a3b8" />
                <circle cx="240" cy="145" r="3" fill="white" />
            </g>

            {/* Main suitcase */}
            <g transform="translate(100, 100)">
                {/* Suitcase shadow */}
                <ellipse cx="50" cy="110" rx="55" ry="12" fill="black" opacity="0.1" />
                
                {/* Suitcase body */}
                <rect x="5" y="25" width="90" height="80" rx="8" fill="#0d9488" />
                <rect x="5" y="25" width="90" height="80" rx="8" stroke="#0f766e" strokeWidth="2" fill="none" />
                
                {/* Suitcase top section */}
                <rect x="10" y="30" width="80" height="35" rx="4" fill="#14b8a6" />
                
                {/* Suitcase stripe */}
                <rect x="5" y="60" width="90" height="8" fill="#0f766e" />
                
                {/* Handle */}
                <rect x="35" y="10" width="30" height="20" rx="4" fill="#475569" />
                <rect x="40" y="5" width="20" height="10" rx="3" fill="#64748b" />
                
                {/* Buckles */}
                <rect x="25" y="56" width="15" height="16" rx="2" fill="#fbbf24" />
                <rect x="60" y="56" width="15" height="16" rx="2" fill="#fbbf24" />
                
                {/* Wheels */}
                <circle cx="25" cy="108" r="6" fill="#374151" />
                <circle cx="25" cy="108" r="3" fill="#6b7280" />
                <circle cx="75" cy="108" r="6" fill="#374151" />
                <circle cx="75" cy="108" r="3" fill="#6b7280" />
                
                {/* Stickers on suitcase */}
                <circle cx="70" cy="80" r="10" fill="#fb7185" opacity="0.8" />
                <text x="70" y="84" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">♥</text>
                
                <rect x="18" y="75" width="20" height="14" rx="2" fill="#a78bfa" opacity="0.8" />
                <text x="28" y="85" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">BDG</text>
            </g>

            {/* Question marks floating */}
            <g className="animate-float" style={{ animationDelay: '0s' }}>
                <text x="80" y="60" fill="#94a3b8" fontSize="24" fontWeight="bold" opacity="0.5">?</text>
            </g>
            <g className="animate-float-slow" style={{ animationDelay: '0.5s' }}>
                <text x="200" y="80" fill="#94a3b8" fontSize="20" fontWeight="bold" opacity="0.4">?</text>
            </g>
            <g className="animate-float-delayed">
                <text x="240" y="50" fill="#94a3b8" fontSize="16" fontWeight="bold" opacity="0.3">?</text>
            </g>

            {/* Decorative elements */}
            <circle cx="40" cy="40" r="3" fill="#fbbf24" opacity="0.6" />
            <circle cx="260" cy="100" r="4" fill="#0d9488" opacity="0.5" />
            <circle cx="270" cy="70" r="2" fill="#fb7185" opacity="0.4" />

            {/* Text hint */}
            <text x="150" y="245" textAnchor="middle" className="text-paragraph dark:text-paragraph-dark" fill="#716040" fontSize="12" opacity="0.6">
                Belum ada perjalanan
            </text>
        </svg>
    );
}

/**
 * No Results Illustration - Search empty state
 */
export function NoResultsIllustration({ className = "w-48 h-auto" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Magnifying glass */}
            <g transform="translate(60, 40)">
                <circle cx="35" cy="35" r="30" stroke="#94a3b8" strokeWidth="6" fill="none" />
                <circle cx="35" cy="35" r="20" fill="#f1f5f9" />
                <line x1="58" y1="58" x2="80" y2="80" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
                
                {/* X inside */}
                <line x1="25" y1="25" x2="45" y2="45" stroke="#f87171" strokeWidth="4" strokeLinecap="round" />
                <line x1="45" y1="25" x2="25" y2="45" stroke="#f87171" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Scattered dots */}
            <circle cx="30" cy="60" r="3" fill="#cbd5e1" />
            <circle cx="170" cy="80" r="4" fill="#cbd5e1" />
            <circle cx="150" cy="140" r="3" fill="#cbd5e1" />
            <circle cx="50" cy="130" r="2" fill="#cbd5e1" />

            <text x="100" y="160" textAnchor="middle" fill="#94a3b8" fontSize="11">
                Tidak ditemukan
            </text>
        </svg>
    );
}
