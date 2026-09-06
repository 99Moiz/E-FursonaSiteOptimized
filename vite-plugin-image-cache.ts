import type { Plugin } from "vite";

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|svg|avif|ico|bmp|tiff?)$/i;

export function imageCacheControlPlugin(): Plugin {
  const setCacheHeaders = (req: any, res: any, next: () => void) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    const url = req.url || "/";
    if (!IMAGE_EXTENSIONS.test(url)) {
      next();
      return;
    }

    const originalSetHeader = res.setHeader.bind(res);
    res.setHeader = ((name: string, value: string) => {
      if (name.toLowerCase() === "cache-control") {
        return originalSetHeader(name, "public, max-age=1800");
      }

      return originalSetHeader(name, value);
    }) as typeof res.setHeader;

    res.setHeader("Cache-Control", "public, max-age=1800");
    next();
  };

  return {
    name: "image-cache-control",
    configureServer(server) {
      server.middlewares.stack.unshift({
        route: "",
        handle: setCacheHeaders as any,
      });
    },
    configurePreviewServer(server) {
      server.middlewares.stack.unshift({
        route: "",
        handle: setCacheHeaders as any,
      });
    },
  };
}
