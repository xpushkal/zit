"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { name: "Features", href: "/#features" },
  { name: "AI Mentor", href: "/#ai-mentor" },
  { name: "Why Zit", href: "/compare" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-1.5 rounded-lg group-hover:bg-orange-500/15 group-hover:border-orange-500/30 transition-all">
            <Terminal size={16} />
          </span>
          <span className="font-black text-white text-lg tracking-tight">
            zit
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(l.href)
                  ? "text-white bg-white/[0.07]"
                  : "text-white/40 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {l.name}
              {/* Active underline dot */}
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://github.com/JUSTMEETPATEL/zit"
            target="_blank"
            aria-label="View on GitHub"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <Github size={17} />
          </Link>
          <Link
            href="/#installation"
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:-translate-y-px"
          >
            Install
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden bg-[#090909]/98 backdrop-blur-2xl border-b border-white/[0.06] overflow-hidden"
          >
            <div className="px-5 py-4 space-y-0.5">
              {NAV.map((l) => (
                <Link
                  key={l.name}
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
              ))}

              <div className="pt-4 border-t border-white/[0.06] mt-2 flex gap-2">
                <Link
                  href="https://github.com/JUSTMEETPATEL/zit"
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white/40 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all font-medium"
                >
                  <Github size={16} />
                  GitHub
                </Link>
                <Link
                  href="/#installation"
                  className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm text-center transition-all"
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
