<script setup lang="ts">
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

const props = defineProps<{ doc: DocItem }>()

const { public: pub } = useRuntimeConfig()
// Jei serveris neduotų fileUrlFull – pasigaminam čia
const href = computed(() => {
  if (props.doc.fileUrlFull) return props.doc.fileUrlFull
  const rel = props.doc.fileUrl || ''
  return rel.startsWith('http') ? rel : `${pub.apiBase || '/cms'}${rel}`
})
const downloadName = computed(() => props.doc.downloadName || props.doc.fileName || props.doc.title)

const updated = computed(() => {
  const s = props.doc.updatedAt
  if (!s) return null
  try {
    return new Date(s).toLocaleDateString('lt-LT', { year: 'numeric', month: 'short', day: '2-digit' })
  } catch { return s }
})
</script>

<template>
  <div class="rounded-2xl border border-gray-200 p-4 flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs bg-gray-50">
        {{ doc.ext || doc.mime || 'file' }}
      </span>
      <h3 class="font-medium truncate">{{ doc.title }}</h3>
    </div>

    <p v-if="doc.description" class="text-sm text-gray-600">
      {{ doc.description }}
    </p>

    <div class="text-xs text-gray-500">
      <span v-if="doc.sizeHuman">{{ doc.sizeHuman }}</span>
      <span v-if="doc.sizeHuman && updated"> · </span>
      <span v-if="updated">atnaujinta: {{ updated }}</span>
    </div>

    <div class="mt-2 flex items-center gap-3">
      <!-- Atsisiųsti: same-origin /cms/uploads + download atributas -->
      <a
        :href="href"
        :download="downloadName"
        class="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Atsisiųsti
      </a>

      <!-- Peržiūrėti naujame lange -->
      <a
        :href="href"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Open
      </a>
    </div>
  </div>
</template>
