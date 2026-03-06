"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroAnimation } from "./HeroAnimation";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[1300px] px-4 pt-12 pb-6">
      <div className="grid md:grid-cols-2 gap-8 items-stretch min-h-[520px]">
        <div className="flex flex-col justify-center">
          <p className="section-label mb-5">Your mom can debug faster now</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-text-heading">
            See every trace.<br />
            <span className="text-accent">Debug any flow.</span>
          </h1>
          <p className="text-text-muted text-base max-w-md leading-relaxed mb-10">
            An Electron desktop tool that captures every UI event, network call, console log,
            and error — correlating frontend and backend in a unified trace timeline.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/docs"
              className="cta-primary inline-flex items-center gap-2 px-6 py-2.5 font-mono font-medium text-sm rounded-md hover:brightness-110 transition cursor-pointer">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link href="/features"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-text text-sm rounded-md hover:border-accent hover:text-accent transition cursor-pointer">
              View Features
            </Link>
          </div>
        </div>
        <div className="hidden md:block relative min-h-[520px]">
          <div className="absolute inset-0">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
