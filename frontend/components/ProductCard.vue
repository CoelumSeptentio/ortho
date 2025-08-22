<script setup lang="ts">
defineProps<{ product: any }>()
</script>
<template>
  <NuxtLink :to="`/product/${product.slug}`" class="block border rounded-xl p-4 hover:shadow">
    <img v-if="product.image || product.files?.data?.[0]" :src="product.image || product.files.data[0].attributes?.url" class="w-full aspect-[4/3] object-cover rounded-md mb-3" />
    <div class="font-medium">{{ product.title }}</div>
    <div class="text-sm opacity-70 line-clamp-2">{{ product.short }}</div>
  </NuxtLink>
</template>
