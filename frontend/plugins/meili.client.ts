import { MeiliSearch } from 'meilisearch';
export default defineNuxtPlugin(() => {
  const c = useRuntimeConfig().public;
  const client = new MeiliSearch({ host: (c.meiliHost || '').replace(/\/$/, ''), apiKey: c.meiliKey });
  return { provide: { meili: client.index(c.meiliIndex!) } };
});
