import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import logo from "@/assets/NewLogo.png";

const navLinks = [
  { name: "HOME", path: "/#top" },
  { name: "ABOUT", path: "/#process" },
  // { name: "SERVICES", path: "/#services", hasDropdown: true },
  { name: "PORTFOLIO", path: "/#portfolio" },
  { name: "PRICING", path: "/#pricing" },
  { name: "FAQ", path: "/#faq" },
  { name: "CONTACT", path: "/#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <motion.header
      ref={headerRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 w-full"
    >
      {/* Main Header Bar */}
      <div
        className={`w-full transition-all duration-500 ease-premium border-b ${
          scrolled
            ? "bg-[#0a0a0a]/85 backdrop-blur-2xl shadow-premium border-white/[0.07]"
            : "bg-[#0a0a0a]/40 backdrop-blur-xl border-white/[0.04]"
        }`}
      >
        <div
          className={`container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-premium ${
            scrolled ? "h-[68px] sm:h-[76px]" : "h-[84px] sm:h-[100px] md:h-[108px]"
          }`}
        >

          {/* Left — Logo */}
          <a
            href="/#top"
            aria-label="Fursona Designs Hub — home"
            className="flex items-center shrink-0"
          >
            <img
              src={logo}
              alt="Fursona Designs Hub"
              fetchPriority="high"
              className={`w-auto object-contain transition-all duration-300 ease-premium ${
                scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20 md:h-24"
              }`}
            />
          </a>

          {/* Center — Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {/* Vertical Divider */}
            <div className="h-8 w-px bg-white/15 mr-8" />

            <div className="flex items-center gap-1">
              {navLinks.map((l) => {
                const active = isActive(l.path);
                return (
                  <a
                    key={l.path}
                    href={l.path}
                    className={`relative flex items-center gap-1 px-4 py-2 text-[13px] font-semibold tracking-[0.06em] uppercase transition-colors duration-200 ${
                      active
                        ? "text-white"
                        : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    <span>{l.name}</span>
                    {l.hasDropdown && (
                      <ChevronDown className="h-3.5 w-3.5 text-white/50" />
                    )}
                    {/* Active Underline Indicator */}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#a3e635]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Right — CTA Button + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Commission Now Button — hidden on mobile.
                Wrapped in a plain div so Tailwind's `hidden` controls
                display here instead of on the .btn-pill element itself:
                .btn-pill sets its own `display: inline-flex`, which was
                winning the CSS cascade over `hidden` (same specificity,
                declared later) and showing the button on mobile even
                though `hidden lg:inline-flex` was applied directly to it. */}
            <div className="hidden lg:block">
              <a
                href="/#contact"
                className="btn-pill !py-2 !pl-5 text-[13px] uppercase tracking-[0.08em]"
              >
                <span>Commission Now</span>
                <span className="btn-pill-arrow !h-7 !w-7">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="lg:hidden grid place-items-center h-11 w-11 rounded-lg border border-white/10 hover:border-[#a3e635]/40 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-white/80" />
              ) : (
                <Menu className="h-5 w-5 text-white/80" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/[0.06]"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 sm:px-6 py-4">
              {navLinks.map((l, i) => {
                const active = isActive(l.path);
                return (
                  <motion.a
                    key={l.path}
                    href={l.path}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors ${
                      active
                        ? "bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {l.name}
                      {l.hasDropdown && (
                        <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                      )}
                    </span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#a3e635]" />
                    )}
                  </motion.a>
                );
              })}
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 flex items-center justify-center gap-2.5 rounded-full bg-[#a3e635] px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#0a0a0a] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_-5px_rgba(163,230,53,0.55)]"
              >
                <span>Commission Now</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
