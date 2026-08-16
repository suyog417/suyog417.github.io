export type ProjectLink = {
  label: string;
  href: string;
  kind: "live" | "github" | "store" | "case";
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ArchitectureNode = {
  layer: string;
  items: string[];
};

export type Project = {
  slug: string;
  name: string;
  /** One-line outcome. Shown on the card, under the name. */
  outcome: string;
  /** Short qualifier: "Client work", "Internship", "Personal" */
  kind: "Product" | "Client work" | "Internship" | "Personal";
  year: string;
  /** Tier 1 = full case study card, Tier 2 = compact grid entry. */
  tier: 1 | 2;
  /** The lens this project is meant to demonstrate. */
  angle: string;
  problem: string;
  constraints: string[];
  stack: string[];
  metrics: ProjectMetric[];
  /** The one hard call, and what it cost. */
  decision: {
    title: string;
    body: string;
    tradeoff: string;
  };
  architecture: ArchitectureNode[];
  outcomeDetail: string[];
  /** Screens described in words until real captures land in /public/work/<slug>/. */
  screens: { src: string; alt: string }[];
  links: ProjectLink[];
  confidential?: boolean;
};

export const projects: Project[] = [
  {
    slug: "qwish",
    name: "Qwish",
    outcome:
      "A skill-assessment platform that turns a student's scattered proof-of-work into one recruiter-legible number.",
    kind: "Product",
    year: "2025 — present",
    tier: 1,
    angle: "Design system & product thinking",
    problem:
      "Gen Z students in India graduate with certificates, hackathon wins and side projects that no recruiter has time to parse. Résumés flatten all of it into bullet points. The platform needed a single signal a recruiter could trust in ten seconds — and students could actually move.",
    constraints: [
      "The score has to feel earned, not gamified — no confetti, no streak guilt",
      "Every point must be traceable to a verifiable input, or the number is worthless",
      "Recruiter view and student view read the same score with opposite intent",
    ],
    stack: ["Flutter", "Dart", "Firebase", "Cloud Firestore", "Figma"],
    metrics: [
      { value: "0—1000", label: "Qwish Score range" },
      { value: "4", label: "Redesign cycles" },
      { value: "3", label: "Assessment surfaces" },
    ],
    decision: {
      title: "Made the score a ring, not a bar",
      body:
        "The first build used a progress bar with a percentage. It tested badly: a bar implies a finish line, and students read 62% as failure. Switching to a 0—1000 ring with an animated delta reframed the same data as position rather than completion — the number moves, the ring never ends. The delta animation (+18 since last week) became the thing users opened the app for.",
      tradeoff:
        "A ring costs more to render and is harder to make accessible than a bar. Every ring in the app ships with a text equivalent in the accessibility tree, and the animation is skipped entirely under prefers-reduced-motion.",
    },
    architecture: [
      { layer: "Client", items: ["Flutter (Android / iOS)", "Riverpod state", "Custom painter ring"] },
      { layer: "Auth & data", items: ["Firebase Auth", "Cloud Firestore", "Cloud Storage"] },
      { layer: "Scoring", items: ["Cloud Functions", "Weighted signal model", "Audit trail per point"] },
      { layer: "Design", items: ["Token-driven design system", "Type & motion scale", "Figma component library"] },
    ],
    outcomeDetail: [
      "Shipped a token-driven design system — colour, type, motion and elevation as named tokens — so four redesign cycles touched tokens, not screens.",
      "The authority layer separates self-reported inputs from verified ones, so a recruiter sees which part of a score is evidence-backed.",
      "The score-delta interaction became the product's signature and now anchors the whole visual identity.",
    ],
    screens: [
      { src: "/work/qwish/score.png", alt: "Qwish score ring showing a 742 score with a +18 weekly delta" },
      { src: "/work/qwish/breakdown.png", alt: "Score breakdown screen listing verified and self-reported signals" },
    ],
    links: [{ label: "Case study", href: "/work/qwish", kind: "case" }],
  },
  {
    slug: "aftercollege",
    name: "AfterCollege",
    outcome:
      "A campus-only social platform where every account is verified against a real college, built to hold 10,000 users on a student budget.",
    kind: "Product",
    year: "2025",
    tier: 1,
    angle: "Backend architecture & scale",
    problem:
      "Campus social apps die from two causes: outsiders flooding in, and a feed that stalls the moment it gets popular. The product needed hard verification at the door and a swipe deck that stays at 60fps while the backend runs on free-tier economics.",
    constraints: [
      "Verification must gate signup without becoming a support queue",
      "TRD scoped to 10k concurrent users before any paid scaling",
      "iOS-first — the swipe deck is the product, so jank is a P0 bug",
    ],
    stack: ["Go", "Supabase", "PostgreSQL", "Cloudflare CDN", "Swift", "Redis"],
    metrics: [
      { value: "10k", label: "Users designed for" },
      { value: "60fps", label: "Swipe deck target" },
      { value: "Go", label: "API runtime" },
    ],
    decision: {
      title: "Prefetched the deck instead of paginating it",
      body:
        "The obvious build is a paginated feed: fetch 20, swipe, fetch 20 more. That puts a network round-trip in the middle of a gesture. Instead the client holds a rolling window of candidates and refills in the background at a low-water mark, while the Go service precomputes candidate sets per user rather than ranking on read. Swipes never wait on the network.",
      tradeoff:
        "Precomputed candidate sets go stale — a user who joins now isn't visible to everyone instantly. Acceptable for a social deck, unacceptable for anything transactional, so the same pattern is deliberately not used for messaging.",
    },
    architecture: [
      { layer: "Client", items: ["iOS (Swift)", "Rolling candidate window", "Optimistic swipe writes"] },
      { layer: "Edge", items: ["Cloudflare CDN", "Image transforms", "Cached static payloads"] },
      { layer: "API", items: ["Go services", "Candidate precompute worker", "Rate limiting"] },
      { layer: "Data", items: ["Supabase Postgres", "Row-level security", "Redis hot cache"] },
    ],
    outcomeDetail: [
      "Wrote the TRD first — capacity model, failure modes and cost ceiling — then built to it, which is what kept the design inside free-tier limits.",
      "Row-level security enforces campus isolation at the database, not in application code, so a bug in a handler cannot leak across colleges.",
      "Media served through Cloudflare, so the origin never pays for image bandwidth.",
    ],
    screens: [
      { src: "/work/aftercollege/deck.png", alt: "AfterCollege swipe deck showing a verified student profile card" },
      { src: "/work/aftercollege/verify.png", alt: "Campus verification flow gating account signup" },
    ],
    links: [{ label: "Case study", href: "/work/aftercollege", kind: "case" }],
  },
  {
    slug: "daichi",
    name: "Daichi",
    outcome:
      "Farm-to-shelf traceability for a women's self-help-group food brand — every ingredient in a jar, with its origin, on one scrollable trail.",
    kind: "Client work",
    year: "2025",
    tier: 1,
    angle: "Client delivery & narrative-led design",
    confidential: true,
    problem:
      "The brand's whole value is provenance: ingredients sourced from a women's self-help group, processed in small batches. On the shelf, that story is invisible — it competes with mass-produced jars that look identical. The client needed the supply chain to become the marketing.",
    constraints: [
      "Non-technical admins add batches, so the dashboard has to survive real-world data entry",
      "Buyers arrive on mobile from a pack QR code, often on slow connections",
      "Batch records must be tamper-evident to be worth anything as a claim",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Blockchain ledger", "GSAP"],
    metrics: [
      { value: "Farm→shelf", label: "Traceability depth" },
      { value: "Per-product", label: "Accent colour system" },
      { value: "1", label: "Scan to full trail" },
    ],
    decision: {
      title: "Anchored batch records to a ledger, kept the read path off-chain",
      body:
        "A traceability claim nobody can verify is a marketing claim. Writing every batch on-chain makes it verifiable but makes page loads slow and costly. The build hashes each batch record to the ledger for tamper-evidence, while the consumer page reads from MongoDB — so verification is available on demand and the trail still loads instantly on a 3G phone in a shop aisle.",
      tradeoff:
        "Verification is a deliberate extra step rather than automatic on page load. Most buyers will never tap it; the ones who do — and auditors — get proof. Trust for everyone else rests on the brand.",
    },
    architecture: [
      { layer: "Consumer", items: ["Next.js App Router", "Animated vertical timeline", "QR entry point"] },
      { layer: "Content", items: ["Per-product accent tokens", "Ingredient trail model", "Image pipeline"] },
      { layer: "Admin", items: ["Batch dashboard", "Role-gated writes", "Validation on entry"] },
      { layer: "Trust", items: ["Batch hash → ledger", "On-demand verification", "Audit log"] },
    ],
    outcomeDetail: [
      "The vertical timeline is scroll-linked — each stage of the trail draws in as the buyer scrolls, which makes a supply chain read like a story instead of a table.",
      "Each product carries its own accent colour token, so the same components render a distinct identity per SKU with no per-product code.",
      "Delivered to a real client with an admin dashboard non-technical staff run unaided.",
    ],
    screens: [
      { src: "/work/daichi/timeline.png", alt: "Daichi vertical ingredient timeline tracing a product from farm to shelf" },
      { src: "/work/daichi/admin.png", alt: "Daichi admin dashboard for entering and tracking product batches" },
    ],
    links: [{ label: "Case study", href: "/work/daichi", kind: "case" }],
  },
  {
    slug: "actuarial-simulation-engine",
    name: "Actuarial Simulation Engine",
    outcome:
      "A desktop simulation engine that translates C# actuarial formulas to FIS Prophet and runs large workspaces without leaving the machine.",
    kind: "Client work",
    year: "2025",
    tier: 1,
    angle: "Systems engineering",
    confidential: true,
    problem:
      "Actuarial teams model products as thousands of interdependent variables, then override slices of them per workspace. Doing this in spreadsheets is slow and untraceable; doing it in Prophet means hand-translating formulas. The engine had to hold the variable model, run simulations locally, and emit Prophet-compatible formulas.",
    constraints: [
      "Runs entirely on a workstation — no server, no cloud, data never leaves the box",
      "Overrides must be resolvable per workspace without duplicating the product model",
      "Runs are long; a 2x speedup is the difference between a coffee break and a lost afternoon",
    ],
    stack: ["C#", "WinUI 3", "SQLite", ".NET", "SIMD intrinsics"],
    metrics: [
      { value: "WAL", label: "SQLite journal mode" },
      { value: "SIMD", label: "Vectorised inner loop" },
      { value: "2-level", label: "Variable resolution" },
    ],
    decision: {
      title: "Product/workspace override resolution instead of copied models",
      body:
        "The naive model copies a product's full variable set into each workspace so it can be edited. That multiplies storage, and a change to the product never reaches its workspaces. Instead workspaces store only overrides and resolve against the product at read time — one lookup layer, one source of truth. Changing a product variable propagates to every workspace that hasn't explicitly overridden it.",
      tradeoff:
        "Every read pays a resolution cost, which is why the hot path is cached per run and the whole layer is fronted by batched transactions. Worth it: correctness bugs from divergent copies are far more expensive than lookups.",
    },
    architecture: [
      { layer: "UI", items: ["WinUI 3", "Virtualised variable grid", "Run progress + cancellation"] },
      { layer: "Engine", items: ["Simulation core", "Parallel run partitioning", "SIMD numeric kernels"] },
      { layer: "Model", items: ["Product variables", "Workspace overrides", "Resolution cache"] },
      { layer: "Storage", items: ["SQLite (WAL)", "Batched transactions", "Local-only persistence"] },
    ],
    outcomeDetail: [
      "Performance work was measured, not guessed: WAL mode for concurrent reads during writes, batched transactions to cut fsync pressure, parallelism across run partitions, SIMD in the numeric inner loop.",
      "The C#-to-Prophet formula translator removes a manual re-entry step that was the main source of modelling errors.",
      "Client engagement — specifics of the actuarial models are kept generic here.",
    ],
    screens: [
      { src: "/work/actuarial/workspace.png", alt: "Simulation engine workspace showing product variables and overrides" },
      { src: "/work/actuarial/run.png", alt: "Simulation run view with progress and performance statistics" },
    ],
    links: [{ label: "Case study", href: "/work/actuarial-simulation-engine", kind: "case" }],
  },
  {
    slug: "quizapp",
    name: "QuizApp",
    outcome:
      "A quiz-based learning platform for Indian schools and colleges, specced across four role flows and two clients.",
    kind: "Product",
    year: "2025",
    tier: 2,
    angle: "Multi-role product spec",
    problem:
      "Classroom quiz tools usually serve the teacher and treat everyone else as an afterthought. This one models four distinct users — Student, Teacher, Admin, Parent — each with a different question about the same data: am I improving, is my class improving, is my institution improving, is my child improving.",
    constraints: [
      "Four role flows over one data model, without four codebases",
      "Institutions arrive mid-term with existing rosters",
      "Cost per institution has to stay near zero until adoption",
    ],
    stack: ["NestJS", "TypeScript", "Neon Postgres", "Upstash Redis", "Cloudflare R2", "Flutter", "Next.js"],
    metrics: [
      { value: "4", label: "Role flows" },
      { value: "2", label: "Client apps" },
      { value: "Serverless", label: "Data tier" },
    ],
    decision: {
      title: "One API, role-scoped projections",
      body:
        "Rather than building four apps, the NestJS API exposes one domain model and projects role-scoped views over it. A parent's dashboard and a teacher's dashboard are the same aggregation with different scopes and permissions — so a new metric ships to all four roles at once.",
      tradeoff:
        "Permission logic concentrates in one place, which makes it both the highest-leverage and highest-risk code in the system. It gets the strictest tests.",
    },
    architecture: [
      { layer: "Clients", items: ["Flutter (students)", "Next.js (staff & admin)"] },
      { layer: "API", items: ["NestJS", "Role-scoped projections", "Quiz session engine"] },
      { layer: "Data", items: ["Neon Postgres", "Upstash Redis cache", "Cloudflare R2 media"] },
    ],
    outcomeDetail: [
      "Full product spec and prototype covering all four roles before a line of production code.",
      "Serverless Postgres, Redis and object storage keep idle cost effectively zero between terms.",
    ],
    screens: [
      { src: "/work/quizapp/student.png", alt: "QuizApp student quiz session screen" },
      { src: "/work/quizapp/teacher.png", alt: "QuizApp teacher dashboard showing class performance" },
    ],
    links: [{ label: "Case study", href: "/work/quizapp", kind: "case" }],
  },
  {
    slug: "kgamify",
    name: "kGamify App",
    outcome:
      "Built a Flutter app solo during an internship and shipped it to the Play Store.",
    kind: "Internship",
    year: "2025",
    tier: 2,
    angle: "Ship it",
    problem:
      "kGamify needed a mobile client built from an empty repository to a published listing — design, implementation, store assets, release — with one developer on it.",
    constraints: [
      "Solo build inside a six-month internship",
      "Play Store review and release requirements owned end to end",
    ],
    stack: ["Flutter", "Dart", "REST APIs", "Play Console"],
    metrics: [
      { value: "Play Store", label: "Shipped to" },
      { value: "Jan—Jun 25", label: "Internship" },
      { value: "Solo", label: "Team size" },
    ],
    decision: {
      title: "Owned the release pipeline, not just the code",
      body:
        "The app was built from scratch and taken through signing, store listing, review and release. Doing the boring release work is what turned an internship project into a shipped product.",
      tradeoff:
        "Time spent on release mechanics is time not spent on features — but an unshipped app has no features.",
    },
    architecture: [
      { layer: "Client", items: ["Flutter", "REST integration", "Local persistence"] },
      { layer: "Release", items: ["Play Console", "Signed builds", "Store listing"] },
    ],
    outcomeDetail: [
      "First production app taken from empty repo to public listing.",
      "Worked directly with the founding team on scope and iteration.",
    ],
    screens: [{ src: "/work/kgamify/app.png", alt: "kGamify Flutter app running on Android" }],
    links: [{ label: "Case study", href: "/work/kgamify", kind: "case" }],
  },
  {
    slug: "maid-easy",
    name: "Maid-Easy",
    outcome: "A booking app connecting households with verified domestic help.",
    kind: "Personal",
    year: "2024",
    tier: 2,
    angle: "Marketplace basics",
    problem:
      "Hiring domestic help runs on word of mouth, which leaves both sides without reputation or reliable scheduling. Maid-Easy models profiles, availability and bookings as first-class objects.",
    constraints: ["Two-sided flows on a small codebase", "Offline-tolerant mobile client"],
    stack: ["Flutter", "Dart", "Firebase"],
    metrics: [
      { value: "2-sided", label: "Marketplace" },
      { value: "Firebase", label: "Backend" },
    ],
    decision: {
      title: "Availability as slots, not free text",
      body:
        "Modelling availability as structured slots rather than a description field is what made search and conflict detection possible at all.",
      tradeoff: "More friction at profile setup, in exchange for a bookable system.",
    },
    architecture: [
      { layer: "Client", items: ["Flutter", "Firebase Auth"] },
      { layer: "Data", items: ["Cloud Firestore", "Slot-based availability"] },
    ],
    outcomeDetail: ["Complete two-sided booking flow with profiles, search and scheduling."],
    screens: [{ src: "/work/maid-easy/booking.png", alt: "Maid-Easy booking screen" }],
    links: [{ label: "Case study", href: "/work/maid-easy", kind: "case" }],
  },
  {
    slug: "desk-alert",
    name: "Desk-Alert",
    outcome: "A desktop alerting utility for time-boxed work and break reminders.",
    kind: "Personal",
    year: "2023",
    tier: 2,
    angle: "Small tools, done properly",
    problem:
      "Long coding sessions run past every intended stopping point. Desk-Alert schedules interruptions that are hard to dismiss on autopilot.",
    constraints: ["Runs unattended in the background", "Must not become the thing you ignore"],
    stack: ["Python", "Desktop notifications", "Scheduling"],
    metrics: [
      { value: "Background", label: "Runtime" },
      { value: "Python", label: "Built with" },
    ],
    decision: {
      title: "Escalating, not repeating, reminders",
      body:
        "A repeating reminder gets trained out within a week. Escalation — the alert changing character each time it's dismissed — keeps it legible for longer.",
      tradeoff: "Mildly annoying by design.",
    },
    architecture: [
      { layer: "App", items: ["Python scheduler", "OS notification bridge"] },
    ],
    outcomeDetail: ["Small, finished, used daily."],
    screens: [{ src: "/work/desk-alert/alert.png", alt: "Desk-Alert desktop notification" }],
    links: [{ label: "Case study", href: "/work/desk-alert", kind: "case" }],
  },
];

export const featuredProjects = projects.filter((p) => p.tier === 1);
export const otherProjects = projects.filter((p) => p.tier === 2);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
