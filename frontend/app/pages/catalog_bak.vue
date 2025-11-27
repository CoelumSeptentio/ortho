<script setup lang="ts">
import type { CardProduct } from '~/types/ui'   // <- bendras UI tipas kortelei

const { api, cfg } = useApi()
const abs = (p?: string | null): string | null =>
  !p ? null : (p.startsWith('http') ? p : `${cfg.public.apiBase}${p}`)

type Category = { title: string; slug: string }
type Product  = { title: string; price?: number|null; slug?: string|null; image?: string|null }
const q = reactive({ search: '', category: '' })




/* ----- KATEGORIJOS ----- */
const {
  data: catsData,
  pending: catsPending,
  error: catsErr,
} = await useAsyncData<Category[]>(
  'cats',
  async () => {
    const res = await api('/api/categories', {
      query: {
        'filters[parent][id][$null]': true,
        'pagination[limit]': 100,
        'fields[0]': 'title',
        'fields[1]': 'slug',
      }
    }) as any

    // Strapi v4: { data: [ { id, attributes: {...} } ] }
    return (res?.data ?? []).map((c: any) => ({
      title: c.attributes?.title ?? c.title,
      slug:  c.attributes?.slug  ?? c.slug,
    }))
  }
)

const cats = computed<Category[]>(() => catsData.value ?? [])


// helper: pirma paveikslėlio nuoroda (veikia su single arba multiple media)
function pickFirstImageUrl(a: any): string | null {
  const rel = a?.images ?? a?.image ?? a?.cover ?? a?.thumbnail
  const data = rel?.data
  const arr  = Array.isArray(data) ? data : (data ? [data] : [])
  const attr = arr[0]?.attributes ?? arr[0]
const raw: string | null =
    attr?.formats?.thumbnail?.url ??
    attr?.formats?.small?.url ??
    attr?.url ??
    null
    return raw ? abs(raw) : null
}

/* ----- PRODUKTAI ----- */
const {
  data: productsData,
  pending: productsPending,
  error: productsErr,

//} = await useAsyncData<CardProduct[]>(
//  () => `products:${q.search}:${q.category}`,   // stabilus cache key
} = await useAsyncData<Product[]>(
  'products',  
  
  async () => {
    const params: Record<string, any> = {
      'pagination[pageSize]': 24,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'price',
      'fields[3]': 'description',
      'populate[images][fields][0]': 'url',
      'populate[images][fields][1]': 'formats',
      'populate[images][fields][2]': 'alternativeText',
      'filters[title][$containsi]': q.search || undefined,
      
    }
    if (q.search)   params['filters[title][$containsi]']   = q.search
    if (q.category) params['filters[category][slug][$eq]'] = q.category

    const res = await api('/api/products', { query: params }) as any

   return (res?.data ?? []).map((item: any) => {
      const a = item.attributes ?? item

 const imgs = Array.isArray(a?.images)
        ? a.images
        : (Array.isArray(a?.images?.data) ? a.images.data : (a?.images?.data ? [a.images.data] : []))

      const first = imgs[0] ?? null
      const attrs = first?.attributes ?? first
      const raw = attrs?.formats?.small?.url ?? attrs?.url ?? null

      return {
        title: a.title,
        price: a.price ?? null,
        slug : a.slug  ?? null,
        image: raw ? abs(raw) : null,

//      const url = pickFirstImageUrl(a)
//     return {
//          id:          item.id ?? a.id,
//          title:       a.title,
//          slug:        a.slug ?? null,
//          price:       a.price ?? null,
//          description: a.description ?? null,
//          imgUrl:      url,
//          alt:         a?.images?.data?.[0]?.attributes?.alternativeText || a.title,
     
       } satisfies Product

    })
  },
  { watch: [() => q.search, () => q.category] }
)
      
const products = computed<CardProduct[]>(() => productsData.value ?? [])
</script>

<template>
  <section class="py-8">
    <h1 class="text-3xl font-semibold mb-6">Каталог</h1>

    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="q.search" type="search" placeholder="Поиск…" class="border rounded-md px-3 py-2 w-64" />
      <select v-model="q.category" class="border rounded-md px-3 py-2">
        <option value="">Все категории</option>
        <option v-for="c in cats" :key="c.slug" :value="c.slug">{{ c.title }}</option>
      </select>
    </div>

    <div v-if="productsPending || catsPending" class="text-gray-500">Загрузка…</div>
    <div v-else-if="productsErr || catsErr" class="text-red-600">Ошибка загрузки</div>

    <template v-else>
      <div v-if="products.length === 0" class="text-gray-500">Ничего не найдено</div>

      <div v-else class="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard
          v-for="(p, i) in products"
          :key="p.slug ?? p.id ?? i"     
          :product="p"                   
          :show="{ price: false, description: true, cta: true }"
        />
      </div>
    </template>
  </section>
</template>
