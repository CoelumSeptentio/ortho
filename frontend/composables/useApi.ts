export const useApi = () => {
  const base = (useRuntimeConfig().public.apiBase || '').replace(/\/$/, '');
  return { $get: <T>(p: string, params: any = {}) => $fetch<T>(`${base}${p}`, { params }) };
};
