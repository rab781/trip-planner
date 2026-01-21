import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ destination, zones, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: destination.name || '',
        description: destination.description || '',
        address: destination.address || '',
        latitude: destination.latitude || '',
        longitude: destination.longitude || '',
        zone_id: destination.zone_id || '',
        category_id: destination.category_id || '',
        thumbnail: null,
        ticket_variants: destination.ticket_variants?.length > 0
            ? destination.ticket_variants.map(v => ({
                id: v.id,
                name: v.name,
                price: v.price,
                description: v.description || ''
            }))
            : [{ name: 'Tiket Masuk', price: '', description: '' }],
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(destination.thumbnail_url || null);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail', file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const addTicketVariant = () => {
        setData('ticket_variants', [
            ...data.ticket_variants,
            { name: '', price: '', description: '' }
        ]);
    };

    const removeTicketVariant = (index) => {
        setData('ticket_variants', data.ticket_variants.filter((_, i) => i !== index));
    };

    const updateTicketVariant = (index, field, value) => {
        const updated = [...data.ticket_variants];
        updated[index][field] = value;
        setData('ticket_variants', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.destinations.update', destination.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${destination.name}`} />

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
                    <h1 className="text-2xl font-bold text-gray-900">Edit Destinasi</h1>
                    <p className="text-gray-600">{destination.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Destinasi *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button focus:border-transparent ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Zona *
                                </label>
                                <select
                                    value={data.zone_id}
                                    onChange={(e) => setData('zone_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                        errors.zone_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Zona</option>
                                    {zones?.map(zone => (
                                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                                    ))}
                                </select>
                                {errors.zone_id && <p className="mt-1 text-sm text-red-500">{errors.zone_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                        errors.category_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat *
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude *
                                </label>
                                <input
                                    type="text"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                        errors.latitude ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude *
                                </label>
                                <input
                                    type="text"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-button ${
                                        errors.longitude ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gambar</h2>

                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block">
                                    <span className="sr-only">Pilih gambar baru</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-button file:text-white hover:file:bg-button/90"
                                    />
                                </label>
                                <p className="mt-2 text-sm text-gray-500">
                                    Kosongkan jika tidak ingin mengubah gambar.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Variants */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Varian Tiket</h2>
                            <button
                                type="button"
                                onClick={addTicketVariant}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Varian
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.ticket_variants.map((variant, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => updateTicketVariant(index, 'name', e.target.value)}
                                            placeholder="Nama varian"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => updateTicketVariant(index, 'price', e.target.value)}
                                            placeholder="Harga (Rp)"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={variant.description}
                                            onChange={(e) => updateTicketVariant(index, 'description', e.target.value)}
                                            placeholder="Keterangan (opsional)"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button focus:border-transparent"
                                        />
                                    </div>
                                    {data.ticket_variants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTicketVariant(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={route('admin.destinations.index')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-button text-button-text rounded-lg hover:bg-button/90 transition disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
