import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import welcomeVideo from "@/assets/video/welcome.mp4";
import welcomePoster from "@/assets/video/welcome-poster.jpg";

/**
 * Short narrated intro from the artist.
 * - Hovering (desktop) plays a MUTED preview loop. It has to stay muted:
 *   browsers silently reject `play()` for unmuted video unless it's fired
 *   from a real click, so an unmuted attempt on mouseenter always failed —
 *   that was the "hover doesn't play" bug.
 * - Clicking toggles real playback WITH sound; once that's happened, hover
 *   no longer takes over — the click state is in full control.
 * - When the video finishes, it resets back to frame 0 and shows the play
 *   button again, so clicking always restarts from the beginning.
 */
export function WelcomeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [isHoverPreviewing, setIsHoverPreviewing] = useState(false);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    setIsHoverPreviewing(false);
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
            <span className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full bg-gradient-to-br from-primary to-[#7fc700] shadow-glow transition-transform duration-300 ease-premium group-hover:scale-110 active:scale-95">
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
