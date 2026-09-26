import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { n: 100, suffix: "+", label: "Happy Clients" },
  { n: 10, suffix: "+", label: "Countries" },
  { n: 300, suffix: "+", label: "Custom Parts" },
  { n: 98, suffix: "%", label: "Satisfaction" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="section-dark bg-glow-lime relative py-12 sm:py-16 px-4 md:px-6">
      <div className="card-premium container mx-auto p-6 sm:p-10 md:p-12 overflow-hidden relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-strong">
                <Counter to={s.n} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
