import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MapDisplay from '@/Components/Map/MapDisplay';
import DraggableList from '@/Components/Itinerary/DraggableList';
import DayTabs from '@/Components/Itinerary/DayTabs';
import BudgetSummary from '@/Components/Itinerary/BudgetSummary';
import {
    ArrowLeftIcon,
    PencilIcon,
    ShareIcon,
    MapIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';

/**
 * Itinerary Show Page - Detail view with drag & drop
 *
 * Inspired by Sygic Travel: split view (map kiri 60%, detail kanan 40%)
 * Features: drag & drop reorder, live map update, budget summary
 */
export default function Show({ itinerary, itemsByDay = {}, budget = {} }) {
    const [activeDay, setActiveDay] = useState(1);
    const [items, setItems] = useState(itemsByDay);
    const [currentBudget, setCurrentBudget] = useState(budget);
    const [isSaving, setIsSaving] = useState(false);
    const [mobileView, setMobileView] = useState('list'); // 'map' | 'list'

    // Get all unique days
    const days = Object.keys(items).map(Number).sort((a, b) => a - b);
    if (days.length === 0) days.push(1);

    // Get current day items
    const currentDayItems = items[activeDay] || [];

    // Get all items for map display
    const allItems = Object.values(items).flat();
    const allDestinations = allItems.map(item => ({
        ...item.destination,
        id: item.destination.id,
    }));
    const selectedIds = currentDayItems.map(item => item.destination.id);

    // Item counts per day
    const itemCounts = Object.fromEntries(
        Object.entries(items).map(([day, dayItems]) => [day, dayItems.length])
    );

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Handle reorder
    const handleReorder = useCallback(async (reorderedItems) => {
        // Optimistic update
        setItems(prev => ({
            ...prev,
            [activeDay]: reorderedItems,
        }));

        setIsSaving(true);

        try {
            // Prepare data for API
            const reorderData = reorderedItems.map((item, index) => ({
                id: item.id,
                day_number: activeDay,
            }));

            const response = await fetch(`/api/itineraries/${itinerary.id}/reorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ items: reorderData }),
            });

            const result = await response.json();

            if (response.ok) {
                // Update budget from response
                if (result.data?.budget) {
                    setCurrentBudget(result.data.budget);
                }

                // Update items with recalculated distances
                if (result.data?.items) {
                    const updatedItems = result.data.items;
                    setItems(prev => ({
                        ...prev,
                        [activeDay]: reorderedItems.map(item => {
                            const updated = updatedItems.find(u => u.id === item.id);
                            return updated ? { ...item, ...updated } : item;
                        }),
                    }));
                }
            }
        } catch (error) {
            console.error('Error reordering:', error);
        } finally {
            setIsSaving(false);
        }
    }, [activeDay, itinerary.id]);

    // Handle remove item
    const handleRemoveItem = useCallback(async (itemToRemove) => {
        if (!confirm('Hapus destinasi ini dari itinerary?')) return;

        // Optimistic update
        setItems(prev => ({
            ...prev,
            [activeDay]: prev[activeDay].filter(item => item.id !== itemToRemove.id),
        }));

        try {
            // TODO: Add API call to remove item
            // await fetch(`/api/itinerary-items/${itemToRemove.id}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }, [activeDay]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                            Detail Perjalanan
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {itinerary.title}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('itineraries.index')}
                            className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 font-bold text-sm shadow-sm transition-all"
                        >
                            Kembali
                        </Link>
                        <Link
                            href={route('itineraries.edit', itinerary.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all font-bold text-sm hover:-translate-y-0.5"
                        >
                            <PencilIcon className="w-4 h-4" />
                            Edit Rencana
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 font-bold text-sm shadow-sm transition-all">
                            <ShareIcon className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={itinerary.title} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Day Tabs */}
                    <DayTabs
                        days={days}
                        activeDay={activeDay}
                        onDayChange={setActiveDay}
                        itemCounts={itemCounts}
                        className="mb-6"
                    />

                    {/* Mobile View Toggle */}
                    <div className="lg:hidden flex bg-white/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setMobileView('list')}
                            aria-pressed={mobileView === 'list'}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mobileView === 'list'
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                                }`}
                        >
                            <ListBulletIcon className="w-5 h-5" />
                            Itinerary
                        </button>
                        <button
                            onClick={() => setMobileView('map')}
                            aria-pressed={mobileView === 'map'}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mobileView === 'map'
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                                }`}
                        >
                            <MapIcon className="w-5 h-5" />
                            Peta
                        </button>
                    </div>

                    {/* Main Content - Split View */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Map Section - Left (60%) */}
                        <div className={`lg:w-[60%] order-2 lg:order-1 ${mobileView === 'map' ? 'block' : 'hidden lg:block'}`}>
                            <div className="glass-card rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none sticky top-24 h-[600px] flex flex-col group border border-white/20">
                                {/* Decorative gradient */}
                                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500" />

                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex justify-between items-center z-10">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            Rute Hari {activeDay}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {currentDayItems.length} destinasi
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 relative">
                                    <MapDisplay
                                        destinations={allDestinations}
                                        selectedIds={selectedIds}
                                        showRoute={true}
                                        useRoadRouting={true}
                                        routeColor="#0f766e"
                                        className="h-full w-full"
                                    />

                                    {/* Map Control overlay */}
                                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                                        <button
                                            aria-label="Perbesar peta"
                                            className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:scale-110 transition-all border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary & Budget Section - Right (40%) */}
                        <div className={`lg:w-[40%] space-y-6 order-1 lg:order-2 ${mobileView === 'list' ? 'block' : 'hidden lg:block'}`}>
                            {/* Draggable Itinerary List */}
                            <div className="glass-card rounded-3xl p-6 relative overflow-hidden border border-white/20">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                                    Rurutan Perjalanan
                                </h3>

                                <div className="max-h-[600px] overflow-y-auto scrollbar-hide -mr-2 pr-2">
                                    <DraggableList
                                        items={currentDayItems}
                                        onReorder={handleReorder}
                                        onRemove={handleRemoveItem}
                                        showTransport={true}
                                        className="py-2"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Budget Summary */}
                        <BudgetSummary
                            budget={currentBudget}
                            paxCount={itinerary.total_pax_count}
                            isSticky={true}
                        />
                    </div>
                </div>

                {/* Trip Info Footer */}
                <div className="mt-12 glass-card rounded-3xl p-8 text-center relative overflow-hidden group border border-white/20">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-50/50 to-transparent dark:from-teal-900/10 pointer-events-none transition-opacity duration-500" />

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400">
                                <span className="text-xl">🏙️</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider mb-1">Kota</span>
                                <span className="font-bold text-gray-900 dark:text-white capitalize">{itinerary.city?.name || 'Bandung'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <span className="text-xl">👥</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider mb-1">Pax</span>
                                <span className="font-bold text-gray-900 dark:text-white">{itinerary.total_pax_count} Orang</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                                <span className="text-xl">🚗</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider mb-1">Transport</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {itinerary.transportation_preference === 'MOTOR' ? 'Motor' : 'Mobil'}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                                <span className="text-xl">📍</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider mb-1">Total</span>
                                <span className="font-bold text-gray-900 dark:text-white">{allItems.length} Destinasi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
