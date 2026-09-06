import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Aurora } from "@/components/site/Aurora";
import { CursorGlow } from "@/components/site/CursorGlow";
import Header from "@/components/Header";
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppFab = lazy(() => import("@/components/site/WhatsAppFab").then((mod) => ({ default: mod.WhatsAppFab })));
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 300_000,
      cacheTime: 1_800_000,
    },
  },
});

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <Aurora />
      <CursorGlow />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Suspense fallback={null}>
        <Footer />
        <WhatsAppFab />
      </Suspense>
      <Toaster theme="dark" position="bottom-right" />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
