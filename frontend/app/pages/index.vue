<!-- frontend/app/pages/index.vue -->
<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="py-12">
    <h1 class="text-3xl font-semibold mb-4">Ortopedinė produkcija visai šeimai</h1>
    
    <NuxtLink to="/catalog" class="inline-block mt-6 px-5 py-3 rounded-md text-white" style="background:#CC092F">
      Pereiti į katalogą
    </NuxtLink>
  </section>
</template>
