import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
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

function DeferredSection({ children, minHeight }: { children: ReactNode; minHeight: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldRender) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldRender]);

  return <div ref={sectionRef} style={shouldRender ? undefined : { minHeight }}>{shouldRender ? children : null}</div>;
}

const Home = () => (
  <>
    <Hero />
    <DeferredSection minHeight="38rem">
      <Suspense fallback={null}>
        <WelcomeVideo />
        <CrossCarousel />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="52rem">
      <Suspense fallback={null}>
        <FeaturedBuilds />
        <Portfolio />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="40rem">
      <Suspense fallback={null}>
        <Features />
        <Process />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="64rem">
      <Suspense fallback={null}>
        <Trust />
        <TimelapseVideos />
        <Stats />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="42rem">
      <Suspense fallback={null}>
        <Pricing />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="40rem">
      <Suspense fallback={null}>
        <Testimonials />
        <FAQ />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="28rem">
      <Suspense fallback={null}>
        <CTA />
      </Suspense>
    </DeferredSection>
    <DeferredSection minHeight="44rem">
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </DeferredSection>
  </>
);

export default Home;
