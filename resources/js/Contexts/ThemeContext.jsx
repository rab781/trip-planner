import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create context
const ThemeContext = createContext(undefined);

/**
 * ThemeProvider - Provides theme state to the entire app
 * 
 * Features:
 * - System preference detection
 * - Manual toggle
 * - Persistence via localStorage
 * - Smooth CSS transitions
 */
export function ThemeProvider({ children, defaultTheme = 'system' }) {
    const [theme, setThemeState] = useState('light');
    const [isSystemPreference, setIsSystemPreference] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Initialize theme on mount (client-side only)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setThemeState(savedTheme);
            setIsSystemPreference(false);
        } else {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? 'dark' : 'light');
            setIsSystemPreference(true);
        }
        
        setMounted(true);
    }, []);

    // Apply theme class to document
    useEffect(() => {
        if (!mounted) return;
        
        const root = document.documentElement;
        
        // Add transition class for smooth theme changes
        root.style.setProperty('--theme-transition', 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease');
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme, mounted]);

    // Listen for system preference changes
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            if (isSystemPreference) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [isSystemPreference, mounted]);

    // Set theme manually
    const setTheme = useCallback((newTheme) => {
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
            setIsSystemPreference(true);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? 'dark' : 'light');
        } else {
            localStorage.setItem('theme', newTheme);
            setIsSystemPreference(false);
            setThemeState(newTheme);
        }
    }, []);

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }, [theme, setTheme]);

    // Reset to system preference
    const resetToSystem = useCallback(() => {
        setTheme('system');
    }, [setTheme]);

    const value = {
        theme,
        setTheme,
        toggleTheme,
        resetToSystem,
        isSystemPreference,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        mounted,
    };

    // Prevent flash by not rendering until mounted
    // This ensures server and client render match
    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ ...value, theme: 'light', isDark: false, isLight: true }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useThemeContext - Hook to access theme context
 */
export function useThemeContext() {
    const context = useContext(ThemeContext);
    
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    
    return context;
}

export default ThemeContext;
