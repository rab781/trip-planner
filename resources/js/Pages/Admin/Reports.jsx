import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Reports({ data }) {
    return (
        <AdminLayout>
            <Head title="Laporan" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
                    <p className="text-gray-600">Statistik dan analisis penggunaan Trip Planner</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Users Last Month */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengguna Aktif</h2>
                        <div className="text-center py-8">
                            <p className="text-5xl font-bold text-button">
                                {data?.active_users_last_month || 0}
                            </p>
                            <p className="text-gray-500 mt-2">pengguna aktif bulan ini</p>
                        </div>
                    </div>

                    {/* Top Users */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Pengguna</h2>
                        {data?.users_with_most_itineraries?.length > 0 ? (
                            <div className="space-y-3">
                                {data.users_with_most_itineraries.map((user, index) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-50 text-gray-500'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-900">{user.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {user.itineraries_count} trip
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada data</p>
                        )}
                    </div>

                    {/* Popular Destinations */}
                    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Destinasi Terpopuler</h2>
                        {data?.popular_destinations?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {data.popular_destinations.map((item, index) => (
                                    <div key={item.destination_id} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold ${
                                            index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-500' :
                                            'bg-gray-300'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <p className="font-medium text-gray-900 text-sm truncate">
                                            {item.destination?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.total} kunjungan
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Belum ada data destinasi populer</p>
                        )}
                    </div>

                    {/* Destinations with Itineraries Count */}
                    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinerary per Destinasi</h2>
                        {data?.itineraries_per_destination?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Destinasi
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Jumlah Itinerary
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Popularitas
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.itineraries_per_destination
                                            .sort((a, b) => b.itineraries_count - a.itineraries_count)
                                            .slice(0, 10)
                                            .map((dest) => {
                                                const maxCount = Math.max(...data.itineraries_per_destination.map(d => d.itineraries_count));
                                                const percentage = maxCount > 0 ? (dest.itineraries_count / maxCount) * 100 : 0;
                                                
                                                return (
                                                    <tr key={dest.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {dest.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {dest.itineraries_count}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-button h-2 rounded-full"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Belum ada data</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
