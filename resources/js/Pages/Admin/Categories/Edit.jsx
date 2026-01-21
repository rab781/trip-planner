import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const EMOJI_OPTIONS = ['🏛️', '⛰️', '🌳', '🎢', '🍽️', '🛍️', '🎭', '🏨', '🚗', '📍', '🎪', '🎨', '🏊', '⛳', '🎯'];

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📍',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${category.name}`} />

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('admin.categories.index')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Kategori</h1>
                    <p className="text-gray-600">{category.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="space-y-6">
                            {/* Icon Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ikon
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJI_OPTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setData('icon', emoji)}
                                            className={`w-12 h-12 text-2xl rounded-lg border-2 transition ${
                                                data.icon === emoji
                                                    ? 'border-button bg-secondary'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Kategori *
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
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link
                            href={route('admin.categories.index')}
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
