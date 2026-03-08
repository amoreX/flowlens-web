"use client";
import { useEffect, useState, type ReactNode } from "react";

/* ── cycle hook ── */
export function useFrameCycle(totalFrames: number, ms: number) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % totalFrames), ms);
    return () => clearInterval(id);
  }, [totalFrames, ms]);
  return frame;
}

/* ── cursor ── */
export function Cursor({ x, y, clicking }: { x: number; y: number; clicking?: boolean }) {
  return (
    <div className="absolute z-50 pointer-events-none transition-all duration-500 ease-in-out"
      style={{ left: x, top: y }}>
      <svg width="16" height="20" viewBox="0 0 14 18" fill="none">
        <path d="M1 1L1 14L4.5 10.5L7.5 17L9.5 16L6.5 9.5L11 9.5L1 1Z"
          fill="white" stroke="#1e293b" strokeWidth="1" />
      </svg>
      {clicking && (
        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-accent/40 animate-ping" />
      )}
    </div>
  );
}

/* ── mini window chrome ── */
export function MiniWindow({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-md border border-border overflow-hidden flex flex-col ${className || ""}`}>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-elevated/80 border-b border-border shrink-0">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
        </div>
        <span className="text-[10px] font-mono text-text-dim ml-1">{title}</span>
      </div>
      <div className="bg-bg-card/80 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/* ── event colors ── */
const eventColors = {
  click:    { bg: "bg-blue-500/20",   text: "text-blue-500",   border: "border-blue-500/30",   dot: "bg-blue-500" },
  fetch:    { bg: "bg-amber-500/20",  text: "text-amber-500",  border: "border-amber-500/30",  dot: "bg-amber-500" },
  console:  { bg: "bg-purple-500/20", text: "text-purple-500", border: "border-purple-500/30", dot: "bg-purple-500" },
  error:    { bg: "bg-red-500/20",    text: "text-red-500",    border: "border-red-500/30",    dot: "bg-red-500" },
  state:    { bg: "bg-green-500/20",  text: "text-green-500",  border: "border-green-500/30",  dot: "bg-green-500" },
  response: { bg: "bg-cyan-500/20",   text: "text-cyan-500",   border: "border-cyan-500/30",   dot: "bg-cyan-500" },
  submit:   { bg: "bg-pink-500/20",   text: "text-pink-500",   border: "border-pink-500/30",   dot: "bg-pink-500" },
  backend:  { bg: "bg-orange-500/20", text: "text-orange-500", border: "border-orange-500/30", dot: "bg-orange-500" },
} as const;

export type EvType = keyof typeof eventColors;

export function EventBadge({ type, label, dim, small }: { type: EvType; label: string; dim?: boolean; small?: boolean }) {
  const c = eventColors[type];
  const sz = small ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-1 text-[10px]";
  return (
    <span className={`inline-flex items-center rounded font-mono border whitespace-nowrap transition-all duration-300 ${c.bg} ${c.text} ${c.border} ${dim ? "opacity-30" : "opacity-100"} ${sz}`}>
      {label}
    </span>
  );
}

export function EventDot({ type, size = 7 }: { type: EvType; size?: number }) {
  const c = eventColors[type];
  return <div className={`rounded-full ${c.dot} shrink-0`} style={{ width: size, height: size }} />;
}

/* ── code line ── */
export function CodeLine({ num, code, highlighted, hitCount, error }: {
  num: number; code: string; highlighted?: boolean; hitCount?: number; error?: boolean;
}) {
  return (
    <div className={`flex items-center text-[11px] font-mono leading-[20px] transition-all duration-300 ${highlighted ? (error ? "bg-red-500/15" : "bg-accent/15") : ""}`}>
      <span className="w-7 text-right text-text-dim/40 pr-1.5 select-none shrink-0">{num}</span>
      {hitCount !== undefined && (
        <span className="w-4 text-[9px] text-accent text-center shrink-0">{hitCount || ""}</span>
      )}
      <span className={`${highlighted ? (error ? "text-red-500" : "text-accent") : "text-text-muted/70"} whitespace-pre`}>{code}</span>
    </div>
  );
}

/* ── console entry ── */
export function ConsoleLine({ level, text, visible = true }: {
  level: "log" | "warn" | "error" | "info" | "debug"; text: string; visible?: boolean;
}) {
  const colors: Record<string, string> = {
    log: "text-text-muted border-border/50",
    warn: "text-amber-500 border-amber-500/20",
    error: "text-red-500 border-red-500/20",
    info: "text-blue-500 border-blue-500/20",
    debug: "text-purple-500 border-purple-500/20",
  };
  return (
    <div className={`flex items-center px-2.5 py-0.5 text-[10px] font-mono border-b transition-all duration-300 ${colors[level]} ${visible ? "opacity-100 max-h-8" : "opacity-0 max-h-0 overflow-hidden"}`}>
      <span className="w-9 text-[9px] uppercase opacity-50 shrink-0">{level}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

/* ── trace header ── */
export function TraceRow({ label, count, active, children }: {
  label: string; count: number; active?: boolean; children?: ReactNode;
}) {
  return (
    <div className={`transition-all duration-300 ${active ? "bg-accent/5" : ""}`}>
      <div className={`flex items-center justify-between px-2.5 py-1.5 text-[11px] font-mono border-b transition-colors duration-300 ${active ? "border-accent/20" : "border-border/50"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${active ? "bg-accent" : "bg-text-dim/40"}`} />
          <span className={`transition-colors duration-300 ${active ? "text-accent" : "text-text-muted"}`}>{label}</span>
        </div>
        <span className="text-text-dim/60">{count}</span>
      </div>
      {children && <div className="pl-6 pr-2.5 py-1">{children}</div>}
    </div>
  );
}

/* ── animation container ── */
export function AnimContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full rounded-lg border border-border bg-gradient-to-br from-bg-card/80 to-bg/80 p-4 relative overflow-hidden flex flex-col">
      {children}
    </div>
  );
}

/* ── flow arrow (horizontal) ── */
export function FlowArrow({ active, label, className }: { active?: boolean; label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      <div className={`flex-1 h-px transition-all duration-500 ${active ? "bg-accent" : "bg-border"}`} />
      {label && <span className={`text-[9px] font-mono transition-colors duration-300 ${active ? "text-accent" : "text-text-dim"}`}>{label}</span>}
      <svg width="8" height="10" viewBox="0 0 6 8" className={`transition-colors duration-300 ${active ? "text-accent" : "text-text-dim"}`}>
        <path d="M0 0L6 4L0 8Z" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ── pulsing dot ── */
export function PulseDot({ color = "bg-accent", active }: { color?: string; active?: boolean }) {
  return (
    <div className="relative">
      <div className={`w-2.5 h-2.5 rounded-full ${color} transition-opacity duration-300 ${active ? "opacity-100" : "opacity-30"}`} />
      {active && <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${color} animate-ping`} />}
    </div>
  );
}
