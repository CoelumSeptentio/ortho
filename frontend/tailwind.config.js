// frontend/tailwind.config.js
module.exports = {
  content: [
    './app.vue',
    './error.vue',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.vue',
    './layouts/**/*.vue',
    './plugins/**/*.{js,ts}',
    // jei naudosite Content modulį ar Markdown:
    './content/**/*.{md,yml,json}'
  ],
  theme: { extend: {} },
  plugins: []
}
