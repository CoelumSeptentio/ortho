<script setup lang="ts">
import type { WritableComputedRef } from 'vue'

const { locale, availableLocales } = useI18n()

// praplečiam tipą iš "ru" į string
const currentLocale = locale as unknown as WritableComputedRef<string>

function setLoc(code: string) {
  currentLocale.value = code
}
</script>

<template>
  <div class="flex gap-2 items-center">
    <button
      v-for="loc in availableLocales"
      :key="loc"
      class="text-xs px-2 py-1 rounded border"
      :class="currentLocale === loc ? 'bg-gray-100' : ''"
      @click="setLoc(loc as string)"
    >
      {{ (loc as string).toUpperCase() }}
    </button>
  </div>
</template>

