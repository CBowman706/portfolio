import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Timeline } from "@/components/Timeline";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { DigitalTwin } from "@/components/DigitalTwin";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="bg-noise relative">
        <Hero />
        <Marquee />
        <About />
        <Timeline />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <DigitalTwin />
    </>
  );
}
