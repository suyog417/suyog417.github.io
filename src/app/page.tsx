import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { Experience } from "@/components/experience";
import { StackSection } from "@/components/stack-section";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <StackSection />
      <About />
      <Contact />
    </>
  );
}
