import { MapPinIcon, ClockIcon, TicketIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState, useId } from 'react';

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
    const ticketsId = useId();
    const destination = item.destination;

    // Zone colors - softer pastels
    const zoneColors = {
        1: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
        2: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
        3: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
        4: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
    };

    const zoneStyle = zoneColors[destination?.zone?.id] || { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' };

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

    // Get ticket variants
    const ticketVariants = destination?.ticket_variants || destination?.ticketVariants || [];
    const mandatoryTicket = ticketVariants.find(t => t.is_mandatory);
    const optionalTickets = ticketVariants.filter(t => !t.is_mandatory);

    return (
        <div
            className={`relative glass-card rounded-2xl transition-all duration-300 group overflow-hidden ${isDragging
                    ? 'shadow-2xl ring-2 ring-teal-500/50 rotate-2 scale-105 z-50'
                    : 'hover:shadow-lg hover:-translate-y-1'
                }`}
        >
            {/* Left Border accent */}
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${zoneStyle.bg.replace('bg-', 'bg-gradient-to-b from-').replace('50', '400').replace('900/20', '500')}`} />

            {/* Card Content */}
            <div className="p-4 pl-6">
                {/* Header Row */}
                <div className="flex items-start gap-4">
                    {/* Drag Handle & Number */}
                    <div
                        {...dragHandleProps}
                        className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing pt-1"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${zoneStyle.bg} ${zoneStyle.text} ring-1 ring-inset ring-black/5`}>
                            {index + 1}
                        </div>
                        <div className="flex flex-col gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        </div>
                    </div>

                    {/* Destination Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl filter drop-shadow-sm">{categoryIcon}</span>
                            <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                                {destination?.name || 'Unknown Destination'}
                            </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                            {/* Zone Badge */}
                            <span className={`px-2.5 py-1 rounded-lg font-medium ${zoneStyle.bg} ${zoneStyle.text} ring-1 ring-inset ring-black/5`}>
                                {destination?.zone?.name || 'Unknown Zone'}
                            </span>

                            {/* Duration Badge */}
                            {destination?.avg_duration_minutes && (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    {destination.avg_duration_minutes} menit
                                </span>
                            )}
                        </div>

                        {/* Ticket Info Section */}
                        {(mandatoryTicket || optionalTickets.length > 0) && (
                            <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50">
                                {mandatoryTicket && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                                <TicketIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tiket Masuk</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    Rp {mandatoryTicket.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expand Button */}
                                        {optionalTickets.length > 0 && (
                                            <button
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                aria-expanded={isExpanded}
                                                aria-controls={ticketsId}
                                                aria-label={isExpanded ? 'Tutup opsi tiket tambahan' : `Lihat ${optionalTickets.length} opsi tiket tambahan`}
                                                className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 px-2 py-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
                                            >
                                                {isExpanded ? 'Tutup' : `+${optionalTickets.length} Opsi`}
                                                {isExpanded ? <ChevronUpIcon className="w-3 h-3" aria-hidden="true" /> : <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Optional Tickets - Expanded */}
                                {isExpanded && optionalTickets.length > 0 && (
                                    <div id={ticketsId} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 space-y-2">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tiket Tambahan</p>
                                        {optionalTickets.map(ticket => (
                                            <div
                                                key={ticket.id}
                                                className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-gray-700/50 rounded-lg transition-colors group/ticket"
                                            >
                                                <span className="text-xs text-gray-600 dark:text-gray-300 group-hover/ticket:text-gray-900 dark:group-hover/ticket:text-white transition-colors">{ticket.name}</span>
                                                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                                                    Rp {ticket.price.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Remove Button */}
                    {onRemove && (
                        <button
                            onClick={() => onRemove(item)}
                            aria-label={`Hapus ${destination?.name || 'destinasi'} dari itinerary`}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 -mr-2 -mt-2"
                            title="Hapus dari itinerary"
                        >
                            <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
