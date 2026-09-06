import { motion } from "framer-motion";
import { MessageSquare, PencilRuler, Layers, Hammer, ShieldCheck, Truck } from "lucide-react";

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
    <section id="process" className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="mb-16 md:mb-20 max-w-2xl">
          <p className="kicker">How It Works</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">From spark of an idea to first con.</h2>
          <p className="mt-4 text-white/60">
            A transparent, six-stage studio workflow — refined over 1,500 commissions and counting.
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="card-premium group relative p-6 md:p-7 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-neon/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start justify-between">
                  <div className="grid place-items-center h-14 w-14 rounded-2xl bg-neon/10 border border-neon/30 text-neon shadow-[0_0_30px_-10px_var(--neon)] group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-4xl md:text-5xl font-bold text-white/5 group-hover:text-neon/20 transition-colors">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-cyan-glow">
                  <span className="h-px w-6 bg-cyan-glow/60" />
                  Step {i + 1} of {steps.length}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
