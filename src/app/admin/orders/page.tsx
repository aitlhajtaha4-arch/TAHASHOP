"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/app/actions";
import { CheckCircle2, Clock, XCircle, RotateCcw, Wallet, Banknote, CreditCard } from "lucide-react";

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
  payment_status: string;
  transaction_id: string | null;
  paid_at: string | null;
  payer_email: string | null;
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

const paymentLabels: Record<string, string> = {
  pending: "في انتظار الدفع",
  paid: "مدفوع",
  failed: "فشل الدفع",
  refunded: "مسترجع",
};

const paymentColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  paid: "bg-emerald-500/10 text-emerald-500",
  failed: "bg-red-500/10 text-red-500",
  refunded: "bg-gray-500/10 text-gray-500",
};

const methodLabels: Record<string, string> = {
  cod: "الدفع عند الاستلام",
  paypal: "PayPal",
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

  const formatMoney = (n: number) => `${n.toLocaleString()} درهم`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">الطلبات ({orders.length})</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl border border-border bg-surface animate-pulse" />)}
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {order.first_name.charAt(0)}{order.last_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">{order.first_name} {order.last_name}</h3>
                    <p className="text-xs text-text-muted truncate" dir="ltr">
                      {order.email} • {order.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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

              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold ${paymentColors[order.payment_status] || "bg-gray-500/10 text-gray-500"}`}>
                  {order.payment_status === "paid"
                    ? <CheckCircle2 className="h-3.5 w-3.5" />
                    : order.payment_status === "failed"
                      ? <XCircle className="h-3.5 w-3.5" />
                      : order.payment_status === "refunded"
                        ? <RotateCcw className="h-3.5 w-3.5" />
                        : <Clock className="h-3.5 w-3.5" />}
                  {paymentLabels[order.payment_status] || order.payment_status}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-surface-dark px-2.5 py-1 font-bold text-text-muted">
                  {order.payment_method === "paypal" ? <CreditCard className="h-3.5 w-3.5" /> : <Banknote className="h-3.5 w-3.5" />}
                  {methodLabels[order.payment_method] || order.payment_method}
                </span>
                {order.payment_method === "paypal" && order.transaction_id && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-surface-dark px-2.5 py-1 text-text-muted">
                    <Wallet className="h-3.5 w-3.5" />
                    <span dir="ltr">ID: {order.transaction_id.slice(0, 18)}</span>
                  </span>
                )}
                {order.paid_at && (
                  <span className="rounded-lg bg-surface-dark px-2.5 py-1 text-text-muted">
                    دفع: {new Date(order.paid_at).toLocaleDateString("ar-MA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                <span>📍 {order.city}, {order.address}</span>
                <span>💰 {formatMoney(order.total)}</span>
                <span>🚚 {order.delivery_option === "express" ? "سريع" : "عادي"}</span>
                <span>📅 {new Date(order.created_at).toLocaleDateString("ar-MA")}</span>
              </div>

              {order.payer_email && (
                <p className="mt-2 text-xs text-text-muted bg-surface-dark rounded-lg p-2">
                  👤 عميل PayPal: <span dir="ltr">{order.payer_email}</span>
                </p>
              )}
              {order.notes && <p className="mt-2 text-xs text-text-muted bg-surface-dark rounded-lg p-2">📝 {order.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
