import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={site.resume}
            download
            className="mono-label text-ink transition-colors hover:text-accent"
          >
            ↓ Download résumé
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            className="mono-label transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="mono-label transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${site.email}`}
            className="mono-label transition-colors hover:text-ink"
          >
            Email
          </a>
        </div>

        <p className="mono-label">
          Last updated {site.lastUpdated} · {site.location}
        </p>
      </div>
    </footer>
  );
}
