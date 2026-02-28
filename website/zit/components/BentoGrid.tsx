"use client";

import { motion } from "framer-motion";
import {
  GitCommit,
  GitPullRequest,
  LayoutDashboard,
  History,
  Undo2,
  Wand2,
  FileDiff,
  Cloud,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function BentoGrid() {
  return (
    <section
      id="features"
      className="py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Command Center <span className="text-gray-500">Upgrade</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A terminal user interface that feels like a modern GUI. Speed without
          compromise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4">
        {/* Box 1: Repository Dashboard (Large 2x2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 row-span-2 rounded-xl p-6 bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <LayoutDashboard size={120} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="p-3 bg-blue-500/10 w-fit rounded-lg mb-4 text-blue-400">
                <LayoutDashboard />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Repository Dashboard
              </h3>
              <p className="text-gray-400 max-w-sm">
                Your mission control center. See dirty state, recent commits,
                and branch status instantly upon launch.
              </p>
            </div>

            {/* Visual Preview (Fake Terminal UI) */}
            <div className="mt-8 bg-black/80 rounded-lg border border-white/5 p-4 font-mono text-xs text-gray-300 shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform">
              <div className="flex justify-between border-b border-white/10 pb-2 mb-2">
                <span className="font-bold text-white">zit dashboard</span>
                <span className="text-gray-600">v0.1.0</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500">CURRENT BRANCH</div>
                  <div className="text-green-400 font-bold text-lg">
                    feat/ai-mentor
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">STATUS</div>
                  <div className="text-yellow-400">3 modified files</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Box 2: Visual Branching (Tall 1x2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="col-span-1 row-span-2 rounded-xl p-6 bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
        >
          <div className="p-3 bg-purple-500/10 w-fit rounded-lg mb-4 text-purple-400">
            <GitPullRequest />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Visual Branching
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Create, switch, delete, and rename branches visually.
          </p>

          {/* Visual Tree */}
          <div className="absolute bottom-0 left-6 right-6 top-40 flex flex-col gap-3 font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span className="text-gray-500">main</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2 h-10 border-l mb-[-20px] border-b border-gray-600 rounded-bl-lg"></div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-400 font-bold bg-green-500/10 px-1 rounded">
                dev
              </span>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <div className="w-2 h-10 border-l mb-[-20px] border-b border-gray-600 rounded-bl-lg"></div>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-blue-300">feature/ui</span>
            </div>
          </div>
        </motion.div>

        {/* Box 3: AI Mentor (Wide 2x1) - Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-2 lg:col-span-1 rounded-xl p-6 bg-gradient-to-br from-[var(--accent)]/20 to-zinc-900 border border-[var(--accent)]/30 hover:shadow-[var(--accent)]/10 hover:shadow-lg transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="p-3 bg-[var(--accent)]/20 w-fit rounded-lg mb-4 text-[var(--accent)]">
                <Wand2 />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Mentor</h3>
              <p className="text-gray-300 text-sm">
                Integrated LLM assistance.
              </p>
            </div>
            <Link
              href="#ai-mentor"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-full hover:bg-white/20"
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Box 4: Smart Staging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-6 bg-zinc-900/50 border border-white/10 hover:border-green-500/50 transition-all hover:-translate-y-1"
        >
          <div className="p-3 bg-green-500/10 w-fit rounded-lg mb-4 text-green-400">
            <FileDiff />
          </div>
          <h3 className="font-bold text-white mb-2">Smart Staging</h3>
          <p className="text-gray-400 text-sm">
            Stop `git add .` blindly. Review diffs interactively.
          </p>
        </motion.div>

        {/* Box 5: Guided Commits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-6 bg-zinc-900/50 border border-white/10 hover:border-orange-500/50 transition-all hover:-translate-y-1"
        >
          <div className="p-3 bg-orange-500/10 w-fit rounded-lg mb-4 text-orange-400">
            <GitCommit />
          </div>
          <h3 className="font-bold text-white mb-2">Guided Commits</h3>
          <p className="text-gray-400 text-sm">
            Validate messages and get AI suggestions.
          </p>
        </motion.div>

        {/* Box 6: Time Travel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="rounded-xl p-6 bg-zinc-900/50 border border-white/10 hover:border-red-500/50 transition-all hover:-translate-y-1"
        >
          <div className="p-3 bg-red-500/10 w-fit rounded-lg mb-4 text-red-400">
            <Undo2 />
          </div>
          <h3 className="font-bold text-white mb-2">Time Travel</h3>
          <p className="text-gray-400 text-sm">
            Safe reset & restore with clear confirmations.
          </p>
        </motion.div>

        {/* Box 7: GitHub & More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="md:col-span-2 lg:col-span-1 rounded-xl p-6 bg-zinc-900/50 border border-white/10 flex flex-col justify-center gap-4"
        >
          <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
            <Cloud size={20} />
            <span className="text-sm font-medium">GitHub Integration</span>
          </div>
          <div className="w-full h-px bg-white/5"></div>
          <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
            <History size={20} />
            <span className="text-sm font-medium">Reflog Recovery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
