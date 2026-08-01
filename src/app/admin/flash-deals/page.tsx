"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Zap, GripVertical, ToggleLeft, ToggleRight, Clock } from "lucide-react";
import { getAllFlashDeals, createFlashDeal, updateFlashDeal, deleteFlashDeal, getAllProducts } from "@/app/actions";
import type { FlashDeal, Product } from "@/data/products";

const defaultDeal = {
  name: "",
  brand: "",
  price: 0,
  original_price: 0,
  image: "",
  discount: 0,
  ends_at: "",
  start_date: "",
  badge: null as string | null,
  sort_order: 0,
  is_active: true,
};

export default function AdminFlashDeals() {
  const [deals, setDeals] = useState<FlashDeal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultDeal);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const load = () => {
    Promise.all([getAllFlashDeals().catch(() => []), getAllProducts().catch(() => [])])
      .then(([dealsData, productsData]) => {
        setDeals(dealsData);
        setProducts(productsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    await deleteFlashDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const handleEdit = (deal: FlashDeal) => {
    setEditingId(deal.id);
    setSelectedProductId(null);
    const startDate = deal.startDate ? new Date(deal.startDate).toISOString().slice(0, 16) : "";
    const endDate = new Date(deal.endsAt).toISOString().slice(0, 16);
    setForm({
      name: deal.name,
      brand: deal.brand,
      price: deal.price,
      original_price: deal.originalPrice,
      image: deal.image,
      discount: deal.discount,
      ends_at: endDate,
      start_date: startDate,
      badge: deal.badge ?? null,
      sort_order: deal.sortOrder,
      is_active: deal.isActive,
    });
    setShowForm(true);
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
      setForm({
        ...form,
        name: product.name,
        brand: product.brand,
        price: product.price,
        original_price: product.originalPrice ?? product.price,
        image: product.image,
        discount,
      });
    }
  };

  const calcDiscount = () => {
    if (form.original_price > 0 && form.price > 0) {
      return Math.round(((form.original_price - form.price) / form.original_price) * 100);
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        discount: calcDiscount(),
        start_date: form.start_date || new Date().toISOString(),
        ends_at: form.ends_at || new Date(Date.now() + 24 * 3600000).toISOString(),
      };
      if (editingId) {
        await updateFlashDeal(editingId, payload);
      } else {
        await createFlashDeal(payload);
      }
      setShowForm(false);
      setEditingId(null);
      setSelectedProductId(null);
      setForm(defaultDeal);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطأ");
    }
  };

  const toggleActive = async (deal: FlashDeal) => {
    await updateFlashDeal(deal.id, { is_active: !deal.isActive });
    setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, isActive: !d.isActive } : d)));
  };

  const updateSortOrder = async (deal: FlashDeal, newOrder: number) => {
    await updateFlashDeal(deal.id, { sort_order: newOrder });
    setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, sortOrder: newOrder } : d)));
  };

  const formatDateTime = (ts: number) => {
    return new Date(ts).toLocaleDateString("ar-MA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const isActiveNow = (deal: FlashDeal) => {
    return deal.isActive && (now === 0 || deal.endsAt > now);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Zap className="h-6 w-6 text-red-500" />
            عروض الوميض ({deals.length})
          </h1>
          <p className="text-sm text-text-muted mt-1">إدارة عروض اليوم المحدودة والخصومات الحصرية</p>
        </div>
        <button onClick={() => { setEditingId(null); setSelectedProductId(null); setForm(defaultDeal); setShowForm(true); }} className="flex items-center gap-2 rounded-xl accent-gradient px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap">
          <Plus className="h-4 w-4" />
          عرض جديد
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-red-500/20 bg-surface p-5 space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-500" />
            {editingId ? "تعديل العرض" : "عرض جديد"}
          </h2>

          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">اختيار منتج من القائمة</label>
            <select
              value={selectedProductId ?? ""}
              onChange={(e) => e.target.value ? handleProductSelect(Number(e.target.value)) : setSelectedProductId(null)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">— اختر منتجاً —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.brand} — {p.price.toLocaleString()} درهم</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">اسم المنتج</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">العلامة التجارية</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">سعر العرض (درهم)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">السعر الأصلي (درهم)</label>
              <input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الخصم التلقائي</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                <span className="font-bold text-red-500">{calcDiscount()}%</span>
                <span className="text-text-muted text-xs">(يحسب تلقائياً)</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الصورة (URL)</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">تاريخ البداية</label>
              <input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">تاريخ النهاية</label>
              <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الشعار</label>
              <select value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value || null })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">بدون شعار</option>
                <option value="عرض خاص">عرض خاص</option>
                <option value="الأكثر مبيعاً">الأكثر مبيعاً</option>
                <option value="حصري">حصري</option>
                <option value="تخفيض كبير">تخفيض كبير</option>
                <option value="جديد">جديد</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">ترتيب العرض</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
              نشط
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl accent-gradient px-6 py-2.5 text-xs font-bold text-white">
              {editingId ? "تحديث" : "إنشاء"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setSelectedProductId(null); }} className="rounded-xl border border-border px-6 py-2.5 text-xs font-bold text-text-muted hover:text-foreground">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl border border-border bg-surface animate-pulse" />)}
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <Zap className="mx-auto mb-4 h-12 w-12 text-text-muted" />
          <p className="text-lg font-bold text-foreground">لا توجد عروض بعد</p>
          <p className="text-sm text-text-muted mt-1">أضف عروض الوميض لتظهر على الصفحة الرئيسية</p>
          <button onClick={() => { setEditingId(null); setSelectedProductId(null); setForm(defaultDeal); setShowForm(true); }} className="mt-4 flex items-center gap-2 mx-auto rounded-xl accent-gradient px-4 py-2.5 text-xs font-bold text-white">
            <Plus className="h-4 w-4" />
            أضف أول عرض
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <div key={deal.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border bg-surface p-4 transition-all ${isActiveNow(deal) ? "border-red-500/30" : "border-border opacity-60"}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GripVertical className="h-4 w-4 text-text-muted hidden sm:block flex-shrink-0" />
                <img src={deal.image} alt={deal.name} className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground truncate">{deal.name}</h3>
                    {deal.badge && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">{deal.badge}</span>}
                  </div>
                  <p className="text-xs text-text-muted">{deal.brand}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-xs text-text-muted">السعر</p>
                  <p className="font-bold text-red-500">{deal.price.toLocaleString()} درهم</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-muted">الأصلي</p>
                  <p className="font-bold text-text-muted line-through">{deal.originalPrice.toLocaleString()} درهم</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-muted">الخصم</p>
                  <p className="font-bold text-red-500">-{deal.discount}%</p>
                </div>
                <div className="text-center min-w-[120px]">
                  <p className="text-xs text-text-muted flex items-center gap-1"><Clock className="h-3 w-3" /> ينتهي</p>
                  <p className="text-xs font-medium text-foreground">{formatDateTime(deal.endsAt)}</p>
                </div>
                <div className="text-center">
                  <label className="text-xs text-text-muted block mb-1">الترتيب</label>
                  <input
                    type="number"
                    value={deal.sortOrder}
                    onChange={(e) => updateSortOrder(deal, Number(e.target.value))}
                    className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-xs text-center focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(deal)} className={`rounded-lg p-1.5 transition-colors ${deal.isActive ? "text-emerald-500 hover:bg-emerald-500/10" : "text-text-muted hover:bg-surface-dark"}`} title={deal.isActive ? "نشط" : "معطّل"}>
                  {deal.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button onClick={() => handleEdit(deal)} className="rounded-lg p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(deal.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
