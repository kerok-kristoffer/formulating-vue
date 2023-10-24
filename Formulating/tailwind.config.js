/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        128: '32rem',
        256: '64rem'
      },
      screens: {
        print: { raw: 'print' }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
