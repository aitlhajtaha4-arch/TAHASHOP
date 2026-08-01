"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Zap, ShieldCheck } from "lucide-react";
import { signInAdmin, getAdminSetupState, createFirstAdmin } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SetupState = { setupRequired: boolean; available: boolean };

export default function LoginPage() {
  const [mode, setMode] = useState<"loading" | "setup" | "login">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    getAdminSetupState().then((state: SetupState) => {
      if (!active) return;
      setMode(state.available && state.setupRequired ? "setup" : "login");
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "setup") {
        if (password !== confirm) throw new Error("كلمتا المرور غير متطابقتين");
        await createFirstAdmin(email, password);
      }
      await signInAdmin(email, password, remember);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4">
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />
      <div className="login-orb login-orb-4" />
      <div className="login-orb login-orb-5" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="rounded-3xl border border-white/40 bg-white/70 p-8 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.06),0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/25">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-1 text-2xl font-black tracking-tight text-gray-900">TechVault</h1>
            <p className="text-sm font-medium text-gray-400">
              {mode === "setup" ? "إعداد لوحة الإدارة" : "لوحة الإدارة"}
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 text-center whitespace-pre-line"
            >
              {error}
            </motion.div>
          )}

          {mode === "loading" ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "setup" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-1 flex items-start gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3"
                >
                  <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[12px] leading-relaxed text-blue-800">
                    لا يوجد مشرف بعد. أنشئ حساب المشرف الأول — سيتمكن هذا الحساب من إدارة المتجر بالكامل.
                  </p>
                </motion.div>
              )}

              <div>
                <label className="mb-2 block text-[13px] font-bold text-gray-700">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@techvault.ma"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/80 py-3.5 pr-12 pl-4 text-[15px] font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold text-gray-700">كلمة المرور</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={mode === "setup" ? 8 : undefined}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/80 py-3.5 pr-12 pl-12 text-[15px] font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              {mode === "setup" && (
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-gray-700">تأكيد كلمة المرور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/80 py-3.5 pr-12 pl-12 text-[15px] font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              )}

              {mode === "login" && (
                <label className="flex cursor-pointer items-center gap-2.5 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                  />
                  <span className="text-[13px] font-semibold text-gray-600">تذكرني</span>
                </label>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    جاري المعالجة...
                  </span>
                ) : mode === "setup" ? (
                  "إنشاء حساب المشرف والدخول"
                ) : (
                  "تسجيل الدخول"
                )}
              </motion.button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 transition-colors hover:text-blue-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              العودة للمتجر
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
