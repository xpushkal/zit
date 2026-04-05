import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import PricingHero from "@/components/PricingHero";

export const metadata: Metadata = {
  title: "Pricing — zit",
  description:
    "Simple, transparent pricing for zit. Start free forever, upgrade to Pro for AI mentorship, or get Enterprise for your whole team.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen relative bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <Navbar />
      <PricingHero />
      <Pricing hideHeader />
      <Footer />
    </main>
  );
}
