import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/NewLogoDark.png";

const navLinks = [
  { name: "Home", path: "/#top" },
  { name: "About", path: "/#process" },
  { name: "Portfolio", path: "/#portfolio" },
  { name: "Pricing", path: "/#pricing" },
  { name: "FAQ", path: "/#faq" },
  { name: "Contact", path: "/#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const isActive = (path: string) =>
    (path === "/#top" && (location.hash === "" || location.hash === "#top")) ||
    location.hash === path.replace("/", "");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-border bg-white/90 shadow-sm" : "border-transparent bg-white/95"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <a href="/#top" aria-label="Fursona Designs Hub — home" className="group flex shrink-0 items-center">
          <img
            src={logo}
            alt="Fursona Designs Hub"
            fetchPriority="high"
            className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16 lg:h-[4.5rem]"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1 xl:gap-2">
          {navLinks.map((l) => {
            const active = isActive(l.path);
            return (
              <a
                key={l.path}
                href={l.path}
                className={`relative rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:bg-background-alt hover:text-foreground"
                }`}
              >
                {l.name}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <a href="/#contact" className="btn-pill">
              Commission Now
              <span className="btn-pill-arrow">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-background-alt lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-white lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-3 sm:px-6">
              {navLinks.map((l) => {
                const active = isActive(l.path);
                return (
                  <a
                    key={l.path}
                    href={l.path}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? "bg-primary-tint text-primary-strong" : "text-muted-foreground hover:bg-background-alt hover:text-foreground"
                    }`}
                  >
                    {l.name}
                  </a>
                );
              })}
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="btn-pill mt-2 w-full"
              >
                Commission Now
                <span className="btn-pill-arrow">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
