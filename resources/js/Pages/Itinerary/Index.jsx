import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, MapPinIcon, CalendarDaysIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import EmptyStateIllustration from '@/Components/Illustrations/EmptyStateIllustration';
import { SuitcaseIcon, CalendarIcon, MapPinIcon as TravelMapPinIcon, SparklesIcon } from '@/Components/Icons/TravelIcons';
import { useRevealOnScroll, useStaggeredReveal } from '@/Hooks/useIntersectionObserver';

/**
 * Itinerary Index Page - Grid of user's itineraries
 *
 * Inspired by Google Travel: minimal, clean, grid cards
 */
export default function Index({ itineraries = [] }) {
    const headerReveal = useRevealOnScroll({ animation: 'fade-up', delay: 0 });
    const gridReveal = useStaggeredReveal({ staggerDelay: 100, itemCount: itineraries.length + 1 });

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
                    <h2 className="text-xl font-semibold leading-tight text-headline dark:text-white flex items-center gap-2">
                        <SuitcaseIcon className="w-6 h-6 text-teal-500" />
                        Rencana Perjalanan
                    </h2>
                    <Link
                        href={route('itineraries.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md hover:shadow-teal-500/25"
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
                        /* Empty State with Illustration */
                        <div 
                            ref={headerReveal.ref}
                            className={`text-center py-16 ${headerReveal.className}`}
                            style={headerReveal.style}
                        >
                            <div className="max-w-xs mx-auto mb-6">
                                <EmptyStateIllustration />
                            </div>
                            <h3 className="text-xl font-semibold text-headline dark:text-white mb-2">
                                Belum ada rencana perjalanan
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                Mulai rencanakan perjalanan seru ke Bandung! Pilih destinasi, atur jadwal, dan lihat estimasi budget secara otomatis.
                            </p>
                            <Link
                                href={route('itineraries.create')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg hover:shadow-teal-500/25"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                Buat Rencana Pertamamu
                            </Link>
                        </div>
                    ) : (
                        /* Itinerary Grid */
                        <div 
                            ref={gridReveal.containerRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {itineraries.map((itinerary, index) => {
                                const itemProps = gridReveal.getItemProps(index);
                                return (
                                    <Link
                                        key={itinerary.id}
                                        ref={itemProps.ref}
                                        href={route('itineraries.show', itinerary.id)}
                                        className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all ${itemProps.className}`}
                                        style={itemProps.style}
                                    >
                                        {/* Card Header - Gradient */}
                                        <div className="h-24 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
                                            <div className="absolute bottom-3 left-4 right-4">
                                                <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                    {itinerary.city?.name || 'Bandung'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-headline dark:text-white text-lg mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                                                {itinerary.title}
                                            </h3>

                                        {itinerary.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                                {itinerary.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <CalendarDaysIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                <span>
                                                    {getDaysDiff(itinerary.start_date, itinerary.end_date)} hari
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <UsersIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                <span>{itinerary.total_pax_count} orang</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                <span>{itinerary.itinerary_items_count || 0} destinasi</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="text-base">
                                                    {itinerary.transportation_preference === 'MOTOR' ? '🏍️' : '🚗'}
                                                </span>
                                                <span>{itinerary.transportation_preference}</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                                            </span>
                                            <span className="font-semibold text-teal-600 dark:text-teal-400">
                                                {formatCurrency(itinerary.total_budget || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                            })}

                            {/* Add New Card */}
                            <Link
                                href={route('itineraries.create')}
                                className="flex flex-col items-center justify-center min-h-[280px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all group"
                            >
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                                    <PlusIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                                </div>
                                <span className="font-medium text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
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
