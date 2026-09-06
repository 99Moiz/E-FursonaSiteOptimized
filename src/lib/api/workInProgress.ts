import { apiFetch, DEMO_MODE } from "./client";
import { seedWorkInProgress } from "./seed";
import type { WorkInProgressImage } from "./types";

export async function fetchWorkInProgressImages(signal?: AbortSignal): Promise<WorkInProgressImage[]> {
  if (DEMO_MODE) {
    return seedWorkInProgress.filter((w) => w.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return apiFetch<WorkInProgressImage[]>("/api/work-in-progress", { signal, params: { active: true } });
}
