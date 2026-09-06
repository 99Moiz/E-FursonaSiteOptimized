
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Plus, Truck } from "lucide-react";
import { useFaqs } from "@/lib/api/queries";
import { JsonLd } from "@/components/site/JsonLd";

const fallbackFaqs = [
  {
    q: "How long does a commission take?",
    a: "Sketches are usually ready in 3–5 days, reference sheets in 1–2 weeks, and full fursuit builds in 12–16 weeks. Your exact timeline is confirmed in writing before work begins.",
  },
  {
    q: "Can I bring my own character design?",
    a: "Absolutely. We accept reference sheets, sketches, or even a mood board. Our artists translate any vision into a buildable, on-model spec.",
  },
  {
    q: "How do payments work?",
    a: "A 30% deposit secures your slot in the queue. The balance is split across project milestones with no interest, and you approve each stage before we move on.",
  },
  {
    q: "How many revisions are included?",
    a: "Every tier includes revision rounds (listed on each pricing card). Minor tweaks are always free; larger changes after approval may be quoted separately.",
  },
  {
    q: "Who pays for shipping on physical orders?",
    a: "Customers are responsible for paying shipping costs unless otherwise agreed during the commission process. For fursuits and other physical items we ship worldwide with fully insured, tracked couriers, and confirm the exact shipping cost with you before dispatch.",
    shipping: true,
  },
  {
    q: "How do I care for my fursuit?",
    a: "Every physical build ships with a printed care kit, a video guide, and lifetime touch-up support from the original maker.",
  },
  {
    q: "Do you offer commercial or logo work?",
    a: "Yes — we design mascot logos, brand marks, and character illustrations with clear commercial-use licensing included in the quote.",
  },
];

export function FAQ() {
  const { data: faqItems = [] } = useFaqs();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = useMemo(() => {
    const mapped = (faqItems ?? [])
      .filter((item) => item.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        q: item.question,
        a: item.answer,
        shipping: item.categoryTag?.toLowerCase() === "shipping",
      }));

    return mapped.length > 0 ? mapped : fallbackFaqs;
  }, [faqItems]);

  // FAQPage structured data — built from the same `faqs` the user actually
  // sees, so it never drifts out of sync with on-page content (a hard
  // requirement for Google to honor FAQ rich results).
  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [faqs],
  );

  return (
    <section id="faq" className="relative py-24 md:py-32 px-4 sm:px-6">
      <JsonLd id="faq-schema" data={faqSchema} />
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="kicker">Frequently Asked</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Answers, before you ask.</h2>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl glass-strong p-4 sm:p-5 shadow-xs">
          <Truck className="h-5 w-5 text-neon shrink-0 mt-0.5" />
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">Shipping note:</span> Customers are responsible for
            paying shipping costs unless otherwise agreed during the commission process.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={`rounded-2xl glass overflow-hidden border transition-colors duration-300 ${
                open === i ? "border-neon/30 shadow-[0_0_0_1px_rgba(154,230,0,0.12),0_20px_40px_-24px_rgba(0,0,0,0.7)]" : "border-white/[0.07] hover:border-white/[0.14]"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-display font-semibold text-base sm:text-lg flex items-center gap-2">
                  {f.shipping && <Truck className="h-4 w-4 text-neon shrink-0" />}
                  {f.q}
                </span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ease-premium ${open === i ? "bg-neon/15 rotate-45" : "bg-white/5"}`}>
                  <Plus className="h-4 w-4 text-neon" />
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-white/65 leading-relaxed">{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
