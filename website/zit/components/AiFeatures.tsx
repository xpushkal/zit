"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  FileSearch,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function AiFeatures() {
  const capabilities = [
    {
      id: "explain",
      icon: <FileSearch className="w-6 h-6" />,
      title: "Explain Repo",
      desc: "Instant context. The AI analyzes your repository state and explains exactly what's going on in plain English.",
      prompt: "Explain the current state of my repository",
      response:
        "You are on branch 'main' with 3 unstaged files. Your last commit was 2 hours ago. It looks like you're working on the new authentication feature.",
    },
    {
      id: "ask",
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Ask a Question",
      desc: "Stop googling git commands. Ask complex questions and get accurate, context-aware answers.",
      prompt: "How do I undo the last commit but keep my changes?",
      response:
        "You can use `git reset --soft HEAD~1`. This will move the commit pointer back one step but leave your changes staged.",
    },
    {
      id: "recommend",
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Safety Checks",
      desc: "Get intelligent recommendations before running destructive commands. The AI predicts potential issues.",
      prompt: "I want to force push to main",
      response:
        "⚠️ Warning: This will overwrite remote history. Ensure no one else has pulled these changes. Consider using `--force-with-lease`.",
    },
    {
      id: "health",
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Health Check",
      desc: "Diagnose connectivity issues with the AI backend instantly to ensure your assistant is ready.",
      prompt: "Run system health check",
      response: "✅ Backend: Online", // Placeholder to trigger custom render
    },
  ];

  const [active, setActive] = useState(capabilities[0]);

  return (
    <section
      id="ai-mentor"
      className="py-24 bg-zinc-900/50 border-y border-white/5 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: Content List */}
          <div className="flex-1 space-y-8 w-full">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium border border-[var(--accent)]/20">
                <Sparkles size={14} />
                <span>Powered by Claude 3 Sonnet</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                Meet your new <br />
                <span className="text-gradient-ai">Git Mentor</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Zit doesn&apos;t just run commands; it understands them. The baked-in
                AI mentor guides you through complex operations, explains errors
                automatically, and helps you learn as you code.
              </p>
            </div>

            <div className="grid gap-4">
              {capabilities.map((cap) => (
                <button
                  key={cap.id}
                  onClick={() => setActive(cap)}
                  className={`flex items-start gap-4 p-4 rounded-xl text-left transition-all border ${
                    active.id === cap.id
                      ? "bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-lg shadow-[var(--accent)]/5"
                      : "bg-white/5 border-transparent hover:bg-white/10 text-gray-400"
                  }`}
                >
                  <div
                    className={`mt-1 ${active.id === cap.id ? "text-[var(--accent)]" : "text-gray-500"}`}
                  >
                    {cap.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-bold ${active.id === cap.id ? "text-white" : "text-gray-300"}`}
                    >
                      {cap.title}
                    </h3>
                    <p className="text-sm mt-1 opacity-80 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Interactive Preview */}
          <div className="flex-1 w-full relative">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0D0D0D] shadow-2xl">
                {/* Window Title Bar */}
                <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    AI Mentor Panel
                  </div>
                  <div className="w-10" />
                </div>

                {/* Chat Interface */}
                <div className="p-6 font-mono text-sm h-[400px] flex flex-col justify-end">
                  <div className="space-y-6">
                    {/* User User */}
                    <div className="flex justify-end">
                      <span className="bg-[#2a2a2a] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                        {active.prompt}
                      </span>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0 mt-1">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-[var(--accent)] text-xs font-bold mb-1">
                          ZIT AI
                        </div>
                        <span className="block text-gray-300 bg-[var(--accent)]/5 border border-[var(--accent)]/10 px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-wrap">
                          {renderResponse(active.response)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area (Fake) */}
                <div className="p-4 border-t border-white/10 bg-[#151515]">
                  <div className="flex gap-2">
                    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-gray-600">
                      Type your question...
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/20 to-transparent blur-3xl -z-10 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper to render simple markdown-like formatting
function renderResponse(text: string) {
  if (text.includes("Warning")) {
    return (
      <>
        <span className="text-yellow-500 font-bold block mb-1">⚠️ Warning</span>
        <span className="text-white">
          This will overwrite remote history. Ensure no one else has pulled
          these changes. Consider using{" "}
          <code className="bg-white/10 px-1 rounded text-yellow-200">
            --force-with-lease
          </code>
          .
        </span>
      </>
    );
  }
  if (text.includes("Backend:")) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> AI
          Backend: Online (24ms)
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> AWS
          Bedrock: Connected
        </div>
        <div className="text-gray-400 text-xs ml-4">Model: Claude 3 Sonnet</div>
      </div>
    );
  }
  return text;
}
