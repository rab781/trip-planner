import { MapPinIcon, ClockIcon, TicketIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

/**
 * ItineraryCard Component - Timeline card for destinations
 * 
 * Inspired by TripIt: time, icon kategori, duration badge
 * Shows destination details with expandable ticket variants
 * 
 * @param {Object} item - Itinerary item with destination data
 * @param {number} index - Sequence number in the itinerary
 * @param {boolean} isDragging - Whether the card is being dragged
 * @param {Object} dragHandleProps - Props for drag handle from @hello-pangea/dnd
 */
export default function ItineraryCard({
    item,
    index,
    isDragging = false,
    dragHandleProps = {},
    onRemove = null,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const destination = item.destination;
    
    // Zone colors
    const zoneColors = {
        1: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
        2: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
        3: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
        4: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    };

    const zoneStyle = zoneColors[destination?.zone?.id] || { bg: 'bg-secondary', text: 'text-button', border: 'border-button' };

    // Category icons
    const categoryIcons = {
        'Wisata Alam': '🏞️',
        'Kuliner': '🍜',
        'Budaya': '🏛️',
        'Belanja': '🛍️',
        'Hiburan': '🎢',
        'Religi': '🕌',
    };

    const categoryIcon = categoryIcons[destination?.category?.name] || '📍';

    // Calculate estimated arrival time if start_time exists
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // Get ticket variants
    const ticketVariants = destination?.ticket_variants || destination?.ticketVariants || [];
    const mandatoryTicket = ticketVariants.find(t => t.is_mandatory);
    const optionalTickets = ticketVariants.filter(t => !t.is_mandatory);

    return (
        <div
            className={`relative bg-main rounded-xl border-l-4 shadow-sm transition-all ${
                isDragging 
                    ? 'shadow-lg ring-2 ring-button/30 rotate-2' 
                    : 'hover:shadow-md'
            } ${zoneStyle.border}`}
        >
            {/* Card Content */}
            <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start gap-3">
                    {/* Drag Handle & Number */}
                    <div 
                        {...dragHandleProps}
                        className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${zoneStyle.bg} ${zoneStyle.text}`}>
                            {index + 1}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        </div>
                    </div>

                    {/* Destination Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{categoryIcon}</span>
                            <h3 className="font-semibold text-gray-900 truncate">
                                {destination?.name || 'Unknown Destination'}
                            </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            {/* Zone Badge */}
                            <span className={`px-2 py-0.5 rounded-full ${zoneStyle.bg} ${zoneStyle.text}`}>
                                {destination?.zone?.name || 'Unknown Zone'}
                            </span>

                            {/* Duration Badge */}
                            {destination?.avg_duration_minutes && (
                                <span className="flex items-center gap-1 text-gray-500">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {destination.avg_duration_minutes} menit
                                </span>
                            )}

                            {/* Location */}
                            <span className="flex items-center gap-1 text-gray-500">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {destination?.category?.name || 'Wisata'}
                            </span>
                        </div>

                        {/* Ticket Info - Collapsed */}
                        {mandatoryTicket && (
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TicketIcon className="w-4 h-4 text-button" />
                                    <span className="text-sm font-medium text-headline">
                                        Rp {mandatoryTicket.price.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-xs text-paragraph">
                                        ({mandatoryTicket.name})
                                    </span>
                                </div>

                                {/* Expand Button */}
                                {optionalTickets.length > 0 && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="flex items-center gap-1 text-xs text-button hover:underline"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Tutup
                                                <ChevronUpIcon className="w-4 h-4" />
                                            </>
                                        ) : (
                                            <>
                                                +{optionalTickets.length} tiket opsional
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Optional Tickets - Expanded */}
                        {isExpanded && optionalTickets.length > 0 && (
                            <div className="mt-2 pl-6 space-y-1.5 border-l-2 border-gray-100">
                                {optionalTickets.map(ticket => (
                                    <div 
                                        key={ticket.id}
                                        className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-xs"
                                    >
                                        <span className="text-gray-600">{ticket.name}</span>
                                        <span className="font-medium text-gray-900">
                                            Rp {ticket.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Remove Button */}
                    {onRemove && (
                        <button
                            onClick={() => onRemove(item)}
                            className="p-1.5 text-paragraph hover:text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
                            title="Hapus dari itinerary"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
