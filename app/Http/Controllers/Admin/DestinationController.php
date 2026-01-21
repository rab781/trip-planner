<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Zone;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DestinationController extends Controller
{
    /**
     * Display a listing of the destinations.
     */
    public function index(Request $request)
    {
        $query = Destination::with(['zone', 'category', 'ticketVariants']);

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Filter by zone
        if ($request->filled('zone_id')) {
            $query->where('zone_id', $request->zone_id);
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $destinations = $query->orderBy('name')->paginate(15);
        $zones = Zone::all();
        $categories = Category::all();

        return Inertia::render('Admin/Destinations/Index', [
            'destinations' => $destinations,
            'zones' => $zones,
            'categories' => $categories,
            'filters' => $request->only(['search', 'zone_id', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new destination.
     */
    public function create()
    {
        $zones = Zone::all();
        $categories = Category::all();

        return Inertia::render('Admin/Destinations/Create', [
            'zones' => $zones,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created destination in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'zone_id' => 'required|exists:zones,id',
            'category_id' => 'required|exists:categories,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'avg_duration_minutes' => 'nullable|integer|min:0',
            'opening_hours' => 'nullable|string|max:255',
            'thumbnail' => 'nullable|image|max:2048',
            'ticket_variants' => 'nullable|array',
            'ticket_variants.*.name' => 'required|string|max:255',
            'ticket_variants.*.price' => 'required|numeric|min:0',
            'ticket_variants.*.is_mandatory' => 'boolean',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('destinations', 'public');
        }

        // Create destination
        $destination = Destination::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'zone_id' => $validated['zone_id'],
            'category_id' => $validated['category_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address' => $validated['address'] ?? null,
            'avg_duration_minutes' => $validated['avg_duration_minutes'] ?? 60,
            'opening_hours' => $validated['opening_hours'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
        ]);

        // Create ticket variants
        if (!empty($validated['ticket_variants'])) {
            foreach ($validated['ticket_variants'] as $variant) {
                $destination->ticketVariants()->create([
                    'name' => $variant['name'],
                    'price' => $variant['price'],
                    'is_mandatory' => $variant['is_mandatory'] ?? false,
                ]);
            }
        }

        return redirect()
            ->route('destinations.index')
            ->with('success', 'Destinasi berhasil ditambahkan');
    }

    /**
     * Display the specified destination.
     */
    public function show($id)
    {
        $destination = Destination::with(['zone', 'category', 'ticketVariants'])->findOrFail($id);

        return Inertia::render('Admin/Destinations/Show', [
            'destination' => $destination,
        ]);
    }

    /**
     * Show the form for editing the specified destination.
     */
    public function edit($id)
    {
        $destination = Destination::with(['zone', 'category', 'ticketVariants'])->findOrFail($id);
        $zones = Zone::all();
        $categories = Category::all();

        return Inertia::render('Admin/Destinations/Edit', [
            'destination' => $destination,
            'zones' => $zones,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified destination in storage.
     */
    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'zone_id' => 'required|exists:zones,id',
            'category_id' => 'required|exists:categories,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'avg_duration_minutes' => 'nullable|integer|min:0',
            'opening_hours' => 'nullable|string|max:255',
            'thumbnail' => 'nullable|image|max:2048',
            'ticket_variants' => 'nullable|array',
            'ticket_variants.*.id' => 'nullable|exists:ticket_variants,id',
            'ticket_variants.*.name' => 'required|string|max:255',
            'ticket_variants.*.price' => 'required|numeric|min:0',
            'ticket_variants.*.is_mandatory' => 'boolean',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($destination->thumbnail) {
                Storage::disk('public')->delete($destination->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('destinations', 'public');
        }

        // Update destination
        $destination->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'zone_id' => $validated['zone_id'],
            'category_id' => $validated['category_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'address' => $validated['address'] ?? null,
            'avg_duration_minutes' => $validated['avg_duration_minutes'] ?? 60,
            'opening_hours' => $validated['opening_hours'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? $destination->thumbnail,
        ]);

        // Sync ticket variants
        if (isset($validated['ticket_variants'])) {
            $existingIds = [];

            foreach ($validated['ticket_variants'] as $variant) {
                if (!empty($variant['id'])) {
                    // Update existing
                    $destination->ticketVariants()->where('id', $variant['id'])->update([
                        'name' => $variant['name'],
                        'price' => $variant['price'],
                        'is_mandatory' => $variant['is_mandatory'] ?? false,
                    ]);
                    $existingIds[] = $variant['id'];
                } else {
                    // Create new
                    $newVariant = $destination->ticketVariants()->create([
                        'name' => $variant['name'],
                        'price' => $variant['price'],
                        'is_mandatory' => $variant['is_mandatory'] ?? false,
                    ]);
                    $existingIds[] = $newVariant->id;
                }
            }

            // Delete removed variants
            $destination->ticketVariants()->whereNotIn('id', $existingIds)->delete();
        }

        return redirect()
            ->route('destinations.index')
            ->with('success', 'Destinasi berhasil diperbarui');
    }

    /**
     * Remove the specified destination from storage.
     */
    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);

        // Delete thumbnail
        if ($destination->thumbnail) {
            Storage::disk('public')->delete($destination->thumbnail);
        }

        // Delete ticket variants (cascade should handle this, but just in case)
        $destination->ticketVariants()->delete();

        $destination->delete();

        return redirect()
            ->route('destinations.index')
            ->with('success', 'Destinasi berhasil dihapus');
    }
}
