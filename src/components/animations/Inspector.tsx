"use client";
import { useFrameCycle, AnimContainer, MiniWindow, Cursor } from "./shared";

/* Hover + Component Tree — cursor hovers elements, right side traces through component hierarchy */
export function Inspector8() {
  const f = useFrameCycle(16, 650);

  const elements = [
    { label: "My Shop", x: 12, y: 10, w: 80, h: 22, tag: "<h1>", cls: ".page-title", dim: "80×22",
      tree: [
        { name: "App", depth: 0 },
        { name: "Layout", depth: 1 },
        { name: "Header", depth: 2 },
        { name: "Title", depth: 3 },
      ]},
    { label: "★★★★☆", x: 12, y: 48, w: 68, h: 20, tag: "<div>", cls: ".star-rating", dim: "68×20",
      tree: [
        { name: "App", depth: 0 },
        { name: "Layout", depth: 1 },
        { name: "ProductCard", depth: 2 },
        { name: "StarRating", depth: 3 },
      ]},
    { label: "$49.99", x: 90, y: 48, w: 56, h: 20, tag: "<span>", cls: ".price", dim: "56×20",
      tree: [
        { name: "App", depth: 0 },
        { name: "Layout", depth: 1 },
        { name: "ProductCard", depth: 2 },
        { name: "PriceTag", depth: 3 },
      ]},
    { label: "Add to Cart", x: 12, y: 84, w: 92, h: 26, tag: "<button>", cls: ".cart-btn", dim: "92×26",
      tree: [
        { name: "App", depth: 0 },
        { name: "Layout", depth: 1 },
        { name: "ProductCard", depth: 2 },
        { name: "CartButton", depth: 3 },
      ]},
    { label: "Search...", x: 12, y: 126, w: 134, h: 24, tag: "<input>", cls: ".search-input", dim: "134×24",
      tree: [
        { name: "App", depth: 0 },
        { name: "Layout", depth: 1 },
        { name: "SearchBar", depth: 2 },
        { name: "Input", depth: 3 },
      ]},
  ];

  const activeIdx = f < 1 ? -1 : Math.min(Math.floor((f - 1) / 3), elements.length - 1);
  const hovered = activeIdx >= 0 ? elements[activeIdx] : null;
  const treeRevealCount = hovered ? Math.min((f - 1) - activeIdx * 3 + 1, hovered.tree.length) : 0;

  return (
    <AnimContainer>
      <div className="flex gap-3 flex-1 min-h-0">
        <MiniWindow title="localhost:3000" className="w-[50%] shrink-0">
          <div className="relative h-full p-4">
            {elements.map((el, i) => (
              <div key={i}
                className={`absolute flex items-center px-2.5 text-[10px] font-mono rounded transition-all duration-300 ${
                  activeIdx === i
                    ? "border-2 border-accent bg-accent/10 text-accent z-20 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                    : i < activeIdx
                      ? "border border-green-500/20 bg-green-500/5 text-green-500/50"
                      : "border border-border/40 bg-bg-elevated/50 text-text-dim"
                }`}
                style={{ left: el.x, top: el.y, width: el.w, height: el.h }}>
                {el.label}
                {activeIdx === i && (
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-accent text-bg text-[8px] font-mono rounded whitespace-nowrap">
                    &lt;{el.tree[el.tree.length - 1].name}&gt;
                  </div>
                )}
              </div>
            ))}

            {hovered && (
              <div className="absolute z-30 bg-bg-elevated border border-accent/30 rounded-md px-2.5 py-2 shadow-lg animate-[fadeIn_0.15s_ease]"
                style={{ left: Math.min(hovered.x + hovered.w + 8, 150), top: Math.max(hovered.y - 8, 4) }}>
                <div className="text-[10px] font-mono text-accent">{hovered.tag}</div>
                <div className="text-[9px] font-mono text-text-muted">{hovered.cls}</div>
                <div className="text-[9px] font-mono text-text-dim">{hovered.dim}</div>
              </div>
            )}

            {hovered && (
              <Cursor x={hovered.x + hovered.w / 2 - 7} y={hovered.y + hovered.h / 2 - 6} />
            )}

            <div className="absolute bottom-3 left-3 text-[9px] font-mono text-text-dim">
              {activeIdx >= 0 ? `${activeIdx + 1}/${elements.length} inspected` : "hover to inspect"}
            </div>
          </div>
        </MiniWindow>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="text-[10px] font-mono text-text-dim mb-1.5">Component Tree</div>
          <div className="border border-border rounded-md bg-bg-card/50 p-3 flex-1 min-h-0 overflow-auto">
            {hovered ? (
              <div className="space-y-1">
                {hovered.tree.map((node, i) => {
                  const visible = i < treeRevealCount;
                  const isTarget = i === hovered.tree.length - 1 && visible;
                  return (
                    <div key={i}
                      className={`transition-all duration-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`}
                      style={{ paddingLeft: node.depth * 12 }}>
                      <div className={`flex items-center gap-1.5 py-1 text-[11px] font-mono rounded-sm transition-all duration-300 ${
                        isTarget
                          ? "text-accent font-medium bg-accent/15 px-2 -mx-1 border border-accent/30"
                          : visible
                            ? "text-text-muted"
                            : "text-text-dim"
                      }`}>
                        <span className="text-text-dim/30">{node.depth > 0 ? "└" : ""}</span>
                        <span>&lt;{node.name}&gt;</span>
                        {isTarget && (
                          <>
                            <span className="text-accent animate-pulse ml-1">●</span>
                            <span className="text-[9px] text-accent/60 ml-auto">matched</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {treeRevealCount >= hovered.tree.length && (
                  <div className="mt-3 pt-2.5 border-t border-border/30 space-y-2 animate-[fadeIn_0.25s_ease]">
                    <div>
                      <div className="text-[9px] font-mono text-text-dim uppercase">Tag</div>
                      <div className="text-[11px] font-mono text-accent">{hovered.tag}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-text-dim uppercase">Classes</div>
                      <div className="text-[11px] font-mono text-text-muted">{hovered.cls}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-text-dim uppercase">Size</div>
                      <div className="text-[11px] font-mono text-text-muted">{hovered.dim}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-text-dim uppercase">Component</div>
                      <div className="text-[11px] font-mono text-accent">{hovered.tree[hovered.tree.length - 1].name}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[10px] text-text-dim font-mono">
                Hover an element to inspect
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimContainer>
  );
}
