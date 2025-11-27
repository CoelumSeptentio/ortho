<!-- frontend/app/pages/auth/login.vue -->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const form = reactive({
  identifier: '',
  password: '',
})
const pending = ref(false)
const err = ref<string | null>(null)

async function submit() {
  pending.value = true
  err.value = null
  try {
    // Siunčiam 'identifier' (taip reikalauja Strapi /auth/local)
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: form.identifier.trim(),
        password: form.password,
      },
    })

    // (neprivaloma) – „įšildyti“ /api/auth/me
    await $fetch('/api/auth/me')

    const to = (route.query.redirect as string) || '/account'
    await router.replace(to)
  } catch (e: any) {
    err.value = e?.data?.statusMessage || 'Неверный e-mail или пароль'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="py-10 max-w-md">
    <h1 class="text-2xl font-semibold mb-4">Login</h1>

    <form class="space-y-4" @submit.prevent="submit" novalidate>
      <div>
        <label class="text-sm text-gray-600">E-mail</label>
        <input
          v-model.trim="form.identifier"
          class="input w-full"
          type="email"
          autocomplete="username"
          required
        />
      </div>

      <div>
        <label class="text-sm text-gray-600">Password</label>
        <input
          v-model="form.password"
          class="input w-full"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <div class="flex items-center gap-3">
        <button class="btn btn-primary" :disabled="pending">
          {{ pending ? 'Loading…' : 'Login' }}
        </button>
        <NuxtLink to="/" class="btn">Отмена</NuxtLink>
      </div>

      <p v-if="err" class="text-sm text-red-600">{{ err }}</p>

      <p class="text-sm text-gray-500">
        Klientų dokumentai.
      </p>
    </form>
  </section>
</template>
