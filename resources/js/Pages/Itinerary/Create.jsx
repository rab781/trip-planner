import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GeneratedItinerary from '@/Components/Itinerary/GeneratedItinerary';
import CompleteBudgetSummary from '@/Components/Itinerary/CompleteBudgetSummary';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    SparklesIcon,
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
        { number: 2, title: 'Review Hasil', icon: SparklesIcon },
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
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
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
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                                        step === s.number
                                            ? 'bg-button border-button text-button-text'
                                            : step > s.number
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-main border-secondary text-paragraph'
                                    }`}>
                                        {step > s.number ? (
                                            <CheckIcon className="w-5 h-5" />
                                        ) : (
                                            <s.icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className={`ml-2 text-sm font-medium hidden sm:block ${
                                        step === s.number ? 'text-button' : 'text-paragraph'
                                    }`}>
                                        {s.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 sm:w-24 h-0.5 mx-4 ${
                                            step > s.number ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Step 1: Preferences */}
                        {step === 1 && (
                            <div className="p-6 sm:p-8">
                                <h3 className="text-lg font-semibold text-headline mb-6">
                                    Atur Preferensi Perjalanan
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Basic Info */}
                                    <div className="space-y-6">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-1">
                                                Judul Perjalanan <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Contoh: Solo Trip ke Bandung"
                                                className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-1">
                                                Deskripsi (Opsional)
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Ceritakan sedikit tentang perjalanan ini..."
                                                rows={2}
                                                className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button resize-none"
                                            />
                                        </div>

                                        {/* City & Pax */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-headline mb-1">
                                                    Kota Tujuan
                                                </label>
                                                <select
                                                    value={data.city_id}
                                                    onChange={(e) => setData('city_id', e.target.value)}
                                                    className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                                >
                                                    {cities.map(city => (
                                                        <option key={city.id} value={city.id}>{city.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-headline mb-1">
                                                    Jumlah Orang
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('total_pax_count', Math.max(1, data.total_pax_count - 1))}
                                                        className="w-10 h-10 flex items-center justify-center border border-secondary rounded-lg hover:bg-secondary transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={data.total_pax_count}
                                                        onChange={(e) => setData('total_pax_count', parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        className="w-16 text-center px-2 py-2 border border-secondary rounded-xl"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('total_pax_count', data.total_pax_count + 1)}
                                                        className="w-10 h-10 flex items-center justify-center border border-secondary rounded-lg hover:bg-secondary transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-headline mb-1">
                                                    Tanggal Mulai <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-headline mb-1">
                                                    Tanggal Selesai <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.end_date}
                                                    onChange={(e) => setData('end_date', e.target.value)}
                                                    min={data.start_date || new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                                />
                                            </div>
                                        </div>

                                        {tripDuration > 0 && (
                                            <p className="text-sm text-button font-medium">
                                                📅 Durasi: {tripDuration} hari
                                            </p>
                                        )}

                                        {/* Transport */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-2">
                                                Transportasi
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('transportation_preference', 'MOTOR')}
                                                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                        data.transportation_preference === 'MOTOR'
                                                            ? 'border-button bg-secondary'
                                                            : 'border-secondary hover:border-button/30'
                                                    }`}
                                                >
                                                    <span className="text-2xl">🏍️</span>
                                                    <span className="font-medium text-headline ml-2">Motor</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('transportation_preference', 'CAR')}
                                                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                        data.transportation_preference === 'CAR'
                                                            ? 'border-button bg-secondary'
                                                            : 'border-secondary hover:border-button/30'
                                                    }`}
                                                >
                                                    <span className="text-2xl">🚗</span>
                                                    <span className="font-medium text-headline ml-2">Mobil</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Preferences */}
                                    <div className="space-y-6">
                                        {/* Categories */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-2">
                                                Kategori Destinasi <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-paragraph mb-3">Pilih minimal 1 kategori</p>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => handleToggleCategory(cat.id)}
                                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                            data.categories.includes(cat.id)
                                                                ? 'bg-button text-button-text'
                                                                : 'bg-secondary text-paragraph hover:bg-secondary/80'
                                                        }`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-2">
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
                                                                ? 'border-button bg-secondary'
                                                                : 'border-secondary hover:border-button/30'
                                                        }`}
                                                    >
                                                        <span className="font-medium text-headline text-sm">{opt.label}</span>
                                                        <p className="text-xs text-paragraph mt-0.5">{opt.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pace */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-2">
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
                                                                ? 'border-button bg-secondary'
                                                                : 'border-secondary hover:border-button/30'
                                                        }`}
                                                    >
                                                        <span className="text-2xl block">{opt.icon}</span>
                                                        <span className="font-medium text-headline text-sm">{opt.label}</span>
                                                        <p className="text-xs text-paragraph">{opt.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Budget per day */}
                                        <div>
                                            <label className="block text-sm font-medium text-headline mb-1">
                                                Budget per Hari (Opsional)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-paragraph">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.budget_per_day}
                                                    onChange={(e) => setData('budget_per_day', e.target.value)}
                                                    placeholder="150000"
                                                    className="w-full pl-12 pr-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                                />
                                            </div>
                                            <p className="text-xs text-paragraph mt-1">Per orang per hari (untuk perbandingan)</p>
                                        </div>

                                        {/* Solo Mode Toggle */}
                                        <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                            data.solo_mode 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-secondary hover:border-blue-300'
                                        }`}
                                            onClick={() => setData('solo_mode', !data.solo_mode)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    data.solo_mode ? 'bg-blue-500 text-white' : 'bg-secondary text-paragraph'
                                                }`}>
                                                    <UserIcon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-headline">🎒 Solo Trip Mode</h4>
                                                    <p className="text-xs text-paragraph">
                                                        Aktifkan untuk mendapat tips & rekomendasi khusus solo traveler
                                                    </p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full transition-colors ${
                                                    data.solo_mode ? 'bg-blue-500' : 'bg-gray-300'
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
                                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
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
                            <div className="p-6 sm:p-8">
                                <h3 className="text-lg font-semibold text-headline mb-6">
                                    Konfirmasi Rencana Perjalanan
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Trip Summary */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Basic Info Card */}
                                        <div className="bg-secondary/30 rounded-xl p-5">
                                            <h4 className="font-semibold text-headline text-lg mb-2">{data.title}</h4>
                                            {data.description && (
                                                <p className="text-paragraph text-sm mb-4">{data.description}</p>
                                            )}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-paragraph block">📍 Kota</span>
                                                    <span className="font-medium text-headline">{cities.find(c => c.id == data.city_id)?.name || 'Bandung'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-paragraph block">📅 Durasi</span>
                                                    <span className="font-medium text-headline">{tripDuration} hari</span>
                                                </div>
                                                <div>
                                                    <span className="text-paragraph block">👥 Orang</span>
                                                    <span className="font-medium text-headline">{data.total_pax_count} orang</span>
                                                </div>
                                                <div>
                                                    <span className="text-paragraph block">🚗 Transport</span>
                                                    <span className="font-medium text-headline">
                                                        {data.transportation_preference === 'MOTOR' ? 'Motor' : 'Mobil'}
                                                    </span>
                                                </div>
                                            </div>
                                            {data.solo_mode && (
                                                <div className="mt-4 flex items-center gap-2 text-blue-600">
                                                    <UserIcon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Solo Trip Mode Aktif</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Destinations Preview */}
                                        <div>
                                            <h4 className="font-semibold text-headline mb-3">
                                                🗺️ {totalDestinations} Destinasi dalam {generatedDays.length} Hari
                                            </h4>
                                            <div className="space-y-3">
                                                {generatedDays.map(day => (
                                                    <div key={day.day} className="p-4 bg-main border border-secondary rounded-xl">
                                                        <h5 className="font-medium text-headline mb-2">Hari {day.day}</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {day.destinations.map((dest, idx) => (
                                                                <span 
                                                                    key={dest.id}
                                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                                                                >
                                                                    <span className="w-5 h-5 bg-button text-button-text rounded-full flex items-center justify-center text-xs font-bold">
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
                        <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    step === 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100'
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
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        !isStep1Valid || isGenerating
                                            ? 'bg-secondary text-paragraph cursor-not-allowed'
                                            : 'bg-button text-button-text hover:bg-button/90'
                                    }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
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
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        !isStep2Valid
                                            ? 'bg-secondary text-paragraph cursor-not-allowed'
                                            : 'bg-button text-button-text hover:bg-button/90'
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
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
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
