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
    const handleScroll = (direction) => {
        const container = document.getElementById('day-tabs-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -150 : 150;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={`relative group ${className}`}>
            {/* Scroll Buttons */}
            {days.length > 5 && (
                <>
                    <button
                        onClick={() => handleScroll('left')}
                        aria-label="Geser ke kiri"
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleScroll('right')}
                        aria-label="Geser ke kanan"
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Tabs Container */}
            <div
                id="day-tabs-container"
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 py-1 snap-x snap-mandatory"
            >
                {days.map((day) => {
                    const dayNumber = typeof day === 'object' ? day.number : day;
                    const isActive = activeDay === dayNumber;
                    const itemCount = itemCounts[dayNumber] || 0;

                    return (
                        <button
                            key={dayNumber}
                            onClick={() => onDayChange && onDayChange(dayNumber)}
                            className={`flex-shrink-0 snap-start px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 relative overflow-hidden group/tab ${isActive
                                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 scale-105'
                                    : 'glass-card border-transparent hover:border-teal-200/50 hover:bg-white/60 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            {/* Active Shine Effect */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
                            )}

                            <div className="flex flex-col items-center gap-1 relative z-10">
                                <span className={`font-bold ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                    Hari {dayNumber}
                                </span>
                                <span className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-teal-100' : 'text-gray-400'
                                    }`}>
                                    {itemCount} Destinasi
                                </span>
                            </div>
                        </button>
                    );
                })}

                {/* Add Day Button */}
                <button
                    onClick={() => onDayChange && onDayChange(days.length + 1)}
                    className="flex-shrink-0 snap-start px-5 py-3 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all flex flex-col items-center justify-center min-w-[100px]"
                >
                    <span className="text-xl leading-none mb-1">+</span>
                    <span className="text-xs font-bold">Tambah</span>
                </button>
            </div>
        </div>
    );
}
