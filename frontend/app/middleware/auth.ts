// app/middleware/auth.ts
// frontend/app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // SSR pusėje – pakanka patikrinti httpOnly slapuką
  if (process.server) {
    const token = useCookie('auth_token')
    if (!token.value && to.path !== '/auth/login') {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    return
  }

  // Kliente – tikrinam per serverio API, būtina priduoti tipą:
  const { data } = await useFetch<{ ok: boolean }>('/api/auth/me', { method: 'GET' })
  if (!data.value?.ok && to.path !== '/auth/login') {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
