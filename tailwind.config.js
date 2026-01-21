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
                    // Main Background
                background: '#f9f4ef',

                // Text Colors
                headline: '#020826',
                paragraph: '#716040',

                // UI Elements
                button: '#8c7851',
                'button-text': '#fffffe',

                // Illustration / Accents
                stroke: '#020826',
                main: '#fffffe',
                highlight: '#8c7851',
                secondary: '#eaddcf',
                tertiary: '#f25042', // Warna merah/coral untuk aksen
        },
        },
    },

    plugins: [forms],
};
