import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Send,
  Check,
  Loader2,
  Mail,
  MessageCircle,
  User,
  Tag,
  Clock,
  Instagram,
  Star,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { sendWhatsAppInquiry } from "@/lib/api/whatsapp";

const nextSteps = [
  { title: "Share your idea", desc: "Send the form or message us on WhatsApp with your character details." },
  { title: "We reply within 24h", desc: "Our studio follows up with questions, a quote and a timeline." },
  { title: "Concept & kickoff", desc: "Approve the concept and we start bringing your character to life." },
];

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

  const iconCls =
    "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary-strong";

  return (
    <section id="contact" className="bg-texture-dots relative border-t border-border bg-background-alt py-14 sm:py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="kicker">Start a Commission</p>
          <h2 className="mt-4 font-display font-bold text-foreground">
            Let's create your{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">commission.</span>
              <span className="absolute inset-x-0 bottom-[0.08em] h-[0.3em] rounded-sm bg-primary/60" aria-hidden />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your character and the piece you have in mind — our studio replies within 24 hours.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-premium-lg lg:grid-cols-[0.85fr_1.15fr]"
        >
          {/* Info panel */}
          <aside className="section-dark bg-texture-grid bg-glow-lime relative flex flex-col p-6 sm:p-8 md:p-10">
            <h3 className="font-display text-xl font-semibold sm:text-2xl">What happens next?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Three simple steps from first message to kickoff.</p>

            <ol className="relative mt-8 space-y-6">
              {/* Vertical rail connecting the step numbers */}
              <span className="absolute bottom-4 left-[1.05rem] top-4 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent" />
              {nextSteps.map((s, i) => (
                <li key={s.title} className="group relative flex gap-4">
                  <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/40 bg-[#0b0e0b] font-display text-sm font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <div className="font-semibold text-white">{s.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 space-y-3 lg:mt-auto lg:pt-10">
              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={waLoading}
                className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-all duration-300 hover:border-[#25D366]/60 hover:bg-[#25D366]/10 disabled:opacity-60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#25D366] text-white">
                  {waLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">Chat on WhatsApp</span>
                  <span className="block text-xs text-muted-foreground">Fastest way to reach the studio</span>
                </span>
                <Send className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#25D366]" />
              </button>
              <a
                href="https://www.instagram.com/fursonadesignshub/"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
                  <Instagram className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">@fursonadesignshub</span>
                  <span className="block text-xs text-muted-foreground">See our latest work & DM us</span>
                </span>
                <Send className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-white">4.9/5</span> from 100+ commissions
              </span>
            </div>
          </aside>

          {/* Form */}
          <div className="p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">Tell us about your project</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">All fields are required. No commitment until you approve a quote.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="field-label">Name</label>
                <div className="group relative mt-2">
                  <User className={iconCls} />
                  <input
                    id="contact-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-premium has-icon h-12"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="field-label">Email</label>
                <div className="group relative mt-2">
                  <Mail className={iconCls} />
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-premium has-icon h-12"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="contact-subject" className="field-label">Subject</label>
                <div className="group relative mt-2">
                  <Tag className={iconCls} />
                  <input
                    id="contact-subject"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-premium has-icon h-12"
                    placeholder="e.g. Fursuit, ref sheet, custom art"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="contact-message" className="field-label">Message</label>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{form.message.length} characters</span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-premium mt-2 resize-none"
                  placeholder="Tell us about your character and what you'd like commissioned..."
                />
              </div>

              {submitted && (
                <div className="flex items-center gap-2.5 rounded-xl border border-primary/40 bg-primary-tint px-4 py-3 text-sm text-foreground md:col-span-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-strong" />
                  Thanks! Your message is on its way — we'll reply within 24 hours.
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-5 sm:flex-row md:col-span-2">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary-strong" /> We typically reply within 24h.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill !min-h-[3rem] w-full justify-center !px-6 !text-[0.95rem] disabled:opacity-70 sm:w-auto"
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
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
