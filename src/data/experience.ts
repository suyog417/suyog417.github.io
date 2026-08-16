export type Engagement = {
  role: string;
  org: string;
  location: string;
  period: string;
  kind: "Internship" | "Client work" | "Product";
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Engagement[] = [
  {
    role: "Founding engineer",
    org: "Qwish",
    location: "Pune, India",
    period: "2025 — present",
    kind: "Product",
    summary:
      "Building a student skill-assessment platform: product spec, design system and Flutter client.",
    points: [
      "Designed the Qwish Score model — a 0—1000 signal where every point traces back to a verifiable input.",
      "Built a token-driven design system that survived four full redesign cycles without rewriting screens.",
      "Separated verified from self-reported signals so recruiters can see what a score is actually made of.",
    ],
    stack: ["Flutter", "Dart", "Firebase", "Figma"],
  },
  {
    role: "Developer",
    org: "Daichi (food traceability)",
    location: "Client engagement",
    period: "2025",
    kind: "Client work",
    summary:
      "Delivered a consumer traceability web app and admin dashboard for a women's self-help-group food brand.",
    points: [
      "Built a scroll-linked ingredient timeline that turns a supply chain into a narrative a shopper will actually read.",
      "Anchored batch records to a ledger for tamper-evidence while keeping the consumer read path fast and off-chain.",
      "Shipped an admin dashboard non-technical staff operate unaided.",
    ],
    stack: ["Next.js", "TypeScript", "MongoDB", "GSAP"],
  },
  {
    role: "Developer",
    org: "Actuarial Simulation Engine",
    location: "Client engagement",
    period: "2025",
    kind: "Client work",
    summary:
      "Built a WinUI 3 + SQLite simulation engine with C#-to-FIS-Prophet formula translation.",
    points: [
      "Designed a product/workspace variable-override architecture — one source of truth, no duplicated models.",
      "Cut run times with WAL mode, batched transactions, run-level parallelism and SIMD numeric kernels.",
      "Kept the whole system local-only: client data never leaves the workstation.",
    ],
    stack: ["C#", "WinUI 3", "SQLite", ".NET"],
  },
  {
    role: "Frontend Developer Intern",
    org: "kGamify",
    location: "Pune, India",
    period: "Jan — Jun 2025",
    kind: "Internship",
    summary:
      "Built a Flutter application from scratch and published it to the Google Play Store.",
    points: [
      "Sole developer on the mobile client — architecture, UI, API integration and release.",
      "Owned the Play Store pipeline end to end: signing, listing, review and release.",
      "Iterated directly with the founding team on scope.",
    ],
    stack: ["Flutter", "Dart", "REST APIs"],
  },
];
