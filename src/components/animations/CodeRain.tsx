"use client";

import { useRef, useEffect } from "react";

type Platform = "all" | "react" | "node";

const platformData: Record<Platform, {
  jargon: string[];
  events: { label: string; color: string }[];
}> = {
  all: {
    jargon: [
      "onClick", "fetch()", "setState", "console.log", "XHR", "error",
      "useReducer", "dispatch", "render()", "response", "trace.id",
      "req.headers", "DOM", "fiber", "mount", "unmount", "effect",
      "promise", "async", "await", "hook[0]", "state", "props",
      "event.target", "ws.send()", "HTTP 200", "POST /api",
    ],
    events: [
      { label: "click", color: "59, 130, 246" },
      { label: "fetch", color: "96, 165, 250" },
      { label: "response", color: "96, 165, 250" },
      { label: "setState", color: "74, 222, 128" },
      { label: "console.log", color: "167, 139, 250" },
      { label: "error", color: "248, 113, 113" },
      { label: "POST /api", color: "251, 191, 36" },
      { label: "render", color: "74, 222, 128" },
      { label: "useEffect", color: "167, 139, 250" },
      { label: "XHR", color: "96, 165, 250" },
      { label: "mount", color: "74, 222, 128" },
      { label: "HTTP 200", color: "59, 130, 246" },
    ],
  },
  react: {
    jargon: [
      "useState", "useEffect", "useRef", "useMemo", "useCallback",
      "useReducer", "useContext", "setState", "forceUpdate",
      "render()", "re-render", "fiber", "reconciler", "virtual DOM",
      "JSX", "props", "children", "key={id}", "React.memo",
      "Suspense", "lazy()", "ErrorBoundary", "portal",
      "onClick", "onChange", "onSubmit", "event.target",
      "console.log", "console.warn", "console.error",
      "component", "mount", "unmount", "cleanup",
    ],
    events: [
      { label: "useState", color: "74, 222, 128" },
      { label: "useEffect", color: "167, 139, 250" },
      { label: "onClick", color: "59, 130, 246" },
      { label: "render", color: "74, 222, 128" },
      { label: "setState", color: "74, 222, 128" },
      { label: "re-render", color: "251, 191, 36" },
      { label: "console.log", color: "167, 139, 250" },
      { label: "error", color: "248, 113, 113" },
      { label: "onSubmit", color: "59, 130, 246" },
      { label: "mount", color: "74, 222, 128" },
      { label: "unmount", color: "248, 113, 113" },
      { label: "useRef", color: "96, 165, 250" },
    ],
  },
  node: {
    jargon: [
      "app.get()", "app.post()", "router.use()", "middleware",
      "req.body", "req.params", "req.headers", "res.json()",
      "res.status()", "next()", "express()", "fastify",
      "process.env", "cors()", "helmet()", "rate-limit",
      "db.query()", "prisma.find()", "mongoose.save()",
      "jwt.verify()", "bcrypt.hash()", "auth()",
      "try/catch", "throw Error", "500", "404", "200",
      "async/await", "Promise.all", "EventEmitter",
      "fs.readFile", "stream.pipe", "Buffer",
    ],
    events: [
      { label: "GET /api", color: "59, 130, 246" },
      { label: "POST /api", color: "251, 191, 36" },
      { label: "middleware", color: "167, 139, 250" },
      { label: "db.query", color: "96, 165, 250" },
      { label: "res.json()", color: "74, 222, 128" },
      { label: "auth()", color: "251, 191, 36" },
      { label: "500 error", color: "248, 113, 113" },
      { label: "req.body", color: "96, 165, 250" },
      { label: "next()", color: "167, 139, 250" },
      { label: "jwt.verify", color: "74, 222, 128" },
      { label: "404", color: "248, 113, 113" },
      { label: "200 OK", color: "59, 130, 246" },
    ],
  },
};

/**
 * Animation: Code Rain
 * Raw jargon text rains from top, gets attracted into center aperture,
 * absorbed, then emitted out the bottom as styled event cards.
 * Platform prop swaps the jargon and event types.
 */
export function CodeRain({ platform = "all", delay = 0 }: { platform?: Platform; delay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const platformRef = useRef(platform);
  platformRef.current = platform;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let time = 0;

    // Read accent color from CSS variable for aperture rendering
    function getAccentRGB(): string {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();
      // Parse hex to r,g,b
      if (raw.startsWith("#")) {
        const hex = raw.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }
      return "59, 130, 246";
    }
    function isLightMode(): boolean {
      return document.documentElement.getAttribute("data-theme") === "light";
    }
    let accentRGB = getAccentRGB();
    let light = isLightMode();
    const themeObserver = new MutationObserver(() => { accentRGB = getAccentRGB(); light = isLightMode(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    interface Incoming {
      x: number;
      y: number;
      speed: number;
      text: string;
      opacity: number;
      attracted: boolean;
    }

    interface Outgoing {
      x: number;
      y: number;
      speed: number;
      type: { label: string; color: string };
      opacity: number;
      driftX: number;
    }

    const incoming: Incoming[] = [];
    const outgoing: Outgoing[] = [];
    const inColumns = 14;
    const outColumns = 10;
    let absorbed = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas) return;
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      const cx = w / 2;
      const cy = h / 2;

      const data = platformData[platformRef.current];

      ctx.clearRect(0, 0, w, h);
      time += 0.016;

      // --- Spawn incoming jargon from top ---
      if (Math.random() < 0.15) {
        const col = Math.floor(Math.random() * inColumns);
        const colW = w / inColumns;
        incoming.push({
          x: col * colW + colW / 2,
          y: -10,
          speed: 0.7 + Math.random() * 1.0,
          text: data.jargon[Math.floor(Math.random() * data.jargon.length)],
          opacity: 0.3 + Math.random() * 0.4,
          attracted: false,
        });
      }

      // --- Update & draw incoming ---
      for (let i = incoming.length - 1; i >= 0; i--) {
        const d = incoming[i];

        if (d.y > cy * 0.45 && !d.attracted) {
          d.attracted = true;
        }

        if (d.attracted) {
          const dx = cx - d.x;
          const dy = cy - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 22) {
            d.x += (dx / dist) * d.speed * 1.8;
            d.y += (dy / dist) * d.speed * 1.8;
          } else {
            absorbed = Math.min(1, absorbed + 0.04);
            const col = Math.floor(Math.random() * outColumns);
            const colW = w / outColumns;
            const et = data.events[Math.floor(Math.random() * data.events.length)];
            outgoing.push({
              x: cx,
              y: cy + 24,
              speed: 0.5 + Math.random() * 0.7,
              type: et,
              opacity: 0,
              driftX: col * colW + colW / 2,
            });
            incoming.splice(i, 1);
            continue;
          }
          d.opacity -= 0.002;
        } else {
          d.y += d.speed;
        }

        if (d.y > h + 10 || d.opacity <= 0) {
          incoming.splice(i, 1);
          continue;
        }

        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = d.attracted
          ? `rgba(${accentRGB}, ${light ? d.opacity * 1.2 : d.opacity})`
          : light
            ? `rgba(51, 65, 85, ${d.opacity * 0.9})`
            : `rgba(100, 116, 139, ${d.opacity * 0.7})`;
        ctx.fillText(d.text, d.x, d.y);
      }

      // --- Update & draw outgoing cards ---
      for (let i = outgoing.length - 1; i >= 0; i--) {
        const d = outgoing[i];

        d.y += d.speed;
        d.x += (d.driftX - d.x) * 0.04;

        const fadeInEnd = cy + 90;
        const fadeOutStart = h - 60;
        if (d.y < fadeInEnd) {
          d.opacity = Math.min(0.85, d.opacity + 0.04);
        } else if (d.y > fadeOutStart) {
          d.opacity -= 0.012;
        } else {
          d.opacity = Math.min(0.85, d.opacity + 0.01);
        }

        if (d.y > h + 20 || d.opacity <= 0) {
          outgoing.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.font = "9px 'JetBrains Mono', monospace";
        const tw = ctx.measureText(d.type.label).width + 10;

        ctx.fillStyle = light
          ? `rgba(255, 255, 255, ${d.opacity * 0.9})`
          : `rgba(20, 24, 39, ${d.opacity * 0.9})`;
        ctx.strokeStyle = `rgba(${d.type.color}, ${light ? d.opacity * 0.8 : d.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -8, tw, 16, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(${d.type.color}, ${d.opacity * 0.7})`;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -8, 2, 16, [3, 0, 0, 3]);
        ctx.fill();

        ctx.fillStyle = `rgba(${d.type.color}, ${d.opacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(d.type.label, 1, 0);
        ctx.restore();
      }

      // --- Absorbed glow fades ---
      absorbed = Math.max(0, absorbed - 0.006);

      // --- Center aperture (matches AnimatedLogo SVG) ---
      ctx.save();
      ctx.translate(cx, cy);

      const lb = light ? 1.8 : 1; // light mode boost
      const glowR = 45 + absorbed * 15;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      grad.addColorStop(0, `rgba(${accentRGB}, ${(0.1 + absorbed * 0.15) * lb})`);
      grad.addColorStop(0.5, `rgba(${accentRGB}, ${(0.03 + absorbed * 0.05) * lb})`);
      grad.addColorStop(1, `rgba(${accentRGB}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();

      const s = 22 / 10;
      ctx.rotate(time * 0.4 + absorbed * 2);

      ctx.beginPath();
      ctx.arc(0, 0, 10 * s, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRGB}, ${(0.4 + absorbed * 0.4) * lb})`;
      ctx.lineWidth = light ? 2 : 1.5;
      ctx.stroke();

      const blades: [number, number, number, number][] = [
        [14.31 - 12, 8 - 12, 14.31 + 5.74 - 12, 8 + 9.94 - 12],
        [9.69 - 12, 8 - 12, 9.69 + 11.48 - 12, 8 - 12],
        [7.38 - 12, 12 - 12, 7.38 + 5.74 - 12, 12 - 9.94 - 12],
        [9.69 - 12, 16 - 12, 9.69 - 5.74 - 12, 16 - 9.94 - 12],
        [14.31 - 12, 16 - 12, 14.31 - 11.48 - 12, 16 - 12],
        [16.62 - 12, 12 - 12, 16.62 - 5.74 - 12, 12 + 9.94 - 12],
      ];
      const bladeAlpha = (0.3 + absorbed * 0.4) * lb;
      ctx.lineCap = "round";
      for (let i = 0; i < blades.length; i++) {
        const [x1, y1, x2, y2] = blades[i];
        ctx.beginPath();
        ctx.moveTo(x1 * s, y1 * s);
        ctx.lineTo(x2 * s, y2 * s);
        ctx.strokeStyle = `rgba(${accentRGB}, ${bladeAlpha + Math.sin(time * 3 + i) * 0.1})`;
        ctx.lineWidth = light ? 2 : 1.5;
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(draw);
    }

    const delayTimer = setTimeout(() => draw(), delay);
    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, [delay]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
