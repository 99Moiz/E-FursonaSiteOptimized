import { useEffect, useRef } from "react";

/**
 * A soft radial light that follows the cursor across the whole page.
 * Uses CSS custom properties + rAF throttling so it never triggers React
 * re-renders — just a single style write per animation frame.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduceMotion || !ref.current) return;

    const el = ref.current;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Light easing so the glow trails the cursor instead of snapping to it.
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[520px] w-[520px] rounded-full opacity-[0.06] will-change-transform md:block"
      style={{
        background:
          "radial-gradient(circle, var(--neon) 0%, var(--cyan-glow) 45%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}
