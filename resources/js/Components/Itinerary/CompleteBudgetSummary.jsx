import {
    CurrencyDollarIcon,
    TicketIcon,
    TruckIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

/**
 * Complete Budget Summary Component
 * Shows full breakdown: tickets, transport, food, parking, and tips
 */
export default function CompleteBudgetSummary({
    budget = {},
    paxCount = 1,
    className = '',
    isSticky = true,
}) {
    const { per_day = [], grand_total = {}, user_budget, status, tips } = budget;

    const statusConfig = {
        under_budget: {
            icon: CheckCircleIcon,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
        },
        within_budget: {
            icon: InformationCircleIcon,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
        },
        over_budget: {
            icon: ExclamationCircleIcon,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
        },
    };

    const currentStatus = statusConfig[status] || statusConfig.within_budget;
    const StatusIcon = currentStatus.icon;

    // Calculate totals
    const totalTickets = per_day.reduce((sum, d) => sum + (d.tickets || 0), 0);
    const totalTransport = per_day.reduce((sum, d) => sum + (d.transport || 0), 0);
    const totalFoodMin = per_day.reduce((sum, d) => sum + (d.food_estimate?.min || 0), 0);
    const totalFoodMax = per_day.reduce((sum, d) => sum + (d.food_estimate?.max || 0), 0);
    const totalParking = per_day.reduce((sum, d) => sum + (d.parking || 0), 0);

    const formatCurrency = (amount) => {
        return `Rp ${(amount || 0).toLocaleString('id-ID')}`;
    };

    return (
        <div className={`glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg ${isSticky ? 'sticky top-24' : ''} ${className}`}>
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-teal-600 to-teal-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
                <h3 className="font-bold font-display text-lg flex items-center gap-2 relative z-10">
                    <CurrencyDollarIcon className="w-6 h-6" />
                    Estimasi Biaya
                </h3>
                <p className="text-teal-100 text-sm mt-1 relative z-10">
                    Perkiraan untuk {paxCount} orang
                </p>
            </div>

            {/* Breakdown */}
            <div className="p-5 space-y-5">
                {/* Cost Items */}
                <div className="space-y-4">
                    {/* Tickets */}
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                <TicketIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Tiket Masuk</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalTickets)}</span>
                    </div>

                    {/* Transport */}
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                <TruckIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Transportasi</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalTransport)}</span>
                    </div>

                    {/* Food */}
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                <BuildingStorefrontIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Makan (Est.)</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {formatCurrency(totalFoodMin)} - {formatCurrency(totalFoodMax)}
                        </span>
                    </div>

                    {/* Parking */}
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                <span className="text-sm font-bold">P</span>
                            </div>
                            <span className="text-sm font-medium">Parkir</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(totalParking)}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

                {/* Total */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">Total Estimasi</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">
                            {formatCurrency(grand_total.min)}
                        </span>
                    </div>
                    {grand_total.min !== grand_total.max && (
                        <div className="text-right text-xs text-gray-500">
                            sampai {formatCurrency(grand_total.max)}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ~ {formatCurrency((grand_total.min || 0) / paxCount)} / orang
                    </p>
                </div>

                {/* Status & Tips */}
                {status && tips && (
                    <div className={`p-4 rounded-xl border flex gap-3 ${status === 'under_budget'
                            ? 'bg-green-50/50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                            : status === 'over_budget'
                                ? 'bg-red-50/50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                                : 'bg-blue-50/50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                        }`}>
                        <StatusIcon className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium leading-relaxed">{tips}</p>
                    </div>
                )}

                {/* Per Day Breakdown (Collapsible) */}
                {per_day.length > 0 && (
                    <details className="group">
                        <summary className="cursor-pointer py-2 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 flex items-center justify-center gap-2 transition-colors">
                            <span>Lihat Detail Harian</span>
                            <ChevronDownIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 space-y-3 animate-fade-down">
                            {per_day.map((day, index) => (
                                <div key={index} className="p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm">
                                    <div className="flex items-center justify-between mb-2 font-medium">
                                        <span className="text-gray-900 dark:text-white">Hari {day.day}</span>
                                        <span className="text-teal-600 dark:text-teal-400">
                                            {formatCurrency(day.subtotal?.min)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex justify-between"><span>Tiket:</span> <span>{formatCurrency(day.tickets)}</span></div>
                                        <div className="flex justify-between"><span>Trans:</span> <span>{formatCurrency(day.transport)}</span></div>
                                        <div className="flex justify-between"><span>Makan:</span> <span>{formatCurrency(day.food_estimate?.min)}</span></div>
                                        <div className="flex justify-between"><span>Parkir:</span> <span>{formatCurrency(day.parking)}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>

            {/* Footer Note */}
            <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1">
                    <InformationCircleIcon className="w-3 h-3" />
                    Harga adalah estimasi rata-rata & dapat berubah.
                </p>
            </div>
        </div>
    );
}
