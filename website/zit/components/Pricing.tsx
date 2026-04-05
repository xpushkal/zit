"use client";

import { motion } from "framer-motion";
import { Check, Zap, Shield, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "₹0",
    period: "Forever",
    subtext: "Perfect for individuals exploring smarter Git workflows.",
    cta: "Get Started",
    ctaHref: "#installation",
    featured: false,
    features: [
      "Core Git TUI (14 features)",
      "Interactive staging & commits",
      "Branch visualization",
      "Diff viewer",
      "Basic conflict resolution",
      "Community support",
    ],
  },
  {
    name: "Pro",
    icon: Shield,
    price: "₹199",
    period: "/month",
    subtext: "For developers who want AI-powered Git mastery.",
    cta: "Upgrade Now",
    ctaHref: "#",
    featured: true,
    features: [
      "Everything in Free",
      "AI Mentor (unlimited queries)",
      "Smart commit message suggestions",
      "Context-aware code reviews",
      "Advanced conflict resolution",
      "Priority support (48h response)",
      "Early access to new features",
    ],
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "₹2000",
    period: "/user/month",
    subtext: "Built for teams that ship fast and ship clean.",
    cta: "Contact Sales",
    ctaHref: "mailto:sales@zit.dev",
    featured: false,
    features: [
      "Everything in Pro",
      "SSO & team management",
      "Custom AI model fine-tuning",
      "Audit logs & compliance",
      "Dedicated Slack channel",
      "SLA guarantee (99.9% uptime)",
      "On-premise deployment option",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Pricing({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-purple-900/8 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {!hideHeader && (
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-semibold tracking-widest uppercase">
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Start free.{" "}
              <span style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Scale fast.
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
              No hidden fees. No vendor lock-in. Cancel anytime.
              <br className="hidden sm:block" />
              Built for developers, priced for humans.
            </p>
          </motion.div>
        )}

        {/* Cards grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto ${hideHeader ? 'mt-12 md:mt-16' : ''}`}>
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={
                  plan.featured
                    ? { y: -6, scale: 1.02 }
                    : { y: -4, scale: 1.01 }
                }
                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                  plan.featured
                    ? "md:-mt-4 md:mb-0"
                    : ""
                }`}
                style={
                  plan.featured
                    ? {
                        background:
                          "linear-gradient(160deg, rgba(109,40,217,0.18) 0%, rgba(99,102,241,0.12) 50%, rgba(17,17,17,0.95) 100%)",
                        border: "1px solid rgba(139,92,246,0.35)",
                        boxShadow:
                          "0 0 0 1px rgba(139,92,246,0.15), 0 8px 32px rgba(109,40,217,0.25), 0 32px 64px rgba(99,102,241,0.12)",
                        backdropFilter: "blur(20px)",
                      }
                    : {
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                        backdropFilter: "blur(16px)",
                      }
                }
              >
                {/* Most Popular badge */}
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
                      style={{
                        background:
                          "linear-gradient(135deg, #8b5cf6, #6366f1)",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
                      }}
                    >
                      ✦ Most Popular
                    </span>
                  </div>
                )}

                {/* Icon + Plan name */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-2 rounded-xl"
                    style={
                      plan.featured
                        ? {
                            background: "rgba(139,92,246,0.15)",
                            border: "1px solid rgba(139,92,246,0.3)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }
                    }
                  >
                    <Icon
                      size={18}
                      className={
                        plan.featured ? "text-violet-400" : "text-white/40"
                      }
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold tracking-wide uppercase ${
                      plan.featured ? "text-violet-300" : "text-white/50"
                    }`}
                  >
                    {plan.name}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span
                    className="text-5xl font-black tracking-tight"
                    style={
                      plan.featured
                        ? {
                            background:
                              "linear-gradient(135deg, #c4b5fd, #818cf8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : { color: "#fff" }
                    }
                  >
                    {plan.price}
                  </span>
                  <span className="text-white/30 text-sm ml-1 font-medium">
                    {plan.period}
                  </span>
                </div>

                {/* Subtext */}
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  {plan.subtext}
                </p>

                {/* CTA Button */}
                <a
                  href={plan.ctaHref}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200 mb-8 ${
                    plan.featured
                      ? "text-white hover:-translate-y-0.5"
                      : "text-white/70 hover:text-white hover:bg-white/8 hover:-translate-y-0.5"
                  }`}
                  style={
                    plan.featured
                      ? {
                          background:
                            "linear-gradient(135deg, #8b5cf6, #6366f1)",
                          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                          border: "none",
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                >
                  {plan.cta}
                </a>

                {/* Divider */}
                <div
                  className="w-full h-px mb-6"
                  style={{
                    background: plan.featured
                      ? "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)"
                      : "rgba(255,255,255,0.06)",
                  }}
                />

                {/* Feature list */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={
                          plan.featured
                            ? {
                                background: "rgba(139,92,246,0.2)",
                                border: "1px solid rgba(139,92,246,0.4)",
                              }
                            : {
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }
                        }
                      >
                        <Check
                          size={9}
                          strokeWidth={3}
                          className={
                            plan.featured ? "text-violet-400" : "text-white/30"
                          }
                        />
                      </div>
                      <span className="text-white/55 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom footnote */}
        <motion.p
          className="text-center text-white/20 text-xs mt-16 font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          All plans include a 14-day free trial of Pro · No credit card required
        </motion.p>
      </div>
    </section>
  );
}
