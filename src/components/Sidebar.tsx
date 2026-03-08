"use client";

import { useEffect, useState, useRef } from "react";

interface SidebarItem {
  id: string;
  label: string;
  depth?: number;
}

export function Sidebar({ items }: { items: SidebarItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    // When scrolled to page bottom, activate the last item
    function onScroll() {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 40) {
        setActiveId(items[items.length - 1].id);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  const activeIndex = items.findIndex((item) => item.id === activeId);

  // Calculate indicator position and height (from first item to active item)
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (activeIndex < 0 || !navRef.current) return;

    const firstEl = itemRefs.current.get(items[0]?.id);
    const activeEl = itemRefs.current.get(activeId);
    if (!firstEl || !activeEl) return;

    const navRect = navRef.current.getBoundingClientRect();
    const firstRect = firstEl.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setIndicator({
      top: firstRect.top - navRect.top,
      height: activeRect.bottom - firstRect.top,
    });
  }, [activeId, activeIndex, items]);

  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <div className="sticky top-20">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">On this page</p>
        <nav ref={navRef} className="relative flex flex-col gap-0.5">
          {/* Smooth sliding indicator */}
          <div
            className="absolute left-0 w-0.5 rounded-full bg-accent"
            style={{
              top: indicator.top,
              height: indicator.height,
              transition: "top 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: activeIndex >= 0 ? 1 : 0,
            }}
          />
          {items.map((item, i) => {
            const isCurrent = item.id === activeId;
            const isPassed = activeIndex >= 0 && i < activeIndex;

            return (
              <a
                key={item.id}
                ref={(el) => { if (el) itemRefs.current.set(item.id, el); }}
                href={`#${item.id}`}
                className={`text-sm no-underline py-1.5 cursor-pointer pl-3 transition-colors duration-300 ${
                  item.depth === 1 ? "ml-3" : ""
                } ${
                  isCurrent
                    ? "text-accent font-medium"
                    : isPassed
                      ? "text-text"
                      : "text-text-muted hover:text-text"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
