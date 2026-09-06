import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { sendWhatsAppInquiry } from "@/lib/api/whatsapp";

export function WhatsAppFab() {
  const [loading, setLoading] = useState(false);

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
      className="fixed bottom-6 right-6 z-40 grid place-items-center h-14 w-14 rounded-full bg-[#25D366] text-black shadow-[0_0_30px_-2px_#25D366] hover:scale-110 transition disabled:opacity-70"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      {loading ? <Loader2 className="relative h-6 w-6 animate-spin" /> : <MessageCircle className="relative h-6 w-6" />}
    </button>
  );
}
