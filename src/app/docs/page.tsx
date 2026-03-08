import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Sidebar } from "@/components/Sidebar";
import { ArrowRight } from "lucide-react";

const sidebarItems = [
  { id: "getting-started", label: "Getting Started" },
  { id: "architecture", label: "Architecture" },
  { id: "data-flow", label: "Data Flow" },
  { id: "event-types", label: "Event Types" },
  { id: "element-inspector", label: "Element Inspector" },
  { id: "backend-tracing", label: "Backend Tracing" },
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
              <p className="text-text-muted">This builds the instrumentation bundle first, then starts Electron in dev mode with hot reload.</p>
              <p>Once running, paste your app&apos;s URL (e.g. <code className="text-secondary">http://localhost:3000</code>) into the onboarding screen. FlowLens loads your app in an embedded browser and auto-injects instrumentation — zero frontend code changes required.</p>
            </div>
          </section>

          <section id="architecture">
            <h2 className="font-serif text-xl font-bold mb-6">Architecture</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>FlowLens has three Electron processes:</p>
              <div className="border border-border p-5 rounded-lg space-y-3 text-text-muted">
                <div><strong className="text-text">Main process</strong> — Owns the TraceCorrelationEngine (500-trace LRU), source file fetcher, backend span collector (HTTP on :9229), WebSocket server (:9230 for event ingestion), and IPC handler registry.</div>
                <div><strong className="text-text">Target view</strong> — Sandboxed WebContentsView that loads the user&apos;s URL. Auto-injects the instrumentation bundle on page load and supports element inspection.</div>
                <div><strong className="text-text">Renderer</strong> — React UI showing timeline, source code panel, console, and inspector. Subscribes to live event stream from main.</div>
              </div>
            </div>
          </section>

          <section id="data-flow">
            <h2 className="font-serif text-xl font-bold mb-6">Data Flow</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <CodeBlock language="text" code={`Embedded page (auto-injected)  ──WS :9230──▶  ws-server.ts  ──┐\n                                                              ├──▶ trace-engine ──▶ renderer\n@nihal/flowlens-node           ──HTTP :9229─▶  span-collector ─┘`} />
              <p className="text-text-muted">Both frontend events and backend spans are correlated by <code className="text-secondary">traceId</code>, which is propagated via the <code className="text-secondary">X-FlowLens-Trace-Id</code> header injected into all outgoing fetch/XHR requests.</p>
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

          <section id="element-inspector">
            <h2 className="font-serif text-xl font-bold mb-6">Element Inspector</h2>
            <div className="space-y-4 text-sm leading-relaxed text-text-muted">
              <p>Click the <strong className="text-text">Inspect</strong> button in the target toolbar to activate the element inspector. Hover over any element in the embedded page to see:</p>
              <ul className="list-none space-y-2">
                <li><span className="text-accent mr-2">&bull;</span> Tag name, classes, and dimensions</li>
                <li><span className="text-accent mr-2">&bull;</span> React component name (if applicable)</li>
                <li><span className="text-accent mr-2">&bull;</span> Source file location of the component</li>
              </ul>
              <p>Click an element to navigate directly to its component&apos;s source file in the source code panel.</p>
            </div>
          </section>

          <section id="backend-tracing">
            <h2 className="font-serif text-xl font-bold mb-6">Backend Tracing</h2>
            <div className="space-y-4 text-sm leading-relaxed text-text-muted">
              <p>Install <code className="text-secondary">@nihal/flowlens-node</code> in your backend to correlate server-side spans with frontend traces. The middleware reads the <code className="text-secondary">X-FlowLens-Trace-Id</code> header and reports spans back to FlowLens.</p>
              <CodeBlock language="bash" code="npm install @nihal/flowlens-node" />
              <p>CORS must allow the trace header for cross-origin requests:</p>
              <CodeBlock language="typescript" code={`import cors from 'cors'\nimport { flowlens } from '@nihal/flowlens-node'\n\napp.use(cors({\n  origin: true,\n  allowedHeaders: ['Content-Type', 'X-FlowLens-Trace-Id']\n}))\napp.use(flowlens({ serviceName: 'my-api' }))`} />
              <p>Each backend span appears as three events in the timeline: <strong className="text-text">ingress</strong>, <strong className="text-text">route-handler</strong>, and <strong className="text-text">egress</strong>. Zero overhead when the trace header is absent.</p>
            </div>
          </section>

          <section id="quick-setup">
            <h2 className="font-serif text-xl font-bold mb-6">Quick Setup</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <ol className="list-none space-y-3 text-text-muted">
                <li><span className="text-accent mr-2">1.</span> Start FlowLens desktop: <code className="text-secondary">npm run dev</code></li>
                <li><span className="text-accent mr-2">2.</span> Paste your frontend URL (e.g. <code className="text-secondary">http://localhost:3000</code>) — instrumentation is injected automatically</li>
                <li><span className="text-accent mr-2">3.</span> (Optional) Backend: install <code className="text-secondary">@nihal/flowlens-node</code>, attach middleware with CORS headers</li>
                <li><span className="text-accent mr-2">4.</span> Use your app — traces appear with frontend + backend events correlated</li>
              </ol>
            </div>
          </section>

          <section id="sdk-reference">
            <h2 className="font-serif text-xl font-bold mb-6">SDK Reference</h2>
            <Link href="/sdk" className="border border-border p-5 rounded-lg card-hover flex items-center justify-between cursor-pointer">
              <div>
                <h3 className="font-serif font-semibold text-sm">@nihal/flowlens-node</h3>
                <p className="text-text-muted text-xs mt-1">Backend span collection SDK — Express, Fastify, and raw HTTP adapters</p>
              </div>
              <ArrowRight size={16} className="text-accent" />
            </Link>
          </section>
        </article>
      </div>
    </div>
  );
}
