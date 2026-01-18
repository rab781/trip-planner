import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.login.post'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin Login - Smart Trip Planner" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
                            <ShieldCheckIcon className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                        <p className="text-gray-400">Smart Trip Planner - Bandung Tourism</p>
                    </div>

                    {/* Card Form */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-serute-purple/30">
                        {status && (
                            <div className="mb-4 px-4 py-3 text-sm font-medium text-serute-teal bg-serute-teal/10 rounded-lg border border-serute-teal/30">
                                {status}
                            </div>
                        )}

                        {errors.email && (
                            <div className="mb-4 px-4 py-3 text-sm font-medium text-red-400 bg-red-900/30 rounded-lg border border-red-700">
                                {errors.email}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email Admin"
                                    className="text-gray-300 font-medium"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full px-4 py-3 bg-gray-900/50 border-2 border-serute-purple/30 rounded-lg focus:ring-2 focus:ring-serute-purple focus:border-serute-purple text-white placeholder-gray-400"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="admin@tripplanner.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2 text-red-400" />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-gray-300 font-medium"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full px-4 py-3 bg-gray-900/50 border-2 border-serute-purple/30 rounded-lg focus:ring-2 focus:ring-serute-purple focus:border-serute-purple text-white placeholder-gray-400"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2 text-red-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                        className="rounded border-gray-600 bg-gray-700"
                                    />
                                    <span className="ms-2 text-sm text-gray-300">
                                        Ingat saya
                                    </span>
                                </label>
                            </div>

                            <PrimaryButton
                                className="w-full justify-center py-3 bg-gradient-to-r from-serute-purple to-serute-blue hover:opacity-90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk ke Admin Panel'}
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                            <p className="text-sm text-gray-400">
                                Bukan admin?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-serute-purple hover:text-serute-blue font-medium"
                                >
                                    Login sebagai User
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                href="/"
                                className="text-xs text-gray-500 hover:text-gray-400"
                            >
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 bg-serute-orange/10 border border-serute-orange/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <ShieldCheckIcon className="h-5 w-5 text-serute-orange flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-gray-300">
                                <p className="font-semibold mb-1 text-serute-orange">Akses Terbatas</p>
                                <p className="text-gray-400">
                                    Halaman ini hanya untuk administrator. Aktivitas login akan dicatat untuk keamanan sistem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
