// server/api/search.get.ts
import type { H3Event, EventHandlerRequest } from 'h3'

/** ——— Tipai ——— */
type Id = number | string

interface ImageLite {
  url: string
  alt?: string | null
}

interface ProductHit {
  id?: Id
  title: string
  slug?: string | null
  price?: number | null
  description?: string | null
  images?: ImageLite[]
}

interface CategoryHit {
  id?: Id
  title: string
  slug?: string | null
  image?: string | { url: string } | null
}

interface SearchResponse {
  engine: 'meili' | 'strapi' | 'none'
  products: ProductHit[]
  categories: CategoryHit[]
  subcategories: CategoryHit[]
}

/** ——— Utils ——— */
function cmsPublicBase(): string {
  const cfg = useRuntimeConfig()
  // naršyklės matomas kelias (Nginx reverse proxy): /cms
  return (cfg.public?.apiBase as string) || '/cms'
}

function toPublicUrl(u?: string | null): string | null {
  if (!u) return null
  // jei absoliutus – paliekam
  if (/^https?:\/\//i.test(u)) return u
  // Strapi /uploads → /cms/uploads
  if (u.startsWith('/uploads')) return `${cmsPublicBase()}${u}`
  return u
}

function normImageList(raw: any): ImageLite[] {
  // Strapi v4/v5 images.data (array or single)
  const data = raw?.data ?? raw
  const arr = Array.isArray(data) ? data : data ? [data] : []
  const out: ImageLite[] = []
  for (const it of arr) {
    const f = it?.attributes ?? it
    const fm = f?.formats ?? {}
    const best: string | null =
      fm?.large?.url ?? fm?.medium?.url ?? fm?.small?.url ?? fm?.thumbnail?.url ?? f?.url ?? null
    const url = toPublicUrl(best)
    if (url) out.push({ url, alt: f?.alternativeText ?? null })
  }
  return out
}

/** ——— Strapi fallback ——— */
async function strapiFallback(
  _event: H3Event<EventHandlerRequest>,
  q: string,
  limit = 12
): Promise<SearchResponse> {
  const cfg = useRuntimeConfig()
  // server-side vidaus adresas (docker tinkle): http://cms:1337
  const cmsInternal = (cfg.apiBase as string) || 'http://cms:1337'

  // Produktai
  const prodRes = await $fetch<{ data: any[] }>(`${cmsInternal}/api/products`, {
    query: {
      'filters[$or][0][title][$containsi]': q,
      'filters[$or][1][description][$containsi]': q,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'price',
      'fields[3]': 'description',
      'pagination[pageSize]': limit,
      'populate[images][fields][0]': 'url',
      'populate[images][fields][1]': 'formats',
      'populate[images][fields][2]': 'alternativeText'
    }
  }).catch(() => ({ data: [] }))

  const products: ProductHit[] = (prodRes.data || []).map((x: any) => {
    const a = x?.attributes ?? x
    return {
      id: x?.id,
      title: a?.title ?? '',
      slug: a?.slug ?? null,
      price: a?.price ?? null,
      description: a?.description ?? null,
      images: normImageList(a?.images)
    }
  })

  // Kategorijos
  const catRes = await $fetch<{ data: any[] }>(`${cmsInternal}/api/categories`, {
    query: {
      'filters[title][$containsi]': q,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'imgUrl',
      'pagination[pageSize]': Math.ceil(limit / 2)
    }
  }).catch(() => ({ data: [] }))

  const categories: CategoryHit[] = (catRes.data || []).map((x: any) => {
    const a = x?.attributes ?? x
    return {
      id: x?.id,
      title: a?.title ?? '',
      slug: a?.slug ?? null,
      image: a?.imgUrl ?? null // CategoryCard pats normalizuoja /uploads → /cms
    }
  })

  // Subkategorijos (jeigu yra toks tipas)
  const subRes = await $fetch<{ data: any[] }>(`${cmsInternal}/api/sub-categories`, {
    query: {
      'filters[title][$containsi]': q,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'pagination[pageSize]': Math.ceil(limit / 2)
    }
  }).catch(() => ({ data: [] }))

  const subcategories: CategoryHit[] = (subRes.data || []).map((x: any) => {
    const a = x?.attributes ?? x
    return {
      id: x?.id,
      title: a?.title ?? '',
      slug: a?.slug ?? null
    }
  })

  return { engine: 'strapi', products, categories, subcategories }
}

/** ——— Meili (jei sukonfigūruotas) ——— */
async function tryMeili(
  _event: H3Event<EventHandlerRequest>,
  q: string,
  limit = 12
): Promise<SearchResponse | null> {
  const cfg = useRuntimeConfig() as any
  const host: string | undefined =
    cfg.meiliHost || process.env.MEILI_HOST
  const key: string | undefined =
    cfg.meiliKey || process.env.MEILI_SEARCH_KEY || process.env.MEILI_MASTER_KEY
  if (!host || !key) return null

  // indeksų pavadinimai
  const iProd: string = cfg.meiliIndexProducts || process.env.MEILI_INDEX_PRODUCTS || 'products'
  const iCats: string = cfg.meiliIndexCategories || process.env.MEILI_INDEX_CATEGORIES || 'categories'
  const iSubs: string = cfg.meiliIndexSubcategories || process.env.MEILI_INDEX_SUBCATEGORIES || 'sub-categories'

  const mod = await import('meilisearch').catch(() => null)
  if (!mod) return null
  const { MeiliSearch } = mod as any

  try {
    const client = new MeiliSearch({ host, apiKey: key })
    await client.health()

    const [prod, cats, subs] = await Promise.all([
      client.index(iProd).search(q, { limit }),
      client.index(iCats).search(q, { limit: Math.ceil(limit / 2) }),
      client.index(iSubs).search(q, { limit: Math.ceil(limit / 2) })
    ])

    // Saugi normalizacija (Meili laukai gali būti skirtingi)
    const products: ProductHit[] = (prod?.hits ?? []).map((h: any) => ({
      id: h.id ?? h._id,
      title: h.title ?? '',
      slug: h.slug ?? null,
      price: h.price ?? null,
      description: h.description ?? null,
      images: Array.isArray(h.images)
        ? (h.images as any[])
            .map((im: any) => {
              const url = toPublicUrl(im?.url ?? im)
              return url ? ({ url, alt: im?.alt ?? null } as ImageLite) : null
            })
            .filter(Boolean) as ImageLite[]
        : undefined
    }))

    const categories: CategoryHit[] = (cats?.hits ?? []).map((h: any) => ({
      id: h.id ?? h._id,
      title: h.title ?? '',
      slug: h.slug ?? null,
      image: h.imgUrl ?? null
    }))

    const subcategories: CategoryHit[] = (subs?.hits ?? []).map((h: any) => ({
      id: h.id ?? h._id,
      title: h.title ?? '',
      slug: h.slug ?? null
    }))

    return { engine: 'meili', products, categories, subcategories }
  } catch {
    return null
  }
}

/** ——— Handler ——— */
export default defineEventHandler(async (event): Promise<SearchResponse> => {
  const q = (getQuery(event).q as string | undefined)?.trim() ?? ''
  const limit = Number(getQuery(event).limit ?? 12)
  if (!q) {
    return { engine: 'none', products: [], categories: [], subcategories: [] }
  }

  const meili = await tryMeili(event, q, limit)
  if (meili) return meili

  return await strapiFallback(event, q, limit)
})