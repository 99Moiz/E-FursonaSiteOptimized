
import { Facebook, Instagram, ArrowUp } from "lucide-react";
import logo from "@/assets/NewLogo.png";

const trustStats = [
  { n: "100+", label: "Happy Clients" },
  { n: "10+", label: "Countries" },
  { n: "300+", label: "Custom Parts" },
  { n: "98%", label: "Satisfaction" },
];

const cols = [
  {
    title: "Services",
    links: [
      { label: "Fursona Art", to: "#portfolio" },
      { label: "Custom Fursuits", to: "#portfolio" },
      { label: "Reference Sheets", to: "#portfolio" },
      { label: "Animation", to: "#portfolio" },
      { label: "Logos", to: "#portfolio" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Portfolio", to: "#portfolio" },
      { label: "About", to: "#process" },
      { label: "Pricing", to: "#pricing" },
      { label: "Contact", to: "#contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "How It Works", to: "#process" },
      { label: "Shipping", to: "#faq" },
      { label: "FAQ", to: "#faq" },
      { label: "Request a Quote", to: "#contact" },
    ],
  },
];

const Footer = () => (
  <footer className="relative border-t border-white/5 pt-16 pb-10 px-4 sm:px-6 overflow-hidden">
    <div className="absolute inset-0 blueprint-grid opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full bg-neon/[0.06] blur-[100px] pointer-events-none" />

    <div className="container mx-auto relative">
      {/* Trust strip — the same figures visitors saw in Stats, restated here
          as a closing credibility beat right before they leave the page. */}
      <div className="card-premium mb-14 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06] px-2 py-6 sm:py-7">
        {trustStats.map((s) => (
          <div key={s.label} className="text-center px-2">
            <div className="font-display text-xl sm:text-2xl font-bold text-gradient">{s.n}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/50">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[2fr_3fr] gap-12 mb-14">
        <div>
          <a href="#top" className="group relative flex items-center w-fit rounded-lg">
            <img src={logo} alt="Fursona Designs Hub" className="h-10 w-auto object-contain" />
          </a>
          <p className="mt-5 text-white/60 max-w-sm leading-relaxed">
            Premium custom fursona artwork, fursuits, reference sheets, and animations — crafted from
            concept to final piece for creators worldwide.
          </p>
          <div className="mt-3 spec-tag w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
            Studio open for 2026 commissions
          </div>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/fursonadesignshub/" },
              { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/18xZ1sE8fk/?mibextid=wwXIfr" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="group relative grid h-11 w-11 place-items-center rounded-xl glass text-white/60 hover:text-neon hover:border-neon/40 transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-glow mb-3">{c.title}</div>
              <ul className="space-y-2.5 text-sm text-white/55">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.to} className="group inline-flex items-center gap-1.5 hover:text-neon transition-colors">
                      <span className="h-px w-2.5 bg-white/20 transition-all group-hover:w-4" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-white/5 pt-8 text-xs text-white/40">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-center sm:text-left">
          <span>© {new Date().getFullYear()} Fursona Designs Hub.</span>
          <span className="hidden sm:inline text-white/15">•</span>
          <span>Built for the global furry community.</span>
        </div>
        <a
          href="#top"
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-white/60 hover:text-neon hover:border-neon/40 transition"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
