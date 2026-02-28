"use client";

import { motion } from "framer-motion";
import { Settings, Server, FileCog } from "lucide-react";
import { useState } from "react";

export default function Configuration() {
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "env">(
    "general",
  );

  const generalConfig = `[general]
tick_rate_ms = 2000          # UI refresh interval
confirm_destructive = true   # Require confirmation for risky operations

[ui]
color_scheme = "default"
show_help_hints = true`;

  const aiConfig = `[ai]
enabled = true
endpoint = "https://your-api.execute-api.region.amazonaws.com/dev/mentor"
api_key = "your-api-key"
timeout_secs = 30`;

  const envContent = `export ZIT_AI_ENDPOINT="https://your-api.execute-api.region.amazonaws.com/dev/mentor"
export ZIT_AI_API_KEY="your-api-key"`;

  return (
    <section id="configuration" className="py-24 relative bg-zinc-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-12 items-start">
          {/* Left Column: Context */}
          <div className="md:col-span-1 mb-10 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[var(--accent)]/20 rounded-lg text-[var(--accent)]">
                <Settings size={24} />
              </div>
              <h2 className="text-3xl font-bold">Configuration</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Zit is highly configurable via{" "}
              <code className="text-white bg-white/10 px-1 rounded">
                ~/.config/zit/config.toml
              </code>
              . You can tweak UI behavior, safety checks, and AI settings.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <FileCog className="text-gray-500 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-medium">TOML Config</h4>
                  <p className="text-sm text-gray-500">
                    Simple, readable configuration file format.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Server className="text-gray-500 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-medium">AI Backend</h4>
                  <p className="text-sm text-gray-500">
                    Optional AI features require AWS Lambda deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Blocks */}
          <div className="md:col-span-2">
            <div className="bg-black/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
              <div className="flex border-b border-white/10 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "general" ? "bg-white/10 text-white border-b-2 border-[var(--primary)]" : "text-gray-400 hover:text-white"}`}
                >
                  General Config
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "ai" ? "bg-[var(--accent)]/10 text-[var(--accent)] border-b-2 border-[var(--accent)]" : "text-gray-400 hover:text-white"}`}
                >
                  AI Config
                </button>
                <button
                  onClick={() => setActiveTab("env")}
                  className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "env" ? "bg-blue-500/10 text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}
                >
                  Env Vars
                </button>
              </div>

              <div className="p-6 relative min-h-[200px]">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-sm text-gray-300 overflow-x-auto"
                >
                  <code>
                    {activeTab === "general" && generalConfig}
                    {activeTab === "ai" && aiConfig}
                    {activeTab === "env" && envContent}
                  </code>
                </motion.pre>
              </div>
            </div>

            <div className="mt-6 flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                General
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                AI
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Environment
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
