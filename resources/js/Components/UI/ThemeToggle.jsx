import React from 'react';
import { useThemeContext } from '@/Contexts/ThemeContext';

/**
 * ThemeToggle - Button component to toggle between light/dark mode
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} props.showLabel - Whether to show text label
 */
export function ThemeToggle({ className = '', size = 'md', showLabel = false }) {
    const { theme, toggleTheme, isSystemPreference, resetToSystem } = useThemeContext();

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={toggleTheme}
                className={`
                    ${sizes[size]}
                    relative rounded-full
                    bg-gray-100 dark:bg-gray-800
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    border border-gray-200 dark:border-gray-600
                    transition-all duration-300 ease-out
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                    dark:focus:ring-offset-gray-900
                    overflow-hidden
                    group
                `}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {/* Sun Icon */}
                <span
                    className={`
                        absolute inset-0 flex items-center justify-center
                        transition-all duration-300 ease-out
                        ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}
                    `}
                >
                    <svg
                        className={`${iconSizes[size]} text-amber-500`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <circle cx="12" cy="12" r="4" fill="currentColor" />
                        <path
                            strokeLinecap="round"
                            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                        />
                    </svg>
                </span>

                {/* Moon Icon */}
                <span
                    className={`
                        absolute inset-0 flex items-center justify-center
                        transition-all duration-300 ease-out
                        ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}
                    `}
                >
                    <svg
                        className={`${iconSizes[size]} text-indigo-400`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                </span>
            </button>

            {showLabel && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                    {isSystemPreference && ' (Auto)'}
                </span>
            )}
        </div>
    );
}

/**
 * ThemeSelector - Dropdown for theme selection (light/dark/system)
 */
export function ThemeSelector({ className = '' }) {
    const { theme, setTheme, isSystemPreference } = useThemeContext();

    const currentValue = isSystemPreference ? 'system' : theme;

    return (
        <div className={`relative ${className}`}>
            <select
                value={currentValue}
                onChange={(e) => setTheme(e.target.value)}
                className="
                    appearance-none
                    w-full px-4 py-2 pr-10
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-600
                    rounded-lg
                    text-gray-700 dark:text-gray-200
                    text-sm
                    cursor-pointer
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                "
                aria-label="Select theme"
            >
                <option value="light">☀️ Light</option>
                <option value="dark">🌙 Dark</option>
                <option value="system">💻 System</option>
            </select>
            
            {/* Dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

export default ThemeToggle;
