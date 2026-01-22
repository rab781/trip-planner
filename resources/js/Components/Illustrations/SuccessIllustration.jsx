/**
 * Success Illustration - Celebration after itinerary creation
 * Happy traveler with confetti
 */

export default function SuccessIllustration({ className = "w-64 h-auto" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 300 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Confetti particles - animated */}
            <g className="animate-fade-in">
                {/* Left side confetti */}
                <rect x="30" y="40" width="8" height="8" fill="#fbbf24" transform="rotate(15)" className="animate-float" />
                <rect x="50" y="60" width="6" height="6" fill="#f472b6" transform="rotate(-20)" className="animate-float-slow" />
                <circle cx="70" cy="30" r="4" fill="#0d9488" className="animate-float-delayed" />
                <rect x="45" y="90" width="5" height="12" fill="#a78bfa" transform="rotate(45)" className="animate-float" />
                
                {/* Right side confetti */}
                <rect x="250" y="50" width="7" height="7" fill="#fb7185" transform="rotate(-30)" className="animate-float-slow" />
                <circle cx="230" cy="70" r="5" fill="#fbbf24" className="animate-float" />
                <rect x="260" y="80" width="6" height="10" fill="#0d9488" transform="rotate(20)" className="animate-float-delayed" />
                <circle cx="240" cy="40" r="3" fill="#a78bfa" className="animate-float-slow" />
                
                {/* Center top confetti */}
                <rect x="140" y="20" width="8" height="4" fill="#f472b6" transform="rotate(-10)" className="animate-float" />
                <circle cx="160" cy="35" r="4" fill="#fbbf24" className="animate-float-delayed" />
                <rect x="175" y="25" width="5" height="8" fill="#0d9488" transform="rotate(30)" className="animate-float-slow" />
            </g>

            {/* Sparkle stars */}
            <g className="animate-pulse-soft">
                <path d="M80 60 L82 66 L88 68 L82 70 L80 76 L78 70 L72 68 L78 66 Z" fill="#fbbf24" />
                <path d="M220 55 L221.5 59 L226 60.5 L221.5 62 L220 66 L218.5 62 L214 60.5 L218.5 59 Z" fill="#fbbf24" />
                <path d="M150 45 L152 51 L158 53 L152 55 L150 61 L148 55 L142 53 L148 51 Z" fill="#fbbf24" />
            </g>

            {/* Ground */}
            <ellipse cx="150" cy="255" rx="100" ry="15" fill="#eaddcf" />

            {/* Happy Traveler Character */}
            <g transform="translate(105, 90)">
                {/* Shadow */}
                <ellipse cx="45" cy="160" rx="35" ry="10" fill="black" opacity="0.1" />
                
                {/* Jumping effect - legs bent */}
                <g transform="translate(0, -10)">
                    {/* Body */}
                    <rect x="28" y="75" width="34" height="45" fill="#0d9488" rx="5" />
                    
                    {/* Arms up celebrating */}
                    <g transform="rotate(-30, 28, 85)">
                        <rect x="10" y="75" width="25" height="10" fill="#0d9488" rx="4" />
                        <circle cx="8" cy="80" r="7" fill="#fcd9bd" />
                    </g>
                    <g transform="rotate(30, 62, 85)">
                        <rect x="55" y="75" width="25" height="10" fill="#0d9488" rx="4" />
                        <circle cx="82" cy="80" r="7" fill="#fcd9bd" />
                    </g>
                    
                    {/* Legs */}
                    <rect x="32" y="118" width="12" height="28" fill="#1e3a5f" rx="3" />
                    <rect x="48" y="118" width="12" height="28" fill="#1e3a5f" rx="3" />
                    
                    {/* Shoes */}
                    <ellipse cx="38" cy="148" rx="9" ry="5" fill="#92400e" />
                    <ellipse cx="54" cy="148" rx="9" ry="5" fill="#92400e" />
                    
                    {/* Head */}
                    <circle cx="45" cy="50" r="25" fill="#fcd9bd" />
                    
                    {/* Hair */}
                    <path d="M25 42 Q30 20 45 22 Q60 20 65 42 Q60 30 45 28 Q30 30 25 42" fill="#4a3728" />
                    
                    {/* Happy face - big smile */}
                    <circle cx="36" cy="46" r="3" fill="#4a3728" />
                    <circle cx="54" cy="46" r="3" fill="#4a3728" />
                    {/* Closed happy eyes */}
                    <path d="M33 44 Q36 40 39 44" stroke="#4a3728" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M51 44 Q54 40 57 44" stroke="#4a3728" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Big smile */}
                    <path d="M35 58 Q45 70 55 58" stroke="#4a3728" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* Rosy cheeks */}
                    <circle cx="28" cy="54" r="5" fill="#fda4af" opacity="0.5" />
                    <circle cx="62" cy="54" r="5" fill="#fda4af" opacity="0.5" />
                </g>
            </g>

            {/* Completed checklist floating */}
            <g transform="translate(200, 130)" className="animate-float">
                <rect x="0" y="0" width="60" height="75" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                {/* Checkmarks */}
                <g transform="translate(10, 15)">
                    <circle cx="8" cy="8" r="6" fill="#10b981" />
                    <path d="M5 8 L7 10 L11 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="8" x2="45" y2="8" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                </g>
                <g transform="translate(10, 35)">
                    <circle cx="8" cy="8" r="6" fill="#10b981" />
                    <path d="M5 8 L7 10 L11 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="8" x2="40" y2="8" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                </g>
                <g transform="translate(10, 55)">
                    <circle cx="8" cy="8" r="6" fill="#10b981" />
                    <path d="M5 8 L7 10 L11 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="8" x2="35" y2="8" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                </g>
            </g>

            {/* Map with route */}
            <g transform="translate(30, 150)" className="animate-float-slow">
                <rect x="0" y="0" width="55" height="40" rx="3" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" />
                {/* Map details */}
                <path d="M10 10 Q20 25 30 15 Q40 5 45 20" stroke="#0d9488" strokeWidth="2" fill="none" strokeDasharray="3 2" />
                <circle cx="10" cy="10" r="4" fill="#f25042" />
                <circle cx="45" cy="20" r="4" fill="#0d9488" />
            </g>

            {/* Plane icon flying */}
            <g transform="translate(60, 80) rotate(-15)" className="animate-plane-float">
                <path d="M0 8 L20 6 L24 0 L28 6 L50 8 L28 10 L24 16 L20 10 Z" fill="#64748b" />
            </g>
        </svg>
    );
}
