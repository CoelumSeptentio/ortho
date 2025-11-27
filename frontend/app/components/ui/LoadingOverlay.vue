<template>
  <transition name="fade" appear>
    <div
      v-if="show"
      class="fixed inset-0 z-50 grid place-items-center bg-white/90 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex flex-col items-center gap-4">
        <!-- 1) Paprastas „spinneris“ -->
        <div class="h-10 w-10 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin" />

        <p class="text-gray-700">{{ text ?? 'Loading…' }}</p>

        <!-- 2) Jei įdėsi mp4 į public/loader.mp4 — atkomentuok žemiau 
        <video
          v-if="useVideo"
          autoplay muted loop playsinline
          class="w-48 rounded-xl shadow"
          poster="/images/AIBush.png"
        >
          <source src="/trees.mp4" type="video/mp4" />
        </video>
      -->
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; text?: string; useVideo?: boolean }>()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
