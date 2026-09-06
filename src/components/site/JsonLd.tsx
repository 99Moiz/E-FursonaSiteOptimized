import { useEffect } from "react";

/**
 * Injects a <script type="application/ld+json"> tag into <head> with the
 * given structured-data object, and removes it on unmount. Purely additive
 * for SEO — renders nothing visible, touches no UI/UX or business logic.
 */
export function JsonLd({ id, data }: { id: string; data: unknown }) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, data]);

  return null;
}
