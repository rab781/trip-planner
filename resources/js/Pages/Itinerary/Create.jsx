import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GeneratedItinerary from '@/Components/Itinerary/GeneratedItinerary';
import CompleteBudgetSummary from '@/Components/Itinerary/CompleteBudgetSummary';
import LoadingPlannerIllustration from '@/Components/Illustrations/LoadingPlannerIllustration';
import SuccessIllustration from '@/Components/Illustrations/SuccessIllustration';
import { SparklesIcon, CalendarIcon, RouteIcon, UsersIcon } from '@/Components/Icons/TravelIcons';
import { LoadingCompass } from '@/Components/Icons/LoadingSpinner';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    AdjustmentsHorizontalIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

/**
 * Itinerary Create Page - Multi-step wizard with AI Generation
 *
 * Step 1: Preferences (title, dates, pax, transport, categories, priority, pace, solo mode)
 * Step 2: Review Generated Itinerary (drag-drop, regenerate, replace)
 * Step 3: Final Review & Confirm
 */
export default function Create({ cities = [], zones = [], categories = [], destinations = [] }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDays, setGeneratedDays] = useState([]);
    const [completeBudget, setCompleteBudget] = useState({});
    const [fallbackUsed, setFallbackUsed] = useState(false);
    const [fallbackMessage, setFallbackMessage] = useState('');
    const [generationError, setGenerationError] = useState(null);

    const { data, setData, errors, reset } = useForm({
        city_id: cities[0]?.id || '',
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        total_pax_count: 2,
        transportation_preference: 'CAR',
        // New preference fields
        categories: [],
        priority: 'balanced',
        pace: 'normal',
        budget_per_day: '',
        solo_mode: false,
    });

    const steps = [
        { number: 1, title: 'Preferensi', icon: AdjustmentsHorizontalIcon },
        { number: 2, title: 'Review Hasil', icon: RouteIcon },
        { number: 3, title: 'Konfirmasi', icon: CheckIcon },
    ];

    // Calculate trip duration
    const tripDuration = useMemo(() => {
        if (!data.start_date || !data.end_date) return 0;
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }, [data.start_date, data.end_date]);

    // Toggle category selection
    const handleToggleCategory = (categoryId) => {
        setData('categories', 
            data.categories.includes(categoryId)
                ? data.categories.filter(id => id !== categoryId)
                : [...data.categories, categoryId]
        );
    };

    // Validate step 1
    const isStep1Valid = data.title && 
        data.start_date && 
        data.end_date && 
        data.total_pax_count > 0 && 
        data.categories.length > 0;

    // Validate step 2
    const isStep2Valid = generatedDays.length > 0 && 
        generatedDays.some(d => d.destinations.length > 0);

    // Generate itinerary
    const handleGenerate = async () => {
        setIsGenerating(true);
        setGenerationError(null);

        try {
            const response = await fetch('/api/itineraries/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    city_id: data.city_id,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    total_pax_count: data.total_pax_count,
                    transportation_preference: data.transportation_preference,
                    categories: data.categories,
                    priority: data.priority,
                    pace: data.pace,
                    budget_per_day: data.budget_per_day ? parseInt(data.budget_per_day) : null,
                    solo_mode: data.solo_mode,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setGeneratedDays(result.data.days || []);
                setCompleteBudget(result.data.complete_budget || {});
                setFallbackUsed(result.data.fallback_used || false);
                setFallbackMessage(result.data.fallback_message || '');
                setStep(2);
            } else {
                setGenerationError(result.message || 'Gagal generate itinerary');
            }
        } catch (error) {
            console.error('Error generating itinerary:', error);
            setGenerationError('Terjadi kesalahan saat generate itinerary');
        } finally {
            setIsGenerating(false);
        }
    };

    // Regenerate entire itinerary
    const handleRegenerate = async () => {
        await handleGenerate();
    };

    // Regenerate specific day
    const handleRegenerateDay = async (dayNumber) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/itineraries/regenerate-day', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    city_id: data.city_id,
                    day_number: dayNumber,
                    total_days: tripDuration,
                    total_pax_count: data.total_pax_count,
                    transportation_preference: data.transportation_preference,
                    categories: data.categories,
                    priority: data.priority,
                    pace: data.pace,
                    solo_mode: data.solo_mode,
                    exclude_ids: generatedDays.flatMap(d => d.destinations.map(dest => dest.id)),
                }),
            });

            const result = await response.json();

            if (result.success && result.data.day) {
                setGeneratedDays(prev => prev.map(d => 
                    d.day === dayNumber ? result.data.day : d
                ));
            }
        } catch (error) {
            console.error('Error regenerating day:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle next step
    const handleNextStep = () => {
        if (step === 1 && isStep1Valid) {
            handleGenerate();
        } else if (step === 2 && isStep2Valid) {
            setStep(3);
        }
    };

    // Handle previous step
    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Extract destination IDs from generated days
            const destinationIds = generatedDays.flatMap(d => 
                d.destinations.map(dest => dest.id)
            );

            // Create itinerary via API
            const response = await fetch('/api/itineraries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    city_id: data.city_id,
                    title: data.title,
                    description: data.description,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    total_pax_count: data.total_pax_count,
                    transportation_preference: data.transportation_preference,
                    destination_ids: destinationIds,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                router.visit(route('itineraries.show', result.data.id));
            } else {
                alert(result.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error creating itinerary:', error);
            alert('Terjadi kesalahan saat membuat itinerary');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Priority options
    const priorityOptions = [
        { value: 'balanced', label: '⚖️ Seimbang', desc: 'Rating, harga, dan popularitas seimbang' },
        { value: 'budget', label: '💰 Hemat Budget', desc: 'Prioritaskan destinasi dengan harga terjangkau' },
        { value: 'popular', label: '🔥 Paling Populer', desc: 'Prioritaskan destinasi yang paling banyak dikunjungi' },
        { value: 'rating', label: '⭐ Rating Terbaik', desc: 'Prioritaskan destinasi dengan rating tertinggi' },
    ];

    // Pace options
    const paceOptions = [
        { value: 'relaxed', label: 'Santai', desc: '2-3 destinasi/hari', icon: '🌴' },
        { value: 'normal', label: 'Normal', desc: '4 destinasi/hari', icon: '🚶' },
        { value: 'packed', label: 'Padat', desc: '5-6 destinasi/hari', icon: '🏃' },
    ];

    // Calculate total destinations
    const totalDestinations = generatedDays.reduce((sum, d) => sum + d.destinations.length, 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Buat Rencana Perjalanan
                    </h2>
                </div>
            }
        >
            <Head title="Buat Rencana Perjalanan" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            {steps.map((s, index) => (
                                <div key={s.number} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                        step === s.number
                                            ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/30'
                                            : step > s.number
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                    }`}>
                                        {step > s.number ? (
                                            <CheckIcon className="w-5 h-5" />
                                        ) : (
                                            <s.icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className={`ml-2 text-sm font-medium hidden sm:block ${
                                        step === s.number ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {s.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 sm:w-24 h-0.5 mx-4 transition-colors duration-500 ${
                                            step > s.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loading Overlay */}
                    {isGenerating && (
                        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-in-up">
                                <LoadingPlannerIllustration />
                                <div className="text-center mt-6">
                                    <h3 className="text-lg font-semibold text-headline dark:text-white mb-2">
                                        Menyusun Itinerary...
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        AI sedang menganalisis preferensi Anda dan menyusun rute terbaik
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                        {/* Step 1: Preferences */}
                        {step === 1 && (
                            <div className="p-6 sm:p-8 animate-fade-in">
                                <h3 className="text-lg font-semibold text-headline dark:text-white mb-6 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-teal-500" />
                                    Atur Preferensi Perjalanan
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Basic Info */}
                                    <div className="space-y-6">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                Judul Perjalanan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Contoh: Solo Trip ke Bandung"
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                Deskripsi (Opsional)
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Ceritakan sedikit tentang perjalanan ini..."
                                                rows={2}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none transition-colors"
                                            />
                                        </div>

                                        {/* City & Pax */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                    Kota Tujuan
                                                </label>
                                                <select
                                                    value={data.city_id}
                                                    onChange={(e) => setData('city_id', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                                >
                                                    {cities.map(city => (
                                                        <option key={city.id} value={city.id}>{city.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                    Jumlah Orang
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('total_pax_count', Math.max(1, data.total_pax_count - 1))}
                                                        className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={data.total_pax_count}
                                                        onChange={(e) => setData('total_pax_count', parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        className="w-16 text-center px-2 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('total_pax_count', data.total_pax_count + 1)}
                                                        className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                    Tanggal Mulai <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                    Tanggal Selesai <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.end_date}
                                                    onChange={(e) => setData('end_date', e.target.value)}
                                                    min={data.start_date || new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {tripDuration > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-lg">
                                                <CalendarIcon className="w-4 h-4" />
                                                Durasi: {tripDuration} hari
                                            </div>
                                        )}

                                        {/* Transport */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-2">
                                                Transportasi
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('transportation_preference', 'MOTOR')}
                                                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                        data.transportation_preference === 'MOTOR'
                                                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700'
                                                    }`}
                                                >
                                                    <span className="text-2xl">🏍️</span>
                                                    <span className="font-medium text-headline dark:text-white ml-2">Motor</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('transportation_preference', 'CAR')}
                                                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                        data.transportation_preference === 'CAR'
                                                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700'
                                                    }`}
                                                >
                                                    <span className="text-2xl">🚗</span>
                                                    <span className="font-medium text-headline dark:text-white ml-2">Mobil</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Preferences */}
                                    <div className="space-y-6">
                                        {/* Categories */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-2">
                                                Kategori Destinasi <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Pilih minimal 1 kategori</p>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => handleToggleCategory(cat.id)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                            data.categories.includes(cat.id)
                                                                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-2">
                                                Prioritas Pemilihan
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {priorityOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setData('priority', opt.value)}
                                                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                                                            data.priority === opt.value
                                                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                                                                : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700'
                                                        }`}
                                                    >
                                                        <span className="font-medium text-headline dark:text-white text-sm">{opt.label}</span>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pace */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-2">
                                                Kecepatan Perjalanan
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {paceOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setData('pace', opt.value)}
                                                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                            data.pace === opt.value
                                                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                                                                : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700'
                                                        }`}
                                                    >
                                                        <span className="text-2xl block">{opt.icon}</span>
                                                        <span className="font-medium text-headline dark:text-white text-sm">{opt.label}</span>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Budget per day */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline dark:text-gray-200 mb-1">
                                                Budget per Hari (Opsional)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.budget_per_day}
                                                    onChange={(e) => setData('budget_per_day', e.target.value)}
                                                    placeholder="150000"
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per orang per hari (untuk perbandingan)</p>
                                        </div>

                                        {/* Solo Mode Toggle */}
                                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                            data.solo_mode 
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                                                : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        }`}
                                            onClick={() => setData('solo_mode', !data.solo_mode)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    data.solo_mode ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                                }`}>
                                                    <UserIcon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-headline dark:text-white">🎒 Solo Trip Mode</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Aktifkan untuk mendapat tips & rekomendasi khusus solo traveler
                                                    </p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full transition-colors ${
                                                    data.solo_mode ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                                                }`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${
                                                        data.solo_mode ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generation Error */}
                                {generationError && (
                                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 animate-shake">
                                        {generationError}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Review Generated Itinerary */}
                        {step === 2 && (
                            <div className="p-6 sm:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left - Generated Itinerary */}
                                    <div className="lg:col-span-2">
                                        <GeneratedItinerary
                                            days={generatedDays}
                                            onDaysChange={setGeneratedDays}
                                            fallbackUsed={fallbackUsed}
                                            fallbackMessage={fallbackMessage}
                                            completeBudget={completeBudget}
                                            preferences={{
                                                priority: data.priority,
                                                pace: data.pace,
                                                solo_mode: data.solo_mode,
                                            }}
                                            cityId={data.city_id}
                                            categories={categories}
                                            onRegenerate={handleRegenerate}
                                            onRegenerateDay={handleRegenerateDay}
                                            isLoading={isGenerating}
                                        />
                                    </div>

                                    {/* Right - Budget Summary */}
                                    <div>
                                        <CompleteBudgetSummary
                                            budget={completeBudget}
                                            paxCount={data.total_pax_count}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Final Review */}
                        {step === 3 && (
                            <div className="p-6 sm:p-8 animate-fade-in">
                                <h3 className="text-lg font-semibold text-headline dark:text-white mb-6 flex items-center gap-2">
                                    <CheckIcon className="w-5 h-5 text-green-500" />
                                    Konfirmasi Rencana Perjalanan
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Trip Summary */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Basic Info Card */}
                                        <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/30 dark:to-teal-800/20 rounded-xl p-5 border border-teal-200/50 dark:border-teal-700/50">
                                            <h4 className="font-semibold text-headline dark:text-white text-lg mb-2">{data.title}</h4>
                                            {data.description && (
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{data.description}</p>
                                            )}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">📍 Kota</span>
                                                    <span className="font-medium text-headline dark:text-white">{cities.find(c => c.id == data.city_id)?.name || 'Bandung'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">📅 Durasi</span>
                                                    <span className="font-medium text-headline dark:text-white">{tripDuration} hari</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">👥 Orang</span>
                                                    <span className="font-medium text-headline dark:text-white">{data.total_pax_count} orang</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400 block">🚗 Transport</span>
                                                    <span className="font-medium text-headline dark:text-white">
                                                        {data.transportation_preference === 'MOTOR' ? 'Motor' : 'Mobil'}
                                                    </span>
                                                </div>
                                            </div>
                                            {data.solo_mode && (
                                                <div className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                                    <UserIcon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Solo Trip Mode Aktif</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Destinations Preview */}
                                        <div>
                                            <h4 className="font-semibold text-headline dark:text-white mb-3 flex items-center gap-2">
                                                <RouteIcon className="w-5 h-5 text-teal-500" />
                                                {totalDestinations} Destinasi dalam {generatedDays.length} Hari
                                            </h4>
                                            <div className="space-y-3">
                                                {generatedDays.map(day => (
                                                    <div key={day.day} className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-shadow">
                                                        <h5 className="font-medium text-headline dark:text-white mb-2">Hari {day.day}</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {day.destinations.map((dest, idx) => (
                                                                <span 
                                                                    key={dest.id}
                                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-200"
                                                                >
                                                                    <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                        {idx + 1}
                                                                    </span>
                                                                    {dest.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Budget Summary */}
                                    <div>
                                        <CompleteBudgetSummary
                                            budget={completeBudget}
                                            paxCount={data.total_pax_count}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Navigation */}
                        <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    step === 1
                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Kembali
                            </button>

                            {step === 1 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={!isStep1Valid || isGenerating}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        !isStep1Valid || isGenerating
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg hover:shadow-teal-500/25'
                                    }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <LoadingCompass className="w-4 h-4" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4" />
                                            Generate Itinerary
                                        </>
                                    )}
                                </button>
                            ) : step === 2 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={!isStep2Valid}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        !isStep2Valid
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg hover:shadow-teal-500/25'
                                    }`}
                                >
                                    Lanjut ke Konfirmasi
                                    <ArrowRightIcon className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoadingCompass className="w-4 h-4" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="w-4 h-4" />
                                            Buat Itinerary
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
