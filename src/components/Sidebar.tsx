"use client";

import { useEffect, useState } from "react";

interface SidebarItem {
  id: string;
  label: string;
  depth?: number;
}

export function Sidebar({ items }: { items: SidebarItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

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

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <div className="sticky top-20">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">On this page</p>
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`}
              className={`text-sm no-underline py-1.5 transition-colors cursor-pointer border-l-2 pl-3 ${item.depth === 1 ? "ml-3" : ""} ${
                activeId === item.id
                  ? "text-accent border-accent font-medium"
                  : "text-text-muted hover:text-text border-transparent hover:border-border-hover"
              }`}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
