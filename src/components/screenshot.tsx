import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Renders the real capture if the file exists in /public, otherwise a labelled
 * frame. Adding a screenshot is a file drop, not a code change — and no
 * broken-image icons ship in the meantime.
 */
export function Screenshot({ src, alt }: { src: string; alt: string }) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", src));

  if (!exists) {
    return (
      <figure className="flex aspect-[4/3] flex-col justify-end border border-dashed border-line p-5">
        <figcaption className="font-mono text-xs leading-relaxed text-faint">
          <span className="mono-label mb-2 block">Screen</span>
          {alt}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="border border-line">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={900}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-full"
      />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
