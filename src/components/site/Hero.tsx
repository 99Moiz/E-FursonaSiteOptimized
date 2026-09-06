import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, PenTool, Scissors, Layers } from "lucide-react";
import { Particles } from "./Aurora";
// import heroImg from "@/assets/hero-fursuit.jpg";
import heroImg from "@/assets/newheroimage.jpeg";

const badges = [
  { icon: PenTool, label: "Custom Art", pos: "top-6 left-0 -translate-x-2 sm:-translate-x-4" },
  { icon: Scissors, label: "Handmade Suits", pos: "top-1/3 right-0 translate-x-2 sm:translate-x-4" },
  { icon: Layers, label: "Reference Sheets", pos: "bottom-24 left-0 -translate-x-2 sm:-translate-x-4" },
  { icon: Sparkles, label: "Animations", pos: "bottom-8 right-0 translate-x-2 sm:translate-x-4" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} id="top" className="relative min-h-dvh w-full pt-32 sm:pt-40 md:pt-44">
      {/* particles live in their own clipped layer so floating badges are never cropped */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Particles count={36} />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-10 items-center px-4 sm:px-6 pb-24"
      >
        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-neon"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
            Now booking 2026 commissions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mt-6 font-display font-bold leading-[1.02] text-[clamp(2.1rem,6.4vw,4.6rem)]"
          >
            Professional <span className="text-gradient">Fursona Art</span>
            <br className="hidden sm:block" /> &amp; Custom Fursuit Design
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
          >
            Bring your characters to life with premium custom fursona artwork, fursuits, reference
            sheets, and animations — crafted from concept to final piece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-9 flex w-full flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3.5"
          >
            <a
              href="#contact"
              className="btn-pill !text-base w-full sm:w-auto justify-center !min-h-[3.25rem] sm:!min-h-[3rem]"
            >
              <span aria-hidden></span> Commission Now
              <span className="btn-pill-arrow">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href="#portfolio"
              className="inline-flex w-full sm:w-auto min-h-[3.25rem] sm:min-h-[3rem] items-center justify-center gap-2 rounded-full glass px-6 py-3.5 font-semibold text-white hover:border-neon/40 transition"
            >
              <span aria-hidden></span> View Portfolio
            </a>
          </motion.div>

          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
            {[
              { n: "100+", l: "Commissions" },
              { n: "10+", l: "Countries" },
              { n: "98%", l: "5★ Reviews" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-xl sm:text-2xl font-bold text-neon">{s.n}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual: hidden on mobile (<768px) per spec, reserved side padding keeps floating badges fully on-screen */}
        <div className="relative hidden md:block w-full px-6 sm:px-10 lg:px-8">
          <motion.div style={{ scale }} className="relative mx-auto aspect-[3/4] w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[500px]">
            <div className="absolute inset-0 rounded-[2.25rem] glow-ring overflow-hidden">
              <img
                src={heroImg}
                alt="Custom neon fursuit character at a convention"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {badges.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.15, type: "spring" }}
                  className={`absolute ${b.pos} glass-strong rounded-2xl px-3 py-2 md:px-4 md:py-2.5 flex items-center gap-2 animate-float`}
                  style={{ animationDelay: `${i * 1.3}s` }}
                >
                  <Icon className="h-4 w-4 text-neon shrink-0" />
                  <span className="text-xs font-medium whitespace-nowrap">{b.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
            