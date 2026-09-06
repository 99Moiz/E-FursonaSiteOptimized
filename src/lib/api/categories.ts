import { apiFetch, DEMO_MODE } from "./client";
import { seedCategories } from "./seed";
import type { Category } from "./types";

export async function fetchActiveCategories(): Promise<Category[]> {
  if (DEMO_MODE) return seedCategories.filter((c) => c.isActive);
  return apiFetch<Category[]>("/api/FurCategories/active");
}
