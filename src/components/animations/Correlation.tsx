"use client";
import { useFrameCycle, AnimContainer, MiniWindow, EventDot, PulseDot, type EvType } from "./shared";

/* Service Chain → Unified Timeline — trace propagates through services, unified timeline assembles */
export function Correlation8() {
  const f = useFrameCycle(16, 650);

  const services = [
    { name: "Browser", sub: "React App", at: 0 },
    { name: "API Gateway", sub: "Express", at: 3 },
    { name: "Auth Service", sub: "Node.js", at: 6 },
    { name: "Database", sub: "PostgreSQL", at: 8 },
  ];

  const events: { label: string; type: EvType; src: "fe" | "be"; t: number; detail: string; at: number }[] = [
    { label: "click · submit",       type: "click",    src: "fe", t: 0,   detail: "New traceId generated: a7f3",          at: 1 },
    { label: "fetch POST /api",      type: "fetch",    src: "fe", t: 12,  detail: "X-FlowLens-Trace-Id header injected",  at: 2 },
    { label: "ingress · POST /api",  type: "backend",  src: "be", t: 18,  detail: "Middleware extracts traceId",          at: 4 },
    { label: "auth.verify(token)",    type: "backend",  src: "be", t: 32,  detail: "Auth span created with traceId",       at: 7 },
    { label: "db.query(SELECT...)",   type: "backend",  src: "be", t: 48,  detail: "Database span linked to trace",        at: 9 },
    { label: "egress · 200 OK",      type: "backend",  src: "be", t: 82,  detail: "Egress span emitted to FlowLens",      at: 10 },
    { label: "response · 200 · 89ms", type: "response", src: "fe", t: 88,  detail: "Response linked to same traceId",     at: 12 },
    { label: "state · data updated",  type: "state",    src: "fe", t: 91,  detail: "All events visible in one timeline",   at: 13 },
  ];

  const visibleEvents = events.filter(e => f >= e.at);
  const latestEvent = visibleEvents[visibleEvents.length - 1];

  return (
    <AnimContainer>
      <div className="flex gap-3 h-full">
        <div className="w-[34%] shrink-0 flex flex-col">
          <div className="text-[8px] font-mono text-text-dim mb-1.5">Service Chain</div>
          <div className="space-y-0.5 flex-1">
            {services.map((s, i) => {
              const active = f >= s.at && (i === services.length - 1 || f < services[i + 1].at);
              const done = i < services.length - 1 && f >= services[i + 1].at;
              const pending = f < s.at;
              return (
                <div key={i}>
                  <div className={`flex items-center justify-between px-2 py-1.5 rounded-md border transition-all duration-400 ${
                    active ? "border-accent/50 bg-accent/8" :
                    done ? "border-green-500/20 bg-green-500/3" :
                    "border-border/40 bg-bg-card/20"
                  }`}>
                    <div>
                      <div className={`text-[9px] font-mono ${active ? "text-accent" : done ? "text-green-400" : "text-text-muted/50"}`}>{s.name}</div>
                      <div className="text-[7px] font-mono text-text-dim">{s.sub}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {active && <PulseDot active />}
                      {done && <span className="text-green-400 text-[8px]">✓</span>}
                      {active && (
                        <span className="text-[6px] font-mono text-accent bg-accent/10 px-1 py-px rounded">a7f3</span>
                      )}
                      {pending && <span className="text-[7px] text-text-dim/30">—</span>}
                    </div>
                  </div>
                  {i < services.length - 1 && (
                    <div className="flex justify-center">
                      <svg width="10" height="12" viewBox="0 0 10 12" className={`transition-colors duration-300 ${done ? "text-green-400/40" : active ? "text-accent/40" : "text-border/30"}`}>
                        <path d="M5 0L5 8M2 6L5 10L8 6" stroke="currentColor" fill="none" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {f >= 1 && (
            <div className="mt-2 px-2 py-1 rounded bg-accent/5 border border-accent/10 text-center">
              <div className="text-[7px] font-mono text-text-dim">X-FlowLens-Trace-Id</div>
              <div className="text-[8px] font-mono text-accent">a7f3b2c1</div>
            </div>
          )}
        </div>

        <MiniWindow title="Trace #a7f3 — unified" className="flex-1">
          <div className="min-h-[340px] overflow-hidden">
            {visibleEvents.length === 0 && (
              <div className="flex items-center justify-center h-32 text-[9px] text-text-dim font-mono">
                waiting for events...
              </div>
            )}
            {visibleEvents.map((e, i) => {
              const isLatest = e === latestEvent;
              return (
                <div key={i} className={`px-2 py-1 border-b transition-all duration-300 ${
                  isLatest ? "bg-accent/5 border-accent/15" : "border-border/30"
                } ${i === visibleEvents.length - 1 ? "animate-[fadeIn_0.25s_ease]" : ""}`}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-mono shrink-0 ${
                      isLatest ? "bg-accent text-bg" : "bg-green-500/15 text-green-400"
                    }`}>
                      {isLatest ? i + 1 : "✓"}
                    </div>
                    <span className={`text-[7px] font-mono px-1 rounded shrink-0 ${
                      e.src === "fe" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
                    }`}>
                      {e.src === "fe" ? "FE" : "BE"}
                    </span>
                    <span className={`text-[8px] font-mono flex-1 min-w-0 truncate ${isLatest ? "text-text" : "text-text-muted/70"}`}>
                      {e.label}
                    </span>
                    <span className="text-[7px] font-mono text-text-dim shrink-0">{e.t}ms</span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${isLatest ? "max-h-5 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}>
                    <div className="text-[7px] font-mono text-accent/70 pl-5">{e.detail}</div>
                  </div>
                </div>
              );
            })}
            {f >= 14 && (
              <div className="px-2 py-2 text-center animate-[fadeIn_0.4s_ease]">
                <div className="text-[8px] font-mono text-green-400/80">8 events · 4 services · 1 trace</div>
              </div>
            )}
          </div>
        </MiniWindow>
      </div>
    </AnimContainer>
  );
}
