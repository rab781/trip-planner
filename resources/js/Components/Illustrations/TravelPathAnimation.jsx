import { useEffect, useState } from 'react';

// Detailed Tactical Boot Print - Solid Fill for "Muddy/Stamped" look
const BootPrintIcon = ({ className, style, isLeft }) => (
    <svg
        viewBox="0 0 100 240"
        className={className}
        style={{
            ...style,
            transform: `${style?.transform || ''} ${isLeft ? 'scaleX(-1)' : ''}`
        }}
        fill="currentColor"
    >
        {/* Heel Section */}
        <path d="M25,185 C20,190 15,200 20,220 C25,235 75,235 80,220 C85,200 80,190 75,185 L25,185 Z" className="opacity-90" />

        {/* Main Sole Section with deep treads */}
        <path d="M20,175 L80,175 L82,140 L18,140 Z" className="opacity-90" />
        <path d="M18,130 L82,130 L84,100 L16,100 Z" className="opacity-90" />
        <path d="M16,90 L84,90 L85,60 L15,60 Z" className="opacity-90" />

        {/* Toe Section */}
        <path d="M15,50 L85,50 C85,30 70,10 50,10 C30,10 15,30 15,50 Z" className="opacity-90" />

        {/* Texture/Grip Details (Negative Space simulated by gaps above) */}
    </svg>
);

export default function TravelPathAnimation({ className = '' }) {
    const [step, setStep] = useState(0);
    // Path: Walking diagonally up-right (Standard "Progress" direction)
    // "Jalan arah nya" - usually standard stock is bottom-left to top-right or straight up.
    // Let's go with a natural curved path.

    // Position Data: [x%, y%, rotation, isRight]
    const footprintPath = [
        { x: 20, y: 85, r: 25, isRight: false },
        { x: 32, y: 75, r: 30, isRight: true },
        { x: 38, y: 60, r: 20, isRight: false },
        { x: 50, y: 50, r: 25, isRight: true },
        { x: 55, y: 35, r: 15, isRight: false },
        { x: 68, y: 25, r: 20, isRight: true },
        { x: 75, y: 10, r: 10, isRight: false },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % (footprintPath.length + 6)); // Pause at end
        }, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`relative w-full h-full min-h-[400px] flex items-center justify-center pointer-events-none ${className}`}>
            {/* Optional subtle path line - kept very faint as user emphasized 'Boot Prints' */}
            <div className="absolute inset-0 opacity-5 dark:opacity-0 mixed-blend-overlay">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                        d="M20,85 Q40,65 55,35 T75,10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="20"
                        strokeLinecap="round"
                        className="text-gray-400 blur-xl"
                    />
                </svg>
            </div>

            {footprintPath.map((pos, index) => (
                <div
                    key={index}
                    className={`absolute w-14 h-28 text-gray-800 dark:text-gray-300 transition-all duration-500 ${index < step
                            ? 'opacity-70 scale-100'
                            : 'opacity-0 scale-90'
                        }`}
                    style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: `translate(-50%, -50%) rotate(${pos.r}deg)`,
                        // Add a slight "print" filter logic if supported or just standard styling
                        filter: 'contrast(1.2)'
                    }}
                >
                    <BootPrintIcon
                        className="w-full h-full drop-shadow-md"
                        isLeft={!pos.isRight} // Pass alignment
                    />
                </div>
            ))}
        </div>
    );
}
