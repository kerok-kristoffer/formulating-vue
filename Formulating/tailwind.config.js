/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        128: '32rem',
        256: '64rem'
      },
      screens: {
        print: { raw: 'print' }
      },
      colors: {
        'text-light': '#f8f9fa',
        'text-dark': '#abc6e7',
        'dark-slate-200': '#83b2c0',
        'dark-slate-300': '#5c8996',
        'dark-slate-400': '#466a75',
        'dark-slate-500': '#5c676e',
        'dark-slate-600': '#747a7e',
        'dark-slate-700': '#85898c',
        textColorDarkMode: '#4f545e',
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
