"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { WhyNotSection } from "@/components/WhyNotSection";
import { GetStartedSection } from "@/components/GetStartedSection";

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

      <GetStartedSection />

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
