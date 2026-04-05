import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WhyZitWins from "@/components/WhyZitWins";
import Footer from "@/components/Footer";
import CompareHero from "@/components/CompareHero";

export const metadata: Metadata = {
  title: "Why Zit Wins — zit vs GitHub Copilot, Lazygit, GitKraken",
  description:
    "See how zit compares to GitHub Copilot, Lazygit, and GitKraken across AI features, cost, terminal support, and more.",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen relative bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <Navbar />
      <CompareHero />
      <WhyZitWins hideHeader />
      <Footer />
    </main>
  );
}
