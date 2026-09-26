import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Star,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  RefreshCcw,
  Truck,
  ImageOff,
  Play,
  Loader2,
} from "lucide-react";
import { useProduct } from "@/lib/api/queries";
import { resolveImageUrl } from "@/lib/api/client";
import { SmartImage } from "@/components/ui/smart-image";
import { sendWhatsAppInquiry } from "@/lib/api/whatsapp";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProduct(slug);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [waLoading, setWaLoading] = useState(false);

  useEffect(() => {
    setActiveImage(null);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  const cover = data ? resolveImageUrl(data.coverImage) : null;
  const gallery = (data?.gallery ?? []).map((g) => ({
    url: resolveImageUrl(g.imageUrl),
    alt: g.altText || data?.title || "Product image",
  }));
  const videoEntries = (data?.videos ?? [])
    .map((v) => ({
      url: resolveImageUrl(v.playbackUrl ?? v.videoUrl ?? v.externalUrl ?? ""),
      thumb: v.thumbnailUrl ? resolveImageUrl(v.thumbnailUrl) : null,
      title: v.title || data?.title || "Video",
    }))
    .filter((v) => !!v.url);

  const thumbsBase = cover ? [{ url: cover, alt: data?.title || "Product" }, ...gallery.filter((g) => g.url !== cover)] : gallery;
  const thumbs = [...thumbsBase, ...videoEntries.map((v) => ({ url: v.url, alt: v.title, thumb: v.thumb, isVideo: true } as any))];

  const hero = activeImage ?? cover;
  const heroIsVideo = !!videoEntries.find((v) => v.url === hero);

  const handleWhatsApp = async () => {
    setWaLoading(true);
    try {
      const { link } = await sendWhatsAppInquiry(slug);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch {
      window.open("https://wa.me/16094594343", "_blank", "noopener,noreferrer");
    } finally {
      setWaLoading(false);
    }
  };

  if (isError && !isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This commission may have been removed or the link is incorrect.</p>
        <button onClick={() => navigate("/#portfolio")} className="btn-pill mt-6">
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24">
      {/* Breadcrumb — Daraz-style trail */}
      <div className="border-b border-border bg-background-alt">
        <div className="container mx-auto flex items-center gap-1.5 overflow-x-auto whitespace-nowrap px-4 py-3 text-xs text-muted-foreground sm:px-6 sm:text-sm">
          <Link to="/" className="shrink-0 hover:text-primary-strong">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link to="/#portfolio" className="shrink-0 hover:text-primary-strong">Portfolio</Link>
          {data && (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="shrink-0 hover:text-primary-strong">{data.category}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-foreground">{data.title}</span>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {isLoading && (
          <div className="grid animate-pulse gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-3">
              <div className="skeleton aspect-square w-full rounded-xl" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-16 w-16 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-24 w-full" />
              <div className="skeleton h-12 w-48" />
            </div>
          </div>
        )}

        {data && !isLoading && (
          <>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
              {/* Gallery */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="overflow-hidden rounded-xl border border-border bg-background-alt">
                  {heroIsVideo ? (
                    <video
                      key={hero}
                      src={hero ?? undefined}
                      poster={cover ?? undefined}
                      controls
                      preload="metadata"
                      autoPlay
                      playsInline
                      className="aspect-square w-full bg-black object-contain"
                    />
                  ) : hero ? (
                    <SmartImage
                      src={hero}
                      size="large"
                      alt={data.title}
                      loading="eager"
                      decoding="async"
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-square place-items-center text-muted-foreground">
                      <ImageOff className="h-10 w-10" />
                    </div>
                  )}
                </div>

                {thumbs.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {thumbs.map((t: any) => (
                      <button
                        key={t.url}
                        onClick={() => setActiveImage(t.url)}
                        aria-label={`View ${t.alt}`}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                          hero === t.url ? "border-primary" : "border-border hover:border-border-strong"
                        }`}
                      >
                        <SmartImage src={t.thumb ?? t.url} size="thumb" alt={t.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        {t.isVideo && (
                          <span className="absolute inset-0 grid place-items-center bg-black/30">
                            <Play className="h-4 w-4 text-white" fill="white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info panel */}
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-primary-strong">{data.category}</span>
                <h1 className="mt-1.5 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {data.title}
                </h1>

                {data.rating > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(data.rating) ? "fill-primary text-primary" : "text-border-strong"}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{data.rating.toFixed(1)} rating</span>
                  </div>
                )}

                <div className="mt-4 flex items-baseline gap-2 rounded-lg bg-background-alt px-4 py-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Starting from</span>
                  <span className="font-display text-2xl font-bold text-primary-strong sm:text-3xl">
                    ${data.price.toLocaleString()}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{data.shortDesc}</p>

                {data.features?.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {data.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTAs */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href="/#contact" className="btn-pill flex-1 sm:flex-none">
                    Commission Now
                    <span className="btn-pill-arrow">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                  <button onClick={handleWhatsApp} disabled={waLoading} className="btn-pill-outline flex-1 gap-2 sm:flex-none">
                    {waLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                    Ask on WhatsApp
                  </button>
                </div>

                {/* Trust badges — Daraz-style delivery/guarantee row */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
                  {[
                    { icon: ShieldCheck, label: "Secure inquiry" },
                    { icon: RefreshCcw, label: "Revisions included" },
                    { icon: Truck, label: "Ships worldwide" },
                  ].map((b) => {
                    const Icon = b.icon;
                    return (
                      <div key={b.label} className="flex flex-col items-center gap-1.5">
                        <Icon className="h-5 w-5 text-primary-strong" />
                        <span className="text-[11px] text-muted-foreground">{b.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description + specs */}
            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-lg font-bold text-foreground">Description</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {data.description || data.shortDesc}
                </p>
              </motion.div>

              {data.specs?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display text-lg font-bold text-foreground">Specifications</h2>
                  <dl className="mt-3 divide-y divide-border rounded-lg border border-border">
                    {data.specs.map((s) => (
                      <div key={s.id} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="text-right font-medium text-foreground">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
