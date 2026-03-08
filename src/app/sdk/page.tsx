import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SdkPage() {
  return (
    <div className="mx-auto max-w-[1300px] px-4 pt-12 pb-12">
      <Link href="/docs" className="inline-flex items-center gap-1 text-text-muted text-xs hover:text-accent transition-colors mb-8 cursor-pointer">
        <ArrowLeft size={12} /> Back to docs
      </Link>
      <p className="section-label mb-4">sdk</p>
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">@nihal/flowlens-node</h1>
      <p className="text-text-muted leading-relaxed mb-10">
        Backend span collection SDK for correlating server-side events with frontend traces. Supports Express, Fastify, and raw <code className="text-secondary">node:http</code>.
      </p>

      <div className="space-y-14">
        <section>
          <h2 className="font-serif text-xl font-bold mb-4">Install</h2>
          <CodeBlock language="bash" code="npm install @nihal/flowlens-node" />
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-4">Express</h2>
          <p className="text-sm text-text-muted mb-4">Use <code className="text-secondary">flowlens()</code> middleware for Express-style applications. CORS must allow the <code className="text-secondary">X-FlowLens-Trace-Id</code> header.</p>
          <CodeBlock language="typescript" code={`import express from 'express'\nimport cors from 'cors'\nimport { flowlens } from '@nihal/flowlens-node'\n\nconst app = express()\n\napp.use(cors({\n  origin: true,\n  allowedHeaders: ['Content-Type', 'X-FlowLens-Trace-Id']\n}))\napp.use(flowlens({\n  serviceName: 'my-api'\n}))\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: [] })\n})\n\napp.listen(3000)`} />
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-4">Fastify</h2>
          <p className="text-sm text-text-muted mb-4">Use <code className="text-secondary">flowlensFastify()</code> plugin for Fastify servers.</p>
          <CodeBlock language="typescript" code={`import Fastify from 'fastify'\nimport { flowlensFastify } from '@nihal/flowlens-node'\n\nconst app = Fastify()\n\napp.register(flowlensFastify({\n  serviceName: 'my-api'\n}))\n\napp.get('/api/users', async () => {\n  return { users: [] }\n})\n\napp.listen({ port: 3000 })`} />
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
            <p>FlowLens auto-injects a <code className="text-secondary">X-FlowLens-Trace-Id</code> header into all outgoing fetch/XHR requests from the embedded page. When a request hits your backend:</p>
            <ol className="list-none space-y-2">
              <li><span className="text-accent mr-2">1.</span> Reads the <code className="text-secondary">X-FlowLens-Trace-Id</code> header.</li>
              <li><span className="text-accent mr-2">2.</span> If no trace ID, passes through with zero overhead.</li>
              <li><span className="text-accent mr-2">3.</span> Captures stacks at: <strong className="text-text">request</strong> (ingress), <strong className="text-text">handler</strong> (execution), <strong className="text-text">response</strong> (egress).</li>
              <li><span className="text-accent mr-2">4.</span> Sends the span payload fire-and-forget POST to the collector on <code className="text-secondary">:9229</code>.</li>
            </ol>
          </div>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-6">Span Payload</h2>
          <CodeBlock language="typescript" code={`// Fields sent to the collector\n{\n  traceId: string\n  route: string\n  method: string\n  statusCode: number\n  duration: number\n  serviceName: string\n  timestamp: number\n  requestStack: string\n  handlerStack: string\n  responseStack: string\n}`} />
          <p className="text-xs text-text-muted mt-3">The collector splits each span into three <code className="text-secondary">backend-span</code> events with phases: request, handler, response.</p>
        </section>
      </div>
    </div>
  );
}
