import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, MapPinIcon, CalendarDaysIcon, UsersIcon, CurrencyDollarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
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
        <AuthenticatedLayout>
            <Head title="Rencana Perjalanan" />

            {/* Hero Section */}
            <div className="relative pt-8 pb-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-50/50 to-transparent -z-10" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold font-display text-headline-light dark:text-white mb-2">
                                Petualangan Menanti 🌍
                            </h2>
                            <p className="text-paragraph-light dark:text-gray-400 text-lg max-w-xl">
                                Kelola semua rencana perjalananmu di satu tempat. Buat momen tak terlupakan di Bandung.
                            </p>
                        </div>
                        <Link
                            href={route('itineraries.create')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Buat Rencana Baru
                        </Link>
                    </div>

                    {itineraries.length === 0 ? (
                        /* Empty State with Glass Container */
                        <div
                            ref={headerReveal.ref}
                            className={`glass-card rounded-3xl p-12 text-center max-w-2xl mx-auto ${headerReveal.className}`}
                            style={headerReveal.style}
                        >
                            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                                <div className="bg-gradient-to-b from-brand-50 to-transparent rounded-full w-48 h-48 mx-auto flex items-center justify-center">
                                    <EmptyStateIllustration className="w-40 h-auto" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold font-display text-headline-light dark:text-white mb-3">
                                Belum Ada Rencana Perjalanan
                            </h3>
                            <p className="text-paragraph-light dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                                Jangan biarkan liburanmu hanya jadi wacana! Mulai susun itinerary seru ke Bandung sekarang juga.
                            </p>
                            <Link
                                href={route('itineraries.create')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                Mulai Petualangan Pertamamu
                            </Link>
                        </div>
                    ) : (
                        /* Itinerary Grid */
                        <div
                            ref={gridReveal.containerRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {itineraries.map((itinerary, index) => {
                                const itemProps = gridReveal.getItemProps(index);
                                return (
                                    <Link
                                        key={itinerary.id}
                                        ref={itemProps.ref}
                                        href={route('itineraries.show', itinerary.id)}
                                        className={`group relative glass-card rounded-3xl overflow-hidden hover-lift flex flex-col h-full ${itemProps.className}`}
                                        style={itemProps.style}
                                    >
                                        {/* Card Header - Decorative Pattern */}
                                        <div className="h-28 bg-gradient-to-br from-teal-500 to-teal-700 relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent)]" />
                                            <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-1/3 -translate-y-1/3">
                                                <TravelMapPinIcon className="w-32 h-32 text-white" />
                                            </div>
                                            <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium rounded-full shadow-sm">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    {itinerary.city?.name || 'Bandung'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold font-display text-headline-light dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                                                    {itinerary.title}
                                                </h3>
                                                {itinerary.description ? (
                                                    <p className="text-sm text-paragraph-light dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                        {itinerary.description}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic">Tidak ada deskripsi</p>
                                                )}
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-500">
                                                        <CalendarDaysIcon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        {getDaysDiff(itinerary.start_date, itinerary.end_date)} hari
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                                                        <UsersIcon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        {itinerary.total_pax_count} orang
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500">
                                                        <MapPinIcon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        {itinerary.itinerary_items_count || 0} spot
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500">
                                                        <span className="text-xs font-bold leading-none">
                                                            {itinerary.transportation_preference === 'MOTOR' ? '🏍️' : '🚗'}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 lowercase text-transform-capitalize">
                                                        {itinerary.transportation_preference.toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Total Budget</span>
                                                    <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">
                                                        {formatCurrency(itinerary.total_budget || 0)}
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform translate-x-2 group-hover:translate-x-0 group-focus:translate-x-0 transition-all duration-300">
                                                    <ArrowRightIcon aria-hidden="true" className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Add New Card (Dashed) */}
                            <Link
                                href={route('itineraries.create')}
                                className="group relative flex flex-col items-center justify-center min-h-[320px] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/20 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                    <PlusIcon className="w-8 h-8 text-teal-500 dark:text-teal-400" />
                                </div>
                                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    Buat Rencana Baru
                                </span>
                                <span className="text-sm text-gray-400 mt-1 max-w-[200px] text-center">
                                    Mulai dari nol atau gunakan AI generator
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
