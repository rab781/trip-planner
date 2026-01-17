import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar - Smart Trip Planner" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                            <MapPinIcon className="h-10 w-10 text-blue-600" />
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-gray-900">Smart Trip Planner</h1>
                                <p className="text-xs text-gray-500">Bandung Tourism</p>
                            </div>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 mt-6">Buat Akun Baru</h2>
                        <p className="text-gray-600 mt-2">Mulai rencanakan liburan Anda ke Bandung</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700 font-medium" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Masukkan nama lengkap Anda"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email" className="text-gray-700 font-medium" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="text-gray-700 font-medium" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="new-password"
                                    placeholder="Ulangi password Anda"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <PrimaryButton
                                className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition mt-6"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Daftar Sekarang'}
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Masuk Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                    
                    <p className="text-center text-xs text-gray-500 mt-6">
                        Dengan mendaftar, Anda menyetujui{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Syarat & Ketentuan</a>
                        {' '}dan{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Kebijakan Privasi</a> kami
                    </p>
                </div>
            </div>
        </>
    );
}
