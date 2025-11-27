export default defineEventHandler(() => ({
  ok: true,
  app: 'frontend',
  time: new Date().toISOString(),
}))