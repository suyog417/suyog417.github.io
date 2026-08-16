import { site } from "@/data/site";
import { CopyEmail } from "./copy-email";
import { Reveal } from "./reveal";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-32">
        <Reveal>
          <p className="mono-label mb-6">05 / Contact</p>

          <h2 id="contact-heading" className="display max-w-3xl text-[clamp(2.25rem,6.5vw,4.5rem)] text-ink">
            If any of this looks like work you need done, email me.
          </h2>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}?subject=Role%20%2F%20project%20for%20Suyog`}
              className="bg-accent px-6 py-3.5 font-mono text-sm text-accent-ink transition-opacity hover:opacity-85"
            >
              {site.email}
            </a>
            <CopyEmail />
          </div>

          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3">
            {[
              { label: "GitHub", value: "Code and repositories", href: site.github },
              { label: "LinkedIn", value: "Experience and updates", href: site.linkedin },
              { label: "Résumé", value: "One-page PDF", href: site.resume },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer noopener" : undefined}
                className="group bg-bg p-6 transition-colors hover:bg-raised"
              >
                <p className="mono-label mb-2 transition-colors group-hover:text-accent">
                  {l.label} ↗
                </p>
                <p className="text-sm text-muted">{l.value}</p>
              </a>
            ))}
          </div>

          <p className="mt-10 text-sm text-muted">
            Based in {site.location}. Open to on-site roles in Pune, elsewhere in
            India, and fully remote teams.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
