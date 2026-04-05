"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CompareHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

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

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold tracking-widest uppercase">
            Competitive Edge
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
            Why{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6366f1,#818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Zit Wins.
            </span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            One tool at the intersection of AI, terminal, and Git.
            <br className="hidden sm:block" />
            No compromises. See how we stack up.
          </p>

          {/* Tool pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {["Zit ✦", "GitHub Copilot", "Lazygit", "GitKraken"].map(
              (tool, i) => (
                <span
                  key={tool}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={
                    i === 0
                      ? {
                          background:
                            "linear-gradient(135deg,rgba(139,92,246,.25),rgba(99,102,241,.25))",
                          border: "1px solid rgba(139,92,246,.4)",
                          color: "#c4b5fd",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.4)",
                        }
                  }
                >
                  {tool}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
