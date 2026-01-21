import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MapWithSidebar from '@/Components/Map/MapWithSidebar';
import BudgetSummary from '@/Components/Itinerary/BudgetSummary';
import { 
    ArrowLeftIcon, 
    ArrowRightIcon, 
    CheckIcon,
    MapPinIcon,
    CalendarDaysIcon,
    UsersIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

/**
 * Itinerary Create Page - Multi-step wizard
 * 
 * Inspired by Wanderlog: step indicator, hybrid map picker
 * Step 1: Basic info (title, dates, pax, transport)
 * Step 2: Select destinations (map + list)
 * Step 3: Review & confirm
 */
export default function Create({ cities = [], zones = [], categories = [], destinations = [] }) {
    const [step, setStep] = useState(1);
    const [selectedDestinationIds, setSelectedDestinationIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors, reset } = useForm({
        city_id: cities[0]?.id || '',
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        total_pax_count: 2,
        transportation_preference: 'CAR',
    });

    const steps = [
        { number: 1, title: 'Info Dasar', icon: InformationCircleIcon },
        { number: 2, title: 'Pilih Destinasi', icon: MapPinIcon },
        { number: 3, title: 'Review', icon: CheckIcon },
    ];

    // Calculate trip duration
    const tripDuration = useMemo(() => {
        if (!data.start_date || !data.end_date) return 0;
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }, [data.start_date, data.end_date]);

    // Selected destinations data
    const selectedDestinations = useMemo(() => {
        return selectedDestinationIds
            .map(id => destinations.find(d => d.id === id))
            .filter(Boolean);
    }, [destinations, selectedDestinationIds]);

    // Estimate budget (simplified calculation)
    const estimatedBudget = useMemo(() => {
        const ticketCost = selectedDestinations.reduce((sum, d) => sum + (d.min_price || 0), 0) * data.total_pax_count;
        const foodPerDay = 50000 * data.total_pax_count;
        const transportEstimate = selectedDestinations.length * 15000 * (data.transportation_preference === 'CAR' ? 2 : 1);
        
        return {
            ticket_cost: ticketCost,
            transport_cost: transportEstimate,
            estimated_food_cost: foodPerDay * tripDuration,
            lodging_cost: 0,
            total_budget: ticketCost + transportEstimate + (foodPerDay * tripDuration),
        };
    }, [selectedDestinations, data.total_pax_count, data.transportation_preference, tripDuration]);

    // Toggle destination selection
    const handleToggleDestination = (destination) => {
        setSelectedDestinationIds(prev => {
            if (prev.includes(destination.id)) {
                return prev.filter(id => id !== destination.id);
            }
            return [...prev, destination.id];
        });
    };

    // Validate step 1
    const isStep1Valid = data.title && data.start_date && data.end_date && data.total_pax_count > 0;

    // Validate step 2
    const isStep2Valid = selectedDestinationIds.length > 0;

    // Handle next step
    const handleNextStep = () => {
        if (step === 1 && isStep1Valid) {
            setStep(2);
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
                    ...data,
                    destination_ids: selectedDestinationIds,
                }),
            });

            const result = await response.json();
            
            if (response.ok) {
                // Redirect to show page
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
                                    {/* Step Circle */}
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
                                            <span className="font-semibold">{s.number}</span>
                                        )}
                                    </div>
                                    
                                    {/* Step Label */}
                                    <span className={`ml-2 text-sm font-medium hidden sm:block ${
                                        step === s.number ? 'text-button' : 'text-paragraph'
                                    }`}>
                                        {s.title}
                                    </span>

                                    {/* Connector Line */}
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
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="p-6 sm:p-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Informasi Dasar Perjalanan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Judul Perjalanan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Contoh: Liburan Keluarga ke Lembang"
                                            className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Deskripsi (Opsional)
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Ceritakan sedikit tentang perjalanan ini..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button resize-none"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kota Tujuan <span className="text-red-500">*</span>
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

                                    {/* Pax Count */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jumlah Orang <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setData('total_pax_count', Math.max(1, data.total_pax_count - 1))}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={data.total_pax_count}
                                                onChange={(e) => setData('total_pax_count', parseInt(e.target.value) || 1)}
                                                min="1"
                                                className="w-20 text-center px-4 py-2 border border-secondary rounded-xl focus:ring-2 focus:ring-button/20 focus:border-button"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('total_pax_count', data.total_pax_count + 1)}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                +
                                            </button>
                                            <span className="text-sm text-gray-500">orang</span>
                                        </div>
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
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

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
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

                                    {/* Transport Preference */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Preferensi Transportasi <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setData('transportation_preference', 'MOTOR')}
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    data.transportation_preference === 'MOTOR'
                                                        ? 'border-button bg-secondary'
                                                        : 'border-secondary hover:border-button/30'
                                                }`}
                                            >
                                                <span className="text-3xl block mb-2">🏍️</span>
                                                <span className="font-medium text-headline">Motor</span>
                                                <p className="text-xs text-paragraph mt-1">Lebih hemat, cocok 1-2 orang</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('transportation_preference', 'CAR')}
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    data.transportation_preference === 'CAR'
                                                        ? 'border-button bg-secondary'
                                                        : 'border-secondary hover:border-button/30'
                                                }`}
                                            >
                                                <span className="text-3xl block mb-2">🚗</span>
                                                <span className="font-medium text-headline">Mobil</span>
                                                <p className="text-xs text-paragraph mt-1">Nyaman untuk keluarga</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Select Destinations */}
                        {step === 2 && (
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-headline">
                                            Pilih Destinasi
                                        </h3>
                                        <p className="text-sm text-paragraph">
                                            Klik marker di peta atau pilih dari daftar
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-button/10 text-button rounded-full text-sm font-medium">
                                        {selectedDestinationIds.length} dipilih
                                    </span>
                                </div>

                                <MapWithSidebar
                                    destinations={destinations}
                                    selectedIds={selectedDestinationIds}
                                    onToggleDestination={handleToggleDestination}
                                    zones={zones}
                                    categories={categories}
                                />
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="p-6 sm:p-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Review Rencana Perjalanan
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Trip Info */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Basic Info Card */}
                                        <div className="bg-gray-50 rounded-xl p-5">
                                            <h4 className="font-semibold text-gray-900 mb-4">{data.title}</h4>
                                            {data.description && (
                                                <p className="text-gray-600 text-sm mb-4">{data.description}</p>
                                            )}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 block">Kota</span>
                                                    <span className="font-medium">{cities.find(c => c.id == data.city_id)?.name || 'Bandung'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Durasi</span>
                                                    <span className="font-medium">{tripDuration} hari</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Jumlah Orang</span>
                                                    <span className="font-medium">{data.total_pax_count} orang</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Transportasi</span>
                                                    <span className="font-medium">
                                                        {data.transportation_preference === 'MOTOR' ? '🏍️ Motor' : '🚗 Mobil'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selected Destinations */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Destinasi ({selectedDestinations.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedDestinations.map((dest, index) => (
                                                    <div 
                                                        key={dest.id}
                                                        className="flex items-center gap-3 p-3 bg-main border border-secondary rounded-lg"
                                                    >
                                                        <span className="w-6 h-6 bg-button text-button-text rounded-full flex items-center justify-center text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-headline truncate">{dest.name}</p>
                                                            <p className="text-xs text-paragraph">{dest.zone?.name}</p>
                                                        </div>
                                                        <span className="text-sm font-medium text-button">
                                                            Rp {(dest.min_price || 0).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Budget Summary */}
                                    <div>
                                        <BudgetSummary
                                            budget={estimatedBudget}
                                            paxCount={data.total_pax_count}
                                            isSticky={false}
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

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
                                            ? 'bg-secondary text-paragraph cursor-not-allowed'
                                            : 'bg-button text-button-text hover:bg-button/90'
                                    }`}
                                >
                                    Lanjut
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
