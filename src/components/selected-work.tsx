import { featuredProjects, otherProjects, projects } from "@/data/projects";
import { ProjectTile } from "./project-card";
import { SectionHeading } from "./section-heading";
import { HorizontalWork } from "./horizontal-work";
import { Marquee } from "./marquee";
import { Reveal } from "./reveal";

export function SelectedWork() {
  const marqueeItems = Array.from(new Set(projects.flatMap((p) => p.stack)));

  return (
    <section id="work" aria-labelledby="work-heading" className="border-b border-line">
      <Marquee items={marqueeItems} />

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-20 sm:px-8 sm:pt-28">
        <SectionHeading
          id="work-heading"
          index="01 / The stuff"
          title="Things I built and didn't abandon"
          note="Scroll — this bit goes sideways. Each one opens into the full story."
        />
      </div>

      <HorizontalWork projects={featuredProjects} />

      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="mono-label mb-8">also built, less fussed over</p>
        <Reveal stagger>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherProjects.map((p) => (
              <ProjectTile key={p.slug} project={p} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
