"use client";
import { useFrameCycle, AnimContainer, MiniWindow, ConsoleLine } from "./shared";

/* Console + State Changes — left: console log stream, right: React state changes */
export function ConsoleInspector8() {
  const f = useFrameCycle(16, 550);

  const consoleLogs: { level: "log" | "warn" | "error" | "info"; text: string; at: number }[] = [
    { level: "log",   text: "App mounted",                  at: 0 },
    { level: "info",  text: "Fetching user data...",         at: 1 },
    { level: "log",   text: "GET /api/user → 200 (48ms)",   at: 3 },
    { level: "warn",  text: "Deprecated: componentWillMount", at: 5 },
    { level: "log",   text: "Submitting form...",            at: 7 },
    { level: "log",   text: "POST /api/todos → 201 (92ms)", at: 9 },
    { level: "error", text: "WebSocket disconnected",        at: 11 },
    { level: "info",  text: "Reconnecting in 3s...",         at: 12 },
    { level: "log",   text: "WebSocket: reconnected",        at: 14 },
  ];

  const stateChanges: { comp: string; prev: string; next: string; at: number }[] = [
    { comp: "App",      prev: "loading: true",   next: "loading: false",           at: 2 },
    { comp: "App",      prev: "user: null",      next: 'user: { name: "Alice" }',  at: 4 },
    { comp: "TodoList", prev: "todos: []",       next: 'todos: [{ text: "..." }]', at: 6 },
    { comp: "Form",     prev: 'input: "Buy..."',  next: 'input: ""',              at: 8 },
    { comp: "TodoList", prev: "todos: [1 item]", next: "todos: [2 items]",         at: 10 },
    { comp: "App",      prev: "connected: true", next: "connected: false",         at: 11 },
    { comp: "App",      prev: "connected: false", next: "connected: true",         at: 15 },
  ];

  const visibleLogs = consoleLogs.filter(l => f >= l.at);
  const visibleStates = stateChanges.filter(s => f >= s.at);
  const latestLog = visibleLogs[visibleLogs.length - 1];
  const latestState = visibleStates[visibleStates.length - 1];

  return (
    <AnimContainer>
      <div className="flex gap-3 flex-1 min-h-0">
        <MiniWindow title="Console" className="flex-1">
          <div className="h-full overflow-auto">
            <div className="flex gap-2.5 px-2.5 py-1.5 border-b border-border/50 text-[9px] font-mono">
              <span className="text-text-muted">{visibleLogs.filter(l => l.level === "log").length} log</span>
              <span className="text-amber-500">{visibleLogs.filter(l => l.level === "warn").length} warn</span>
              <span className="text-red-500">{visibleLogs.filter(l => l.level === "error").length} err</span>
              <span className="text-blue-500">{visibleLogs.filter(l => l.level === "info").length} info</span>
            </div>
            {visibleLogs.map((log, i) => {
              const isLatest = log === latestLog;
              return (
                <div key={i} className={isLatest ? "animate-[fadeIn_0.25s_ease]" : ""}>
                  <ConsoleLine level={log.level} text={log.text} />
                </div>
              );
            })}
            {visibleLogs.length === 0 && (
              <div className="flex items-center justify-center h-20 text-[10px] text-text-dim font-mono">
                waiting for output...
              </div>
            )}
          </div>
        </MiniWindow>

        <MiniWindow title="State Changes" className="flex-1">
          <div className="h-full overflow-auto">
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/50">
              <span className="text-[9px] font-mono text-text-dim">React state</span>
              <span className="text-[9px] font-mono text-green-500">{visibleStates.length} changes</span>
            </div>
            {visibleStates.map((s, i) => {
              const isLatest = s === latestState;
              return (
                <div key={i} className={`px-2.5 py-2 border-b border-border/30 transition-all duration-300 ${
                  isLatest ? "bg-green-500/5 animate-[fadeIn_0.25s_ease]" : ""
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isLatest ? "bg-green-500" : "bg-text-dim/40"}`} />
                    <span className={`text-[11px] font-mono font-medium ${isLatest ? "text-green-500" : "text-text-muted"}`}>{s.comp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono pl-4">
                    <span className="text-red-500/50 max-w-[110px] truncate">{s.prev}</span>
                    <span className="text-text-dim">→</span>
                    <span className="text-green-500 max-w-[110px] truncate">{s.next}</span>
                  </div>
                </div>
              );
            })}
            {visibleStates.length === 0 && (
              <div className="flex items-center justify-center h-20 text-[10px] text-text-dim font-mono">
                no state changes yet
              </div>
            )}
          </div>
        </MiniWindow>
      </div>
    </AnimContainer>
  );
}
