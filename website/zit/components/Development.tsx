"use client";

import { motion } from "framer-motion";
import {
  FolderTree,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export default function Development() {
  const structure = [
    { name: "src/main.rs", desc: "Entry point, terminal setup" },
    { name: "src/app.rs", desc: "App state, main loop" },
    { name: "src/git/", desc: "Git command wrappers & parsing" },
    { name: "src/ui/", desc: "TUI components & rendering" },
    { name: "src/ai/", desc: "AI client & prompt engineering" },
    { name: "src/config.rs", desc: "Configuration loading" },
    { name: "src/event.rs", desc: "Keyboard & tick handling" },
    { name: "aws/", desc: "Lambda backend & infrastructure" },
    { name: "tests/", desc: "Integration test suite" },
    { name: "website/", desc: "Next.js documentation site" },
  ];

  const commands = [
    { cmd: "cargo build", desc: "Build" },
    { cmd: "make check", desc: "Run checks (format + clippy + test)" },
    { cmd: "cargo test --all-targets", desc: "13 Rust tests" },
    {
      cmd: "cd aws && python3 -m pytest tests/ -v",
      desc: "27 Lambda tests",
    },
    { cmd: "cargo clippy --all-targets -- -D warnings", desc: "Lint" },
    { cmd: "cargo build --release", desc: "Release build" },
  ];

  return (
    <section id="development" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Development & Structure
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Project Structure */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/30 border border-white/5 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6 text-xl font-bold text-white">
              <FolderTree className="text-[var(--primary)]" />
              <h3>Project Structure</h3>
            </div>
            <ul className="space-y-4 font-mono text-sm">
              {structure.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="text-gray-300 shrink-0">{item.name}</span>
                  <span className="text-gray-600 border-b border-white/5 border-dashed flex-grow"></span>
                  <span className="text-gray-500">{item.desc}</span>
                </li>
              ))}
              <li className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
                + more in <code className="text-gray-400">src/</code> and{" "}
                <code className="text-gray-400">aws/</code>
              </li>
            </ul>
          </motion.div>

          {/* Workflow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-6 text-xl font-bold text-white">
                <Wrench className="text-[var(--primary)]" />
                <h3>Workflow</h3>
              </div>
              <div className="bg-black/40 rounded-lg border border-white/10 overflow-hidden font-mono text-sm">
                {commands.map((c, i) => (
                  <div
                    key={i}
                    className="group flex flex-col sm:flex-row sm:items-center border-b border-white/5 last:border-0 px-4 py-3 gap-2 sm:gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center flex-grow min-w-0">
                      <span className="text-green-400 select-none mr-3 shrink-0">
                        $
                      </span>
                      <code className="text-gray-200 break-all group-hover:text-white transition-colors">
                        {c.cmd}
                      </code>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 select-none group-hover:text-gray-400 transition-colors hidden sm:block">
                      # {c.desc}
                    </span>
                    {/* Mobile description */}
                    <span className="text-xs text-gray-500 select-none sm:hidden pl-6">
                      # {c.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4 text-xl font-bold text-white">
                <CheckCircle2 className="text-[var(--primary)]" />
                <h3>Prerequisites</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-white font-bold">Rust</div>
                  <div className="text-xs text-gray-500">Toolchain</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center">
                  <div className="text-white font-bold">Git</div>
                  <div className="text-xs text-gray-500">CLI Installed</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg text-center col-span-2">
                  <div className="text-white font-bold">C++ Build Tools</div>
                  <div className="text-xs text-gray-500">
                    Required for Windows users
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
