import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MediaSkeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/ui/smart-image";
import { useTimelapseVideos } from "@/lib/api/queries";
import { resolveImageUrl } from "@/lib/api/client";
import type { TimelapseVideo } from "@/lib/api/types";

export function TimelapseVideos() {
  const { data: rawVideos = [], isLoading } = useTimelapseVideos();
  const [activeVideo, setActiveVideo] = useState<TimelapseVideo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Resolve relative API paths (e.g. "/uploads/timelapses/x.mp4") into full
  // URLs; bundled demo-mode assets already pass through untouched.
  const videos = useMemo(
    () =>
      rawVideos
        .filter((v) => v.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((v) => ({
          ...v,
          thumbnailUrl: resolveImageUrl(v.thumbnailUrl),
          videoUrl: v.videoUrl ? resolveImageUrl(v.videoUrl) : null,
        })),
    [rawVideos]
  );

  const openVideo = (video: TimelapseVideo) => {
    setActiveVideo(video);
    setModalOpen(true);
  };

  return (
    <section id="timelapses" className="bg-texture-dots relative border-y border-border bg-background-alt py-14 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="kicker">Watch It Happen</p>
          <h2 className="mt-3 font-display font-bold text-foreground max-w-2xl mx-auto">
            Time-lapse Videos
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every commission, sped up — from the first pencil line to the finished character in
            minutes. Hover a card for a quick preview, or tap to watch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[4/5] rounded-xl" />
              ))
            : videos.map((v, i) => (
                <TimelapseCard key={v.id} video={v} index={i} eager={i < 2} onOpen={() => openVideo(v)} />
              ))}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[min(96vw,640px)] max-w-none max-h-[90vh] overflow-y-auto border-border bg-white p-0 rounded-xl">
          {activeVideo && (
            <div>
              <div className="relative w-full aspect-[4/5] sm:aspect-video bg-black sm:rounded-t-[1.75rem] overflow-hidden">
                <video
                  key={activeVideo.id}
                  src={activeVideo.videoUrl ?? undefined}
                  poster={activeVideo.thumbnailUrl}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain bg-black"
                >
                  Sorry, your browser doesn't support embedded videos.
                </video>
              </div>
              <div className="p-6 sm:p-8">
                <span className="text-[11px] uppercase tracking-[0.25em] text-primary-strong">
                  Time-lapse Preview
                </span>
                <DialogTitle className="mt-2 font-display text-xl sm:text-2xl font-bold leading-tight">
                  {activeVideo.title}
                </DialogTitle>
                {activeVideo.description && (
                  <p className="mt-3 text-sm sm:text-base text-foreground leading-relaxed">
                    {activeVideo.description}
                  </p>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                  Demo preview clip — full-length footage for this build is on the way.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TimelapseCard({
  video,
  index,
  eager,
  onOpen,
}: {
  video: TimelapseVideo;
  index: number;
  eager: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setThumbnailLoaded(false);
    setThumbnailError(false);
    setPreviewLoaded(false);
  }, [video.thumbnailUrl, video.videoUrl]);

  const thumbnailSrc = thumbnailError ? "/placeholder.svg" : video.thumbnailUrl;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08 }}
      aria-label={`Play time-lapse: ${video.title}`}
      className="group relative flex flex-col text-left rounded-xl border border-border bg-white overflow-hidden transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-black/20">
        <MediaSkeleton isLoaded={thumbnailLoaded} className="h-full w-full">
          <SmartImage
            src={thumbnailSrc}
            size="thumb"
            alt={video.title}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setThumbnailLoaded(true)}
            onError={(event) => {
              setThumbnailError(true);
              setThumbnailLoaded(true);
              event.currentTarget.src = "/placeholder.svg";
            }}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              hovered && video.videoUrl ? "opacity-0" : "opacity-100 group-hover:scale-110"
            }`}
          />
        </MediaSkeleton>

        {/* Hover preview — only mounted on hover so nothing loads until needed */}
        {hovered && video.videoUrl && (
          <MediaSkeleton isLoaded={previewLoaded} className="absolute inset-0 h-full w-full">
            <video
              ref={videoRef}
              src={video.videoUrl}
              muted
              autoPlay
              loop
              playsInline
              preload="none"
              onLoadedData={() => setPreviewLoaded(true)}
              onError={() => setPreviewLoaded(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </MediaSkeleton>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

        {/* Play icon overlay */}
        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${
            hovered && video.videoUrl ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="grid place-items-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/40 backdrop-blur border border-white/30 transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:scale-110">
            <Play
              className="h-5 w-5 sm:h-6 sm:w-6 text-white translate-x-0.5 transition-colors group-hover:text-black"
              fill="currentColor"
            />
          </span>
        </div>

        {video.durationLabel && (
          <span className="absolute top-3 right-3 rounded-full bg-black/70 backdrop-blur px-2.5 py-1 text-[10px] font-medium tracking-wide text-white">
            {video.durationLabel}
          </span>
        )}

        <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
          Time-lapse
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display font-semibold text-sm sm:text-base leading-snug group-hover:text-primary-strong transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}
