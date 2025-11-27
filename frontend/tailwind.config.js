// frontend/tailwind.config.js
module.exports = {
  content: [
    './app/app.vue',
    './app/error.vue',
    './app/components/**/*.{vue,js,ts}',
    './app/pages/**/*.vue',
    './app/layouts/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    // jei naudoji @nuxt/content ir md/yml/json – atkomentuok šitą:
    // './app/content/**/*.{md,yml,json}'
  ],
  theme: { extend: {} },
  plugins: []
}

