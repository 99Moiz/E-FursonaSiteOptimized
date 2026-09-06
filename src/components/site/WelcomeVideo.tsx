import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import welcomePoster from "@/assets/video/welcome-poster.png";


export function WelcomeVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [isHoverPreviewing, setIsHoverPreviewing] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>();
  const videoSrcRef = useRef<string>();
  const videoLoadRef = useRef<Promise<string> | null>(null);

  const loadVideo = () => {
    if (videoSrcRef.current) return Promise.resolve(videoSrcRef.current);
    if (!videoLoadRef.current) {
      videoLoadRef.current = import("@/assets/video/welcome.mp4").then(({ default: src }) => {
        videoSrcRef.current = src;
        setVideoSrc(src);
        return src;
      });
    }
    return videoLoadRef.current;
  };

  const isMobileOrTablet = () => window.matchMedia("(max-width: 1024px)").matches;

  const stopAutoplay = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsHoverPreviewing(false);
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  const startMutedAutoplay = async () => {
    const video = videoRef.current;
    if (!video || started || !isMobileOrTablet()) return;

    const src = await loadVideo();
    if (!videoRef.current) return;
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.load();
    video.currentTime = 0;

    const tryPlay = () => {
      void video.play()
        .then(() => {
          setIsHoverPreviewing(true);
          setPlaying(true);
        })
        .catch(() => {
          setIsHoverPreviewing(false);
          setPlaying(false);
        });
    };

    tryPlay();
    requestAnimationFrame(tryPlay);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tryAutoplayInView = () => {
      if (started || !isMobileOrTablet()) return;

      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

      if (isInView) {
        startMutedAutoplay();
      } else {
        stopAutoplay();
      }
    };

    tryAutoplayInView();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          startMutedAutoplay();
        } else if (!started && isMobileOrTablet()) {
          stopAutoplay();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(section);

    const handleResize = () => {
      if (!started && isMobileOrTablet()) {
        tryAutoplayInView();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [started]);

  const toggleSound = async (event?: React.MouseEvent<HTMLElement | HTMLButtonElement> | React.PointerEvent<HTMLElement | HTMLButtonElement>) => {
    const v = videoRef.current;
    if (!v) return;

    event?.preventDefault();
    event?.stopPropagation();

    setIsHoverPreviewing(false);

    if (v.muted || !started) {
      const src = await loadVideo();
      if (!videoRef.current) return;
      v.src = src;
      if (v.readyState <= 1) v.load();
      v.loop = false;
      v.muted = false;
      v.defaultMuted = false;
      v.volume = 1;
      v.currentTime = started ? v.currentTime : 0;
      v.removeAttribute("muted");

      if (v.paused) {
        void v.play().catch(() => {});
      }

      setStarted(true);
      setPlaying(true);
      return;
    }

    v.pause();
    setStarted(false);
    setPlaying(false);
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

  const onMouseEnter = async () => {
    const v = videoRef.current;
    if (!v || started) return; // once the user has clicked, hover no longer drives playback
    const src = await loadVideo();
    if (!videoRef.current) return;
    v.src = src;
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

        <motion.section
          ref={sectionRef}
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
            src={videoSrc}
            poster={welcomePoster}
            playsInline
            autoPlay={false}
            muted
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={onEnded}
            onPointerDown={toggleSound}
            onClick={toggleSound}
            className="h-full w-full cursor-pointer object-cover"
          />

          {/* Poster/controls overlay — fades out once sound playback (or the
              hover preview) is actually running */}
          <button
            type="button"
            onPointerDown={toggleSound}
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
        </motion.section>
      </div>
    </section>
  );
}
