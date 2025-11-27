<!-- frontend/app/pages/account/documents.vue -->

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import DocumentCard from '@/components/account/DocumentCard.vue'

type DocItem = {
  id: number | string
  title: string
  description?: string | null
  updatedAt?: string | null
  fileUrl?: string | null
  fileUrlFull?: string | null
  fileName?: string | null
  downloadName?: string | null
  mime?: string | null
  ext?: string | null
  size?: number | null
  sizeHuman?: string | null
}

const router = useRouter()

const { data, pending, error, refresh } = useFetch<{ items: DocItem[] }>(
  '/api/account/documents',
  { server: true, lazy: false }
)

const items = computed(() => data.value?.items ?? [])
function goBack() {
  // jeigu nėra istorijos – grįžtam į /account
  if (history.length > 1) return router.back()
  return router.replace('/account')
}
</script>

<template>
  <section class="py-10 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Dokumentai</h1>
      <button class="btn" @click="goBack">Forward</button>
    </div>

    <div v-if="pending">Загрузка…</div>

    <div v-else-if="error" class="text-red-600">
      Ошибка загрузки.
      <button class="underline" @click="refresh()">Kartoti</button>
    </div>

    <div v-else>
      <div v-if="items.length" class="space-y-3">
        <DocumentCard v-for="doc in items" :key="doc.id" :doc="doc" />
      </div>
      <div v-else class="text-gray-500">Dokumentų nėra.</div>
    </div>
  </section>
</template>
