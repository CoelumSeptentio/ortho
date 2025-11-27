//frontend/server/api/health.get.ts
export default defineEventHandler(() => ({ status: 'ok', ts: Date.now() }))
