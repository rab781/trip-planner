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

    return (
        <div className="relative flex items-center justify-center py-2 px-4">
            {/* Dashed Line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-200"></div>

            {/* Transport Info Box */}
            <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs">
                {/* Transport Icon */}
                <span className="text-base">
                    {isMotor ? '🏍️' : '🚗'}
                </span>

                {/* Distance */}
                <span className="text-gray-600 font-medium">
                    {formatDistance(distance)}
                </span>

                {/* Separator */}
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>

                {/* Estimated Cost */}
                <span className="text-button font-semibold">
                    {formatCost(cost)}
                </span>
            </div>
        </div>
    );
}
