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
      {/* Near-full-screen on mobile (small outer margin), a proper centered
          card on larger screens. The close button (see dialog.tsx) is
          positioned relative to THIS box, and now always has enough clear
          space around it since content below starts with real padding
          instead of sitting flush at the very top edge. */}
      <DialogContent className="h-[100dvh] w-full max-w-full overflow-y-auto rounded-none border-0 bg-white p-0 sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-xl sm:border sm:border-border md:max-w-4xl">
        {isLoading && (
          <div className="animate-pulse">
            <div className="h-64 bg-background-alt sm:h-80" />
            <div className="space-y-3 p-5 sm:p-6">
              <div className="h-3 w-24 rounded bg-background-alt" />
              <div className="h-6 w-2/3 rounded bg-background-alt" />
              <div className="h-3 w-full rounded bg-background-alt" />
              <div className="h-3 w-5/6 rounded bg-background-alt" />
              <div className="mt-4 h-10 w-40 rounded-lg bg-background-alt" />
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            <DialogTitle className="font-display text-lg text-foreground">Couldn't load this project</DialogTitle>
            <p className="text-sm text-muted-foreground">Please close this window and try again.</p>
          </div>
        )}

        {data && !isLoading && (
          <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            {/* Visuals — starts with real top padding, so the close button
                (top-right of the whole modal) always has clear space and
                never reads as "trapped inside" the image. */}
            <div className="flex flex-col gap-3 bg-background-alt p-4 pt-14 sm:p-5 sm:pt-14">
              {heroIsVideo ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <video
                    key={hero}
                    src={hero}
                    poster={cover ?? undefined}
                    controls
                    preload="metadata"
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              ) : (
                <>
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-white sm:aspect-[4/5]">
                    {hero ? (
                      <SmartImage
                        src={hero}
                        size="large"
                        alt={data.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-muted-foreground">
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
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                            hero === t.url ? "border-primary" : "border-transparent hover:border-border-strong"
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
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 p-5 sm:p-6">
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary-strong">
                {data.category}
              </span>
              <DialogTitle className="font-display text-xl font-bold leading-tight text-foreground sm:text-2xl">
                {data.title}
              </DialogTitle>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {data.description || data.shortDesc}
              </p>

              {data.features?.length > 0 && (
                <ul className="mt-1 grid grid-cols-1 gap-2">
                  {data.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <button onClick={goCommission} className="btn-pill mt-4 self-start">
                Commission Now
                <span className="btn-pill-arrow">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
