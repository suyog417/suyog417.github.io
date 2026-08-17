import Link from "next/link";
import { site } from "@/data/site";
import { HeroCanvas } from "./hero-canvas";
import { Magnetic } from "./magnetic";

const facts = [
  { v: "5+", l: "things shipped" },
  { v: "1", l: "app on the Play Store" },
  { v: "8", l: "languages, honestly" },
  { v: "∞", l: "redesigns of the same screen" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Hairline grid, faint enough to read as texture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--line)_1px,transparent_1px)] [background-size:calc(100%/6)_100%]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="mono-label flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
              aria-hidden="true"
            />
            {site.location} · builds things at 2am
          </p>
          <p className="mono-label hidden sm:block">
            ↖ knock my stack over
          </p>
        </div>

      </div>

      {/* Outside the centred container on purpose: the slingshot gets the whole
          viewport width to fling things across. */}
      <HeroCanvas />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <p className="max-w-xl text-xl leading-relaxed text-muted sm:text-2xl">
            I build apps. Some of them{" "}
            <span className="text-ink">people actually use</span> — a Play Store
            listing, a couple of client projects, and a pile of things that only
            exist because I wanted to see if they&apos;d work.
          </p>

          {/* gap-6: room for both magnetic buttons to lean toward a cursor
              sitting between them without their edges meeting. */}
          <div className="flex flex-wrap items-center gap-6 lg:justify-end">
            <Magnetic>
              <Link
                href="#work"
                className="block bg-accent px-6 py-3.5 font-mono text-xs uppercase tracking-[0.12em] text-accent-ink transition-opacity hover:opacity-85"
              >
                See the stuff
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="block border border-line-strong px-6 py-3.5 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Say hi
              </a>
            </Magnetic>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
          {facts.map((s) => (
            <div key={s.l}>
              <dt className="sr-only">{s.l}</dt>
              <dd>
                <span className="numeral block break-words text-3xl text-ink sm:text-4xl">
                  {s.v}
                </span>
                <span className="mono-label mt-2 block" aria-hidden="true">
                  {s.l}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
