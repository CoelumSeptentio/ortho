import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const jwt = getCookie(event, 'auth_token')
  if (!jwt) return { ok: false }

  try {
    const apiBase =
      (cfg.apiBase || process.env.CMS_INTERNAL_URL || 'http://cms:1337')
        .replace(/\/$/, '')

    // Strapi v4: /api/users/me
    const me: any = await $fetch(`${apiBase}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    return { ok: true, user: { id: me.id, email: me.email, username: me.username } }
  } catch {
    return { ok: false }
  }
})
