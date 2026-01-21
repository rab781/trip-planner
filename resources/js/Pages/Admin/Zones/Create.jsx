import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ cities }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        city_id: '',
        center_latitude: '',
        center_longitude: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.zones.store'));
    };

    return (
        <AdminLayout>
            <Head title="Tambah Zona" />

            <div className="max-w-2xl mx-auto">
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
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Zona Baru</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Zona *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button focus:border-transparent ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Contoh: Bandung Utara"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kota *
                                </label>
                                <select
                                    value={data.city_id}
                                    onChange={(e) => setData('city_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                        errors.city_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Kota</option>
                                    {cities?.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.city_id && <p className="mt-1 text-sm text-red-500">{errors.city_id}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent"
                                    placeholder="Deskripsi singkat tentang zona ini..."
                                />
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Center Latitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.center_latitude}
                                        onChange={(e) => setData('center_latitude', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                            errors.center_latitude ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="-6.8500"
                                    />
                                    {errors.center_latitude && <p className="mt-1 text-sm text-red-500">{errors.center_latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Center Longitude
                                    </label>
                                    <input
                                        type="text"
                                        value={data.center_longitude}
                                        onChange={(e) => setData('center_longitude', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                            errors.center_longitude ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="107.6200"
                                    />
                                    {errors.center_longitude && <p className="mt-1 text-sm text-red-500">{errors.center_longitude}</p>}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                Koordinat pusat zona (opsional). Digunakan untuk centering map.
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={route('admin.zones.index')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-button text-button-text rounded-lg hover:bg-button/90 transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Zona'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
