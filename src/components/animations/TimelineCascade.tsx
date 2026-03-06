"use client";

import { useRef, useEffect } from "react";

/**
 * Animation 5: Timeline Cascade
 * Events appear as small cards that slide horizontally, get caught by
 * the aperture, and organized into trace groups. Visualizes the actual
 * trace grouping concept with a horizontal timeline aesthetic.
 */
export function TimelineCascade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let time = 0;

    const eventTypes = [
      { label: "click", color: "59, 130, 246" },
      { label: "fetch", color: "96, 165, 250" },
      { label: "response", color: "96, 165, 250" },
      { label: "setState", color: "74, 222, 128" },
      { label: "console.log", color: "167, 139, 250" },
      { label: "error", color: "248, 113, 113" },
      { label: "POST /api", color: "251, 191, 36" },
      { label: "render", color: "74, 222, 128" },
    ];

    interface Event {
      x: number; y: number; type: typeof eventTypes[0];
      speed: number; opacity: number; phase: "fly" | "group" | "fade";
      groupY: number; groupX: number; traceIdx: number;
    }

    interface TraceGroup {
      y: number; events: number; opacity: number; label: string;
    }

    const events: Event[] = [];
    const traces: TraceGroup[] = [];
    let traceCounter = 0;

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

      ctx.clearRect(0, 0, w, h);
      time += 0.016;

      // Spawn events from left
      if (Math.random() < 0.08) {
        const et = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const isNewTrace = et.label === "click" || Math.random() < 0.15;
        if (isNewTrace) traceCounter++;

        events.push({
          x: -30,
          y: cy + (Math.random() - 0.5) * 120,
          type: et,
          speed: 1.5 + Math.random() * 1,
          opacity: 0.8,
          phase: "fly",
          groupY: 0,
          groupX: 0,
          traceIdx: traceCounter,
        });
      }

      // Draw timeline line
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.strokeStyle = "rgba(30, 41, 59, 0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tick marks
      for (let tx = 50; tx < w; tx += 60) {
        ctx.beginPath();
        ctx.moveTo(tx, cy - 4);
        ctx.lineTo(tx, cy + 4);
        ctx.strokeStyle = "rgba(30, 41, 59, 0.3)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Center aperture (processing zone)
      ctx.save();
      ctx.translate(cx, cy);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
      grad.addColorStop(0, "rgba(59, 130, 246, 0.08)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(time * 0.5);
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 7, Math.sin(a) * 7);
        ctx.lineTo(Math.cos(a + 0.8) * 18, Math.sin(a + 0.8) * 18);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 + Math.sin(time * 2 + i) * 0.12})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // Process events
      for (let i = events.length - 1; i >= 0; i--) {
        const e = events[i];

        if (e.phase === "fly") {
          e.x += e.speed;
          // When reaching center zone
          if (e.x > cx - 5) {
            e.phase = "group";
            // Assign to a trace output position
            const traceY = (e.traceIdx % 5) * 28 - 56;
            e.groupY = cy + traceY;
            e.groupX = cx + 60 + Math.random() * (w * 0.3);
          }
        } else if (e.phase === "group") {
          // Animate to group position
          e.x += (e.groupX - e.x) * 0.06;
          e.y += (e.groupY - e.y) * 0.06;
          if (Math.abs(e.x - e.groupX) < 2) {
            e.phase = "fade";
          }
        } else {
          e.opacity -= 0.004;
          e.x += 0.3;
        }

        if (e.opacity <= 0 || e.x > w + 50) {
          events.splice(i, 1);
          continue;
        }

        // Draw event card
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.font = "9px 'JetBrains Mono', monospace";
        const tw = ctx.measureText(e.type.label).width + 10;

        ctx.fillStyle = `rgba(20, 24, 39, ${e.opacity * 0.9})`;
        ctx.strokeStyle = `rgba(${e.type.color}, ${e.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -8, tw, 16, 3);
        ctx.fill();
        ctx.stroke();

        // Colored left bar
        ctx.fillStyle = `rgba(${e.type.color}, ${e.opacity * 0.7})`;
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -8, 2, 16, [3, 0, 0, 3]);
        ctx.fill();

        ctx.fillStyle = `rgba(${e.type.color}, ${e.opacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(e.type.label, 1, 0);
        ctx.restore();
      }

      // Draw trace group labels on right
      const activeTraces = new Set(events.filter(e => e.phase !== "fly").map(e => e.traceIdx));
      activeTraces.forEach((idx) => {
        const traceY = (idx % 5) * 28 - 56;
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        ctx.textAlign = "left";
        ctx.fillText(`trace:${String(idx).padStart(3, "0")}`, cx + 55, cy + traceY - 12);
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
