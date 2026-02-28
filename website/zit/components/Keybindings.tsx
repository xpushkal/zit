"use client";

import { Keyboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Keybindings() {
  const bindings = [
    {
      key: "s",
      action: "Staging",
      desc: "Interactive file staging with diffs",
    },
    { key: "c", action: "Commit", desc: "Write and submit commits" },
    { key: "b", action: "Branches", desc: "Create, switch, delete, rename" },
    { key: "l", action: "Log", desc: "Visual commit timeline / graph" },
    { key: "t", action: "Time Travel", desc: "Reset / restore safely" },
    { key: "r", action: "Reflog", desc: "Recover lost commits" },
    { key: "g", action: "GitHub", desc: "Sync, push/pull, collaborators" },
    { key: "a", action: "AI Mentor", desc: "Explain repo, ask questions" },
    {
      key: "?",
      action: "Help",
      desc: "Context-sensitive keybinding reference",
    },
    { key: "q", action: "Quit", desc: "Exit the application" },
  ];

  return (
    <section id="keybindings" className="py-24 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Keyboard-first{" "}
              <span className="text-[var(--primary)]">Controls</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl">
              Navigate your entire Git workflow without lifting your hands from
              the keyboard. Vim-style navigation and intuitive shortcuts make
              you faster.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-white font-semibold">
                  <Keyboard size={20} className="text-gray-400" />
                  <span>Zero Context Switching</span>
                </div>
                <p className="text-sm text-gray-400">
                  Perform all actions within the terminal. No GUI bloat.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-white font-semibold">
                  <span className="text-gray-400 font-mono text-lg">?</span>
                  <span>Context Help</span>
                </div>
                <p className="text-sm text-gray-400">
                  Press ? anytime to see available keys for the current view.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <div className="bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="px-4 py-2 border-b border-white/10 bg-zinc-900/50 flex justify-between items-center">
                <span className="text-xs font-mono text-gray-500">
                  KEYBINDINGS.CONF
                </span>
              </div>
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-3 font-medium">Key</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                      <th className="px-6 py-3 font-medium hidden sm:table-cell">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-sm">
                    {bindings.map((b, i) => (
                      <motion.tr
                        key={b.key}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-3">
                          <span className="inline-block min-w-[24px] px-2 py-0.5 rounded bg-white/10 text-white group-hover:bg-[var(--primary)] group-hover:text-black font-bold transition-colors">
                            {b.key}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-white">{b.action}</td>
                        <td className="px-6 py-3 text-gray-500 hidden sm:table-cell">
                          {b.desc}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
