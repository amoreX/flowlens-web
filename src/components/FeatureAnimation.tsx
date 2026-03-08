"use client";
import { TraceGrouping8 } from "./animations/TraceGrouping";
import { Correlation8 } from "./animations/Correlation";
import { Inspector8 } from "./animations/Inspector";
import { SourceMapping1 } from "./animations/SourceMapping";
import { ConsoleInspector8 } from "./animations/ConsoleInspector";

const animations = [
  TraceGrouping8,
  Correlation8,
  Inspector8,
  SourceMapping1,
  ConsoleInspector8,
];

export function FeatureAnimation({ featureIndex }: { featureIndex: number }) {
  const Component = animations[featureIndex] || animations[0];
  return (
    <div className="w-full h-full min-h-[420px]">
      <Component />
    </div>
  );
}
