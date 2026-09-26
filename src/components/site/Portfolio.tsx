import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, Eye, FolderOpen, Video } from "lucide-react";
import { useProducts, useCategories } from "@/lib/api/queries";
import type { ProductListItem } from "@/lib/api/types";
import { MediaSkeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/ui/smart-image";

const FEATURED_LIMIT = 8;

// Future-proof: use a `featured` flag if the API ever returns one, otherwise
// fall back to the curated `sortOrder` so the strongest work surfaces first.
function pickFeatured(items: ProductListItem[]): ProductListItem[] {
  const flagged = items.filter((i) => (i as ProductListItem & { featured?: boolean }).featured);
  const base = flagged.length ? flagged : [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  return base.slice(0, FEATURED_LIMIT);
}

function PortfolioCard({ item, index }: { item: ProductListItem; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [item.coverImage]);

  const hasVideo = Boolean((item as ProductListItem & { videos?: unknown[]; videoUrl?: string }).videos?.length || item.videoUrl);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${item.slug}`} className="card-premium group flex cursor-pointer flex-col overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden bg-background-alt">
          <MediaSkeleton isLoaded={imageLoaded} className="h-full w-full">
            <SmartImage
              src={item.coverImage}
              size="thumb"
              srcSetSizes={["thumb", "medium"]}
              sizes="(min-width:1280px) 23vw, (min-width:1024px) 31vw, (min-width:640px) 47vw, 47vw"
              alt={item.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
            />
          </MediaSkeleton>
          {hasVideo && (
            <span className="media-badge absolute right-2 top-2 !gap-1 before:!hidden">
              <Video className="h-3 w-3 text-primary" /> Video
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <span className="text-[10px] font-medium uppercase tracking-wide text-primary-strong">{item.category}</span>
          <h3 className="mt-1 line-clamp-1 font-display text-sm font-semibold text-foreground sm:text-base">
            {item.title}
          </h3>
          {item.shortDesc && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{item.shortDesc}</p>
          )}
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-strong sm:mt-3">
            <Eye className="h-3.5 w-3.5" /> View details
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function CardSkeleton() {
  return (
    <div className="card-premium overflow-hidden">
      <div className="skeleton aspect-[4/5] rounded-none" />
      <div className="space-y-2 p-3 sm:p-4">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  );
}

export function Portfolio() {
  const { data, isLoading, isError, refetch } = useProducts({ active: true });
  const { data: apiCategories } = useCategories();
  const [active, setActive] = useState("All");

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
    <section id="portfolio" className="relative py-14 px-4 sm:py-20 sm:px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center sm:mb-10"
        >
          <p className="kicker">Selected Work</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display font-bold text-foreground">
            A portfolio built one commission at a time.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A curated look at recent projects across every service we offer.
          </p>
        </motion.div>

        {/* Filter tabs — single horizontal scrolling line on mobile instead
            of wrapping to multiple rows, matching how category chips behave
            on most product/marketplace sites. */}
        {!isError && (tabs.length > 1 || isLoading) && (
          <div className="no-scrollbar mb-8 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mb-10 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-background-alt" />
                ))
              : tabs.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    aria-pressed={active === c}
                    className={`min-h-[40px] shrink-0 whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors sm:text-sm ${
                      active === c
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-white text-muted-foreground hover:border-border-strong hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white p-12 text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">We couldn't load the portfolio right now.</p>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 py-2 px-1 text-sm font-medium text-primary-strong hover:underline">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {/* Responsive grid — 2 cards on mobile AND tablet (per spec), 3 on desktop, 4 on wide screens */}
        {!isError && (
          <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.map((item, i) => (
                  <PortfolioCard key={item.id} item={item} index={i} />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-12 text-center sm:p-16">
            <FolderOpen className="h-9 w-9 text-muted-foreground" />
            <p className="font-display text-lg text-foreground">No projects here yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {active === "All"
                ? "New work is on the way. Check back soon or start your own commission."
                : `No ${active} projects to show yet - try another category.`}
            </p>
            <a href="#contact" className="btn-pill mt-2">
              Start a commission
              <span className="btn-pill-arrow">
                <Eye className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        )}

        {!isError && !isLoading && visible.length > 0 && (
          <div className="mt-10 text-center sm:mt-14">
            <a href="#contact" className="btn-pill">
              Commission your own
              <span className="btn-pill-arrow">
                <Eye className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
