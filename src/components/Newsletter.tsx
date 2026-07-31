"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-border/60 bg-surface px-6 py-8 sm:px-10 sm:py-10 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">
            اشترك في النشرة البريدية
          </h2>
          <p className="text-sm text-text-muted mb-5">
            احصل على خصم 10% على طلبك الأول وأحدث العروض
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600"
            >
              <Check className="h-4 w-4" />
              تم الاشتراك بنجاح
            </motion.div>
          ) : (
            <div className="flex w-full max-w-sm mx-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="flex-1 rounded-lg border border-border/60 bg-background px-4 py-2 text-sm text-foreground placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <button
                onClick={() => email && setSubmitted(true)}
                disabled={!email}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                اشترك
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
