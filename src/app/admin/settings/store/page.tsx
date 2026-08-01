"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, CheckCircle2, XCircle, Store } from "lucide-react";
import { getStoreSettings, saveStoreSettings, type StoreSettingsRow } from "../../actions";

function Field({ label, value, onChange, type = "text", placeholder, hint, ltr }: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-bold text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={ltr ? "ltr" : undefined}
        className={`w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none ${ltr ? "text-left" : ""}`}
      />
      {hint && <p className="mt-1.5 text-[11px] text-text-muted">{hint}</p>}
    </div>
  );
}

export default function AdminStoreSettings() {
  const [settings, setSettings] = useState<StoreSettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getStoreSettings()
      .then(setSettings)
      .catch((err: unknown) =>
        setMessage({ type: "error", text: err instanceof Error ? err.message : "تعذر تحميل الإعدادات" })
      )
      .finally(() => setLoading(false));
  }, []);

  const set = (patch: Partial<StoreSettingsRow>) => setSettings((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveStoreSettings(settings);
      setMessage({ type: "success", text: "تم حفظ إعدادات المتجر بنجاح" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "خطأ في الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-600">
        تعذر تحميل إعدادات المتجر — تأكد من تشغيل ملف migration 005 في Supabase.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-foreground">إعدادات المتجر</h1>
        <p className="mt-1 text-sm text-text-muted">معلومات متجرك التي تظهر في التذييل وصفحات الدفع.</p>
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

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Store className="h-5 w-5 text-primary" /> معلومات المتجر
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="اسم المتجر" value={settings.store_name} onChange={(v) => set({ store_name: v })} placeholder="TechVault" />
            <Field label="الشعار / الوصف القصير" value={settings.tagline} onChange={(v) => set({ tagline: v })} placeholder="هواتف وإكسسوارات أصلية في المغرب" />
          </div>
          <Field
            label="وصف المتجر (يظهر في التذييل)"
            value={settings.description}
            onChange={(v) => set({ description: v })}
            placeholder="وصف قصير عن متجرك..."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="الهاتف" value={settings.phone} onChange={(v) => set({ phone: v })} placeholder="+212 6 00 00 00 00" ltr />
            <Field label="البريد الإلكتروني" value={settings.email} onChange={(v) => set({ email: v })} placeholder="contact@techvault.ma" ltr />
          </div>
          <Field label="العنوان" value={settings.address} onChange={(v) => set({ address: v })} placeholder="الدار البيضاء، المغرب" />
          <Field label="ساعات الدعم" value={settings.support_hours} onChange={(v) => set({ support_hours: v })} />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <RefreshCw className="h-5 w-5 text-primary" /> وسائل التواصل
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="WhatsApp (رقم بالصيغة الدولية)" value={settings.whatsapp} onChange={(v) => set({ whatsapp: v })} placeholder="212600000000" ltr />
            <Field label="فيسبوك (رابط)" value={settings.facebook} onChange={(v) => set({ facebook: v })} placeholder="https://facebook.com/..." ltr />
            <Field label="إنستغرام (رابط)" value={settings.instagram} onChange={(v) => set({ instagram: v })} placeholder="https://instagram.com/..." ltr />
            <Field label="تيك توك (رابط)" value={settings.tiktok} onChange={(v) => set({ tiktok: v })} placeholder="https://tiktok.com/..." ltr />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Save className="h-5 w-5 text-primary" /> الشحن
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="رسوم التوصيل (درهم)" type="number" value={settings.shipping_fee} onChange={(v) => set({ shipping_fee: Number(v) })} />
            <Field label="توصيل مجاني للطلبات فوق (درهم)" type="number" value={settings.free_shipping_threshold} onChange={(v) => set({ free_shipping_threshold: Number(v) })} />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>
      </div>
    </div>
  );
}
