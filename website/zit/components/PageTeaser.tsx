"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, CreditCard } from "lucide-react";

const CARDS = [
  {
    icon: BarChart3,
    badge: "Competitive Edge",
    badgeColor: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    title: "Why Zit Wins",
    desc: "See how we stack up against GitHub Copilot, Lazygit, and GitKraken across AI, cost, and terminal support.",
    href: "/compare",
    cta: "View Comparison",
    gradient: "from-indigo-600/12 to-violet-600/8",
    glowColor: "rgba(99,102,241,0.18)",
    borderColor: "rgba(99,102,241,0.18)",
    hoverBorder: "rgba(99,102,241,0.35)",
    ctaStyle: {
      background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.15))",
      border: "1px solid rgba(99,102,241,.3)",
      color: "#a5b4fc",
    },
  },
  {
    icon: CreditCard,
    badge: "Pricing",
    badgeColor: "text-violet-400 border-violet-500/20 bg-violet-500/5",
    title: "Simple, Transparent Pricing",
    desc: "Start free forever. Upgrade to Pro for AI mentorship or get Enterprise for your whole team. No hidden fees.",
    href: "/pricing",
    cta: "See Pricing",
    gradient: "from-violet-600/10 to-purple-600/6",
    glowColor: "rgba(139,92,246,0.15)",
    borderColor: "rgba(139,92,246,0.15)",
    hoverBorder: "rgba(139,92,246,0.35)",
    ctaStyle: {
      background: "linear-gradient(135deg,rgba(139,92,246,.15),rgba(109,40,217,.15))",
      border: "1px solid rgba(139,92,246,.3)",
      color: "#c4b5fd",
    },
  },
];

export default function PageTeaser() {
  return (
    <section className="relative pt-0 pb-16 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-8 overflow-hidden transition-all duration-300"
                style={{
                  background: `linear-gradient(160deg, rgba(17,17,17,1) 0%, rgba(17,17,17,.9) 100%)`,
                  border: `1px solid ${card.borderColor}`,
                  boxShadow: `0 4px 32px ${card.glowColor}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${card.hoverBorder}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${card.borderColor}`;
                }}
              >
                {/* Background gradient blob */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Icon + badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{
                        background: card.ctaStyle.background,
                        border: card.ctaStyle.border,
                      }}
                    >
                      <Icon size={18} style={{ color: card.ctaStyle.color }} />
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-3 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-7">
                    {card.desc}
                  </p>

                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all group-hover:gap-3"
                    style={card.ctaStyle}
                  >
                    {card.cta}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
