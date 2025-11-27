// UI lygio tipai, kuriuos naudoja kortelės / sąrašai

export interface CardProduct {
  id?: number | string;
  title: string;
  slug?: string | null;
  imgUrl?: string | null;        // jau paruoštas viešas URL (su /cms jei reikia)
  alt?: string;
  price?: number | null;
  description?: string | null;
  // NEW: visas nuotraukų rinkinys
  images?: { url: string; alt?: string | null }[]
}

export interface CardCategory {
  id?: number | string;
  title: string;
  slug: string;
  imgUrl?: string | null;        // jau paruoštas viešas URL
  count?: number | null;         // pvz., subkategorijų ar produktų kiekis
}
