export default defineNuxtConfig({
  compatibilityDate: '2025-08-22',

  app: {
    baseURL: '/admin/',        // <<< svarbiausia: visi absoliutūs keliai taps /admin/...
    head: { title: 'Admin · ORTOMEDICA' }
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt'],

  runtimeConfig: {
    strapi: { baseURL: process.env.STRAPI_BASE_URL || 'http://cms:1337' },
    public: { cmsBase: process.env.NUXT_PUBLIC_API_BASE || '/cms' }
  },

  vite: {
    server: {
      strictPort: true,
      allowedHosts: ['*'],     // kad galėtum jungtis iš bet kur
      hmr: {
        host: '195.181.245.93', // jei vėliau bus domenas — įrašysi domeną
        protocol: 'ws',
        port: 8080
      }
    }
  }
})
