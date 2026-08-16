"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * An endless strip that always drifts, but leans and speeds up with scroll
 * velocity and flips direction when you scroll back up. Two copies of the
 * content make the wrap seamless.
 */
export function Marquee({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;

    const { gsap, ScrollTrigger } = getGsap();

    const loop = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 22,
      repeat: -1,
    });

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        // Scroll velocity drives speed, direction and a little skew.
        const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 220);
        loop.timeScale(self.direction * (1 + Math.abs(v)));
        gsap.to(track, {
          skewX: gsap.utils.clamp(-10, 10, v * 1.4),
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      },
    });

    return () => {
      st.kill();
      loop.kill();
    };
  }, [reduced]);

  const row = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line py-5 select-none"
    >
      <div ref={trackRef} className="flex w-max gap-8 whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-display text-3xl tracking-tight text-ink/70 sm:text-4xl"
          >
            {item}
            <span className="text-accent">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
