// frontend/app/composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()

  // SSR: paimam vartotojo auth antraštes iš įeinančios užklausos
  const serverHeaders = process.server
    ? useRequestHeaders(['cookie', 'authorization'])
    : {}

  const baseURL = process.server
    ? (config.apiBase as string)          // http://cms:1337 (vidinis)
    : (config.public.apiBase as string)   // /cms (per Nginx)

  return $fetch.create({
    baseURL,
    headers: serverHeaders,
    credentials: process.client ? 'include' : undefined, // jei naudojate cookie
  })
}
