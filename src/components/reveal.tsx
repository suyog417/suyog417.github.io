"use client";

import { useEffect, useRef } from "react";
import { duration, ease, prefersReducedMotion, getGsap } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  /** Stagger children marked with [data-reveal-item] instead of the block itself. */
  stagger?: boolean;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-linked reveal. Elements start at opacity 0 via CSS (see globals),
 * so there is no flash before GSAP attaches. Under reduced motion the CSS
 * override already shows everything and this component does nothing.
 */
export function Reveal({
  children,
  stagger = false,
  delay = 0,
  className,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const { gsap } = getGsap();
    const targets = stagger
      ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"))
      : [el];
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration,
          ease,
          delay,
          stagger: stagger ? 0.07 : 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay]);

  return (
    // @ts-expect-error -- polymorphic ref, narrow enough to not be worth generics
    <Tag ref={ref} data-reveal={stagger ? undefined : ""} className={className}>
      {children}
    </Tag>
  );
}
