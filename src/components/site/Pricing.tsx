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
    <section id="pricing" className="bg-texture-grid relative py-14 px-4 sm:py-20 sm:px-6">
      <JsonLd id="pricing-schema" data={offersSchema} />
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="kicker">Commission Pricing</p>

          <h2 className="mx-auto mt-3 max-w-2xl font-display font-bold text-foreground">
            Transparent pricing for every commission.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Starting prices only. Final quotes depend on character complexity,
            accessories, background, and additional requests.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`card-premium group relative flex flex-col p-5 sm:p-6 ${
                p.featured ? "border-primary/40 shadow-md" : ""
              }`}
            >
              {(p.featured || p.badge) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-xs">
                  {p.badge || "Most Popular"}
                </div>
              )}

              <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>

              <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-muted-foreground">
                {p.blurb}
              </p>

              <div className="mt-4 flex items-baseline gap-2 border-b border-border pb-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Starting from</span>
                <span className="font-display text-2xl font-bold text-foreground">
                  ${p.from.toLocaleString()}
                </span>
              </div>

              <ul className="mt-4 flex-1 space-y-2.5">
                {p.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary-tint">
                      <Check className="h-2.5 w-2.5 text-primary-strong" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={p.featured ? "btn-pill mt-6 w-full" : "btn-pill-outline mt-6 w-full"}
              >
                Request a Quote
              </a>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground sm:mt-10">
          Need something different? We also offer completely custom commission
          packages tailored to your project.
          <br />
          <a href="#contact" className="mt-1 inline-block py-2 font-medium text-primary-strong hover:underline">
            Request a custom quote →
          </a>
        </p>
      </div>
    </section>
  );
}
