<script setup lang="ts">
const props = defineProps<{
  images: { url: string; alt?: string | null }[]
}>()
const normalize = (u?: string | null) => {
  if (!u) return null
  return u.startsWith('/uploads') ? `/cms${u}` : u
}
const active = ref(0)
watch(() => props.images, () => (active.value = 0), { immediate: true })

const current = computed(() => {
  const img = props.images?.[active.value]
  return img ? { url: normalize(img.url)!, alt: img.alt } : null
})
const thumbs = computed(() =>
  (props.images || []).map(i => ({ url: normalize(i.url)!, alt: i.alt }))
)
</script>

<template>
  <div class="space-y-3">
    <!-- didelis vaizdas -->
    
     <div
      class="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
      style="min-height:220px" >
      <img
        v-if="current?.url"
        :src="current.url"
        :alt="current?.alt || ''"
        class="max-h-[70vh] w-auto max-w-full object-contain p-2"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="w-full h-full grid place-items-center text-gray-400">No image</div>
    </div>

    <!-- thumbs -->
    
   

       <div v-if="images?.length > 1" class="thumbs-scroll -mx-4 px-4">
       <div class="grid grid-flow-col auto-cols-max gap-2">
    <button
      v-for="(img, i) in images"
      :key="i"
      @click="active = i"
      type="button"
      class="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded border overflow-hidden focus:outline-none snap-start"
      :class="i === active ? 'ring-2 ring-[#CC092F]' : 'opacity-80 hover:opacity-100'"
    >
      <img :src="img.url" :alt="img.alt || ''" class="w-full h-full object-contain p-1" />
    </button>
    </div>
</div>
 </div>
</template>

<style scoped>
.thumbs-scroll{
  overflow-x: auto;
  overflow-y: hidden;
  /* iOS inerciška slinktis */
  -webkit-overflow-scrolling: touch;
  /* leidžiam horizontalius gestus, net jei tėvai riboja */
  touch-action: pan-x !important;
  /* neperduodam inercijos tėvams (stabdo "užsirakinimą") */
  overscroll-behavior-x: contain;
  /* malonesnė slinktis ir "snap" efektas */
  scroll-snap-type: x proximity;
}
</style>

