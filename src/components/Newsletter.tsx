"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-purple/10" />
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-gradient-to-t from-accent-purple/5 to-transparent blur-3xl" />

          <div className="relative flex flex-col items-center p-8 text-center sm:p-12 lg:p-16">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-purple text-white">
              <Mail className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">
              لا تفوّت أي <span className="text-accent-gradient">عرض!</span>
            </h2>
            <p className="mb-8 max-w-lg text-text-muted">اشترك في قائمنا البريدية واحصل على خصم 10% على طلبك الأول + تحديثات يومية عن أفضل العروض</p>

            {submitted ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-xl bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-500">
                شكراً لك! تم الاشتراك بنجاح
              </motion.div>
            ) : (
              <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground placeholder-text-muted transition-colors focus:border-primary focus:outline-none"
                />
                <ShimmerButton onClick={() => email && setSubmitted(true)} shimmerDuration="2.5s">
                  اشترك
                  <ArrowLeft className="h-4 w-4" />
                </ShimmerButton>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
