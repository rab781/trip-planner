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
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-main shadow-xl transition-all">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-secondary flex items-center justify-between">
                                    <div>
                                        <Dialog.Title className="text-lg font-semibold text-headline">
                                            Ganti Destinasi
                                        </Dialog.Title>
                                        <p className="text-sm text-paragraph">
                                            Mengganti: <span className="font-medium">{destination.name}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-paragraph hover:text-headline hover:bg-secondary rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Tabs */}
                                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                                    <Tab.List className="flex border-b border-secondary">
                                        <Tab className={({ selected }) => `flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                                            selected 
                                                ? 'text-button border-b-2 border-button' 
                                                : 'text-paragraph hover:text-headline'
                                        }`}>
                                            <MagnifyingGlassIcon className="w-4 h-4 inline mr-2" />
                                            Pilih Manual
                                        </Tab>
                                        <Tab className={({ selected }) => `flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                                            selected 
                                                ? 'text-button border-b-2 border-button' 
                                                : 'text-paragraph hover:text-headline'
                                        }`}>
                                            <SparklesIcon className="w-4 h-4 inline mr-2" />
                                            Minta Saran AI
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels>
                                        {/* Manual Selection Tab */}
                                        <Tab.Panel className="p-4">
                                            {/* Search & Filter */}
                                            <div className="flex gap-3 mb-4">
                                                <div className="flex-1 relative">
                                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-paragraph" />
                                                    <input
                                                        type="text"
                                                        placeholder="Cari destinasi..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                                    />
                                                </div>
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="px-4 py-2.5 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                                >
                                                    <option value="">Semua Kategori</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Destinations List */}
                                            <div className="max-h-80 overflow-y-auto space-y-2">
                                                {isLoadingManual ? (
                                                    <div className="flex items-center justify-center py-8">
                                                        <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                ) : filteredDestinations.length === 0 ? (
                                                    <div className="text-center py-8 text-paragraph">
                                                        <MapPinIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                        <p>Tidak ada destinasi ditemukan</p>
                                                    </div>
                                                ) : (
                                                    filteredDestinations.map(dest => (
                                                        <button
                                                            key={dest.id}
                                                            onClick={() => handleSelect(dest)}
                                                            className="w-full p-3 bg-secondary/30 hover:bg-secondary rounded-xl text-left transition-colors"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                                                    {dest.image_url ? (
                                                                        <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <MapPinIcon className="w-6 h-6 m-3 text-paragraph" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-medium text-headline truncate">{dest.name}</h4>
                                                                    <div className="flex items-center gap-2 text-xs text-paragraph mt-0.5">
                                                                        <span>{dest.zone?.name}</span>
                                                                        {dest.rating > 0 && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                                                <span>{dest.rating}</span>
                                                                            </>
                                                                        )}
                                                                        <span>•</span>
                                                                        <span>{dest.category?.name}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm font-medium text-button flex-shrink-0">
                                                                    Rp {(dest.ticketVariants?.[0]?.price || 0).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </Tab.Panel>

                                        {/* AI Suggestion Tab */}
                                        <Tab.Panel className="p-4">
                                            <div className="space-y-4">
                                                {/* Reason Input */}
                                                <div>
                                                    <label className="block text-sm font-medium text-headline mb-2">
                                                        Kenapa ingin diganti? (opsional)
                                                    </label>
                                                    <textarea
                                                        value={aiReason}
                                                        onChange={(e) => setAiReason(e.target.value)}
                                                        placeholder="Contoh: Terlalu mahal, kurang cocok untuk anak-anak, ingin yang lebih instagramable..."
                                                        rows={3}
                                                        className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button resize-none"
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleGetAiSuggestions}
                                                    disabled={isLoadingAi}
                                                    className="w-full py-3 bg-button text-button-text rounded-xl font-medium hover:bg-button/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {isLoadingAi ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Mencari saran...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <SparklesIcon className="w-4 h-4" />
                                                            Dapatkan Saran AI
                                                        </>
                                                    )}
                                                </button>

                                                {/* Error Message */}
                                                {error && (
                                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                                        {error}
                                                    </div>
                                                )}

                                                {/* AI Suggestions */}
                                                {aiSuggestions.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-headline">
                                                            Saran untuk Anda:
                                                        </h4>
                                                        {aiSuggestions.map(dest => (
                                                            <button
                                                                key={dest.id}
                                                                onClick={() => handleSelect(dest)}
                                                                className="w-full p-3 bg-gradient-to-r from-button/5 to-highlight/5 hover:from-button/10 hover:to-highlight/10 border border-button/20 rounded-xl text-left transition-colors"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                                                        {dest.image_url ? (
                                                                            <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <MapPinIcon className="w-6 h-6 m-3 text-paragraph" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-medium text-headline truncate">{dest.name}</h4>
                                                                        <div className="flex items-center gap-2 text-xs text-paragraph mt-0.5">
                                                                            <span>{dest.zone}</span>
                                                                            {dest.rating > 0 && (
                                                                                <>
                                                                                    <span>•</span>
                                                                                    <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                                                    <span>{dest.rating}</span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        {dest.badges && dest.badges.length > 0 && (
                                                                            <div className="mt-2">
                                                                                <DestinationBadges badges={dest.badges} size="sm" maxShow={3} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right flex-shrink-0">
                                                                        <span className="text-sm font-medium text-button">
                                                                            Rp {(dest.min_ticket_price || 0).toLocaleString('id-ID')}
                                                                        </span>
                                                                        <p className="text-xs text-paragraph mt-0.5">
                                                                            Score: {dest.score}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>

                                {/* Footer */}
                                <div className="px-6 py-4 bg-secondary/30 border-t border-secondary">
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2.5 border border-secondary text-paragraph rounded-xl font-medium hover:bg-secondary transition-colors"
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
