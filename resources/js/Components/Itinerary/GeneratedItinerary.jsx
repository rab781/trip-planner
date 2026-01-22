import { useState } from 'react';
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
            className={`bg-main border border-secondary rounded-xl p-4 transition-all ${
                isDragging ? 'shadow-lg ring-2 ring-button z-50' : ''
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 text-paragraph hover:text-headline hover:bg-secondary rounded-lg cursor-grab active:cursor-grabbing"
                >
                    <ArrowsUpDownIcon className="w-5 h-5" />
                </button>

                {/* Sequence Number */}
                <div className="w-8 h-8 bg-button text-button-text rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                </div>

                {/* Destination Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className="font-semibold text-headline truncate">{destination.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-paragraph mt-0.5">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{destination.zone}</span>
                                {destination.rating > 0 && (
                                    <>
                                        <span>•</span>
                                        <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span>{destination.rating}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-button">
                                Rp {(destination.min_ticket_price || 0).toLocaleString('id-ID')}
                            </p>
                            {destination.avg_duration && (
                                <p className="text-xs text-paragraph flex items-center justify-end gap-1 mt-0.5">
                                    <ClockIcon className="w-3 h-3" />
                                    {destination.avg_duration} menit
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    {destination.badges && destination.badges.length > 0 && (
                        <div className="mt-2">
                            <DestinationBadges badges={destination.badges} size="sm" />
                        </div>
                    )}

                    {/* Distance from previous */}
                    {destination.distance_from_prev && (
                        <p className="text-xs text-paragraph mt-2 flex items-center gap-1">
                            <span className="w-4 h-px bg-secondary"></span>
                            {destination.distance_from_prev.toFixed(1)} km dari sebelumnya
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={() => onViewDetail(destination)}
                            className="text-xs text-button hover:text-button/80 font-medium flex items-center gap-1"
                        >
                            <InformationCircleIcon className="w-4 h-4" />
                            Detail
                        </button>
                        <button
                            onClick={() => onReplace(destination)}
                            className="text-xs text-paragraph hover:text-headline font-medium flex items-center gap-1"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Ganti
                        </button>
                        <button
                            onClick={() => onRemove(destination)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
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
        <div className="bg-background rounded-2xl border border-secondary overflow-hidden">
            {/* Day Header */}
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-button text-button-text rounded-xl flex items-center justify-center font-bold">
                        {day.day}
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-headline">Hari {day.day}</h3>
                        <p className="text-sm text-paragraph">
                            {day.destinations.length} destinasi • ~{Math.round(totalDuration / 60)} jam
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-button">
                        Rp {totalTickets.toLocaleString('id-ID')}
                    </span>
                    {isExpanded ? (
                        <ChevronUpIcon className="w-5 h-5 text-paragraph" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5 text-paragraph" />
                    )}
                </div>
            </button>

            {/* Day Content */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-secondary">
                    {/* Regenerate Day Button */}
                    <div className="flex justify-end py-3">
                        <button
                            onClick={() => onRegenerate(day.day)}
                            className="text-sm text-button hover:text-button/80 font-medium flex items-center gap-1"
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
                        <div className="text-center py-8 text-paragraph">
                            <MapPinIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Tidak ada destinasi untuk hari ini</p>
                        </div>
                    )}
                </div>
            )}
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
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-button border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-headline font-medium">Sedang generate itinerary...</p>
                <p className="text-sm text-paragraph mt-1">AI sedang memilih destinasi terbaik untuk Anda</p>
            </div>
        );
    }

    if (!days || days.length === 0) {
        return (
            <div className="text-center py-16">
                <MapPinIcon className="w-16 h-16 mx-auto text-paragraph/30 mb-4" />
                <p className="text-headline font-medium">Belum ada itinerary</p>
                <p className="text-sm text-paragraph mt-1">Klik "Generate Itinerary" untuk memulai</p>
            </div>
        );
    }

    const totalDestinations = days.reduce((sum, d) => sum + d.destinations.length, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-headline">Hasil Generate</h3>
                    <p className="text-sm text-paragraph">
                        {totalDestinations} destinasi dalam {days.length} hari
                    </p>
                </div>
                <button
                    onClick={onRegenerate}
                    className="flex items-center gap-2 px-4 py-2 text-button hover:bg-secondary rounded-xl transition-colors"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Generate Ulang Semua
                </button>
            </div>

            {/* Fallback Notification */}
            {fallbackUsed && fallbackMessage && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">Penyesuaian Otomatis</p>
                        <p className="text-sm text-amber-700 mt-0.5">{fallbackMessage}</p>
                    </div>
                </div>
            )}

            {/* Days List */}
            <div className="space-y-4">
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
