import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
    <section className="bg-texture-grid relative border-y border-border bg-background-alt py-14 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Featured Builds</p>
            <h2 className="mt-3 font-display font-bold text-foreground">A living showcase of characters.</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoplay((v) => !v)}
              aria-label={autoplay ? "Pause autoplay" : "Start autoplay"}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-background-alt"
            >
              {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous build"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-background-alt"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next build"
              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-[#86cf00]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="-mx-2 overflow-hidden px-2" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-5">
            {builds.map((b, i) => (
              <div
                key={b.label}
                className="relative shrink-0 grow-0 basis-[80%] sm:basis-[56%] lg:basis-[42%] xl:basis-[34%]"
                onMouseEnter={() => setIsHoverPaused(true)}
                onMouseLeave={() => setIsHoverPaused(false)}
              >
                <div className="relative h-[20rem] overflow-hidden rounded-xl border border-border bg-background-alt shadow-xs transition-shadow duration-300 sm:h-[22rem] group-hover:shadow-md">
                  <div className="relative z-10 h-full w-full overflow-hidden">
                    <FeaturedBuildImage src={b.img} alt={b.label} eager={i < 2} />
                  </div>
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <span className="media-badge absolute left-3 top-3 z-30">
                    {b.tag}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 z-30">
                    <span className="font-display text-base font-semibold text-white drop-shadow sm:text-lg">{b.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {builds.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to build ${i + 1}`}
              className="grid h-8 w-8 -my-3 place-items-center"
            >
              <span
                className="h-2 rounded-full transition-all"
                style={{
                  width: selected === i ? 24 : 8,
                  background: selected === i ? "var(--primary)" : "var(--border-strong)",
                }}
              />
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Swipe, drag, or use the arrows to browse the collection.
        </p>
      </div>
    </section>
  );
}
