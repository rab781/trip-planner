import { Head, Link } from '@inertiajs/react';
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Chatbot from '@/Components/Chatbot';

export default function Welcome({ auth }) {
    const cities = ['Bandung','Surabaya','Yogyakarta','Jakarta','Medan','Semarang','Malang','Bali'];
    const [currentCityIndex, setCurrentCityIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length);
                setIsAnimating(false);
            }, 500); // Duration of the fade-out animation
        }, 3000); // Change city every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Serute - Smart Trip Planner Bandung" />

            <div className="min-h-screen bg-serute-light">
                {/* Header / Navbar */}
                <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-serute-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <button onClick={() => window.location.href = '/'}>
                                <img src="/images/logo.png" alt="Serute Logo" className="h-20 w-40 "/>
                                </button>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 bg-gradient-to-r from-serute-purple to-serute-blue text-white rounded-lg hover:opacity-90 transition font-medium shadow-md hover:shadow-lg"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-2.5 text-serute-body hover:text-serute-purple transition font-medium"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-gradient-to-r from-serute-purple to-serute-blue text-white rounded-lg hover:opacity-90 transition font-medium shadow-md hover:shadow-lg"
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
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 ">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                    Smart Itinerary Planning
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Rencanakan Liburan ke{' '}
                                <span
                                    className={`bg-gradient-to-r from-serute-purple to-serute-blue bg-clip-text text-transparent transition-all duration-300 ${
                                        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                    }`}
                                >
                                    {cities[currentCityIndex]}
                                </span>{' '}
                                Lebih Mudah dengan Serute
                            </h2>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                Sistem pintar yang mengelompokkan destinasi berdasarkan zona,
                                menghitung estimasi biaya transportasi, dan membantu Anda
                                merencanakan itinerary yang efisien.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="px-8 py-4 bg-gradient-to-r from-serute-purple to-serute-blue text-white rounded-lg hover:opacity-90 transition font-semibold shadow-lg hover:shadow-xl text-center"
                                >
                                    Mulai Rencanakan Trip
                                </Link>
                                <a
                                    href="#features"
                                    className="px-8 py-4 bg-white text-serute-dark rounded-lg hover:bg-serute-light transition font-semibold shadow-md hover:shadow-lg text-center border-2 border-serute-purple/20"
                                >
                                    Lihat Fitur
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-serute-blue to-serute-purple shadow-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1555400038-63f526cd00cb?w=800&h=800&fit=crop"
                                    alt="Bandung Tourism"
                                    className="w-full h-full object-cover opacity-90"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-2 border-serute-purple/20">
                                <p className="text-sm text-serute-body mb-1">Total Destinasi</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-serute-purple to-serute-blue bg-clip-text text-transparent">50+</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-white py-20 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold text-serute-dark mb-4">
                                Fitur Unggulan
                            </h3>
                            <p className="text-lg text-serute-body max-w-2xl mx-auto">
                                Sistem pintar yang membantu Anda merencanakan liburan dengan lebih efisien
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-gradient-to-br from-serute-purple/10 to-serute-purple/20 p-6 rounded-xl shadow-md hover:shadow-lg transition border border-serute-purple/20">
                                <div className="bg-gradient-to-r from-serute-purple to-serute-blue w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <MapPinIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-serute-dark mb-2">Smart Grouping</h4>
                                <p className="text-serute-body">
                                    Destinasi otomatis dikelompokkan berdasarkan zona (Lembang, Ciwidey, dll)
                                    untuk meminimalkan waktu perjalanan.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-serute-blue/10 to-serute-blue/20 p-6 rounded-xl shadow-md hover:shadow-lg transition border border-serute-blue/20">
                                <div className="bg-serute-blue w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <CurrencyDollarIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-serute-dark mb-2">Budget Transparan</h4>
                                <p className="text-serute-body">
                                    Estimasi biaya lengkap: tiket masuk, transportasi (Gojek/Grab),
                                    hingga biaya makan.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-serute-teal/10 to-serute-teal/20 p-6 rounded-xl shadow-md hover:shadow-lg transition border border-serute-teal/20">
                                <div className="bg-serute-teal w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <CalendarIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-serute-dark mb-2">Drag & Drop</h4>
                                <p className="text-serute-body">
                                    Atur ulang itinerary dengan drag & drop.
                                    Sistem otomatis recalculate jarak dan biaya!
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-serute-orange/10 to-serute-orange/20 p-6 rounded-xl shadow-md hover:shadow-lg transition border border-serute-orange/20">
                                <div className="bg-serute-orange w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <SparklesIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-serute-dark mb-2">Rekomendasi Pintar</h4>
                                <p className="text-serute-body">
                                    Algoritma Nearest Neighbor untuk menyusun rute paling efisien
                                    tanpa bolak-balik.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="bg-gradient-to-r from-serute-purple to-serute-blue rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Siap Merencanakan Trip Anda?
                        </h3>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            Bergabung sekarang dan nikmati kemudahan merencanakan liburan ke Bandung
                            dengan sistem yang cerdas dan efisien.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block px-10 py-4 bg-white text-serute-purple hover:bg-serute-light transition font-bold shadow-lg hover:shadow-xl text-lg rounded-lg"
                        >
                            Daftar Gratis Sekarang →
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-serute-dark text-gray-300 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm">
                            © 2026 Serute - Smart Trip Planner Bandung. All rights reserved.
                        </p>
                        <p className="text-xs text-serute-body/60 mt-2">
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
