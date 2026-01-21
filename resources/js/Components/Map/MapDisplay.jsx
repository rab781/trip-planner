import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';

// Fix for default marker icons in webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom numbered marker icon
const createNumberedIcon = (number, isSelected = false, color = '#8B5CF6') => {
    const bgColor = isSelected ? color : '#6B7280';
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${bgColor};
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 3px solid white;
            ">${number}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// Component to fit map bounds to markers
function FitBounds({ positions }) {
    const map = useMap();

    useEffect(() => {
        if (positions && positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions, map]);

    return null;
}

/**
 * MapDisplay Component - Leaflet map with markers and polyline route
 *
 * Inspired by Roadtrippers: numbered markers, animated polyline
 *
 * @param {Array} destinations - Array of destinations with lat/lng
 * @param {Array} selectedIds - Array of selected destination IDs
 * @param {Function} onMarkerClick - Callback when marker is clicked
 * @param {boolean} showRoute - Whether to show polyline connecting destinations
 * @param {string} className - Additional CSS classes
 */
export default function MapDisplay({
    destinations = [],
    selectedIds = [],
    onMarkerClick = null,
    showRoute = true,
    className = '',
    center = [-6.9175, 107.6191], // Bandung center
    zoom = 11,
}) {
    // Filter destinations with valid coordinates
    const validDestinations = useMemo(() =>
        destinations.filter(d => d.latitude && d.longitude),
        [destinations]
    );

    // Get positions for bounds fitting
    const positions = useMemo(() =>
        validDestinations.map(d => [d.latitude, d.longitude]),
        [validDestinations]
    );

    // Get selected destinations in order for polyline
    const selectedDestinations = useMemo(() => {
        if (!selectedIds.length) return [];
        return selectedIds
            .map(id => validDestinations.find(d => d.id === id))
            .filter(Boolean);
    }, [validDestinations, selectedIds]);

    // Polyline positions
    const routePositions = useMemo(() =>
        selectedDestinations.map(d => [d.latitude, d.longitude]),
        [selectedDestinations]
    );

    // Zone colors for visual grouping
    const zoneColors = {
        1: '#10B981', // Lembang - Green
        2: '#3B82F6', // Ciwidey - Blue
        3: '#F59E0B', // Dago - Amber
        4: '#EF4444', // Kota - Red
        5: '#8B5CF6', // Default - Purple
    };

    return (
        <div className={`relative ${className}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                className="w-full h-full rounded-xl"
                style={{ minHeight: '400px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Fit bounds to markers */}
                {positions.length > 0 && <FitBounds positions={positions} />}

                {/* Destination Markers */}
                {validDestinations.map((destination, index) => {
                    const isSelected = selectedIds.includes(destination.id);
                    const selectedIndex = selectedIds.indexOf(destination.id);
                    const zoneColor = zoneColors[destination.zone?.id] || zoneColors[5];

                    return (
                        <Marker
                            key={destination.id}
                            position={[destination.latitude, destination.longitude]}
                            icon={createNumberedIcon(
                                isSelected ? selectedIndex + 1 : '•',
                                isSelected,
                                zoneColor
                            )}
                            eventHandlers={{
                                click: () => onMarkerClick && onMarkerClick(destination),
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-gray-900 mb-1">
                                        {destination.name}
                                    </h3>
                                    {destination.zone && (
                                        <span
                                            className="inline-block px-2 py-0.5 text-xs rounded-full text-white mb-2"
                                            style={{ backgroundColor: zoneColor }}
                                        >
                                            {destination.zone.name}
                                        </span>
                                    )}
                                    {destination.category && (
                                        <p className="text-xs text-gray-500 mb-2">
                                            {destination.category.name}
                                        </p>
                                    )}
                                    {destination.min_price > 0 && (
                                        <p className="text-sm font-medium text-button">
                                            Mulai Rp {destination.min_price.toLocaleString('id-ID')}
                                        </p>
                                    )}
                                    {destination.avg_duration_minutes && (
                                        <p className="text-xs text-gray-500">
                                            ⏱ {destination.avg_duration_minutes} menit
                                        </p>
                                    )}
                                    {onMarkerClick && (
                                        <button
                                            onClick={() => onMarkerClick(destination)}
                                            className={`mt-2 w-full py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                                                isSelected
                                                    ? 'bg-tertiary/20 text-tertiary hover:bg-tertiary/30'
                                                    : 'bg-button text-button-text hover:bg-button/90'
                                            }`}
                                        >
                                            {isSelected ? 'Hapus dari Itinerary' : 'Tambah ke Itinerary'}
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Route Polyline */}
                {showRoute && routePositions.length > 1 && (
                    <Polyline
                        positions={routePositions}
                        pathOptions={{
                            color: '#8c7851',
                            weight: 4,
                            opacity: 0.8,
                            dashArray: '10, 10',
                            lineCap: 'round',
                            lineJoin: 'round',
                        }}
                    />
                )}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
                <p className="text-xs font-medium text-gray-700 mb-2">Zona Wisata</p>
                <div className="space-y-1">
                    {Object.entries(zoneColors).slice(0, 4).map(([id, color]) => (
                        <div key={id} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-600">
                                {id === '1' ? 'Lembang' : id === '2' ? 'Ciwidey' : id === '3' ? 'Dago' : 'Kota'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
