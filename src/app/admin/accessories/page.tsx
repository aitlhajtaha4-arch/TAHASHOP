"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Search, Headphones, Package } from "lucide-react";
import { getAllAccessories, createAccessory, updateAccessory, deleteAccessory } from "@/app/actions";
import { accessoryCategories, accessoryCategoryMap, type Accessory } from "@/data/products";

const defaultAccessory = {
  name: "",
  brand: "",
  category: "other",
  image: "",
  price: 0,
  original_price: null as number | null,
  stock: 0,
  description: "",
  featured: false,
  available: true,
};

export default function AdminAccessories() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultAccessory);

  const load = () => {
    getAllAccessories()
      .then(setAccessories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = accessories.filter(
    (a) => a.name.includes(search) || a.brand.includes(search) || (accessoryCategoryMap[a.category] || "").includes(search)
  );

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإكسسوار؟")) return;
    await deleteAccessory(id);
    setAccessories((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (acc: Accessory) => {
    setEditingId(acc.id);
    setForm({
      name: acc.name,
      brand: acc.brand,
      category: acc.category,
      image: acc.image,
      price: acc.price,
      original_price: acc.originalPrice ?? null,
      stock: acc.stock,
      description: acc.description,
      featured: acc.featured,
      available: acc.available,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAccessory(editingId, form);
      } else {
        await createAccessory(form);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(defaultAccessory);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطأ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Headphones className="h-6 w-6 text-primary" />
          الإكسسوارات ({filtered.length})
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="w-full sm:w-48 rounded-xl border border-border bg-surface py-2.5 pr-9 pl-3 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button onClick={() => { setEditingId(null); setForm(defaultAccessory); setShowForm(true); }} className="flex items-center gap-2 rounded-xl accent-gradient px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap">
            <Plus className="h-4 w-4" />
            إكسسوار جديد
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-lg font-bold text-foreground">{editingId ? "تعديل الإكسسوار" : "إكسسوار جديد"}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الاسم</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">العلامة التجارية</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الفئة</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
                {accessoryCategories.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">السعر (درهم)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">السعر الأصلي (اختياري)</label>
              <input type="number" value={form.original_price ?? ""} onChange={(e) => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">المخزون</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-bold text-foreground">الصورة (URL)</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-bold text-foreground">الوصف</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
              مميز
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded" />
              متوفر
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-xl accent-gradient px-6 py-2.5 text-xs font-bold text-white">
              {editingId ? "تحديث" : "إنشاء"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-xl border border-border px-6 py-2.5 text-xs font-bold text-text-muted hover:text-foreground">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl border border-border bg-surface animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <Headphones className="mx-auto mb-4 h-12 w-12 text-text-muted" />
          <p className="text-lg font-bold text-foreground">لا توجد إكسسوارات</p>
          <p className="text-sm text-text-muted mt-1">أضف إكسسوارات لتظهر في المتجر</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="p-3 text-right font-medium">المنتج</th>
                <th className="p-3 text-right font-medium">العلامة</th>
                <th className="p-3 text-right font-medium">الفئة</th>
                <th className="p-3 text-right font-medium">السعر</th>
                <th className="p-3 text-right font-medium">المخزون</th>
                <th className="p-3 text-right font-medium">مميز</th>
                <th className="p-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-surface-dark/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {a.image ? (
                        <img src={a.image} alt={a.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-surface-dark flex items-center justify-center">
                          <Package className="h-5 w-5 text-text-muted" />
                        </div>
                      )}
                      <span className="font-medium text-foreground truncate max-w-[200px]">{a.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-text-muted">{a.brand}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {accessoryCategoryMap[a.category] || a.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-primary">{a.price.toLocaleString()} درهم</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.stock > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                      {a.stock > 0 ? `${a.stock} متوفر` : "نفد"}
                    </span>
                  </td>
                  <td className="p-3">
                    {a.featured ? <span className="text-amber-500">★</span> : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(a)} className="rounded-lg p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
