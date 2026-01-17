import { Head, Link } from '@inertiajs/react';
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Smart Trip Planner - Bandung Tourism" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header / Navbar */}
                <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <MapPinIcon className="h-8 w-8 text-blue-600" />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Smart Trip Planner</h1>
                                    <p className="text-xs text-gray-500">Bandung Tourism</p>
                                </div>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-2.5 text-gray-700 hover:text-blue-600 transition font-medium"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
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
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                    ✨ Smart Itinerary Planning
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Rencanakan Liburan ke{' '}
                                <span className="text-blue-600">Bandung</span>{' '}
                                Lebih Mudah!
                            </h2>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                Sistem pintar yang mengelompokkan destinasi berdasarkan zona,
                                menghitung estimasi biaya transportasi, dan membantu Anda
                                merencanakan itinerary yang efisien.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl text-center"
                                >
                                    Mulai Rencanakan Trip
                                </Link>
                                <a
                                    href="#features"
                                    className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold shadow-md hover:shadow-lg text-center border border-gray-200"
                                >
                                    Lihat Fitur
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1555400038-63f526cd00cb?w=800&h=800&fit=crop"
                                    alt="Bandung Tourism"
                                    className="w-full h-full object-cover opacity-90"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Destinasi</p>
                                <p className="text-3xl font-bold text-blue-600">50+</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-white py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Fitur Unggulan
                            </h3>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Sistem pintar yang membantu Anda merencanakan liburan dengan lebih efisien
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <MapPinIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Smart Grouping</h4>
                                <p className="text-gray-600">
                                    Destinasi otomatis dikelompokkan berdasarkan zona (Lembang, Ciwidey, dll)
                                    untuk meminimalkan waktu perjalanan.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <div className="bg-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <CurrencyDollarIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Budget Transparan</h4>
                                <p className="text-gray-600">
                                    Estimasi biaya lengkap: tiket masuk, transportasi (Gojek/Grab),
                                    hingga biaya makan.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <div className="bg-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <CalendarIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop</h4>
                                <p className="text-gray-600">
                                    Atur ulang itinerary dengan drag & drop.
                                    Sistem otomatis recalculate jarak dan biaya!
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <div className="bg-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                    <SparklesIcon className="h-7 w-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Rekomendasi Pintar</h4>
                                <p className="text-gray-600">
                                    Algoritma Nearest Neighbor untuk menyusun rute paling efisien
                                    tanpa bolak-balik.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Siap Merencanakan Trip Anda?
                        </h3>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Bergabung sekarang dan nikmati kemudahan merencanakan liburan ke Bandung
                            dengan sistem yang cerdas dan efisien.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg hover:shadow-xl text-lg"
                        >
                            Daftar Gratis Sekarang →
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm">
                            © 2026 Smart Trip Planner - Bandung Tourism. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Made with ❤️ for Bandung travelers
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
