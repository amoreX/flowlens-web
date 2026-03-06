"use client";

import { CodeRain } from "./animations/CodeRain";

export function HeroAnimation({ platform = "all", delay = 0 }: { platform?: "all" | "react" | "node"; delay?: number }) {
  return (
    <div
      className="w-full h-full"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent), linear-gradient(to bottom, transparent, black 50px, black calc(100% - 50px), transparent)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <CodeRain platform={platform} delay={delay} />
    </div>
  );
}
