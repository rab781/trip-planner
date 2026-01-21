import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ auth, stats }) {
    const statCards = [
        {
            name: 'Total Pengguna',
            value: stats?.total_users || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'blue',
            href: route('admin.users.index'),
        },
        {
            name: 'Total Itinerary',
            value: stats?.total_itineraries || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            color: 'green',
            href: null,
        },
        {
            name: 'Total Destinasi',
            value: stats?.total_destinations || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'purple',
            href: route('admin.destinations.index'),
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-secondary text-button',
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Welcome */}
                <div className="bg-gradient-to-r from-button to-highlight rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold">Selamat Datang, {auth?.user?.name || 'Admin'}!</h1>
                    <p className="mt-1 text-button-text/80">
                        Kelola destinasi, pengguna, dan pantau aktivitas trip planner.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat) => (
                        <div
                            key={stat.name}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {(stat.value || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            {stat.href && (
                                <Link
                                    href={stat.href}
                                    className="mt-4 text-sm text-button hover:underline inline-block"
                                >
                                    Lihat detail →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Pengguna Terbaru</h2>
                        <Link
                            href={route('admin.users.index')}
                            className="text-sm text-button hover:underline"
                        >
                            Lihat semua
                        </Link>
                    </div>
                    {stats?.recent_users?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                            Bergabung
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {stats.recent_users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    user.role === 'admin'
                                                        ? 'bg-secondary text-button'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Belum ada pengguna</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href={route('admin.destinations.create')}
                            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-button hover:bg-secondary transition"
                        >
                            <svg className="w-8 h-8 text-button mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-sm text-gray-700">Tambah Destinasi</span>
                        </Link>
                        <Link
                            href={route('admin.categories.create')}
                            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-button hover:bg-secondary transition"
                        >
                            <svg className="w-8 h-8 text-button mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-sm text-gray-700">Tambah Kategori</span>
                        </Link>
                        <Link
                            href={route('admin.zones.create')}
                            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-button hover:bg-secondary transition"
                        >
                            <svg className="w-8 h-8 text-button mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="text-sm text-gray-700">Tambah Zona</span>
                        </Link>
                        <Link
                            href={route('admin.reports')}
                            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-button hover:bg-secondary transition"
                        >
                            <svg className="w-8 h-8 text-button mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm text-gray-700">Lihat Laporan</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
