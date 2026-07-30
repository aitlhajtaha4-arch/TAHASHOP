"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import { getAllProducts, deleteProduct, createProduct, updateProduct } from "@/app/actions";
import type { Product } from "@/data/products";

const defaultProduct = {
  name: "",
  brand: "",
  price: 0,
  original_price: null as number | null,
  image: "",
  rating: 4.5,
  review_count: 0,
  badge: null as string | null,
  storage: "128 GB",
  ram: "8 GB",
  camera: "",
  battery: "",
  screen_size: "",
  processor: "",
  colors: [] as string[],
  category: "flagship",
  condition: "جديد" as string,
  free_shipping: true,
  available: true,
  monthly_payment: null as number | null,
  description: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultProduct);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(
    (p) => p.name.includes(search) || p.brand.includes(search) || p.category.includes(search)
  );

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      original_price: product.originalPrice ?? null,
      image: product.image,
      rating: product.rating,
      review_count: product.reviews,
      badge: product.badge ?? null,
      storage: product.storage,
      ram: product.ram,
      camera: product.camera,
      battery: product.battery,
      screen_size: product.screenSize,
      processor: product.processor,
      colors: product.colors,
      category: product.category,
      condition: product.condition,
      free_shipping: product.freeShipping,
      available: product.available,
      monthly_payment: product.monthlyPayment ?? null,
      description: product.description,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(defaultProduct);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطأ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-foreground">المنتجات ({filtered.length})</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="w-full sm:w-48 rounded-xl border border-border bg-surface py-2.5 pr-9 pl-3 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <button onClick={() => { setEditingId(null); setForm(defaultProduct); setShowForm(true); }} className="flex items-center gap-2 rounded-xl accent-gradient px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap">
            <Plus className="h-4 w-4" />
            منتج جديد
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <h2 className="text-lg font-bold text-foreground">{editingId ? "تعديل المنتج" : "منتج جديد"}</h2>
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
              <label className="mb-1 block text-xs font-bold text-foreground">السعر (درهم)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">السعر الأصلي</label>
              <input type="number" value={form.original_price ?? ""} onChange={(e) => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الصورة (URL)</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الفئة</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="flagship">رائدة</option>
                <option value="mid-range">متوسطة</option>
                <option value="budget">اقتصادية</option>
                <option value="gaming">ألعاب</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الحالة</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value as "جديد" | "مستعمل" | "مجدد" })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="جديد">جديد</option>
                <option value="مستعمل">مستعمل</option>
                <option value="مجدد">مجدد</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">التخزين</label>
              <input value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الرام</label>
              <input value={form.ram} onChange={(e) => setForm({ ...form, ram: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">المعالج</label>
              <input value={form.processor} onChange={(e) => setForm({ ...form, processor: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الكاميرا</label>
              <input value={form.camera} onChange={(e) => setForm({ ...form, camera: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">البطارية</label>
              <input value={form.battery} onChange={(e) => setForm({ ...form, battery: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">حجم الشاشة</label>
              <input value={form.screen_size} onChange={(e) => setForm({ ...form, screen_size: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الشعار</label>
              <input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value || null })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">القسط الشهري</label>
              <input type="number" value={form.monthly_payment ?? ""} onChange={(e) => setForm({ ...form, monthly_payment: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-bold text-foreground">الألوان (مفصولة بفاصلة)</label>
              <input value={form.colors.join(", ")} onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="أسود, أبيض, أزرق" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-bold text-foreground">الوصف</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.free_shipping} onChange={(e) => setForm({ ...form, free_shipping: e.target.checked })} className="rounded" />
              توصيل مجاني
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
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="p-3 text-right font-medium">المنتج</th>
                <th className="p-3 text-right font-medium">العلامة</th>
                <th className="p-3 text-right font-medium">السعر</th>
                <th className="p-3 text-right font-medium">الفئة</th>
                <th className="p-3 text-right font-medium">الحالة</th>
                <th className="p-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-surface-dark/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium text-foreground truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-text-muted">{p.brand}</td>
                  <td className="p-3 font-bold text-primary">{p.price.toLocaleString()} درهم</td>
                  <td className="p-3 text-text-muted">{p.category}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.condition === "جديد" ? "bg-emerald-500/10 text-emerald-500" :
                      p.condition === "مستعمل" ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"
                    }`}>{p.condition}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(p)} className="rounded-lg p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors">
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
