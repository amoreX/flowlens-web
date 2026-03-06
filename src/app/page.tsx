import Link from "next/link";
import { ArrowRight, Zap, GitBranch, Activity, Code2, Navigation, Terminal } from "lucide-react";
import { HeroAnimation } from "@/components/HeroAnimation";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-[1100px] px-6 pt-20 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-stretch min-h-[520px]">
          <div className="flex flex-col justify-center">
            <p className="section-label mb-5">full-stack tracing</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-text-heading">
              See every trace.<br />
              <span className="text-accent">Debug any flow.</span>
            </h1>
            <p className="text-text-muted text-base max-w-md leading-relaxed mb-10">
              An Electron desktop tool that captures every UI event, network call, console log,
              and error — correlating frontend and backend in a unified trace timeline.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/docs"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-mono font-medium text-sm rounded-md hover:brightness-110 transition cursor-pointer">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="/features"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-text text-sm rounded-md hover:border-accent hover:text-accent transition cursor-pointer">
                View Features
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:flex-col md:h-full">
            <HeroAnimation />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20 border-t border-border">
        <p className="section-label mb-3">workflow</p>
        <h2 className="font-serif text-2xl font-bold mb-2">Three steps to full-stack visibility</h2>
        <p className="text-text-muted text-sm mb-10">No config needed. Just open, use, and debug.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: "01", title: "Open FlowLens", desc: "Launch the desktop app. Paste a URL for embedded mode, or click SDK Mode to instrument your own app." },
            { step: "02", title: "Use your app", desc: "Every click, network call, console log, error, and React state change is captured automatically." },
            { step: "03", title: "Debug the trace", desc: "Events grouped by interaction. Source code highlighted. Frontend and backend correlated in one timeline." },
          ].map((s) => (
            <div key={s.step} className="border border-border p-6 rounded-lg card-hover cursor-default">
              <span className="text-accent font-serif font-bold text-3xl">{s.step}</span>
              <h3 className="font-serif font-semibold text-lg mt-3 mb-2">{s.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20 border-t border-border">
        <p className="section-label mb-3">capabilities</p>
        <h2 className="font-serif text-2xl font-bold mb-10">Everything you need to trace full-stack behavior</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: <Zap size={18} />, title: "Auto Trace Grouping", desc: "Every click or submit starts a new trace. Subsequent events are grouped automatically." },
            { icon: <GitBranch size={18} />, title: "Full-Stack Correlation", desc: "X-FlowLens-Trace-Id header propagates from frontend to backend in the same timeline." },
            { icon: <Activity size={18} />, title: "React State Detection", desc: "Detects useState and useReducer changes by walking the React fiber tree." },
            { icon: <Code2 size={18} />, title: "Source Code Mapping", desc: "Stack-based line highlighting with source map support and 3-tier visual depth." },
            { icon: <Navigation size={18} />, title: "Flow Navigation", desc: "Step through events in a trace with arrow navigation to see each event's origin." },
            { icon: <Terminal size={18} />, title: "Console + Inspector", desc: "Filterable console panel and JSON inspector for full event details." },
          ].map((f) => (
            <div key={f.title} className="border border-border p-5 rounded-lg card-hover cursor-default">
              <div className="text-accent mb-3">{f.icon}</div>
              <h3 className="font-serif font-semibold mb-1.5">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20 border-t border-border">
        <p className="section-label mb-3">modes</p>
        <h2 className="font-serif text-2xl font-bold mb-10">Choose how you want to trace</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="border border-border p-6 rounded-lg card-hover cursor-default">
            <span className="text-[10px] text-accent uppercase tracking-widest font-mono">Embedded Mode</span>
            <h3 className="font-serif font-semibold text-lg mt-2 mb-3">Paste a URL</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              FlowLens loads your app in an embedded browser and auto-injects instrumentation. Zero code changes.
            </p>
          </div>
          <div className="border border-border p-6 rounded-lg card-hover cursor-default">
            <span className="text-[10px] text-secondary uppercase tracking-widest font-mono">SDK Mode</span>
            <h3 className="font-serif font-semibold text-lg mt-2 mb-3">Instrument your app</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Install <code className="text-secondary">@nihal/flowlens-web</code> and <code className="text-secondary">@nihal/flowlens-node</code>. Full control over what gets traced.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20 border-t border-border text-center">
        <h2 className="font-serif text-2xl font-bold mb-4">Ready to debug?</h2>
        <p className="text-text-muted text-sm mb-8">Get started in under a minute.</p>
        <Link href="/docs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-mono font-medium rounded-md hover:brightness-110 transition cursor-pointer">
          Read the Docs <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
