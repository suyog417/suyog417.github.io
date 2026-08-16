import { experience } from "@/data/experience";
import { education, certifications } from "@/data/site";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-b border-line"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          id="experience-heading"
          index="02 / Experience"
          title="Internship, client work, product"
          note="One internship that ended in a Play Store release, plus paid client engagements alongside a full-time degree."
        />

        <Reveal stagger>
          <ol className="relative border-l border-line">
            {experience.map((e) => (
              <li key={`${e.org}-${e.period}`} data-reveal-item className="relative pb-14 pl-8 last:pb-0">
                <span
                  className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="mono-label mb-3">
                  {e.period} · {e.kind} · {e.location}
                </p>
                <h3 className="text-lg text-ink">
                  {e.role}{" "}
                  <span className="text-muted">— {e.org}</span>
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {e.summary}
                </p>
                <ul className="mt-4 max-w-2xl space-y-2">
                  {e.points.map((p) => (
                    <li
                      key={p}
                      className="relative pl-4 text-sm leading-relaxed text-ink/85 before:absolute before:left-0 before:top-[0.6em] before:h-px before:w-2 before:bg-line-strong"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {e.stack.map((s) => (
                    <li key={s} className="font-mono text-xs text-faint">
                      {s}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
          <div>
            <p className="mono-label mb-6">Education</p>
            <ul className="space-y-6">
              {education.map((ed) => (
                <li key={ed.school} className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-ink">{ed.degree}</p>
                    <p className="mt-1 text-sm text-muted">{ed.school}</p>
                    <p className="mono-label mt-2">{ed.period}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="numeral block text-2xl text-ink">{ed.metric}</span>
                    <span className="mono-label mt-1 block text-[0.625rem]">
                      {ed.metricLabel}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label mb-6">Certifications</p>
            <ul className="space-y-4">
              {certifications.map((c) => (
                <li key={c.name}>
                  <p className="text-ink">{c.name}</p>
                  <p className="mono-label mt-1">{c.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
