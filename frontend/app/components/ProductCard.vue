<script setup lang="ts">
import type { CardProduct } from '~/types/ui'

const props = defineProps<{
  product: CardProduct
  show?: { price?: boolean; description?: boolean; cta?: boolean }
  variant?: 'default' | 'compact' | 'detailed'
}>()

const show = computed(() => ({
  price: props.show?.price ?? true,
  description: props.show?.description ?? false,
  cta: props.show?.cta ?? true
}))

const normalize = (u?: string | null) => {
  if (!u) return null
  return u.startsWith('/uploads') ? `/cms${u}` : u
}

const thumbs = computed(() => {
  const arr =
    props.product.images ??
    (props.product.imgUrl ? [{ url: props.product.imgUrl, alt: props.product.alt }] : [])
  return arr.map(i => ({ url: normalize(i.url ?? i as any)!, alt: (i as any).alt }))
})

const active = ref(0)
watch(thumbs, () => { active.value = 0 })

const currentSrc = computed(() =>
  thumbs.value[active.value]?.url ?? normalize(props.product.imgUrl) ?? null
)

function money(n?: number | null) {
  return n == null ? '' : `${Number(n).toFixed(2)} ₽`
}
</script>

<template>
  <article class="border rounded-lg p-4 hover:shadow-sm transition bg-white">
    <!-- MEDIA -->
    <div class="aspect-[4/3] mb-3 overflow-hidden rounded-md bg-gray-50">
      <slot name="media" :product="product">
        <img
          v-if="currentSrc"
          :src="currentSrc"
          :alt="product.alt || product.title"
          class="w-full h-full object-contain p-2"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
      </slot>
    </div>

    <!-- NEW: thumbnails -->
    <div v-if="thumbs.length > 1" class="mb-3 overflow-x-auto">
      <div class="flex gap-2 min-w-max">
        <button
          v-for="(t, i) in thumbs"
          :key="i"
          @click="active = i"
          class="relative w-16 h-16 rounded overflow-hidden border focus:outline-none"
          :class="i === active ? 'ring-2 ring-[#CC092F]' : 'opacity-80 hover:opacity-100'"
          type="button"
          :title="product.title"
        >
          <img :src="t.url" :alt="t.alt || props.product.title" class="w-full h-full object-contain p-1" />
        </button>
      </div>
    </div>

    <!-- TITLE -->
    <h3 class="font-medium mb-1 leading-snug line-clamp-2 break-words">
      <slot name="title" :product="product">
        <NuxtLink v-if="product.slug" :to="`/product/${product.slug}`">{{ product.title }}</NuxtLink>
        <span v-else>{{ product.title }}</span>
      </slot>
    </h3>

    <!-- META -->
    <div class="mb-2">
      <slot name="meta" :product="product" :money="money">
        <span v-if="show.price && product.price != null" class="text-[#CC092F] font-semibold">
          {{ money(product.price) }}
        </span>
      </slot>
    </div>

    <!-- DESCRIPTION -->
    <slot v-if="show.description" name="description" :product="product">
      <p class="text-sm text-gray-600 line-clamp-3" v-if="product.description">
        {{ product.description }}
      </p>
    </slot>

    <!-- ACTIONS -->
    <div class="mt-3">
      <slot name="actions" :product="product">
        <NuxtLink
          v-if="show.cta && product.slug"
          :to="`/product/${product.slug}`"
          class="inline-block text-sm px-3 py-1 rounded border hover:bg-gray-50"
        >
          Подробнее
        </NuxtLink>
      </slot>
    </div>
  </article>
</template>
