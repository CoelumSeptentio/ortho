<!-- frontend/app/pages/account/index.vue -->

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()

// Po logout – iškart į login
const onLogout = async () => {
  try { await logout() } finally {
    await navigateTo('/login')
  }
}
</script>

<template>
  <section class="py-10 space-y-6">
    <h1 class="text-2xl font-semibold">Mano kabinetas</h1>

    <div class="rounded-xl border p-4 bg-white">
      <p class="mb-2"><b>User:</b> {{ user?.email || user?.username }}</p>
      

      <div class="flex gap-3 mt-4">
        <NuxtLink to="/account/documents" class="px-3 py-2 rounded border hover:bg-gray-50">
          Dokumentai
        </NuxtLink>
        <button @click="onLogout" class="px-3 py-2 rounded border hover:bg-gray-50">
          Logout
        </button>
      </div>
    </div>
  </section>
</template>

