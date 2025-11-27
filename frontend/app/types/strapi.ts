
// Strapi bendriniai tipai (v4)

export type StrapiEntity<T> = { id: number; attributes: T };

// Sąrašas: /api/xxx -> { data: [ { id, attributes }, ... ], meta }
export type StrapiList<T> = {
  data: Array<StrapiEntity<T>>;
  meta?: any;
};

// Vienas įrašas per relation: { data: { id, attributes } | null }
export type StrapiRelOne<T> = {
  data: StrapiEntity<T> | null;
};

// Daug įrašų per relation: { data: [ { id, attributes }, ... ] }
export type StrapiRelMany<T> = {
  data: Array<StrapiEntity<T>>;
};

// Media failo aprašas
export type StrapiImageFile = {
  url: string;                         // pvz. "/uploads/....jpg"
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, { url: string; width: number; height: number }>;
};

// Single Media
export type StrapiMedia = {
  data?: { id: number; attributes: StrapiImageFile } | null;
};

// Multiple Media
export type StrapiMediaMany = {
  data?: Array<{ id: number; attributes: StrapiImageFile }> | null;
};

/* =======================
 *  DOMAIN: PRODUCT
 * ======================= */

export type ProductAttr = {
  title: string;
  slug: string;
  price?: number | null;
  description?: string | null;
  // Strapi modelyje "Product" -> images: Multiple Media
  images?: StrapiMediaMany;
  // ryšys į Category (manyToOne)
  category?: StrapiRelOne<CategoryAttr>;
};

/* =======================
 *  DOMAIN: CATEGORY
 * ======================= */

export type CategoryAttr = {
  title: string;
  slug: string;

  // parent: manyToOne į Category (top-level turi parent = null)
  parent?: StrapiRelOne<CategoryAttr>;

  // children: oneToMany į Category
  children?: StrapiRelMany<CategoryAttr>;

  // atgalinis ryšys į Product (oneToMany) – kartais prireikia skaičiavimams
  products?: StrapiRelMany<ProductAttr>;

  // jūsų Category modelyje lauką pavadinote "imgUrl" ir jis yra Multiple Media
  imgUrl?: StrapiMediaMany | StrapiMedia; // leis ir Single, ir Multiple
};

/* =======================
 *  PAGALBINIAI: normalizavimai
 * ======================= */

// Iš Single arba Multiple media paimti pirmo failo URL (arba null)
export function firstMediaUrl(
  media?: StrapiMedia | StrapiMediaMany | null
): string | null {
  if (!media || media.data == null) return null;
  const d: any = media.data;
  if (Array.isArray(d)) return d[0]?.attributes?.url || null;
  return d?.attributes?.url || null;
}

// Normalizuoti Strapi URL į viešą URL (per Nginx proxy "/cms")
export function publicMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads')) return `/cms${url}`;
  return url;
}

