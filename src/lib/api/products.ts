import { apiFetch, DEMO_MODE } from "./client";
import { seedProductList, seedProducts } from "./seed";
import type { ProductDetail, ProductListItem, ProductQuery } from "./types";

export async function fetchProducts(query: ProductQuery = {}): Promise<ProductListItem[]> {
  if (DEMO_MODE) {
    let items = seedProductList.filter((p) => p.isActive);
    if (query.category && query.category !== "All") items = items.filter((p) => p.category === query.category);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(s) || p.shortDesc.toLowerCase().includes(s));
    }
    return items;
  }

  return apiFetch<ProductListItem[]>("/api/products", {
    params: {
      category: query.category && query.category !== "All" ? query.category : undefined,
      active: query.active ?? true,
      search: query.search,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 50,
    },
  });
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail> {
  if (DEMO_MODE) {
    const found = seedProducts.find((p) => p.slug === slug);
    if (!found) throw new Error(`Product '${slug}' not found`);
    return found;
  }
  return apiFetch<ProductDetail>(`/api/products/${encodeURIComponent(slug)}`);
}
