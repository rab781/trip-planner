/**
 * Custom Travel SVG Icons - Flat Minimalist Style
 * Consistent stroke width, clean lines, professional look
 */

// Compass Icon - For navigation/direction
export function CompassIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.2" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
    );
}

// Map Pin Icon - For destinations
export function MapPinIcon({ className = "w-6 h-6", strokeWidth = 1.5, filled = false }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" fill={filled ? "white" : "none"} />
        </svg>
    );
}

// Suitcase Icon - For travel/luggage
export function SuitcaseIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
            <line x1="12" y1="12" x2="12" y2="17" />
            <line x1="3" y1="13" x2="21" y2="13" opacity="0.3" />
        </svg>
    );
}

// Calendar Icon - For dates/planning
export function CalendarIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
        </svg>
    );
}

// Route Icon - For itinerary/path
export function RouteIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <path d="M6 9v1a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v0" />
            <circle cx="6" cy="6" r="1" fill="currentColor" />
            <circle cx="18" cy="18" r="1" fill="currentColor" />
        </svg>
    );
}

// Plane Icon - For travel/flight
export function PlaneIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
    );
}

// Wallet Icon - For budget
export function WalletIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" opacity="0.3" />
            <circle cx="16" cy="14" r="2" />
            <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        </svg>
    );
}

// Users Icon - For group/people
export function UsersIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="9" cy="7" r="4" />
            <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <circle cx="17" cy="7" r="3" opacity="0.5" />
            <path d="M21 21v-2a3 3 0 0 0-3-3h-1" opacity="0.5" />
        </svg>
    );
}

// Clock Icon - For time/duration
export function ClockIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
    );
}

// Star Icon - For ratings
export function StarIcon({ className = "w-6 h-6", filled = false }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

// Sparkles Icon - For AI/magic
export function SparklesIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" fill="currentColor" opacity="0.2" />
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 15l.88 2.12L22 18l-2.12.88L19 21l-.88-2.12L16 18l2.12-.88L19 15z" />
            <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
        </svg>
    );
}

// Camera Icon - For photo spots
export function CameraIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
            <circle cx="12" cy="13" r="1.5" fill="currentColor" opacity="0.3" />
        </svg>
    );
}

// Mountain Icon - For nature
export function MountainIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 21l4-10 4 10" fill="currentColor" opacity="0.1" />
            <path d="M2 21l6-10 4 5 6-11 4 16" />
            <path d="M2 21h20" />
        </svg>
    );
}

// Food Icon - For culinary
export function FoodIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
    );
}

// Export all icons
export default {
    CompassIcon,
    MapPinIcon,
    SuitcaseIcon,
    CalendarIcon,
    RouteIcon,
    PlaneIcon,
    WalletIcon,
    UsersIcon,
    ClockIcon,
    StarIcon,
    SparklesIcon,
    CameraIcon,
    MountainIcon,
    FoodIcon,
};
