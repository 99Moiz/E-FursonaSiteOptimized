import { motion } from "framer-motion";
import { Hammer, Sparkles, Globe2, Palette, Feather, Trophy } from "lucide-react";

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
    <section className="relative py-24 md:py-32 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="kicker">Why Choose Us</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold max-w-2xl mx-auto">
            The studio behind the world's most-loved fursonas.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="card-premium group relative p-6 md:p-7 overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-neon/15 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />
                <div className="relative">
                  <div className="inline-grid place-items-center h-12 w-12 rounded-2xl bg-neon/15 border border-neon/30 text-neon group-hover:rotate-6 group-hover:scale-110 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
