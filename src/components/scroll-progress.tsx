"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Hairline accent bar under the nav, scrubbed by page scroll. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || reduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
    });

    return () => st.kill();
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      ref={barRef}
      className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent"
    />
  );
}
