
<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryCard from '@/components/catalog/CategoryCard.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'

type CardCategory = {
  id: number | string
  title: string
  slug: string
  image?: string | null
  count?: number | null
}

type CardProduct = {
  id: number | string
  title: string
  slug: string | null
  imgUrl?: string | null
  alt?: string
  price?: number | null
  description?: string | null
}

type SearchResponse = {
  engine: 'meili' | 'strapi' | 'none'
  products: any[]
  categories: any[]
  subcategories: any[]
}

const route = useRoute()
const router = useRouter()
const  api  = useApi()

/* ---------------- URL query -> reactive ---------------- */
const categorySlug = computed(() => (route.query.category as string) || '')
const subSlug = computed(() => (route.query.sub as string) || '')

/* ---------------- Kontroliuojamas <select> ---------------- */
const selectedCat = ref<string>(categorySlug.value)

watch(selectedCat, async (v) => {
  // Atnaujinam TIK mūsų puslapio URL (ne /cms), tuo pačiu išvalom sub
  router.replace({ query: { ...route.query, category: v || undefined, sub: undefined } })
  await loadChildren(v || '')
})
watch(categorySlug, v => { if (selectedCat.value !== v) selectedCat.value = v })

/* ---------------- TOP-LEVEL (parent = null) ---------------- */
const { data: topData, pending: topLoading } = await useAsyncData('top-cats', () =>
  api('/api/categories', {
    query: {
      'filters[parent][id][$null]': true,
      'populate[imgUrl][fields][0]': 'url',
      'sort': 'title:asc',
      'pagination[pageSize]': 200
    }
  })
)

/* ---------------- Pasirinktas node (pavadinimui) ---------------- */
const { data: nodeData, pending: nodeLoading } = await useAsyncData(
  () => `node-${categorySlug.value}`,
  () => api('/api/categories', {
    query: {
      'filters[slug][$eq]': categorySlug.value, // be __none__
      'populate[children][fields][0]': 'title',
      'populate[children][fields][1]': 'slug',
      'populate[children][populate][imgUrl][fields][0]': 'url',
      'populate[children][sort]': 'title:asc'
    }
  }),
  { watch: [categorySlug] }
)

/* ---------------- Vaikai pagal parent.slug (stabilu) ---------------- */
const childrenRaw = ref<any[]>([])
const childrenLoading = ref(false)

async function loadChildren(slug: string) {
  if (!slug) { childrenRaw.value = []; return }
  childrenLoading.value = true
  try {
    const res: any = await api('/api/categories', {
      query: {
        'filters[parent][slug][$eq]': slug,
        'populate[imgUrl][fields][0]': 'url',
        'sort': 'title:asc',
        'pagination[pageSize]': 200
      }
    })
    childrenRaw.value = Array.isArray(res?.data) ? res.data : []
  } catch (e) {
    console.error('[catalog] children fetch error:', e)
    childrenRaw.value = []
  } finally {
    childrenLoading.value = false
  }
}

watchEffect(() => { // inic. užkrovimas
  if (categorySlug.value) loadChildren(categorySlug.value)
  else childrenRaw.value = []
})

/* ---------------- Normalizavimai (v4 ir v5) ---------------- */
function catTitle(c: any): string {
  return c?.attributes?.title ?? c?.title ?? ''
}
function catSlug(c: any): string {
  return c?.attributes?.slug ?? c?.slug ?? ''
}
function catChildren(c: any): any[] {
  const ch = c?.attributes?.children ?? c?.children
  if (!ch) return []
  return Array.isArray(ch) ? ch : (ch.data ?? [])
}
function catImageUrl(c: any): string | null {
  const a = c?.attributes ?? c ?? {}
  let url: string | null = null
  const m = a?.imgUrl
  if (Array.isArray(m)) {
    const first = m[0]
    url = first?.attributes?.url ?? first?.url ?? null
  } else if (m) {
    const obj = m.data ?? m
    url = obj?.attributes?.url ?? obj?.url ?? null
  }
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return url.startsWith('/uploads') ? `/cms${url}` : url
}

/* ---------------- Map'ai ir computed ---------------- */
function mapCategory(entity: any): CardCategory {
  return {
    id: entity?.id,
    title: catTitle(entity),
    slug: catSlug(entity),
    image: catImageUrl(entity),
    count: catChildren(entity)?.length ?? null
  }
}

const topCats = computed<CardCategory[]>(() =>
  ((topData.value as any)?.data ?? []).map(mapCategory)
)
const currentNode = computed<any>(() =>
  ((nodeData.value as any)?.data ?? [])[0]
)
const childrenCats = computed<CardCategory[]>(() =>
  childrenRaw.value.map(mapCategory)
)
const currentTitle = computed(() =>
  currentNode.value
    ? (currentNode.value.attributes?.title || currentNode.value.title || '')
    : (topCats.value.find(c => c.slug === categorySlug.value)?.title || '')
)
const currentSlug = computed(() => categorySlug.value)

/* ---------------- Rodymo logika ---------------- */
const showTop = computed(() => !categorySlug.value)
const showChildren = computed(() => !!categorySlug.value && !subSlug.value)
const showProducts = computed(() => !!categorySlug.value && !!subSlug.value)

/* ---------------- PRODUCTS (pagal subSlug) ---------------- */
const prodPage = ref(1)
const prodPerPage = 12
const prodLoading = ref(false)
const prodTotal = ref(0)
const products = ref<CardProduct[]>([])

const toAbs = (url?: string | null) =>
  url ? (/^https?:\/\//i.test(url) ? url : `/cms${url}`) : null

function allImages(a: any): { url: string; alt?: string | null }[] {
  const raw = a?.images?.data ?? a?.images ?? []
  const arr = (Array.isArray(raw) ? raw : [raw]).map((it: any) => {
    const f = it?.attributes ?? it
    const best =
      f?.formats?.small?.url ??
      f?.formats?.medium?.url ??
      f?.formats?.thumbnail?.url ??
      f?.url ?? null
    return best ? { url: toAbs(best)!, alt: f?.alternativeText ?? null } : null
  }).filter(Boolean)
  return arr as { url: string; alt?: string | null }[]
}

async function fetchProducts() {
  const sub = subSlug.value
  products.value = []
  prodTotal.value = 0
  if (!sub) return

  prodLoading.value = true
  try {
    const res: any = await api('/api/products', {
      query: {
        'filters[category][slug][$eq]': sub,
        'populate[images]': true,
        'pagination[page]': prodPage.value,
        'pagination[pageSize]': prodPerPage,
        'sort': 'title:asc'
      }
    })
    const list: any[] = Array.isArray(res?.data) ? res.data : []
    products.value = list.map((p: any) => {
      const a = p.attributes ?? p
      const imgs = allImages(a)
      return {
        id: p.id,
        title: a.title,
        slug: a.slug ?? null,
        price: a.price ?? null,
        description: a.description ?? null,
        imgUrl: imgs[0]?.url ?? null,
        alt: imgs[0]?.alt || a.title
      } as CardProduct
    })
    const meta = res?.meta?.pagination
    if (meta) prodTotal.value = meta.total ?? products.value.length
  } catch (e) {
    console.error('[catalog] products fetch error:', e)
  } finally {
    prodLoading.value = false
  }
}

watch([subSlug, prodPage], () => fetchProducts(), { immediate: true })

const prodPageCount = computed(() =>
  Math.max(1, Math.ceil(prodTotal.value / prodPerPage))
)

const pageLoading = computed(() =>
  topLoading.value || nodeLoading.value || childrenLoading.value || prodLoading.value
)

/* ---------------- Search ---------------- */
const q = ref('')
const { data: searchData, pending: searchPending, refresh: doSearch } =
  useFetch<SearchResponse>('/api/search', {
    query: computed(() => ({ q: q.value, limit: 16 })),
    immediate: false
  })
watch(q, (val) => {
  if ((val ?? '').trim().length >= 2) doSearch()
})
</script>

<template>
  <div class="relative">
    <!-- Global overlay -->
    <LoadingOverlay :show="pageLoading" :useVideo="true" text="..." />

    <!-- VIRŠUS: Каталог + Поиск (1 eil.), Найти (2 eil. mobilėj), Select -->
    <div class="grid grid-cols-[auto_1fr] items-center gap-3 md:flex md:items-center md:gap-4 mb-4">
      <h1 class="text-2xl font-semibold">Katalogas</h1>

      <!-- Paieškos forma (tik input) -->
      <form
        id="catalogSearch"
        class="order-2 md:order-none flex items-center gap-2 w-full md:w-auto"
        @submit.prevent="() => doSearch()"
      >
        <input
          v-model.trim="q"
          class="border rounded-xl px-3 py-2 w-full md:w-64"
          placeholder="Paieška..."
        />
      </form>

      <!-- Mygtukas mobilėj į 2 eilutę (per visą plotį), desktop'e toj pačioj eilutėj -->
      <button
        type="submit"
        form="catalogSearch"
        class="order-3 md:order-none border rounded-xl px-3 py-2 col-span-2 md:col-span-1"
      >
        Найти
      </button>

      <!-- Kategorijų select: mobilėj atskirai žemiau, desktop'e toj pačioj eilutėj -->
      <select
        v-model="selectedCat"
        class="order-4 md:order-none border rounded-xl px-3 py-2 w-full md:w-72 col-span-2 md:col-span-1"
      >
        <option :value="''">Visos kategorijos</option>
        <option v-for="c in topCats" :key="c.slug" :value="c.slug">{{ c.title }}</option>
      </select>
    </div>

    <!-- ✅ REZULTATAI viršuje, jei vyksta paieška -->
    <section v-if="(q || '').trim().length >= 2" class="space-y-3">
      <div v-if="searchPending">Ieškome…</div>
      <div v-else>
        <h2 class="text-xl font-semibold">Rezultatai</h2>

        <div
          v-if="searchData?.products?.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ProductCard
            v-for="p in searchData.products"
            :key="p.slug || p.id"
            :product="p"
            :show="{ price: true, description: true, cta: true }"
          />
        </div>
        <div v-else class="text-gray-500">Nieko neradome.</div>
      </div>
    </section>

    <!-- Likęs katalogas rodomas, kai paieška neaktyvi -->
    <template v-else>
      <!-- 1) Top-level kategorijos -->
      <section v-if="showTop">
        <div v-if="topLoading">Loading…</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CategoryCard
            v-for="c in topCats"
            :key="c.slug"
            :title="c.title"
            :image="c.image"
            :to="`/catalog?category=${c.slug}`"
          />
        </div>
      </section>

      <!-- 2) Subkategorijos -->
      <section v-if="showChildren">
        <h2 class="text-xl font-semibold mb-3">{{ currentTitle }}</h2>
        <div v-if="nodeLoading">Загрузка…</div>

        <div
          v-else-if="childrenCats.length"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <CategoryCard
            v-for="sc in childrenCats"
            :key="sc.slug"
            :title="sc.title"
            :image="sc.image"
            :to="`/catalog?category=${currentSlug}&sub=${sc.slug}`"
          />
        </div>

        <div v-else class="text-gray-500">Subkategorijų nėra.</div>
      </section>

      <!-- 3) ПРОДУКТЫ (rodome, kai pasirinkta sub) -->
      <section v-if="showProducts" class="space-y-4">
        <h2 class="text-xl font-semibold">Prekės</h2>

        <div v-if="prodLoading">Loading…</div>

        <div v-else>
          <div
            v-if="products.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="p in products"
              :key="p.id"
              :product="p"
              :show="{ price: true, description: true, cta: true }"
              variant="default"
            />
          </div>

          <div v-else class="text-gray-500">Prekės nerastos.</div>

          <!-- Paginacija -->
          <div class="flex items-center gap-3 pt-4" v-if="prodPageCount > 1">
            <button
              class="px-3 py-1 rounded border disabled:opacity-50"
              :disabled="prodPage <= 1"
              @click="prodPage = Math.max(1, prodPage - 1)"
            >
              ← Назад
            </button>
            <span class="text-sm text-gray-600">
              Стр. {{ prodPage }} из {{ prodPageCount }}
            </span>
            <button
              class="px-3 py-1 rounded border disabled:opacity-50"
              :disabled="prodPage >= prodPageCount"
              @click="prodPage = Math.min(prodPageCount, prodPage + 1)"
            >
              Forward →
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>



