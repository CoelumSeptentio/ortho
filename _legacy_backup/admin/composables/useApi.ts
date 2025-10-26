export const useApi = () => {
  const base = useRuntimeConfig().public.cmsBase || '/cms'
  return $fetch.create({ baseURL: base })
}