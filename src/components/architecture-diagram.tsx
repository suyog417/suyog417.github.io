import type { ArchitectureNode } from "@/data/projects";

/**
 * Architecture as layered hairline boxes. Data flows top → bottom.
 * ponytail: CSS grid, not a diagram library — it's four rows of labels.
 */
export function ArchitectureDiagram({
  nodes,
  project,
}: {
  nodes: ArchitectureNode[];
  project: string;
}) {
  return (
    <figure className="border border-line">
      <div className="divide-y divide-[var(--line)]">
        {nodes.map((node, i) => (
          <div
            key={node.layer}
            className="grid gap-4 p-5 sm:grid-cols-[128px_1fr] sm:items-center sm:gap-6"
          >
            <p className="mono-label">
              {String(i + 1).padStart(2, "0")} {node.layer}
            </p>
            <ul className="flex flex-wrap gap-2">
              {node.items.map((item) => (
                <li
                  key={item}
                  className="border border-line bg-raised px-3 py-1.5 font-mono text-xs text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <figcaption className="border-t border-line px-5 py-3 font-mono text-xs text-faint">
        {project} — layers top to bottom, each depending only on the one below.
      </figcaption>
    </figure>
  );
}
