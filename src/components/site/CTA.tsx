import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Loader2 } from "lucide-react";
import { Particles } from "./Aurora";
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
    <section id="cta" className="relative py-24 md:py-32 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="relative rounded-[2.5rem] glass-strong p-8 sm:p-12 md:p-20 text-center overflow-hidden glow-ring">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Particles count={26} />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.02] max-w-3xl mx-auto"
          >
            Your Character <br />
            <span className="text-gradient">Deserves Reality.</span>
          </motion.h2>
          {/* <p className="relative mt-6 text-white/70 max-w-xl mx-auto">
            Only 12 commission slots open for Q1 2026. Lock yours before the next con season.
          </p> */}
          <div className="relative mt-10 flex w-full flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3.5">
            <a
              href="#contact"
              className="btn-pill !text-base w-full sm:w-auto justify-center !min-h-[3.25rem] sm:!min-h-[3rem]"
            >
               Commission Now
              <span className="btn-pill-arrow">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <button
              onClick={handleWhatsApp}
              disabled={loading}
              className="inline-flex w-full sm:w-auto min-h-[3.25rem] sm:min-h-[3rem] items-center justify-center gap-2 rounded-full bg-[#25D366] text-black px-8 py-4 font-semibold shadow-premium hover:shadow-[0_0_30px_-8px_#25D366] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 ease-premium disabled:opacity-70"
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
