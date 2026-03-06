"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Coffee,
  Bug,
  FileSearch,
  BrainCircuit,
  Skull,
  TriangleAlert,
} from "lucide-react";

const reasons = [
  {
    icon: <Clock size={20} />,
    title: "You enjoy debugging at 3 AM",
    desc: "Who needs sleep when you can grep through 47 log files?",
  },
  {
    icon: <Coffee size={20} />,
    title: "console.log is your best friend",
    desc: "20 hours of adding logs, 5 minutes of actual fixing. Peak productivity.",
  },
  {
    icon: <Bug size={20} />,
    title: "You think bugs add character",
    desc: "That random crash in production? It's a feature. Users love surprises.",
  },
  {
    icon: <FileSearch size={20} />,
    title: "You love context-switching",
    desc: "Browser, terminal, editor, repeat. Great cardio for your fingers.",
  },
  {
    icon: <BrainCircuit size={20} />,
    title: "Guesswork is your methodology",
    desc: "\"It works on my machine\" is a valid deployment strategy, right?",
  },
  {
    icon: <Skull size={20} />,
    title: "Stack traces are bedtime stories",
    desc: "Nothing puts you to sleep faster than 200 lines of minified errors.",
  },
];

export function WhyNotSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !entered) {
          setEntered(true);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    const timer = setTimeout(() => setScrolling(true), reasons.length * 120 + 600);
    return () => clearTimeout(timer);
  }, [entered]);

  const doubled = [...reasons, ...reasons];

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-[1300px] px-4 py-16 border-t border-border"
    >
      <div className="mb-12 flex items-start gap-4">
        <div
          className="shrink-0 mt-1"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(0.5)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <TriangleAlert size={20} className="text-amber-500" />
          </div>
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em] font-mono text-amber-500 mb-2"
            style={{
              opacity: entered ? 1 : 0,
              transition: "opacity 0.4s ease 0.1s",
            }}
          >
            // do not proceed
          </p>
          <h2
            className="font-serif text-2xl font-bold"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
            }}
          >
            Caution.{" "}
            <span className="text-text-muted font-normal text-lg">
              Use FlowLens at your own risk. You might actually start shipping faster.
            </span>
          </h2>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4"
          style={{
            animation: scrolling ? "tickerScroll 35s linear infinite" : "none",
          }}
        >
          {doubled.map((r, i) => {
            const realIndex = i % reasons.length;
            const isFirstSet = i < reasons.length;

            return (
              <div
                key={i}
                className="shrink-0 w-[280px] p-5 rounded-xl border border-border bg-bg-card/50 card-hover cursor-default"
                style={
                  isFirstSet
                    ? {
                        opacity: entered ? 1 : 0,
                        transform: entered ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                        transition: `opacity 0.5s ease ${realIndex * 120}ms, transform 0.5s ease ${realIndex * 120}ms`,
                      }
                    : {
                        opacity: entered ? 1 : 0,
                        transition: `opacity 0.3s ease ${reasons.length * 120 + 400}ms`,
                      }
                }
              >
                <div className="text-amber-500/70 mb-3">{r.icon}</div>
                <h4 className="font-serif font-semibold text-sm mb-1.5">{r.title}</h4>
                <p className="text-text-muted text-xs leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
