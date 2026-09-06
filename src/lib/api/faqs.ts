import { apiFetch, DEMO_MODE } from "./client";
import { seedFaqs } from "./seed";
import type { Faq } from "./types";

export async function fetchFaqs(tag?: string): Promise<Faq[]> {
  if (DEMO_MODE) {
    let items = seedFaqs.filter((f) => f.isActive);
    if (tag) items = items.filter((f) => f.categoryTag === tag);
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return apiFetch<Faq[]>("/api/faqs", { params: { tag, active: true } });
}
