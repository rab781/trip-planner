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

            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                            <img src="/images/logo.png" alt="Serute Logo" className="h-12 w-12" />
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-headline">Serute</h1>
                                <p className="text-xs text-paragraph">Smart Trip Planner</p>
                            </div>
                        </Link>
                        <h2 className="text-2xl font-bold text-headline mt-6">Selamat Datang Kembali!</h2>
                        <p className="text-paragraph mt-2">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    {/* Card Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-secondary">
                        {status && (
                            <div className="mb-4 px-4 py-3 text-sm font-medium text-highlight bg-highlight/10 rounded-lg border border-highlight/30">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email" className="text-headline font-medium" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full px-4 py-3 border-2 border-secondary rounded-lg focus:ring-2 focus:ring-button focus:border-button"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="nama@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-headline font-medium" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full px-4 py-3 border-2 border-secondary rounded-lg focus:ring-2 focus:ring-button focus:border-button"
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
                                    <span className="ms-2 text-sm text-paragraph">
                                        Ingat saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-button hover:text-highlight font-medium"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton
                                className="w-full justify-center py-3 bg-gradient-to-r from-button to-highlight hover:opacity-90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-paragraph">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-button hover:text-highlight font-semibold"
                                >
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-secondary text-center">
                            <p className="text-xs text-paragraph">
                                Admin?{' '}
                                <Link
                                    href={route('admin.login')}
                                    className="text-button hover:text-highlight font-medium"
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
