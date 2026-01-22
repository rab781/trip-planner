import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme - Custom hook for dark/light mode management
 * 
 * Features:
 * - System preference detection (default)
 * - Manual override option
 * - Persistence via localStorage
 * - Smooth transitions
 * 
 * @returns {Object} { theme, setTheme, toggleTheme, isSystemPreference }
 */
export function useTheme() {
    // Initialize state from localStorage or system preference
    const [theme, setThemeState] = useState(() => {
        // Check if running on client
        if (typeof window === 'undefined') {
            return 'light';
        }

        // Check localStorage for saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }

        // Fall back to system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    });

    const [isSystemPreference, setIsSystemPreference] = useState(() => {
        if (typeof window === 'undefined') return true;
        return !localStorage.getItem('theme');
    });

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Only auto-update if user hasn't manually set preference
            if (isSystemPreference) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        
        // Legacy browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [isSystemPreference]);

    // Set theme manually (overrides system preference)
    const setTheme = useCallback((newTheme) => {
        if (newTheme === 'system') {
            // Reset to system preference
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

    return {
        theme,
        setTheme,
        toggleTheme,
        resetToSystem,
        isSystemPreference,
        isDark: theme === 'dark',
        isLight: theme === 'light',
    };
}

export default useTheme;
