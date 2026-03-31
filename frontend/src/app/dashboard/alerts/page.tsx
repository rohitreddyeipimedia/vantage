"use client";
import { useEffect, useState } from "react";
import { getAlerts, markAlertRead } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { TrendingUp, Image, MessageSquare, MoonStar, Bell } from "lucide-react";

const alertConfig: Record<string, { icon: any; color: string; label: string }> = {
  surge: { icon: TrendingUp, color: "text-red-400", label: "Spend Surge" },
  new_format: { icon: Image, color: "text-accent", label: "New Format" },
  messaging_pivot: { icon: MessageSquare, color: "text-orange-400", label: "Messaging Pivot" },
  brand_dark: { icon: MoonStar, color: "text-muted", label: "Brand Gone Dark" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("vantage_brand_id") || "";
    if (id) getAlerts(id).then(r => setAlerts(r.data)).finally(() => setLoading(false));
  }, []);

  const handleRead = async (alertId: string) => {
    await markAlertRead(alertId);
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, is_read: true } : a));
  };

  const unread = alerts.filter(a => !a.is_read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-muted text-sm mt-1">{unread} unread alert{unread !== 1 ? "s" : ""}</p>
      </div>

      {loading ? <div className="text-muted text-sm">Loading...</div> : alerts.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <Bell size={32} className="text-muted mx-auto mb-4" />
          <p className="text-muted">No alerts yet. Alerts appear when competitors change behavior.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(a => {
            const config = alertConfig[a.alert_type] || alertConfig.surge;
            const Icon = config.icon;
            return (
              <div key={a.id}
                className={`border rounded-xl p-4 flex items-start gap-4 transition-colors ${a.is_read ? "bg-card border-border opacity-60" : "bg-card border-border"}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${a.is_read ? "bg-card" : "bg-card border border-border"}`}>
                  <Icon size={16} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                    {!a.is_read && <span className="w-1.5 h-1.5 bg-accent rounded-full" />}
                  </div>
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-muted mt-1">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</p>
                </div>
                {!a.is_read && (
                  <button onClick={() => handleRead(a.id)} className="text-muted hover:text-white text-xs border border-border hover:border-accent px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
                    Mark read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
