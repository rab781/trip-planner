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
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('itineraries.index')}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                {itinerary.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Menyimpan...
                            </span>
                        )}
                        <Link
                            href={route('itineraries.edit', itinerary.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <PencilIcon className="w-4 h-4" />
                            Edit
                        </Link>
                        <button className="inline-flex items-center gap-2 px-4 py-2 text-button bg-secondary text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors">
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
                    <div className="lg:hidden flex bg-gray-100 rounded-xl p-1 mb-4">
                        <button
                            onClick={() => setMobileView('list')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                                mobileView === 'list'
                                    ? 'bg-white text-button shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <ListBulletIcon className="w-5 h-5" />
                            Itinerary
                        </button>
                        <button
                            onClick={() => setMobileView('map')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                                mobileView === 'map'
                                    ? 'bg-white text-button shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MapIcon className="w-5 h-5" />
                            Peta
                        </button>
                    </div>

                    {/* Main Content - Split View */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Map Section - Left (60%) */}
                        <div className={`lg:w-[60%] ${mobileView === 'map' ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
                                <div className="p-4 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">
                                        Rute Hari {activeDay}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {currentDayItems.length} destinasi
                                    </p>
                                </div>
                                <div className="h-[500px]">
                                    <MapDisplay
                                        destinations={allDestinations}
                                        selectedIds={selectedIds}
                                        showRoute={true}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Itinerary & Budget Section - Right (40%) */}
                        <div className={`lg:w-[40%] space-y-6 ${mobileView === 'list' ? 'block' : 'hidden lg:block'}`}>
                            {/* Draggable Itinerary List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">
                                        Hari {activeDay}
                                    </h3>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        Drag untuk mengatur ulang
                                    </span>
                                </div>

                                <DraggableList
                                    items={currentDayItems}
                                    onReorder={handleReorder}
                                    onRemove={handleRemoveItem}
                                    showTransport={true}
                                />
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
                    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block mb-1">Kota</span>
                                <span className="font-medium text-gray-900">{itinerary.city?.name || 'Bandung'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Jumlah Orang</span>
                                <span className="font-medium text-gray-900">{itinerary.total_pax_count} orang</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Transportasi</span>
                                <span className="font-medium text-gray-900">
                                    {itinerary.transportation_preference === 'MOTOR' ? '🏍️ Motor' : '🚗 Mobil'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 block mb-1">Total Destinasi</span>
                                <span className="font-medium text-gray-900">{allItems.length} tempat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
