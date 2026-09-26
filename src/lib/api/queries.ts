import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductBySlug } from "./products";
import { fetchActiveCategories } from "./categories";
import { fetchFaqs } from "./faqs";
import { fetchTestimonials } from "./testimonials";
import { fetchSiteGallery } from "./gallery";
import { fetchTimelapseVideos } from "./timelapses";
import { fetchBeforeAfterImages } from "./beforeAfter";
import { fetchWorkInProgressImages } from "./workInProgress";
import type { ProductQuery } from "./types";

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => fetchProducts(query),
    staleTime: 60_000,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug as string),
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchActiveCategories,
    staleTime: 5 * 60_000,
  });
}

export function useFaqs(tag?: string) {
  return useQuery({
    queryKey: ["faqs", tag],
    queryFn: () => fetchFaqs(tag),
    staleTime: 5 * 60_000,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 5 * 60_000,
  });
}

export function useSiteGallery() {
  return useQuery({
    queryKey: ["site-gallery"],
    queryFn: fetchSiteGallery,
    staleTime: 5 * 60_000,
  });
}

export function useTimelapseVideos() {
  return useQuery({
    queryKey: ["timelapse-videos"],
    queryFn: fetchTimelapseVideos,
    staleTime: 5 * 60_000,
  });
}

export function useBeforeAfterImages() {
  return useQuery({
    queryKey: ["before-after-images"],
    queryFn: fetchBeforeAfterImages,
    staleTime: 5 * 60_000,
  });
}

export function useWorkInProgressImages() {
  return useQuery({
    queryKey: ["work-in-progress-images"],
    queryFn: fetchWorkInProgressImages,
    staleTime: 5 * 60_000,
  });
}
