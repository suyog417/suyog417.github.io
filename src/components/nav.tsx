"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import { ScrollProgress } from "./scroll-progress";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#stack", label: "Stack" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const onCase = pathname.startsWith("/work/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-ink transition-colors hover:text-accent"
        >
          {onCase ? "← Suyog Bhoye" : "Suyog Bhoye"}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="mono-label px-3 py-2 transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={site.resume}
            className="mono-label border border-line px-3 py-1.5 transition-colors hover:border-line-strong hover:text-ink"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </nav>
      <ScrollProgress />
    </header>
  );
}
