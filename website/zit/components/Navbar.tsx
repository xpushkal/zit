"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "AI Mentor", href: "/#ai-mentor" },
  { name: "Why Zit", href: "/compare" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
];

function scrollToTop(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080808]/80 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      {/* Top hairline — always visible for polish */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-1.5 rounded-lg group-hover:bg-orange-500/15 transition-all duration-200">
            <Terminal size={16} />
          </span>
          <span className="font-black text-white text-lg tracking-tight">
            zit
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-1 py-1">
            {NAV.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                onClick={(e) => scrollToTop(e, l.href)}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  isActive(l.href)
                    ? "text-white bg-white/[0.08]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://github.com/JUSTMEETPATEL/zit"
            target="_blank"
            aria-label="View on GitHub"
            className="text-white/30 hover:text-white/60 transition-colors p-2 rounded-lg hover:bg-white/[0.05]"
          >
            <Github size={17} />
          </Link>
          <Link
            href="/#installation"
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold text-[13px] transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]"
          >
            Install
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#080808]/95 backdrop-blur-2xl border-b border-white/[0.06]"
          >
            <div className="px-5 py-4 space-y-1">
              {NAV.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(l.href)
                        ? "text-white bg-white/[0.07]"
                        : "text-white/45 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {l.name}
                    {isActive(l.href) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    )}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-white/[0.06] mt-3 flex gap-2">
                <Link
                  href="https://github.com/JUSTMEETPATEL/zit"
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white/40 hover:text-white border border-white/[0.08] transition-all font-medium"
                >
                  <Github size={16} />
                  GitHub
                </Link>
                <Link
                  href="/#installation"
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm text-center transition-all"
                >
                  Install zit
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
