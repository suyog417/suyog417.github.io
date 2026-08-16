"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Words light up one by one as the block passes through the viewport, tied to
 * scroll position rather than a timer. Falls back to plain, fully-lit text
 * under reduced motion — and the text is real text either way, so selection
 * and screen readers are unaffected.
 */
export function ScrubText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const { gsap } = getGsap();
    const words = el.querySelectorAll("[data-word]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <p ref={ref} className={className}>
      {children.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} data-word className="inline-block">
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
}
