import type { Metadata } from "next";
import { AnimGate } from "@/components/home/AnimGate";
import { Categories } from "@/components/home/Categories";
import { Community } from "@/components/home/Community";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HomeMotion } from "@/components/home/HomeMotion";
import { Intro } from "@/components/home/Intro";
import { LiveSection } from "@/components/home/LiveSection";
import { PreTest } from "@/components/home/PreTest";
import { Promises } from "@/components/home/Promises";
import { RateEarn } from "@/components/home/RateEarn";
import { Testimonials } from "@/components/home/Testimonials";

export const metadata: Metadata = {
  title: { absolute: "ReachRadar · Get heard by new fans" },
  description:
    "Pitch your tracks to Spotify curators, labels, radios and blogs. Get honest feedback from artists. Grow real fans.",
};

/** Marketing home (Figma 01, port of prototype/index.html). */
export default function Home() {
  return (
    <HomeMotion>
      <AnimGate />
      <Hero>
        <Intro />
      </Hero>
      <LiveSection />
      <Promises />
      <Categories />
      <PreTest />
      <RateEarn />
      <Community />
      <Testimonials />
      <FinalCta />
    </HomeMotion>
  );
}
