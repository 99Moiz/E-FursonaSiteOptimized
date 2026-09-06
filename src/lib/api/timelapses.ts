import { apiFetch, DEMO_MODE } from "./client";
import { seedTimelapses } from "./seed";
import type { TimelapseVideo } from "./types";

export async function fetchTimelapseVideos(): Promise<TimelapseVideo[]> {
  if (DEMO_MODE) {
    return seedTimelapses.filter((v) => v.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return apiFetch<TimelapseVideo[]>("/api/timelapses", { params: { active: true } });
}
