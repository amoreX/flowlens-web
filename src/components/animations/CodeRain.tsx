"use client";

import { useRef, useEffect } from "react";

/**
 * Animation 3: Code Rain
 * Matrix-style columns of event names/code fall from top,
 * converge toward a central aperture, get absorbed. The aperture
 * glows brighter as it catches more traces.
 */
export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let time = 0;
    let absorbed = 0;

    const words = [
      "click", "fetch", "POST", "GET", "200", "404", "state",
      "error", "warn", "log", "mount", "render", "effect",
      "trace", "span", "req", "res", "hook", "fiber", "DOM",
      "XHR", "ws://", ":9230", ":9229", "uuid", "async",
    ];

    interface Drop {
      x: number; y: number; speed: number; text: string;
      opacity: number; attracted: boolean; targetX: number;
    }

    const drops: Drop[] = [];
    const columns = 16;

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

      // Spawn drops
      if (Math.random() < 0.2) {
        const col = Math.floor(Math.random() * columns);
        const colW = w / columns;
        drops.push({
          x: col * colW + colW / 2,
          y: -10,
          speed: 0.8 + Math.random() * 1.2,
          text: words[Math.floor(Math.random() * words.length)],
          opacity: 0.3 + Math.random() * 0.5,
          attracted: false,
          targetX: col * colW + colW / 2,
        });
      }

      // Draw drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];

        // When past halfway, start attracting to center
        if (d.y > cy * 0.5 && !d.attracted) {
          d.attracted = true;
        }

        if (d.attracted) {
          const dx = cx - d.x;
          const dy = cy - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 20) {
            d.x += (dx / dist) * d.speed * 1.5;
            d.y += (dy / dist) * d.speed * 1.5;
          } else {
            // Absorbed
            absorbed = Math.min(1, absorbed + 0.03);
            drops.splice(i, 1);
            continue;
          }
          d.opacity -= 0.003;
        } else {
          d.y += d.speed;
        }

        if (d.y > h + 10 || d.opacity <= 0) {
          drops.splice(i, 1);
          continue;
        }

        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = d.attracted
          ? `rgba(59, 130, 246, ${d.opacity})`
          : `rgba(100, 116, 139, ${d.opacity * 0.6})`;
        ctx.fillText(d.text, d.x, d.y);
      }

      // Absorbed glow fades over time
      absorbed = Math.max(0, absorbed - 0.005);

      // Center aperture
      ctx.save();
      ctx.translate(cx, cy);

      // Absorption glow
      const glowR = 50 + absorbed * 20;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      grad.addColorStop(0, `rgba(59, 130, 246, ${0.1 + absorbed * 0.2})`);
      grad.addColorStop(0.5, `rgba(59, 130, 246, ${0.03 + absorbed * 0.05})`);
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Aperture
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
