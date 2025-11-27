// frontend/app/server/api/auth/login.post.ts
// frontend/app/server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const body = await readBody<{ identifier?: string; email?: string; password?: string }>(event)

  // 👇 DEBUG
  console.log('[login] cfg.apiBase =', cfg.apiBase, ' | public.apiBase =', cfg.public?.apiBase)
  console.log('[login] raw body =', body)

  const identifier = (body?.identifier ?? body?.email ?? '').trim()
  const password   = (body?.password ?? '').trim()

  if (!identifier || !password) {
    console.error('[login] MISSING CREDENTIALS', { identifierLen: identifier.length, passwordLen: password.length })
    throw createError({ statusCode: 400, statusMessage: 'Missing credentials' })
  }

  const apiBase = (cfg.apiBase || process.env.CMS_INTERNAL_URL || 'http://cms:1337').replace(/\/$/, '')
  console.log('[login] using apiBase =', apiBase)

  try {
    const r = await $fetch.raw(`${apiBase}/api/auth/local`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { identifier, password },
    })
    // 👇 DEBUG
    console.log('[login] strapi status =', r.status, 'headers:', r.headers)

    const data = r._data as any
    setCookie(event, 'auth_token', data.jwt, {
      httpOnly: true, sameSite: 'lax', secure: false, path: '/', maxAge: 60*60*24*30
    })
    return { ok: true, user: { id: data?.user?.id, email: data?.user?.email, username: data?.user?.username } }
  } catch (err: any) {
    // pilnai parodykim, ką grąžina Strapi/$fetch
    console.error('[login] ERROR →', {
      statusCode: err?.statusCode ?? err?.response?.status,
      message: err?.data?.error?.message ?? err?.message,
      data: err?.data, url: err?.request?.url
    })
    throw createError({
      statusCode: err?.statusCode ?? err?.response?.status ?? 401,
      statusMessage: err?.data?.error?.message ?? 'Invalid e-mail or password'
    })
  }
})


