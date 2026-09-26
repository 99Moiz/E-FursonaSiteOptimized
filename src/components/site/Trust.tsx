import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Loader2, PencilLine, ChevronsLeftRight, ChevronRight, Activity } from "lucide-react";
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
    <section className="relative py-14 px-4 sm:py-20 sm:px-6">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <p className="kicker">Behind The Craft</p>
            <h2 className="mt-4 font-display font-bold text-foreground">Watch a commission come to life.</h2>
          </div>
          <p className="max-w-sm text-muted-foreground lg:pb-1.5">
            Full transparency at every step — from the first pencil line to the finished piece.
          </p>
        </div>

        {/* Stage pipeline */}
        <ol className="mb-6 flex flex-wrap justify-center gap-3 sm:gap-4">
          {stages.map((s, i) => (
            <motion.li
              key={`${s.n}-${s.label}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative basis-[calc(50%-0.375rem)] sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.667rem)] xl:basis-[calc(20%-0.8rem)]"
            >
              <figure className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-xs transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-premium-lg">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={s.img}
                    alt={`${s.label} stage`}
                    loading="lazy"
                    style={{ filter: s.filter }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                  <span className="media-badge absolute left-2.5 top-2.5">{s.n}</span>

                  <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                      Stage {i + 1}/{stages.length}
                    </div>
                    <div className="mt-1 font-display text-sm font-semibold text-white sm:text-base">{s.label}</div>
                    {/* Progress to this stage — sweeps in on hover */}
                    <div className="mt-2.5 h-0.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-700 ease-premium group-hover:scale-x-100"
                        style={{ width: `${((i + 1) / stages.length) * 100}%` }}
                      />
                    </div>
                  </figcaption>
                </div>
              </figure>

              {/* Connector to the next stage (single-row desktop layout only) */}
              {i < stages.length - 1 && (
                <span className="absolute -right-[1.1rem] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-primary-strong shadow-sm xl:grid">
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </motion.li>
          ))}
        </ol>

        <div className="grid min-w-0 items-stretch gap-6 lg:grid-cols-2">
          {/* Before / After slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex h-full min-w-0 flex-col rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Before &amp; After</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">From rough concept to finished piece</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-alt px-3 py-1 text-[11px] font-medium text-muted-foreground">
                <ChevronsLeftRight className="h-3.5 w-3.5" /> Drag
              </span>
            </div>
            <div className="group relative aspect-[4/3] min-w-0 select-none overflow-hidden rounded-xl bg-muted lg:aspect-auto lg:min-h-[20rem] lg:flex-1">
              <SmartImage
                src={beforeAfter.afterImageUrl}
                fallbackSrc={hero4}
                size="medium"
                alt={`${beforeAfter.title} — finished piece`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
                <SmartImage
                  src={beforeAfter.beforeImageUrl}
                  fallbackSrc={hero1}
                  size="medium"
                  alt={`${beforeAfter.title} — concept sketch`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: beforeAfter.beforeFilter }}
                />
              </div>
              <span className="media-badge absolute left-3 top-3">{beforeAfter.beforeLabel}</span>
              <span className="media-badge absolute right-3 top-3">{beforeAfter.afterLabel}</span>

              {/* Divider + drag handle */}
              <div
                className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary shadow-[0_0_12px_rgba(151,230,0,0.6)]"
                style={{ left: `${split}%` }}
              >
                <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-premium-lg transition-transform duration-300 group-hover:scale-110">
                  <ChevronsLeftRight className="h-4 w-4" />
                </span>
              </div>
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

          {/* Commission queue — dark "live dashboard" panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-dark bg-glow-lime relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 p-5 shadow-premium-lg sm:p-6"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Activity className="h-4 w-4 text-primary" /> Live Commission Queue
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">On our workbench right now</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                {queue.length} active
              </span>
            </div>
            <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {queue.map((q) => (
                <li
                  key={q.name}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-primary/40 hover:bg-white/[0.06]"
                >
                  <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-white">{q.name}</span>
                    <span className="font-display text-sm font-bold tabular-nums text-primary">{q.pct}%</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${q.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_rgba(151,230,0,0.5)]"
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      {statusIcon[q.status] ?? <Clock className="h-3.5 w-3.5" />} {q.status}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Est. {q.eta}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-white/90">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              Typical turnaround: sketches 3–5 days, full suits 12–16 weeks.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
