"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroAnimation } from "./HeroAnimation";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function HeroSection() {
  return (
    <section className="mx-auto max-w-[1300px] px-4 pt-12 pb-6">
      <div className="grid md:grid-cols-2 gap-8 items-stretch min-h-[520px]">
        <motion.div
          className="flex flex-col justify-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeUp} className="section-label mb-5">Your mom can debug faster now</motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-text-heading">
            See every trace.<br />
            <span className="text-accent">Debug any flow.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-text-muted text-base max-w-md leading-relaxed mb-10">
            An Electron desktop tool that captures every UI event, network call, console log,
            and error — correlating frontend and backend in a unified trace timeline.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link href="/docs"
              className="cta-primary inline-flex items-center gap-2 px-6 py-2.5 font-mono font-medium text-sm rounded-md hover:brightness-110 transition cursor-pointer">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link href="/docs"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-text text-sm rounded-md hover:border-accent hover:text-accent transition cursor-pointer">
              View Docs
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="hidden md:block relative min-h-[520px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute inset-0">
            <HeroAnimation delay={800} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
