import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, MapIcon, ListBulletIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import MapDisplay from './MapDisplay';

/**
 * MapWithSidebar Component - Hybrid map + list picker
 *
 * Inspired by Wanderlog: collapsible sidebar with search/filter
 * Mobile: Toggle between map and list view
 * Desktop: Side-by-side layout
 *
 * @param {Array} destinations - All available destinations
 * @param {Array} selectedIds - Currently selected destination IDs
 * @param {Function} onToggleDestination - Callback to add/remove destination
 * @param {Array} zones - Available zones for filtering
 * @param {Array} categories - Available categories for filtering
 */
export default function MapWithSidebar({
    destinations = [],
    selectedIds = [],
    onToggleDestination,
    zones = [],
    categories = [],
    className = '',
}) {
    const [mobileView, setMobileView] = useState('map'); // 'map' | 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Zone colors
    const zoneColors = {
        1: '#10B981',
        2: '#3B82F6',
        3: '#F59E0B',
        4: '#EF4444',
        5: '#8B5CF6',
    };

    // Filter destinations
    const filteredDestinations = useMemo(() => {
        return destinations.filter(d => {
            const matchesSearch = !searchQuery ||
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesZone = !selectedZone || d.zone?.id === selectedZone;
            const matchesCategory = !selectedCategory || d.category?.id === selectedCategory;

            return matchesSearch && matchesZone && matchesCategory;
        });
    }, [destinations, searchQuery, selectedZone, selectedCategory]);

    // Selected destinations in order
    const selectedDestinations = useMemo(() => {
        return selectedIds
            .map(id => destinations.find(d => d.id === id))
            .filter(Boolean);
    }, [destinations, selectedIds]);

    const handleMarkerClick = (destination) => {
        onToggleDestination && onToggleDestination(destination);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedZone(null);
        setSelectedCategory(null);
    };

    const hasActiveFilters = searchQuery || selectedZone || selectedCategory;

    return (
        <div className={`flex flex-col lg:flex-row gap-4 ${className}`}>
            {/* Mobile View Toggle */}
            <div className="lg:hidden flex bg-secondary rounded-xl p-1">
                <button
                    onClick={() => setMobileView('map')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                        mobileView === 'map'
                            ? 'bg-main text-button shadow-sm'
                            : 'text-paragraph hover:text-headline'
                    }`}
                >
                    <MapIcon className="w-5 h-5" />
                    Peta
                </button>
                <button
                    onClick={() => setMobileView('list')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                        mobileView === 'list'
                            ? 'bg-main text-button shadow-sm'
                            : 'text-paragraph hover:text-headline'
                    }`}
                >
                    <ListBulletIcon className="w-5 h-5" />
                    Daftar ({filteredDestinations.length})
                </button>
            </div>

            {/* Sidebar - List View */}
            <div className={`lg:w-[400px] flex-shrink-0 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                mobileView === 'list' ? 'flex' : 'hidden lg:flex'
            }`}>
                {/* Search & Filter Header */}
                <div className="p-4 border-b border-gray-100 space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari destinasi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-secondary rounded-lg text-sm focus:ring-2 focus:ring-button/20 focus:border-button"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                showFilters || hasActiveFilters
                                    ? 'bg-button/10 text-button'
                                    : 'bg-secondary text-paragraph hover:bg-secondary/70'
                            }`}
                        >
                            <FunnelIcon className="w-4 h-4" />
                            Filter
                            {hasActiveFilters && (
                                <span className="w-2 h-2 bg-button rounded-full" />
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                            >
                                <XMarkIcon className="w-4 h-4" />
                                Reset
                            </button>
                        )}

                        <span className="ml-auto text-xs text-gray-500">
                            {filteredDestinations.length} destinasi
                        </span>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <select
                                value={selectedZone || ''}
                                onChange={(e) => setSelectedZone(e.target.value ? Number(e.target.value) : null)}
                                className="px-3 py-2 border border-secondary rounded-lg text-sm focus:ring-2 focus:ring-button/20 focus:border-button"
                            >
                                <option value="">Semua Zona</option>
                                {zones.map(zone => (
                                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                className="px-3 py-2 border border-secondary rounded-lg text-sm focus:ring-2 focus:ring-button/20 focus:border-button"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Selected Destinations Summary */}
                {selectedDestinations.length > 0 && (
                    <div className="px-4 py-3 bg-button/5 border-b border-button/10">
                        <p className="text-sm font-medium text-button">
                            {selectedDestinations.length} destinasi dipilih
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {selectedDestinations.slice(0, 5).map((d, index) => (
                                <span
                                    key={d.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-main rounded-full text-xs text-headline border border-secondary"
                                >
                                    <span className="w-4 h-4 flex items-center justify-center bg-button text-button-text rounded-full text-[10px] font-bold">
                                        {index + 1}
                                    </span>
                                    {d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name}
                                </span>
                            ))}
                            {selectedDestinations.length > 5 && (
                                <span className="text-xs text-paragraph py-0.5">
                                    +{selectedDestinations.length - 5} lainnya
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Destination List */}
                <div className="flex-1 overflow-y-auto max-h-[500px] lg:max-h-[600px]">
                    {filteredDestinations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">Tidak ada destinasi ditemukan</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-2 text-sm text-button hover:underline"
                                >
                                    Reset filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {filteredDestinations.map(destination => {
                                const isSelected = selectedIds.includes(destination.id);
                                const selectedIndex = selectedIds.indexOf(destination.id);
                                const zoneColor = zoneColors[destination.zone?.id] || zoneColors[5];

                                return (
                                    <div
                                        key={destination.id}
                                        onClick={() => handleMarkerClick(destination)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-secondary/50 ${
                                            isSelected ? 'bg-button/5' : ''
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Number/Checkbox indicator */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                isSelected
                                                    ? 'bg-button text-button-text'
                                                    : 'bg-secondary text-paragraph'
                                            }`}>
                                                {isSelected ? (
                                                    <span className="text-sm font-bold">{selectedIndex + 1}</span>
                                                ) : (
                                                    <span className="text-lg">+</span>
                                                )}
                                            </div>

                                            {/* Destination Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {destination.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span
                                                        className="inline-block px-2 py-0.5 text-xs rounded-full text-white"
                                                        style={{ backgroundColor: zoneColor }}
                                                    >
                                                        {destination.zone?.name || 'Unknown'}
                                                    </span>
                                                    {destination.category && (
                                                        <span className="text-xs text-gray-500">
                                                            {destination.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    {destination.min_price > 0 && (
                                                        <span className="font-medium text-button">
                                                            Rp {destination.min_price.toLocaleString('id-ID')}
                                                        </span>
                                                    )}
                                                    {destination.avg_duration_minutes && (
                                                        <span>⏱ {destination.avg_duration_minutes} min</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Map View */}
            <div className={`flex-1 min-h-[400px] lg:min-h-[600px] ${
                mobileView === 'map' ? 'block' : 'hidden lg:block'
            }`}>
                <MapDisplay
                    destinations={filteredDestinations}
                    selectedIds={selectedIds}
                    onMarkerClick={handleMarkerClick}
                    showRoute={true}
                    className="h-full"
                />
            </div>
        </div>
    );
}
