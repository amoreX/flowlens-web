"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Zap, GitBranch, Code2, Terminal } from "lucide-react";

const features = [
  {
    icon: <Zap size={18} />,
    title: "Auto Trace Grouping",
    desc: "Every click or submit starts a new trace. Subsequent events are grouped automatically into causal execution flows.",
  },
  {
    icon: <GitBranch size={18} />,
    title: "Full-Stack Correlation",
    desc: "X-FlowLens-Trace-Id header propagates from frontend to backend, linking UI events to API calls in one timeline.",
  },
  {
    icon: <Code2 size={18} />,
    title: "Source Code Mapping",
    desc: "Stack-based line highlighting with source map support. See exactly which line triggered each event.",
  },
  {
    icon: <Terminal size={18} />,
    title: "Console + Inspector",
    desc: "Filterable console panel and JSON inspector for full event details, errors, and network payloads.",
  },
];

function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div className="w-full h-full min-h-[420px] rounded-lg border border-border bg-bg-card flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-accent/30 flex items-center justify-center mx-auto mb-3">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-accent/50 ml-1" />
        </div>
        <p className="text-text-muted text-xs font-mono">{title}</p>
      </div>
    </div>
  );
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return desktop;
}

export function CapabilitiesSection() {
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop) return;
    function onScroll() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const scrollableRange = wrapperHeight - viewportHeight;

      if (scrolled < 0 || scrollableRange <= 0) {
        setActive(0);
        return;
      }

      const progress = Math.min(Math.max(scrolled / scrollableRange, 0), 1);
      const idx = Math.min(
        Math.floor(progress * features.length),
        features.length - 1
      );
      setActive(idx);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  return (
    <div ref={wrapperRef} style={{ height: isDesktop ? `${features.length * 100}vh` : "auto" }}>
      <div className={isDesktop ? "sticky top-0 h-screen flex items-center" : "py-16"}>
        <div className="mx-auto w-full max-w-[1300px] px-4">
          <div className="mb-10">
            <p className="section-label mb-3">capabilities</p>
            <h2 className="font-serif text-3xl font-bold">Everything you need to trace full-stack behavior</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex flex-col gap-3 md:w-[320px] shrink-0">
              {features.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`text-left p-5 rounded-lg border transition-all duration-300 cursor-pointer ${
                    active === i
                      ? "border-accent bg-accent-dim"
                      : "border-border hover:border-border-hover bg-transparent"
                  }`}
                >
                  <div className={`mb-2.5 ${active === i ? "text-accent" : "text-text-muted"}`}>{f.icon}</div>
                  <h4 className="font-serif font-semibold text-base mb-1">{f.title}</h4>
                  <p className={`text-sm leading-relaxed transition-all duration-300 ${
                    active === i ? "text-text max-h-24 opacity-100" : "text-text-muted max-h-0 md:max-h-0 opacity-0 overflow-hidden"
                  } max-md:max-h-24 max-md:opacity-100`}>{f.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-0 hidden md:block">
              <VideoPlaceholder title={features[active].title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
