/**
 * OSRM Routing Service
 * Uses the free OSRM demo server for route calculations
 * API Docs: https://project-osrm.org/docs/v5.24.0/api/
 */

const OSRM_BASE_URL = 'https://router.project-osrm.org';

/**
 * Get route between two or more coordinates
 * @param {Array} coordinates - Array of [lat, lng] pairs
 * @param {string} profile - 'driving', 'walking', 'cycling' (default: 'driving')
 * @returns {Promise<{geometry: Array, distance: number, duration: number}>}
 */
export async function getRoute(coordinates, profile = 'driving') {
    if (coordinates.length < 2) {
        return { geometry: [], distance: 0, duration: 0 };
    }

    // OSRM expects coordinates as lng,lat (not lat,lng)
    const coordString = coordinates
        .map(([lat, lng]) => `${lng},${lat}`)
        .join(';');

    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coordString}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            console.warn('OSRM routing failed:', data.code, data.message);
            return { geometry: [], distance: 0, duration: 0, error: data.code };
        }

        const route = data.routes[0];

        // Convert GeoJSON coordinates from [lng, lat] to [lat, lng] for Leaflet
        const geometry = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        return {
            geometry,
            distance: route.distance, // in meters
            duration: route.duration, // in seconds
            legs: route.legs || [],
        };
    } catch (error) {
        console.error('OSRM request failed:', error);
        return { geometry: [], distance: 0, duration: 0, error: error.message };
    }
}

/**
 * Get routes for multiple segments (between each pair of destinations)
 * @param {Array} destinations - Array of destination objects with lat/lng
 * @param {string} profile - 'driving', 'walking', 'cycling'
 * @returns {Promise<Array<{from: object, to: object, geometry: Array, distance: number, duration: number}>>}
 */
export async function getRouteSegments(destinations, profile = 'driving') {
    const segments = [];

    for (let i = 0; i < destinations.length - 1; i++) {
        const from = destinations[i];
        const to = destinations[i + 1];

        const fromLat = parseFloat(from.latitude || from.lat);
        const fromLng = parseFloat(from.longitude || from.lng);
        const toLat = parseFloat(to.latitude || to.lat);
        const toLng = parseFloat(to.longitude || to.lng);

        if (isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) {
            segments.push({
                from,
                to,
                geometry: [],
                distance: 0,
                duration: 0,
                error: 'Invalid coordinates',
            });
            continue;
        }

        const route = await getRoute([[fromLat, fromLng], [toLat, toLng]], profile);

        segments.push({
            from,
            to,
            ...route,
        });
    }

    return segments;
}

/**
 * Get full route through all destinations in order
 * @param {Array} destinations - Array of destination objects with lat/lng
 * @param {string} profile - 'driving', 'walking', 'cycling'
 * @returns {Promise<{geometry: Array, distance: number, duration: number, segments: Array}>}
 */
export async function getFullRoute(destinations, profile = 'driving') {
    if (destinations.length < 2) {
        return { geometry: [], distance: 0, duration: 0, segments: [] };
    }

    const coordinates = destinations.map(dest => {
        const lat = parseFloat(dest.latitude || dest.lat);
        const lng = parseFloat(dest.longitude || dest.lng);
        return [lat, lng];
    }).filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

    if (coordinates.length < 2) {
        return { geometry: [], distance: 0, duration: 0, segments: [] };
    }

    const route = await getRoute(coordinates, profile);

    return {
        ...route,
        segments: route.legs || [],
    };
}

/**
 * Format duration in human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '0 min';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}j ${minutes}m`;
    }
    return `${minutes} min`;
}

/**
 * Format distance in human readable format
 * @param {number} meters - Distance in meters
 * @returns {string}
 */
export function formatDistance(meters) {
    if (!meters || meters <= 0) return '0 m';

    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
}
