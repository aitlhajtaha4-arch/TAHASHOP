"use client";

import { useEffect, useState } from "react";
import { Bell, Check, AlertCircle, Info, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};

const typeIcons: Record<string, typeof Bell> = {
  info: Info,
  order: Package,
  review: Check,
  alert: AlertCircle,
};

const typeColors: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-500",
  order: "bg-emerald-500/10 text-emerald-500",
  review: "bg-amber-500/10 text-amber-500",
  alert: "bg-red-500/10 text-red-500",
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
        setNotifications((data as Notification[]) || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">الإشعارات</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl border border-border bg-surface animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-lg font-bold text-foreground">لا توجد إشعارات</p>
          <p className="text-sm text-text-muted">ستظهر الإشعارات الجديدة هنا</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div key={n.id} className={`rounded-2xl border bg-surface p-4 flex items-start gap-4 transition-all ${n.read ? "border-border opacity-60" : "border-border hover:border-primary/20"}`}>
                <div className={`rounded-xl p-2 flex-shrink-0 ${typeColors[n.type] || "bg-gray-500/10 text-gray-500"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-text-muted mt-1">{new Date(n.created_at).toLocaleString("ar-MA")}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
