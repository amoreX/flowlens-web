"use client";

import { useState } from "react";
import { CodeRain } from "./animations/CodeRain";
import { FlowThreads } from "./animations/FlowThreads";
import { TimelineCascade } from "./animations/TimelineCascade";

const animations = [
  { id: "rain", label: "Rain", component: CodeRain },
  { id: "threads", label: "Threads", component: FlowThreads },
  { id: "timeline", label: "Timeline", component: TimelineCascade },
] as const;

export function HeroAnimation() {
  const [active, setActive] = useState(0);
  const ActiveComponent = animations[active].component;

  return (
    <>
      <div className="relative w-full flex-1 min-h-0">
        <ActiveComponent key={animations[active].id} />
      </div>

      {/* Animation toggle */}
      <div className="anim-toggle">
        {animations.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setActive(i)}
            className={i === active ? "active" : ""}
          >
            {a.label}
          </button>
        ))}
      </div>
    </>
  );
}
