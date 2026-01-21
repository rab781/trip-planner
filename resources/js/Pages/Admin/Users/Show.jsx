import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ user }) {
    return (
        <AdminLayout>
            <Head title={`User: ${user.name}`} />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start space-x-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-button to-highlight flex items-center justify-center text-white text-2xl font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.role === 'admin'
                                            ? 'bg-secondary text-button'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                    </span>
                                </div>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Bergabung sejak {new Date(user.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <p className="text-3xl font-bold text-button">{user.itineraries_count || 0}</p>
                            <p className="text-gray-600">Total Itinerary</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <p className="text-3xl font-bold text-green-600">
                                {user.itineraries?.filter(i => i.status === 'completed').length || 0}
                            </p>
                            <p className="text-gray-600">Trip Selesai</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <p className="text-3xl font-bold text-blue-600">
                                {user.itineraries?.filter(i => i.status === 'draft').length || 0}
                            </p>
                            <p className="text-gray-600">Draft</p>
                        </div>
                    </div>

                    {/* Recent Itineraries */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinerary Terbaru</h2>
                        {user.itineraries?.length > 0 ? (
                            <div className="space-y-3">
                                {user.itineraries.slice(0, 5).map((itinerary) => (
                                    <div key={itinerary.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{itinerary.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(itinerary.start_date).toLocaleDateString('id-ID')} - 
                                                {new Date(itinerary.end_date).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            itinerary.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : itinerary.status === 'active'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {itinerary.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Belum ada itinerary</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
