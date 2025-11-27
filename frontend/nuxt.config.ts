// ~/ortho/frontend/nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  ssr: true,
  srcDir: 'app/',
  serverDir: 'app/server',
  typescript: {
    strict: true,
    tsConfig: {
      include: [
        // App kodas
        'app/**/*',
        // Serverio API ir utiliai
        'server/**/*.ts',
        'server/**/*.d.ts',
        // i18n ir shared tipai (jei naudojami)
        'i18n/**/*',
        'shared/**/*.d.ts',
        // Root *.d.ts
        '*.d.ts'
      ],
      compilerOptions: {
        // Jei reikia papildomų tipų – pridėk čia, pvz.:
        // types: ['node'],
      }
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],

  // ✅ Prod-friendly
  nitro: {
    preset: 'node-server',
    //inlineDependencies: true,
    externals: { inline: ['vue', 'vue-router', '@vue/*', '@unhead/*', 'unhead'] }
    // externals: {
      // Paliekam default – NEstumiam 'vue' į inline
   //   inline: []
  //  }
    // prerender: { crawlLinks: false, routes: [], failOnError: false }
  },

  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },

  // vite: { ssr: { noExternal: [] } },

  vite: {
    resolve: {
      alias: {
        // Jei pas tave buvo kažkas tokio: 'vue': 'vue/dist/vue.runtime.esm-bundler.js'
        // — BŪTINAI ištrink. Čia turi būti tuščia.
      }
    },
    ssr: {
      noExternal:  ['vue', '@vue/*', 'vue-router', '@unhead/*', 'unhead']
    }
  },


  // ✅ Be 'sharp' binarų
  image: {
    provider: 'ipx'
  },

  devtools: { enabled: false },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },  
  


  i18n: {
    defaultLocale: 'ru',
    locales: [{ code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' }],
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    // Su srcDir:'app/' lokalizacijas laikom app/locales/
    langDir: 'locales',
    vueI18n: './i18n.config.ts'
  },
  runtimeConfig: {
    // SERVER-ONLY: į Strapi konteinerį
    cmsInternalUrl: process.env.CMS_INTERNAL_URL || 'http://cms:1337',

    // Meili ir kita server-only jei reikia
    meiliHost: process.env.MEILI_HOST || 'http://meili:7700',
    meiliKey: process.env.MEILI_SEARCH_KEY || process.env.MEILI_MASTER_KEY,
    meiliIndexProducts: process.env.MEILI_INDEX_PRODUCTS || 'products',
    meiliIndexCategories: process.env.MEILI_INDEX_CATEGORIES || 'categories',
    meiliIndexSubcategories: process.env.MEILI_INDEX_SUBCATEGORIES || 'sub-categories',

    public: {
      // PUBLIC: naršyklei – per Nginx sub-path /cms
      apiBase: process.env.CMS_PUBLIC_URL || '/cms',
      meiliHost: process.env.NUXT_PUBLIC_MEILI_HOST || '/meili'
    }
  }
})

