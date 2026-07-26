"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/app/actions";

type Order = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postal_code: string;
  payment_method: string;
  delivery_option: string;
  notes: string | null;
  status: string;
  total: number;
  discount: number;
  shipping: number;
  vat: number;
  items: unknown[];
  created_at: string;
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  confirmed: "bg-blue-500/10 text-blue-500",
  shipped: "bg-purple-500/10 text-purple-500",
  delivered: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => setOrders(data as Order[])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">الطلبات ({orders.length})</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl border border-border bg-surface animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-bold text-foreground">لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-foreground">{order.first_name} {order.last_name}</h3>
                  <p className="text-xs text-text-muted">{order.email} • {order.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[order.status] || "bg-gray-500/10 text-gray-500"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs focus:border-primary focus:outline-none"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                <span>📍 {order.city}, {order.address}</span>
                <span>💰 {order.total.toLocaleString()} درهم</span>
                <span>💳 {order.payment_method === "cod" ? "الدفع عند الاستلام" : "بطاقة بنكية"}</span>
                <span>🚚 {order.delivery_option === "express" ? "سريع" : "عادي"}</span>
                <span>📅 {new Date(order.created_at).toLocaleDateString("ar-MA")}</span>
              </div>
              {order.notes && <p className="mt-2 text-xs text-text-muted bg-surface-dark rounded-lg p-2">📝 {order.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
