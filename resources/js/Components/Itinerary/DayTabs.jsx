import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * DayTabs Component - Horizontal tabs for multi-day itineraries
 * 
 * Inspired by Sygic Travel: horizontal scroll on mobile, day indicators
 * 
 * @param {Array} days - Array of day numbers or objects
 * @param {number} activeDay - Currently active day
 * @param {Function} onDayChange - Callback when day changes
 * @param {Object} itemCounts - Object with item counts per day { 1: 3, 2: 4 }
 */
export default function DayTabs({
    days = [],
    activeDay = 1,
    onDayChange,
    itemCounts = {},
    className = '',
}) {
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = (direction) => {
        const container = document.getElementById('day-tabs-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -150 : 150;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setScrollPosition(container.scrollLeft + scrollAmount);
        }
    };

    const formatDate = (dayNumber, startDate) => {
        if (!startDate) return `Hari ${dayNumber}`;
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayNumber - 1);
        return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    return (
        <div className={`relative ${className}`}>
            {/* Scroll Buttons - Desktop only */}
            {days.length > 5 && (
                <>
                    <button
                        onClick={() => handleScroll('left')}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={() => handleScroll('right')}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                    </button>
                </>
            )}

            {/* Tabs Container */}
            <div
                id="day-tabs-container"
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1 md:px-10 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {days.map((day) => {
                    const dayNumber = typeof day === 'object' ? day.number : day;
                    const isActive = activeDay === dayNumber;
                    const itemCount = itemCounts[dayNumber] || 0;

                    return (
                        <button
                            key={dayNumber}
                            onClick={() => onDayChange && onDayChange(dayNumber)}
                            className={`flex-shrink-0 snap-start px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                                isActive
                                    ? 'bg-button text-button-text shadow-md shadow-button/30'
                                    : 'bg-main text-paragraph border border-secondary hover:border-button/30 hover:bg-secondary/50'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="font-semibold">Hari {dayNumber}</span>
                                <span className={`text-xs ${isActive ? 'text-button-text/80' : 'text-paragraph/60'}`}>
                                    {itemCount} destinasi
                                </span>
                            </div>
                        </button>
                    );
                })}

                {/* Add Day Button */}
                <button
                    onClick={() => onDayChange && onDayChange(days.length + 1)}
                    className="flex-shrink-0 snap-start px-4 py-2.5 rounded-xl border-2 border-dashed border-secondary text-paragraph hover:border-button hover:text-button hover:bg-secondary/30 transition-all"
                >
                    <div className="flex items-center gap-1">
                        <span className="text-lg">+</span>
                        <span className="text-sm font-medium">Tambah Hari</span>
                    </div>
                </button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-2 flex justify-center gap-1">
                {days.map((day) => {
                    const dayNumber = typeof day === 'object' ? day.number : day;
                    const isActive = activeDay === dayNumber;
                    
                    return (
                        <button
                            key={dayNumber}
                            onClick={() => onDayChange && onDayChange(dayNumber)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                isActive ? 'bg-button w-6' : 'bg-secondary hover:bg-button/30'
                            }`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
