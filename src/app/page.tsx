"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { WhyNotSection } from "@/components/WhyNotSection";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  return (
    <div>
      <HeroSection />

      <WhyNotSection />

      <CapabilitiesSection />

      <motion.section
        className="mx-auto max-w-[1300px] px-4 py-12 border-t border-border"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <motion.p variants={fadeUp} className="section-label mb-3">workflow</motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-2xl font-bold mb-2">Three steps to full-stack visibility</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted text-sm mb-10">No config needed. Just open, use, and debug.</motion.p>
        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-5">
          {[
            { step: "01", title: "Open FlowLens", desc: "Launch the desktop app. Paste a URL for embedded mode, or click SDK Mode to instrument your own app." },
            { step: "02", title: "Use your app", desc: "Every click, network call, console log, error, and React state change is captured automatically." },
            { step: "03", title: "Debug the trace", desc: "Events grouped by interaction. Source code highlighted. Frontend and backend correlated in one timeline." },
          ].map((s) => (
            <motion.div key={s.step} variants={fadeUp} className="border border-border p-6 rounded-lg card-hover cursor-default">
              <span className="text-accent font-serif font-bold text-3xl">{s.step}</span>
              <h3 className="font-serif font-semibold text-lg mt-3 mb-2">{s.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-[1300px] px-4 py-12 border-t border-border text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="font-serif text-2xl font-bold mb-4">Ready to debug?</motion.h2>
        <motion.p variants={fadeUp} className="text-text-muted text-sm mb-8">Get started in under a minute.</motion.p>
        <motion.div variants={fadeUp}>
          <Link href="/docs"
            className="cta-primary inline-flex items-center gap-2 px-6 py-3 font-mono font-medium rounded-md hover:brightness-110 transition cursor-pointer">
            Read the Docs <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
