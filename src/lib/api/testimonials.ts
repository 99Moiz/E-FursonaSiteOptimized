import { apiFetch, DEMO_MODE } from "./client";
import { seedTestimonials } from "./seed";
import type { Testimonial } from "./types";

export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (DEMO_MODE) return seedTestimonials.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return apiFetch<Testimonial[]>("/api/Testimonials", { params: { active: true } });
}
