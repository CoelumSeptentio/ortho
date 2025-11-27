<script setup lang="ts">
const open = ref(false)

// lock'inam scroll'ą, kai meniu atvertas (tik kliente)
if (process.client) {
  watch(open, (v) => {
    const el = document.documentElement
    v ? el.classList.add('overflow-hidden') : el.classList.remove('overflow-hidden')
  })
}
</script>

<template>
  <header class="sticky top-0 z-40  bg-white border-b">
    <div class="container mx-auto px-4 h-14 flex items-center gap-4">
      <!-- Brand -->
      <NuxtLink to="/" class="text-xl font-bold">
        {{ $t('header.brand') }}
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6 text-sm">
        <NuxtLink to="/catalog" class="hover:text-[#CC092F]">{{ $t('nav.catalog') }}</NuxtLink>
        <NuxtLink to="/about" class="hover:text-[#CC092F]">{{ $t('nav.about') }}</NuxtLink>
        <NuxtLink to="/certificates" class="hover:text-[#CC092F]">{{ $t('nav.certificates') }}</NuxtLink>
        <NuxtLink to="/articles" class="hover:text-[#CC092F]">{{ $t('nav.articles') }}</NuxtLink>
        <NuxtLink to="/contacts" class="hover:text-[#CC092F]">{{ $t('nav.contacts') }}</NuxtLink>
      </nav>

      <!-- Right block (desktop) -->
      <div class="ml-auto hidden md:flex items-center gap-4">
        <LangSwitcher />
        <a href="tel:+37069941969" class="text-sm text-gray-600 hover:underline">
          {{ $t('header.phone') }}
        </a>
        <NuxtLink to="/login" class="text-sm px-3 py-1 rounded border hover:bg-gray-50">
          {{ $t('header.login') }}
        </NuxtLink>
      </div>

      <!-- Hamburger (mobile) -->
      <button
        class="ml-auto md:hidden inline-flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
        @click="open = !open"
      >
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile drawer -->
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 md:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30" @click="open = false" />
        <!-- Panel -->
        <nav class="absolute top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-xl p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-lg font-semibold">{{ $t('header.brand') }}</span>
            <LangSwitcher />
          </div>

          <NuxtLink to="/catalog" class="px-3 py-2 rounded hover:bg-gray-100" @click="open=false">{{ $t('nav.catalog') }}</NuxtLink>
          <NuxtLink to="/about" class="px-3 py-2 rounded hover:bg-gray-100" @click="open=false">{{ $t('nav.about') }}</NuxtLink>
          <NuxtLink to="/certificates" class="px-3 py-2 rounded hover:bg-gray-100" @click="open=false">{{ $t('nav.certificates') }}</NuxtLink>
          <NuxtLink to="/articles" class="px-3 py-2 rounded hover:bg-gray-100" @click="open=false">{{ $t('nav.articles') }}</NuxtLink>
          <NuxtLink to="/contacts" class="px-3 py-2 rounded hover:bg-gray-100" @click="open=false">{{ $t('nav.contacts') }}</NuxtLink>

          <div class="mt-auto pt-4 border-t">
            <a href="tel:+37069941969" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
              {{ $t('header.phone') }}
            </a>
            <NuxtLink to="/login" class="block mt-2 text-sm px-3 py-2 rounded border hover:bg-gray-50" @click="open=false">
              {{ $t('header.login') }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
