/** depth: "core" = ship production code daily · "working" = shipped with it · "familiar" = used, would need a ramp */
export type Depth = "core" | "working" | "familiar";

export type StackGroup = {
  group: string;
  note: string;
  items: { name: string; depth: Depth }[];
};

export const depthLabel: Record<Depth, string> = {
  core: "Core",
  working: "Working",
  familiar: "Familiar",
};

export const stack: StackGroup[] = [
  {
    group: "Mobile",
    note: "Where most of my shipped work lives.",
    items: [
      { name: "Flutter", depth: "core" },
      { name: "Dart", depth: "core" },
      { name: "Riverpod", depth: "working" },
      { name: "Play Console", depth: "working" },
      { name: "Swift", depth: "familiar" },
    ],
  },
  {
    group: "Backend",
    note: "Services I've designed, written and had to keep up.",
    items: [
      { name: "Go", depth: "working" },
      { name: "NestJS", depth: "working" },
      { name: "Node.js", depth: "working" },
      { name: "Java", depth: "working" },
      { name: "Python", depth: "working" },
      { name: "C#/.NET", depth: "working" },
      { name: "C++", depth: "familiar" },
      { name: "PHP", depth: "familiar" },
    ],
  },
  {
    group: "Frontend",
    note: "Enough to build the product, not just consume an API.",
    items: [
      { name: "Next.js", depth: "working" },
      { name: "TypeScript", depth: "working" },
      { name: "React", depth: "working" },
      { name: "Tailwind CSS", depth: "working" },
      { name: "GSAP", depth: "working" },
      { name: "WinUI 3", depth: "working" },
    ],
  },
  {
    group: "Data",
    note: "Schema design, indexes, and knowing when not to reach for a database.",
    items: [
      { name: "PostgreSQL", depth: "working" },
      { name: "Firebase / Firestore", depth: "core" },
      { name: "MongoDB", depth: "working" },
      { name: "SQLite", depth: "working" },
      { name: "Redis (Upstash)", depth: "working" },
      { name: "Supabase", depth: "working" },
    ],
  },
  {
    group: "Tooling & infra",
    note: "The parts that decide whether anything reaches a user.",
    items: [
      { name: "Git", depth: "core" },
      { name: "Vercel", depth: "working" },
      { name: "Cloudflare (CDN, R2)", depth: "working" },
      { name: "Figma", depth: "core" },
      { name: "Docker", depth: "familiar" },
    ],
  },
];
