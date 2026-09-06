import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";

const plans = [
  {
    name: "Head Shot / Bust-Up",
    from: 50,
    blurb:
      "High-quality portrait artwork perfect for profiles, social media, and character showcases.",
    features: [
      "Head shot or bust-up composition",
      "Clean line art & flat colors",
      "Simple shading included",
      "2 revision rounds",
    ],
  },
  {
    name: "Fursona Full Render",
    from: 110,
    blurb: "Fully rendered, portfolio-grade illustration.",
    features: [
      "1 character, full body",
      "Detailed rendering & lighting",
      "Custom background",
      "Unlimited minor revisions",
    ],
    featured: true,
  },
  {
    name: "Reference Sheet Pack",
    from: 130,
    blurb:
      "Complete character specification for artists and fursuit makers.",
    features: [
      "Front + back turnaround",
      "Color palette + markings",
      "Three character poses",
      "Fursuit-ready guide",
    ],
  },
  {
    name: "Custom Fursona Package",
    from: 499,
    badge: "CUSTOM PACKAGE",
    blurb:
      "Everything you need to bring your original fursona to life in one complete package.",
    features: [
      "1× Head Shot or Bust-Up",
      "1× Full-Body Line Art",
      "1× Custom Fursona Design",
      "1× Premium Reference Sheet",
      "3× Character Poses",
      "1× Small Character Animation",
      "Priority support & project guidance",
    ],
  },
  {
    name: "Partial Fursuit",
    from: 1500,
    blurb:
      "Premium handcrafted fursuit essentials designed for comfort, performance, and conventions.",
    features: [
      "Custom head included",
      "Matching hand paws & tail",
      "Professional faux fur materials",
      "Fully lined for comfort",
      "Unlimited minor adjustments before shipping",
    ],
  },
  {
    name: "Full Fursuit",
    from: 3500,
    badge: "PREMIUM",
    blurb:
      "A complete custom-made fursuit crafted for maximum quality, durability, and performance.",
    features: [
      "Fully custom character build",
      "Head, bodysuit, hand paws & feet paws",
      "Tail included",
      "High-quality faux fur & premium craftsmanship",
      "Ventilation & comfort padding",
      "Custom markings & accessories",
      "Progress updates throughout production",
      "Unlimited minor adjustments before shipping",
    ],
  },
];

export function Pricing() {
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Fursona & Fursuit Commission Pricing",
    itemListElement: plans.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: p.name,
        description: p.blurb,
      },
      priceCurrency: "USD",
      price: p.from,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: p.from,
        priceCurrency: "USD",
      },
    })),
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32 px-4 sm:px-6">
      <JsonLd id="pricing-schema" data={offersSchema} />
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="kicker">
            Commission Pricing
          </p>

          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold max-w-2xl mx-auto">
            Transparent pricing for every commission.
          </h2>

          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Starting prices only. Final quotes depend on character complexity,
            accessories, background, and additional requests.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`card-premium group relative flex flex-col p-6 sm:p-7 ${
                p.featured ? "lg:scale-[1.04] ring-1 ring-neon/30 shadow-glow" : ""
              }`}
            >
              {(p.featured || p.badge) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[#7fc700] px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-black font-bold whitespace-nowrap shadow-premium">
                  {p.badge || "Most Popular"}
                </div>
              )}

              <h3 className="font-display text-xl font-bold tracking-tight">{p.name}</h3>

              <p className="mt-2 text-sm leading-relaxed text-white/60 min-h-[60px]">
                {p.blurb}
              </p>

              <div className="mt-5 flex items-baseline gap-2 pb-5 border-b border-white/[0.07]">
                <span className="text-xs uppercase tracking-wide text-white/45">Starting from</span>

                <span className="font-display text-3xl font-bold text-gradient">
                  ${p.from.toLocaleString()}
                </span>
              </div>

              <ul className="mt-5 space-y-3 flex-1">
                {p.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-white/80"
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-neon/15">
                      <Check className="h-2.5 w-2.5 text-neon" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={
                  p.featured
                    ? "mt-8 flex w-full items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-[#7fc700] py-3.5 text-sm font-semibold text-black shadow-premium transition-all duration-300 ease-premium hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98]"
                    : "mt-8 flex w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.03] backdrop-blur-sm py-3.5 text-sm font-semibold text-white/90 transition-all duration-300 ease-premium hover:border-neon/40 hover:bg-white/[0.06] hover:-translate-y-0.5 active:scale-[0.98]"
                }
              >
                Request a Quote
              </a>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-white/50">
          Need something different? We also offer completely custom commission
          packages tailored to your project.
          <br />
          <a
            href="#contact"
            className="mt-2 inline-block text-neon hover:underline"
          >
            Request a custom quote →
          </a>
        </p>
      </div>
    </section>
  );
}
