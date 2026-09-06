import { useState } from "react";

const topRowItems = [
  "Full Fursuit Builds",
  "Partial Suit Commissions",
  "Head & Tail Design",
  "Prop Fabrication",
  "Studio Photography",
];

const bottomRowItems = [
  "Character Concepts",
  "Pattern Drafting",
  "Custom Accessories",
  "Paw & Hand Work",
  "Motion & Video",
];

function MarqueeRow({ items, direction, paused }: { items: string[]; direction: "left" | "right"; paused: boolean }) {
  const content = [...items, ...items];
  const trackClass = direction === "left" ? "marquee-track-left" : "marquee-track-right";

  return (
    <div className="marquee-row">
      <div className={`${trackClass} ${paused ? "marquee-paused" : ""}`}>
        {content.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="mx-2 flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/75 backdrop-blur-md shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] sm:px-5"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_12px_var(--neon)]" />
            <span className="whitespace-nowrap">{item}</span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/35">✕</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CrossCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative py-10 sm:py-12 md:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-black/20 px-3 py-5 shadow-[0_20px_80px_-40px_rgba(163,230,53,0.25)] backdrop-blur-xl sm:px-5 sm:py-6 md:px-8">
          <div className="mb-5 flex flex-col items-center gap-2 text-center">
            <p className="kicker">Cross Carousel</p>
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
              A flowing showcase of the full character workflow.
            </h3>
          </div>

          <div
            className="space-y-3"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <MarqueeRow items={topRowItems} direction="left" paused={paused} />
            <MarqueeRow items={bottomRowItems} direction="right" paused={paused} />
          </div>
        </div>
      </div>
    </section>
  );
}
