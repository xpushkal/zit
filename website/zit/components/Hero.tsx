"use client";

import { motion } from "framer-motion";
import { Terminal, GitBranch, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "zit";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-gradient">Git</span> made simple.
              <br />
              <span className="text-gradient-ai">AI</span> made helpful.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              Your terminal-based Git assistant. Interactive staging, guided
              commits, visual history, and an AI mentor that teaches you while
              you work.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <div className="flex gap-4">
              <Link
                href="#installation"
                className="px-8 py-3 rounded-md bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-[var(--primary)]/20"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 rounded-md bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/10"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 font-mono bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="text-[var(--primary)]">❯</span>
              <span>cd my-repo && zit</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="rounded-xl overflow-hidden glass-panel shadow-2xl border border-white/10">
              <div className="bg-zinc-900/90 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-4 text-xs text-gray-500 font-mono">
                  user@dev:~/project
                </div>
              </div>
              <div className="p-6 text-left font-mono text-sm md:text-base leading-relaxed bg-black/80">
                <p className="text-green-400">
                  ➜ ~ <span className="text-white">git status</span>
                </p>
                <p className="text-gray-400 mb-4">
                  On branch main
                  <br />
                  Your branch is up to date with &lsquo;origin/main&rsquo;.
                </p>

                <p className="text-green-400">
                  ➜ ~ <span className="text-white">{typedText}</span>
                  <span className="animate-pulse">_</span>
                </p>

                {typedText === "zit" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <div className="border border-[var(--primary)] rounded p-4 mb-2">
                      <div className="flex justify-between text-[var(--primary)] font-bold mb-2">
                        <span>ZIT DASHBOARD</span>
                        <span>[?] Help</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-400">Repo Status</div>
                          <div className="text-white">Clean working tree</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Branch</div>
                          <div className="text-green-400">main</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>[s] Stage</span>
                      <span>[c] Commit</span>
                      <span>[b] Branch</span>
                      <span>[a] AI Mentor</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[var(--accent)]/20 rounded-full blur-[100px] -z-10"></div>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-[var(--primary)]/10 rounded-full text-[var(--primary)] mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-white font-bold text-lg">Safety First</h3>
              <p className="text-gray-400 text-sm mt-2">
                Prevents destructive actions with smart confirmations and
                guardrails.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-[var(--accent)]/10 rounded-full text-[var(--accent)] mb-4">
                <Terminal size={28} />
              </div>
              <h3 className="text-white font-bold text-lg">Terminal Native</h3>
              <p className="text-gray-400 text-sm mt-2">
                Lightweight TUI that runs everywhere Rust runs. No GUI bloat.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 mb-4">
                <GitBranch size={28} />
              </div>
              <h3 className="text-white font-bold text-lg">Visual Workflow</h3>
              <p className="text-gray-400 text-sm mt-2">
                See your branches, logs, and diffs clearly without leaving the
                terminal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
