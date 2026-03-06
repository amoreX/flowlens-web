"use client";

import { useRef, useEffect } from "react";

/**
 * Animation 4: Flow Threads
 * Multiple colored threads representing different event types weave
 * from edges toward the center aperture, creating flowing curves.
 * Each thread type has its own color matching the FlowLens event colors.
 */
export function FlowThreads() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let time = 0;

    const threadColors = [
      { r: 59, g: 130, b: 246 },  // blue - DOM
      { r: 96, g: 165, b: 250 },  // light blue - network
      { r: 167, g: 139, b: 250 }, // purple - console
      { r: 248, g: 113, b: 113 }, // red - error
      { r: 74, g: 222, b: 128 },  // green - state
      { r: 251, g: 191, b: 36 },  // amber - backend
    ];

    interface Thread {
      points: { x: number; y: number }[];
      color: typeof threadColors[0];
      progress: number;
      speed: number;
      startAngle: number;
      amplitude: number;
      frequency: number;
      opacity: number;
    }

    const threads: Thread[] = [];

    function spawnThread() {
      const angle = Math.random() * Math.PI * 2;
      threads.push({
        points: [],
        color: threadColors[Math.floor(Math.random() * threadColors.length)],
        progress: 0,
        speed: 0.005 + Math.random() * 0.005,
        startAngle: angle,
        amplitude: 20 + Math.random() * 40,
        frequency: 2 + Math.random() * 4,
        opacity: 0.4 + Math.random() * 0.3,
      });
    }

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

      if (Math.random() < 0.04) spawnThread();

      // Draw threads
      for (let i = threads.length - 1; i >= 0; i--) {
        const t = threads[i];
        t.progress += t.speed;

        if (t.progress > 1.2) {
          threads.splice(i, 1);
          continue;
        }

        // Generate thread path from edge to center
        const startR = 200;
        const steps = 60;
        t.points = [];

        const drawProgress = Math.min(1, t.progress);
        const drawnSteps = Math.floor(drawProgress * steps);

        for (let s = 0; s <= drawnSteps; s++) {
          const frac = s / steps;
          const r = startR * (1 - frac) + 24 * frac;
          const baseAngle = t.startAngle + frac * 0.5;
          const wobble = Math.sin(frac * t.frequency + time) * t.amplitude * (1 - frac);
          const perpAngle = baseAngle + Math.PI / 2;
          const x = cx + Math.cos(baseAngle) * r + Math.cos(perpAngle) * wobble;
          const y = cy + Math.sin(baseAngle) * r + Math.sin(perpAngle) * wobble;
          t.points.push({ x, y });
        }

        if (t.points.length > 1) {
          // Fade out after reaching center
          const fadeFactor = t.progress > 1 ? Math.max(0, 1 - (t.progress - 1) * 5) : 1;

          ctx.beginPath();
          ctx.moveTo(t.points[0].x, t.points[0].y);
          for (let p = 1; p < t.points.length; p++) {
            ctx.lineTo(t.points[p].x, t.points[p].y);
          }
          ctx.strokeStyle = `rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${t.opacity * fadeFactor})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Bright head
          if (drawProgress < 1) {
            const last = t.points[t.points.length - 1];
            ctx.beginPath();
            ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${0.9 * fadeFactor})`;
            ctx.fill();
          }
        }
      }

      // Center aperture
      ctx.save();
      ctx.translate(cx, cy);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
      grad.addColorStop(0, "rgba(59, 130, 246, 0.12)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(time * 0.25);
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
        ctx.lineTo(Math.cos(a + 0.8) * 22, Math.sin(a + 0.8) * 22);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(time * 2 + i) * 0.15})`;
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
