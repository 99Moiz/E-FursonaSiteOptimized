import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

import { useTestimonials as useTestimonialsQuery } from "@/lib/api/queries";
import { SmartImage } from "@/components/ui/smart-image";

const fallbackReviews = [
  {
    id: 1,
    name: "Happy Client",
    handle: "@fursona_artist",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "The custom commission process was seamless, and the final design exceeded expectations.",
    ref: "Custom commission",
  },
];

export function Testimonials() {
  const { data: testimonials = [] } = useTestimonialsQuery();
  const [i, setI] = useState(0);

  const reviews = useMemo(() => {
    const mapped = (testimonials ?? [])
      .filter((item) => item.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        id: item.id,
        name: item.clientName,
        handle: item.location || "Verified client",
        avatar: item.avatarUrl,
        rating: item.rating,
        text: item.reviewText,
        ref: item.productRef || "Custom commission",
      }));

    return mapped.length > 0 ? mapped : fallbackReviews;
  }, [testimonials]);

  useEffect(() => {
    setI((current) => (current >= reviews.length ? 0 : current));
  }, [reviews.length]);

  const r = reviews.length > 0 ? reviews[i % reviews.length] : fallbackReviews[0];

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p className="kicker">Words from the Pack</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Loved by creators worldwide.</h2>
        </div>
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-6 sm:p-8 md:p-12 grid md:grid-cols-[200px_1fr] gap-6 md:gap-8 items-center"
        >
          <div className="relative mx-auto aspect-square w-32 md:w-full rounded-2xl overflow-hidden glow-ring">
            <SmartImage src={r.avatar} size="thumb" alt={r.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
          <div>
            <div className="flex gap-1 mb-4 justify-center md:justify-start">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-neon text-neon" />
              ))}
            </div>
            <p className="font-display text-xl sm:text-2xl md:text-3xl leading-snug text-center md:text-left">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-white/50">{r.handle} · {r.ref}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setI((i - 1 + reviews.length) % reviews.length)}
                  aria-label="Previous testimonial"
                  className="grid place-items-center h-11 w-11 rounded-full glass border border-white/10 hover:bg-neon/15 hover:border-neon/40 hover:-translate-y-0.5 transition-all duration-300 ease-premium"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setI((i + 1) % reviews.length)}
                  aria-label="Next testimonial"
                  className="grid place-items-center h-11 w-11 rounded-full bg-gradient-to-br from-primary to-[#7fc700] text-black shadow-premium hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 ease-premium"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
