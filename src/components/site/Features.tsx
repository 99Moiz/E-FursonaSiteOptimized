import { motion } from "framer-motion";
import { Hammer, Sparkles, Globe2, Palette, Feather, Trophy, ArrowUpRight } from "lucide-react";

const features = [
  { icon: Hammer, title: "Handmade Quality", desc: "Every piece — art or suit — crafted by veteran artists and fabricators with 10+ years of experience." },
  { icon: Sparkles, title: "Premium Materials", desc: "Sourced DreamFur™, silicone noses, hand-airbrushed details." },
  { icon: Globe2, title: "Global Shipping", desc: "Insured worldwide delivery with real-time tracking and white-glove unboxing." },
  { icon: Palette, title: "Custom Character Design", desc: "From rough sketch to full render and reference sheet — we translate your vision exactly." },
  { icon: Feather, title: "Lightweight Construction", desc: "Engineered foam bases keep heads under 2.5 lbs without compromising shape." },
  { icon: Trophy, title: "Convention Ready", desc: "Tested under stage lights, dance floors, and 14-hour con days." },
];

export function Features() {
  return (
    <section className="bg-texture-dots relative border-y border-border bg-background-alt py-14 sm:py-20 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <p className="kicker">Why Choose Us</p>
            <h2 className="mt-4 font-display font-bold text-foreground">
              The studio behind the world's most-loved fursonas.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground lg:pb-1.5">
            Six reasons creators around the world trust us to bring their characters to life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-xs transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-[#0b0e0b] hover:bg-[#0b0e0b] hover:shadow-premium-lg sm:p-7"
              >
                {/* Hover layers: lime wash from the corner + oversized icon watermark */}
                <div className="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-primary/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <Icon className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-36 w-36 text-white opacity-0 transition-all duration-500 ease-premium group-hover:rotate-[-8deg] group-hover:opacity-[0.05]" />
                {/* Top accent line sweeps in on hover */}
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-500 ease-premium group-hover:scale-x-100" />

                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-primary/25 bg-primary-tint text-primary-strong transition-all duration-500 ease-premium group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="font-display text-sm font-semibold tabular-nums text-muted-foreground/50 transition-colors duration-500 group-hover:text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg sm:mt-6 font-semibold text-foreground transition-colors duration-500 group-hover:text-white sm:text-xl">
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-white/65">
                  {f.desc}
                </p>

                <div className="mt-6 hidden items-center justify-between border-t border-border pt-4 sm:flex transition-colors duration-500 group-hover:border-white/10">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-500 group-hover:text-primary">
                    Fursona Designs Hub
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
