import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ zone }) {
    return (
        <AdminLayout>
            <Head title={zone.name} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('admin.zones.index')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{zone.name}</h1>
                            <p className="text-gray-600">{zone.city?.name}</p>
                        </div>
                        <Link
                            href={route('admin.zones.edit', zone.id)}
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
                    {/* Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Zona</h2>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-gray-500">Nama</dt>
                                <dd className="text-gray-900 font-medium">{zone.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Kota</dt>
                                <dd className="text-gray-900">{zone.city?.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Jumlah Destinasi</dt>
                                <dd className="text-gray-900">{zone.destinations_count || 0} destinasi</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500">Koordinat Pusat</dt>
                                <dd className="text-gray-900 font-mono text-sm">
                                    {zone.center_latitude && zone.center_longitude
                                        ? `${zone.center_latitude}, ${zone.center_longitude}`
                                        : '-'}
                                </dd>
                            </div>
                        </dl>
                        {zone.description && (
                            <div className="mt-4">
                                <dt className="text-sm text-gray-500 mb-1">Deskripsi</dt>
                                <dd className="text-gray-900">{zone.description}</dd>
                            </div>
                        )}
                    </div>

                    {/* Map Preview */}
                    {zone.center_latitude && zone.center_longitude && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lokasi</h2>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <iframe
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${zone.center_longitude - 0.05}%2C${zone.center_latitude - 0.05}%2C${zone.center_longitude + 0.05}%2C${zone.center_latitude + 0.05}&layer=mapnik&marker=${zone.center_latitude}%2C${zone.center_longitude}`}
                                    className="w-full h-full border-0"
                                    title="Zone Map"
                                />
                            </div>
                        </div>
                    )}

                    {/* Destinations in Zone */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Destinasi di Zona Ini ({zone.destinations?.length || 0})
                        </h2>
                        {zone.destinations?.length > 0 ? (
                            <div className="space-y-3">
                                {zone.destinations.map((destination) => (
                                    <Link
                                        key={destination.id}
                                        href={route('admin.destinations.show', destination.id)}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{destination.name}</p>
                                            <p className="text-sm text-gray-500">{destination.category?.name}</p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada destinasi di zona ini</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
