<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { login } = useAuth()
const form = reactive({ identifier: '', password: '' })
const pending = ref(false)
async function submit() {
  pending.value = true
  try { await login(form.identifier, form.password) }
  catch (e:any) { alert('Неверные данные'); }
  finally { pending.value = false }
}
</script>

<template>
  <h1 class="text-xl font-semibold mb-4">Вход в панель</h1>
  <form class="space-y-3" @submit.prevent="submit">
    <input v-model="form.identifier" type="text" class="input" placeholder="Email / Логин" />
    <input v-model="form.password" type="password" class="input" placeholder="Пароль" />
    <button class="btn btn-primary w-full" :disabled="pending">{{ pending ? 'Входим…' : 'Войти' }}</button>
  </form>
</template>
