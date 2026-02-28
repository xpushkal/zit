"use client";

import { motion } from "framer-motion";

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Safety by <span className="text-[var(--primary)]">Default</span>
        </h2>
        <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
          Zit acts as a protective layer between you and Git. It orchestrates
          the native Git CLI, ensuring 100% compatibility while preventing
          common mistakes.
        </p>

        <div className="relative max-w-3xl mx-auto">
          {/* Layers */}
          <div className="space-y-4">
            {/* AI Layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 backdrop-blur-sm relative z-20"
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-[var(--accent)] rounded-full hidden md:block"></div>
              <h3 className="text-xl font-bold text-[var(--accent)] mb-2">
                AI Guidance Layer
              </h3>
              <p className="text-gray-400 text-sm">
                Mentorship, error explanation, and commit suggestions
              </p>
            </motion.div>

            {/* TUI Layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 backdrop-blur-sm relative z-20 scale-105 shadow-2xl shadow-[var(--primary)]/10"
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-16 bg-[var(--primary)] rounded-full hidden md:block"></div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">
                  Zit TUI Architecture
                </h3>
                <span className="px-2 py-1 text-xs bg-[var(--primary)] text-black font-bold rounded">
                  YOU ARE HERE
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm font-mono text-gray-300">
                <div className="bg-black/50 p-2 rounded border border-white/10">
                  State Manager
                </div>
                <div className="bg-black/50 p-2 rounded border border-white/10">
                  Safety Checks
                </div>
                <div className="bg-black/50 p-2 rounded border border-white/10">
                  Orchestrator
                </div>
              </div>
            </motion.div>

            {/* Git Layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm relative z-10 opacity-80"
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/20 rounded-full hidden md:block"></div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                Native Git CLI
              </h3>
              <p className="text-gray-500 text-sm">
                100% compatible. No reimplementation of internals.
              </p>
            </motion.div>
          </div>

          {/* Connecting lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--primary)]/50 to-transparent -z-10 hidden md:block"></div>
        </div>
      </div>
    </section>
  );
}
