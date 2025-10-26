import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  // leisti /login ir /admin/login
  if (to.path.endsWith('/login')) return

  try {
    await $fetch('/api/auth/me')
  } catch {
    return navigateTo('/login') // su app.baseURL tai /admin/login
  }
})
