import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Loader2, PencilLine } from "lucide-react";
import hero1 from "@/assets/Sktceh1.jpeg";
import hero2 from "@/assets/LineArt2.jpeg";
import hero3 from "@/assets/FlatColor3.jpeg";
import hero4 from "@/assets/Full Color4.jpeg";
import hero5 from "@/assets/refrenceSheet5.jpg";

import { useBeforeAfterImages, useWorkInProgressImages } from "@/lib/api/queries";
import { SmartImage } from "@/components/ui/smart-image";

// Fallback content — shown while the API loads, or if a section comes back
// empty, so the layout never collapses (same pattern as FeaturedBuilds.tsx).
const fallbackStages = [
  { n: "01", label: "Sketch", img: hero1, filter: "grayscale(1) contrast(1.5) brightness(0.85)" },
  { n: "02", label: "Line Art", img: hero2, filter: "grayscale(1) contrast(1.15) brightness(1.05)" },
  { n: "03", label: "Flat Color", img:  hero3, filter: "saturate(0.55) brightness(1.05)" },
  { n: "04", label: "Full Color", img: hero4, filter: "none" },
  { n: "05", label: "Reference Sheet", img: hero5, filter: "none" },
];

const fallbackBeforeAfter = {
  title: "Before & After",
  beforeImageUrl:null,
  afterImageUrl: null,
  beforeLabel: "Concept",
  afterLabel: "Final",
  beforeFilter: "grayscale(1) contrast(1.4) brightness(0.85)",
};

const fallbackQueue = [
  { name: "Aurora Wolf — Full Suit", status: "In Production", pct: 72, eta: "~3 weeks" },
  { name: "Ref Sheet — Twin Foxes", status: "In Color", pct: 45, eta: "~2 weeks" },
  { name: "Logo — Studio Crest", status: "In Concept", pct: 18, eta: "~4 weeks" },
];

const statusIcon: Record<string, JSX.Element> = {
  "In Production": <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  "In Color": <PencilLine className="h-3.5 w-3.5" />,
  "In Concept": <Clock className="h-3.5 w-3.5" />,
};

export function Trust() {
  const [split, setSplit] = useState(55);
  const { data: rawBeforeAfter = [] } = useBeforeAfterImages();
  const { data: rawWip = [] } = useWorkInProgressImages();

  // ── Sketch → Line Art → Flat Color → Final Render grid ──────────
  // Static — always uses the fallback stages (no API-driven data).
  const stages = fallbackStages;

  // ── Before / After slider ────────────────────────────────────────
  const beforeAfter = useMemo(() => {
    const first = [...rawBeforeAfter].filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder)[0];
    if (!first) return fallbackBeforeAfter;
    return {
      title: first.title,
      beforeImageUrl: first.beforeImageUrl,
      afterImageUrl: first.afterImageUrl,
      beforeLabel: first.beforeLabel || "Concept",
      afterLabel: first.afterLabel || "Final",
      beforeFilter: "none",
    };
  }, [rawBeforeAfter]);

  // ── Live Commission Queue (reuses WIP rows that carry progress data) ──
  const queue = useMemo(() => {
    const mapped = rawWip
      .filter((w) => w.isActive && w.progressPercent != null)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((w) => ({
        name: w.projectTitle,
        status: w.stageName,
        pct: w.progressPercent as number,
        eta: w.estimatedDelivery || "TBD",
      }));
    return mapped.length > 0 ? mapped : fallbackQueue;
  }, [rawWip]);

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="kicker">Behind The Craft</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold max-w-2xl mx-auto">
            Watch a commission come to life.
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Full transparency at every step — from the first pencil line to the finished piece.
          </p>
        </div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
  {stages.map((s, i) => (
    <motion.figure
      key={`${s.n}-${s.label}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.08, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-neon/50 hover:shadow-[0_10px_30px_-10px_rgba(163,230,53,0.2)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Stage Image with Zoom on Hover */}
        <img
          src={s.img}
          alt={`${s.label} stage`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Top Floating Badge for Step Number */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-neon/30 bg-black/70 px-2.5 py-1 text-[11px] font-bold text-neon backdrop-blur-md shadow-lg group-hover:border-neon group-hover:bg-black/90 transition-all">
          <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
          <span>{s.n}</span>
        </div>

        {/* Bottom Title Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-center justify-between">
          <figcaption className="font-display text-xs sm:text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-neon transition-colors">
            {s.label}
          </figcaption>

          {/* Minimal Status Indicator */}
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 group-hover:bg-neon group-hover:shadow-[0_0_8px_var(--neon)] transition-all" />
        </div>
      </div>
    </motion.figure>
  ))}
</div>
        <div className="grid lg:grid-cols-2 gap-6 min-w-0 items-stretch">
          {/* Before / After slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-premium p-5 sm:p-6 min-w-0 h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Before &amp; After</h3>
              <span className="text-xs text-white/50">Drag the slider</span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl select-none min-w-0">
              <SmartImage
                src={beforeAfter.afterImageUrl}
                size="medium"
                alt={`${beforeAfter.title} — finished piece`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 overflow-hidden h-full w-full"
                style={{ width: `${split}%` }}
              >
                <SmartImage
                  src={beforeAfter.beforeImageUrl}
                  size="medium"
                  alt={`${beforeAfter.title} — concept sketch`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: beforeAfter.beforeFilter }}
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-white/80">
                  {beforeAfter.beforeLabel}
                </span>
              </div>
              <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-neon">
                {beforeAfter.afterLabel}
              </span>
              <div
                className="absolute inset-y-0 w-0.5 bg-neon shadow-[0_0_16px_var(--neon)] pointer-events-none"
                style={{ left: `${split}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={split}
                onChange={(e) => setSplit(Number(e.target.value))}
                aria-label="Reveal the finished artwork"
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>
          </motion.div>

          {/* Commission queue + delivery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-premium p-5 sm:p-6 flex flex-col min-h-0 min-w-0 h-full"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold">Live Commission Queue</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/15 border border-neon/30 px-3 py-1 text-[10px] uppercase tracking-widest text-neon">
                <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" /> {queue.length} active
              </span>
            </div>
            <ul className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2">
              {queue.map((q) => (
                <li key={q.name}>
                  <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 font-medium truncate">{q.name}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-cyan-glow shrink-0">
                      {statusIcon[q.status] ?? <Clock className="h-3.5 w-3.5" />} {q.status}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${q.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-neon to-cyan-glow"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/45">
                    <Clock className="h-3 w-3" /> Est. delivery {q.eta}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/70">
              <CheckCircle2 className="h-4 w-4 text-neon shrink-0" />
              Typical turnaround: sketches 3–5 days, full suits 12–16 weeks.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}