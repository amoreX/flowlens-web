"use client";

import { useRef, useEffect } from "react";

/**
 * Animation: Code Rain
 * Raw jargon text rains from top, gets attracted into center aperture,
 * absorbed, then emitted out the bottom as styled event cards.
 */
export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let time = 0;

    const jargon = [
      "onClick", "fetch()", "setState", "console.log", "XHR", "error",
      "useReducer", "dispatch", "render()", "response", "trace.id",
      "req.headers", "DOM", "fiber", "mount", "unmount", "effect",
      "promise", "async", "await", "hook[0]", "state", "props",
      "event.target", "ws.send()", "HTTP 200", "POST /api",
    ];

    const eventTypes = [
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
    ];

    // Incoming raw jargon falling from top toward aperture
    interface Incoming {
      x: number;
      y: number;
      speed: number;
      text: string;
      opacity: number;
      attracted: boolean;
    }

    // Outgoing styled cards emitted from aperture downward
    interface Outgoing {
      x: number;
      y: number;
      speed: number;
      type: typeof eventTypes[0];
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
          text: jargon[Math.floor(Math.random() * jargon.length)],
          opacity: 0.3 + Math.random() * 0.4,
          attracted: false,
        });
      }

      // --- Update & draw incoming ---
      for (let i = incoming.length - 1; i >= 0; i--) {
        const d = incoming[i];

        // Start attracting when close enough to aperture
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
            // Absorbed — spawn an outgoing card
            absorbed = Math.min(1, absorbed + 0.04);
            const col = Math.floor(Math.random() * outColumns);
            const colW = w / outColumns;
            const et = eventTypes[Math.floor(Math.random() * eventTypes.length)];
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

        // Draw raw jargon text
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = d.attracted
          ? `rgba(59, 130, 246, ${d.opacity})`
          : `rgba(100, 116, 139, ${d.opacity * 0.7})`;
        ctx.fillText(d.text, d.x, d.y);
      }

      // --- Update & draw outgoing cards ---
      for (let i = outgoing.length - 1; i >= 0; i--) {
        const d = outgoing[i];

        d.y += d.speed;
        d.x += (d.driftX - d.x) * 0.04;

        // Fade in then fade out near bottom
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

        // Draw styled event card
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.font = "9px 'JetBrains Mono', monospace";
        const tw = ctx.measureText(d.type.label).width + 10;

        ctx.fillStyle = `rgba(20, 24, 39, ${d.opacity * 0.9})`;
        ctx.strokeStyle = `rgba(${d.type.color}, ${d.opacity * 0.5})`;
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

      // --- Center aperture ---
      ctx.save();
      ctx.translate(cx, cy);

      const glowR = 45 + absorbed * 15;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      grad.addColorStop(0, `rgba(59, 130, 246, ${0.1 + absorbed * 0.15})`);
      grad.addColorStop(0.5, `rgba(59, 130, 246, ${0.03 + absorbed * 0.05})`);
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(time * 0.4 + absorbed * 2);
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 + absorbed * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
        ctx.lineTo(Math.cos(a + 0.8) * 22, Math.sin(a + 0.8) * 22);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + absorbed * 0.4 + Math.sin(time * 3 + i) * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

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
