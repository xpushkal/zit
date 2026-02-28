"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Installation() {
  const [copied, setCopied] = useState("");
  const [os, setOs] = useState<"brew" | "cargo">("brew");

  const commands = {
    brew: `brew tap JUSTMEETPATEL/zit
brew install zit`,
    cargo: `cargo install --git https://github.com/JUSTMEETPATEL/zit`,
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <section
      id="installation"
      className="py-24 bg-zinc-900/30 border-y border-white/5"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Install using your favorite package manager
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setOs("brew")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              os === "brew"
                ? "bg-white text-black"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Homebrew (macOS)
          </button>
          <button
            onClick={() => setOs("cargo")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              os === "cargo"
                ? "bg-[var(--primary)] text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Source (Linux/macOS/Windows)
          </button>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <motion.div
            key={os}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 rounded-xl p-6 border border-white/10 text-left relative group"
          >
            <pre className="font-mono text-gray-300 overflow-x-auto">
              <code>{commands[os]}</code>
            </pre>
            <button
              onClick={() => handleCopy(commands[os], os)}
              className="absolute top-4 right-4 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              {copied === os ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </motion.div>

          <div className="mt-6 text-sm text-gray-500">
            {os === "brew" ? (
              <p>
                Recommended for macOS users. Updates are managed automatically.
              </p>
            ) : (
              <p>
                Requires Rust and Git installed. Works on Linux, macOS, and
                Windows.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
