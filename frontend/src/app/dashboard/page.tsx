"use client";
import { useEffect, useState } from "react";
import { Users, Image, Bell, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getDashboard, getLatestBrief } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const spendColors: Record<string, string> = {
  surge: "text-red-400 bg-red-400/10 border-red-400/20",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  medium: "text-accent bg-accent/10 border-accent/20",
  low: "text-muted bg-muted/10 border-muted/20",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [brief, setBrief] = useState<any>(null);
  const [brandId, setBrandId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("vantage_brand_id");
    if (!id) return;
    setBrandId(id);
    getDashboard(id).then(r => setStats(r.data)).catch(console.error);
    getLatestBrief(id).then(r => setBrief(r.data)).catch(console.error);
  }, []);

  if (!stats) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="text-muted text-sm">Loading dashboard...</div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Your competitive landscape at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Competitors", value: stats.active_competitors, icon: Users, color: "text-accent" },
          { label: "New Ads This Week", value: stats.new_ads_this_week, icon: Image, color: "text-emerald-400" },
          { label: "Spend Surges", value: stats.spend_surges, icon: TrendingUp, color: "text-orange-400" },
          { label: "Unread Alerts", value: stats.unread_alerts, icon: Bell, color: "text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted text-xs uppercase tracking-wider">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Brief */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Latest Intel Brief</h2>
            <Link href="/dashboard/briefs" className="text-accent text-xs hover:underline flex items-center gap-1">
              All briefs <ArrowRight size={12} />
            </Link>
          </div>
          {brief ? (
            <div>
              <p className="text-xs text-muted mb-3">
                Week of {new Date(brief.week_start).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — {new Date(brief.week_end).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <div className="space-y-2 mb-4">
                {(brief.key_insights || []).slice(0, 3).map((insight: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-muted">{insight}</p>
                  </div>
                ))}
              </div>
              <Link href={`/dashboard/briefs`} className="text-accent text-sm hover:underline">Read full brief →</Link>
            </div>
          ) : (
            <p className="text-muted text-sm">No briefs yet. Generate your first intelligence brief.</p>
          )}
        </div>

        {/* Recent Ads */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <Link href="/dashboard/ads" className="text-accent text-xs hover:underline flex items-center gap-1">
              All ads <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {(stats.recent_ads || []).length === 0 ? (
              <p className="text-muted text-sm">No ads synced yet. Add competitors and sync.</p>
            ) : (
              stats.recent_ads.map((ad: any) => (
                <div key={ad.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{ad.headline || "Untitled ad"}</p>
                    <p className="text-xs text-muted">{ad.platform} · {ad.format}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ml-3 flex-shrink-0 ${spendColors[ad.spend_signal] || spendColors.low}`}>
                    {ad.spend_signal}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
