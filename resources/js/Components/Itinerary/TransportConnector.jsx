import { TruckIcon } from '@heroicons/react/24/outline';

/**
 * TransportConnector Component - Shows transport info between destinations
 *
 * Inspired by Roadtrippers: dashed line connector, icon motor/car, distance + cost inline
 *
 * @param {number} distance - Distance in kilometers
 * @param {number} cost - Estimated transport cost in IDR
 * @param {string} mode - Transport mode: 'MOTOR' or 'CAR'
 */
export default function TransportConnector({
    distance = 0,
    cost = 0,
    mode = 'CAR',
}) {
    const isMotor = mode === 'MOTOR';

    const formatDistance = (km) => {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toFixed(1)} km`;
    };

    const formatCost = (amount) => {
        if (amount >= 1000000) {
            return `Rp ${(amount / 1000000).toFixed(1)} jt`;
        }
        if (amount >= 1000) {
            return `Rp ${(amount / 1000).toFixed(0)} rb`;
        }
        return `Rp ${amount}`;
    };

    // Calculate time estimate roughly (40km/h for car in city, 30km/h for motor)
    const speed = isMotor ? 30 : 40;
    const minutes = Math.round((distance / speed) * 60);

    return (
        <div className="relative flex items-center justify-center py-3 -my-1 z-0 group">
            {/* Vertical Line Connector (if vertical layout is implied, but here it's horizontal segment between cards) */}
            {/* Actually it connects vertically in the list. So a vertical line makes more sense if the cards are stacked.
                However, the original design had a horizontal line. 
                Let's switch to a subtle vertical connector feel or a cleaner horizontal pill.
            */}

            {/* Vertical Line through */}
            <div className="absolute top-0 bottom-0 left-8 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-teal-400 transition-colors h-full -z-10" style={{ left: '2rem' }}></div>

            {/* Transport Info Box */}
            <div className="relative z-10 flex items-center gap-3 px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs shadow-sm group-hover:shadow-md group-hover:border-teal-300 transition-all">
                {/* Transport Icon */}
                <span className="text-base bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                    {isMotor ? '🏍️' : '🚗'}
                </span>

                {/* Distance */}
                <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                    {formatDistance(distance)} • ~{minutes} mnt
                </span>

                {/* Separator */}
                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>

                {/* Estimated Cost */}
                <span className="text-teal-600 dark:text-teal-400 font-bold whitespace-nowrap">
                    {formatCost(cost)}
                </span>
            </div>
        </div>
    );
}
