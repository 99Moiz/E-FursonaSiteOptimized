// ── Fursona Hub API client ─────────────────────────────────────
//
// Base URL comes from VITE_API_BASE_URL (see .env / .env.example):
//   - Local testing:  https://localhost:7230
//   - Live:           https://ecomdesignshub.runasp.net
// The backend (EcommDesignsHub / FursonaHub.API) whitelists these CORS
// origins by default: http://localhost:8080, http://localhost:8081, and
// https://ecomdesignshub.com — see Program.cs. This app's dev server runs
// on port 8081 to match that out of the box (see vite.config.ts).

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "https://ecomdesignshub.runasp.net").replace(/\/$/, "");

// export const API_BASE_URL = ("https://localhost:7230");

// Toggle in .env: when true, all data hooks use local seed data instead of
// hitting the network. Handy for previewing the UI before the backend is
// deployed/reachable. Defaults to false — real API by default.
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore — not a JSON error body
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/**
 * Resolves an image path returned by the API into a fully-qualified URL.
 * The backend stores uploads under wwwroot (e.g. "/uploads/fursona/x.jpg"),
 * so relative paths need the API origin prefixed. Already-absolute URLs
 * (https://...) pass through untouched.
 */
export function resolveImageUrl(path: string | null | undefined, fallback = "/placeholder.svg"): string {
  if (!path) return fallback;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  // Bundled front-end assets (Vite dev/build output) and public files are already
  // app-absolute and must not be routed through the API origin.
  if (/(^|\/)(assets|src)\//.test(path) || path.startsWith("/placeholder")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ── Image optimization ────────────────────────────────────────────
//
// The backend only stores/returns original, full-resolution uploads (no
// thumbnail/medium variants), and those uploads are served from the same
// origin as the JSON API on a free hosting plan with no CDN in front of it.
// Rather than requiring backend changes, we route backend-served uploads
// through wsrv.nl (images.weserv.nl) — a free, no-signup image proxy/CDN —
// which resizes, re-encodes to WebP, and caches the result at its edge. This
// shrinks payloads for card/thumbnail contexts and takes repeat requests
// (from ANY visitor, not just the same browser) off the MonsterASP origin
// entirely. If the proxy ever fails, callers fall back to the original URL
// (see SmartImage) so this can never make an image permanently unavailable.
export type ImageSize = "thumb" | "medium" | "large" | "original";

const IMAGE_SIZE_PRESETS: Record<Exclude<ImageSize, "original">, { w: number; q: number }> = {
  thumb: { w: 480, q: 75 },
  medium: { w: 900, q: 78 },
  large: { w: 1440, q: 82 },
};

function isProxyableOrigin(url: string): boolean {
  if (!url.startsWith(API_BASE_URL)) return false;
  try {
    const { hostname, protocol } = new URL(url);
    // wsrv.nl fetches the source over the public internet — it can never
    // reach a local dev backend, so skip proxying for localhost origins.
    return protocol === "https:" && hostname !== "localhost" && hostname !== "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Like resolveImageUrl, but for `thumb`/`medium`/`large` requests a resized,
 * WebP-encoded copy from wsrv.nl instead of the original file — ONLY for
 * uploads actually served by our own API origin. Bundled assets, demo/seed
 * URLs, data/blob URLs, and `size: "original"` all pass through unchanged.
 */
export function optimizedImageUrl(
  path: string | null | undefined,
  size: ImageSize = "medium",
  fallback = "/placeholder.svg",
): string {
  const resolved = resolveImageUrl(path, fallback);
  if (size === "original" || !isProxyableOrigin(resolved)) return resolved;

  const preset = IMAGE_SIZE_PRESETS[size];
  const proxied = new URL("https://wsrv.nl/");
  proxied.searchParams.set("url", resolved);
  proxied.searchParams.set("w", String(preset.w));
  proxied.searchParams.set("q", String(preset.q));
  proxied.searchParams.set("output", "webp");
  return proxied.toString();
}

/** Builds a srcSet string across the given size presets for responsive <img> markup. */
export function optimizedSrcSet(
  path: string | null | undefined,
  sizes: Exclude<ImageSize, "original">[] = ["thumb", "medium"],
): string | undefined {
  const resolved = resolveImageUrl(path);
  if (!isProxyableOrigin(resolved)) return undefined;
  return sizes.map((s) => `${optimizedImageUrl(path, s)} ${IMAGE_SIZE_PRESETS[s].w}w`).join(", ");
}
