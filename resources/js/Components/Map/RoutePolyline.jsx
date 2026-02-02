import { useEffect, useState, useMemo } from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { getFullRoute, formatDuration, formatDistance } from '@/Services/RoutingService';

/**
 * RoutePolyline component - displays road routing paths between destinations
 * Fetches routes from OSRM API and renders as Polylines on the map
 */
export default function RoutePolyline({
    destinations = [],
    profile = 'driving',
    color = '#3b82f6', // blue-500
    weight = 4,
    opacity = 0.8,
    showPopup = true,
    onRouteLoad = null,
    className = '',
}) {
    const [routeData, setRouteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize destination coordinates to prevent unnecessary re-fetches
    const destinationKey = useMemo(() => {
        return destinations
            .map(d => `${d.latitude || d.lat}-${d.longitude || d.lng}`)
            .join('|');
    }, [destinations]);

    useEffect(() => {
        if (destinations.length < 2) {
            setRouteData(null);
            return;
        }

        const fetchRoute = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const route = await getFullRoute(destinations, profile);

                if (route.error) {
                    setError(route.error);
                    console.warn('Route fetch error:', route.error);
                } else {
                    setRouteData(route);
                    onRouteLoad?.(route);
                }
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch route:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoute();
    }, [destinationKey, profile]);

    // Don't render if no valid route geometry
    if (!routeData?.geometry || routeData.geometry.length < 2) {
        return null;
    }

    return (
        <Polyline
            positions={routeData.geometry}
            pathOptions={{
                color,
                weight,
                opacity,
                lineCap: 'round',
                lineJoin: 'round',
            }}
        >
            {showPopup && routeData.distance && (
                <Popup>
                    <div className="text-sm">
                        <div className="font-semibold text-gray-800 mb-1">
                            Rute Perjalanan
                        </div>
                        <div className="flex gap-3 text-gray-600">
                            <span>📏 {formatDistance(routeData.distance)}</span>
                            <span>⏱️ {formatDuration(routeData.duration)}</span>
                        </div>
                    </div>
                </Popup>
            )}
        </Polyline>
    );
}

/**
 * MultiDayRoutePolyline - displays routes for multiple days with different colors
 */
export function MultiDayRoutePolyline({
    dayRoutes = [], // Array of { day: number, destinations: [...], color: string }
    activeDay = null,
    profile = 'driving',
    onRouteLoad = null,
}) {
    // Color palette for different days
    const defaultColors = [
        '#ef4444', // red
        '#f59e0b', // amber
        '#10b981', // emerald
        '#3b82f6', // blue
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#06b6d4', // cyan
    ];

    return (
        <>
            {dayRoutes.map((dayData, index) => {
                const isActive = activeDay === null || activeDay === dayData.day;
                const color = dayData.color || defaultColors[index % defaultColors.length];

                return (
                    <RoutePolyline
                        key={`route-day-${dayData.day}`}
                        destinations={dayData.destinations}
                        profile={profile}
                        color={color}
                        weight={isActive ? 5 : 3}
                        opacity={isActive ? 0.9 : 0.4}
                        showPopup={isActive}
                        onRouteLoad={(route) => onRouteLoad?.({ ...route, day: dayData.day })}
                    />
                );
            })}
        </>
    );
}
