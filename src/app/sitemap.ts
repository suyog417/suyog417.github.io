import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// Emitted as a file at build time — required by output: "export".
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: new Date(), priority: 1 },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: new Date(),
      priority: p.tier === 1 ? 0.8 : 0.5,
    })),
  ];
}
