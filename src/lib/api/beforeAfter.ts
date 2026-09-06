import { apiFetch, DEMO_MODE } from "./client";
import { seedBeforeAfter } from "./seed";
import type { BeforeAfterImage } from "./types";

export async function fetchBeforeAfterImages(): Promise<BeforeAfterImage[]> {
  if (DEMO_MODE) {
    return seedBeforeAfter.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return apiFetch<BeforeAfterImage[]>("/api/before-after", { params: { active: true } });
}
