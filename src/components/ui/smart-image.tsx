import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { optimizedImageUrl, optimizedSrcSet, type ImageSize } from "@/lib/api/client";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  size?: ImageSize;
  /** When set, also renders a srcSet across these presets (in addition to `size` as the default `src`). */
  srcSetSizes?: Exclude<ImageSize, "original">[];
  fallbackSrc?: string;
}

// Resolves `src` through the optimized/CDN path by default, but drops back to
// the original unproxied URL on error (e.g. the proxy is unreachable) so an
// external dependency can never turn into a permanently broken image.
export function SmartImage({ src, size = "medium", srcSetSizes, fallbackSrc, onError, ...props }: SmartImageProps) {
  const optimized = optimizedImageUrl(src, size, fallbackSrc);
  const raw = optimizedImageUrl(src, "original", fallbackSrc);
  const srcSet = srcSetSizes ? optimizedSrcSet(src, srcSetSizes) : undefined;
  const [current, setCurrent] = useState(optimized);

  useEffect(() => setCurrent(optimized), [optimized]);

  const usingFallback = current === raw && optimized !== raw;

  return (
    <img
      {...props}
      src={current}
      srcSet={usingFallback ? undefined : srcSet}
      onError={(e) => {
        if (current !== raw) {
          setCurrent(raw);
          return;
        }
        onError?.(e);
      }}
    />
  );
}
