import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', 'sans-serif'], // Premium display font
            },

            colors: {
                // Main Backgrounds
                background: {
                    light: '#fdfbf7', // Soft Sand
                    dark: '#0f172a',  // Midnight Slate
                    DEFAULT: '#fdfbf7',
                },

                // Semantic Colors
                brand: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e', // Primary Brand (Deep Ocean Teal)
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                    DEFAULT: '#0f766e',
                },

                accent: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // Primary Accent (Sunset Gold)
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    DEFAULT: '#f59e0b',
                },

                surface: {
                    light: '#ffffff',
                    dark: '#1e293b',
                    card: '#ffffff',
                    'card-dark': '#1e293b',
                },

                // Text Colors
                headline: {
                    light: '#0f172a',
                    dark: '#f1f5f9',
                },
                paragraph: {
                    light: '#475569',
                    dark: '#94a3b8',
                },
            },

            // Custom Animation
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float 5s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 3s ease infinite',
                'step-appear': 'stepAppear 0.5s ease-out forwards',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseSoft: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(13, 148, 136, 0.4)' },
                    '50%': { boxShadow: '0 0 0 12px rgba(13, 148, 136, 0)' },
                },
                gradientShift: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                stepAppear: {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            },

            // Box shadow for cards
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'glow-brand': '0 0 20px rgba(15, 118, 110, 0.5)',
                'glow-accent': '0 0 20px rgba(245, 158, 11, 0.5)',
            },
        },
    },

    plugins: [forms],
};
