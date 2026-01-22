/**
 * Hero Illustration - Detailed Travel Scene
 * Traveler with landmarks, warm and inviting
 */

export default function HeroIllustration({ className = "w-full h-auto" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 500 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Sky gradient background */}
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
                <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
            </defs>

            {/* Background sky */}
            <rect x="0" y="0" width="500" height="280" fill="url(#skyGradient)" />
            
            {/* Sun */}
            <circle cx="420" cy="80" r="40" fill="#fbbf24" className="animate-pulse-soft" />
            <circle cx="420" cy="80" r="50" fill="#fbbf24" opacity="0.2" />
            
            {/* Clouds - animated */}
            <g className="animate-cloud-drift" style={{ animationDuration: '25s' }}>
                <ellipse cx="100" cy="60" rx="40" ry="20" fill="white" opacity="0.9" />
                <ellipse cx="130" cy="55" rx="30" ry="18" fill="white" opacity="0.9" />
                <ellipse cx="80" cy="55" rx="25" ry="15" fill="white" opacity="0.9" />
            </g>
            <g className="animate-cloud-drift-slow" style={{ animationDelay: '5s' }}>
                <ellipse cx="300" cy="90" rx="35" ry="18" fill="white" opacity="0.8" />
                <ellipse cx="330" cy="85" rx="28" ry="15" fill="white" opacity="0.8" />
            </g>

            {/* Mountains background */}
            <path d="M0 280 L100 180 L180 240 L280 140 L380 220 L450 160 L500 200 L500 280 Z" fill="url(#mountainGradient)" />
            <path d="M0 280 L80 220 L150 260 L250 180 L350 250 L420 200 L500 240 L500 280 Z" fill="#94a3b8" opacity="0.7" />
            
            {/* Snow caps */}
            <path d="M270 150 L280 140 L290 150 L285 152 L280 148 L275 152 Z" fill="white" />
            <path d="M440 168 L450 160 L460 170 L455 172 L450 166 L445 171 Z" fill="white" />

            {/* Ground */}
            <ellipse cx="250" cy="340" rx="230" ry="60" fill="url(#groundGradient)" />
            
            {/* Path/road */}
            <path 
                d="M150 380 Q200 340 250 350 Q300 360 350 340 Q400 320 450 330" 
                stroke="#d4a574" 
                strokeWidth="20" 
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
            />
            <path 
                d="M150 380 Q200 340 250 350 Q300 360 350 340 Q400 320 450 330" 
                stroke="#eab676" 
                strokeWidth="4" 
                strokeDasharray="15 10"
                strokeLinecap="round"
                fill="none"
            />

            {/* Landmark 1 - Temple/Monument */}
            <g transform="translate(80, 240)">
                {/* Base */}
                <rect x="10" y="60" width="60" height="20" fill="#a78bfa" rx="2" />
                <rect x="15" y="40" width="50" height="20" fill="#c4b5fd" rx="2" />
                {/* Tower */}
                <rect x="25" y="10" width="30" height="30" fill="#ddd6fe" />
                <path d="M25 10 L40 -10 L55 10 Z" fill="#c4b5fd" />
                {/* Details */}
                <rect x="35" y="45" width="10" height="15" fill="#7c3aed" rx="1" />
            </g>

            {/* Landmark 2 - Eiffel-style tower */}
            <g transform="translate(380, 200)">
                <path d="M30 80 L20 80 L25 30 L30 0 L35 30 L40 80 L30 80" fill="#64748b" />
                <path d="M22 60 L38 60" stroke="#64748b" strokeWidth="3" />
                <path d="M24 40 L36 40" stroke="#64748b" strokeWidth="2" />
                <ellipse cx="30" cy="82" rx="12" ry="4" fill="#475569" />
            </g>

            {/* Trees */}
            <g transform="translate(140, 280)">
                <rect x="8" y="20" width="6" height="15" fill="#92400e" />
                <ellipse cx="11" cy="15" rx="15" ry="18" fill="#22c55e" />
                <ellipse cx="8" cy="20" rx="10" ry="12" fill="#16a34a" />
            </g>
            <g transform="translate(320, 270)">
                <rect x="6" y="18" width="5" height="12" fill="#92400e" />
                <ellipse cx="9" cy="12" rx="12" ry="15" fill="#22c55e" />
            </g>

            {/* Hot air balloon - animated */}
            <g transform="translate(350, 60)" className="animate-float-slow">
                {/* Balloon */}
                <ellipse cx="25" cy="25" rx="25" ry="30" fill="#fb7185" />
                <path d="M5 35 Q25 55 45 35" fill="#fda4af" />
                {/* Stripes */}
                <path d="M10 15 Q25 -5 40 15" stroke="white" strokeWidth="3" fill="none" />
                <path d="M6 30 Q25 10 44 30" stroke="white" strokeWidth="3" fill="none" />
                {/* Basket */}
                <line x1="12" y1="52" x2="18" y2="62" stroke="#92400e" strokeWidth="1" />
                <line x1="38" y1="52" x2="32" y2="62" stroke="#92400e" strokeWidth="1" />
                <rect x="15" y="62" width="20" height="12" fill="#d97706" rx="2" />
            </g>

            {/* Traveler character */}
            <g transform="translate(220, 270)">
                {/* Shadow */}
                <ellipse cx="30" cy="85" rx="25" ry="8" fill="black" opacity="0.15" />
                
                {/* Body */}
                <rect x="18" y="45" width="24" height="35" fill="#0d9488" rx="3" />
                
                {/* Legs */}
                <rect x="20" y="78" width="8" height="20" fill="#1e3a5f" rx="2" />
                <rect x="32" y="78" width="8" height="20" fill="#1e3a5f" rx="2" />
                
                {/* Shoes */}
                <ellipse cx="24" cy="98" rx="6" ry="3" fill="#92400e" />
                <ellipse cx="36" cy="98" rx="6" ry="3" fill="#92400e" />
                
                {/* Arms */}
                <rect x="8" y="48" width="10" height="6" fill="#0d9488" rx="2" />
                <rect x="42" y="48" width="10" height="6" fill="#0d9488" rx="2" />
                
                {/* Hands */}
                <circle cx="8" cy="51" r="5" fill="#fcd9bd" />
                <circle cx="52" cy="51" r="5" fill="#fcd9bd" />
                
                {/* Head */}
                <circle cx="30" cy="30" r="18" fill="#fcd9bd" />
                
                {/* Hair */}
                <path d="M15 25 Q20 10 30 12 Q40 10 45 25 Q42 18 30 16 Q18 18 15 25" fill="#4a3728" />
                
                {/* Face */}
                <circle cx="24" cy="28" r="2" fill="#4a3728" />
                <circle cx="36" cy="28" r="2" fill="#4a3728" />
                <path d="M26 36 Q30 40 34 36" stroke="#4a3728" strokeWidth="2" fill="none" strokeLinecap="round" />
                
                {/* Hat */}
                <ellipse cx="30" cy="14" rx="20" ry="5" fill="#f59e0b" />
                <ellipse cx="30" cy="10" rx="12" ry="8" fill="#f59e0b" />
                <path d="M18 10 Q30 0 42 10" fill="#fbbf24" />
                
                {/* Backpack */}
                <rect x="38" y="42" width="18" height="25" fill="#dc2626" rx="4" />
                <rect x="40" y="45" width="14" height="8" fill="#fca5a5" rx="2" />
                
                {/* Map in hand */}
                <g transform="translate(-2, 40)">
                    <rect x="0" y="0" width="15" height="20" fill="#fef3c7" rx="1" transform="rotate(-15)" />
                    <line x1="3" y1="5" x2="10" y2="4" stroke="#d97706" strokeWidth="1" transform="rotate(-15)" />
                    <line x1="4" y1="9" x2="11" y2="8" stroke="#d97706" strokeWidth="1" transform="rotate(-15)" />
                    <circle cx="7" cy="14" r="2" fill="#dc2626" transform="rotate(-15)" />
                </g>
            </g>

            {/* Flying plane - animated */}
            <g className="animate-plane-float">
                <g transform="translate(60, 120) rotate(-10)">
                    <path 
                        d="M0 10 L30 8 L35 0 L40 8 L70 10 L40 12 L35 20 L30 12 Z" 
                        fill="white" 
                        stroke="#94a3b8" 
                        strokeWidth="1"
                    />
                    <circle cx="20" cy="10" r="3" fill="#0ea5e9" />
                    {/* Contrail */}
                    <path d="M70 10 Q90 10 110 12" stroke="white" strokeWidth="2" opacity="0.6" strokeDasharray="5 5" />
                </g>
            </g>

            {/* Map pins */}
            <g transform="translate(100, 200)">
                <path d="M8 0 C3 0 0 4 0 8 C0 14 8 22 8 22 S16 14 16 8 C16 4 13 0 8 0" fill="#f25042" />
                <circle cx="8" cy="8" r="3" fill="white" />
            </g>
            <g transform="translate(400, 180)" className="animate-bounce-gentle">
                <path d="M8 0 C3 0 0 4 0 8 C0 14 8 22 8 22 S16 14 16 8 C16 4 13 0 8 0" fill="#0d9488" />
                <circle cx="8" cy="8" r="3" fill="white" />
            </g>
        </svg>
    );
}
