"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

/* ─── Data ────────────────────────────────────────────────────────────── */

const TOOLS = [
  { name: "Zit", highlight: true },
  { name: "GitHub Copilot", highlight: false },
  { name: "Lazygit", highlight: false },
  { name: "GitKraken", highlight: false },
];

type CellVal = "yes" | "no" | "partial";

interface Row {
  feature: string;
  desc: string;
  values: CellVal[];
}

const ROWS: Row[] = [
  {
    feature: "AI Mentor (fixes errors)",
    desc: "Explains every mistake inline as you work",
    values: ["yes", "partial", "no", "no"],
  },
  {
    feature: "Agent Mode (autonomous)",
    desc: "Runs Git tasks end-to-end without intervention",
    values: ["yes", "no", "no", "no"],
  },
  {
    feature: "Secret Scanner built-in",
    desc: "Blocks commits containing API keys / tokens",
    values: ["yes", "no", "no", "no"],
  },
  {
    feature: "Works on 2G / SSH",
    desc: "Zero bandwidth; runs inside any remote shell",
    values: ["yes", "no", "yes", "no"],
  },
  {
    feature: "Free local AI (Ollama)",
    desc: "Fully offline, no data leaves your machine",
    values: ["yes", "no", "no", "no"],
  },
  {
    feature: "Terminal-native (no GUI)",
    desc: "Ships as a single static binary, no Electron",
    values: ["yes", "no", "yes", "no"],
  },
  {
    feature: "Cost per user",
    desc: "What you actually pay monthly",
    values: ["yes", "no", "yes", "partial"],
    cost: ["< ₹2/day", "$10/mo", "Free", "$4.99/mo"],
  } as Row & { cost: string[] },
];

const FOOTNOTES = [
  { emoji: "⭐", text: "lazygit: 56 K stars — proves TUI demand" },
  { emoji: "💰", text: "GitHub Copilot: $10B ARR — proves devs pay for AI" },
  { emoji: "⚡", text: "Zit: the only tool at the intersection" },
];

/* ─── Cell badge ──────────────────────────────────────────────────────── */

function Badge({
  val,
  cost,
  isZit,
}: {
  val: CellVal;
  cost?: string;
  isZit?: boolean;
}) {
  if (cost) {
    return (
      <span
        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold tracking-wide"
        style={
          isZit
            ? {
                background: "linear-gradient(135deg,rgba(139,92,246,.25),rgba(99,102,241,.25))",
                border: "1px solid rgba(139,92,246,.45)",
                color: "#c4b5fd",
              }
            : {
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.1)",
                color: "rgba(255,255,255,.5)",
              }
        }
      >
        {cost}
      </span>
    );
  }

  const map = {
    yes: {
      label: "✓",
      style: {
        background: "rgba(34,197,94,.12)",
        border: "1px solid rgba(34,197,94,.3)",
        color: "#4ade80",
      },
    },
    no: {
      label: "✕",
      style: {
        background: "rgba(239,68,68,.10)",
        border: "1px solid rgba(239,68,68,.25)",
        color: "#f87171",
      },
    },
    partial: {
      label: "~",
      style: {
        background: "rgba(234,179,8,.10)",
        border: "1px solid rgba(234,179,8,.25)",
        color: "#facc15",
      },
    },
  };

  const { label, style } = map[val];
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-black"
      style={style}
    >
      {label}
    </span>
  );
}

/* ─── Main component ──────────────────────────────────────────────────── */

export default function WhyZitWins({ hideHeader = false }: { hideHeader?: boolean }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <section id="why-zit" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-indigo-600/8 blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-violet-700/8 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header — suppressed on the dedicated /compare page */}
        {!hideHeader && (
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-semibold tracking-widest uppercase">
              Competitive Edge
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
              Why{" "}
              <span style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Zit Wins
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              One tool at the intersection of AI, terminal, and Git.
              <br className="hidden sm:block" />
              No compromises.
            </p>
          </motion.div>
        )}

        {/* Scrollable table wrapper (mobile) */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`overflow-x-auto rounded-2xl ${hideHeader ? 'mt-12 md:mt-16' : ''}`}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(139,92,246,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <table className="w-full min-w-[640px] border-collapse">
            {/* ── Column headers ── */}
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                {/* Feature column */}
                <th className="text-left px-6 py-5 w-[260px]">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">
                    Feature
                  </span>
                </th>

                {TOOLS.map((tool) => (
                  <th key={tool.name} className="px-4 py-5 text-center">
                    {tool.highlight ? (
                      <div
                        className="inline-flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(160deg,rgba(109,40,217,.25),rgba(99,102,241,.18))",
                          border: "1px solid rgba(139,92,246,.4)",
                          boxShadow: "0 4px 20px rgba(99,102,241,.2)",
                        }}
                      >
                        <span className="text-base font-black text-white tracking-tight">
                          Zit
                        </span>
                        <span
                          className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(139,92,246,.3)",
                            color: "#c4b5fd",
                          }}
                        >
                          Our pick
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-white/40 tracking-tight">
                        {tool.name}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Rows ── */}
            <tbody>
              {ROWS.map((row, ri) => {
                const costRow = (row as Row & { cost?: string[] }).cost;
                const isHovered = hoveredRow === ri;
                const isAlt = ri % 2 === 1;

                return (
                  <tr
                    key={row.feature}
                    onMouseEnter={() => setHoveredRow(ri)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: isHovered
                        ? "rgba(139,92,246,0.06)"
                        : isAlt
                        ? "rgba(255,255,255,0.018)"
                        : "transparent",
                      borderBottom:
                        ri < ROWS.length - 1
                          ? "1px solid rgba(255,255,255,0.045)"
                          : "none",
                      transition: "background 0.18s ease",
                    }}
                  >
                    {/* Feature label */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white/80 text-sm leading-snug">
                        {row.feature}
                      </div>
                      <div className="text-white/30 text-xs mt-0.5 leading-relaxed">
                        {row.desc}
                      </div>
                    </td>

                    {/* Tool cells */}
                    {TOOLS.map((tool, ti) => {
                      const val = row.values[ti];
                      const cost = costRow ? costRow[ti] : undefined;
                      return (
                        <td
                          key={tool.name}
                          className="px-4 py-4 text-center"
                          style={
                            tool.highlight
                              ? {
                                  background: isHovered
                                    ? "rgba(109,40,217,0.14)"
                                    : "rgba(99,102,241,0.05)",
                                  borderLeft: "1px solid rgba(139,92,246,0.15)",
                                  borderRight: "1px solid rgba(139,92,246,0.15)",
                                  transition: "background 0.18s ease",
                                }
                              : {}
                          }
                        >
                          <Badge val={val} cost={cost} isZit={tool.highlight} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Footnotes */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {FOOTNOTES.map((note, i) => (
            <p
              key={i}
              className={`flex items-center gap-2 text-xs leading-relaxed ${
                i === 2
                  ? "font-semibold text-violet-400"
                  : "text-white/30"
              }`}
            >
              <span>{note.emoji}</span>
              <span>{note.text}</span>
            </p>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          className="mt-6 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {[
            { label: "Yes", symbol: "✓", color: "#4ade80", bg: "rgba(34,197,94,.12)", border: "rgba(34,197,94,.3)" },
            { label: "Partial", symbol: "~", color: "#facc15", bg: "rgba(234,179,8,.10)", border: "rgba(234,179,8,.25)" },
            { label: "No", symbol: "✕", color: "#f87171", bg: "rgba(239,68,68,.10)", border: "rgba(239,68,68,.25)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black"
                style={{ background: l.bg, border: `1px solid ${l.border}`, color: l.color }}
              >
                {l.symbol}
              </span>
              <span className="text-xs text-white/30 font-medium">{l.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
