"use client";
import { useFrameCycle, AnimContainer, MiniWindow, CodeLine, EventDot, type EvType } from "./shared";

/* Event-to-Line — events list linked to highlighted source lines */
export function SourceMapping1() {
  const f = useFrameCycle(8, 900);
  const events = [
    { type: "click" as EvType, label: "click · button", line: 14, at: 0 },
    { type: "fetch" as EvType, label: "fetch · /api/data", line: 18, at: 2 },
    { type: "state" as EvType, label: "setState", line: 23, at: 4 },
    { type: "error" as EvType, label: "TypeError", line: 27, at: 6 },
  ];
  const activeEvent = events.findLast(e => f >= e.at);
  const code = [
    { num: 12, code: "function App() {" },
    { num: 13, code: "  const [data, setData] = useState(null);" },
    { num: 14, code: "  const handleClick = () => {" },
    { num: 15, code: "    setLoading(true);" },
    { num: 16, code: "    fetch('/api/data')" },
    { num: 17, code: "      .then(r => r.json())" },
    { num: 18, code: "      .then(d => setData(d))" },
    { num: 19, code: "      .catch(e => {" },
    { num: 20, code: "        console.error(e);" },
    { num: 21, code: "        setError(e.message);" },
    { num: 22, code: "      });" },
    { num: 23, code: "    setData(newData);" },
    { num: 24, code: "  };" },
    { num: 25, code: "" },
    { num: 26, code: "  return (" },
    { num: 27, code: "    <div>{data.name}</div>" },
    { num: 28, code: "  );" },
    { num: 29, code: "}" },
  ];
  return (
    <AnimContainer>
      <div className="flex gap-3 h-full">
        <div className="w-32 shrink-0 space-y-1.5">
          <div className="text-[8px] font-mono text-text-dim mb-1">Events</div>
          {events.map((e, i) => (
            <div key={i} className={`flex items-center gap-1 transition-all duration-300 ${f >= e.at ? "opacity-100" : "opacity-30"}`}>
              <EventDot type={e.type} size={5} />
              <span className={`text-[8px] font-mono ${activeEvent === e ? "text-accent" : "text-text-muted"}`}>{e.label}</span>
              {activeEvent === e && (
                <svg width="8" height="6" className="text-accent ml-auto shrink-0" viewBox="0 0 8 6">
                  <path d="M0 3H6M4 1L7 3L4 5" stroke="currentColor" fill="none" strokeWidth="1" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <MiniWindow title="src/App.tsx" className="flex-1">
          <div className="py-1 min-h-[340px]">
            {code.map((line, i) => (
              <CodeLine key={i} num={line.num} code={line.code}
                highlighted={activeEvent ? line.num === activeEvent.line : false}
                error={activeEvent?.type === "error" && line.num === activeEvent.line}
                hitCount={events.filter(e => e.line === line.num && f >= e.at).length || undefined} />
            ))}
          </div>
        </MiniWindow>
      </div>
    </AnimContainer>
  );
}
