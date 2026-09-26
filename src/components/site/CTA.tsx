import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Loader2 } from "lucide-react";
import { sendWhatsAppInquiry } from "@/lib/api/whatsapp";

export function CTA() {
  const [loading, setLoading] = useState(false);

  const handleWhatsApp = async () => {
    setLoading(true);
    try {
      const { link } = await sendWhatsAppInquiry();
      window.open(link, "_blank", "noopener,noreferrer");
    } catch {
      window.open("https://wa.me/16094594343", "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="relative py-14 px-4 sm:py-20 sm:px-6">
      <div className="container mx-auto">
        <div className="section-dark bg-texture-grid bg-glow-lime relative overflow-hidden rounded-2xl border border-white/10 p-8 shadow-premium-lg text-center sm:p-12 md:p-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl font-display font-bold text-foreground"
          >
            Your character deserves reality.
          </motion.h2>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <a href="#contact" className="btn-pill w-full sm:w-auto">
              Commission Now
              <span className="btn-pill-arrow">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <button
              onClick={handleWhatsApp}
              disabled={loading}
              className="inline-flex w-full min-h-[2.625rem] items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
