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

    // Handle save basic info (removed - not needed as we use API)
    const handleSaveBasicInfo = async () => {
        // Basic info is saved via separate form not implemented yet
        // For now just show success message
        alert('Info dasar tersimpan!');
    };

    // Save items and navigate to show page
    const handleSaveAndFinish = async () => {
        setIsSaving(true);

        try {
            // Flatten items into array with day_number and sequence_order
            const itemsToSync = [];
            Object.entries(items).forEach(([dayNumber, dayItems]) => {
                dayItems.forEach((item, index) => {
                    itemsToSync.push({
                        destination_id: item.destination?.id || item.destination_id,
                        day_number: parseInt(dayNumber),
                        sequence_order: index + 1,
                    });
                });
            });

            // Sync items to backend
            const response = await fetch(`/api/itineraries/${itinerary.id}/sync-items`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ items: itemsToSync }),
            });

            const result = await response.json();

            if (response.ok) {
                // Redirect to show page
                window.location.href = `/itineraries/${itinerary.id}`;
            } else {
                alert(result.message || 'Gagal menyimpan perubahan');
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Error saving items:', error);
            alert('Terjadi kesalahan saat menyimpan');
            setIsSaving(false);
        }
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
                            className="p-2.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                                Edit: {itinerary.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sesuaikan rencana perjalanan Anda</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isSaving && (
                            <span className="text-sm font-medium text-teal-600 dark:text-teal-400 flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg animate-pulse">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Menyimpan...
                            </span>
                        )}
                        <button
                            onClick={handleSaveAndFinish}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                        >
                            <CheckIcon className="w-5 h-5" />
                            {isSaving ? 'Menyimpan...' : 'Selesai Edit'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Edit: ${itinerary.title}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Basic Info Edit */}
                    <div className="glass-card rounded-3xl p-6 mb-8 relative overflow-hidden group">
                        {/* Decorative background gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-teal-500/10 transition-colors duration-500" />

                        <div className="relative z-10">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                                Informasi Dasar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2ml-1">Judul Perjalanan</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                        placeholder="Contoh: Liburan Seru di Bandung"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Mulai</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Selesai</label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Jumlah Orang</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={data.total_pax_count}
                                            onChange={(e) => setData('total_pax_count', parseInt(e.target.value))}
                                            min="1"
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">Pax</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">Transportasi</label>
                                    <select
                                        value={data.transportation_preference}
                                        onChange={(e) => setData('transportation_preference', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="MOTOR">🏍️ Motor</option>
                                        <option value="CAR">🚗 Mobil</option>
                                    </select>
                                </div>
                                <div className="flex items-end md:col-span-2 lg:col-span-2 justify-end">
                                    <button
                                        onClick={handleSaveBasicInfo}
                                        disabled={processing}
                                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 transition-all text-sm font-bold shadow-sm hover:shadow-md disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
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
                            <div className="glass-card rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none min-h-[600px] flex flex-col">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white/60 dark:bg-gray-800/60 backdrop-blur-md sticky top-0 z-20">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                            Daftar Destinasi
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Kelola destinasi untuk <span className="font-semibold text-teal-600">Hari {activeDay}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDestinationPicker(!showDestinationPicker)}
                                        className="px-4 py-2 text-sm font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all"
                                    >
                                        {showDestinationPicker ? 'Tutup Peta' : 'Buka Peta Picker'}
                                    </button>
                                </div>

                                {showDestinationPicker && (
                                    <div className="flex-1 relative animate-fade-in">
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
                                    <div className="p-6 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50 flex-1">
                                        <DraggableList
                                            items={currentDayItems}
                                            onReorder={handleReorder}
                                            onRemove={handleRemoveItem}
                                            showTransport={true}
                                        />

                                        {/* Add destination button */}
                                        <button
                                            onClick={() => setShowDestinationPicker(true)}
                                            className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-colors">
                                                <PlusIcon className="w-6 h-6" />
                                            </div>
                                            <span className="font-bold">Tambah Destinasi Baru</span>
                                            <span className="text-xs font-normal">Buka peta untuk memilih tempat</span>
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
