export function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#070707]">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

export function Particles({ count = 24 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = 2 + ((i * 7) % 5);
        const left = (i * 137) % 100;
        const top = (i * 53) % 100;
        const delay = (i % 8) * 0.7;
        const dur = 6 + (i % 7);
        return (
          <span
            key={i}
            className="absolute rounded-full bg-neon shadow-[0_0_12px_var(--neon)]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animation: `float ${dur}s ease-in-out ${delay}s infinite`,
              opacity: 0.5,
            }}
          />
        );
      })}
    </div>
  );
}
