import { apiFetch, DEMO_MODE } from "./client";
import type { WhatsAppInquiryResponse } from "./types";

// Fallback number only used in DEMO_MODE, or if the live number can't be
// resolved from the backend for some reason. Real single-product inquiries
// always go through the API, which owns the real number server-side.
const DEMO_WHATSAPP_NUMBER = "16094594343";

// Optional fast-path: if set, cart checkout can build its WhatsApp link
// immediately instead of waiting on a network round-trip just to learn a
// number that rarely changes. Entirely opt-in — unset, behavior is
// byte-for-byte identical to before (always resolves via the API).
const CONFIGURED_WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() || undefined;

function buildWaLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Logs a product inquiry server-side and returns a pre-filled wa.me link.
 * Mirrors POST /api/whatsapp/inquiry — public endpoint, no API key needed.
 */
export async function sendWhatsAppInquiry(productSlug?: string): Promise<WhatsAppInquiryResponse> {
  if (DEMO_MODE) {
    const message = productSlug
      ? `Hi! I'm interested in this product (slug: ${productSlug}). Can you share more details and availability?`
      : "Hi! I'd like to inquire about a custom fursuit build. Can you help?";
    return { link: buildWaLink(DEMO_WHATSAPP_NUMBER, message), message };
  }

  return apiFetch<WhatsAppInquiryResponse>("/api/whatsapp/inquiry", {
    method: "POST",
    body: JSON.stringify({ productSlug }),
  });
}

// The API only ever returns a full wa.me link (number baked in), never the
// bare number — so for a custom multi-item cart message, we log one generic
// inquiry to get a real link, then extract the number from it and re-use it
// with our own message. Cached for the session so checkout is instant after
// the first call.
let cachedNumber: string | null = null;

async function resolveWhatsAppNumber(): Promise<string> {
  if (cachedNumber) return cachedNumber;

  // Fast path: a configured number means the FIRST WhatsApp cart checkout
  // in a session doesn't have to wait on a network round-trip (plus a DB
  // write) just to learn where to send the message. We still fire the
  // inquiry log in the background (not awaited) so server-side logging is
  // preserved — it just no longer blocks link construction.
  if (CONFIGURED_WHATSAPP_NUMBER) {
    cachedNumber = CONFIGURED_WHATSAPP_NUMBER;
    if (!DEMO_MODE) {
      sendWhatsAppInquiry().catch(() => {
        // Best-effort logging only — the link itself already works.
      });
    }
    return cachedNumber;
  }

  if (DEMO_MODE) {
    cachedNumber = DEMO_WHATSAPP_NUMBER;
    return cachedNumber;
  }
  try {
    const { link } = await sendWhatsAppInquiry();
    const match = link.match(/wa\.me\/(\d+)/);
    cachedNumber = match?.[1] ?? DEMO_WHATSAPP_NUMBER;
  } catch {
    cachedNumber = DEMO_WHATSAPP_NUMBER;
  }
  return cachedNumber;
}

/**
 * Cart checkout with multiple items — the backend inquiry endpoint only
 * accepts a single product slug, so the order summary is composed
 * client-side using the real WhatsApp number resolved from the API.
 */
export async function cartInquiryLink(items: { title: string; price: number; qty: number }[]) {
  const number = await resolveWhatsAppNumber();
  const lines = items.map((i) => `• ${i.title} × ${i.qty} — $${(i.price * i.qty).toLocaleString()}`);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const message = `Hi! I'd like to place an order:\n${lines.join("\n")}\n\nTotal: $${total.toLocaleString()}`;
  return buildWaLink(number, message);
}
