import { motion } from "framer-motion";
import { ArrowRight, PenTool, Scissors, Layers, Clapperboard, Star, BadgeCheck } from "lucide-react";
import heroImg from "@/assets/newheroimage.jpeg";
import sketchImg from "@/assets/Sktceh1.jpeg";
import finalImg from "@/assets/Full Color4.jpeg";

const services = [
  { icon: PenTool, label: "Custom Art", desc: "Illustrations of your character" },
  { icon: Scissors, label: "Handmade Suits", desc: "Built from your design" },
  { icon: Layers, label: "Reference Sheets", desc: "Every detail documented" },
  { icon: Clapperboard, label: "Animations", desc: "Your character in motion" },
];

const stats = [
  { n: "100+", l: "Commissions" },
  { n: "10+", l: "Countries" },
  { n: "98%", l: "5★ Reviews" },
];

// Initials stand in for client avatars in the social-proof row.
const clients = ["AW", "TF", "KR", "LM"];

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease },
});

export function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden pb-14 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
      {/* Subtle dot-grid texture — restrained, not a glow/blob, just gives the
          hero a bit of depth so it doesn't read as flat/empty white. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      {/* Soft brand tint behind the visual — a flat wash, not a glow. */}
      <div className="pointer-events-none absolute -right-40 top-10 hidden h-[36rem] w-[36rem] rounded-full bg-primary-tint lg:block" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 xl:gap-20">
          {/* Copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.a
              {...fadeUp(0)}
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-foreground py-2 pl-3 pr-2 text-sm font-medium text-white shadow-premium transition-shadow hover:shadow-premium-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              Now booking 2026 commissions
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                <span className="hidden sm:inline">Limited slots</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </motion.a>

            <motion.h1 {...fadeUp(0.08)} className="mt-6 max-w-2xl font-display font-bold tracking-tight text-foreground">
              Professional{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">fursona art</span>
                <span className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] rounded-sm bg-primary/70" aria-hidden />
              </span>{" "}
              &amp; custom fursuit design
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Bring your character to life with premium fursona artwork, handmade fursuits,
              reference sheets, and animations — crafted from concept to final piece.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <a href="#contact" className="btn-pill !min-h-[3rem] w-full !px-6 !text-[0.95rem] sm:w-auto">
                Commission Now
                <span className="btn-pill-arrow">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
              <a href="#portfolio" className="btn-pill-outline !min-h-[3rem] w-full !px-6 !text-[0.95rem] sm:w-auto">
                View Portfolio
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.32)} className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {clients.map((c, i) => (
                  <span
                    key={c}
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[11px] font-bold shadow-xs ${
                      i % 2 ? "bg-foreground text-white" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                  <span className="ml-1.5 text-sm font-semibold text-foreground">4.9/5</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">Trusted by 100+ happy clients</div>
              </div>
            </motion.div>

            <motion.dl
              {...fadeUp(0.4)}
              className="mt-8 grid w-full max-w-md grid-cols-3 divide-x divide-border rounded-xl border border-border bg-white/80 py-4 shadow-xs"
            >
              {stats.map((s) => (
                <div key={s.l} className="px-2 text-center">
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="font-display text-xl font-bold text-foreground sm:text-2xl">{s.n}</dd>
                  <dd className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{s.l}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Visual — main build shot plus a sketch → final pair that tells the
              "concept to final piece" story at a glance. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease }}
            className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none"
          >
            <div className="grid grid-cols-[2.05fr_1fr] items-center gap-3 sm:gap-4">
              <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-premium-lg">
                <img
                  src={heroImg}
                  alt="Custom fursuit character build"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[1083/1400] w-full object-cover transition-transform duration-700 ease-premium hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {[
                  { src: sketchImg, label: "Sketch", alt: "Initial fursona concept sketch", filter: "grayscale(1) contrast(1.3)" },
                  { src: finalImg, label: "Final", alt: "Finished full-color fursona artwork", filter: "none" },
                ].map((img) => (
                  <div key={img.label} className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-muted shadow-premium">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="eager"
                      decoding="async"
                      style={{ filter: img.filter }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-premium hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-xs">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges — dark frosted glass so they sit naturally on the
                dark build shot and echo the booking pill in the copy column. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease }}
              className="absolute bottom-3 left-3 hidden items-center gap-3 rounded-2xl sm:flex bg-neutral-950/75 p-2 pr-4 text-white shadow-premium-lg ring-1 ring-white/15 backdrop-blur-md sm:bottom-4 sm:left-4"
            >
              <div className="flex items-center">
                <img src={sketchImg} alt="" aria-hidden className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-950 grayscale" />
                <span className="z-10 -mx-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-neutral-950">
                  <ArrowRight className="h-3 w-3" />
                </span>
                <img src={finalImg} alt="" aria-hidden className="h-10 w-10 rounded-full object-cover ring-2 ring-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">Concept → Final</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-white/65">
                  <BadgeCheck className="h-3 w-3 text-primary" />
                  Handcrafted, start to finish
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease }}
              className="absolute left-3 top-3 hidden items-center gap-2.5 rounded-full bg-neutral-950/75 py-1.5 pl-3 pr-3.5 text-white shadow-premium ring-1 ring-white/15 backdrop-blur-md sm:left-4 sm:top-4 sm:flex"
            >
              <span className="font-display text-base font-bold leading-none text-primary">4.9</span>
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                ))}
              </span>
              <span className="h-3.5 w-px bg-white/20" />
              <span className="text-xs font-medium text-white/80">100+ reviews</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Services strip */}
        <motion.ul
          {...fadeUp(0.5)}
          className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.label}
                className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-premium sm:p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint text-primary-strong transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{s.label}</div>
                  <div className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{s.desc}</div>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
