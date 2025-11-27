import type { EventHandler } from 'h3'
import { defineEventHandler, deleteCookie, createError } from 'h3'

const logoutHandler: EventHandler = defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }
  deleteCookie(event, 'auth_token', { path: '/' })
  return { ok: true }
})

export default logoutHandler
