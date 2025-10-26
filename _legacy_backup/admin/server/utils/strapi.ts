export async function strapiFetch<T>(event:any, path:string, opts:any = {}) {
  const { strapi } = useRuntimeConfig()
  const token = getToken(event)
  const headers = { ...(opts.headers||{}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  return $fetch<T>(`${strapi.baseURL}${path}`, { ...opts, headers })
}
