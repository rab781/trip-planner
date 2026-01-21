import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ zones, cities, filters }) {
    const { flash } = usePage().props;

    const handleFilter = (cityId) => {
        router.get(route('admin.zones.index'), { city_id: cityId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name, destinationsCount) => {
        if (destinationsCount > 0) {
            alert(`Zona "${name}" tidak dapat dihapus karena masih memiliki ${destinationsCount} destinasi`);
            return;
        }
        if (confirm(`Yakin ingin menghapus zona "${name}"?`)) {
            router.delete(route('admin.zones.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Zona" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Zona</h1>
                        <p className="text-gray-600">Kelola zona/wilayah destinasi wisata</p>
                    </div>
                    <Link
                        href={route('admin.zones.create')}
                        className="inline-flex items-center px-4 py-2 bg-button text-button-text rounded-lg hover:bg-button/90 transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Zona
                    </Link>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {flash.error}
                    </div>
                )}

                {/* Filter by City */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Filter Kota:</span>
                        <select
                            value={filters?.city_id || ''}
                            onChange={(e) => handleFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button"
                        >
                            <option value="">Semua Kota</option>
                            {cities?.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Zona
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Koordinat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destinasi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {zones?.data?.length > 0 ? (
                                    zones.data.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{zone.name}</p>
                                                    {zone.description && (
                                                        <p className="text-sm text-gray-500 truncate max-w-xs">
                                                            {zone.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {zone.city?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {zone.center_latitude && zone.center_longitude ? (
                                                    <span className="font-mono text-xs">
                                                        {Number(zone.center_latitude).toFixed(4)}, {Number(zone.center_longitude).toFixed(4)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {zone.destinations_count || 0} destinasi
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route('admin.zones.show', zone.id)}
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Lihat"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.zones.edit', zone.id)}
                                                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(zone.id, zone.name, zone.destinations_count)}
                                                        className={`p-2 rounded-lg transition ${
                                                            zone.destinations_count > 0
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                                        }`}
                                                        title={zone.destinations_count > 0 ? 'Tidak dapat dihapus' : 'Hapus'}
                                                        disabled={zone.destinations_count > 0}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p>Belum ada zona</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {zones?.links && zones.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Menampilkan {zones.from} - {zones.to} dari {zones.total} zona
                                </p>
                                <div className="flex space-x-2">
                                    {zones.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-button text-button-text'
                                                    : link.url
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
