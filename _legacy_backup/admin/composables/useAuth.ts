export const useAuth = () => {
  const user = useState<any>('auth_user', () => null)
  async function login(identifier:string, password:string) {
    await $fetch('/api/auth/login', { method:'POST', body:{ identifier, password } })
    user.value = await $fetch('/api/auth/me')
    await navigateTo('/')
  }
  async function logout() {
    await $fetch('/api/auth/logout', { method:'POST' })
    user.value = null
    await navigateTo('/login')
  }
  return { user, login, logout }
}
