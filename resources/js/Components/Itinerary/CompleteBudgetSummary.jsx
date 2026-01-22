import {
    CurrencyDollarIcon,
    TicketIcon,
    TruckIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
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
        <div className={`bg-main rounded-2xl border border-secondary overflow-hidden ${isSticky ? 'sticky top-20' : ''} ${className}`}>
            {/* Header */}
            <div className="p-4 bg-button text-button-text">
                <h3 className="font-semibold flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5" />
                    Estimasi Budget
                </h3>
                <p className="text-sm text-button-text/80 mt-0.5">
                    Untuk {paxCount} orang
                </p>
            </div>

            {/* Breakdown */}
            <div className="p-4 space-y-4">
                {/* Cost Items */}
                <div className="space-y-3">
                    {/* Tickets */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-paragraph">
                            <TicketIcon className="w-4 h-4" />
                            <span className="text-sm">Tiket Masuk</span>
                        </div>
                        <span className="font-medium text-headline">{formatCurrency(totalTickets)}</span>
                    </div>

                    {/* Transport */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-paragraph">
                            <TruckIcon className="w-4 h-4" />
                            <span className="text-sm">Transportasi</span>
                        </div>
                        <span className="font-medium text-headline">{formatCurrency(totalTransport)}</span>
                    </div>

                    {/* Food */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-paragraph">
                            <BuildingStorefrontIcon className="w-4 h-4" />
                            <span className="text-sm">Makanan (est.)</span>
                        </div>
                        <span className="font-medium text-headline">
                            {formatCurrency(totalFoodMin)} - {formatCurrency(totalFoodMax)}
                        </span>
                    </div>

                    {/* Parking */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-paragraph">
                            <span className="text-sm ml-6">🅿️ Parkir</span>
                        </div>
                        <span className="font-medium text-headline">{formatCurrency(totalParking)}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-secondary"></div>

                {/* Total */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-headline">Total Estimasi</span>
                        <span className="font-bold text-button text-lg">
                            {formatCurrency(grand_total.min)} - {formatCurrency(grand_total.max)}
                        </span>
                    </div>
                    <p className="text-xs text-paragraph">
                        Per orang: {formatCurrency((grand_total.min || 0) / paxCount)} - {formatCurrency((grand_total.max || 0) / paxCount)}
                    </p>
                </div>

                {/* User Budget Comparison */}
                {user_budget && (
                    <>
                        <div className="border-t border-secondary"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-paragraph">Budget Anda</span>
                            <span className="font-medium text-headline">{formatCurrency(user_budget)}</span>
                        </div>
                    </>
                )}

                {/* Status & Tips */}
                {status && tips && (
                    <div className={`p-3 rounded-xl ${currentStatus.bgColor} ${currentStatus.borderColor} border`}>
                        <div className="flex items-start gap-2">
                            <StatusIcon className={`w-5 h-5 ${currentStatus.iconColor} flex-shrink-0 mt-0.5`} />
                            <p className={`text-sm ${currentStatus.textColor}`}>{tips}</p>
                        </div>
                    </div>
                )}

                {/* Per Day Breakdown (Collapsible) */}
                {per_day.length > 0 && (
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-button font-medium hover:text-button/80 list-none flex items-center gap-1">
                            <span>Lihat detail per hari</span>
                            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-3 space-y-2">
                            {per_day.map((day, index) => (
                                <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-headline text-sm">Hari {day.day}</span>
                                        <span className="text-sm text-button font-medium">
                                            {formatCurrency(day.subtotal?.min)} - {formatCurrency(day.subtotal?.max)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-paragraph">
                                        <div>🎫 Tiket: {formatCurrency(day.tickets)}</div>
                                        <div>🚗 Transport: {formatCurrency(day.transport)}</div>
                                        <div>🍜 Makan: {formatCurrency(day.food_estimate?.min)}-{formatCurrency(day.food_estimate?.max)}</div>
                                        <div>🅿️ Parkir: {formatCurrency(day.parking)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>

            {/* Footer Note */}
            <div className="px-4 py-3 bg-secondary/30 border-t border-secondary">
                <p className="text-xs text-paragraph text-center">
                    💡 Estimasi berdasarkan harga rata-rata. Aktual bisa berbeda.
                </p>
            </div>
        </div>
    );
}
