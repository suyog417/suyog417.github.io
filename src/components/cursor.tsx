"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A trailing dot that inverts whatever is under it and swells over anything
 * clickable. Pointer-fine only; the real cursor stays visible so nothing is
 * ever lost if this fails to mount.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const { gsap } = getGsap();
    const x = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });

    gsap.set(dot, { opacity: 1 });

    function onMove(e: PointerEvent) {
      x(e.clientX);
      y(e.clientY);

      const over = (e.target as Element)?.closest?.("a, button, [data-cursor]");
      gsap.to(dot, {
        scale: over ? 3.2 : 1,
        duration: 0.3,
        ease: "power3.out",
      });
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 mix-blend-difference [@media(pointer:fine)]:block"
    />
  );
}
