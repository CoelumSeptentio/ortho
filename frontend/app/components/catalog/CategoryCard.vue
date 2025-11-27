<template>
  <NuxtLink :to="to" class="block group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition">
    <!-- viršus: paveikslėlis -->
    <div class="relative aspect-[4/3] bg-gray-100">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="title"
        class="absolute inset-0 w-full h-full object-contain p-2 transition group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="absolute inset-0 grid place-items-center text-gray-400 text-sm">
        No image
      </div>

      <div
        v-if="badge"
        class="absolute top-2 left-2 z-10 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow"
      >
        {{ badge }}
      </div>
    </div>

    <!-- apačia: tekstas -->
    <div class="p-4">
      <div class="text-base md:text-[1rem] font-semibold leading-snug line-clamp-3 md:line-clamp-2 break-words">
        {{ title }}
      </div>
      <div v-if="subtitle" class="mt-1 text-sm text-gray-500 line-clamp-2 break-words">
          {{ subtitle }}
      </div>

      <div class="mt-4">
        <span class="inline-flex items-center gap-1.5 text-sm text-primary-700 group-hover:gap-2 transition">
          {{ ctaText }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * Universalus kategorijos kortelės komponentas
 * - title: rodomas pavadinimas
 * - image: string arba { url: string } iš Strapi (Category.imgUrl)
 * - to: nuoroda
 * - subtitle / badge: neprivaloma
 */
const props = defineProps<{
  title: string
  to: string
  image?: string | { url: string } | null
  subtitle?: string
  badge?: string
}>()

const ctaText = 'Detaliau'

function normalizeImage(src?: string | null): string | null {
  if (!src) return null
  // absoliutus URL
  if (/^https?:\/\//i.test(src)) return src
  // Strapi upload kelias
  if (src.startsWith('/uploads')) return `/cms${src}`
  // vietiniai public assetai (jei tokie yra)
  if (src.startsWith('/images/') || src.startsWith('/img/')) return src
  // paliekam kaip yra (kitų atvejų)
  return src
}

const imgSrc = computed<string | null>(() => {
  const raw = typeof props.image === 'string' ? props.image : props.image?.url
  return normalizeImage(raw ?? null)
})
</script>

<style scoped>
.text-primary-700 { color: #0f766e; }
</style>
