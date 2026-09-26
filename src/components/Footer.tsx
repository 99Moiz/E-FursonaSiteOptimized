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
  <footer className="section-dark border-t border-border px-4 pb-8 pt-12 sm:px-6 sm:pt-14">
    <div className="container mx-auto">
      {/* Trust strip — the same figures visitors saw in Stats, restated here
          as a closing credibility beat right before they leave the page. */}
      <div className="card-premium mb-10 grid grid-cols-2 gap-y-5 px-2 py-5 sm:mb-14 sm:grid-cols-4 sm:py-6 [&>*:nth-child(even)]:border-l sm:[&>*:nth-child(n+2)]:border-l">
        {trustStats.map((s) => (
          <div key={s.label} className="px-2 text-center">
            <div className="font-display text-xl font-bold text-foreground sm:text-2xl">{s.n}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-10 grid gap-10 sm:mb-14 md:grid-cols-[2fr_3fr] md:gap-12">
        <div>
          <a href="#top" className="flex w-fit items-center">
            <img src={logo} alt="Fursona Designs Hub" className="h-14 w-auto object-contain" />
          </a>
          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
            Premium custom fursona artwork, fursuits, reference sheets, and animations — crafted from
            concept to final piece for creators worldwide.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Studio open for 2026 commissions
          </div>
          <div className="mt-5 flex gap-2.5">
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
                className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-white/5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary-strong"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-foreground">{c.title}</div>
              <ul className="space-y-0.5 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.to} className="inline-block py-1.5 transition-colors hover:text-primary-strong">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
        <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-4 sm:text-left">
          <span>© {new Date().getFullYear()} Fursona Designs Hub.</span>
          <span className="hidden sm:inline">•</span>
          <span>Built for the global furry community.</span>
        </div>
        <a
          href="#top"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3.5 py-2 text-muted-foreground transition-colors hover:text-primary-strong"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
