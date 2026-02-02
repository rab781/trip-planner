import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Chatbot from '@/Components/Chatbot';
import { ThemeToggle } from '@/Components/UI/ThemeToggle';
import { useThemeContext } from '@/Contexts/ThemeContext';
import { CompassIcon, MapPinIcon, CalendarIcon, WalletIcon, SparklesIcon, RouteIcon } from '@/Components/Icons/TravelIcons';
import { useRevealOnScroll, useStaggeredReveal } from '@/Hooks/useIntersectionObserver';

export default function Welcome({ auth }) {
    const cities = ['Bandung', 'Surabaya', 'Yogyakarta', 'Jakarta', 'Medan', 'Semarang', 'Malang', 'Bali'];
    const [currentCityIndex, setCurrentCityIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { isDark } = useThemeContext();

    // Scroll reveal hooks
    const heroReveal = useRevealOnScroll({ animation: 'fade-in-up', delay: 100 });
    const featuresReveal = useStaggeredReveal({ staggerDelay: 150, itemCount: 4 });

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length);
                setIsAnimating(false);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: MapPinIcon,
            title: 'Smart Grouping',
            description: 'Destinasi otomatis dikelompokkan berdasarkan zona untuk meminimalkan waktu perjalanan.',
            gradient: 'from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-800/40',
            iconBg: 'bg-brand-500',
            border: 'border-brand-200 dark:border-brand-800',
        },
        {
            icon: WalletIcon,
            title: 'Budget Transparan',
            description: 'Estimasi biaya lengkap: tiket masuk, transportasi, hingga rekomendasi kuliner.',
            gradient: 'from-accent-50 to-accent-100 dark:from-accent-900/40 dark:to-accent-800/40',
            iconBg: 'bg-accent-500',
            border: 'border-accent-200 dark:border-accent-800',
        },
        {
            icon: CalendarIcon,
            title: 'Drag & Drop',
            description: 'Atur ulang itinerary dengan mudah. Sistem otomatis menghitung ulang rute terbaik.',
            gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40',
            iconBg: 'bg-blue-500',
            border: 'border-blue-200 dark:border-blue-800',
        },
        {
            icon: RouteIcon,
            title: 'Rute Tercerdas',
            description: 'Algoritma optimasi rute untuk memastikan Anda menghabiskan waktu di tempat wisata, bukan di jalan.',
            gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40',
            iconBg: 'bg-purple-500',
            border: 'border-purple-200 dark:border-purple-800',
        },
    ];

    return (
        <>
            <Head title="Serute - Smart Trip Planner Premium" />

            <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-background-dark' : 'bg-background-light'} overflow-hidden font-sans`}>

                {/* Navbar */}
                <header className="fixed w-full top-0 z-50 glass transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href = '/'}>
                                <div className="w-10 h-10 bg-gradient-brand-animated rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                                    <SparklesIcon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-display font-bold text-headline-light dark:text-headline-dark tracking-tight">
                                    Serute<span className="text-brand-600">.</span>
                                </span>
                            </div>

                            {/* Nav items */}
                            <nav className="flex items-center gap-4">
                                <ThemeToggle size="sm" />

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-300 shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route('login')}
                                            className="hidden sm:inline-flex text-sm font-semibold text-paragraph-light dark:text-paragraph-dark hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-300 shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
                                        >
                                            Mulai Sekarang
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden min-h-screen flex items-center">
                    {/* Video Background */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute min-w-full min-h-full object-cover opacity-40 dark:opacity-30 translate-[-50%, -50%]"
                        >
                            <source src="/videos/background-boot-animation.mov" type="video/quicktime" />
                            Your browser does not support the video tag.
                        </video>
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background-light/95 via-background-light/70 to-transparent dark:from-background-dark/95 dark:via-background-dark/70 dark:to-transparent"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <div
                            ref={heroReveal.ref}
                            className={`lg:grid lg:grid-cols-12 lg:gap-16 items-center ${heroReveal.className}`}
                            style={heroReveal.style}
                        >
                            {/* Left Content */}
                            <div className="lg:col-span-7 text-center lg:text-left space-y-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 text-sm font-medium animate-fade-in border border-brand-100 dark:border-brand-800">
                                    <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                                    #1 Smart Trip Planner di Indonesia
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-display font-bold text-headline-light dark:text-white leading-tight tracking-tight">
                                    Jelajahi <br />
                                    <span className="relative inline-block">
                                        <span className={`relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-500 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                                            {cities[currentCityIndex]}
                                        </span>
                                        <span className="absolute bottom-2 left-0 w-full h-3 bg-accent-200/50 dark:bg-accent-900/50 -rotate-2 -z-0 rounded-full"></span>
                                    </span>
                                    <br />
                                    Tanpa Pusing.
                                </h1>

                                <p className="text-xl text-paragraph-light dark:text-paragraph-dark leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Serute membantu Anda merencanakan liburan impian dengan algoritma cerdas.
                                    Hemat waktu, hemat budget, dan nikmati setiap momen perjalanan.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link
                                        href={route('register')}
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-brand-animated text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <CompassIcon className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
                                        Buat Itinerary Gratis
                                    </Link>
                                    <a
                                        href="#features"
                                        className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-surface-dark text-headline-light dark:text-headline-dark border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center shadow-md"
                                    >
                                        Pelajari Cara Kerja
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-80">
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-headline-light dark:text-white">50k+</p>
                                        <p className="text-sm text-paragraph-light dark:text-paragraph-dark">Pengguna</p>
                                    </div>
                                    <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-headline-light dark:text-white">100+</p>
                                        <p className="text-sm text-paragraph-light dark:text-paragraph-dark">Destinasi</p>
                                    </div>
                                    <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-headline-light dark:text-white">4.9/5</p>
                                        <p className="text-sm text-paragraph-light dark:text-paragraph-dark">Rating</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Empty to show video */}
                            <div className="hidden lg:block lg:col-span-5 relative h-full"></div>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section id="features" className="py-24 relative z-10 bg-background-light dark:bg-background-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-headline-light dark:text-white mb-4">
                                Kenapa Harus Pakai Serute?
                            </h2>
                            <p className="text-lg text-paragraph-light dark:text-paragraph-dark">
                                Teknologi kami bekerja di belakang layar agar Anda bisa menikmati perjalanan di depan mata.
                            </p>
                        </div>

                        <div
                            ref={featuresReveal.containerRef}
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {features.map((feature, index) => {
                                const itemProps = featuresReveal.getItemProps(index);
                                const IconComponent = feature.icon;

                                return (
                                    <div
                                        key={index}
                                        ref={itemProps.ref}
                                        className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border ${feature.border} group hover:-translate-y-2 ${itemProps.className}`}
                                        style={itemProps.style}
                                    >
                                        <div className={`${feature.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200/50 dark:shadow-none group-hover:scale-110 transition-transform duration-500`}>
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-headline-light dark:text-white mb-3">{feature.title}</h3>
                                        <p className="text-sm leading-relaxed text-paragraph-light dark:text-paragraph-dark opacity-90">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-900 rounded-t-[3rem] mx-4 sm:mx-8 lg:mx-16">
                        {/* Subtle Pattern Overlay (using CSS gradient instead of missing image) */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 tracking-tight">
                            Mulai Petualangan Anda, <br />
                            <span className="text-accent-400">Gratis Hari Ini.</span>
                        </h2>
                        <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
                            Bergabunglah dengan ribuan traveler yang telah menemukan cara termudah menjelajahi Indonesia.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={route('register')}
                                className="px-10 py-5 bg-white text-brand-700 hover:bg-gray-50 rounded-2xl font-bold text-lg shadow-xl shadow-brand-900/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-background-light dark:bg-background-dark py-12 border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-headline-light dark:text-headline-dark font-display font-bold text-xl mb-4">Serute<span className="text-brand-600">.</span></p>
                        <p className="text-sm text-paragraph-light dark:text-paragraph-dark">
                            &copy; 2026 Serute - Smart Trip Planner. Made with ❤️ in Bandung.
                        </p>
                    </div>
                </footer>

                {/* Chatbot */}
                <Chatbot />
            </div>
        </>
    );
}
