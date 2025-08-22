export default defineNuxtConfig({
  ssr: true,

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image', ],

  nitro: {
    preset: 'node',
    prerender: { crawlLinks: false, routes: [], failOnError: false }
  },

  vite: {
    // kad SSR bundleris nesipyktų su ESM/CJS
    ssr: { noExternal: ['vue', 'vue-router', '@vue/*', '@vue/server-renderer'] }
  },

  i18n: {
    // Puslapis rusiškai – ok.
    defaultLocale: 'ru',
    locales: [{ code: 'ru', iso: 'ru-RU', name: 'Русский' }],
    strategy: 'prefix_except_default',

    // svarbiausia vieta: paduodam OBJEKTĄ, ne kelią į failą
    vueI18n: {
      legacy: false,
      locale: 'ru',
      fallbackLocale: 'ru',
      messages: {
        ru: {
          hello: 'Привет!'
        }
      }
    }
  }
})
