import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import welcomeVideo from "@/assets/video/welcome.mp4";
import welcomePoster from "@/assets/video/welcome-poster.png";

/**
 * Short narrated intro from the artist.
 * - Desktop: hovering plays a MUTED preview loop (browsers reject unmuted
 *   `play()` unless it's fired from a real click/tap).
 * - Mobile: when the video scrolls into view, we attempt autoplay WITH
 *   sound (since that's what a "welcome" message needs to be useful). Most
 *   mobile browsers will still block that — there's no user gesture yet —
 *   so we catch the rejection and fall back to a muted autoplay preview
 *   with a visible "tap for sound" hint, same as the desktop hover case.
 * - Clicking/tapping always toggles real playback with sound; once that's
 *   happened, scroll/hover no longer drive it — the click state wins.
 * - When the video finishes, it resets to frame 0 and shows play again.
 */
export function WelcomeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [isHoverPreviewing, setIsHoverPreviewing] = useState(false);
  const [needsTapForSound, setNeedsTapForSound] = useState(false);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    setIsHoverPreviewing(false);
    setNeedsTapForSound(false);
    v.loop = false;
    if (v.paused) {
      v.muted = false;
      v.currentTime = started ? v.currentTime : 0;
      v.play().catch(() => {});
      setStarted(true);
    } else {
      v.pause();
    }
  };

  const onEnded = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = true;
    }
    setPlaying(false);
    setStarted(false);
  };

  const onMouseEnter = () => {
    const v = videoRef.current;
    if (!v || started) return; // once the user has clicked, hover no longer drives playback
    v.muted = true; // must stay muted — see note above
    v.loop = true;
    v.currentTime = 0;
    v.play()
      .then(() => setIsHoverPreviewing(true))
      .catch(() => setIsHoverPreviewing(false));
  };

  const onMouseLeave = () => {
    const v = videoRef.current;
    if (!v || started) return;
    setIsHoverPreviewing(false);
    v.pause();
    v.currentTime = 0;
  };

  // Mobile: auto-start on scroll-into-view, sound first, muted fallback.
  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile) return;
    const v = videoRef.current;
    const el = containerRef.current;
    if (!v || !el) return;

    let hasAttempted = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          if (started || hasAttempted) return; // user already took control, or we already tried once
          hasAttempted = true;
          v.currentTime = 0;
          v.muted = false;
          v.play()
            .then(() => {
              setStarted(true);
              setPlaying(true);
            })
            .catch(() => {
              // Sound-on autoplay blocked (expected on most mobile browsers
              // without a prior tap) — fall back to a muted preview loop so
              // the video still feels alive, and prompt for a tap to unmute.
              v.muted = true;
              v.loop = true;
              v.play()
                .then(() => {
                  setIsHoverPreviewing(true);
                  setNeedsTapForSound(true);
                })
                .catch(() => {});
            });
        } else if (!entry.isIntersecting) {
          // Pause when scrolled away — don't keep playing audio/video off-screen.
          if (!v.paused) v.pause();
          setIsHoverPreviewing(false);
        }
      },
      { threshold: [0, 0.6] },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <section className="relative px-4 sm:px-6 py-10 md:py-14">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <p className="kicker">A Quick Hello</p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-bold">
            Welcome — meet the artist behind the work.
          </h2>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="card-premium group relative mx-auto aspect-[16/8.7] w-full max-w-[1100px] overflow-hidden"
        >
          <video
            ref={videoRef}
            src={welcomeVideo}
            poster={welcomePoster}
            playsInline
            muted
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={onEnded}
            onClick={toggleSound}
            className="h-full w-full cursor-pointer object-cover"
          />

          {needsTapForSound && (
            <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white sm:bottom-4 sm:left-4">
              <Volume2 className="h-3.5 w-3.5" /> Tap for sound
            </span>
          )}

          {/* Poster/controls overlay — fades out once sound playback (or the
              hover preview) is actually running */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={playing && started ? "Pause welcome video" : "Play welcome video with sound"}
            className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-500 ${
              (started && playing) || isHoverPreviewing
                ? "opacity-0 pointer-events-none"
                : "opacity-100 group-hover:bg-black/35"
            }`}
          >
            <span className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full bg-primary shadow-sm transition-transform duration-300 ease-premium group-hover:scale-110 active:scale-95">
              {started && playing ? (
                <Pause className="h-7 w-7 sm:h-8 sm:w-8 text-black" fill="currentColor" />
              ) : (
                <Play className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5 text-black" fill="currentColor" />
              )}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
