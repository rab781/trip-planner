import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import {
    XMarkIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    MapPinIcon,
    StarIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';
import DestinationBadges from './DestinationBadges';

/**
 * Destination Replacement Modal
 * Two tabs: Manual selection and AI suggestion
 */
export default function DestinationReplacementModal({
    destination,
    cityId,
    categories = [],
    priority = 'balanced',
    soloMode = false,
    onConfirm,
    onClose,
}) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [manualDestinations, setManualDestinations] = useState([]);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [aiReason, setAiReason] = useState('');
    const [isLoadingManual, setIsLoadingManual] = useState(true);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [error, setError] = useState(null);

    // Load destinations for manual selection
    useEffect(() => {
        const fetchDestinations = async () => {
            setIsLoadingManual(true);
            try {
                const response = await fetch('/api/destinations');
                const data = await response.json();

                // Filter by city (through zone) and exclude current destination
                const filtered = (data.data || data || []).filter(d =>
                    d.id !== destination.id
                );
                setManualDestinations(filtered);
            } catch (err) {
                console.error('Error fetching destinations:', err);
                setError('Gagal memuat destinasi');
            } finally {
                setIsLoadingManual(false);
            }
        };

        fetchDestinations();
    }, [cityId, destination.id]);

    // Filter destinations based on search and category
    const filteredDestinations = manualDestinations.filter(d => {
        const matchesSearch = !searchQuery ||
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || d.category_id == selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get AI suggestions
    const handleGetAiSuggestions = async () => {
        if (!aiReason.trim()) return;

        setIsLoadingAi(true);
        setError(null);

        try {
            const response = await fetch('/api/itineraries/suggest-replacement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    city_id: cityId,
                    exclude_id: destination.id,
                    priority: priority,
                    solo_mode: soloMode,
                    limit: 5,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setAiSuggestions(data.data || []);
            } else {
                setError(data.message || 'Gagal mendapatkan saran');
            }
        } catch (err) {
            console.error('Error getting AI suggestions:', err);
            setError('Gagal terhubung ke server');
        } finally {
            setIsLoadingAi(false);
        }
    };

    // Handle destination selection
    const handleSelect = (newDestination) => {
        onConfirm({
            id: newDestination.id,
            name: newDestination.name,
            description: newDestination.description,
            image_url: newDestination.image_url,
            category: newDestination.category?.name || newDestination.category,
            category_id: newDestination.category_id,
            zone: newDestination.zone?.name || newDestination.zone,
            zone_id: newDestination.zone_id,
            rating: parseFloat(newDestination.rating) || 0,
            min_ticket_price: newDestination.min_ticket_price || newDestination.ticketVariants?.[0]?.price || 0,
            avg_duration: newDestination.avg_visit_duration_minutes,
            badges: newDestination.badges || [],
            solo_friendly_score: newDestination.solo_friendly_score,
            solo_tips: newDestination.solo_tips,
            activities: newDestination.activities,
            crowd_level: newDestination.crowd_level,
            parking_fee: newDestination.parking_fee,
            food_price_range: newDestination.food_price_range,
            coordinates: {
                lat: parseFloat(newDestination.latitude),
                lng: parseFloat(newDestination.longitude),
            },
        });
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl glass-card border border-white/20 shadow-2xl transition-all">
                                {/* Header */}
                                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 flex items-center justify-between">
                                    <div>
                                        <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                                            Ganti Destinasi
                                        </Dialog.Title>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                            <span>Mengganti:</span>
                                            <span className="font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
                                                {destination.name}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        aria-label="Tutup"
                                        className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                    >
                                        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Tabs */}
                                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                                    <Tab.List className="flex border-b border-gray-100 dark:border-gray-700">
                                        <Tab className={({ selected }) => `flex-1 py-4 px-4 text-sm font-semibold transition-all relative overflow-hidden ${selected
                                                ? 'text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-900/20'
                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}>
                                            {({ selected }) => (
                                                <>
                                                    <div className="flex items-center justify-center gap-2 relative z-10">
                                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                                        Pilih Manual
                                                    </div>
                                                    {selected && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400" />
                                                    )}
                                                </>
                                            )}
                                        </Tab>
                                        <Tab className={({ selected }) => `flex-1 py-4 px-4 text-sm font-semibold transition-all relative overflow-hidden ${selected
                                                ? 'text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20'
                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}>
                                            {({ selected }) => (
                                                <>
                                                    <div className="flex items-center justify-center gap-2 relative z-10">
                                                        <SparklesIcon className="w-5 h-5" />
                                                        Minta Saran AI
                                                    </div>
                                                    {selected && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
                                                    )}
                                                </>
                                            )}
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels className="bg-white/60 dark:bg-gray-900/60 min-h-[400px]">
                                        {/* Manual Selection Tab */}
                                        <Tab.Panel className="p-6 animate-fade-in">
                                            {/* Search & Filter */}
                                            <div className="flex gap-4 mb-6">
                                                <div className="flex-1 relative group">
                                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Cari destinasi..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <FunnelIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className="pl-11 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Semua Kategori</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Destinations List */}
                                            <div className="max-h-[320px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                                {isLoadingManual ? (
                                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                                        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3"></div>
                                                        <span className="text-sm font-medium">Memuat destinasi...</span>
                                                    </div>
                                                ) : filteredDestinations.length === 0 ? (
                                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                                                        <MapPinIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                                        <p className="text-gray-900 dark:text-white font-medium">Tidak ada destinasi ditemukan</p>
                                                        <p className="text-sm text-gray-500">Coba kata kunci lain atau ubah filter kategori</p>
                                                    </div>
                                                ) : (
                                                    filteredDestinations.map(dest => (
                                                        <button
                                                            key={dest.id}
                                                            onClick={() => handleSelect(dest)}
                                                            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md rounded-xl text-left transition-all group"
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                                    {dest.image_url ? (
                                                                        <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                                            <MapPinIcon className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0 py-0.5">
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-teal-600 transition-colors">{dest.name}</h4>
                                                                        <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                                                                            Rp {(dest.ticketVariants?.[0]?.price || 0).toLocaleString('id-ID')}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">{dest.zone?.name}</span>
                                                                        {dest.rating > 0 && (
                                                                            <span className="flex items-center gap-1 text-amber-600">
                                                                                <StarIcon className="w-3 h-3 fill-current" />
                                                                                {dest.rating}
                                                                            </span>
                                                                        )}
                                                                        <span className="text-gray-300 text-[10px]">•</span>
                                                                        <span>{dest.category?.name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </Tab.Panel>

                                        {/* AI Suggestion Tab */}
                                        <Tab.Panel className="p-6 animate-fade-in">
                                            <div className="space-y-6">
                                                {/* Reason Input */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                                                        Alasan Mengganti (Opsional)
                                                    </label>
                                                    <div className="relative">
                                                        <textarea
                                                            value={aiReason}
                                                            onChange={(e) => setAiReason(e.target.value)}
                                                            placeholder="Contoh: Terlalu mahal, ingin wisata alam yang sejuk, atau cari tempat makan..."
                                                            rows={3}
                                                            className="w-full pl-4 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all text-sm shadow-sm"
                                                        />
                                                        <SparklesIcon className="absolute right-3 bottom-3 w-5 h-5 text-purple-400 opacity-50" />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleGetAiSuggestions}
                                                    disabled={isLoadingAi || !aiReason.trim()}
                                                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isLoadingAi ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>Sedang Menganalisis...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <SparklesIcon className="w-5 h-5" />
                                                            <span>Minta Saran AI</span>
                                                        </>
                                                    )}
                                                </button>

                                                {/* Error Message */}
                                                {error && (
                                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex gap-3 text-red-700 dark:text-red-300 text-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                                                        {error}
                                                    </div>
                                                )}

                                                {/* AI Suggestions */}
                                                {aiSuggestions.length > 0 && (
                                                    <div className="space-y-3 pt-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                <SparklesIcon className="w-4 h-4 text-purple-500" />
                                                                Rekomendasi AI
                                                            </h4>
                                                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                                {aiSuggestions.length} Opsi
                                                            </span>
                                                        </div>
                                                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                                            {aiSuggestions.map((dest, idx) => (
                                                                <button
                                                                    key={dest.id}
                                                                    onClick={() => handleSelect(dest)}
                                                                    className="w-full p-4 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-100 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md rounded-xl text-left transition-all group relative overflow-hidden"
                                                                >
                                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>

                                                                    <div className="flex items-start gap-4 relative z-10">
                                                                        <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-purple-100 dark:border-purple-900/50 shadow-sm">
                                                                            {dest.image_url ? (
                                                                                <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                            ) : (
                                                                                <div className="flex items-center justify-center w-full h-full text-purple-300">
                                                                                    <MapPinIcon className="w-6 h-6" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex justify-between">
                                                                                <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">{dest.name}</h4>
                                                                                {dest.score && (
                                                                                    <span className="text-[10px] uppercase font-bold text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md self-start">
                                                                                        Cocok
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dest.description}</p>

                                                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                                                                <span className="font-medium text-purple-600 dark:text-purple-400">Rp {(dest.min_ticket_price || 0).toLocaleString('id-ID')}</span>
                                                                                <span>•</span>
                                                                                <span>{dest.rating} ★</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>

                                {/* Footer */}
                                <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
