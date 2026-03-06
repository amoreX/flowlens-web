"use client";

import { CodeRain } from "./animations/CodeRain";

export function HeroAnimation() {
  return (
    <div
      className="relative w-full flex-1 min-h-0"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent), linear-gradient(to bottom, transparent, black 50px, black calc(100% - 50px), transparent)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <CodeRain />
    </div>
  );
}
