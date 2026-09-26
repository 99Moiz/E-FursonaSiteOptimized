import { useEffect, useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { sendWhatsAppInquiry } from "@/lib/api/whatsapp";

export function WhatsAppFab() {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide the floating button once the Contact/CTA/Footer area scrolls into
  // view — those sections already have their own "Chat on WhatsApp" CTAs,
  // so the fixed button is both redundant there and prone to visually
  // overlapping headings/buttons in that area (it stays pinned to the
  // screen corner regardless of what content scrolls underneath it).
  useEffect(() => {
    const target = document.querySelector("#contact");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "-10% 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { link } = await sendWhatsAppInquiry();
      window.open(link, "_blank", "noopener,noreferrer");
    } catch {
      // Fall back to a plain wa.me link if the API is unreachable
      window.open("https://wa.me/16094594343", "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      disabled={loading}
      className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-70 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
        hidden ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      {loading ? <Loader2 className="relative h-5 w-5 animate-spin sm:h-6 sm:w-6" /> : <MessageCircle className="relative h-5 w-5 sm:h-6 sm:w-6" />}
    </button>
  );
}
