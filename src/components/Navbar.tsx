"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home", key: "h" },
  { href: "/features", label: "Features", key: "f" },
  { href: "/docs", label: "Docs", key: "d" },
  { href: "/sdk", label: "SDK", key: "s" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey || e.ctrlKey || e.altKey
      ) return;
      const match = navLinks.find((l) => l.key === e.key.toLowerCase());
      if (match) {
        e.preventDefault();
        router.push(match.href);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1300px] px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <AnimatedLogo size={18} />
          <span className="font-serif text-lg font-bold text-text-heading tracking-tight">FlowLens</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "text-accent bg-accent-dim"
                    : "text-text-muted hover:text-text hover:bg-bg-card"
                }`}>
                {link.label}
                <kbd className="text-[10px] text-accent border border-accent/30 bg-accent/5 rounded px-1 py-0.5 font-mono">{link.key}</kbd>
              </Link>
            );
          })}
        </div>

        <a href="https://github.com/amoreX/flowlens" target="_blank" rel="noopener noreferrer"
          className="hidden md:block text-text-muted hover:text-text transition-colors duration-200 text-sm cursor-pointer">
          GitHub
        </a>

        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-muted hover:text-text cursor-pointer" aria-label="Toggle menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
                  isActive ? "text-accent bg-accent-dim" : "text-text-muted hover:text-text"
                }`}>
                {link.label} <kbd className="text-[10px] text-accent border border-accent/30 bg-accent/5 rounded px-1 py-0.5 font-mono">{link.key}</kbd>
              </Link>
            );
          })}
          <a href="https://github.com/amoreX/flowlens" target="_blank" rel="noopener noreferrer"
            className="block px-3 py-2 text-sm text-text-muted hover:text-text cursor-pointer">GitHub</a>
        </div>
      )}
    </nav>
  );
}
