export const getToken = (event:any) => getCookie(event, 'sid') || null
export const setToken = (event:any, token:string) =>
  setCookie(event, 'sid', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60*60*8 })
export const clearToken = (event:any) => deleteCookie(event, 'sid')