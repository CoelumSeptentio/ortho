<template>
  <section class="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow">
    <video
      class="w-full h-full object-cover"
      :src="srcMp4"
      :poster="poster"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
    />
    <div class="absolute inset-0 bg-black/40" />
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <h1 class="text-white text-3xl md:text-5xl font-semibold drop-shadow">Ortopedija kiekvienai dienai</h1>
      <p class="text-white/90 mt-3 max-w-2xl">Patogu, funkcionalu, kokybiška.</p>
      <NuxtLink to="/catalog" class="mt-6 inline-block px-6 py-3 bg-white text-gray-900 rounded-xl shadow hover:shadow-md">
        Pereiti į katalogą
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  srcMp4: string
  poster?: string
}>()
</script>
