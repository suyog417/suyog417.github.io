"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { getGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The projects run sideways: the section pins and the track pans horizontally
 * as you scroll down. Below lg — and under reduced motion — the same markup
 * falls back to an ordinary vertical stack, no pinning, no transform.
 */
export function HorizontalWork({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth + 96;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => tween.kill();
    });

    // Fonts and images settle after mount and change the track width.
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(t);
      mm.revert();
    };
  }, [reduced]);

  return (
    <div ref={sectionRef} className="lg:h-screen lg:overflow-hidden">
      <div
        ref={trackRef}
        className="flex flex-col gap-6 lg:h-screen lg:flex-row lg:items-center lg:gap-8 lg:pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))] lg:pr-24 lg:will-change-transform"
      >
        {projects.map((p, i) => (
          <Panel key={p.slug} project={p} n={i + 1} />
        ))}

        <div className="hidden shrink-0 flex-col justify-center pl-8 lg:flex">
          <p className="mono-label mb-3">and a few smaller ones</p>
          <p className="display text-4xl text-ink">keep scrolling ↓</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ project, n }: { project: Project; n: number }) {
  return (
    <article
      data-cursor
      className="group flex shrink-0 flex-col border border-line bg-raised p-6 transition-colors hover:border-line-strong sm:p-8 lg:h-[70vh] lg:w-[min(78vw,880px)] lg:flex-row lg:gap-12 lg:p-10"
    >
      <div className="flex flex-col justify-between lg:w-2/5">
        <div>
          <p className="mono-label mb-5">
            {String(n).padStart(2, "0")} · {project.kind} · {project.year}
          </p>
          <h3 className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            <Link
              href={`/work/${project.slug}`}
              className="transition-colors hover:text-accent"
            >
              {project.name}
            </Link>
          </h3>
          <p className="mt-4 leading-relaxed text-muted">{project.outcome}</p>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="numeral block break-words text-lg text-accent">
                  {m.value}
                </span>
                <span
                  className="mono-label mt-1.5 block text-[0.625rem]"
                  aria-hidden="true"
                >
                  {m.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8 flex flex-col justify-between border-t border-line pt-8 lg:mt-0 lg:w-3/5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
        <div>
          <p className="mono-label mb-3">what it is</p>
          <p className="leading-relaxed text-ink/90 lg:line-clamp-4">
            {project.problem}
          </p>

          <p className="mono-label mb-3 mt-8">the fun bit</p>
          <p className="font-medium text-ink">{project.decision.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted lg:line-clamp-5">
            {project.decision.body}
          </p>
        </div>

        <div className="mt-8">
          <ul className="mb-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="border border-line px-2.5 py-1 font-mono text-xs text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
          <Link
            href={`/work/${project.slug}`}
            className="mono-label text-ink transition-colors hover:text-accent"
          >
            Full story →
          </Link>
        </div>
      </div>
    </article>
  );
}
