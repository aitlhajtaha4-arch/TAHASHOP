"use client";

import { motion } from "framer-motion";
import { CheckCircle, Wallet, Package } from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from "next/link";

export default function CheckoutSuccessClient({ orderId, method }: { orderId: string; method: string }) {
  const isPayPal = method === "paypal";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-24 pb-16">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 sm:p-10 text-center shadow-xl shadow-primary/5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
        >
          <CheckCircle className="h-11 w-11 text-emerald-500" />
        </motion.div>

        <h1 className="mb-3 text-2xl sm:text-3xl font-black text-foreground">
          {isPayPal ? "تم استلام الدفع بنجاح!" : "تم الطلب بنجاح!"}
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-text-muted">
          {isPayPal
            ? "شكراً لثقتك بنا. تم تأكيد الدفع عبر PayPal وسنبدأ تجهيز طلبك فوراً."
            : "شكراً لك. سيتم التواصل معك قريباً لتأكيد الطلب قبل الشحن."}
        </p>

        {orderId && (
          <div className="mx-auto mb-6 inline-flex flex-col items-center gap-1 rounded-2xl border border-border/70 bg-background px-5 py-3">
            <span className="text-[11px] text-text-muted">رقم الطلب</span>
            <span className="text-sm font-black tracking-wide text-foreground" dir="ltr">
              {orderId.slice(0, 8).toUpperCase()}
            </span>
          </div>
        )}

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background p-3 text-start">
            <Wallet className="h-5 w-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted">طريقة الدفع</p>
              <p className="text-sm font-bold text-foreground">
                {isPayPal ? "PayPal (مدفوع)" : "الدفع عند الاستلام"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background p-3 text-start">
            <Package className="h-5 w-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-text-muted">التوصيل</p>
              <p className="text-sm font-bold text-foreground">2-3 أيام عمل</p>
            </div>
          </div>
        </div>

        <Link href="/">
          <ShimmerButton className="w-full" shimmerDuration="2.5s">
            العودة للمتجر
          </ShimmerButton>
        </Link>
      </motion.div>
    </div>
  );
}
