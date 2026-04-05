"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PricingHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to home
          </Link>

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-semibold tracking-widest uppercase">
            Pricing
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-5">
            Simple,{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6366f1,#818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              transparent
            </span>{" "}
            pricing.
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            No hidden fees. No vendor lock-in. Cancel anytime.
            <br className="hidden sm:block" />
            Built for developers, priced for humans.
          </p>

          {/* Quick stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {[
              { value: "Free", label: "forever tier" },
              { value: "14-day", label: "Pro trial" },
              { value: "0", label: "credit card required" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-white/30 text-xs mt-1 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
