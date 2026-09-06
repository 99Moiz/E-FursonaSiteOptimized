import { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle, ImageOff, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useProduct } from "@/lib/api/queries";
import { resolveImageUrl } from "@/lib/api/client";
import { SmartImage } from "@/components/ui/smart-image";

interface ProjectModalProps {
  slug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ slug, open, onOpenChange }: ProjectModalProps) {
  const { data, isLoading, isError } = useProduct(slug ?? undefined);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Reset the highlighted image whenever a different project is opened.
  useEffect(() => {
    setActiveImage(null);
  }, [slug]);

  const cover = data ? resolveImageUrl(data.coverImage) : null;
  // Prefer explicit `data.videoUrl`, otherwise fall back to the first item in `data.videos` (playbackUrl/videoUrl/externalUrl)
  const videoSource = data?.videoUrl
    ? data.videoUrl
    : data?.videos && data.videos.length
    ? data.videos[0].playbackUrl ?? data.videos[0].videoUrl ?? data.videos[0].externalUrl
    : null;
  const videoUrl = videoSource ? resolveImageUrl(videoSource) : null;
  const isVideo = !!videoUrl;

  const gallery = (data?.gallery ?? []).map((g) => ({
    url: resolveImageUrl(g.imageUrl),
    alt: g.altText || data?.title || "Project image",
  }));

  // Resolve videos (if any) so we can show thumbnails and allow playing them from the thumbs.
  const videoEntries = (data?.videos ?? [])
    .map((v) => ({
      url: resolveImageUrl(v.playbackUrl ?? v.videoUrl ?? v.externalUrl ?? ""),
      thumb: v.thumbnailUrl ? resolveImageUrl(v.thumbnailUrl) : null,
      title: v.title || data?.title || "Video",
    }))
    .filter((v) => !!v.url);

  const thumbsBase = cover
    ? [{ url: cover, alt: data?.title || "Project" }, ...gallery.filter((g) => g.url !== cover)]
    : gallery;

  // Append video thumbnails after image thumbs (use thumb if available, otherwise fall back to video url)
  const thumbs = [
    ...thumbsBase,
    ...videoEntries.map((ve) => ({ url: ve.url, alt: ve.title, thumb: ve.thumb, isVideo: true } as any)),
  ];

  const hero = activeImage ?? cover;

  const heroIsVideo = !!(videoEntries.find((ve) => ve.url === hero) || (videoUrl && videoUrl === hero));

  const goCommission = () => {
    onOpenChange(false);
    window.setTimeout(() => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[min(96vw,1000px)] max-h-[90vh] overflow-y-auto border-white/10 bg-card/95 backdrop-blur-xl p-0 sm:rounded-[1.75rem]">
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-0 animate-pulse">
            <div className="h-[360px] sm:h-[420px] bg-white/5 md:rounded-l-[1.75rem]" />
            <div className="p-6 sm:p-8 space-y-4">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-7 w-2/3 rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/5" />
              <div className="h-3 w-5/6 rounded bg-white/5" />
              <div className="h-3 w-4/6 rounded bg-white/5" />
              <div className="h-11 w-40 rounded-2xl bg-white/10 mt-6" />
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertTriangle className="h-8 w-8 text-white/40" />
            <DialogTitle className="font-display text-lg">Couldn't load this project</DialogTitle>
            <p className="text-sm text-white/55">Please close this window and try again.</p>
          </div>
        )}

        {data && !isLoading && (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] md:gap-6">
            {/* Visuals */}
            <div className="relative bg-black/50 p-4 sm:p-5 md:p-6 rounded-[1.75rem] overflow-hidden flex flex-col gap-3">
                  {heroIsVideo ? (
                /* Video Player (hero is a video) */
                <div className="relative w-full min-h-[260px] sm:min-h-[320px] max-h-[60vh] overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <video
                      key={hero}
                      src={hero}
                      poster={cover ?? undefined}
                      controls
                      preload="metadata"
                      autoPlay
                      playsInline
                      className="h-full w-full object-contain bg-black rounded-2xl"
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                </div>
              ) : (
                /* Image Gallery */
                <>
                  <div className="relative w-full min-h-[260px] sm:min-h-[320px] max-h-[60vh] overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10">
                    {hero ? (
                      <>
                        <SmartImage
                          src={hero}
                          size="thumb"
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-30 pointer-events-none"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <SmartImage
                            src={hero}
                            size="large"
                            alt={data.title}
                            loading="lazy"
                            decoding="async"
                            className="max-h-full max-w-full object-contain transition duration-700"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="grid h-full place-items-center text-white/30">
                        <ImageOff className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {thumbs.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {thumbs.map((t: any) => (
                        <button
                          key={t.url}
                          onClick={() => setActiveImage(t.url)}
                          aria-label={`View ${t.alt}`}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            hero === t.url ? "border-neon" : "border-transparent hover:border-white/30"
                          }`}
                        >
                          <SmartImage src={t.thumb ?? t.url} size="thumb" alt={t.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                          {t.isVideo && (
                            <span className="absolute inset-0 grid place-items-center">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                                <Play className="h-4 w-4 text-white" />
                              </span>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.35em] text-cyan-glow">
                {data.category}
              </span>
              <DialogTitle className="mt-2 font-display text-2xl sm:text-[2.35rem] md:text-3xl font-bold leading-tight">
                {data.title}
              </DialogTitle>

              <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
                {data.description || data.shortDesc}
              </p>

              {data.features?.length > 0 && (
                <ul className="mt-5 grid grid-cols-1 gap-2">
                  {data.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <button onClick={goCommission} className="btn-pill !text-base mt-8 self-start">
                🎨 Commission Now
                <span className="btn-pill-arrow">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
