import { motion } from "framer-motion";
import { MessageSquare, PencilRuler, Layers, Hammer, ShieldCheck, Truck, ArrowRight } from "lucide-react";

const steps = [
  { n: "01", icon: MessageSquare, title: "Consultation", desc: "Free 1-on-1 call to align on vision, scope, timing and budget." },
  { n: "02", icon: PencilRuler, title: "Concept Art", desc: "Two ref-sheet rounds from our concept artists until it's perfect." },
  { n: "03", icon: Layers, title: "Material Selection", desc: "Hand-pick fur, eye, and nose samples shipped to your door." },
  { n: "04", icon: Hammer, title: "Production", desc: "Sculpting, sewing, airbrushing — documented with weekly photos." },
  { n: "05", icon: ShieldCheck, title: "Quality Testing", desc: "Movement, ventilation, and durability stress-tests before sign-off." },
  { n: "06", icon: Truck, title: "Delivery", desc: "White-glove insured shipping with a fitting & care guide." },
];

export function Process() {
  return (
    <section id="process" className="section-dark bg-texture-grid bg-glow-lime relative py-14 sm:py-20 px-4 md:px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="mb-12 flex flex-col items-center gap-6 text-center md:mb-16 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <p className="kicker">How It Works</p>
            <h2 className="mt-4 font-display font-bold text-foreground">From spark of an idea to first con.</h2>
            <p className="mt-4 text-muted-foreground">
              A transparent, six-stage studio workflow — refined over 1,500 commissions and counting.
            </p>
          </div>
          <a href="#contact" className="btn-pill shrink-0">
            Start your commission
            <span className="btn-pill-arrow">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>

        <ol className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            // Connector runs to the next step in the same row only.
            const rail = `hidden ${i % 2 === 1 ? "sm:hidden" : "sm:block"} ${i % 3 === 2 ? "lg:hidden" : "lg:block"}`;
            return (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col"
              >
                {/* Timeline rail */}
                <div className="mb-4 hidden items-center gap-3 sm:flex">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/40 bg-[#0b0e0b] font-display text-sm font-bold text-primary transition-all duration-500 ease-premium group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    {s.n}
                    <span className="absolute inset-0 rounded-full ring-4 ring-primary/0 transition-all duration-500 group-hover:ring-primary/20" />
                  </span>
                  <span className={`${rail} relative h-px flex-1 overflow-hidden bg-white/10`}>
                    <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-primary/0 transition-transform duration-700 ease-premium group-hover:scale-x-100" />
                  </span>
                </div>

                <div className="relative isolate flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 ease-premium group-hover:-translate-y-1.5 group-hover:border-primary/50 group-hover:bg-white/[0.06] group-hover:shadow-[0_20px_40px_-16px_rgba(151,230,0,0.25)] sm:p-7">
                  {/* Outlined step number watermark — fills lime on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-5 -z-10 font-display text-[7rem] font-bold leading-none text-transparent transition-all duration-500 ease-premium group-hover:-translate-y-1 group-hover:text-primary/10"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.09)" }}
                  >
                    {s.n}
                  </span>

                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary transition-all duration-500 ease-premium group-hover:rotate-[-6deg] group-hover:border-primary/40 group-hover:bg-primary/15 sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <h3 className="mt-6 font-display text-lg font-semibold text-foreground sm:text-xl">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-white/80">
                    {s.desc}
                  </p>

                  {/* Segmented progress — lit up to this step, full lime on hover */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em]">
                      <span className="text-primary">Step {i + 1}</span>
                      <span className="text-muted-foreground">of {steps.length}</span>
                    </div>
                    <div className="flex gap-1">
                      {steps.map((_, k) => (
                        <span
                          key={k}
                          style={{ transitionDelay: `${k * 40}ms` }}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            k <= i ? "bg-primary group-hover:bg-primary" : "bg-white/10 group-hover:bg-primary/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
