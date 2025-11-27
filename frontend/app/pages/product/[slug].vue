<script setup lang="ts">
import ProductGallery from '@/components/product/ProductGallery.vue'

const SHOW_PRICE = false // įjunk jei nori rodyti kainą

const route = useRoute()
const { api, cfg } = useApi()
const slug = route.params.slug as string

// Absoliutus URL į /cms (kad veiktų ir su /uploads, ir su išoriniu URL)
const toAbs = (url?: string | null) =>
  url ? (/^https?:\/\//i.test(url) ? url : `${cfg.public.apiBase}${url}`) : null

// Pasiimam VISAS nuotraukas (suderinta su Strapi v4 ir v5 struktūra)
function allImages(a: any): { url: string; alt?: string | null }[] {
  const raw = a?.images?.data ?? a?.images ?? []
  const arr = (Array.isArray(raw) ? raw : [raw]).map((it: any) => {
    const f = it?.attributes ?? it
    const best =
      f?.formats?.large?.url ??
      f?.formats?.medium?.url ??
      f?.formats?.small?.url ??
      f?.formats?.thumbnail?.url ??
      f?.url ??
      null
    return best ? { url: toAbs(best)!, alt: f?.alternativeText ?? null } : null
  }).filter(Boolean)
  return arr as { url: string; alt?: string | null }[]
}

type ProductView = {
  title: string
  price: number | null
  description: string
  images: { url: string; alt?: string | null }[]
}

const { data, pending, error } = await useAsyncData<ProductView | null>(`product:${slug}`, async () => {
  const res = await api('/api/products', {
    query: {
      'filters[slug][$eq]': slug,
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'price',
      'fields[3]': 'description',
      'populate[images][fields][0]': 'url',
      'populate[images][fields][1]': 'formats',
      'populate[images][fields][2]': 'alternativeText'
    }
  }) as any

  const item = res?.data?.[0]
  if (!item) return null
  const a = item.attributes ?? item

  return {
    title: a.title,
    price: a.price ?? null,
    description: a.description ?? '',
    images: allImages(a)
  }
})

const product = computed(() => data.value)
</script>

<template>
  <section class="py-8 container mx-auto">
    <div v-if="pending">Загрузка…</div>
    <div v-else-if="error || !product">Товар не найден</div>

    <div v-else class="grid md:grid-cols-2 gap-8">
      <!-- Galerija su perjungimu -->
       <div class="min-w-0">
      <ProductGallery :images="product.images" />
       </div>

      <!-- Informacija -->
      <div class="min-w-0">
        <h1 class="text-3xl font-semibold mb-4">{{ product.title }}</h1>

        <div v-if="SHOW_PRICE && product.price != null" class="text-xl font-medium mb-4">
          {{ Number(product.price).toFixed(2) }} ₽
        </div>

        <div class="text-gray-700 whitespace-pre-line">
          {{ product.description }}
        </div>
      </div>
    </div>
  </section>
</template>
