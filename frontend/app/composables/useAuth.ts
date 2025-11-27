// frontend/composables/useAuth.ts
// frontend/composables/useAuth.ts
import { computed } from 'vue'

type AuthUser = { id: number; username?: string; email?: string }

export function useAuth() {
  const user    = useState<AuthUser | null>('auth_user', () => null)
  const pending = useState('auth_pending', () => false)

  // ➜ Šitas panaikins klaidą middleware’e
  const loggedIn = computed(() => !!user.value)

  async function fetchMe() {
    pending.value = true
    try {
      const res = await $fetch<{ user: AuthUser }>('/api/auth/me', { credentials: 'include' })
      user.value = res.user ?? null
    } catch {
      user.value = null
    } finally {
      pending.value = false
    }
    return user.value
  }

  async function login(identifier: string, password: string) {
    pending.value = true
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { identifier, password },
        credentials: 'include'
      })
      return await fetchMe()
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      user.value = null
      if (process.client) window.location.href = '/login'
    }
  }

  return { user, loggedIn, pending, fetchMe, login, logout }
}

