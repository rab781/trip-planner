import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ destination }) {
    return (
        <AdminLayout>
            <Head title={destination.name} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('admin.destinations.index')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{destination.name}</h1>
                            <p className="text-gray-600">{destination.zone?.name} • {destination.category?.name}</p>
                        </div>
                        <Link
                            href={route('admin.destinations.edit', destination.id)}
                            className="inline-flex items-center px-4 py-2 bg-button text-button-text rounded-lg hover:bg-button/90 transition"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Main Info */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {destination.thumbnail_url && (
                            <img
                                src={destination.thumbnail_url}
                                alt={destination.name}
                                className="w-full h-64 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi</h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm text-gray-500">Alamat</dt>
                                    <dd className="text-gray-900">{destination.address}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Koordinat</dt>
                                    <dd className="text-gray-900">{destination.latitude}, {destination.longitude}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Zona</dt>
                                    <dd className="text-gray-900">{destination.zone?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Kategori</dt>
                                    <dd>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-button">
                                            {destination.category?.name}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                            {destination.description && (
                                <div className="mt-4">
                                    <dt className="text-sm text-gray-500 mb-1">Deskripsi</dt>
                                    <dd className="text-gray-900">{destination.description}</dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ticket Variants */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Varian Tiket ({destination.ticket_variants?.length || 0})
                        </h2>
                        {destination.ticket_variants?.length > 0 ? (
                            <div className="space-y-3">
                                {destination.ticket_variants.map((variant) => (
                                    <div key={variant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{variant.name}</p>
                                            {variant.description && (
                                                <p className="text-sm text-gray-500">{variant.description}</p>
                                            )}
                                        </div>
                                        <span className="text-lg font-semibold text-button">
                                            Rp {Number(variant.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada varian tiket</p>
                        )}
                    </div>

                    {/* Map Preview */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lokasi</h2>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${destination.longitude - 0.01}%2C${destination.latitude - 0.01}%2C${destination.longitude + 0.01}%2C${destination.latitude + 0.01}&layer=mapnik&marker=${destination.latitude}%2C${destination.longitude}`}
                                className="w-full h-full border-0"
                                title="Location Map"
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <a
                                href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-button hover:underline text-sm"
                            >
                                Buka di Google Maps →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
