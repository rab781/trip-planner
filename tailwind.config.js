import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
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
            },

            colors: {
            serute: {
                purple: '#A855F7', // Primary Accent / Logo Top
                blue: '#3B82F6',   // Primary Action / Logo Bottom
                teal: '#0D9488',   // Secondary / Positive indicators
                orange: '#F97316', // Secondary / Urgency indicators
                dark: '#1E293B',   // Headings text
                body: '#475569',   // Paragraph text
                light: '#F8FAFC',  // Main background
                border: '#E2E8F0', // Borders
            }
        },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at center, var(--tw-gradient-stops))',
            },
        },
    },

    plugins: [forms],
};
