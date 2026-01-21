<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZoneController extends Controller
{
    /**
     * Display a listing of zones.
     */
    public function index(Request $request)
    {
        $query = Zone::with('city')->withCount('destinations');

        // Filter by city
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $zones = $query->orderBy('name')->paginate(15);
        $cities = City::all();

        return Inertia::render('Admin/Zones/Index', [
            'zones' => $zones,
            'cities' => $cities,
            'filters' => $request->only(['city_id']),
        ]);
    }

    /**
     * Show the form for creating a new zone.
     */
    public function create()
    {
        $cities = City::all();

        return Inertia::render('Admin/Zones/Create', [
            'cities' => $cities,
        ]);
    }

    /**
     * Store a newly created zone in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
            'description' => 'nullable|string',
            'center_latitude' => 'nullable|numeric|between:-90,90',
            'center_longitude' => 'nullable|numeric|between:-180,180',
        ]);

        Zone::create($validated);

        return redirect()
            ->route('admin.zones.index')
            ->with('success', 'Zona berhasil ditambahkan');
    }

    /**
     * Display the specified zone.
     */
    public function show($id)
    {
        $zone = Zone::with(['city', 'destinations' => function ($query) {
            $query->with('category')->limit(10);
        }])->withCount('destinations')->findOrFail($id);

        return Inertia::render('Admin/Zones/Show', [
            'zone' => $zone,
        ]);
    }

    /**
     * Show the form for editing the specified zone.
     */
    public function edit($id)
    {
        $zone = Zone::with('city')->findOrFail($id);
        $cities = City::all();

        return Inertia::render('Admin/Zones/Edit', [
            'zone' => $zone,
            'cities' => $cities,
        ]);
    }

    /**
     * Update the specified zone in storage.
     */
    public function update(Request $request, $id)
    {
        $zone = Zone::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
            'description' => 'nullable|string',
            'center_latitude' => 'nullable|numeric|between:-90,90',
            'center_longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $zone->update($validated);

        return redirect()
            ->route('admin.zones.index')
            ->with('success', 'Zona berhasil diperbarui');
    }

    /**
     * Remove the specified zone from storage.
     */
    public function destroy($id)
    {
        $zone = Zone::withCount('destinations')->findOrFail($id);

        // Prevent deletion if zone has destinations
        if ($zone->destinations_count > 0) {
            return back()->with('error', 'Zona tidak dapat dihapus karena masih memiliki destinasi');
        }

        $zone->delete();

        return redirect()
            ->route('admin.zones.index')
            ->with('success', 'Zona berhasil dihapus');
    }
}
