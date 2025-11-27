<script setup lang="ts">
const route = useRoute();
const { $get } = useApi();
const { data } = await useAsyncData(() =>
  $get(`/api/products`, { 'filters[slug][$eq]': route.params.slug, populate: '*' })
);
const p = computed(()=> data.value?.data?.[0]?.attributes);
useHead({ title: p.value?.title, meta: [{ name:'description', content: p.value?.short || '' }]});
</script>
<template>
  <div class="container mx-auto p-6">
    <nuxt-link to="/catalog" class="underline">← Назад</nuxt-link>
    <h1 class="text-3xl font-semibold my-4">{{ p?.title }}</h1>
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <img v-if="p?.files?.data?.[0]" :src="p.files.data[0].attributes.url" class="w-full rounded-lg" />
      </div>
      <div>
        <p class="mb-4">{{ p?.short }}</p>
        <div v-html="p?.description"></div>
      </div>
    </div>
  </div>
</template>
