import { Suspense, lazy } from "react";
import { Hero } from "@/components/site/Hero";
const WelcomeVideo = lazy(() => import("@/components/site/WelcomeVideo").then((mod) => ({ default: mod.WelcomeVideo })));
const CrossCarousel = lazy(() => import("@/components/site/CrossCarousel").then((mod) => ({ default: mod.CrossCarousel })));
const FeaturedBuilds = lazy(() => import("@/components/site/FeaturedBuilds").then((mod) => ({ default: mod.FeaturedBuilds })));
const Portfolio = lazy(() => import("@/components/site/Portfolio").then((mod) => ({ default: mod.Portfolio })));
const Features = lazy(() => import("@/components/site/Features").then((mod) => ({ default: mod.Features })));
const Process = lazy(() => import("@/components/site/Process").then((mod) => ({ default: mod.Process })));
const Trust = lazy(() => import("@/components/site/Trust").then((mod) => ({ default: mod.Trust })));
const TimelapseVideos = lazy(() => import("@/components/site/TimelapseVideos").then((mod) => ({ default: mod.TimelapseVideos })));
const Stats = lazy(() => import("@/components/site/Stats").then((mod) => ({ default: mod.Stats })));
const Pricing = lazy(() => import("@/components/site/Pricing").then((mod) => ({ default: mod.Pricing })));
const Testimonials = lazy(() => import("@/components/site/Testimonials").then((mod) => ({ default: mod.Testimonials })));
const FAQ = lazy(() => import("@/components/site/FAQ").then((mod) => ({ default: mod.FAQ })));
const CTA = lazy(() => import("@/components/site/CTA").then((mod) => ({ default: mod.CTA })));
const Contact = lazy(() => import("@/components/site/Contact").then((mod) => ({ default: mod.Contact })));

const Home = () => (
  <>
    <Hero />
    {/* Split into sensible loading groups instead of one shared Suspense
        boundary. Previously ALL 14 below-hero sections waited for the
        SLOWEST chunk among them before any of them could render — a fast
        3KB chunk was gated behind a slow one purely because they shared a
        boundary. Grouping by page position (and giving Pricing/Contact
        their own boundaries, since they're the two highest-intent sections)
        lets each group paint as soon as its own chunks + data are ready. */}
    <Suspense fallback={null}>
      <WelcomeVideo />
      <CrossCarousel />
    </Suspense>
    <Suspense fallback={null}>
      <FeaturedBuilds />
      <Portfolio />
    </Suspense>
    <Suspense fallback={null}>
      <Features />
      <Process />
    </Suspense>
    <Suspense fallback={null}>
      <Trust />
      <TimelapseVideos />
      <Stats />
    </Suspense>
    <Suspense fallback={null}>
      <Pricing />
    </Suspense>
    <Suspense fallback={null}>
      <Testimonials />
      <FAQ />
    </Suspense>
    <Suspense fallback={null}>
      <CTA />
    </Suspense>
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  </>
);

export default Home;
