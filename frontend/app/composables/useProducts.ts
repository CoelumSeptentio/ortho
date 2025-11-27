// frontend/app/composables/useProducts.ts
import { computed } from 'vue'
import type { StrapiList, ProductAttr } from '~/types/strapi'
import type { CardProduct } from '~/types/ui'

export function useProducts() {
  const api = useApi()
  const config = useRuntimeConfig()

 

  // Strapi v4/v5: traukiam reikalingus laukus + multiple media "images"
  const q: any = {
    fields: ['title', 'slug', 'price', 'description'],
    sort: ['createdAt:desc'],
    populate: {
      images: { fields: ['url', 'formats', 'alternativeText', 'caption', 'width', 'height'] }
    }
  }

  // svarbu: mūsų api bazė yra /cms, todėl čia paliekam '/api/products'
  const { data, pending, error, refresh } =
    useAsyncData<StrapiList<ProductAttr>>('products', () =>
      api<StrapiList<ProductAttr>>('/api/products', { params: q })
    )

  // pavertimas į absoliutų URL (per /cms proxy)
   // Paverčiame į absoliutų kelią per nuostatą (pvz., '/cms')
  const toAbs = (url?: string | null) => {
    if (!url) return ''
    if (/^https?:\/\//i.test(url)) return url
    const base = config.public.apiBase || '/cms' // saugiklis
    return `${base}${url}`
  }





  const items = computed<CardProduct[]>(() => {
    const list: any[] = (data.value as any)?.data ?? []

    return list.map((p: any) => {
      // v4: p = { id, attributes:{ ... } }, v5: p = { id, ... }
      const a = p.attributes ?? p

      // images: v4 -> { data:[{ attributes:{ url, formats }}, ...] }
      //         v5 -> [{ url, formats }, ...]
      const rawImages = a.images?.data ?? a.images ?? []
      const first = Array.isArray(rawImages) ? rawImages[0] : rawImages
      const file = first?.attributes ?? first

      const best =
        file?.formats?.small?.url ??
        file?.formats?.thumbnail?.url ??
        file?.url ??
        null

      return {
        id: p.id,
        title: a.title,
        slug: a.slug ?? null,
        price: a.price ?? null,
        description: a.description ?? null,
        imgUrl: toAbs(best),
        alt: file?.alternativeText || a.title
      } as CardProduct
    })
  })

  return { items, pending, error, refresh }
}
