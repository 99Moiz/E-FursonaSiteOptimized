import { apiFetch, DEMO_MODE } from "./client";
import { seedGallery } from "./seed";
import type { SiteGalleryItem } from "./types";

export async function fetchSiteGallery(): Promise<SiteGalleryItem[]> {
  if (DEMO_MODE) return seedGallery.filter((g) => g.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return apiFetch<SiteGalleryItem[]>("/api/gallery", { params: { active: true } });
}
