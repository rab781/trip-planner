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
} from '@heroicons/react/24/outline';
import DestinationBadges from './DestinationBadges';

/**
 * Crowd Level Timeline Component
 */
function CrowdLevelTimeline({ crowdLevel = {} }) {
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    const levelColors = {
        low: 'bg-green-400',
        medium: 'bg-yellow-400',
        high: 'bg-red-400',
    };

    const levelLabels = {
        low: 'Sepi',
        medium: 'Ramai',
        high: 'Sangat Ramai',
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-paragraph">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Sepi</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Ramai</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Sangat Ramai</span>
            </div>
            <div className="flex gap-1">
                {hours.map(hour => {
                    const level = crowdLevel[hour] || 'medium';
                    return (
                        <div key={hour} className="flex-1 text-center">
                            <div 
                                className={`h-6 rounded ${levelColors[level]}`}
                                title={`${hour}: ${levelLabels[level]}`}
                            ></div>
                            <span className="text-xs text-paragraph mt-1 block">{hour.split(':')[0]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Activity Card Component
 */
function ActivityCard({ activity }) {
    return (
        <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h5 className="font-medium text-headline">{activity.name}</h5>
                    <p className="text-sm text-paragraph mt-0.5">{activity.description}</p>
                </div>
                {activity.duration_min && (
                    <span className="text-xs text-paragraph flex items-center gap-1 flex-shrink-0">
                        <ClockIcon className="w-3 h-3" />
                        {activity.duration_min} menit
                    </span>
                )}
            </div>
            {activity.photo_spot && (
                <div className="mt-2 flex items-center gap-1 text-xs text-pink-600">
                    <CameraIcon className="w-3 h-3" />
                    <span>Spot foto: {activity.photo_spot}</span>
                </div>
            )}
        </div>
    );
}

/**
 * Destination Detail Panel
 * Shows activities, solo tips, crowd timeline, and budget breakdown
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
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-main shadow-xl transition-all">
                                {/* Header with Image */}
                                <div className="relative h-48 bg-gradient-to-r from-button to-highlight">
                                    {destination.image_url ? (
                                        <img 
                                            src={destination.image_url} 
                                            alt={destination.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <MapPinIcon className="w-16 h-16 text-white/50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <Dialog.Title className="text-xl font-bold text-white">
                                            {destination.name}
                                        </Dialog.Title>
                                        <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                                            <span className="flex items-center gap-1">
                                                <MapPinIcon className="w-4 h-4" />
                                                {destination.zone}
                                            </span>
                                            {destination.rating > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    {destination.rating}
                                                </span>
                                            )}
                                            <span>{destination.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                    {/* Badges */}
                                    {destination.badges && destination.badges.length > 0 && (
                                        <DestinationBadges badges={destination.badges} />
                                    )}

                                    {/* Quick Info */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="p-3 bg-secondary/50 rounded-lg text-center">
                                            <CurrencyDollarIcon className="w-5 h-5 mx-auto text-button mb-1" />
                                            <p className="text-xs text-paragraph">Tiket</p>
                                            <p className="font-semibold text-headline">
                                                Rp {(destination.min_ticket_price || 0).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-lg text-center">
                                            <ClockIcon className="w-5 h-5 mx-auto text-button mb-1" />
                                            <p className="text-xs text-paragraph">Durasi</p>
                                            <p className="font-semibold text-headline">
                                                {destination.avg_duration || 60} menit
                                            </p>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-lg text-center">
                                            <SunIcon className="w-5 h-5 mx-auto text-button mb-1" />
                                            <p className="text-xs text-paragraph">Waktu Terbaik</p>
                                            <p className="font-semibold text-headline">
                                                {destination.best_visit_time || 'Pagi'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-lg text-center">
                                            <UsersIcon className="w-5 h-5 mx-auto text-button mb-1" />
                                            <p className="text-xs text-paragraph">Parkir</p>
                                            <p className="font-semibold text-headline">
                                                Rp {(destination.parking_fee || 0).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {destination.description && (
                                        <div>
                                            <h4 className="font-semibold text-headline mb-2">Tentang</h4>
                                            <p className="text-paragraph text-sm">{destination.description}</p>
                                        </div>
                                    )}

                                    {/* Activities */}
                                    {activities.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-headline mb-3">
                                                🎯 Apa yang Bisa Dilakukan
                                            </h4>
                                            <div className="space-y-2">
                                                {activities.map((activity, index) => (
                                                    <ActivityCard key={index} activity={activity} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Solo Traveler Tips */}
                                    {isSoloMode && destination.solo_tips && (
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                                <UserIcon className="w-5 h-5" />
                                                Tips untuk Solo Traveler
                                            </h4>
                                            <p className="text-sm text-blue-700">{destination.solo_tips}</p>
                                            {destination.solo_friendly_score && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs text-blue-600">Solo-Friendly Score:</span>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <span 
                                                                key={i} 
                                                                className={`w-4 h-4 rounded-full ${
                                                                    i <= destination.solo_friendly_score 
                                                                        ? 'bg-blue-500' 
                                                                        : 'bg-blue-200'
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
                                        <div>
                                            <h4 className="font-semibold text-headline mb-3">
                                                👥 Tingkat Keramaian
                                            </h4>
                                            <CrowdLevelTimeline crowdLevel={crowdLevel} />
                                        </div>
                                    )}

                                    {/* Budget Estimate */}
                                    <div>
                                        <h4 className="font-semibold text-headline mb-3">
                                            💰 Estimasi Budget per Orang
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 border border-secondary rounded-lg">
                                                <p className="text-xs text-paragraph">🎫 Tiket Masuk</p>
                                                <p className="font-semibold text-headline">
                                                    Rp {(destination.min_ticket_price || 0).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="p-3 border border-secondary rounded-lg">
                                                <p className="text-xs text-paragraph">🅿️ Parkir</p>
                                                <p className="font-semibold text-headline">
                                                    Rp {(destination.parking_fee || 0).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="p-3 border border-secondary rounded-lg col-span-2">
                                                <p className="text-xs text-paragraph">🍜 Makanan (estimasi)</p>
                                                <p className="font-semibold text-headline">
                                                    Rp {foodRange.min.toLocaleString('id-ID')} - Rp {foodRange.max.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Opening Hours */}
                                    {(destination.opening_time || destination.closing_time) && (
                                        <div className="text-sm text-paragraph">
                                            <span className="font-medium">Jam Buka:</span>{' '}
                                            {destination.opening_time || '08:00'} - {destination.closing_time || '17:00'}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 bg-secondary/30 border-t border-secondary">
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2.5 bg-button text-button-text rounded-xl font-medium hover:bg-button/90 transition-colors"
                                    >
                                        Tutup
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
