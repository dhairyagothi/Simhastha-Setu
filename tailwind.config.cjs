module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FFF7ED'
        },
        'saffron-glow': '#FFF7ED'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
