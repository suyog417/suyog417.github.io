import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Screenshot } from "@/components/screenshot";
import { Reveal } from "@/components/reveal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.name} — case study`,
    description: project.outcome,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — ${site.name}`,
      description: project.outcome,
      url: `${site.url}/work/${project.slug}`,
    },
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      {/* Header */}
      <header className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <p className="mono-label mb-6">
            {project.kind} · {project.year} · {project.angle}
          </p>
          <h1 className="display text-[clamp(2.5rem,8vw,4.5rem)] text-ink">
            {project.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {project.outcome}
          </p>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="numeral block break-words text-xl text-accent sm:text-3xl">
                    {m.value}
                  </span>
                  <span className="mono-label mt-2 block text-[0.625rem]" aria-hidden="true">
                    {m.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {project.confidential ? (
            <p className="mt-8 border-l-2 border-line-strong pl-4 text-sm text-faint">
              Client engagement. Business specifics are kept generic; everything
              below describes work that is mine to describe.
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-20 px-5 py-20 sm:px-8 sm:py-24">
        {/* Problem */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
          <h2 className="mono-label pt-1.5">The problem</h2>
          <p className="text-lg leading-relaxed text-ink/90">{project.problem}</p>
        </Reveal>

        {/* Constraints */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
          <h2 className="mono-label pt-1.5">Constraints</h2>
          <ul className="space-y-3">
            {project.constraints.map((c) => (
              <li
                key={c}
                className="relative pl-5 leading-relaxed text-ink/90 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Architecture */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
          <h2 className="mono-label pt-1.5">Architecture</h2>
          <div>
            <ArchitectureDiagram nodes={project.architecture} project={project.name} />
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="border border-line px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Decision */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
          <h2 className="mono-label pt-1.5">Key decision</h2>
          <div>
            <h3 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
              {project.decision.title}
            </h3>
            <p className="mt-4 leading-relaxed text-ink/90">{project.decision.body}</p>
            <div className="mt-8 border border-line bg-raised p-6">
              <p className="mono-label mb-3">What it cost</p>
              <p className="leading-relaxed text-muted">{project.decision.tradeoff}</p>
            </div>
          </div>
        </Reveal>

        {/* Outcome */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
          <h2 className="mono-label pt-1.5">Outcome</h2>
          <ul className="space-y-4">
            {project.outcomeDetail.map((o) => (
              <li key={o} className="leading-relaxed text-ink/90">
                {o}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Screens */}
        <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
          <h2 className="mono-label pt-1.5">Screens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.screens.map((s) => (
              <Screenshot key={s.src} src={s.src} alt={s.alt} />
            ))}
          </div>
        </Reveal>

        {/* External links */}
        {project.links.some((l) => l.kind !== "case") ? (
          <Reveal as="section" className="grid gap-6 sm:grid-cols-[140px_1fr] sm:gap-10">
            <h2 className="mono-label pt-1.5">Links</h2>
            <ul className="flex flex-wrap gap-6">
              {project.links
                .filter((l) => l.kind !== "case")
                .map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mono-label text-ink transition-colors hover:text-accent"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
            </ul>
          </Reveal>
        ) : null}
      </div>

      {/* Next */}
      <nav aria-label="More work" className="border-t border-line">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/#work" className="mono-label transition-colors hover:text-ink">
            ← All work
          </Link>
          <Link href={`/work/${next.slug}`} className="group text-right">
            <span className="mono-label block">Next case study</span>
            <span className="font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-accent">
              {next.name} →
            </span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
