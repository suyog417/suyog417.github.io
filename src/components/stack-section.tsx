import { stack, depthLabel, type Depth } from "@/data/stack";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const depthStyle: Record<Depth, string> = {
  core: "border-accent text-accent",
  working: "border-line-strong text-ink",
  familiar: "border-line text-faint",
};

export function StackSection() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          id="stack-heading"
          index="03 / Stack"
          title="Honest depth, not a logo wall"
          note="Core means I write production code in it regularly. Working means I've shipped with it. Familiar means I've used it and would need a short ramp."
        />

        <Reveal stagger>
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {stack.map((g) => (
              <div key={g.group} data-reveal-item>
                <h3 className="mono-label mb-2 text-ink">{g.group}</h3>
                <p className="mb-5 text-sm text-muted">{g.note}</p>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item.name}
                      className={`border px-2.5 py-1 font-mono text-xs ${depthStyle[item.depth]}`}
                    >
                      {item.name}
                      <span className="sr-only"> — {depthLabel[item.depth]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <ul className="mt-14 flex flex-wrap gap-6 border-t border-line pt-6">
          {(Object.keys(depthLabel) as Depth[]).map((d) => (
            <li key={d} className="mono-label flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 border ${depthStyle[d]}`}
                aria-hidden="true"
              />
              {depthLabel[d]}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
