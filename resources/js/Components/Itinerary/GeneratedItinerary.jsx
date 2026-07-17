import { useState, useId } from 'react';
import { useDraggable, useDroppable, DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    MapPinIcon,
    ClockIcon,
    StarIcon,
    ArrowPathIcon,
    TrashIcon,
    ArrowsUpDownIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import DestinationBadges from './DestinationBadges';
import DestinationDetailPanel from './DestinationDetailPanel';
import DestinationReplacementModal from './DestinationReplacementModal';

/**
 * Sortable Destination Card
 */
function SortableDestinationCard({ destination, index, onViewDetail, onReplace, onRemove }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: destination.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative glass-card p-4 rounded-2xl transition-all duration-300 hover:shadow-lg border border-white/20 ${isDragging ? 'shadow-2xl scale-105 z-50 ring-2 ring-teal-500/50 bg-white/90 dark:bg-gray-800/90' : 'hover:bg-white/40 dark:hover:bg-gray-800/40'
                }`}
        >
            <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    aria-label={`Ubah urutan ${destination.name}`}
                    className="mt-1 p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg cursor-grab active:cursor-grabbing transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
                >
                    <ArrowsUpDownIcon className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Sequence Number */}
                <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md shadow-teal-500/20">
                    {index + 1}
                </div>

                {/* Destination Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                                {destination.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                                    <MapPinIcon className="w-3 h-3" />
                                    {destination.zone}
                                </span>
                                {destination.rating > 0 && (
                                    <span className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-900/30">
                                        <StarIcon className="w-3 h-3 fill-current" />
                                        {destination.rating}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                                Rp {(destination.min_ticket_price || 0).toLocaleString('id-ID')}
                            </p>
                            {destination.avg_duration && (
                                <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1 mt-0.5 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-md inline-block">
                                    <ClockIcon className="w-3 h-3" />
                                    {destination.avg_duration} m
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    {destination.badges && destination.badges.length > 0 && (
                        <div className="mt-3">
                            <DestinationBadges badges={destination.badges} size="xs" />
                        </div>
                    )}

                    {/* Distance from previous */}
                    {destination.distance_from_prev && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
                            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <span>{destination.distance_from_prev.toFixed(1)} km dari sebelumnya</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onViewDetail(destination)}
                            className="flex-1 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <InformationCircleIcon className="w-4 h-4" />
                            Detail
                        </button>
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                        <button
                            onClick={() => onReplace(destination)}
                            className="flex-1 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Ganti
                        </button>
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                        <button
                            onClick={() => onRemove(destination)}
                            className="flex-1 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Day Section with destinations
 */
function DaySection({
    day,
    isExpanded,
    onToggle,
    onRegenerate,
    onViewDetail,
    onReplace,
    onRemove,
    onReorder
}) {
    const contentId = useId();
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = day.destinations.findIndex(d => d.id === active.id);
            const newIndex = day.destinations.findIndex(d => d.id === over.id);
            const newOrder = arrayMove(day.destinations, oldIndex, newIndex);
            onReorder(day.day, newOrder);
        }
    };

    const totalDuration = day.destinations.reduce((sum, d) => sum + (d.avg_duration || 60), 0);
    const totalTickets = day.destinations.reduce((sum, d) => sum + (d.min_ticket_price || 0), 0);

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-sm hover:shadow-md transition-all">
            {/* Day Header */}
            <button
                onClick={onToggle}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl flex items-center justify-center font-bold font-display text-lg shadow-lg">
                        {day.day}
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Hari {day.day}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {day.destinations.length} destinasi • ~{Math.round(totalDuration / 60)} jam
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-lg">
                        Rp {totalTickets.toLocaleString('id-ID')}
                    </span>
                    <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-gray-100 dark:bg-gray-700 rotate-180' : 'bg-transparent'}`}>
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    </div>
                </div>
            </button>

            {/* Day Content */}
            <div id={contentId} className={`transition-all duration-300 ease-in-out border-t border-gray-100 dark:border-gray-700/50 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 hidden'
                }`}>
                <div className="px-5 pb-5 pt-3">
                    {/* Regenerate Day Button */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => onRegenerate(day.day)}
                            className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1.5 px-3 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Generate Ulang Hari Ini
                        </button>
                    </div>

                    {/* Destinations List */}
                    {day.destinations.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={day.destinations.map(d => d.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {day.destinations.map((dest, index) => (
                                        <SortableDestinationCard
                                            key={dest.id}
                                            destination={dest}
                                            index={index}
                                            onViewDetail={onViewDetail}
                                            onReplace={onReplace}
                                            onRemove={onRemove}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-12 glass-card rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
                            <MapPinIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="font-medium text-gray-900 dark:text-white">Tidak ada destinasi</p>
                            <p className="text-sm text-gray-500">Destinasi untuk hari ini kosong</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Generated Itinerary Component
 * Displays AI-generated itinerary with drag-drop, regenerate, and replace features
 */
export default function GeneratedItinerary({
    days = [],
    onDaysChange,
    fallbackUsed = false,
    fallbackMessage = '',
    completeBudget = {},
    preferences = {},
    cityId,
    categories = [],
    onRegenerate,
    onRegenerateDay,
    isLoading = false,
}) {
    const [expandedDays, setExpandedDays] = useState(() => days.map(d => d.day));
    const [detailDestination, setDetailDestination] = useState(null);
    const [replaceDestination, setReplaceDestination] = useState(null);

    const toggleDay = (dayNum) => {
        setExpandedDays(prev =>
            prev.includes(dayNum)
                ? prev.filter(d => d !== dayNum)
                : [...prev, dayNum]
        );
    };

    const handleViewDetail = (destination) => {
        setDetailDestination(destination);
    };

    const handleReplace = (destination) => {
        setReplaceDestination(destination);
    };

    const handleRemove = (destination) => {
        const newDays = days.map(day => ({
            ...day,
            destinations: day.destinations.filter(d => d.id !== destination.id)
        }));
        onDaysChange(newDays);
    };

    const handleReorder = (dayNum, newDestinations) => {
        const newDays = days.map(day =>
            day.day === dayNum
                ? { ...day, destinations: newDestinations }
                : day
        );
        onDaysChange(newDays);
    };

    const handleReplaceConfirm = (newDestination) => {
        if (!replaceDestination) return;

        const newDays = days.map(day => ({
            ...day,
            destinations: day.destinations.map(d =>
                d.id === replaceDestination.id ? newDestination : d
            )
        }));
        onDaysChange(newDays);
        setReplaceDestination(null);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <MapPinIcon className="w-8 h-8 text-teal-600 animate-pulse" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sedang Merancang Perjalanan...</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    AI kami sedang memilih destinasi terbaik yang sesuai dengan preferensi Anda.
                </p>
            </div>
        );
    }

    if (!days || days.length === 0) {
        return (
            <div className="text-center py-24 glass-card rounded-3xl border border-white/20">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPinIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum Ada Itinerary</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Mulai dengan menekan tombol generate untuk melihat rekomendasi perjalanan.
                </p>
            </div>
        );
    }

    const totalDestinations = days.reduce((sum, d) => sum + d.destinations.length, 0);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                            Hasil Generate AI
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600 text-xs font-bold border border-teal-100">
                            Beta
                        </span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Ditemukan {totalDestinations} destinasi menarikk untuk {days.length} hari perjalanan Anda
                    </p>
                </div>
                <button
                    onClick={onRegenerate}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md hover:border-teal-200"
                >
                    <ArrowPathIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Generate Ulang Semua
                </button>
            </div>

            {/* Fallback Notification */}
            {fallbackUsed && fallbackMessage && (
                <div className="glass-card p-5 rounded-2xl border border-amber-200/50 bg-amber-50/50 flex items-start gap-4">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <ExclamationTriangleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-900 text-sm">Penyesuaian Otomatis</h4>
                        <p className="text-sm text-amber-800/80 mt-1 leading-relaxed">{fallbackMessage}</p>
                    </div>
                </div>
            )}

            {/* Days List */}
            <div className="space-y-6">
                {days.map(day => (
                    <DaySection
                        key={day.day}
                        day={day}
                        isExpanded={expandedDays.includes(day.day)}
                        onToggle={() => toggleDay(day.day)}
                        onRegenerate={() => onRegenerateDay(day.day)}
                        onViewDetail={handleViewDetail}
                        onReplace={handleReplace}
                        onRemove={handleRemove}
                        onReorder={handleReorder}
                    />
                ))}
            </div>

            {/* Destination Detail Panel */}
            {detailDestination && (
                <DestinationDetailPanel
                    destination={detailDestination}
                    onClose={() => setDetailDestination(null)}
                    isSoloMode={preferences?.solo_mode}
                />
            )}

            {/* Replacement Modal */}
            {replaceDestination && (
                <DestinationReplacementModal
                    destination={replaceDestination}
                    cityId={cityId}
                    categories={categories}
                    priority={preferences?.priority || 'balanced'}
                    soloMode={preferences?.solo_mode || false}
                    onConfirm={handleReplaceConfirm}
                    onClose={() => setReplaceDestination(null)}
                />
            )}
        </div>
    );
}
