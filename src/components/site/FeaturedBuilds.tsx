import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useSiteGallery } from "@/lib/api/queries";
import { MediaSkeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/ui/smart-image";

const fallbackBuilds = [
  // { img: dragon, label: "Aether Dragon Mk.II", tag: "Full Fursuit" },
  // { img: wolf, label: "Apex Wolf — Onyx", tag: "Full Fursuit" },
  // { img: fox, label: "Verdant Fox Kit", tag: "Partial Suit" },
  // { img: cat, label: "Cyber Noir Feline", tag: "Head Build" },
  // { img: hybrid, label: "Chimera Hybrid", tag: "Custom Hybrid" },
  // { img: paws, label: "Glacier Paw Set", tag: "Paws & Tail" },
];

function FeaturedBuildImage({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [src]);

  return (
    <MediaSkeleton isLoaded={imageLoaded} className="h-full w-full">
      <SmartImage
        src={src}
        size="medium"
        srcSetSizes={["medium", "large"]}
        sizes="(min-width:1280px) 34vw, (min-width:1024px) 42vw, (min-width:640px) 56vw, 88vw"
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
    </MediaSkeleton>
  );
}

export function FeaturedBuilds() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: false });
  const [selected, setSelected] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const { data: galleryItems = [] } = useSiteGallery();

  const builds = useMemo(() => {
    const mapped = (galleryItems ?? [])
      .filter((item) => item.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item, index) => ({
        img: item.imageUrl,
        label: item.caption || `Gallery image ${index + 1}`,
        tag: item.altText || "Gallery image",
      }));

    return mapped.length > 0 ? mapped : fallbackBuilds;
  }, [galleryItems]);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !autoplay || isHoverPaused) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 3500);
    return () => window.clearInterval(id);
  }, [emblaApi, autoplay, isHoverPaused]);

  return (
    <section className="relative py-24 md:py-32 border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="kicker">Featured Builds</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">
              A living showcase of characters.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoplay((v) => !v)}
              aria-label={autoplay ? "Pause autoplay" : "Start autoplay"}
              className="grid place-items-center h-11 w-11 rounded-full glass border border-white/10 hover:border-neon/40 hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous build"
              className="grid place-items-center h-11 w-11 rounded-full glass border border-white/10 hover:bg-neon/15 hover:border-neon/40 hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next build"
              className="grid place-items-center h-11 w-11 rounded-full bg-gradient-to-br from-primary to-[#7fc700] text-black shadow-premium hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 ease-premium"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden -mx-2 px-2" ref={emblaRef}>
          <div className="flex gap-5">
            {builds.map((b, i) => (
              <div
                key={b.label}
                className="relative shrink-0 grow-0 basis-[88%] sm:basis-[56%] lg:basis-[42%] xl:basis-[34%]"
                onMouseEnter={() => setIsHoverPaused(true)}
                onMouseLeave={() => setIsHoverPaused(false)}
              >
                <div className="relative h-[22rem] sm:h-[24rem] overflow-hidden rounded-3xl glass group bg-black/60 border border-white/[0.07] shadow-premium transition-all duration-500 ease-premium group-hover:shadow-premium-lg">
                  {/* Ambient background blur — uses the small "thumb" preset since
                      the blur/scale hides detail anyway, instead of duplicating the
                      full-resolution main image request. */}
                  <SmartImage
                    src={b.img}
                    size="thumb"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                  />
                  {/* Main build image */}
                  <div className="relative z-10 h-full w-full overflow-hidden">
                    <FeaturedBuildImage src={b.img} alt={b.label} eager={i < 2} />
                  </div>
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/15 to-transparent pointer-events-none" />
                  <span className="absolute top-4 left-4 z-30 rounded-full bg-black/60 backdrop-blur border border-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-widest text-neon">
                    {b.tag}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between">
                    <span className="font-display text-base sm:text-lg font-semibold text-white drop-shadow">{b.label}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_12px_var(--neon)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {builds.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to build ${i + 1}`}
              className="grid place-items-center h-8 w-8 -my-3"
            >
              <span
                className="h-2 rounded-full transition-all"
                style={{
                  width: selected === i ? 28 : 8,
                  background: selected === i ? "var(--neon)" : "rgba(255,255,255,0.2)",
                }}
              />
            </button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center text-sm text-white/40"
        >
          Swipe, drag, or use the arrows to browse the collection.
        </motion.p>
      </div>
    </section>
  );
}
