import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Sidebar } from "@/components/Sidebar";
import { ArrowRight } from "lucide-react";

const sidebarItems = [
  { id: "getting-started", label: "Getting Started" },
  { id: "architecture", label: "Architecture" },
  { id: "data-flow", label: "Data Flow" },
  { id: "event-types", label: "Event Types" },
  { id: "modes", label: "Modes" },
  { id: "quick-setup", label: "Quick Setup" },
  { id: "sdk-reference", label: "SDK Reference" },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-[1300px] px-4 pt-12 pb-12">
      <p className="section-label mb-4">documentation</p>
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-text-muted leading-relaxed mb-12">
        Everything you need to get FlowLens running and tracing your application.
      </p>

      <div className="flex gap-12">
        <Sidebar items={sidebarItems} />

        <article className="flex-1 min-w-0 space-y-16">
          <section id="getting-started">
            <h2 className="font-serif text-xl font-bold mb-6">Getting Started</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Install dependencies and start the development server:</p>
              <CodeBlock language="bash" code={`npm install\nnpm run dev`} />
              <p className="text-text-muted">This builds the web SDK bundle first, then starts Electron in dev mode with hot reload.</p>
              <p>Once running, you have two options:</p>
              <ul className="list-none space-y-2 text-text-muted">
                <li><span className="text-accent mr-2">1.</span> <strong className="text-text">Paste a URL</strong> — FlowLens loads your app in an embedded browser and auto-injects instrumentation.</li>
                <li><span className="text-accent mr-2">2.</span> <strong className="text-text">Click SDK Mode</strong> — Instrument your own app with the web and node packages.</li>
              </ul>
            </div>
          </section>

          <section id="architecture">
            <h2 className="font-serif text-xl font-bold mb-6">Architecture</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>FlowLens has three Electron processes:</p>
              <div className="border border-border p-5 rounded-lg space-y-3 text-text-muted">
                <div><strong className="text-text">Main process</strong> — Owns the TraceCorrelationEngine (500-trace LRU), source file fetcher, backend span collector (HTTP on :9229), WebSocket server (:9230 for SDK mode), and IPC handler registry.</div>
                <div><strong className="text-text">Target view</strong> — Sandboxed WebContentsView that loads the user&apos;s URL. Injects the browser bundle from <code className="text-secondary">@nihal/flowlens-web</code> on page load.</div>
                <div><strong className="text-text">Renderer</strong> — React UI showing timeline, source code panel, console, and inspector. Subscribes to live event stream from main.</div>
              </div>
            </div>
          </section>

          <section id="data-flow">
            <h2 className="font-serif text-xl font-bold mb-6">Data Flow</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <CodeBlock language="text" code={`@nihal/flowlens-web  ──WS :9230──▶  ws-server.ts  ──┐\n                                                 ├──▶ trace-engine ──▶ renderer\n@nihal/flowlens-node ──HTTP :9229─▶  span-collector ─┘`} />
              <p className="text-text-muted">Both frontend events and backend spans are correlated by <code className="text-secondary">traceId</code>, which is propagated via the <code className="text-secondary">X-FlowLens-Trace-Id</code> header.</p>
            </div>
          </section>

          <section id="event-types">
            <h2 className="font-serif text-xl font-bold mb-6">Event Types</h2>
            <div className="space-y-1 text-sm">
              {[
                ["dom", "Click, submit, input, change, focus, blur events"],
                ["network-request", "Outgoing fetch and XHR requests"],
                ["network-response", "Completed responses with body preview"],
                ["network-error", "Failed network calls"],
                ["console", "console.log, warn, error, info, debug"],
                ["error", "Runtime errors and unhandled rejections"],
                ["state-change", "React useState/useReducer mutations"],
                ["backend-span", "Server-side request/handler/response phases"],
              ].map(([type, desc]) => (
                <div key={type} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                  <code className="text-accent text-xs shrink-0 min-w-[140px]">{type}</code>
                  <span className="text-text-muted">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="modes">
            <h2 className="font-serif text-xl font-bold mb-6">Modes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 pr-4 text-text-muted font-normal">Topic</th>
                    <th className="py-3 pr-4 text-accent font-normal">Embedded</th>
                    <th className="py-3 text-secondary font-normal">SDK</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  <tr className="border-b border-border"><td className="py-3 pr-4 text-text">Frontend</td><td className="py-3 pr-4">Auto-injected browser bundle</td><td className="py-3">You call <code className="text-secondary">init()</code></td></tr>
                  <tr className="border-b border-border"><td className="py-3 pr-4 text-text">Backend</td><td className="py-3 pr-4">Optional manual integration</td><td className="py-3"><code className="text-secondary">@nihal/flowlens-node</code> middleware</td></tr>
                  <tr className="border-b border-border"><td className="py-3 pr-4 text-text">Layout</td><td className="py-3 pr-4">Split view with embedded page</td><td className="py-3">Full-width tracing UI</td></tr>
                  <tr><td className="py-3 pr-4 text-text">Transport</td><td className="py-3 pr-4">WS + IPC in desktop app</td><td className="py-3">WS (web) + HTTP (node)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="quick-setup">
            <h2 className="font-serif text-xl font-bold mb-6">Quick Setup</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <ol className="list-none space-y-3 text-text-muted">
                <li><span className="text-accent mr-2">1.</span> Start FlowLens desktop: <code className="text-secondary">npm run dev</code></li>
                <li><span className="text-accent mr-2">2.</span> Frontend: install <code className="text-secondary">@nihal/flowlens-web</code>, call <code className="text-secondary">init()</code> in dev</li>
                <li><span className="text-accent mr-2">3.</span> Backend: install <code className="text-secondary">@nihal/flowlens-node</code>, attach middleware</li>
                <li><span className="text-accent mr-2">4.</span> In FlowLens onboarding, click <strong className="text-text">SDK Mode</strong></li>
                <li><span className="text-accent mr-2">5.</span> Use your app — traces appear with frontend + backend events correlated</li>
              </ol>
            </div>
          </section>

          <section id="sdk-reference">
            <h2 className="font-serif text-xl font-bold mb-6">SDK Reference</h2>
            <Link href="/sdk" className="border border-border p-5 rounded-lg card-hover flex items-center justify-between cursor-pointer">
              <div>
                <h3 className="font-serif font-semibold text-sm">FlowLens SDKs</h3>
                <p className="text-text-muted text-xs mt-1">@nihal/flowlens-web (frontend) &amp; @nihal/flowlens-node (backend)</p>
              </div>
              <ArrowRight size={16} className="text-accent" />
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
