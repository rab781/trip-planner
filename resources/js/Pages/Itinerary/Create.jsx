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
            // Create itinerary via API with days format
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
                    days: generatedDays, // Send full days array with destinations
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
        <AuthenticatedLayout>
            <Head title="Buat Rencana Perjalanan" />

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative py-8 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                aria-label="Kembali"
                                className="p-2.5 glass-card hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full transition-all hover-lift text-gray-700 dark:text-gray-200"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                                    Buat Rencana Perjalanan
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Desain liburan impianmu dengan bantuan AI
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="mb-8 max-w-3xl mx-auto">
                        <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-10" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full -z-10 transition-all duration-500"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((s, index) => (
                                <div key={s.number} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-900 px-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.number
                                                ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/30 scale-110'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                                            }`}
                                    >
                                        {step > s.number ? <CheckIcon className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${step >= s.number ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                                        }`}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loading Overlay */}
                    {isGenerating && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-500">
                            <div className="text-center max-w-md px-6 animate-fade-up">
                                <LoadingPlannerIllustration className="w-64 h-64 mx-auto mb-8" />
                                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-2">
                                    Sedang Menyusun Rute Terbaik...
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                                    AI sedang menganalisis {data.categories.length} kategori pilihan dan mencocokkan dengan preferensi {data.priority}...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Main Content Card */}
                    <div className="glass-card rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 transition-all duration-500">

                        {/* Step 1: Preferences */}
                        {step === 1 && (
                            <div className="p-8 lg:p-10 animation-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                                    {/* Left Column: Trip Details */}
                                    <div className="lg:col-span-7 space-y-8">
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                                                <SparklesIcon className="w-5 h-5 text-teal-500" />
                                                Detail Perjalanan
                                            </h3>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ">Nama Perjalanan</label>
                                                <input
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    placeholder="e.g. Liburan Seru di Lembang"
                                                    className="w-full px-5 py-3.5 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kota Tujuan</label>
                                                    <select
                                                        value={data.city_id}
                                                        onChange={(e) => setData('city_id', e.target.value)}
                                                        className="w-full px-5 py-3.5 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                    >
                                                        {cities.map(city => (
                                                            <option key={city.id} value={city.id}>{city.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jumlah Peserta</label>
                                                    <div className="flex items-center bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setData('total_pax_count', Math.max(1, data.total_pax_count - 1))}
                                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-lg transition-all"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={data.total_pax_count}
                                                            onChange={(e) => setData('total_pax_count', parseInt(e.target.value) || 1)}
                                                            className="flex-1 text-center bg-transparent border-none focus:ring-0 p-0 font-semibold text-gray-900 dark:text-white"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setData('total_pax_count', data.total_pax_count + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-lg transition-all"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mulai</label>
                                                    <input
                                                        type="date"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full px-5 py-3.5 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Selesai</label>
                                                    <input
                                                        type="date"
                                                        value={data.end_date}
                                                        onChange={(e) => setData('end_date', e.target.value)}
                                                        min={data.start_date || new Date().toISOString().split('T')[0]}
                                                        className="w-full px-5 py-3.5 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Transportasi Utama</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {['MOTOR', 'CAR'].map((type) => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => setData('transportation_preference', type)}
                                                            className={`relative group p-4 rounded-xl border-2 text-left transition-all duration-300 ${data.transportation_preference === type
                                                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                                                                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800'
                                                                }`}
                                                        >
                                                            <div className={`text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 ${data.transportation_preference === type ? 'scale-110' : ''}`}>
                                                                {type === 'MOTOR' ? '🏍️' : '🚗'}
                                                            </div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                {type === 'MOTOR' ? 'Sepeda Motor' : 'Mobil Pribadi'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {type === 'MOTOR' ? 'Lebih cepat, hindari macet' : 'Lebih nyaman untuk keluarga'}
                                                            </div>
                                                            {data.transportation_preference === type && (
                                                                <div className="absolute top-3 right-3 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                                                                    <CheckIcon className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Preferences */}
                                    <div className="lg:col-span-5 space-y-8">

                                        {/* Categories */}
                                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-4">
                                                Minat Destinasi <span className="font-normal text-gray-500 text-xs ml-1">(Pilih minimal 1)</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => handleToggleCategory(cat.id)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${data.categories.includes(cat.id)
                                                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600'
                                                                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 border border-gray-200 dark:border-gray-600'
                                                            }`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Priority & Pace */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gaya Perjalanan</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {paceOptions.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => setData('pace', opt.value)}
                                                            className={`p-3 rounded-xl border text-center transition-all ${data.pace === opt.value
                                                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-500'
                                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <span className="text-xl block mb-1">{opt.icon}</span>
                                                            <span className="text-sm font-semibold block text-gray-900 dark:text-white">{opt.label}</span>
                                                            <span className="text-[10px] text-gray-500">{opt.desc}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Solo Mode Card */}
                                            <div
                                                onClick={() => setData('solo_mode', !data.solo_mode)}
                                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${data.solo_mode
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10'
                                                        : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50 shadow-sm'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${data.solo_mode ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                                    }`}>
                                                    <UserIcon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-bold ${data.solo_mode ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                                                        Solo Traveler Mode
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Rekomendasi khusus untuk keamanan & kenyamanan solo trip.
                                                    </p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full transition-colors relative ${data.solo_mode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${data.solo_mode ? 'right-1' : 'left-1'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Generated Itinerary */}
                        {step === 2 && (
                            <div className="p-0 sm:p-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
                                    {/* Main Itinerary - Left/Top */}
                                    <div className="lg:col-span-2 border-r border-gray-100 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30">
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

                                    {/* Budget Summary - Right/Bottom */}
                                    <div className="bg-white/60 dark:bg-gray-900/60 p-6 lg:p-8 backdrop-blur-md">
                                        <CompleteBudgetSummary
                                            budget={completeBudget}
                                            paxCount={data.total_pax_count}
                                        />
                                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm flex items-center gap-2">
                                                <SparklesIcon className="w-4 h-4" />
                                                AI Tips
                                            </h4>
                                            <p className="text-xs text-blue-700 dark:text-blue-200">
                                                Anda bisa "drag-and-drop" destinasi antar hari, atau klik tombol "Regenerate" pada hari tertentu jika ingin variasi lain.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <div className="p-8 lg:p-12 animate-fade-in text-center max-w-2xl mx-auto">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                                    <CheckIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-4">
                                    Sempurna! Itinerary Siap Disimpan
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">
                                    Perjalanan "{data.title}" ke {cities.find(c => c.id == data.city_id)?.name} selama {tripDuration} hari sudah tersusun rapi.
                                </p>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-10 border border-gray-100 dark:border-gray-700 text-left grid grid-cols-2 gap-y-4">
                                    <div className="text-gray-500 text-sm">Total Estimasi Biaya</div>
                                    <div className="text-right font-bold text-gray-900 dark:text-white">
                                        Rp {(completeBudget.total_estimated_cost || 0).toLocaleString('id-ID')}
                                    </div>
                                    <div className="text-gray-500 text-sm">Total Destinasi</div>
                                    <div className="text-right font-bold text-gray-900 dark:text-white">
                                        {totalDestinations} Tempat
                                    </div>
                                    <div className="text-gray-500 text-sm">Transportasi</div>
                                    <div className="text-right font-bold text-gray-900 dark:text-white">
                                        {data.transportation_preference === 'MOTOR' ? 'Motor' : 'Mobil'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sticky Footer for Navigation */}
                        <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex items-center justify-between sticky bottom-0 z-10">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${step === 1
                                        ? 'text-gray-300 cursor-not-allowed hidden'
                                        : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Kembali
                            </button>

                            <div className="ml-auto">
                                {step === 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!isStep1Valid || isGenerating}
                                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${!isStep1Valid || isGenerating
                                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0'
                                                : 'bg-gradient-to-r from-teal-500 to-teal-700 hover:shadow-teal-500/25'
                                            }`}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <LoadingCompass className="w-5 h-5 animate-spin" />
                                                Sedang Menyusun...
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-5 h-5" />
                                                Generate Itinerary
                                            </>
                                        )}
                                    </button>
                                ) : step === 2 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!isStep2Valid}
                                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/25 transition-all hover:-translate-y-1"
                                    >
                                        Lanjut ke Konfirmasi
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingCompass className="w-5 h-5 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon className="w-5 h-5" />
                                                Simpan & Selesai
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
