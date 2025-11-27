export default defineEventHandler(() => {
  return { ok: true, app: 'frontend', time: new Date().toISOString() }
})