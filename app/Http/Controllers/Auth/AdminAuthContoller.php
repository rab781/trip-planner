<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
   /**
     * Get authenticated user (with proper type hint)
     *
     * @return User|null
     */
    
    public function showLoginForm()
    {
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            // Cek role HARUS admin
            if (Auth::user()->isAdmin()) {
                $request->session()->regenerate();
                return redirect()->intended(route('admin.dashboard'));
            }

            // Kalau bukan admin, logout paksa
            Auth::logout();
            return back()->withErrors([
                'email' => 'Access denied. Admin credentials required.',
            ]);
        }

        return back()->withErrors([
            'email' => 'Invalid credentials.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }
}
