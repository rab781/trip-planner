import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// SVG Icons as components
const PlusIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const MapPinIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

const SparklesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

            <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-main">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-button text-button-text">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-main/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-highlight/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            {/* Left Content */}
                            <div>
                                <p className="text-secondary mb-2">
                                    {getGreeting()}, {auth.user?.name?.split(' ')[0] || 'Traveler'}! 👋
                                </p>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                    Mau kemana hari ini?
                                </h1>
                                <p className="text-secondary text-lg max-w-xl mb-8">
                                    Rencanakan perjalanan seru ke Bandung. Pilih destinasi, atur jadwal, 
                                    dan dapatkan estimasi biaya secara otomatis.
                                </p>
                                
                                <Link
                                    href={route('itineraries.create')}
                                    className="inline-flex items-center gap-3 px-6 py-3.5 bg-main text-button font-semibold rounded-xl hover:bg-secondary transition-colors shadow-lg shadow-headline/20"
                                >
                                    <SparklesIcon className="w-5 h-5" />
                                    Buat Rencana Baru
                                    <ArrowRightIcon className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Right Content - Stats Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-main/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                                    <p className="text-3xl font-bold">{stats.total_itineraries}</p>
                                    <p className="text-secondary text-sm">Rencana</p>
                                </div>
                                <div className="bg-main/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                                    <p className="text-3xl font-bold">{stats.upcoming_trips}</p>
                                    <p className="text-secondary text-sm">Akan Datang</p>
                                </div>
                                <div className="bg-main/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                                    <p className="text-3xl font-bold">{stats.total_destinations}</p>
                                    <p className="text-secondary text-sm">Destinasi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        <Link
                            href={route('itineraries.create')}
                            className="flex flex-col items-center gap-3 p-5 bg-main rounded-2xl border border-secondary shadow-sm hover:shadow-md hover:border-button/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-button group-hover:text-button-text transition-colors">
                                <PlusIcon className="w-6 h-6 text-button group-hover:text-button-text" />
                            </div>
                            <span className="font-medium text-headline text-sm">Buat Baru</span>
                        </Link>

                        <Link
                            href={route('itineraries.index')}
                            className="flex flex-col items-center gap-3 p-5 bg-main rounded-2xl border border-secondary shadow-sm hover:shadow-md hover:border-button/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-button transition-colors">
                                <CalendarDaysIcon className="w-6 h-6 text-button group-hover:text-button-text" />
                            </div>
                            <span className="font-medium text-headline text-sm">Lihat Semua</span>
                        </Link>

                        <a
                            href="#explore"
                            className="flex flex-col items-center gap-3 p-5 bg-main rounded-2xl border border-secondary shadow-sm hover:shadow-md hover:border-button/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-highlight transition-colors">
                                <MapPinIcon className="w-6 h-6 text-highlight group-hover:text-button-text" />
                            </div>
                            <span className="font-medium text-headline text-sm">Jelajahi</span>
                        </a>

                        <a
                            href="#tips"
                            className="flex flex-col items-center gap-3 p-5 bg-main rounded-2xl border border-secondary shadow-sm hover:shadow-md hover:border-button/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-tertiary/20 rounded-xl flex items-center justify-center group-hover:bg-tertiary transition-colors">
                                <span className="text-xl">💡</span>
                            </div>
                            <span className="font-medium text-headline text-sm">Tips Travel</span>
                        </a>
                    </div>

                    {/* Recent Itineraries */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-headline">Rencana Terbaru</h2>
                            <Link
                                href={route('itineraries.index')}
                                className="text-sm text-button hover:underline flex items-center gap-1"
                            >
                                Lihat Semua
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>

                        {isLoading ? (
                            /* Skeleton Loader */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-main rounded-2xl border border-secondary overflow-hidden animate-pulse">
                                        <div className="h-24 bg-secondary" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-5 bg-secondary rounded w-3/4" />
                                            <div className="h-4 bg-secondary/50 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentItineraries.length === 0 ? (
                            /* Empty State */
                            <div className="text-center py-12 bg-main rounded-2xl border border-secondary">
                                <div className="w-20 h-20 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                                    <span className="text-4xl">🗺️</span>
                                </div>
                                <h3 className="font-semibold text-headline mb-2">Belum ada rencana</h3>
                                <p className="text-paragraph mb-6">Mulai petualanganmu sekarang!</p>
                                <Link
                                    href={route('itineraries.create')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-button text-button-text font-medium rounded-xl hover:bg-button/90 transition-colors"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Buat Rencana
                                </Link>
                            </div>
                        ) : (
                            /* Itinerary Cards */
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recentItineraries.map((itinerary) => (
                                    <Link
                                        key={itinerary.id}
                                        href={route('itineraries.show', itinerary.id)}
                                        className="bg-main rounded-2xl border border-secondary overflow-hidden hover:shadow-lg hover:border-button/20 transition-all group"
                                    >
                                        {/* Card Header */}
                                        <div className="h-20 bg-button relative">
                                            <div className="absolute bottom-2 left-3">
                                                <span className="px-2 py-0.5 bg-main/20 backdrop-blur-sm text-button-text text-xs rounded-full">
                                                    {itinerary.city?.name || 'Bandung'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-headline group-hover:text-button transition-colors truncate mb-2">
                                                {itinerary.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-paragraph">
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
                        <h2 className="text-xl font-semibold text-headline mb-6">Zona Populer di Bandung</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { name: 'Lembang', emoji: '🌿', color: 'from-button to-highlight', desc: 'Alam & Kebun' },
                                { name: 'Ciwidey', emoji: '🌋', color: 'from-highlight to-button', desc: 'Kawah & Danau' },
                                { name: 'Dago', emoji: '🏙️', color: 'from-tertiary to-button', desc: 'Kuliner & Kafe' },
                                { name: 'Kota', emoji: '🛍️', color: 'from-button to-tertiary', desc: 'Belanja & Sejarah' },
                            ].map((zone) => (
                                <div
                                    key={zone.name}
                                    className="relative overflow-hidden rounded-2xl h-32 cursor-pointer group"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${zone.color}`} />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                    <div className="relative h-full flex flex-col items-center justify-center text-button-text">
                                        <span className="text-3xl mb-1">{zone.emoji}</span>
                                        <h3 className="font-bold">{zone.name}</h3>
                                        <p className="text-xs text-button-text/80">{zone.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tips Section */}
                    <section id="tips" className="bg-gradient-to-br from-secondary to-background rounded-2xl p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-headline mb-4">💡 Tips Hemat Perjalanan</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-main rounded-xl p-4 shadow-sm">
                                <span className="text-2xl">🗓️</span>
                                <h3 className="font-medium text-headline mt-2 mb-1">Pilih Hari Weekday</h3>
                                <p className="text-sm text-paragraph">Harga tiket dan penginapan biasanya lebih murah di hari kerja.</p>
                            </div>
                            <div className="bg-main rounded-xl p-4 shadow-sm">
                                <span className="text-2xl">📍</span>
                                <h3 className="font-medium text-headline mt-2 mb-1">Kelompokkan per Zona</h3>
                                <p className="text-sm text-paragraph">Kunjungi destinasi di zona yang sama untuk hemat transportasi.</p>
                            </div>
                            <div className="bg-main rounded-xl p-4 shadow-sm">
                                <span className="text-2xl">🎟️</span>
                                <h3 className="font-medium text-headline mt-2 mb-1">Beli Tiket Online</h3>
                                <p className="text-sm text-paragraph">Beberapa tempat wisata menawarkan diskon untuk pembelian online.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
