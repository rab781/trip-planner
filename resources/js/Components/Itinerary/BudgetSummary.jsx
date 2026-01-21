import { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

/**
 * BudgetSummary Component - Sticky sidebar with budget breakdown
 * 
 * Inspired by Sygic Travel: pie chart visualization, categorized breakdown
 * 
 * @param {Object} budget - Budget breakdown object from ItineraryService
 * @param {number} paxCount - Number of travelers
 * @param {boolean} isSticky - Whether to make it sticky on scroll
 */
export default function BudgetSummary({
    budget = {},
    paxCount = 1,
    isSticky = true,
    className = '',
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    const {
        transport_cost = 0,
        ticket_cost = 0,
        lodging_cost = 0,
        estimated_food_cost = 0,
        total_budget = 0,
    } = budget;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Budget categories with colors
    const categories = useMemo(() => [
        {
            label: 'Tiket Masuk',
            amount: ticket_cost,
            color: '#8B5CF6', // Purple
            icon: '🎟️',
        },
        {
            label: 'Transportasi',
            amount: transport_cost,
            color: '#3B82F6', // Blue
            icon: '🚗',
        },
        {
            label: 'Penginapan',
            amount: lodging_cost,
            color: '#10B981', // Green
            icon: '🏨',
        },
        {
            label: 'Makan (Est.)',
            amount: estimated_food_cost,
            color: '#F59E0B', // Amber
            icon: '🍜',
        },
    ].filter(cat => cat.amount > 0), [ticket_cost, transport_cost, lodging_cost, estimated_food_cost]);

    // Calculate percentages for pie chart simulation
    const percentages = useMemo(() => {
        if (total_budget === 0) return categories.map(() => 0);
        return categories.map(cat => (cat.amount / total_budget) * 100);
    }, [categories, total_budget]);

    // Per person cost
    const perPersonCost = paxCount > 0 ? total_budget / paxCount : total_budget;

    return (
        <div className={`${isSticky ? 'lg:sticky lg:top-4' : ''} ${className}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-button text-button-text"
                >
                    <div>
                        <h3 className="font-semibold text-lg">Estimasi Budget</h3>
                        <p className="text-button-text/80 text-sm mt-0.5">
                            {paxCount} orang • {categories.length} kategori
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xl">{formatCurrency(total_budget)}</p>
                        {paxCount > 1 && (
                            <p className="text-button-text/80 text-xs">
                                {formatCurrency(perPersonCost)}/orang
                            </p>
                        )}
                    </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                    <div className="p-4 space-y-4">
                        {/* Visual Progress Bar */}
                        <div className="h-4 rounded-full overflow-hidden flex bg-gray-100">
                            {categories.map((cat, index) => (
                                <div
                                    key={cat.label}
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${percentages[index]}%`,
                                        backgroundColor: cat.color,
                                    }}
                                    title={`${cat.label}: ${percentages[index].toFixed(1)}%`}
                                />
                            ))}
                        </div>

                        {/* Category Breakdown */}
                        <div className="space-y-2">
                            {categories.map((cat, index) => (
                                <div
                                    key={cat.label}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="text-lg">{cat.icon}</span>
                                        <span className="text-sm text-gray-700">{cat.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(cat.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {percentages[index].toFixed(0)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Fixed vs Variable Costs */}
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-button font-medium">Biaya Tetap</p>
                                <p className="font-semibold text-headline">
                                    {formatCurrency(ticket_cost + lodging_cost)}
                                </p>
                                <p className="text-xs text-paragraph mt-1">
                                    Tiket + Penginapan
                                </p>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-xs text-highlight font-medium">Biaya Variable</p>
                                <p className="font-semibold text-headline">
                                    {formatCurrency(transport_cost + estimated_food_cost)}
                                </p>
                                <p className="text-xs text-paragraph mt-1">
                                    Transport + Makan
                                </p>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <p className="text-xs text-amber-800">
                                💡 <strong>Tips:</strong> Biaya transportasi dapat berubah sesuai urutan destinasi. 
                                Coba atur ulang itinerary untuk mengoptimalkan biaya!
                            </p>
                        </div>
                    </div>
                )}

                {/* Collapsed View */}
                {!isExpanded && (
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                            {categories.slice(0, 3).map(cat => (
                                <span key={cat.label} className="flex items-center gap-1">
                                    {cat.icon} {formatCurrency(cat.amount)}
                                </span>
                            ))}
                            <ChevronDownIcon className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
