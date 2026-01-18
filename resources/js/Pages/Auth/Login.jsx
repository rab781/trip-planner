import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk - Serute" />

            <div className="min-h-screen bg-serute-light flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                            <img src="/images/logo.png" alt="Serute Logo" className="h-12 w-12" />
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-serute-dark">Serute</h1>
                                <p className="text-xs text-serute-body">Smart Trip Planner</p>
                            </div>
                        </Link>
                        <h2 className="text-2xl font-bold text-serute-dark mt-6">Selamat Datang Kembali!</h2>
                        <p className="text-serute-body mt-2">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    {/* Card Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-serute-border">
                        {status && (
                            <div className="mb-4 px-4 py-3 text-sm font-medium text-serute-teal bg-serute-teal/10 rounded-lg border border-serute-teal/30">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email" className="text-serute-dark font-medium" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full px-4 py-3 border-2 border-serute-border rounded-lg focus:ring-2 focus:ring-serute-purple focus:border-serute-purple"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="nama@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-serute-dark font-medium" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full px-4 py-3 border-2 border-serute-border rounded-lg focus:ring-2 focus:ring-serute-purple focus:border-serute-purple"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                    />
                                    <span className="ms-2 text-sm text-serute-body">
                                        Ingat saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-serute-purple hover:text-serute-blue font-medium"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton
                                className="w-full justify-center py-3 bg-gradient-to-r from-serute-purple to-serute-blue hover:opacity-90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-serute-body">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-serute-purple hover:text-serute-blue font-semibold"
                                >
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-serute-border text-center">
                            <p className="text-xs text-serute-body">
                                Admin?{' '}
                                <Link
                                    href={route('admin.login')}
                                    className="text-serute-purple hover:text-serute-blue font-medium"
                                >
                                    Login sebagai Admin
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
