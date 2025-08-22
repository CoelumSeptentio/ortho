export const useSearch = () => {
  const { $meili } = useNuxtApp() as any;
  const search = async (q: string, filter?: string) =>
    (await $meili.search(q || '', { filter: filter ? [filter] : undefined, limit: 24 })).hits as any[];
  return { search };
};
