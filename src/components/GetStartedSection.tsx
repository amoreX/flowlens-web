"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

type PkgManager = "npm" | "yarn" | "pnpm";

const installCmds: Record<PkgManager, string> = {
  npm: "npm i @nihal/flowlens-node",
  yarn: "yarn add @nihal/flowlens-node",
  pnpm: "pnpm add @nihal/flowlens-node",
};

const nodeCode = `import cors from "cors";
import { flowlens } from "@nihal/flowlens-node";

app.use(cors({
  origin: true,
  allowedHeaders: ["Content-Type", "X-FlowLens-Trace-Id"]
}));
app.use(flowlens({ serviceName: "my-api" }));`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-md hover:bg-bg-elevated transition-colors cursor-pointer text-text-muted hover:text-text"
      aria-label="Copy"
    >
      {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
    </button>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <div className="w-8 h-8 rounded-full border-2 border-accent/30 bg-accent/10 flex items-center justify-center shrink-0">
      <span className="text-accent text-sm font-mono font-bold">{n}</span>
    </div>
  );
}


export function GetStartedSection() {
  const [pkg, setPkg] = useState<PkgManager>("npm");

  return (
    <motion.section
      className="mx-auto max-w-[1300px] px-4 py-16 border-t border-border"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger}
    >
      <motion.p variants={fadeUp} className="section-label mb-3">get started</motion.p>
      <motion.h2 variants={fadeUp} className="font-serif text-2xl font-bold mb-2">
        Up and running in minutes
      </motion.h2>
      <motion.p variants={fadeUp} className="text-text-muted text-sm mb-12">
        Follow these steps to start tracing your full-stack app.
      </motion.p>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {/* Step 1: Paste your URL */}
        <motion.div variants={fadeUp}>
          <div className="border border-border rounded-xl p-6 bg-bg-card/30 h-full">
            <div className="flex items-center gap-3 mb-4">
              <StepNumber n={1} />
              <h3 className="font-serif font-semibold text-lg">Paste your URL</h3>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-5 md:min-h-[4.5rem]">
              Paste your app&apos;s URL into FlowLens. It loads in an embedded browser with auto-injected instrumentation.
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-elevated/50">
                <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">flowlens</span>
              </div>
              <div className="px-4 py-3 font-mono text-sm text-text-muted overflow-x-auto scrollbar-none">
                <span className="text-text-dim select-none">URL: </span>
                <span className="text-accent">http://localhost:3000</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 2: Add backend (optional) */}
        <motion.div variants={fadeUp}>
          <div className="border border-border rounded-xl p-6 bg-bg-card/30 h-full">
            <div className="flex items-center gap-3 mb-4">
              <StepNumber n={2} />
              <h3 className="font-serif font-semibold text-lg">Add backend tracing</h3>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-5 md:min-h-[4.5rem]">
              Install <code className="text-accent text-xs bg-accent/10 px-1.5 py-0.5 rounded">@nihal/flowlens-node</code> to
              correlate server-side spans with frontend traces.
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-elevated/50">
                <div className="flex gap-1">
                  {(["npm", "yarn", "pnpm"] as PkgManager[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPkg(m)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all duration-150 cursor-pointer ${
                        pkg === m
                          ? "bg-text text-bg font-medium"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <CopyButton text={installCmds[pkg]} />
              </div>
              <div className="px-4 py-3 font-mono text-sm text-text-muted overflow-x-auto scrollbar-none">
                <span className="text-text-dim select-none">$ </span>
                {installCmds[pkg]}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Wire up middleware */}
        <motion.div variants={fadeUp}>
          <div className="border border-border rounded-xl p-6 bg-bg-card/30 h-full">
            <div className="flex items-center gap-3 mb-4">
              <StepNumber n={3} />
              <h3 className="font-serif font-semibold text-lg">Wire up middleware</h3>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-5 md:min-h-[4.5rem]">
              Add the middleware to your Express, Fastify, or raw HTTP server. CORS must allow the trace header.
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-elevated/50">
                <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">backend</span>
                <CopyButton text={nodeCode} />
              </div>
              <pre className="px-4 py-3 font-mono text-xs leading-relaxed overflow-x-auto scrollbar-none">
                <code>
                  <span className="text-pink-400">import</span>{" "}
                  <span className="text-text">cors</span>{" "}
                  <span className="text-pink-400">from</span>{" "}
                  <span className="text-green-400">{'"cors"'}</span>
                  <span className="text-text-dim">;</span>
                  {"\n"}
                  <span className="text-pink-400">import</span>{" "}
                  <span className="text-text">{"{ flowlens }"}</span>{" "}
                  <span className="text-pink-400">from</span>{" "}
                  <span className="text-green-400">{'"@nihal/flowlens-node"'}</span>
                  <span className="text-text-dim">;</span>
                  {"\n\n"}
                  <span className="text-text">app</span>
                  <span className="text-text-dim">.</span>
                  <span className="text-blue-400">use</span>
                  <span className="text-text-dim">(</span>
                  <span className="text-blue-400">flowlens</span>
                  <span className="text-text-dim">({"{ "}</span>
                  <span className="text-text">serviceName</span>
                  <span className="text-text-dim">{": "}</span>
                  <span className="text-green-400">{'"my-api"'}</span>
                  <span className="text-text-dim">{" }"});</span>
                </code>
              </pre>
            </div>
            <Link
              href="/sdk"
              className="inline-flex items-center gap-1.5 text-accent text-sm mt-5 hover:underline cursor-pointer"
            >
              Full SDK reference <ExternalLink size={12} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
