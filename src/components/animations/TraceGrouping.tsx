"use client";
import { useFrameCycle, AnimContainer, MiniWindow, Cursor, EventDot, TraceRow, type EvType } from "./shared";

/* Click + Auto-Group — cursor clicks buttons, events stream into grouped traces */
export function TraceGrouping8() {
  const f = useFrameCycle(18, 550);

  const stream: { type: EvType; label: string; trace: number; at: number }[] = [
    { type: "click",    label: "click · Submit",       trace: 0, at: 1 },
    { type: "fetch",    label: "POST /api/submit",     trace: 0, at: 2 },
    { type: "state",    label: "loading → true",       trace: 0, at: 3 },
    { type: "response", label: "200 OK · 89ms",        trace: 0, at: 4 },
    { type: "state",    label: "loading → false",      trace: 0, at: 5 },
    { type: "click",    label: "click · Load More",    trace: 1, at: 8 },
    { type: "fetch",    label: "GET /api/items?p=2",   trace: 1, at: 9 },
    { type: "response", label: "200 OK · 54ms",        trace: 1, at: 10 },
    { type: "state",    label: "items → [..., ...]",   trace: 1, at: 11 },
    { type: "click",    label: "click · Delete",       trace: 2, at: 13 },
    { type: "fetch",    label: "DELETE /api/items/3",   trace: 2, at: 14 },
    { type: "console",  label: "log: item removed",    trace: 2, at: 15 },
    { type: "response", label: "204 No Content",       trace: 2, at: 16 },
  ];

  const visibleEvents = stream.filter(e => f >= e.at);

  const traceGroups: Record<number, typeof stream> = {};
  for (const e of visibleEvents) {
    if (!traceGroups[e.trace]) traceGroups[e.trace] = [];
    traceGroups[e.trace].push(e);
  }

  const clickingSubmit   = f >= 0 && f <= 1;
  const clickingLoadMore = f >= 7 && f <= 8;
  const clickingDelete   = f >= 12 && f <= 13;
  const cursorY = f < 7 ? 48 : f < 12 ? 82 : 116;
  const isClicking = f === 1 || f === 8 || f === 13;
  const activeTrace = f < 7 ? 0 : f < 12 ? 1 : 2;

  return (
    <AnimContainer>
      <div className="flex gap-3 h-full">
        <MiniWindow title="localhost:3000" className="w-[38%] shrink-0">
          <div className="p-3 space-y-2 relative min-h-[340px]">
            <div className="text-[10px] font-mono text-text-muted mb-1">My App</div>
            <div className={`px-3 py-1.5 rounded text-[9px] font-mono border transition-all duration-200 ${
              clickingSubmit ? "bg-accent/20 border-accent text-accent scale-[0.97]" : "bg-bg-elevated border-border text-text-muted"
            }`}>Submit</div>
            <div className={`px-3 py-1.5 rounded text-[9px] font-mono border transition-all duration-200 ${
              clickingLoadMore ? "bg-accent/20 border-accent text-accent scale-[0.97]" : "bg-bg-elevated border-border text-text-muted"
            }`}>Load More</div>
            <div className={`px-3 py-1.5 rounded text-[9px] font-mono border transition-all duration-200 ${
              clickingDelete ? "bg-red-500/20 border-red-500/40 text-red-400 scale-[0.97]" : "bg-bg-elevated border-border text-text-muted"
            }`}>Delete</div>
            <Cursor x={40} y={cursorY} clicking={isClicking} />
          </div>
        </MiniWindow>

        <MiniWindow title="traces" className="flex-1">
          <div className="min-h-[340px]">
            {Object.keys(traceGroups).length === 0 && (
              <div className="flex items-center justify-center h-32 text-[9px] text-text-dim font-mono">
                waiting for events...
              </div>
            )}
            {Object.entries(traceGroups).map(([idx, events]) => {
              const traceNum = Number(idx);
              const isActive = traceNum === activeTrace;
              const traceLabels = ["click · Submit", "click · Load More", "click · Delete"];
              return (
                <TraceRow key={idx} label={`Trace #${traceNum + 1} · ${traceLabels[traceNum]}`}
                  count={events.length} active={isActive}>
                  <div className="space-y-0.5 py-0.5">
                    {events.map((e, j) => {
                      const isLatest = isActive && j === events.length - 1;
                      return (
                        <div key={j} className={`flex items-center gap-1.5 ${j === events.length - 1 ? "animate-[fadeIn_0.25s_ease]" : ""}`}>
                          <EventDot type={e.type} size={isLatest ? 6 : 4} />
                          <span className={`text-[8px] font-mono ${isLatest ? "text-text" : "text-text-muted/70"}`}>{e.label}</span>
                          {isLatest && <span className="text-[7px] text-accent font-mono ml-auto animate-pulse">new</span>}
                        </div>
                      );
                    })}
                  </div>
                </TraceRow>
              );
            })}
          </div>
        </MiniWindow>
      </div>
    </AnimContainer>
  );
}
