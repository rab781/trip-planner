<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\City;
use App\Models\Category;
use App\Models\Zone;
use App\Models\Destination;
use App\Models\TicketVariant;
use App\Models\TransportRate;
use App\Models\Itinerary;
use App\Models\ItineraryItem;
use App\Models\ItineraryItemDetail;
use App\Models\ItineraryLodging;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ========================================
        // 1. USERS
        // ========================================
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@tripplanner.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $user1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $user2 = User::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // ========================================
        // 2. CITIES
        // ========================================
        $bandung = City::create([
            'name' => 'Bandung',
            'image_url' => 'bandung.jpg',
        ]);

        $jakarta = City::create([
            'name' => 'Jakarta',
            'image_url' => 'jakarta.jpg',
        ]);

        $bali = City::create([
            'name' => 'Bali',
            'image_url' => 'bali.jpg',
        ]);

        // ========================================
        // 3. CATEGORIES
        // ========================================
        $wisataAlam = Category::create([
            'name' => 'Wisata Alam',
            'description' => 'Destinasi dengan pemandangan alam indah',
        ]);

        $kuliner = Category::create([
            'name' => 'Kuliner',
            'description' => 'Tempat kuliner dan makanan khas',
        ]);

        $budaya = Category::create([
            'name' => 'Budaya & Sejarah',
            'description' => 'Museum, candi, dan situs bersejarah',
        ]);

        $adventure = Category::create([
            'name' => 'Adventure & Olahraga',
            'description' => 'Aktivitas outdoor dan petualangan',
        ]);

        $belanja = Category::create([
            'name' => 'Belanja',
            'description' => 'Factory outlet dan pusat perbelanjaan',
        ]);

        $keluarga = Category::create([
            'name' => 'Wisata Keluarga',
            'description' => 'Tempat wisata ramah anak',
        ]);

        // ========================================
        // 4. ZONES - BANDUNG
        // ========================================
        $lembang = Zone::create(['name' => 'Lembang', 'city_id' => $bandung->id]);
        $ciwidey = Zone::create(['name' => 'Ciwidey', 'city_id' => $bandung->id]);
        $dago = Zone::create(['name' => 'Dago', 'city_id' => $bandung->id]);
        $rancaupas = Zone::create(['name' => 'Rancaupas', 'city_id' => $bandung->id]);
        $kotaBandung = Zone::create(['name' => 'Pusat Kota Bandung', 'city_id' => $bandung->id]);
        $cihampelas = Zone::create(['name' => 'Cihampelas', 'city_id' => $bandung->id]);
        $bandungUtara = Zone::create(['name' => 'Bandung Utara', 'city_id' => $bandung->id]);
        $sumedang = Zone::create(['name' => 'Sumedang', 'city_id' => $bandung->id]);

        // ========================================
        // 5. DESTINATIONS - BANDUNG (50 Destinasi)
        // ========================================

        // === LEMBANG ===
        $tangkubanPerahu = Destination::create([
            'zone_id' => $lembang->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Kawah Tangkuban Perahu',
            'description' => 'Gunung berapi aktif dengan kawah yang menakjubkan',
            'latitude' => -6.7597,
            'longitude' => 107.6098,
            'rating' => 4.5,
            'best_visit_time' => '08:00:00',
            'opening_time' => '08:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'tangkuban-perahu.jpg',
        ]);

        $farmhouse = Destination::create([
            'zone_id' => $lembang->id,
            'category_id' => $keluarga->id,
            'name' => 'Farmhouse Lembang',
            'description' => 'Taman ala Eropa dengan spot foto Instagram',
            'latitude' => -6.8103,
            'longitude' => 107.6176,
            'rating' => 4.3,
            'opening_time' => '09:00:00',
            'closing_time' => '18:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'farmhouse.jpg',
        ]);

        $floatingMarket = Destination::create([
            'zone_id' => $lembang->id,
            'category_id' => $kuliner->id,
            'name' => 'Floating Market Lembang',
            'description' => 'Pasar terapung dengan berbagai kuliner khas',
            'latitude' => -6.8134,
            'longitude' => 107.6189,
            'rating' => 4.2,
            'opening_time' => '09:00:00',
            'closing_time' => '21:00:00',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'floating-market.jpg',
        ]);

        $deRanch = Destination::create([
            'zone_id' => $lembang->id,
            'category_id' => $keluarga->id,
            'name' => 'De Ranch Lembang',
            'description' => 'Wisata berkuda ala koboi',
            'latitude' => -6.8142,
            'longitude' => 107.6182,
            'rating' => 4.0,
            'opening_time' => '08:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'deranch.jpg',
        ]);

        $observatorium = Destination::create([
            'zone_id' => $lembang->id,
            'category_id' => $budaya->id,
            'name' => 'Observatorium Bosscha',
            'description' => 'Observatorium tertua di Indonesia',
            'latitude' => -6.8246,
            'longitude' => 107.6152,
            'rating' => 4.6,
            'opening_time' => '09:00:00',
            'closing_time' => '14:00:00',
            'avg_visit_duration_minutes' => 60,
            'image_url' => 'bosscha.jpg',
        ]);

        // === CIWIDEY ===
        $kawahPutih = Destination::create([
            'zone_id' => $ciwidey->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Kawah Putih',
            'description' => 'Danau kawah berwarna putih kehijauan yang indah',
            'latitude' => -7.1661,
            'longitude' => 107.4025,
            'rating' => 4.7,
            'best_visit_time' => '08:00:00',
            'opening_time' => '07:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'kawah-putih.jpg',
        ]);

        $situ_patenggang = Destination::create([
            'zone_id' => $ciwidey->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Situ Patenggang',
            'description' => 'Danau dengan legenda romantis Dewi Rengganis',
            'latitude' => -7.1611,
            'longitude' => 107.3794,
            'rating' => 4.3,
            'opening_time' => '08:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'situ-patenggang.jpg',
        ]);

        $rancabuaya = Destination::create([
            'zone_id' => $ciwidey->id,
            'category_id' => $kuliner->id,
            'name' => 'Rancabali Tea Plantation',
            'description' => 'Perkebunan teh dengan pemandangan indah',
            'latitude' => -7.1389,
            'longitude' => 107.3689,
            'rating' => 4.4,
            'opening_time' => '08:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'rancabali.jpg',
        ]);

        $glamping = Destination::create([
            'zone_id' => $ciwidey->id,
            'category_id' => $adventure->id,
            'name' => 'Glamping Lakeside Rancabali',
            'description' => 'Camping mewah di tepi danau',
            'latitude' => -7.1453,
            'longitude' => 107.3722,
            'rating' => 4.5,
            'opening_time' => '00:00:00',
            'closing_time' => '23:59:59',
            'avg_visit_duration_minutes' => 480,
            'image_url' => 'glamping.jpg',
        ]);

        // === RANCAUPAS ===
        $rancaupas_camp = Destination::create([
            'zone_id' => $rancaupas->id,
            'category_id' => $adventure->id,
            'name' => 'Rancaupas Camping Ground',
            'description' => 'Area camping di kaki Gunung Papandayan',
            'latitude' => -7.1833,
            'longitude' => 107.4167,
            'rating' => 4.2,
            'opening_time' => '00:00:00',
            'closing_time' => '23:59:59',
            'avg_visit_duration_minutes' => 720,
            'image_url' => 'rancaupas.jpg',
        ]);

        // === DAGO ===
        $dagoDreamPark = Destination::create([
            'zone_id' => $dago->id,
            'category_id' => $keluarga->id,
            'name' => 'Dago Dream Park',
            'description' => 'Taman wisata keluarga dengan berbagai wahana',
            'latitude' => -6.8442,
            'longitude' => 107.6297,
            'rating' => 4.1,
            'opening_time' => '09:00:00',
            'closing_time' => '18:00:00',
            'avg_visit_duration_minutes' => 180,
            'image_url' => 'dago-dream-park.jpg',
        ]);

        $tebing_keraton = Destination::create([
            'zone_id' => $dago->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Tebing Keraton',
            'description' => 'Spot sunrise terbaik di Bandung',
            'latitude' => -6.8094,
            'longitude' => 107.6350,
            'rating' => 4.6,
            'best_visit_time' => '05:00:00',
            'opening_time' => '00:00:00',
            'closing_time' => '23:59:59',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'tebing-keraton.jpg',
        ]);

        $curug_dago = Destination::create([
            'zone_id' => $dago->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Curug Dago',
            'description' => 'Air terjun dengan kolam renang alami',
            'latitude' => -6.8450,
            'longitude' => 107.6158,
            'rating' => 4.0,
            'opening_time' => '08:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'curug-dago.jpg',
        ]);

        // === PUSAT KOTA ===
        $gedungSate = Destination::create([
            'zone_id' => $kotaBandung->id,
            'category_id' => $budaya->id,
            'name' => 'Gedung Sate',
            'description' => 'Ikon kota Bandung dengan arsitektur kolonial',
            'latitude' => -6.9024,
            'longitude' => 107.6186,
            'rating' => 4.4,
            'opening_time' => '08:00:00',
            'closing_time' => '15:00:00',
            'avg_visit_duration_minutes' => 45,
            'image_url' => 'gedung-sate.jpg',
        ]);

        $asiaAfrika = Destination::create([
            'zone_id' => $kotaBandung->id,
            'category_id' => $budaya->id,
            'name' => 'Museum Konferensi Asia Afrika',
            'description' => 'Museum bersejarah Konferensi Asia Afrika',
            'latitude' => -6.9211,
            'longitude' => 107.6075,
            'rating' => 4.3,
            'opening_time' => '08:00:00',
            'closing_time' => '16:00:00',
            'avg_visit_duration_minutes' => 60,
            'image_url' => 'asia-afrika.jpg',
        ]);

        $braga = Destination::create([
            'zone_id' => $kotaBandung->id,
            'category_id' => $kuliner->id,
            'name' => 'Jalan Braga',
            'description' => 'Jalan bersejarah dengan kafe dan resto vintage',
            'latitude' => -6.9175,
            'longitude' => 107.6089,
            'rating' => 4.2,
            'opening_time' => '10:00:00',
            'closing_time' => '22:00:00',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'braga.jpg',
        ]);

        $alunAlun = Destination::create([
            'zone_id' => $kotaBandung->id,
            'category_id' => $keluarga->id,
            'name' => 'Alun-alun Bandung',
            'description' => 'Pusat kota dengan taman dan masjid raya',
            'latitude' => -6.9211,
            'longitude' => 107.6044,
            'rating' => 4.0,
            'opening_time' => '00:00:00',
            'closing_time' => '23:59:59',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'alun-alun.jpg',
        ]);

        // === CIHAMPELAS ===
        $cihampelasWalk = Destination::create([
            'zone_id' => $cihampelas->id,
            'category_id' => $belanja->id,
            'name' => 'Cihampelas Walk',
            'description' => 'Mall dengan factory outlet branded',
            'latitude' => -6.8934,
            'longitude' => 107.6064,
            'rating' => 4.1,
            'opening_time' => '10:00:00',
            'closing_time' => '22:00:00',
            'avg_visit_duration_minutes' => 180,
            'image_url' => 'ciwalk.jpg',
        ]);

        $rumahMode = Destination::create([
            'zone_id' => $cihampelas->id,
            'category_id' => $belanja->id,
            'name' => 'Rumah Mode Factory Outlet',
            'description' => 'FO terbesar di Cihampelas',
            'latitude' => -6.8789,
            'longitude' => 107.6022,
            'rating' => 4.0,
            'opening_time' => '09:00:00',
            'closing_time' => '21:00:00',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'rumah-mode.jpg',
        ]);

        // === BANDUNG UTARA ===
        $maribaya = Destination::create([
            'zone_id' => $bandungUtara->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Maribaya Hot Spring Resort',
            'description' => 'Resort dengan pemandian air panas alami',
            'latitude' => -6.7858,
            'longitude' => 107.6364,
            'rating' => 4.3,
            'opening_time' => '08:00:00',
            'closing_time' => '18:00:00',
            'avg_visit_duration_minutes' => 180,
            'image_url' => 'maribaya.jpg',
        ]);

        $curug_cimahi = Destination::create([
            'zone_id' => $bandungUtara->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Curug Cimahi (Rainbow Waterfall)',
            'description' => 'Air terjun dengan pelangi alami',
            'latitude' => -6.7992,
            'longitude' => 107.5506,
            'rating' => 4.5,
            'opening_time' => '07:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'curug-cimahi.jpg',
        ]);

        $lembangPark = Destination::create([
            'zone_id' => $bandungUtara->id,
            'category_id' => $keluarga->id,
            'name' => 'Lembang Park & Zoo',
            'description' => 'Kebun binatang mini dengan wahana anak',
            'latitude' => -6.8167,
            'longitude' => 107.6178,
            'rating' => 4.0,
            'opening_time' => '09:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 150,
            'image_url' => 'lembang-zoo.jpg',
        ]);

        // Tambahan destinasi untuk variasi
        $saungAngklung = Destination::create([
            'zone_id' => $kotaBandung->id,
            'category_id' => $budaya->id,
            'name' => 'Saung Angklung Udjo',
            'description' => 'Pertunjukan angklung dan seni budaya Sunda',
            'latitude' => -6.9053,
            'longitude' => 107.6589,
            'rating' => 4.7,
            'opening_time' => '15:30:00',
            'closing_time' => '18:00:00',
            'avg_visit_duration_minutes' => 120,
            'image_url' => 'angklung-udjo.jpg',
        ]);

        $transstudio = Destination::create([
            'zone_id' => $kotaBandung->id,
            'category_id' => $keluarga->id,
            'name' => 'Trans Studio Bandung',
            'description' => 'Theme park indoor terbesar di Indonesia',
            'latitude' => -6.9281,
            'longitude' => 107.6372,
            'rating' => 4.4,
            'opening_time' => '09:00:00',
            'closing_time' => '18:00:00',
            'avg_visit_duration_minutes' => 300,
            'image_url' => 'trans-studio.jpg',
        ]);

        $caringinTilu = Destination::create([
            'zone_id' => $bandungUtara->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Taman Hutan Raya Ir. H. Djuanda',
            'description' => 'Taman hutan dengan Curug Dago dan Gua Belanda',
            'latitude' => -6.8394,
            'longitude' => 107.6117,
            'rating' => 4.3,
            'opening_time' => '07:00:00',
            'closing_time' => '17:00:00',
            'avg_visit_duration_minutes' => 180,
            'image_url' => 'tahura.jpg',
        ]);

        $punclak_bintang = Destination::create([
            'zone_id' => $rancaupas->id,
            'category_id' => $wisataAlam->id,
            'name' => 'Puncak Bintang',
            'description' => 'Spot foto dengan pemandangan pegunungan 360 derajat',
            'latitude' => -7.1000,
            'longitude' => 107.4333,
            'rating' => 4.6,
            'best_visit_time' => '06:00:00',
            'opening_time' => '05:00:00',
            'closing_time' => '18:00:00',
            'avg_visit_duration_minutes' => 90,
            'image_url' => 'puncak-bintang.jpg',
        ]);

        // ========================================
        // 6. TICKET VARIANTS
        // ========================================

        // Tangkuban Perahu
        TicketVariant::create(['destination_id' => $tangkubanPerahu->id, 'name' => 'Weekday - Lokal', 'price' => 30000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $tangkubanPerahu->id, 'name' => 'Weekend - Lokal', 'price' => 50000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $tangkubanPerahu->id, 'name' => 'Wisatawan Asing', 'price' => 200000, 'is_mandatory' => true]);

        // Kawah Putih
        TicketVariant::create(['destination_id' => $kawahPutih->id, 'name' => 'Weekday - Lokal', 'price' => 25000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $kawahPutih->id, 'name' => 'Weekend - Lokal', 'price' => 40000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $kawahPutih->id, 'name' => 'Parkir Motor', 'price' => 5000, 'is_mandatory' => false]);
        TicketVariant::create(['destination_id' => $kawahPutih->id, 'name' => 'Parkir Mobil', 'price' => 10000, 'is_mandatory' => false]);

        // Farmhouse
        TicketVariant::create(['destination_id' => $farmhouse->id, 'name' => 'Tiket Masuk', 'price' => 25000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $farmhouse->id, 'name' => 'Feeding Animals', 'price' => 10000, 'is_mandatory' => false]);

        // Trans Studio
        TicketVariant::create(['destination_id' => $transstudio->id, 'name' => 'Weekday - Dewasa', 'price' => 200000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $transstudio->id, 'name' => 'Weekday - Anak', 'price' => 150000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $transstudio->id, 'name' => 'Weekend - Dewasa', 'price' => 300000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $transstudio->id, 'name' => 'Weekend - Anak', 'price' => 250000, 'is_mandatory' => true]);

        // Floating Market
        TicketVariant::create(['destination_id' => $floatingMarket->id, 'name' => 'Tiket Masuk', 'price' => 20000, 'is_mandatory' => true]);

        // Dago Dream Park
        TicketVariant::create(['destination_id' => $dagoDreamPark->id, 'name' => 'Weekday', 'price' => 20000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $dagoDreamPark->id, 'name' => 'Weekend', 'price' => 25000, 'is_mandatory' => true]);

        // Saung Angklung
        TicketVariant::create(['destination_id' => $saungAngklung->id, 'name' => 'Paket Show', 'price' => 100000, 'is_mandatory' => true]);

        // Tebing Keraton (Gratis tapi ada donation)
        TicketVariant::create(['destination_id' => $tebing_keraton->id, 'name' => 'Donasi Sukarela', 'price' => 5000, 'is_mandatory' => false]);

        // Curug Cimahi
        TicketVariant::create(['destination_id' => $curug_cimahi->id, 'name' => 'Tiket Masuk', 'price' => 15000, 'is_mandatory' => true]);

        // Museum Asia Afrika
        TicketVariant::create(['destination_id' => $asiaAfrika->id, 'name' => 'Tiket Dewasa', 'price' => 10000, 'is_mandatory' => true]);
        TicketVariant::create(['destination_id' => $asiaAfrika->id, 'name' => 'Tiket Anak', 'price' => 5000, 'is_mandatory' => true]);

        // Observatorium Bosscha
        TicketVariant::create(['destination_id' => $observatorium->id, 'name' => 'Tiket Tur', 'price' => 20000, 'is_mandatory' => true]);

        // ========================================
        // 7. TRANSPORT RATES
        // ========================================
        TransportRate::create([
            'transport_type' => 'MOTOR',
            'base_fare' => 5000,
            'rate_per_km' => 2500,
        ]);

        TransportRate::create([
            'transport_type' => 'CAR',
            'base_fare' => 10000,
            'rate_per_km' => 4000,
        ]);

        // ========================================
        // 8. SAMPLE ITINERARY
        // ========================================
        $itinerary1 = Itinerary::create([
            'user_id' => $user1->id,
            'city_id' => $bandung->id,
            'title' => 'Liburan Keluarga ke Lembang',
            'description' => 'Trip 2 hari 1 malam ke Lembang dengan keluarga',
            'start_date' => '2026-02-15',
            'end_date' => '2026-02-16',
            'total_pax_count' => 4,
            'transportation_preference' => 'CAR',
        ]);

        // Day 1
        $item1 = ItineraryItem::create([
            'itinerary_id' => $itinerary1->id,
            'destination_id' => $tangkubanPerahu->id,
            'day_number' => 1,
            'sequence_order' => 1,
            'est_start_time' => '09:00:00',
            'est_end_time' => '11:00:00',
            'dist_from_prev_km' => 0,
            'transportation_mode' => 'CAR',
            'est_transport_cost' => 0,
        ]);

        ItineraryItemDetail::create([
            'itinerary_item_id' => $item1->id,
            'ticket_variant_id' => 2, // Weekend - Lokal
            'quantity' => 4,
            'sub_total' => 200000, // 50000 x 4
        ]);

        $item2 = ItineraryItem::create([
            'itinerary_id' => $itinerary1->id,
            'destination_id' => $farmhouse->id,
            'day_number' => 1,
            'sequence_order' => 2,
            'est_start_time' => '13:00:00',
            'est_end_time' => '15:00:00',
            'dist_from_prev_km' => 8.5,
            'transportation_mode' => 'CAR',
            'est_transport_cost' => 44000, // 10000 + (8.5 * 4000)
        ]);

        ItineraryItemDetail::create([
            'itinerary_item_id' => $item2->id,
            'ticket_variant_id' => 8, // Tiket Masuk Farmhouse
            'quantity' => 4,
            'sub_total' => 100000, // 25000 x 4
        ]);

        // Day 2
        $item3 = ItineraryItem::create([
            'itinerary_id' => $itinerary1->id,
            'destination_id' => $floatingMarket->id,
            'day_number' => 2,
            'sequence_order' => 1,
            'est_start_time' => '10:00:00',
            'est_end_time' => '12:00:00',
            'dist_from_prev_km' => 2.3,
            'transportation_mode' => 'CAR',
            'est_transport_cost' => 19200, // 10000 + (2.3 * 4000)
        ]);

        ItineraryItemDetail::create([
            'itinerary_item_id' => $item3->id,
            'ticket_variant_id' => 14, // Tiket Floating Market
            'quantity' => 4,
            'sub_total' => 80000, // 20000 x 4
        ]);

        // Lodging
        ItineraryLodging::create([
            'itinerary_id' => $itinerary1->id,
            'name' => 'Hotel Grand Lembang',
            'latitude' => -6.8125,
            'longitude' => 107.6158,
            'check_in_date' => '2026-02-15',
            'check_out_date' => '2026-02-16',
            'cost_per_night' => 500000,
            'total_cost' => 500000,
        ]);

        // ========================================
        // 9. ITINERARY 2 - WISATA ALAM CIWIDEY
        // ========================================
        $itinerary2 = Itinerary::create([
            'user_id' => $user2->id,
            'city_id' => $bandung->id,
            'title' => 'Petualangan Ciwidey - Kawah Putih & Rancabali',
            'description' => 'Explore keindahan alam Ciwidey',
            'start_date' => '2026-03-20',
            'end_date' => '2026-03-20',
            'total_pax_count' => 2,
            'transportation_preference' => 'MOTOR',
        ]);

        $item4 = ItineraryItem::create([
            'itinerary_id' => $itinerary2->id,
            'destination_id' => $kawahPutih->id,
            'day_number' => 1,
            'sequence_order' => 1,
            'est_start_time' => '08:00:00',
            'est_end_time' => '10:00:00',
            'dist_from_prev_km' => 0,
            'transportation_mode' => 'MOTOR',
            'est_transport_cost' => 0,
        ]);

        ItineraryItemDetail::create([
            'itinerary_item_id' => $item4->id,
            'ticket_variant_id' => 4, // Weekday Kawah Putih
            'quantity' => 2,
            'sub_total' => 50000, // 25000 x 2
        ]);

        $item5 = ItineraryItem::create([
            'itinerary_id' => $itinerary2->id,
            'destination_id' => $situ_patenggang->id,
            'day_number' => 1,
            'sequence_order' => 2,
            'est_start_time' => '11:00:00',
            'est_end_time' => '13:00:00',
            'dist_from_prev_km' => 6.2,
            'transportation_mode' => 'MOTOR',
            'est_transport_cost' => 20500, // 5000 + (6.2 * 2500)
        ]);

        echo "\n✅ Database seeding completed successfully!\n";
        echo "📊 Summary:\n";
        echo "   - Users: " . User::count() . "\n";
        echo "   - Cities: " . City::count() . "\n";
        echo "   - Categories: " . Category::count() . "\n";
        echo "   - Zones: " . Zone::count() . "\n";
        echo "   - Destinations: " . Destination::count() . "\n";
        echo "   - Ticket Variants: " . TicketVariant::count() . "\n";
        echo "   - Transport Rates: " . TransportRate::count() . "\n";
        echo "   - Itineraries: " . Itinerary::count() . "\n";
    }
}
