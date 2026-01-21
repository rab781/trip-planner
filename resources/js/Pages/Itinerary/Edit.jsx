import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MapWithSidebar from '@/Components/Map/MapWithSidebar';
import DraggableList from '@/Components/Itinerary/DraggableList';
import DayTabs from '@/Components/Itinerary/DayTabs';
import BudgetSummary from '@/Components/Itinerary/BudgetSummary';
import { 
    ArrowLeftIcon, 
    CheckIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

/**
 * Itinerary Edit Page - Edit existing itinerary
 * 
 * Similar to Show page but with editing capabilities
 */
export default function Edit({ 
    itinerary, 
    itemsByDay = {}, 
    budget = {},
    cities = [],
    zones = [],
    categories = [],
    destinations = [],
}) {
    const [activeDay, setActiveDay] = useState(1);
    const [items, setItems] = useState(itemsByDay);
    const [currentBudget, setCurrentBudget] = useState(budget);
    const [isSaving, setIsSaving] = useState(false);
    const [showDestinationPicker, setShowDestinationPicker] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        city_id: itinerary.city_id,
        title: itinerary.title,
        description: itinerary.description || '',
        start_date: itinerary.start_date,
        end_date: itinerary.end_date,
        total_pax_count: itinerary.total_pax_count,
        transportation_preference: itinerary.transportation_preference,
    });

    // Get all unique days
    const days = Object.keys(items).map(Number).sort((a, b) => a - b);
    if (days.length === 0) days.push(1);

    // Get current day items
    const currentDayItems = items[activeDay] || [];

    // Get all selected destination IDs
    const allSelectedIds = Object.values(items)
        .flat()
        .map(item => item.destination.id);

    // Item counts per day
    const itemCounts = Object.fromEntries(
        Object.entries(items).map(([day, dayItems]) => [day, dayItems.length])
    );

    // Handle reorder
    const handleReorder = useCallback(async (reorderedItems) => {
        setItems(prev => ({
            ...prev,
            [activeDay]: reorderedItems,
        }));

        setIsSaving(true);

        try {
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

            if (response.ok && result.data?.budget) {
                setCurrentBudget(result.data.budget);
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

        setItems(prev => ({
            ...prev,
            [activeDay]: prev[activeDay].filter(item => item.id !== itemToRemove.id),
        }));
    }, [activeDay]);

    // Handle add destination
    const handleAddDestination = useCallback((destination) => {
        if (allSelectedIds.includes(destination.id)) {
            // Remove from current day
            setItems(prev => {
                const newItems = { ...prev };
                for (const day in newItems) {
                    newItems[day] = newItems[day].filter(
                        item => item.destination.id !== destination.id
                    );
                }
                return newItems;
            });
        } else {
            // Add to current day
            const newItem = {
                id: `temp-${Date.now()}`, // Temporary ID
                destination: destination,
                destination_id: destination.id,
                day_number: activeDay,
                sequence_order: currentDayItems.length + 1,
                dist_from_prev_km: 0,
                est_transport_cost: 0,
            };

            setItems(prev => ({
                ...prev,
                [activeDay]: [...(prev[activeDay] || []), newItem],
            }));
        }
    }, [activeDay, allSelectedIds, currentDayItems.length]);

    // Handle save basic info
    const handleSaveBasicInfo = () => {
        put(route('itineraries.update', itinerary.id), {
            preserveScroll: true,
        });
    };

    // Add new day
    const handleAddDay = () => {
        const newDay = Math.max(...days, 0) + 1;
        setItems(prev => ({
            ...prev,
            [newDay]: [],
        }));
        setActiveDay(newDay);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('itineraries.show', itinerary.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit: {itinerary.title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menyimpan...
                            </span>
                        )}
                        <Link
                            href={route('itineraries.show', itinerary.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-button text-white text-sm font-medium rounded-xl hover:bg-button/90 transition-colors"
                        >
                            <CheckIcon className="w-4 h-4" />
                            Selesai
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit: ${itinerary.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Basic Info Edit */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Orang</label>
                                <input
                                    type="number"
                                    value={data.total_pax_count}
                                    onChange={(e) => setData('total_pax_count', parseInt(e.target.value))}
                                    min="1"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transportasi</label>
                                <select
                                    value={data.transportation_preference}
                                    onChange={(e) => setData('transportation_preference', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                >
                                    <option value="MOTOR">🏍️ Motor</option>
                                    <option value="CAR">🚗 Mobil</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleSaveBasicInfo}
                                    disabled={processing}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Day Tabs */}
                    <DayTabs
                        days={days}
                        activeDay={activeDay}
                        onDayChange={(day) => {
                            if (day > Math.max(...days)) {
                                handleAddDay();
                            } else {
                                setActiveDay(day);
                            }
                        }}
                        itemCounts={itemCounts}
                        className="mb-6"
                    />

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Destination Picker */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Tambah Destinasi</h3>
                                        <p className="text-sm text-gray-500">Klik untuk menambah ke Hari {activeDay}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowDestinationPicker(!showDestinationPicker)}
                                        className="text-sm text-button hover:underline"
                                    >
                                        {showDestinationPicker ? 'Tutup' : 'Buka Picker'}
                                    </button>
                                </div>
                                
                                {showDestinationPicker && (
                                    <div className="p-4">
                                        <MapWithSidebar
                                            destinations={destinations}
                                            selectedIds={allSelectedIds}
                                            onToggleDestination={handleAddDestination}
                                            zones={zones}
                                            categories={categories}
                                        />
                                    </div>
                                )}

                                {!showDestinationPicker && (
                                    <div className="p-6">
                                        <DraggableList
                                            items={currentDayItems}
                                            onReorder={handleReorder}
                                            onRemove={handleRemoveItem}
                                            showTransport={true}
                                        />

                                        {/* Add destination button */}
                                        <button
                                            onClick={() => setShowDestinationPicker(true)}
                                            className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-button hover:text-button hover:bg-secondary/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                            Tambah Destinasi
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Budget Summary */}
                        <div>
                            <BudgetSummary
                                budget={currentBudget}
                                paxCount={data.total_pax_count}
                                isSticky={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
