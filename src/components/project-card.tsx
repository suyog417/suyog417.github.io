import Link from "next/link";
import type { Project } from "@/data/projects";

/** Tier 1: the full card. Outcome, problem, stack, the hard call, links. */
export function ProjectCard({ project, n }: { project: Project; n: number }) {
  return (
    <article
      data-reveal-item
      className="group grid gap-8 border-t border-line py-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
    >
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mono-label mb-4">
          {String(n).padStart(2, "0")} · {project.kind} · {project.year}
        </p>

        <h3 className="display text-[clamp(2rem,4.5vw,3rem)] text-ink">
          <Link
            href={`/work/${project.slug}`}
            className="transition-colors hover:text-accent"
          >
            {project.name}
          </Link>
        </h3>

        <p className="mt-4 text-base leading-relaxed text-muted">
          {project.outcome}
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="numeral block break-words text-lg text-accent sm:text-xl">
                  {m.value}
                </span>
                <span className="mono-label mt-1.5 block text-[0.625rem]" aria-hidden="true">
                  {m.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <p className="mono-label mb-3">The problem</p>
          <p className="leading-relaxed text-ink/90">{project.problem}</p>
        </div>

        <div className="border-l-2 border-accent pl-5">
          <p className="mono-label mb-3">One hard decision — {project.angle}</p>
          <p className="font-medium text-ink">{project.decision.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {project.decision.body}
          </p>
        </div>

        <div>
          <p className="mono-label mb-3">Stack</p>
          <ul className="flex flex-wrap gap-2">
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

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                href={l.href}
                className="mono-label text-ink transition-colors hover:text-accent"
              >
                {l.label} →
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mono-label text-ink transition-colors hover:text-accent"
              >
                {l.label} ↗
              </a>
            ),
          )}
          {project.confidential ? (
            <span className="mono-label text-faint">
              Client work — specifics kept generic
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Tier 2: the compact grid entry. */
export function ProjectTile({ project }: { project: Project }) {
  return (
    <li data-reveal-item className="group">
      <Link
        href={`/work/${project.slug}`}
        className="flex h-full flex-col border border-line p-6 transition-colors hover:border-line-strong"
      >
        <p className="mono-label mb-4">
          {project.kind} · {project.year}
        </p>
        <h3 className="font-display text-2xl tracking-tight text-ink transition-colors group-hover:text-accent">
          {project.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.outcome}
        </p>
        <p className="mt-6 font-mono text-xs text-faint">
          {project.stack.slice(0, 4).join(" · ")}
        </p>
      </Link>
    </li>
  );
}
