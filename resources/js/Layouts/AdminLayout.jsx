import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            current: url.startsWith('/admin/dashboard'),
        },
        {
            name: 'Destinasi',
            href: route('admin.destinations.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            current: url.startsWith('/admin/destinations'),
        },
        {
            name: 'Kategori',
            href: route('admin.categories.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            current: url.startsWith('/admin/categories'),
        },
        {
            name: 'Zona',
            href: route('admin.zones.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            ),
            current: url.startsWith('/admin/zones'),
        },
        {
            name: 'Pengguna',
            href: route('admin.users.index'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            current: url.startsWith('/admin/users'),
        },
        {
            name: 'Laporan',
            href: route('admin.reports'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            current: url.startsWith('/admin/reports'),
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-headline bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-secondary">
                        <Link href={route('admin.dashboard')} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-button to-highlight rounded-lg flex items-center justify-center">
                                <span className="text-button-text font-bold text-sm">TP</span>
                            </div>
                            <span className="font-bold text-headline">Trip Planner</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                                    item.current
                                        ? 'bg-secondary text-button'
                                        : 'text-paragraph hover:bg-secondary/50 hover:text-headline'
                                }`}
                            >
                                <span className={item.current ? 'text-button' : 'text-paragraph/60'}>
                                    {item.icon}
                                </span>
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-secondary">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-button to-highlight flex items-center justify-center text-button-text font-medium">
                                {auth?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-headline truncate">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-xs text-paragraph truncate">
                                    {auth?.user?.email}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <Link
                                href={route('dashboard')}
                                className="flex-1 px-3 py-2 text-xs text-center text-paragraph bg-secondary rounded-lg hover:bg-secondary/70 transition"
                            >
                                User Dashboard
                            </Link>
                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="flex-1 px-3 py-2 text-xs text-center text-tertiary bg-tertiary/10 rounded-lg hover:bg-tertiary/20 transition"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <div className="sticky top-0 z-30 flex items-center h-16 px-4 bg-main border-b border-secondary lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-paragraph hover:text-headline lg:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1 lg:ml-0 ml-4">
                        <h1 className="text-lg font-semibold text-headline">Admin Panel</h1>
                    </div>
                    <div className="hidden sm:flex items-center space-x-4">
                        <span className="px-2 py-1 text-xs font-medium bg-secondary text-button rounded-full">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
