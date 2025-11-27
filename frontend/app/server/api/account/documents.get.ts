// frontend/app/server/api/account/documents.get.ts
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const apiBase = cfg.apiBase || 'http://cms:1337'
  const publicBase = (cfg.public?.apiBase as string) || '/cms'

  const token = getCookie(event, 'auth_token') || ''
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const q = getQuery(event) as Record<string, string>
  const pageSize = q['pagination[pageSize]'] || '100'

  const headers = { Authorization: `Bearer ${token}` }

  // padėjėjas URL suformavimui
  const toAbs = (p?: string | null) => {
    if (!p) return null
    if (p.startsWith('http://') || p.startsWith('https://')) return p
    return `${publicBase}${p}` // pvz. /cms + /uploads/...
  }

  const human = (n?: number | null) => {
    if (typeof n !== 'number') return null
    if (n < 1024) return `${n} B`
    const kb = n / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  // --- 1) bandome per custom route /client-docs/me
  const fetchMeDocs = async () => {
    return await $fetch<any>(`${apiBase}/api/client-docs/me`, {
      headers,
      params: {
        'pagination[pageSize]': pageSize,
        'populate': '*',
        'publicationState': 'live',
      },
    })
  }

  // --- 2) fallback: user id → filters[owner][id][$eq]
  const fetchByOwnerId = async () => {
    const me = await $fetch<any>(`${apiBase}/api/users/me`, { headers })
    const uid = me?.id
    if (!uid) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    return await $fetch<any>(`${apiBase}/api/client-docs`, {
      headers,
      params: {
        'filters[owner][id][$eq]': String(uid),
        'pagination[pageSize]': pageSize,
        'populate': '*',
        'publicationState': 'live',
      },
    })
  }

  let res: any
  try {
    try {
      res = await fetchMeDocs()
    } catch (err: any) {
      // jei nėra custom route ar 404 – pereinam prie fallback
      const st = err?.statusCode ?? err?.response?.status
      if (st === 404) {
        res = await fetchByOwnerId()
      } else {
        throw err
      }
    }

    const rows = Array.isArray(res?.data) ? res.data : []
    const items = rows.map((row: any) => {
      const a = row?.attributes ?? row ?? {}
      const f = a?.file?.data?.attributes ?? a?.file ?? {}

      const fileUrl: string | null = f?.url || null
      const fileName: string | null = f?.name || null
      const mime: string | null = f?.mime || null
      const size: number | null = typeof f?.size === 'number' ? f.size : null

      
      const title = fileName || a?.title || a?.name || 'Без названия'
      const ext = fileName?.includes('.') ? fileName.split('.').pop()!
                : (mime ? mime.split('/').pop()! : '')

      const downloadName = fileName || (ext ? `${title}.${ext}` : title)

      return {
        id: row?.id ?? a?.id,
        title,
        description: a?.description ?? a?.notes ?? null,
        updatedAt: a?.updatedAt ?? a?.createdAt ?? null,
        fileUrl,
        fileUrlFull: toAbs(fileUrl),
        fileName,
        downloadName,
        mime,
        ext,
        size,
        sizeHuman: human(size),
      }
    })

    return { items, meta: res?.meta || {} }
  } catch (err: any) {
    // aiškus log’as į serverio konsolę
    console.error('[documents.get] error:', {
      status: err?.statusCode ?? err?.response?.status,
      message: err?.message,
      data: err?.data,
    })
    const status = err?.statusCode ?? err?.response?.status ?? 500
    const msg = err?.data?.error?.message || err?.message || 'Server Error'
    throw createError({ statusCode: status, statusMessage: msg })
  }
})
