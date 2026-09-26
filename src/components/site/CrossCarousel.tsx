import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  Scissors,
  PawPrint,
  Hammer,
  Camera,
  PenTool,
  Ruler,
  Gem,
  Hand,
  Clapperboard,
} from "lucide-react";

type Item = { label: string; icon: LucideIcon };

const topRowItems: Item[] = [
  { label: "Full Fursuit Builds", icon: Shirt },
  { label: "Partial Suit Commissions", icon: Scissors },
  { label: "Head & Tail Design", icon: PawPrint },
  { label: "Prop Fabrication", icon: Hammer },
  { label: "Studio Photography", icon: Camera },
];

const bottomRowItems: Item[] = [
  { label: "Character Concepts", icon: PenTool },
  { label: "Pattern Drafting", icon: Ruler },
  { label: "Custom Accessories", icon: Gem },
  { label: "Paw & Hand Work", icon: Hand },
  { label: "Motion & Video", icon: Clapperboard },
];

/* Small downward triangle — the logo mark, used as the separator. */
function Mark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 12 11" aria-hidden className={`h-2.5 w-3 shrink-0 ${className}`}>
      <path d="M0 0h12L6 11z" fill="currentColor" />
    </svg>
  );
}

function Band({
  items,
  direction,
  paused,
  variant,
}: {
  items: Item[];
  direction: "left" | "right";
  paused: boolean;
  variant: "lime" | "ink";
}) {
  // Four copies so one half of the track is always wider than an ultra-wide
  // viewport; the -50% keyframe still loops seamlessly.
  const content = [...items, ...items, ...items, ...items];
  const trackClass = direction === "left" ? "marquee-track-left" : "marquee-track-right";
  const lime = variant === "lime";

  return (
    <div
      className={`overflow-hidden py-3.5 sm:py-4 ${
        lime ? "bg-primary text-primary-foreground" : "border-y border-white/10 bg-[#0b0e0b] text-white"
      }`}
    >
      <ul className={`${trackClass} ${paused ? "marquee-paused" : ""}`} style={{ animationDuration: "40s" }}>
        {content.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={`${item.label}-${index}`} aria-hidden={index >= items.length} className="flex shrink-0 items-center">
              <span className="flex items-center gap-2.5 px-5 sm:gap-3 sm:px-7">
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${lime ? "text-[#14210a]/70" : "text-primary"}`} />
                <span className="whitespace-nowrap font-display text-base font-semibold uppercase tracking-wide sm:text-xl">
                  {item.label}
                </span>
              </span>
              <Mark className={lime ? "text-[#14210a]/40" : "text-primary"} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CrossCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-label="Our services" className="relative overflow-hidden py-14 sm:py-16">
      {/* Two tilted bands crossing each other — oversized horizontally so the
          rotated ends never reveal a gap at the viewport edges. */}
      <div
        className="relative left-1/2 w-[115vw] -translate-x-1/2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative z-10 -rotate-[1.5deg] shadow-premium-lg">
          <Band items={topRowItems} direction="left" paused={paused} variant="lime" />
        </div>
        <div className="relative mt-2 rotate-[1.5deg] shadow-premium-lg sm:mt-3">
          <Band items={bottomRowItems} direction="right" paused={paused} variant="ink" />
        </div>
      </div>
    </section>
  );
}
