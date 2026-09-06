# Fursona Hub

Custom fursuit e-commerce storefront — plain React (Vite + React Router), wired to
the real EcommDesignsHub / Fursona .NET API.

## Quick start

```bash
npm install
npm run dev
```

Opens on **http://localhost:8081** (matches the backend's CORS whitelist out of the box —
see `Program.cs`, which allows `localhost:8080`, `localhost:8081`, and `https://ecomdesignshub.com`).

By default `.env` now points at your real test API (`https://localhost:7230`) with
`VITE_DEMO_MODE=false` — so run the .NET backend locally (`dotnet run`, HTTPS profile,
port `7230`) before `npm run dev`, or switch to demo mode / the live URL below.

## Connecting the real API

Edit `.env` to switch between local testing and live:

```bash
# Local testing
VITE_API_BASE_URL=https://localhost:7230

# Live
VITE_API_BASE_URL=https://ecomdesignshub.runasp.net
```

Both are already wired up — just uncomment whichever one you need in `.env`.
Set `VITE_DEMO_MODE=true` instead if you want to browse the UI with local seed data
without hitting either backend at all.

**Note on `https://localhost:7230`:** this is the ASP.NET Core dev-cert HTTPS profile.
The first time you hit it from the browser you may see a certificate warning — either
click through it, or run `dotnet dev-certs https --trust` once to trust the local dev
certificate.

Whichever base URL you use, make sure its frontend origin is in the `AllowedOrigins`
list in `Program.cs` — `localhost:8081` (this app's dev port) and `https://ecomdesignshub.com`
are already whitelisted; add your production frontend domain there too once you deploy it.

## What's wired to the real API

| Feature | Endpoint |
|---|---|
| Product grid (home + shop) | `GET /api/products` |
| Product detail page | `GET /api/products/{slug}` |
| Category filter | `GET /api/FurCategories/active` |
| FAQ accordion | `GET /api/faqs` |
| Testimonials carousel | `GET /api/Testimonials` |
| Site gallery | `GET /api/gallery` |
| "Inquire on WhatsApp" (single product) | `POST /api/whatsapp/inquiry` |
| Cart checkout (multi-item) | Resolves the real number via the inquiry endpoint, then builds the multi-item message client-side — the backend only supports a single product per logged inquiry |

All API calls live in `src/lib/api/`. `client.ts` is the shared fetch wrapper;
`types.ts` mirrors the backend DTOs field-for-field; `queries.ts` exposes React Query
hooks (`useProducts`, `useProduct`, `useCategories`, `useFaqs`, `useTestimonials`,
`useSiteGallery`) used throughout the UI.

## Demo mode

`src/lib/api/seed.ts` contains local seed data shaped exactly like the real API responses.
When `VITE_DEMO_MODE=true`, every hook reads from there instead of the network — handy for
previewing/design review before the backend is deployed, or if the API is temporarily down.
Turn it off for the real, live site.

## ⚠️ Security note

While integrating the backend, I noticed `appsettings.json` in the .NET project has a
**live production database connection string (with username & password) committed directly
in the file**, just commented out above the real active setting. A few things worth doing:

1. **Rotate that database password** — anything committed to a repo (even a private one, even
   commented out) should be treated as compromised.
2. Move connection strings and API keys into environment variables or `dotnet user-secrets` /
   Azure Key Vault, not `appsettings.json`.
3. Double-check `.gitignore` excludes `appsettings.Development.json` and any file with real
   secrets before pushing to GitHub.

I didn't reproduce the credential anywhere in this project — just flagging it so it gets fixed.

## Stack

- Vite + React 18 + TypeScript
- React Router v6
- Tailwind CSS v3 (same neon/aurora design tokens as the original build)
- Framer Motion
- TanStack Query (React Query) for all data fetching
- shadcn/ui primitives + Radix UI
- EmailJS (contact form — same account already configured in the original project)

## Project structure

```
src/
  components/
    Header.tsx          — scroll-aware glass nav, ported from the agency site's header mechanics
    Footer.tsx
    site/                — all homepage sections + shared ProductCard + CartModal + WhatsAppFab
  pages/
    Home.tsx / Shop.tsx / ProductDetail.tsx / NotFound.tsx
  lib/api/
    client.ts            — fetch wrapper, image URL resolver, demo-mode flag
    types.ts              — DTOs mirroring the backend exactly
    products.ts / categories.ts / faqs.ts / testimonials.ts / gallery.ts / whatsapp.ts
    queries.ts            — React Query hooks
    seed.ts                — demo-mode fallback data
  context/CartContext.tsx — cart state (kept from the original build)
```
