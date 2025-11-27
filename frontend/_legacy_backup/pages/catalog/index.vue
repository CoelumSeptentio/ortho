<script setup lang="ts">
const q = ref('');
const loading = ref(false);
const results = ref<any[]>([]);
const { search } = useSearch();
const doSearch = async () => { loading.value = true; results.value = await search(q.value); loading.value = false; };
onMounted(doSearch);
watch(q, doSearch);
</script>
<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl mb-4">Каталог</h2>
    <input v-model="q" placeholder="Поиск" class="border p-2 w-full md:w-1/2 mb-6" />
    <div v-if="loading">Ищем…</div>
    <div class="grid md:grid-cols-3 gap-6">
      <ProductCard v-for="p in results" :key="p.id" :product="p"/>
    </div>
  </div>
</template>
