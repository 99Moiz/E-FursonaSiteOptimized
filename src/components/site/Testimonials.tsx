import { motion } from "framer-motion";
import { useMemo } from "react";
import { Quote, Star } from "lucide-react";
import { useTestimonials as useTestimonialsQuery } from "@/lib/api/queries";
import { SmartImage } from "@/components/ui/smart-image";

const fallbackReviews = [
  {
    id: 1,
    name: "Happy Client",
    handle: "Verified client",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "The custom commission process was seamless, and the final design exceeded expectations.",
    ref: "Custom commission",
  },
  {
    id: 2,
    name: "Convention Regular",
    handle: "Verified client",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "Communication was excellent from the first sketch to the final fitting. Worth every penny.",
    ref: "Full fursuit",
  },
  {
    id: 3,
    name: "First-time Commissioner",
    handle: "Verified client",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "I was nervous about my first commission, but the whole studio made it easy and the result is perfect.",
    ref: "Reference sheet",
  },
];

const MAX_CARDS = 6;

export function Testimonials() {
  const { data: testimonials = [], isLoading } = useTestimonialsQuery();

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

    return (mapped.length > 0 ? mapped : fallbackReviews).slice(0, MAX_CARDS);
  }, [testimonials]);

  return (
    <section className="section-dark bg-texture-dots bg-glow-lime relative py-14 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="kicker">Words from the Pack</p>
          <h2 className="mt-3 font-display font-bold text-foreground">Loved by creators worldwide.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Real feedback from commissioners around the world.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-premium p-5 sm:p-6">
                  <div className="skeleton h-7 w-7 rounded" />
                  <div className="skeleton mt-3 h-3 w-24 rounded" />
                  <div className="mt-3 space-y-2">
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-2/3 rounded" />
                  </div>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3 w-24 rounded" />
                      <div className="skeleton h-2.5 w-32 rounded" />
                    </div>
                  </div>
                </div>
              ))
            : reviews.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="card-premium relative flex flex-col p-5 sm:p-6"
            >
              <Quote className="h-7 w-7 text-primary-tint" fill="currentColor" />

              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star
                    key={k}
                    className={`h-3.5 w-3.5 ${k < r.rating ? "fill-primary text-primary" : "text-border-strong"}`}
                  />
                ))}
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{r.text}&rdquo;</p>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                  <SmartImage
                    src={r.avatar}
                    size="thumb"
                    alt={r.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{r.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {r.handle} · {r.ref}
                  </div>
                </div>
              </div>
            </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
}
