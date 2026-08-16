import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="mono-label mb-6">404</p>
      <h1 className="display text-[clamp(2.5rem,8vw,4.5rem)] text-ink">
        Nothing here.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        That page doesn&apos;t exist, or it moved. The work is all on the home
        page.
      </p>
      <Link
        href="/"
        className="mono-label mt-10 self-start border border-line px-5 py-3 transition-colors hover:border-accent hover:text-accent"
      >
        ← Back home
      </Link>
    </div>
  );
}
