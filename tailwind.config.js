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
                tertiary: '#f25042',
            },

            // Custom Animation
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
                'fade-in-left': 'fadeInLeft 0.5s ease-out forwards',
                'fade-in-right': 'fadeInRight 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'slide-down': 'slideDown 0.4s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float 5s ease-in-out infinite',
                'float-delayed': 'float 4s ease-in-out 1s infinite',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 3s ease infinite',
                'plane-float': 'planeFloat 6s ease-in-out infinite',
                'cloud-drift': 'cloudDrift 20s linear infinite',
                'cloud-drift-slow': 'cloudDrift 30s linear infinite',
                'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
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
                fadeInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100%)' },
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
                planeFloat: {
                    '0%': { transform: 'translate(0, 0) rotate(-5deg)' },
                    '25%': { transform: 'translate(10px, -15px) rotate(0deg)' },
                    '50%': { transform: 'translate(20px, 0) rotate(5deg)' },
                    '75%': { transform: 'translate(10px, 10px) rotate(0deg)' },
                    '100%': { transform: 'translate(0, 0) rotate(-5deg)' },
                },
                cloudDrift: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100vw)' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },

            // Custom transition timing
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },

            // Box shadow for cards
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                'glow-teal': '0 0 20px rgba(13, 148, 136, 0.3)',
                'glow-coral': '0 0 20px rgba(242, 80, 66, 0.3)',
            },
        },
    },

    plugins: [forms],
};
