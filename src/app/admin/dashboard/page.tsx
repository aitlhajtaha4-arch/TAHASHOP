"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";
import { getStats } from "@/app/actions";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalReviews: number;
  recentOrders: Record<string, unknown>[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "المنتجات", value: stats.totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "الطلبات", value: stats.totalOrders, icon: ShoppingCart, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "الإيرادات", value: `${stats.totalRevenue.toLocaleString()} درهم`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "التقييمات", value: stats.totalReviews, icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">لوحة التحكم</h1>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-muted">{card.label}</span>
                <div className={`rounded-xl ${card.bg} p-2`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-black text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {stats && stats.recentOrders.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 text-lg font-bold text-foreground">آخر الطلبات</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="pb-3 text-right font-medium">العميل</th>
                  <th className="pb-3 text-right font-medium">المدينة</th>
                  <th className="pb-3 text-right font-medium">المبلغ</th>
                  <th className="pb-3 text-right font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: Record<string, unknown>, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">{order.first_name as string} {order.last_name as string}</td>
                    <td className="py-3 text-text-muted">{order.city as string}</td>
                    <td className="py-3 font-bold text-primary">{(order.total as number)?.toLocaleString()} درهم</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        order.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                        order.status === "confirmed" ? "bg-blue-500/10 text-blue-500" :
                        order.status === "shipped" ? "bg-purple-500/10 text-purple-500" :
                        order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {order.status === "pending" ? "قيد الانتظار" : order.status === "confirmed" ? "مؤكد" : order.status === "shipped" ? "تم الشحن" : order.status === "delivered" ? "تم التوصيل" : "ملغي"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
