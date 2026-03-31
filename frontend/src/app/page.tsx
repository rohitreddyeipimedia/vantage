"use client";
import Link from "next/link";
import { Eye, TrendingUp, Bell, FileText, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
            <Eye size={14} className="text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Vantage</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-muted hover:text-white text-sm transition-colors">Sign in</Link>
          <Link href="/register" className="bg-accent hover:bg-accent-dark text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-xs text-muted mb-8">
          <Zap size={12} className="text-accent" />
          <span>AI-powered competitor intelligence</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          See what your competitors see.<br />
          <span className="text-accent">Act before they do.</span>
        </h1>
        <p className="text-muted text-xl max-w-2xl mx-auto mb-10">
          Vantage monitors your competitors' ads, creatives, and social activity — then delivers AI-written intelligence briefs every week. No dashboards. Just insight.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="bg-accent hover:bg-accent-dark text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors flex items-center gap-2">
            Start free trial <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="border border-border hover:border-accent text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors">
            Sign in
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Eye, title: "Ad Intelligence", desc: "Track every ad your competitors run on Meta and Google. Creatives, copy, formats, spend signals — updated daily." },
            { icon: TrendingUp, title: "AI Weekly Brief", desc: "Every Monday, a professional intelligence brief lands in your inbox. What changed, what it means, what to do." },
            { icon: Bell, title: "Real-Time Alerts", desc: "Get notified the moment a competitor surges ad spend, pivots messaging, or launches a new format." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-6">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Starter", price: "₹15,000", desc: "3 competitors, Meta only, weekly AI brief, 90-day history", cta: "Get started", featured: false },
            { name: "Growth", price: "₹35,000", desc: "10 competitors, Meta + Google, daily alerts, 12-month history", cta: "Most popular", featured: true },
            { name: "Pro", price: "₹80,000", desc: "25 competitors, all sources, white-label briefs, API access", cta: "Contact us", featured: false },
          ].map(({ name, price, desc, cta, featured }) => (
            <div key={name} className={`border rounded-xl p-6 ${featured ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              {featured && <div className="text-accent text-xs font-semibold uppercase tracking-wider mb-3">Most Popular</div>}
              <h3 className="font-bold text-xl mb-1">{name}</h3>
              <div className="text-3xl font-bold mb-1">{price}<span className="text-muted text-base font-normal">/mo</span></div>
              <p className="text-muted text-sm mb-6">{desc}</p>
              <Link href="/register" className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${featured ? "bg-accent hover:bg-accent-dark text-white" : "border border-border hover:border-accent text-white"}`}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8 text-center text-muted text-sm">
        <p>© 2026 Vantage by Eipi Media. Built for B2C brands that mean business.</p>
      </div>
    </div>
  );
}
