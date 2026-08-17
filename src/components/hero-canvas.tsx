"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Body as MBody, Engine as MEngine } from "matter-js";
import confetti from "canvas-confetti";
import type { Depth } from "@/data/stack";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The structure, bottom storey first — pillars carrying planks, with open bays
 * between them, so a good shot can pull a whole floor out and drop everything
 * above it. Depths mirror `src/data/stack.ts`; kept inline because the hero
 * uses short labels ("Firebase", not "Firebase / Firestore").
 *
 * pillar: stood on end, label rotated · plank: spans the bay · block: loose
 * crown piece resting on top.
 */
type Kind = "pillar" | "plank" | "block";
const STRUCTURE: { kind: Kind; items: { name: string; depth: Depth }[] }[] = [
  {
    kind: "pillar",
    items: [
      { name: "PostgreSQL", depth: "working" },
      { name: "Firebase", depth: "core" },
      { name: "Docker", depth: "familiar" },
      { name: "TypeScript", depth: "working" },
    ],
  },
  {
    kind: "plank",
    items: [
      { name: "Next.js", depth: "working" },
      { name: "NestJS", depth: "working" },
    ],
  },
  {
    kind: "pillar",
    items: [
      { name: "Node.js", depth: "working" },
      { name: "Python", depth: "working" },
      { name: "Java", depth: "working" },
    ],
  },
  {
    kind: "plank",
    items: [
      { name: "React", depth: "working" },
      { name: "Tailwind", depth: "working" },
    ],
  },
  {
    kind: "pillar",
    items: [
      { name: "Flutter", depth: "core" },
      { name: "Swift", depth: "familiar" },
    ],
  },
  { kind: "plank", items: [{ name: "Go", depth: "working" }] },
  {
    kind: "block",
    items: [
      { name: "Dart", depth: "core" },
      { name: "Figma", depth: "core" },
    ],
  },
  { kind: "block", items: [{ name: "Git", depth: "core" }] },
];

const LAUNCH = 0.22; // pull distance (px) → launch velocity (px per step)
const HP_BASE = 70; // hit points before area is factored in
const HIT_FLOOR = 4; // relative speed a contact must beat to do any damage
const HIT_CAP = 70; // damage ceiling per contact, so nothing one-shots
const HIT_SCALE = 1.2; // relative speed × mass → damage
const TOTAL_BOXES = STRUCTURE.reduce((sum, l) => sum + l.items.length, 0);

type Slot = {
  label: string;
  depth: Depth;
  x: number;
  y: number;
  w: number;
  h: number;
  vertical?: boolean;
};
type Box = { body: MBody; slot: Slot; hp: number; maxHp: number; broken?: boolean };
type Dot = { x: number; y: number; hx: number; hy: number; vx: number; vy: number };
type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  va: number;
  s: number;
  life: number;
};

function formatTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}m ${s}s`;
}

function triggerCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.6 },
    zIndex: 100,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Left & right bursts
  confetti({
    particleCount: 70,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.65 },
    colors: ["#cff44a", "#f2f1ee", "#8d8d88", "#38bdf8", "#f43f5e"],
    zIndex: 100,
  });
  confetti({
    particleCount: 70,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.65 },
    colors: ["#cff44a", "#f2f1ee", "#8d8d88", "#38bdf8", "#f43f5e"],
    zIndex: 100,
  });

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#cff44a", "#ffffff", "#8d8d88"],
  });
  fire(0.2, {
    spread: 60,
    colors: ["#cff44a", "#a3e635", "#f2f1ee"],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#cff44a", "#38bdf8", "#f43f5e", "#fbbf24"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ["#cff44a", "#ffffff"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#cff44a", "#4ade80", "#60a5fa"],
  });
}

/**
 * The hero, which is also a toy.
 *
 * Background: a dot field that shoves away from the pointer.
 * Foreground: my stack as a pyramid of labelled boxes, and a slingshot on the
 * left. Drag the ball back, let go, knock the tower down. Matter.js runs the
 * physics; the drawing is ours so the boxes render in the theme's colours and
 * carry the same depth coding as the stack section.
 *
 * Under prefers-reduced-motion none of it runs — the tower renders as a static
 * stack and the slingshot is hidden.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [down, setDown] = useState(0);
  const [armed, setArmed] = useState(false); // has the user fired/pulled once
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Live timer tick
  useEffect(() => {
    if (!startedAt || completed) return;
    const interval = setInterval(() => {
      setLiveSeconds((Date.now() - startedAt) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [startedAt, completed]);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    completedRef.current = false;
    setStartedAt(null);
    setLiveSeconds(0);
    setCompleted(false);
    setElapsedTime(null);
    setArmed(false);
    setDown(0);
    resetRef.current();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let cleanupMatter: (() => void) | null = null;

    // Read a face off a probe — canvas `font` cannot take a CSS var, and
    // --font-mono nests another var so getPropertyValue won't resolve it.
    function familyOf(className: string, fallback: string) {
      const probe = document.createElement("span");
      probe.className = className;
      probe.style.cssText = "position:absolute;visibility:hidden";
      document.body.appendChild(probe);
      const f = getComputedStyle(probe).fontFamily || fallback;
      probe.remove();
      return f;
    }

    const theme = { ink: "", muted: "", accent: "", line: "", lineStrong: "", bg: "" };
    function readTheme() {
      const s = getComputedStyle(document.documentElement);
      theme.ink = s.getPropertyValue("--ink").trim() || "#f2f1ee";
      theme.muted = s.getPropertyValue("--ink-muted").trim() || "#8d8d88";
      theme.accent = s.getPropertyValue("--accent").trim() || "#cff44a";
      theme.line = s.getPropertyValue("--line").trim() || "#232326";
      theme.lineStrong = s.getPropertyValue("--line-strong").trim() || theme.line;
      theme.bg = s.getPropertyValue("--bg").trim() || "#0b0b0c";
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
    let mono = familyOf("mono-label", "monospace");
    let boxH = 40;
    let labelSize = 13;
    let ground = 0;
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
      // Six rows have to fit above the ground with room for the sling.
      boxH = Math.max(24, Math.min(h * 0.13, 56, w / 11));
      labelSize = Math.max(9, Math.round(boxH * 0.34));
      ground = h - Math.round(boxH * 0.7);

      // Background dot field, on a grid, skipping the sling corner.
      const step = 34;
      dots = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          dots.push({ x, y, hx: x, hy: y, vx: 0, vy: 0 });
        }
      }
    }

    /**
     * One pass at the structure: pillars evenly across the current bay, planks
     * splitting it into equal segments (each plank's ends land over pillars),
     * bay narrowing a little each storey so the thing tapers as it rises.
     */
    function buildStoreys(size: number): Slot[] {
      ctx!.font = `${size}px ${mono}`;
      const bar = size * 1.7; // pillar width, and plank thickness
      const pad = size * 1.2;
      // Storeys spawn exactly touching: a gap means every floor free-falls onto
      // the one below at load and the impacts alone can topple the thing.
      const seam = 0;
      let span = Math.min(w * 0.44, 34 * size);
      const cx = Math.min(w * 0.52, w - span / 2 - 20);
      let y = ground;
      const slots: Slot[] = [];

      for (const level of STRUCTURE) {
        const n = level.items.length;

        if (level.kind === "pillar") {
          // Uniform height per storey, or the planks above would see-saw.
          const hgt =
            Math.max(...level.items.map((i) => ctx!.measureText(i.name).width)) + pad;
          level.items.forEach((it, i) => {
            const x =
              n === 1
                ? cx
                : cx - span / 2 + bar / 2 + (i * (span - bar)) / (n - 1);
            slots.push({
              label: it.name,
              depth: it.depth,
              x,
              y: y - hgt / 2,
              w: bar,
              h: hgt,
              vertical: true,
            });
          });
          y -= hgt + seam;
          continue;
        }

        if (level.kind === "plank") {
          const seg = span / n;
          level.items.forEach((it, i) => {
            slots.push({
              label: it.name,
              depth: it.depth,
              x: cx - span / 2 + seg * (i + 0.5),
              y: y - bar / 2,
              w: seg - (n > 1 ? size * 0.5 : 0),
              h: bar,
            });
          });
          y -= bar + seam;
          span *= 0.82; // the next storey stands in from the edges
          continue;
        }

        // block: loose pieces sitting on the deck, sized to their label.
        const ws = level.items.map((i) => ctx!.measureText(i.name).width + pad);
        const total = ws.reduce((a, b) => a + b, 0) + (n - 1) * size * 0.4;
        let x = cx - total / 2;
        level.items.forEach((it, i) => {
          slots.push({
            label: it.name,
            depth: it.depth,
            x: x + ws[i] / 2,
            y: y - bar / 2,
            w: ws[i],
            h: bar,
          });
          x += ws[i] + size * 0.4;
        });
        y -= bar + seam;
      }
      return slots;
    }

    /** Same structure, shrunk until it clears the top of the canvas. */
    function layoutTower(): Slot[] {
      const margin = 12;
      let size = labelSize;
      let slots = buildStoreys(size);
      for (let pass = 0; pass < 3; pass++) {
        const top = Math.min(...slots.map((s) => s.y - s.h / 2));
        if (top >= margin || size <= 8) break;
        size *= Math.max(0.55, (ground - margin) / (ground - top));
        slots = buildStoreys(size);
      }
      labelSize = size;
      return slots;
    }

    /** Same depth coding as the stack section: core / working / familiar. */
    function boxColors(d: Depth) {
      if (d === "core") return { border: theme.accent, text: theme.accent };
      if (d === "familiar") return { border: theme.line, text: theme.muted };
      return { border: theme.lineStrong, text: theme.ink };
    }

    /** wear: 0 = pristine, 1 = about to give out. */
    function drawBox(slot: Slot, x: number, y: number, angle: number, wear = 0) {
      const c = boxColors(slot.depth);
      const r = Math.min(6, slot.h * 0.18);
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);
      ctx!.globalAlpha = 1 - wear * 0.4;
      ctx!.beginPath();
      ctx!.roundRect(-slot.w / 2, -slot.h / 2, slot.w, slot.h, r);
      // Opaque, so the dot field doesn't read through the tower.
      ctx!.fillStyle = theme.bg;
      ctx!.fill();
      ctx!.strokeStyle = c.border;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      ctx!.fillStyle = c.text;
      ctx!.font = `${labelSize}px ${mono}`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      // Pillars read bottom-to-top, the way a column label should.
      if (slot.vertical) ctx!.rotate(-Math.PI / 2);
      ctx!.fillText(slot.label, 0, 0);
      ctx!.restore();

      // Cracks: fixed geometry per piece, so damage looks structural rather
      // than like noise that re-rolls every frame.
      if (wear > 0.25) {
        const hw = slot.w / 2;
        const hh = slot.h / 2;
        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(angle);
        ctx!.globalAlpha = Math.min(1, wear);
        ctx!.strokeStyle = c.border;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(-hw * 0.45, -hh);
        ctx!.lineTo(-hw * 0.12, hh * 0.15);
        ctx!.lineTo(-hw * 0.3, hh);
        if (wear > 0.6) {
          ctx!.moveTo(hw * 0.55, -hh);
          ctx!.lineTo(hw * 0.2, 0);
          ctx!.lineTo(hw * 0.6, hh);
        }
        ctx!.stroke();
        ctx!.restore();
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
        mono = familyOf("mono-label", "monospace");
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = theme.line;
        for (const d of dots) ctx.fillRect(d.x, d.y, 2, 2);
        for (const slot of layoutTower()) drawBox(slot, slot.x, slot.y, 0);
      };
      document.fonts.ready.then(() => {
        if (!cancelled) drawStatic();
      });
      drawStatic();
      window.addEventListener("resize", drawStatic);
      return () => {
        cancelled = true;
        themeObserver.disconnect();
        window.removeEventListener("resize", drawStatic);
      };
    }

    // ---- physics ------------------------------------------------------------
    import("matter-js").then((mod) => {
      if (cancelled) return;
      const { Engine, Bodies, Body, Composite, Events, Sleeping, Vector } = mod;

      const engine: MEngine = Engine.create();
      engine.gravity.y = 0.9;
      // Thin pillars carrying planks need a stiffer solve than the defaults,
      // or the structure shivers itself apart before anything hits it.
      engine.positionIterations = 12;
      engine.velocityIterations = 10;
      engine.constraintIterations = 4;
      // And once it has settled, let it sleep: a resting stack that keeps
      // getting integrated accumulates drift until a pillar walks out.
      engine.enableSleeping = true;

      const BALL = {
        // Heavier than a box, so any solid hit actually knocks it over.
        density: 0.006,
        restitution: 0.6,
        friction: 0.4,
        frictionAir: 0.0005,
      };

      let boxes: Box[] = [];
      const byBody = new Map<number, Box>(); // matter body id → piece
      let statics: MBody[] = [];
      let ball: MBody;
      let anchor = { x: 0, y: 0 };
      const shots: MBody[] = []; // balls already fired, oldest first
      const shards: Shard[] = []; // debris from boxes that hit the bottom
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
        mono = familyOf("mono-label", "monospace");
        Composite.clear(engine.world, false);

        anchor = { x: Math.max(104, w * 0.1), y: ground - boxH * 3.4 };

        // Floor for the tower and slingshot to rest on. No walls, so boxes can
        // fly or tumble freely outside the screen.
        statics = [
          Bodies.rectangle(w / 2, ground + 100, w, 200, {
            isStatic: true,
            friction: 1,
            frictionStatic: 2,
          }),
        ];
        Composite.add(engine.world, statics);

        boxes = layoutTower().map((slot) => ({
          body: Bodies.rectangle(slot.x, slot.y, slot.w, slot.h, {
            // Grippy and dead: pieces that slide or bounce at rest walk the
            // structure apart on their own.
            friction: 0.8,
            frictionStatic: 2,
            restitution: 0,
            slop: 0.02,
            // Light enough that a fast ball topples the tower, heavy enough
            // that it doesn't explode on contact.
            density: 0.0009,
            // Barely rounded — a real chamfer turns a pillar into a roller.
            chamfer: { radius: 2 },
          }),
          slot,
          // Bigger pieces take more punishment: a full-span plank should not
          // die as fast as a crown block.
          hp: HP_BASE + Math.min(50, (slot.w * slot.h) / 120),
          maxHp: HP_BASE + Math.min(50, (slot.w * slot.h) / 120),
        }));
        Composite.add(engine.world, boxes.map((b) => b.body));
        byBody.clear();
        for (const b of boxes) byBody.set(b.body.id, b);

        // Slingshot.
        ball = makeBall();
        Composite.add(engine.world, ball);
        shots.length = 0;
        shards.length = 0;
        setDown(0);
      }

      function reload() {
        ball = makeBall();
        Composite.add(engine.world, ball);
      }

      /**
       * Damage on impact, not on tilt. A contact hurts by how hard it lands —
       * relative speed × the lighter body's mass — so the ball chips pieces,
       * and a collapsing storey wounds whatever it falls on. Nothing counts as
       * knocked down until its hit points are gone.
       */
      Events.on(engine, "collisionStart", (evt) => {
        for (const pair of evt.pairs) {
          const a = byBody.get(pair.bodyA.id);
          const b = byBody.get(pair.bodyB.id);
          if (!a && !b) continue;

          const rel = Vector.magnitude(
            Vector.sub(pair.bodyA.velocity, pair.bodyB.velocity),
          );
          if (rel < HIT_FLOOR) continue;
          const mass = Math.min(pair.bodyA.mass, pair.bodyB.mass);
          const dmg = Math.min(HIT_CAP, (rel - HIT_FLOOR) * mass * HIT_SCALE);
          if (dmg < 3) continue;

          // Already-cracked pieces give way faster — up to double damage as
          // they approach failure, so the endgame isn't a grind.
          const hurt = (box: Box) => {
            box.hp -= dmg * (2 - box.hp / box.maxHp);
          };
          if (a) hurt(a);
          if (b) hurt(b);

          // Chips fly off the contact point on any solid hit.
          if (dmg > 12) {
            const p = pair.collision?.supports?.[0] ?? pair.bodyA.position;
            spawnShards(p.x, p.y, 5, 0.6);
          }
        }
      });

      build();
      resetRef.current = () => {
        build();
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

        // Start tracking time on first slingshot interaction
        if (!startTimeRef.current) {
          const now = Date.now();
          startTimeRef.current = now;
          setStartedAt(now);
          setArmed(true);
        }
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
        // The ball has been parked on the sling long enough for the engine to
        // put it to sleep, and a sleeping body ignores the velocity it is
        // handed — wake it or the shot never leaves the sling.
        Sleeping.set(ball, false);
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

      // ---- debris -----------------------------------------------------------
      function spawnShards(x: number, y: number, n = 16, scale = 1) {
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
          const sp = (3 + Math.random() * 8) * scale;
          shards.push({
            x,
            y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            a: Math.random() * Math.PI,
            va: (Math.random() - 0.5) * 0.4,
            s: boxH * (0.12 + Math.random() * 0.22) * scale,
            life: 1,
          });
        }
      }

      function drawShards() {
        for (let i = shards.length - 1; i >= 0; i--) {
          const s = shards[i];
          s.vy += 0.55;
          s.vx *= 0.99;
          s.x += s.vx;
          s.y += s.vy;
          s.a += s.va;
          s.life -= 0.018;
          if (s.life <= 0) {
            shards.splice(i, 1);
            continue;
          }
          ctx!.save();
          ctx!.globalAlpha = Math.min(1, s.life * 1.4);
          ctx!.translate(s.x, s.y);
          ctx!.rotate(s.a);
          ctx!.fillStyle = theme.accent;
          ctx!.fillRect(-s.s / 2, -s.s / 4, s.s, s.s * 0.5);
          ctx!.restore();
        }
        ctx!.globalAlpha = 1;
      }

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

        // The structure. Only pieces that have been destroyed outright count.
        let downNow = 0;
        for (const b of boxes) {
          if (b.broken) {
            downNow += 1;
            continue;
          }

          // Out of hit points, or fallen past the bottom of the screen — the
          // sides have no floor, so anything knocked clear keeps going and
          // shatters on arrival. The burst is pinned inside the frame.
          const fellOut = b.body.position.y > h + 40;
          if (b.hp <= 0 || fellOut) {
            Composite.remove(engine.world, b.body);
            byBody.delete(b.body.id);
            b.broken = true;
            spawnShards(
              Math.min(Math.max(b.body.position.x, 14), w - 14),
              fellOut ? h - 10 : b.body.position.y,
            );
            downNow += 1;
            continue;
          }

          if (
            b.body.position.x >= -b.slot.w &&
            b.body.position.x <= w + b.slot.w &&
            b.body.position.y >= -b.slot.w
          ) {
            drawBox(
              b.slot,
              b.body.position.x,
              b.body.position.y,
              b.body.angle,
              1 - b.hp / b.maxHp,
            );
          }
        }

        if (downNow !== knocked) {
          knocked = downNow;
          setDown(downNow);

          if (
            downNow === TOTAL_BOXES &&
            startTimeRef.current &&
            !completedRef.current
          ) {
            completedRef.current = true;
            const elapsed = Math.max(0.1, (Date.now() - startTimeRef.current) / 1000);
            setElapsedTime(elapsed);
            setCompleted(true);
            triggerCelebrationConfetti();
          }
        }

        drawShards();

        // Spent shots, then the one on the sling.
        for (let i = shots.length - 1; i >= 0; i--) {
          const s = shots[i];
          const lost =
            s.position.y > h + 300 ||
            s.position.y < -900 ||
            s.position.x < -200 ||
            s.position.x > w + 200;
          // Spent balls have to clear off: left lying around they become
          // bumpers that stop the next shot before it reaches the tower.
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
      className="relative h-[70vh] min-h-[460px] w-full sm:h-[78vh] sm:min-h-[580px]"
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

      {/* Celebration overlay when the whole tower is down */}
      {completed && elapsedTime !== null ? (
        <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-xl border border-accent/40 bg-bg/95 p-6 text-center shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-2xl">
            🎉
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Stack Demolished!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            Congratulations! You wasted{" "}
            <span className="font-mono font-bold text-accent">
              {formatTime(elapsedTime)}
            </span>{" "}
            reducing all {TOTAL_BOXES} pieces of my stack to rubble.
          </p>
          <p className="mt-1 font-mono text-xs text-muted/70">
            Time well spent. Or not.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-accent-ink font-semibold transition-opacity hover:opacity-90 cursor-pointer shadow-md"
            >
              Stack it back up
            </button>
          </div>
        </div>
      ) : null}

      {/* The canvas is full-bleed; the labels still line up with the page. */}
      {!reduced ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl items-end justify-between gap-4 px-5 sm:px-8">
          <p className="mono-label max-w-[55%]">
            {!armed ? (
              "← pull the ball back, let go"
            ) : completed ? (
              <span className="text-accent font-semibold">
                ★ Stack flattened in {formatTime(elapsedTime ?? 0)}!
              </span>
            ) : (
              <span>
                {down} / {TOTAL_BOXES} pieces destroyed
                {liveSeconds > 0 ? (
                  <span className="ml-2 text-muted">
                    ⏱ {liveSeconds.toFixed(1)}s
                  </span>
                ) : null}
              </span>
            )}
          </p>
          {down > 0 && !completed ? (
            <button
              type="button"
              onClick={reset}
              className="mono-label pointer-events-auto border border-line bg-bg px-3 py-1.5 transition-colors hover:border-accent hover:text-accent cursor-pointer"
            >
              Stack it back up
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
