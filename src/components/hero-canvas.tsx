"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Body as MBody, Engine as MEngine } from "matter-js";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const ROWS = ["BHOYE", "SUYOG"]; // bottom row first — this is a stack
const KNOCKED = 0.45; // radians of tilt before a letter counts as down
const LAUNCH = 0.22; // pull distance (px) → launch velocity (px per step)

type Letter = { body: MBody; char: string; w: number; h: number };
type Dot = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };

/**
 * The hero, which is also a toy.
 *
 * Background: a dot field that shoves away from the pointer.
 * Foreground: the name stacked as ten rigid letter bodies, and a slingshot on
 * the left. Drag the ball back, let go, knock the name over. Matter.js runs
 * the physics; the drawing is ours so the letters render in the real display
 * face and the theme's colours.
 *
 * Under prefers-reduced-motion none of it runs — the name renders as static
 * upright text and the slingshot is hidden.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [down, setDown] = useState(0);
  const [armed, setArmed] = useState(false); // has the user fired once
  const reduced = useReducedMotion();

  const reset = useCallback(() => resetRef.current(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let cleanupMatter: (() => void) | null = null;

    // Read the display face off a probe — canvas `font` cannot take a CSS var.
    function displayFamily() {
      const probe = document.createElement("span");
      probe.className = "display";
      probe.style.cssText = "position:absolute;visibility:hidden";
      document.body.appendChild(probe);
      const f = getComputedStyle(probe).fontFamily || "Georgia, serif";
      probe.remove();
      return f;
    }

    const theme = { ink: "", muted: "", accent: "", line: "" };
    function readTheme() {
      const s = getComputedStyle(document.documentElement);
      theme.ink = s.getPropertyValue("--ink").trim() || "#f2f1ee";
      theme.muted = s.getPropertyValue("--ink-muted").trim() || "#8d8d88";
      theme.accent = s.getPropertyValue("--accent").trim() || "#cff44a";
      theme.line = s.getPropertyValue("--line").trim() || "#232326";
    }
    readTheme();

    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ---- geometry -----------------------------------------------------------
    let w = 0;
    let h = 0;
    let dpr = 1;
    let family = displayFamily();
    let fontSize = 90;
    const pointer = { x: -9999, y: -9999, active: false };
    let dots: Dot[] = [];

    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap!.clientWidth;
      h = wrap!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = Math.min(w / 8.5, h / 4.4, 108);

      // Background dot field, on a grid, skipping the sling corner.
      const step = 34;
      dots = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          dots.push({ x, y, hx: x, hy: y, vx: 0, vy: 0 });
        }
      }
    }

    function drawDots() {
      for (const d of dots) {
        if (pointer.active) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const R = 130;
          if (d2 < R * R && d2 > 0.01) {
            const dist = Math.sqrt(d2);
            const f = (1 - dist / R) * 3.2;
            d.vx += (dx / dist) * f;
            d.vy += (dy / dist) * f;
          }
        }
        d.vx += (d.hx - d.x) * 0.05;
        d.vy += (d.hy - d.y) * 0.05;
        d.vx *= 0.88;
        d.vy *= 0.88;
        d.x += d.vx;
        d.y += d.vy;

        const off = Math.hypot(d.x - d.hx, d.y - d.hy);
        ctx!.fillStyle = off > 8 ? theme.accent : theme.line;
        ctx!.fillRect(d.x, d.y, 2, 2);
      }
    }

    // ---- reduced motion: draw once, no engine -------------------------------
    if (reduced) {
      const drawStatic = () => {
        sizeCanvas();
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.line;
        for (const d of dots) ctx.fillRect(d.x, d.y, 2, 2);
        ctx.fillStyle = theme.ink;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontSize}px ${family}`;
        ROWS.slice()
          .reverse()
          .forEach((row, i) => {
            ctx.fillText(row, w / 2, h / 2 - fontSize * 0.45 + i * fontSize * 0.9);
          });
      };
      drawStatic();
      window.addEventListener("resize", drawStatic);
      return () => {
        themeObserver.disconnect();
        window.removeEventListener("resize", drawStatic);
      };
    }

    // ---- physics ------------------------------------------------------------
    import("matter-js").then((mod) => {
      if (cancelled) return;
      const { Engine, Bodies, Body, Composite, Vector } = mod;

      const engine: MEngine = Engine.create();
      engine.gravity.y = 0.9;

      const BALL = {
        // Heavier than a letter (~3), so any solid hit actually knocks it over.
        density: 0.006,
        restitution: 0.6,
        friction: 0.4,
        frictionAir: 0.0005,
      };

      let letters: Letter[] = [];
      let statics: MBody[] = [];
      let ball: MBody;
      let anchor = { x: 0, y: 0 };
      let ground = 0;
      const shots: MBody[] = []; // balls already fired, oldest first
      const restedFor = new WeakMap<MBody, number>(); // frames spent motionless
      const drag = { active: false, id: -1 };
      // Gravity in px per step², matching Engine.update(1000/60).
      const GRAV = engine.gravity.y * engine.gravity.scale * (1000 / 60) ** 2;

      /**
       * The ball waits on the sling frozen, so dragging it can't fight the
       * solver. It must be created dynamic and then frozen: a body created
       * with isStatic never records the mass Body.setStatic(false) restores
       * from, and comes back weighing infinity — it would never move again.
       */
      function makeBall() {
        const b = Bodies.circle(anchor.x, anchor.y, 15, BALL);
        Body.setStatic(b, true);
        // Inert while it waits: otherwise the next ball, sitting on the sling,
        // is the first thing the shot in flight hits.
        b.isSensor = true;
        return b;
      }

      function build() {
        sizeCanvas();
        family = displayFamily();
        Composite.clear(engine.world, false);

        ground = h - 26;
        anchor = { x: Math.max(104, w * 0.12), y: ground - fontSize * 1.6 };

        // Floor and walls, so nothing escapes the frame.
        statics = [
          Bodies.rectangle(w / 2, ground + 30, w * 2, 60, { isStatic: true }),
          Bodies.rectangle(-30, h / 2, 60, h * 3, { isStatic: true }),
          Bodies.rectangle(w + 30, h / 2, 60, h * 3, { isStatic: true }),
        ];
        Composite.add(engine.world, statics);

        // The name, stacked as blocks.
        ctx!.font = `${fontSize}px ${family}`;
        const pad = fontSize * 0.06;
        const gap = fontSize * 0.07;
        const rowH = fontSize * 0.78;
        const widths = ROWS.map((row) =>
          row.split("").reduce((sum, c) => sum + ctx!.measureText(c).width + pad + gap, 0),
        );
        const towerCx = Math.min(w * 0.5, w - Math.max(...widths) / 2 - 24);

        letters = [];
        ROWS.forEach((row, r) => {
          let x = towerCx - widths[r] / 2;
          const y = ground - rowH / 2 - r * rowH;
          for (const char of row) {
            const cw = ctx!.measureText(char).width + pad;
            const body = Bodies.rectangle(x + cw / 2, y, cw, rowH, {
              friction: 0.2,
              frictionStatic: 0.3,
              restitution: 0.05,
              // Light enough that a fast ball topples the stack, heavy enough
              // that it doesn't explode on contact.
              density: 0.0006,
            });
            letters.push({ body, char, w: cw, h: rowH });
            x += cw + gap;
          }
        });
        Composite.add(engine.world, letters.map((l) => l.body));

        // Slingshot.
        ball = makeBall();
        Composite.add(engine.world, ball);
        shots.length = 0;
        setDown(0);
      }

      function reload() {
        ball = makeBall();
        Composite.add(engine.world, ball);
      }

      build();
      resetRef.current = () => {
        build();
        setArmed(false);
      };

      // ---- pointer: drag the ball, and drive the dot field ------------------
      function localPoint(e: PointerEvent) {
        const r = canvas!.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }

      function onDown(e: PointerEvent) {
        const p = localPoint(e);
        if (Vector.magnitude(Vector.sub(p, ball.position)) > 46) return;
        drag.active = true;
        drag.id = e.pointerId;
        canvas!.setPointerCapture(e.pointerId);
        setArmed(true);
      }

      function onMove(e: PointerEvent) {
        const p = localPoint(e);
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.active = true;

        if (!drag.active || e.pointerId !== drag.id) return;
        e.preventDefault();
        // Clamp the pull twice: once for force, once to keep the ball inside
        // the frame — drag it into the wall body and the shot dies there.
        const v = Vector.sub(p, anchor);
        const max = 140;
        const capped =
          Vector.magnitude(v) > max
            ? Vector.add(anchor, Vector.mult(Vector.normalise(v), max))
            : p;
        const pulled = {
          x: Math.min(Math.max(capped.x, 22), w - 22),
          y: Math.min(Math.max(capped.y, 22), ground - 22),
        };
        Body.setPosition(ball, pulled);
        Body.setVelocity(ball, { x: 0, y: 0 });
      }

      function onUp(e: PointerEvent) {
        if (!drag.active || e.pointerId !== drag.id) return;
        drag.active = false;
        drag.id = -1;

        // Fire along the pull vector. Letting the elastic sling it looks the
        // same but detaches on whichever swing happens to cross the threshold,
        // so shots came out backwards — this is deterministic.
        const pull = Vector.sub(anchor, ball.position);
        if (Vector.magnitude(pull) < 12) return; // barely moved: keep the ball
        ball.isSensor = false;
        Body.setStatic(ball, false);
        Body.setVelocity(ball, Vector.mult(pull, LAUNCH));
        shots.push(ball);
        reload();
      }

      function onLeave() {
        pointer.active = false;
      }

      canvas!.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", build);

      // ---- draw -------------------------------------------------------------
      let knocked = 0;
      function frame() {
        Engine.update(engine, 1000 / 60);
        ctx!.clearRect(0, 0, w, h);

        drawDots();

        // Ground line.
        ctx!.strokeStyle = theme.line;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(0, ground + 0.5);
        ctx!.lineTo(w, ground + 0.5);
        ctx!.stroke();

        // Sling: post plus two bands to the ball.
        ctx!.strokeStyle = theme.muted;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(anchor.x, anchor.y);
        ctx!.lineTo(anchor.x, ground);
        ctx!.stroke();

        ctx!.strokeStyle = theme.accent;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(anchor.x - 7, anchor.y);
        ctx!.lineTo(ball.position.x, ball.position.y);
        ctx!.lineTo(anchor.x + 7, anchor.y);
        ctx!.stroke();

        // Aim: the arc the shot will take, same maths the engine will run.
        if (drag.active) {
          const vx = (anchor.x - ball.position.x) * LAUNCH;
          const vy = (anchor.y - ball.position.y) * LAUNCH;
          ctx!.fillStyle = theme.muted;
          for (let t = 6; t < 90; t += 6) {
            const px = ball.position.x + vx * t;
            const py = ball.position.y + vy * t + 0.5 * GRAV * t * t;
            if (py > ground || px > w) break;
            ctx!.beginPath();
            ctx!.arc(px, py, 2, 0, Math.PI * 2);
            ctx!.fill();
          }
        }

        // Letters.
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.font = `${fontSize}px ${family}`;
        let downNow = 0;
        for (const l of letters) {
          const tilted = Math.abs(l.body.angle) > KNOCKED;
          if (tilted) downNow += 1;
          ctx!.save();
          ctx!.translate(l.body.position.x, l.body.position.y);
          ctx!.rotate(l.body.angle);
          ctx!.fillStyle = tilted ? theme.accent : theme.ink;
          ctx!.fillText(l.char, 0, 0);
          ctx!.restore();
        }
        if (downNow !== knocked) {
          knocked = downNow;
          setDown(downNow);
        }

        // Spent shots, then the one on the sling.
        for (let i = shots.length - 1; i >= 0; i--) {
          const s = shots[i];
          const lost =
            s.position.y > h + 300 ||
            s.position.y < -900 ||
            s.position.x < -200 ||
            s.position.x > w + 200;
          // Spent balls have to clear off: left lying around they become
          // bumpers that stop the next shot before it reaches the name.
          const rest = (restedFor.get(s) ?? 0) + (s.speed < 0.6 ? 1 : -Infinity);
          restedFor.set(s, Math.max(rest, 0));
          if (lost || rest > 40 || shots.length - i > 3) {
            Composite.remove(engine.world, s);
            restedFor.delete(s);
            shots.splice(i, 1);
            continue;
          }
          ctx!.fillStyle = theme.muted;
          ctx!.beginPath();
          ctx!.arc(s.position.x, s.position.y, 15, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.fillStyle = theme.accent;
        ctx!.beginPath();
        ctx!.arc(ball.position.x, ball.position.y, 15, 0, Math.PI * 2);
        ctx!.fill();

        raf = requestAnimationFrame(frame);
      }

      document.fonts.ready.then(() => {
        if (cancelled) return;
        build();
        frame();
      });

      cleanupMatter = () => {
        cancelAnimationFrame(raf);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        canvas!.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        window.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", build);
      };
    });

    return () => {
      cancelled = true;
      themeObserver.disconnect();
      cleanupMatter?.();
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className="relative h-[54vh] min-h-[380px] w-full sm:h-[62vh] sm:min-h-[440px]"
    >
      {/* touch-action: the page still scrolls vertically over the canvas; only
          sideways drags reach the slingshot. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 touch-pan-y"
      />

      {/* The name is real text regardless of what the canvas is doing. */}
      <h1 className="sr-only">Suyog Bhoye</h1>

      {!reduced ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4">
          <p className="mono-label max-w-[46%]">
            {armed
              ? `${down} / 10 letters down`
              : "← pull the ball back, let go"}
          </p>
          {down > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="mono-label pointer-events-auto border border-line bg-bg px-3 py-1.5 transition-colors hover:border-accent hover:text-accent"
            >
              Stack it back up
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
