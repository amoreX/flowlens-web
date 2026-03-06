import { Zap, GitBranch, Activity, Code2, Navigation, Terminal, LayoutPanelLeft, Server, Columns2 } from "lucide-react";

const features = [
  { icon: <Zap size={20} />, title: "Automatic Trace Grouping", desc: "Every click or submit creates a new trace. All subsequent events inherit that trace ID and appear grouped in the timeline." },
  { icon: <GitBranch size={20} />, title: "Full-Stack Correlation", desc: "The X-FlowLens-Trace-Id header propagates from frontend to backend. Both sides appear in the same trace." },
  { icon: <Activity size={20} />, title: "React State Detection", desc: "Detects useState and useReducer changes by walking the fiber tree at multiple delay intervals." },
  { icon: <Code2 size={20} />, title: "Source Code Panel", desc: "Dual-mode source viewer with live hit accumulation and focus mode for full call stack visualization." },
  { icon: <Navigation size={20} />, title: "Flow Navigation", desc: "Step through events with arrow navigation. Each step shows the exact file and line of origin." },
  { icon: <Terminal size={20} />, title: "Console Panel", desc: "Real-time console output filterable by level: log, warn, error, info, debug." },
  { icon: <LayoutPanelLeft size={20} />, title: "Event Inspector", desc: "Full JSON view of any event — payloads, stack traces, metadata, and source context." },
  { icon: <Server size={20} />, title: "Backend Span Phases", desc: "Each backend span splits into request, handler, and response phases with per-phase source stacks." },
  { icon: <Columns2 size={20} />, title: "Resizable Split View", desc: "Drag dividers to adjust all panel ratios. Default 55/45 split, clamped between 20% and 80%." },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="mx-auto max-w-[1300px] px-4 pt-24 pb-8">
        <p className="section-label mb-4">capabilities</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Features</h1>
        <p className="text-text-muted max-w-xl leading-relaxed">
          Everything FlowLens captures and how it presents your application&apos;s behavior.
        </p>
      </section>

      <section className="mx-auto max-w-[1300px] px-4 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="border border-border p-5 rounded-lg card-hover cursor-default">
              <div className="text-accent mb-3">{f.icon}</div>
              <h2 className="font-serif font-semibold text-base mb-2">{f.title}</h2>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="section-label mb-4">see it in action</p>
          <h2 className="font-serif text-2xl font-bold mb-8">How FlowLens Works</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-border rounded-lg overflow-hidden card-hover cursor-default">
              <div className="aspect-video bg-bg-card flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-accent/30 flex items-center justify-center mx-auto mb-3">
                    <div className="w-0 h-0 border-l-[10px] border-l-accent border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                  </div>
                  <p className="text-text-muted text-sm">Embedded Mode Demo</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-sm">Paste a URL and trace</h3>
                <p className="text-text-muted text-xs mt-1">Zero-config debugging with auto-injected instrumentation.</p>
              </div>
            </div>
            <div className="border border-border rounded-lg overflow-hidden card-hover cursor-default">
              <div className="aspect-video bg-bg-card flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-accent/30 flex items-center justify-center mx-auto mb-3">
                    <div className="w-0 h-0 border-l-[10px] border-l-accent border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                  </div>
                  <p className="text-text-muted text-sm">SDK Mode Demo</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-sm">Full-stack SDK instrumentation</h3>
                <p className="text-text-muted text-xs mt-1">Frontend + backend traces correlated by traceId.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
