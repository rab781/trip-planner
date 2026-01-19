import { Head, Link } from '@inertiajs/react';
import {
    UserGroupIcon,
    MapPinIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ auth, stats }) {
    const statCards = [
        {
            name: 'Total Users',
            value: stats.total_users,
            icon: UserGroupIcon,
            color: 'serute-purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            name: 'Total Itineraries',
            value: stats.total_itineraries,
            icon: DocumentTextIcon,
            color: 'serute-blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            name: 'Total Destinations',
            value: stats.total_destinations,
            icon: MapPinIcon,
            color: 'serute-teal',
            bgColor: 'bg-teal-50',
            iconColor: 'text-teal-600',
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard - Serute Trip Planner" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src="/images/logo.png"
                                    alt="Serute Logo"
                                    className="h-10 w-auto"
                                />
                                <div>
                                    <h1 className="text-3xl font-bold text-serute-dark">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-sm text-serute-body mt-1">
                                        Welcome back, {auth.user.name}!
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/"
                                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-serute-dark border border-serute-border hover:bg-gray-50 transition-colors"
                                >
                                    View Site
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded-md bg-serute-purple px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        {statCards.map((stat) => (
                            <div
                                key={stat.name}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center">
                                    <div className={`${stat.bgColor} rounded-lg p-3`}>
                                        <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-serute-body truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-serute-dark">
                                                    {stat.value.toLocaleString()}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold text-serute-dark mb-4 flex items-center">
                            <ChartBarIcon className="h-6 w-6 mr-2 text-serute-purple" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href="/admin/destinations"
                                className="flex items-center p-4 rounded-lg border-2 border-serute-border hover:border-serute-purple hover:bg-purple-50 transition-all group"
                            >
                                <MapPinIcon className="h-6 w-6 text-serute-teal group-hover:text-serute-purple mr-3" />
                                <span className="font-medium text-serute-dark">Manage Destinations</span>
                            </Link>

                            <Link
                                href="/admin/users"
                                className="flex items-center p-4 rounded-lg border-2 border-serute-border hover:border-serute-blue hover:bg-blue-50 transition-all group"
                            >
                                <UserGroupIcon className="h-6 w-6 text-serute-blue group-hover:text-blue-600 mr-3" />
                                <span className="font-medium text-serute-dark">Manage Users</span>
                            </Link>

                            <Link
                                href="/admin/reports"
                                className="flex items-center p-4 rounded-lg border-2 border-serute-border hover:border-serute-teal hover:bg-teal-50 transition-all group"
                            >
                                <ArrowTrendingUpIcon className="h-6 w-6 text-serute-teal group-hover:text-teal-600 mr-3" />
                                <span className="font-medium text-serute-dark">View Reports</span>
                            </Link>

                            <Link
                                href="/admin/settings"
                                className="flex items-center p-4 rounded-lg border-2 border-serute-border hover:border-serute-orange hover:bg-orange-50 transition-all group"
                            >
                                <DocumentTextIcon className="h-6 w-6 text-serute-orange group-hover:text-orange-600 mr-3" />
                                <span className="font-medium text-serute-dark">Settings</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-serute-dark mb-4 flex items-center">
                            <UserGroupIcon className="h-6 w-6 mr-2 text-serute-blue" />
                            Recent Users
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-serute-border">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-serute-body uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-serute-body uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-serute-body uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-serute-body uppercase tracking-wider">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-serute-border">
                                    {stats.recent_users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-serute-dark">
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-serute-body">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-serute-body">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
