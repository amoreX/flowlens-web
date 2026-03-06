"use client";
import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";
import { ArrowLeft, Globe, Server } from "lucide-react";

const tabs = [
  { id: "web", label: "Web SDK", icon: <Globe size={14} /> },
  { id: "node", label: "Node SDK", icon: <Server size={14} /> },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function SdkPage() {
  const [active, setActive] = useState<Tab>("web");

  return (
    <div className="mx-auto max-w-[1300px] px-4 pt-12 pb-12">
      <Link href="/docs" className="inline-flex items-center gap-1 text-text-muted text-xs hover:text-accent transition-colors mb-8 cursor-pointer">
        <ArrowLeft size={12} /> Back to docs
      </Link>
      <p className="section-label mb-4">sdk</p>
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">FlowLens SDKs</h1>
      <p className="text-text-muted leading-relaxed mb-10">
        Instrument your frontend with <code className="text-accent">@nihal/flowlens-web</code> and your backend with <code className="text-secondary">@nihal/flowlens-node</code>.
      </p>

      <div className="flex gap-1 mb-10 border border-border rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all cursor-pointer ${
              active === t.id ? "bg-accent text-white font-medium" : "text-text-muted hover:text-text"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {active === "web" && (
        <div className="space-y-14">
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Install</h2>
            <CodeBlock language="bash" code="npm install @nihal/flowlens-web" />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Quick Start</h2>
            <p className="text-sm text-text-muted mb-4">Import and initialize in your app entry point. Wrap in a dev check so it only runs during development.</p>
            <CodeBlock language="typescript" code={`import { init } from '@nihal/flowlens-web'\n\nif (import.meta.env.DEV) {\n  init()\n}`} />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-6">API</h2>
            <div className="space-y-4">
              {[
                { sig: "init(config?: FlowLensWebConfig): void", desc: "Initializes instrumentation. Monkey-patches DOM events, fetch, XHR, console, and error listeners." },
                { sig: "destroy(): void", desc: "Tears down all instrumentation patches and disconnects from the WebSocket server." },
                { sig: "isActive(): boolean", desc: "Returns whether FlowLens instrumentation is currently active." },
              ].map((a) => (
                <div key={a.sig} className="border border-border p-5 rounded-lg">
                  <code className="text-accent text-sm">{a.sig}</code>
                  <p className="text-text-muted text-sm mt-2">{a.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-6">Config</h2>
            <CodeBlock language="typescript" code={`interface FlowLensWebConfig {\n  endpoint?: string          // default: "ws://localhost:9230"\n  enabled?: boolean          // default: true\n  patchDOM?: boolean         // default: true\n  patchFetch?: boolean       // default: true\n  patchXHR?: boolean         // default: true\n  patchConsole?: boolean     // default: true\n  captureErrors?: boolean    // default: true\n  detectReactState?: boolean // default: true\n}`} />
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left"><th className="py-2 pr-4 text-text-muted font-normal">Option</th><th className="py-2 pr-4 text-text-muted font-normal">Default</th><th className="py-2 text-text-muted font-normal">Description</th></tr></thead>
                <tbody className="text-text-muted">
                  {[
                    ["endpoint", '"ws://localhost:9230"', "WebSocket server URL"],
                    ["enabled", "true", "Enable/disable all instrumentation"],
                    ["patchDOM", "true", "Capture click, submit, input, change, focus, blur"],
                    ["patchFetch", "true", "Intercept fetch requests and responses"],
                    ["patchXHR", "true", "Intercept XMLHttpRequest"],
                    ["patchConsole", "true", "Capture console.log, warn, error, info, debug"],
                    ["captureErrors", "true", "Capture window.onerror and unhandledrejection"],
                    ["detectReactState", "true", "Detect React useState/useReducer changes"],
                  ].map(([opt, def, desc]) => (
                    <tr key={opt} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4"><code className="text-accent">{opt}</code></td>
                      <td className="py-2 pr-4"><code className="text-secondary">{def}</code></td>
                      <td className="py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-6">Captures</h2>
            <div className="space-y-3 text-sm leading-relaxed text-text-muted">
              {[
                { t: "DOM Events", d: "Click, submit, input, change, focus, blur. Click and submit create a new trace ID." },
                { t: "Network", d: "Intercepts fetch and XMLHttpRequest. Captures request, response, and error events. Injects X-FlowLens-Trace-Id header." },
                { t: "Console", d: "Intercepts console.log, console.warn, console.error, console.info, and console.debug." },
                { t: "Errors", d: "Captures window.onerror and unhandledrejection with full stack traces." },
                { t: "React State", d: "Checks at [0, 40, 140]ms delays. Walks fiber tree comparing memoizedState on useState/useReducer hooks." },
              ].map((c) => (
                <div key={c.t} className="border border-border p-4 rounded-lg">
                  <h3 className="font-serif font-semibold text-text mb-1.5">{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {active === "node" && (
        <div className="space-y-14">
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Install</h2>
            <CodeBlock language="bash" code="npm install @nihal/flowlens-node" />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Express</h2>
            <p className="text-sm text-text-muted mb-4">Use <code className="text-secondary">flowlens()</code> middleware for Express-style applications.</p>
            <CodeBlock language="typescript" code={`import express from 'express'\nimport { flowlens } from '@nihal/flowlens-node'\n\nconst app = express()\n\napp.use(flowlens({\n  serviceName: 'my-api'\n}))\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: [] })\n})\n\napp.listen(3000)`} />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Fastify</h2>
            <p className="text-sm text-text-muted mb-4">Use <code className="text-secondary">flowlensFastify()</code> plugin for Fastify servers.</p>
            <CodeBlock language="typescript" code={`import Fastify from 'fastify'\nimport { flowlensFastify } from '@nihal/flowlens-node'\n\nconst app = Fastify()\n\napp.register(flowlensFastify, {\n  serviceName: 'my-api'\n})\n\napp.get('/api/users', async () => {\n  return { users: [] }\n})\n\napp.listen({ port: 3000 })`} />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Raw HTTP</h2>
            <p className="text-sm text-text-muted mb-4">Use <code className="text-secondary">wrapHandler()</code> for raw <code className="text-secondary">node:http</code> servers.</p>
            <CodeBlock language="typescript" code={`import { createServer } from 'node:http'\nimport { wrapHandler } from '@nihal/flowlens-node'\n\nconst handler = (req, res) => {\n  res.writeHead(200)\n  res.end('OK')\n}\n\nconst server = createServer(\n  wrapHandler(handler, { serviceName: 'my-api' })\n)\n\nserver.listen(3000)`} />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-6">Config</h2>
            <CodeBlock language="typescript" code={`interface FlowLensNodeConfig {\n  serviceName: string       // required\n  collectorUrl?: string     // default: "http://localhost:9229"\n  enabled?: boolean         // default: true\n  headerName?: string       // default: "x-flowlens-trace-id"\n}`} />
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left"><th className="py-2 pr-4 text-text-muted font-normal">Option</th><th className="py-2 pr-4 text-text-muted font-normal">Default</th><th className="py-2 text-text-muted font-normal">Description</th></tr></thead>
                <tbody className="text-text-muted">
                  <tr className="border-b border-border"><td className="py-2 pr-4"><code className="text-accent">serviceName</code></td><td className="py-2 pr-4"><span className="text-secondary">required</span></td><td className="py-2">Name identifying your service in traces</td></tr>
                  <tr className="border-b border-border"><td className="py-2 pr-4"><code className="text-accent">collectorUrl</code></td><td className="py-2 pr-4"><code className="text-secondary">&quot;http://localhost:9229&quot;</code></td><td className="py-2">FlowLens span collector endpoint</td></tr>
                  <tr className="border-b border-border"><td className="py-2 pr-4"><code className="text-accent">enabled</code></td><td className="py-2 pr-4"><code className="text-secondary">true</code></td><td className="py-2">Enable/disable span reporting</td></tr>
                  <tr><td className="py-2 pr-4"><code className="text-accent">headerName</code></td><td className="py-2 pr-4"><code className="text-secondary">&quot;x-flowlens-trace-id&quot;</code></td><td className="py-2">Header name for trace ID propagation</td></tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-6">How It Works</h2>
            <div className="space-y-3 text-sm text-text-muted">
              <p>When a request comes in:</p>
              <ol className="list-none space-y-2">
                <li><span className="text-accent mr-2">1.</span> Reads the <code className="text-secondary">X-FlowLens-Trace-Id</code> header.</li>
                <li><span className="text-accent mr-2">2.</span> If no trace ID, passes through with zero overhead.</li>
                <li><span className="text-accent mr-2">3.</span> Captures stacks at: <strong className="text-text">request</strong> (ingress), <strong className="text-text">handler</strong> (execution), <strong className="text-text">response</strong> (egress).</li>
                <li><span className="text-accent mr-2">4.</span> Sends the span payload fire-and-forget POST to the collector.</li>
              </ol>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold mb-6">Span Payload</h2>
            <CodeBlock language="typescript" code={`// Fields sent to the collector\n{\n  traceId: string\n  route: string\n  method: string\n  statusCode: number\n  duration: number\n  serviceName: string\n  timestamp: number\n  requestStack: string\n  handlerStack: string\n  responseStack: string\n}`} />
            <p className="text-xs text-text-muted mt-3">The collector splits each span into three <code className="text-secondary">backend-span</code> events with phases: request, handler, response.</p>
          </section>
        </div>
      )}
    </div>
  );
}
