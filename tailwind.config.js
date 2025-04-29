/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/views/**/*.edge',
    './resources/js/**/*.{js,ts,jsx,tsx}',
    './inertia/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Instrument Sans', 'sans-serif'],
    },
    colors: {
      primary: {
        DEFAULT: '#5A45FF',
      },
    },
  },
  plugins: [],
}
