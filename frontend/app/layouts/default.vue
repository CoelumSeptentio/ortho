<!-- frontend/app/layouts/default.vue -->
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />

    <main class="flex-1 container mx-auto p-6">
      <slot />
    </main>

    <footer class="bg-gray-100 text-center p-4 text-sm text-gray-500">
      {{ $t('footer') }}
    </footer>
  </div>
</template>

