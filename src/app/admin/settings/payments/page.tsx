"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Plug, CheckCircle2, XCircle, Eye, EyeOff, CreditCard, Banknote, Globe, RefreshCw } from "lucide-react";
import { getPaymentSettings, savePaymentSettings, testPayPalConnection } from "../../actions";

type Settings = {
  paypal_client_id: string;
  paypal_client_secret: string;
  paypal_mode: "sandbox" | "live";
  paypal_currency: string;
  paypal_rate: number;
  paypal_enabled: boolean;
  cod_enabled: boolean;
};

export default function AdminPayments() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    getPaymentSettings()
      .then((data) => setSettings(data as Settings))
      .catch(() => setMessage({ type: "error", text: "تعذر تحميل الإعدادات" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      await savePaymentSettings(settings);
      setMessage({ type: "success", text: "تم حفظ إعدادات الدفع بنجاح" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "خطأ في الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testPayPalConnection();
    setTestResult(
      result.success
        ? { success: true, text: result.mode === "live" ? "تم الاتصال بحساب PayPal الحقيقي بنجاح" : "تم الاتصال بحساب PayPal التجريبي (Sandbox) بنجاح" }
        : { success: false, text: result.message || "تعذر الاتصال بـ PayPal" }
    );
    setTesting(false);
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
        تعذر تحميل إعدادات الدفع
      </div>
    );
  }

  const set = (patch: Partial<Settings>) => setSettings((prev) => (prev ? { ...prev, ...patch } : prev));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">إعدادات الدفع</h1>
        <p className="mt-1 text-sm text-text-muted">اربط متجرك بـ PayPal Business وأدر طرق الدفع المتاحة للعملاء.</p>
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
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <CreditCard className="h-5 w-5 text-primary" /> PayPal Business
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-foreground">وضع المعاملة</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "sandbox", label: "تجريبي (Sandbox)", desc: "للاختبار قبل الإطلاق" },
                    { value: "live", label: "حقيقي (Live)", desc: "استقبال مدفوعات فعلية" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => set({ paypal_mode: mode.value as "sandbox" | "live" })}
                      className={`rounded-xl border p-4 text-start transition-all ${
                        settings.paypal_mode === mode.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="text-sm font-bold text-foreground">{mode.label}</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold text-foreground">Client ID</label>
                <input
                  value={settings.paypal_client_id}
                  onChange={(e) => set({ paypal_client_id: e.target.value })}
                  placeholder="من لوحة PayPal Developers"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold text-foreground">Client Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={settings.paypal_client_secret}
                    onChange={(e) => set({ paypal_client_secret: e.target.value })}
                    placeholder={settings.paypal_client_secret ? "••••••••••••" : "من لوحة PayPal Developers"}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-text-muted">🔒 يُخزن في قاعدة البيانات ولا يُعرض للعملاء أبداً.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-foreground">عملة الدفع</label>
                  <input
                    value={settings.paypal_currency}
                    onChange={(e) => set({ paypal_currency: e.target.value.toUpperCase() })}
                    placeholder="USD"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-foreground">سعر الصرف (1 عملة = ؟ درهم)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.paypal_rate}
                    onChange={(e) => set({ paypal_rate: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleTest}
                  disabled={testing || saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-60"
                >
                  {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}
                  {testing ? "جارٍ الاتصال..." : "اختبار الاتصال"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || testing}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
                </button>
              </div>

              {testResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                    testResult.success ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {testResult.text}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Globe className="h-5 w-5 text-primary" /> طرق الدفع المتاحة
            </h2>
            <div className="space-y-3">
              {[
                {
                  key: "paypal_enabled" as const,
                  icon: CreditCard,
                  label: "PayPal",
                  desc: "الدفع الإلكتروني عبر PayPal",
                },
                {
                  key: "cod_enabled" as const,
                  icon: Banknote,
                  label: "الدفع عند الاستلام",
                  desc: "دفع نقداً عند التوصيل",
                },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                    settings[opt.key] ? "border-primary/40 bg-primary/5" : "border-border opacity-70"
                  }`}
                >
                  <opt.icon className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{opt.label}</p>
                    <p className="text-[11px] text-text-muted">{opt.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings[opt.key]}
                    onClick={() => set({ [opt.key]: !settings[opt.key] } as Partial<Settings>)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      settings[opt.key] ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        settings[opt.key] ? "right-0.5" : "right-[22px]"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-text-muted">
              الطرق المعطّلة تختفي تلقائياً من صفحة إتمام الشراء.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-sm font-bold text-foreground">كيف تحصل على بيانات PayPal؟</h2>
            <ol className="space-y-2 text-[12px] leading-relaxed text-text-muted">
              <li>1. أنشئ حساب PayPal Business.</li>
              <li>2. ادخل إلى developer.paypal.com.</li>
              <li>3. أنشئ تطبيقاً للحصول على Client ID و Secret.</li>
              <li>4. جرّب بوضع Sandbox ثم بدّل إلى Live.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
