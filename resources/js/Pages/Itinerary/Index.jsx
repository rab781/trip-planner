import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, MapPinIcon, CalendarDaysIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

/**
 * Itinerary Index Page - Grid of user's itineraries
 *
 * Inspired by Google Travel: minimal, clean, grid cards
 */
export default function Index({ itineraries = [] }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getDaysDiff = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return diff;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-headline">
                        Rencana Perjalanan
                    </h2>
                    <Link
                        href={route('itineraries.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-button text-button-text text-sm font-medium rounded-xl hover:bg-button/90 transition-colors shadow-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Buat Rencana Baru
                    </Link>
                </div>
            }
        >
            <Head title="Rencana Perjalanan" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {itineraries.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-16">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-secondary to-background rounded-full flex items-center justify-center mb-6">
                                <span className="text-6xl">🗺️</span>
                            </div>
                            <h3 className="text-xl font-semibold text-headline mb-2">
                                Belum ada rencana perjalanan
                            </h3>
                            <p className="text-paragraph max-w-md mx-auto mb-8">
                                Mulai rencanakan perjalanan seru ke Bandung! Pilih destinasi, atur jadwal, dan lihat estimasi budget secara otomatis.
                            </p>
                            <Link
                                href={route('itineraries.create')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-button text-button-text font-medium rounded-xl hover:bg-button/90 transition-colors shadow-md"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Buat Rencana Pertamamu
                            </Link>
                        </div>
                    ) : (
                        /* Itinerary Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {itineraries.map((itinerary) => (
                                <Link
                                    key={itinerary.id}
                                    href={route('itineraries.show', itinerary.id)}
                                    className="group bg-main rounded-2xl shadow-sm border border-secondary overflow-hidden hover:shadow-lg hover:border-button/20 transition-all"
                                >
                                    {/* Card Header - Gradient */}
                                    <div className="h-24 bg-button relative">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <span className="inline-block px-2 py-0.5 bg-main/20 backdrop-blur-sm text-button-text text-xs rounded-full">
                                                {itinerary.city?.name || 'Bandung'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-headline text-lg mb-1 group-hover:text-button transition-colors truncate">
                                            {itinerary.title}
                                        </h3>

                                        {itinerary.description && (
                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                                {itinerary.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {getDaysDiff(itinerary.start_date, itinerary.end_date)} hari
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <UsersIcon className="w-4 h-4 text-gray-400" />
                                                <span>{itinerary.total_pax_count} orang</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPinIcon className="w-4 h-4 text-gray-400" />
                                                <span>{itinerary.itinerary_items_count || 0} destinasi</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="text-base">
                                                    {itinerary.transportation_preference === 'MOTOR' ? '🏍️' : '🚗'}
                                                </span>
                                                <span>{itinerary.transportation_preference}</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-secondary">
                                            <span className="text-xs text-paragraph">
                                                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                                            </span>
                                            <span className="font-semibold text-button">
                                                {formatCurrency(itinerary.total_budget || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* Add New Card */}
                            {/* Add New Card */}
                            <Link
                                href={route('itineraries.create')}
                                className="flex flex-col items-center justify-center min-h-[280px] bg-background rounded-2xl border-2 border-dashed border-secondary hover:border-button hover:bg-secondary/30 transition-all group"
                            >
                                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-3 group-hover:bg-button/10 transition-colors">
                                    <PlusIcon className="w-8 h-8 text-paragraph group-hover:text-button transition-colors" />
                                </div>
                                <span className="font-medium text-paragraph group-hover:text-button transition-colors">
                                    Buat Rencana Baru
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
