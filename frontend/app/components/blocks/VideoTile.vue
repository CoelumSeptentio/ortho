<template>
  <NuxtLink :to="to" class="group block relative rounded-xl overflow-hidden shadow hover:shadow-lg transition">
    <video
      ref="vid"
      class="w-full h-48 object-cover"
      :src="src"
      :poster="poster"
      muted
      preload="metadata"
      playsinline
    />
    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
    <div class="absolute bottom-3 left-3 text-white font-medium drop-shadow">{{ title }}</div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string; poster?: string; title: string; to: string }>()
const vid = ref<HTMLVideoElement | null>(null)
onMounted(() => {
  const v = vid.value
  if (!v) return
  const onEnter = () => v.play().catch(() => {})
  const onLeave = () => { v.pause(); v.currentTime = 0 }
  v.closest('.group')?.addEventListener('mouseenter', onEnter)
  v.closest('.group')?.addEventListener('mouseleave', onLeave)
})
</script>
