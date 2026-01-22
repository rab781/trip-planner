import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Chatbot from '@/Components/Chatbot';
import { ThemeToggle } from '@/Components/UI/ThemeToggle';
import { useThemeContext } from '@/Contexts/ThemeContext';
import { CompassIcon, MapPinIcon, CalendarIcon, WalletIcon, SparklesIcon, RouteIcon } from '@/Components/Icons/TravelIcons';
import HeroIllustration from '@/Components/Illustrations/HeroIllustration';
import { FloatingClouds, FloatingPlane, FloatingParticles } from '@/Components/Illustrations/FloatingElements';
import { useRevealOnScroll, useStaggeredReveal } from '@/Hooks/useIntersectionObserver';

export default function Welcome({ auth }) {
    const cities = ['Bandung','Surabaya','Yogyakarta','Jakarta','Medan','Semarang','Malang','Bali'];
    const [currentCityIndex, setCurrentCityIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { isDark } = useThemeContext();

    // Scroll reveal hooks
    const heroReveal = useRevealOnScroll({ animation: 'fade-up', delay: 100 });
    const featuresReveal = useStaggeredReveal({ staggerDelay: 150, itemCount: 4 });
    const ctaReveal = useRevealOnScroll({ animation: 'scale', delay: 0 });

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
            description: 'Destinasi otomatis dikelompokkan berdasarkan zona (Lembang, Ciwidey, dll) untuk meminimalkan waktu perjalanan.',
            gradient: 'from-teal-500/10 to-teal-500/20 dark:from-teal-500/20 dark:to-teal-500/30',
            iconBg: 'bg-teal-500',
            border: 'border-teal-500/20',
        },
        {
            icon: WalletIcon,
            title: 'Budget Transparan',
            description: 'Estimasi biaya lengkap: tiket masuk, transportasi (Gojek/Grab), hingga biaya makan.',
            gradient: 'from-coral-500/10 to-coral-500/20 dark:from-coral-500/20 dark:to-coral-500/30',
            iconBg: 'bg-coral-500',
            border: 'border-coral-500/20',
        },
        {
            icon: CalendarIcon,
            title: 'Drag & Drop',
            description: 'Atur ulang itinerary dengan drag & drop. Sistem otomatis recalculate jarak dan biaya!',
            gradient: 'from-amber-500/10 to-amber-500/20 dark:from-amber-500/20 dark:to-amber-500/30',
            iconBg: 'bg-amber-500',
            border: 'border-amber-500/20',
        },
        {
            icon: RouteIcon,
            title: 'Rekomendasi Pintar',
            description: 'Algoritma Nearest Neighbor untuk menyusun rute paling efisien tanpa bolak-balik.',
            gradient: 'from-indigo-500/10 to-indigo-500/20 dark:from-indigo-500/20 dark:to-indigo-500/30',
            iconBg: 'bg-indigo-500',
            border: 'border-indigo-500/20',
        },
    ];

    return (
        <>
            <Head title="Serute - Smart Trip Planner Bandung" />

            <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300 overflow-hidden">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <FloatingClouds />
                    <FloatingPlane />
                    <FloatingParticles />
                </div>

                {/* Header / Navbar */}
                <header className="bg-main/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-secondary dark:border-gray-700 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <button onClick={() => window.location.href = '/'}>
                                    <img src="/images/logo.png" alt="Serute Logo" className="h-20 w-40 dark:brightness-110" />
                                </button>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {/* Theme Toggle */}
                                <ThemeToggle size="sm" />

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-teal-500/25"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-2.5 text-paragraph dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition font-medium"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-teal-500/25"
                                        >
                                            Daftar Gratis
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
                    <div 
                        ref={heroReveal.ref}
                        className={`grid md:grid-cols-2 gap-12 items-center ${heroReveal.className}`}
                        style={heroReveal.style}
                    >
                        <div className="space-y-6">
                            <div className="inline-block animate-fade-in">
                                <span className="px-4 py-1.5 bg-gradient-to-r from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                                    <SparklesIcon className="w-4 h-4" />
                                    Smart Itinerary Planning
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-headline dark:text-white leading-tight">
                                Rencanakan Liburan ke{' '}
                                <span
                                    className={`bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent transition-all duration-300 ${
                                        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                    }`}
                                >
                                    {cities[currentCityIndex]}
                                </span>{' '}
                                Lebih Mudah dengan Serute
                            </h2>

                            <p className="text-lg text-paragraph dark:text-gray-300 leading-relaxed">
                                Sistem pintar yang mengelompokkan destinasi berdasarkan zona,
                                menghitung estimasi biaya transportasi, dan membantu Anda
                                merencanakan itinerary yang efisien.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:shadow-teal-500/25 text-center flex items-center justify-center gap-2"
                                >
                                    <CompassIcon className="w-5 h-5 group-hover:animate-spin-slow" />
                                    Mulai Rencanakan Trip
                                </Link>
                                <a
                                    href="#features"
                                    className="px-8 py-4 bg-white dark:bg-gray-800 text-headline dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-center border border-gray-200 dark:border-gray-600"
                                >
                                    Lihat Fitur
                                </a>
                            </div>
                        </div>

                        {/* Hero Illustration */}
                        <div className="relative">
                            <div className="w-full max-w-lg mx-auto animate-float">
                                <HeroIllustration />
                            </div>
                            
                            {/* Stats Card */}
                            <div className="absolute -bottom-4 -right-4 md:right-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                                <p className="text-sm text-paragraph dark:text-gray-400 mb-1">Total Destinasi</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">50+</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-20 md:py-24 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold text-headline dark:text-white mb-4">
                                Fitur Unggulan
                            </h3>
                            <p className="text-lg text-paragraph dark:text-gray-300 max-w-2xl mx-auto">
                                Sistem pintar yang membantu Anda merencanakan liburan dengan lebih efisien
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
                                        className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border ${feature.border} hover:-translate-y-1 group ${itemProps.className}`}
                                        style={itemProps.style}
                                    >
                                        <div className={`${feature.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <h4 className="text-xl font-bold text-headline dark:text-white mb-2">{feature.title}</h4>
                                        <p className="text-paragraph dark:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div 
                        ref={ctaReveal.ref}
                        className={`relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 dark:from-teal-600 dark:via-teal-700 dark:to-teal-800 rounded-3xl shadow-2xl shadow-teal-500/25 p-8 md:p-12 text-center ${ctaReveal.className}`}
                        style={ctaReveal.style}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Siap Merencanakan Trip Anda?
                            </h3>
                            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                                Bergabung sekarang dan nikmati kemudahan merencanakan liburan ke Bandung
                                dengan sistem yang cerdas dan efisien.
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-teal-600 hover:bg-gray-100 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-lg rounded-xl group"
                            >
                                <CompassIcon className="w-5 h-5 group-hover:animate-spin-slow" />
                                Daftar Gratis Sekarang
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 bg-gray-900 dark:bg-gray-950 text-gray-300 py-8 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm">
                            © 2026 Serute - Smart Trip Planner Bandung. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Made with ❤️ for Bandung travelers
                        </p>
                    </div>
                </footer>

                {/* AI Chatbot */}
                <Chatbot />
            </div>
        </>
    );
}
