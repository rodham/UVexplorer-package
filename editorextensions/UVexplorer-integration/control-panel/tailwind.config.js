/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {}
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['corporate'],
        styled: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false
    }
};
