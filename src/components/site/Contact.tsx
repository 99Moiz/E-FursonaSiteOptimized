import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Send, Check, Loader2, Mail, MessageCircle } from "lucide-react";
import { sendWhatsAppInquiry } from "@/lib/api/whatsapp";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waLoading, setWaLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // These two emails don't depend on each other, so send them in
      // parallel instead of sequentially awaiting one after the other —
      // halves the perceived "Sending…" time for roughly the same request.
      await Promise.all([
        emailjs.send(
          "service_gu6hcdr",
          "template_668fmzq",
          { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
          "BCE3DhDXp2I-6C0Pe",
        ),
        emailjs.send(
          "service_gu6hcdr",
          "template_2ifb2e8",
          { from_name: form.name, from_email: form.email, subject: form.subject },
          "BCE3DhDXp2I-6C0Pe",
        ),
      ]);

      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = async () => {
    setWaLoading(true);
    try {
      const { link } = await sendWhatsAppInquiry();
      window.open(link, "_blank", "noopener,noreferrer");
    } catch {
      window.open("https://wa.me/16094594343", "_blank", "noopener,noreferrer");
    } finally {
      setWaLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="kicker">Start a Commission</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">
            Let's create your <span className="text-gradient">commission.</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Tell us about your character and the piece you have in mind — our studio replies within 24 hours.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-5 sm:p-6 md:p-10"
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="field-label">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-premium mt-2"
                placeholder="Your name"
              />
            </div>
            <div className="md:col-span-1">
              <label className="field-label">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-premium mt-2"
                placeholder="you@email.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Subject</label>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-premium mt-2"
                placeholder="What's it about?"
              />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-premium mt-2 resize-none"
                placeholder="Tell us about your character and what you'd like commissioned..."
              />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={waLoading}
                className="inline-flex items-center gap-2 py-2 text-sm text-[#25D366] hover:underline disabled:opacity-60"
              >
                {waLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                Prefer WhatsApp? Chat now
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pill !text-sm w-full sm:w-auto justify-center"
              >
                {isSubmitting ? (
                  <>Sending… <Loader2 className="h-4 w-4 animate-spin" /></>
                ) : submitted ? (
                  <>Message sent! <Check className="h-4 w-4" /></>
                ) : (
                  <>
                    Send Message
                    <span className="btn-pill-arrow">
                      <Send className="h-3.5 w-3.5" />
                    </span>
                  </>
                )}
              </button>
            </div>
            {error && <p className="md:col-span-2 text-sm text-red-400">{error}</p>}
          </form>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/50">
          <Mail className="h-4 w-4" /> We typically reply within 24h.
        </div>
      </div>
    </section>
  );
}
