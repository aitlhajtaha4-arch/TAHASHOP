"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, CheckCircle2, XCircle, RefreshCw, Tags } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory, type CategoryRow } from "../actions";

const emptyForm = { name: "", slug: "", icon: "🏷️", sort_order: 0, is_active: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = () => {
    getCategories()
      .then(setCategories)
      .catch((err: unknown) =>
        setMessage({ type: "error", text: err instanceof Error ? err.message : "تعذر تحميل الفئات" })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (cat: CategoryRow) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, sort_order: cat.sort_order, is_active: cat.is_active });
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        setMessage({ type: "success", text: "تم تحديث الفئة بنجاح" });
      } else {
        await createCategory(form);
        setMessage({ type: "success", text: "تمت إضافة الفئة بنجاح" });
      }
      resetForm();
      load();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "خطأ في الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryRow) => {
    if (!confirm(`هل أنت متأكد من حذف فئة "${cat.name}"؟`)) return;
    setMessage(null);
    try {
      await deleteCategory(cat.id);
      setMessage({ type: "success", text: "تم حذف الفئة" });
      if (editing?.id === cat.id) resetForm();
      load();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "خطأ في الحذف" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">الفئات</h1>
        <p className="mt-1 text-sm text-text-muted">أدر الفئات التي تظهر كفلاتر في صفحة المتجر الرئيسية.</p>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {message.text}
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-20 text-center">
                <Tags className="h-8 w-8 text-text-muted" />
                <p className="text-sm font-medium text-foreground">لا توجد فئات بعد</p>
                <p className="text-xs text-text-muted">أضف أول فئة من النموذج</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {cat.name}
                        {!cat.is_active && (
                          <span className="mr-2 rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-bold text-text-muted">مخفية</span>
                        )}
                      </p>
                      <p className="text-[11px] text-text-muted">/{cat.slug} • الترتيب {cat.sort_order}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                        aria-label="تعديل"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 space-y-5 sticky top-20">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              {editing ? (
                <>
                  <Pencil className="h-5 w-5 text-primary" /> تعديل الفئة
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-primary" /> إضافة فئة
                </>
              )}
            </h2>

            <div>
              <label className="mb-2 block text-[13px] font-bold text-foreground">اسم الفئة</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="مثال: أجهزة لوحية"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-bold text-foreground">المعرّف (slug)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                dir="ltr"
                placeholder="tablets"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none text-left"
              />
              <p className="mt-1.5 text-[11px] text-text-muted">
                الفلاتر الذكية الجاهزة: all، new، used، flagship، budget، gaming، bestsellers. أي معرّف آخر يفلتر حسب حقل الفئة في المنتج.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-foreground">الأيقونة (إيموجي)</label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-foreground">الترتيب</label>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="text-sm font-bold text-foreground">ظاهرة في المتجر</span>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
            </label>

            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:opacity-90 disabled:opacity-60"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : editing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {saving ? "جارٍ الحفظ..." : editing ? "حفظ التعديلات" : "إضافة الفئة"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface-dark"
                >
                  <X className="h-4 w-4" /> إلغاء
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
