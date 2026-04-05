"use client";

import { Terminal, Github, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const COLS = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "AI Mentor", href: "/#ai-mentor" },
      { name: "Installation", href: "/#installation" },
      { name: "Keybindings", href: "/#keybindings" },
    ],
  },
  {
    title: "Compare",
    links: [
      { name: "Why Zit Wins", href: "/compare" },
      { name: "vs GitHub Copilot", href: "/compare#why-zit" },
      { name: "vs Lazygit", href: "/compare#why-zit" },
      { name: "vs GitKraken", href: "/compare#why-zit" },
    ],
  },
  {
    title: "Pricing",
    links: [
      { name: "Pricing Plans", href: "/pricing" },
      { name: "Free Tier", href: "/pricing#pricing" },
      { name: "Pro", href: "/pricing#pricing" },
      { name: "Enterprise", href: "/pricing#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Docs", href: "/docs", external: false },
      {
        name: "GitHub",
        href: "https://github.com/JUSTMEETPATEL/zit",
        external: true,
      },
      {
        name: "MIT License",
        href: "https://github.com/JUSTMEETPATEL/zit/blob/main/LICENSE",
        external: true,
      },
      {
        name: "Releases",
        href: "https://github.com/JUSTMEETPATEL/zit/releases",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060606]">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-1.5 rounded-lg">
                <Terminal size={15} />
              </span>
              <span className="font-black text-white text-base tracking-tight">
                zit
              </span>
            </Link>
            <p className="text-white/25 text-xs leading-relaxed max-w-[160px]">
              AI-Powered Git Assistant for the terminal. Built in Rust.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <Link
                href="https://github.com/JUSTMEETPATEL/zit"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/30 hover:text-white border border-white/[0.07] hover:border-white/[0.15] text-xs font-medium transition-all"
              >
                <Github size={13} />
                GitHub
              </Link>
              <Link
                href="https://github.com/JUSTMEETPATEL/zit"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/30 hover:text-yellow-400 border border-white/[0.07] hover:border-yellow-500/20 text-xs font-medium transition-all"
              >
                <Star size={13} />
                Star
              </Link>
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      target={"external" in l && l.external ? "_blank" : undefined}
                      className="flex items-center gap-1 text-white/30 hover:text-white/70 text-xs font-medium transition-colors"
                    >
                      {l.name}
                      {"external" in l && l.external && (
                        <ArrowUpRight size={10} className="opacity-50" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05] mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-xs font-mono">
            Built with Rust & ❤️ · MIT License · © {new Date().getFullYear()} zit
          </p>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-orange-500/15 bg-orange-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-400/70 text-[10px] font-mono">
              v0.1.0-alpha
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
