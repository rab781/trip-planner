<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->withCount('itineraries')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Toggle user role between 'user' and 'admin'.
     */
    public function toggleRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent self-demotion
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat mengubah role sendiri');
        }

        // Toggle role
        $user->role = $user->role === 'admin' ? 'user' : 'admin';
        $user->save();

        $roleLabel = $user->role === 'admin' ? 'Admin' : 'User';

        return back()->with('success', "Role {$user->name} berhasil diubah menjadi {$roleLabel}");
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::with(['itineraries' => function ($query) {
            $query->with('city')
                ->withCount('itineraryItems')
                ->orderBy('created_at', 'desc')
                ->limit(5);
        }])->findOrFail($id);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }
}
