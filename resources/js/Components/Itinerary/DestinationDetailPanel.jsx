import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    MapPinIcon,
    ClockIcon,
    StarIcon,
    CurrencyDollarIcon,
    CameraIcon,
    UserIcon,
    UsersIcon,
    SunIcon,
    TicketIcon,
    BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import DestinationBadges from './DestinationBadges';

/**
 * Crowd Level Timeline Component - Redesigned
 */
function CrowdLevelTimeline({ crowdLevel = {} }) {
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const levelConfig = {
        low: { color: 'bg-emerald-400', label: 'Sepi', height: 'h-6' },
        medium: { color: 'bg-amber-400', label: 'Ramai', height: 'h-10' },
        high: { color: 'bg-rose-400', label: 'Padat', height: 'h-14' },
    };

    return (
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm">
            <h4 className="font-semibold text-headline dark:text-white mb-4 text-sm flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-teal-500" />
                Prediksi Keramaian
            </h4>

            <div className="flex items-end gap-2 h-20 mb-2">
                {hours.map(hour => {
                    const level = crowdLevel[hour] || 'medium';
                    const config = levelConfig[level];
                    return (
                        <div key={hour} className="flex-1 flex flex-col items-center group relative">
                            <div
                                className={`w-full rounded-t-lg ${config.color} transition-all duration-300 group-hover:opacity-90`}
                                style={{ height: config.height === 'h-6' ? '1.5rem' : config.height === 'h-10' ? '2.5rem' : '3.5rem' }}
                            ></div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded w-max z-10 pointer-events-none">
                                {hour}: {config.label}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 font-medium px-1">
                {hours.filter((_, i) => i % 2 === 0).map(hour => (
                    <span key={hour}>{hour}</span>
                ))}
            </div>
        </div>
    );
}

/**
 * Activity Card Component - Redesigned
 */
function ActivityCard({ activity }) {
    return (
        <div className="group p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                    {activity.photo_spot ? <CameraIcon className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm">{activity.name}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{activity.description}</p>

                    <div className="flex items-center gap-3 mt-2">
                        {activity.duration_min && (
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {activity.duration_min} mnt
                            </span>
                        )}
                        {activity.photo_spot && (
                            <span className="text-[10px] bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full text-pink-600 dark:text-pink-400 flex items-center gap-1">
                                <CameraIcon className="w-3 h-3" />
                                Spot Foto
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Destination Detail Panel
 * Redesigned with Glassmorphism and Premium UI
 */
export default function DestinationDetailPanel({ destination, onClose, isSoloMode = false }) {
    if (!destination) return null;

    const foodRange = destination.food_price_range || { min: 15000, max: 50000 };
    const activities = destination.activities || [];
    const crowdLevel = destination.crowd_level || {};

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-t-3xl sm:rounded-3xl bg-surface-light dark:bg-gray-900 text-left shadow-2xl transition-all w-full max-w-3xl border border-white/20">

                                {/* Hero Header */}
                                <div className="relative h-64 sm:h-72 group">
                                    {destination.image_url ? (
                                        <div className="w-full h-full overflow-hidden">
                                            <img
                                                src={destination.image_url}
                                                alt={destination.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center">
                                            <MapPinIcon className="w-20 h-20 text-white/30" />
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2.5 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white transition-all hover:rotate-90"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>

                                    {/* Title Section */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            {destination.badges && <DestinationBadges badges={destination.badges} />}
                                            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium text-white flex items-center gap-1.5">
                                                <MapPinIcon className="w-3.5 h-3.5" />
                                                {destination.zone}
                                            </span>
                                            {destination.rating > 0 && (
                                                <span className="px-2.5 py-1 rounded-full bg-amber-400/90 text-xs font-bold text-black flex items-center gap-1">
                                                    <StarIcon className="w-3.5 h-3.5 fill-black" />
                                                    {destination.rating}
                                                </span>
                                            )}
                                        </div>
                                        <Dialog.Title className="text-3xl font-bold font-display text-white mb-1 shadow-sm">
                                            {destination.name}
                                        </Dialog.Title>
                                        <p className="text-white/80 text-sm font-medium">
                                            {destination.category} • Buka {destination.opening_time || '08:00'} - {destination.closing_time || '17:00'}
                                        </p>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">

                                    {/* Key Stats Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            {
                                                label: 'Tiket Masuk',
                                                value: `Rp ${(destination.min_ticket_price || 0).toLocaleString('id-ID')}`,
                                                icon: TicketIcon,
                                                color: 'text-blue-500',
                                                bg: 'bg-blue-50 dark:bg-blue-900/20'
                                            },
                                            {
                                                label: 'Durasi',
                                                value: `${destination.avg_duration || 60} mnt`,
                                                icon: ClockIcon,
                                                color: 'text-orange-500',
                                                bg: 'bg-orange-50 dark:bg-orange-900/20'
                                            },
                                            {
                                                label: 'Waktu Terbaik',
                                                value: destination.best_visit_time || 'Pagi',
                                                icon: SunIcon,
                                                color: 'text-amber-500',
                                                bg: 'bg-amber-50 dark:bg-amber-900/20'
                                            },
                                            {
                                                label: 'Parkir',
                                                value: `Rp ${(destination.parking_fee || 0).toLocaleString('id-ID')}`,
                                                icon: UsersIcon, // Using UsersIcon as generic parking/facility icon
                                                color: 'text-gray-500',
                                                bg: 'bg-gray-100 dark:bg-gray-800'
                                            }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                                <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                                                    <stat.icon className="w-5 h-5" />
                                                </div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{stat.label}</p>
                                                <p className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Main Column */}
                                        <div className="lg:col-span-2 space-y-8">
                                            {/* About Section */}
                                            {destination.description && (
                                                <div className="animation-fade-up">
                                                    <h3 className="text-lg font-bold font-display text-headline dark:text-white mb-3">
                                                        Tentang Destinasi
                                                    </h3>
                                                    <p className="text-paragraph dark:text-gray-300 leading-relaxed text-sm">
                                                        {destination.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Activities Section */}
                                            {activities.length > 0 && (
                                                <div className="animation-fade-up">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-bold font-display text-headline dark:text-white">
                                                            Aktivitas Seru
                                                        </h3>
                                                        <span className="text-xs font-medium px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full">
                                                            {activities.length} Aktivitas
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {activities.map((activity, index) => (
                                                            <ActivityCard key={index} activity={activity} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Sidebar Column */}
                                        <div className="space-y-6">
                                            {/* Solo Tips */}
                                            {isSoloMode && destination.solo_tips && (
                                                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                                                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                                        <UserIcon className="w-5 h-5" />
                                                        Solo Traveler
                                                    </h4>
                                                    <p className="text-sm text-blue-700 dark:text-blue-200 mb-3 leading-relaxed">
                                                        {destination.solo_tips}
                                                    </p>
                                                    {destination.solo_friendly_score && (
                                                        <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                                                            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">Score:</span>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                    <div
                                                                        key={i}
                                                                        className={`w-1.5 h-4 rounded-full ${i <= destination.solo_friendly_score
                                                                                ? 'bg-blue-500'
                                                                                : 'bg-blue-200 dark:bg-blue-800'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Crowd Level */}
                                            {Object.keys(crowdLevel).length > 0 && (
                                                <CrowdLevelTimeline crowdLevel={crowdLevel} />
                                            )}

                                            {/* Food Price (Mini Card) */}
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-500">
                                                    <BuildingStorefrontIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Estimasi Makan</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        Rp {foodRange.min.toLocaleString('id-ID')} - {foodRange.max.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="p-4 sm:px-8 sm:py-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-20">
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-200 dark:shadow-none"
                                    >
                                        Tutup Detail
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
