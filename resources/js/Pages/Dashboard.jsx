import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import EmptyStateIllustration from '@/Components/Illustrations/EmptyStateIllustration';
import { CompassIcon, MapPinIcon as TravelMapPinIcon, CalendarIcon, SparklesIcon as TravelSparkles, RouteIcon, SuitcaseIcon } from '@/Components/Icons/TravelIcons';
import { useRevealOnScroll, useStaggeredReveal } from '@/Hooks/useIntersectionObserver';

// SVG Icons as components
const PlusIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const CalendarDaysIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

/**
 * User Dashboard - Inspired by Google Travel
 *
 * Features: hero section "Where to next?", quick stats, recent trips, prominent CTA
 */
export default function Dashboard() {
    const { auth } = usePage().props;
    const [stats, setStats] = useState({ total_itineraries: 0, total_destinations: 0, upcoming_trips: 0 });
    const [recentItineraries, setRecentItineraries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Scroll animations
    const heroReveal = useRevealOnScroll({ animation: 'fade-up', delay: 0 });
    const actionsReveal = useStaggeredReveal({ staggerDelay: 100, itemCount: 4 });
    const recentReveal = useRevealOnScroll({ animation: 'fade-up', delay: 100 });
    const zonesReveal = useStaggeredReveal({ staggerDelay: 100, itemCount: 4 });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/itineraries', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const result = await response.json();
                const itineraries = result.data || [];

                setRecentItineraries(itineraries.slice(0, 3));

                // Calculate stats
                const upcoming = itineraries.filter(i => new Date(i.start_date) > new Date()).length;
                const totalDestinations = itineraries.reduce((sum, i) => sum + (i.itinerary_items?.length || 0), 0);

                setStats({
                    total_itineraries: itineraries.length,
                    total_destinations: totalDestinations,
                    upcoming_trips: upcoming,
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
        });
    };

    const getDaysDiff = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 17) return 'Selamat Siang';
        return 'Selamat Malam';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 dark:from-teal-600 dark:via-teal-700 dark:to-teal-800 text-white">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-coral-500/10 rounded-full blur-2xl" />
                    </div>

                    <div 
                        ref={heroReveal.ref}
                        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ${heroReveal.className}`}
                        style={heroReveal.style}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            {/* Left Content */}
                            <div className="animate-fade-in">
                                <p className="text-teal-100 mb-2 flex items-center gap-2">
                                    <span className="animate-wave inline-block">👋</span>
                                    {getGreeting()}, {auth.user?.name?.split(' ')[0] || 'Traveler'}!
                                </p>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                    Mau kemana hari ini?
                                </h1>
                                <p className="text-teal-100 text-lg max-w-xl mb-8">
                                    Rencanakan perjalanan seru ke Bandung. Pilih destinasi, atur jadwal,
                                    dan dapatkan estimasi biaya secara otomatis.
                                </p>

                                <Link
                                    href={route('itineraries.create')}
                                    className="group inline-flex items-center gap-3 px-6 py-3.5 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:shadow-teal-500/25"
                                >
                                    <TravelSparkles className="w-5 h-5 group-hover:animate-pulse" />
                                    Buat Rencana Baru
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Right Content - Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 animate-fade-in-up">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors">
                                    <SuitcaseIcon className="w-6 h-6 mx-auto mb-2 text-teal-100" />
                                    <p className="text-3xl font-bold">{stats.total_itineraries}</p>
                                    <p className="text-teal-100 text-sm">Rencana</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors">
                                    <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-teal-100" />
                                    <p className="text-3xl font-bold">{stats.upcoming_trips}</p>
                                    <p className="text-teal-100 text-sm">Akan Datang</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors">
                                    <TravelMapPinIcon className="w-6 h-6 mx-auto mb-2 text-teal-100" />
                                    <p className="text-3xl font-bold">{stats.total_destinations}</p>
                                    <p className="text-teal-100 text-sm">Destinasi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Quick Actions */}
                    <div 
                        ref={actionsReveal.containerRef}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
                    >
                        {[
                            { href: route('itineraries.create'), icon: PlusIcon, label: 'Buat Baru', color: 'teal' },
                            { href: route('itineraries.index'), icon: CalendarDaysIcon, label: 'Lihat Semua', color: 'indigo' },
                            { href: '#explore', icon: TravelMapPinIcon, label: 'Jelajahi', color: 'coral' },
                            { href: '#tips', icon: CompassIcon, label: 'Tips Travel', color: 'amber' },
                        ].map((action, index) => {
                            const itemProps = actionsReveal.getItemProps(index);
                            return (
                                <Link
                                    key={action.label}
                                    ref={itemProps.ref}
                                    href={action.href}
                                    className={`flex flex-col items-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-${action.color}-300 dark:hover:border-${action.color}-700 transition-all group ${itemProps.className}`}
                                    style={itemProps.style}
                                >
                                    <div className={`w-12 h-12 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-xl flex items-center justify-center group-hover:bg-${action.color}-500 group-hover:scale-110 transition-all`}>
                                        <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400 group-hover:text-white`} />
                                    </div>
                                    <span className="font-medium text-headline dark:text-white text-sm">{action.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Recent Itineraries */}
                    <section 
                        ref={recentReveal.ref}
                        className={`mb-10 ${recentReveal.className}`}
                        style={recentReveal.style}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-headline dark:text-white flex items-center gap-2">
                                <RouteIcon className="w-5 h-5 text-teal-500" />
                                Rencana Terbaru
                            </h2>
                            <Link
                                href={route('itineraries.index')}
                                className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 group"
                            >
                                Lihat Semua
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {isLoading ? (
                            /* Skeleton Loader */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="h-24 bg-gray-200 dark:bg-gray-700 shimmer" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 shimmer" />
                                            <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/2 shimmer" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentItineraries.length === 0 ? (
                            /* Empty State with Illustration */
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <div className="max-w-xs mx-auto mb-6">
                                    <EmptyStateIllustration />
                                </div>
                                <h3 className="font-semibold text-headline dark:text-white mb-2">Belum ada rencana</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Mulai petualanganmu sekarang!</p>
                                <Link
                                    href={route('itineraries.create')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg hover:shadow-teal-500/25"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Buat Rencana
                                </Link>
                            </div>
                        ) : (
                            /* Itinerary Cards */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recentItineraries.map((itinerary, index) => (
                                    <Link
                                        key={itinerary.id}
                                        href={route('itineraries.show', itinerary.id)}
                                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 transition-all group animate-fade-in-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Card Header */}
                                        <div className="h-20 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
                                            <div className="absolute bottom-2 left-3">
                                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                    {itinerary.city?.name || 'Bandung'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-headline dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate mb-2">
                                                {itinerary.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <CalendarDaysIcon className="w-4 h-4" />
                                                    {formatDate(itinerary.start_date)}
                                                </span>
                                                <span>•</span>
                                                <span>{getDaysDiff(itinerary.start_date, itinerary.end_date)} hari</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Featured Zones */}
                    <section id="explore" className="mb-10">
                        <h2 className="text-xl font-semibold text-headline dark:text-white mb-6 flex items-center gap-2">
                            <TravelMapPinIcon className="w-5 h-5 text-coral-500" />
                            Zona Populer di Bandung
                        </h2>
                        <div 
                            ref={zonesReveal.containerRef}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                        >
                            {[
                                { name: 'Lembang', emoji: '🌿', gradient: 'from-teal-500 to-teal-600', desc: 'Alam & Kebun' },
                                { name: 'Ciwidey', emoji: '🌋', gradient: 'from-coral-500 to-coral-600', desc: 'Kawah & Danau' },
                                { name: 'Dago', emoji: '🏙️', gradient: 'from-indigo-500 to-indigo-600', desc: 'Kuliner & Kafe' },
                                { name: 'Kota', emoji: '🛍️', gradient: 'from-amber-500 to-amber-600', desc: 'Belanja & Sejarah' },
                            ].map((zone, index) => {
                                const itemProps = zonesReveal.getItemProps(index);
                                return (
                                    <div
                                        key={zone.name}
                                        ref={itemProps.ref}
                                        className={`relative overflow-hidden rounded-2xl h-32 cursor-pointer group ${itemProps.className}`}
                                        style={itemProps.style}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${zone.gradient}`} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="relative h-full flex flex-col items-center justify-center text-white">
                                            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">{zone.emoji}</span>
                                            <h3 className="font-bold">{zone.name}</h3>
                                            <p className="text-xs text-white/80">{zone.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Tips Section */}
                    <section id="tips" className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8 transition-colors duration-300">
                        <h2 className="text-xl font-semibold text-headline dark:text-white mb-4 flex items-center gap-2">
                            <CompassIcon className="w-5 h-5 text-amber-500" />
                            Tips Hemat Perjalanan
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600">
                                <span className="text-2xl">🗓️</span>
                                <h3 className="font-medium text-headline dark:text-white mt-2 mb-1">Pilih Hari Weekday</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Harga tiket dan penginapan biasanya lebih murah di hari kerja.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600">
                                <span className="text-2xl">📍</span>
                                <h3 className="font-medium text-headline dark:text-white mt-2 mb-1">Kelompokkan per Zona</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Kunjungi destinasi di zona yang sama untuk hemat transportasi.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600">
                                <span className="text-2xl">🎟️</span>
                                <h3 className="font-medium text-headline dark:text-white mt-2 mb-1">Beli Tiket Online</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Beberapa tempat wisata menawarkan diskon untuk pembelian online.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
