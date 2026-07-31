"use client";

import { motion } from "framer-motion";
import { XCircle, RefreshCcw, ShoppingBag } from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from "next/link";

export default function PayPalFailedClient() {
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
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10"
        >
          <XCircle className="h-11 w-11 text-red-500" />
        </motion.div>

        <h1 className="mb-3 text-2xl sm:text-3xl font-black text-foreground">لم يكتمل الدفع</h1>

        <p className="mb-8 text-sm leading-relaxed text-text-muted">
          تم إلغاء أو إيقاف عملية الدفع عبر PayPal. لم يتم إنشاء أي طلب ولم يتم خصم أي مبلغ.
          يمكنك إعادة المحاولة في أي وقت.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/checkout">
            <ShimmerButton className="w-full" shimmerDuration="2.5s">
              <RefreshCcw className="h-4 w-4" />
              إعادة المحاولة
            </ShimmerButton>
          </Link>
          <Link href="/">
            <ShimmerButton className="w-full" shimmerDuration="2.5s" background="linear-gradient(135deg, #64748b, #475569)">
              <ShoppingBag className="h-4 w-4" />
              متابعة التسوق
            </ShimmerButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
