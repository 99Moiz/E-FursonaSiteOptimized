import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, Eye, FolderOpen, Video } from "lucide-react";
import { useProducts, useCategories } from "@/lib/api/queries";
import type { ProductListItem } from "@/lib/api/types";
import { MediaSkeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/ui/smart-image";
import { ProjectModal } from "./ProjectModal";

const FEATURED_LIMIT = 8;

// Future-proof: use a `featured` flag if the API ever returns one, otherwise
// fall back to the curated `sortOrder` so the strongest work surfaces first.
function pickFeatured(items: ProductListItem[]): ProductListItem[] {
  const flagged = items.filter((i) => (i as ProductListItem & { featured?: boolean }).featured);
  const base = flagged.length ? flagged : [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  return base.slice(0, FEATURED_LIMIT);
}

function PortfolioCard({
  item,
  index,
  onOpen,
}: {
  item: ProductListItem;
  index: number;
  onOpen: (slug: string) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [item.coverImage]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium group relative flex flex-col overflow-hidden cursor-pointer"
      onClick={() => onOpen(item.slug)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <MediaSkeleton isLoaded={imageLoaded} className="h-full w-full">
          <SmartImage
            src={item.coverImage}
            size="thumb"
            srcSetSizes={["thumb", "medium"]}
            sizes="(min-width:1280px) 23vw, (min-width:1024px) 31vw, (min-width:640px) 47vw, 92vw"
            alt={item.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.08]"
          />
        </MediaSkeleton>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-start justify-between gap-1.5">
          <span className="rounded-full bg-black/55 backdrop-blur border border-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-neon">
            {item.category}
          </span>
          {((item as any).videos?.length || item.videoUrl) && (
            <span className="rounded-full bg-neon/20 border border-neon/40 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider text-neon flex items-center gap-1 font-medium">
              <Video className="h-3 w-3" /> Video
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-premium">
          <div className="px-4 pb-4 pt-8">
            <h3 className="font-display text-base sm:text-lg font-semibold text-white drop-shadow-sm truncate">
              {item.title}
            </h3>
            {item.shortDesc && (
              <p className="mt-1 text-xs text-white/65 line-clamp-2 max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-500 ease-premium">
                {item.shortDesc}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neon px-3.5 py-1.5 text-[11px] font-semibold text-black opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-premium">
              <Eye className="h-3 w-3" /> View Details
            </span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-transparent group-hover:ring-neon/40 transition" />
    </motion.article>
  );
}

function CardSkeleton() {
  return (
    <div className="card-premium overflow-hidden">
      <div className="skeleton aspect-[4/5] rounded-[inherit]" />
    </div>
  );
}

export function Portfolio() {
  const { data, isLoading, isError, refetch } = useProducts({ active: true });
  const { data: apiCategories } = useCategories();
  const [active, setActive] = useState("All");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const items = useMemo(() => data ?? [], [data]);

  // Category tabs come from the API when available, otherwise are derived from
  // the loaded projects — so the component stays fully dynamic either way.
  const tabs = useMemo(() => {
    const fromApi = (apiCategories ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => c.name);
    const names = fromApi.length ? fromApi : Array.from(new Set(items.map((i) => i.category)));
    return ["All", ...names.filter(Boolean)];
  }, [apiCategories, items]);

  const featured = useMemo(() => pickFeatured(items), [items]);

  const visible = useMemo(
    () => (active === "All" ? featured : items.filter((i) => i.category === active)),
    [active, featured, items],
  );

  return (
    <section id="portfolio" className="relative py-24 md:py-32 px-4 sm:px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <p className="kicker">Selected Work</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold max-w-2xl mx-auto">
            A portfolio built one commission at a time.
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            A curated look at recent projects across every service we offer.
          </p>
        </motion.div>

        {/* Filter tabs */}
        {!isError && (tabs.length > 1 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-9 w-24 rounded-full glass animate-pulse" />
                ))
              : tabs.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    aria-pressed={active === c}
                    className={`min-h-[44px] rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ease-premium ${
                      active === c
                        ? "bg-gradient-to-br from-primary to-[#7fc700] text-black shadow-premium hover:shadow-glow"
                        : "glass border border-white/10 text-white/70 hover:text-white hover:border-neon/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {c}
                  </button>
                ))}
          </motion.div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center gap-4 rounded-3xl glass p-12 text-center">
            <AlertTriangle className="h-8 w-8 text-white/40" />
            <p className="text-white/60">We couldn't load the portfolio right now.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 py-2 px-1 text-sm text-neon hover:underline"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {/* Uniform, fully responsive grid: 1 col mobile / 2 tablet / 3 desktop / 4 wide */}
        {!isError && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          >
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.map((item, i) => (
                  <PortfolioCard key={item.id} item={item} index={i} onOpen={setOpenSlug} />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl glass p-16 text-center">
            <FolderOpen className="h-9 w-9 text-white/30" />
            <p className="font-display text-lg">No projects here yet</p>
            <p className="text-sm text-white/50 max-w-sm">
              {active === "All"
                ? "New work is on the way. Check back soon or start your own commission."
                : `No ${active} projects to show yet - try another category.`}
            </p>
            <a href="#contact" className="btn-pill !text-sm mt-2">
              Start a commission
              <span className="btn-pill-arrow">
                <Eye className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        )}

        {!isError && !isLoading && visible.length > 0 && (
          <div className="mt-14 text-center">
            <a href="#contact" className="btn-pill !text-base">
              Commission your own
              <span className="btn-pill-arrow">
                <Eye className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        )}
      </div>

      <ProjectModal slug={openSlug} open={!!openSlug} onOpenChange={(o) => !o && setOpenSlug(null)} />
    </section>
  );
}
