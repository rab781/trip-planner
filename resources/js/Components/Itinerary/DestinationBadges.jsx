/**
 * Destination Badges Component
 * Displays badges like "Rating Tinggi", "Hemat", "Populer", "Solo-Friendly"
 */
export default function DestinationBadges({ badges = [], size = 'md', maxShow = 4 }) {
    if (!badges || badges.length === 0) return null;

    const displayBadges = badges.slice(0, maxShow);
    const remaining = badges.length - maxShow;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    const badgeColors = {
        rating: 'bg-yellow-100 text-yellow-800',
        budget: 'bg-green-100 text-green-800',
        popular: 'bg-orange-100 text-orange-800',
        solo: 'bg-blue-100 text-blue-800',
        family: 'bg-purple-100 text-purple-800',
        photo: 'bg-pink-100 text-pink-800',
        default: 'bg-secondary text-paragraph',
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {displayBadges.map((badge, index) => (
                <span
                    key={index}
                    className={`inline-flex items-center gap-1 rounded-full font-medium ${
                        sizeClasses[size]
                    } ${badgeColors[badge.type] || badgeColors.default}`}
                >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                </span>
            ))}
            {remaining > 0 && (
                <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} bg-secondary text-paragraph`}>
                    +{remaining} lainnya
                </span>
            )}
        </div>
    );
}
