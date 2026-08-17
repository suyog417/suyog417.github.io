"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Pulls its child toward the cursor when the cursor gets close, and snaps it
 * back with a little elastic. Pointer-fine devices only — on touch it is inert.
 */
export function Magnetic({
  children,
  strength = 0.35,
  // Cap the travel in px: unclamped, `strength` scales with element size, so
  // two neighbouring buttons both slide inward and overlap when the cursor
  // sits between them.
  maxOffset = 8,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  maxOffset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const { gsap } = getGsap();

    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(r.width, r.height) * 1.2;

      if (dist < radius) {
        const clamp = gsap.utils.clamp(-maxOffset, maxOffset);
        gsap.to(el, {
          x: clamp(dx * strength),
          y: clamp(dy * strength),
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      }
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, maxOffset, reduced]);

  return (
    <span ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </span>
  );
}
