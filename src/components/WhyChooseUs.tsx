"use client";

import { motion } from "framer-motion";
import { Truck, Shield, CreditCard, RotateCcw, Headphones, Tag, Award, Zap } from "lucide-react";

const reasons = [
  { icon: Truck, title: "توصيل سريع", desc: "توصيل مجاني خلال 24-48 ساعة", color: "from-blue-500 to-cyan-500" },
  { icon: Shield, title: "ضمان أصلي", desc: "جميع المنتجات أصلية 100%", color: "from-purple-500 to-pink-500" },
  { icon: CreditCard, title: "دفع آمن", desc: "تشفير SSL لحماية بياناتك", color: "from-emerald-500 to-teal-500" },
  { icon: RotateCcw, title: "إرجاع سهل", desc: "إرجاع واستبدال خلال 14 يوم", color: "from-orange-500 to-red-500" },
  { icon: Headphones, title: "دعم 24/7", desc: "فريق دعم متاح على مدار الساعة", color: "from-indigo-500 to-blue-500" },
  { icon: Tag, title: "أفضل الأسعار", desc: "ضمان أفضل سعر في السوق", color: "from-pink-500 to-rose-500" },
  { icon: Award, title: "منتجات مضمونة", desc: "اختيار دقيق لأفضل المنتجات", color: "from-amber-500 to-orange-500" },
  { icon: Zap, title: "شحن سريع", desc: "توصيل في نفس اليوم للمدن الكبرى", color: "from-cyan-500 to-blue-500" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">لماذا نحن؟</span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">لماذا تختار <span className="text-accent-gradient">TechVault</span></h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${r.color} text-white transition-transform duration-300 group-hover:scale-110`}>
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{r.title}</h3>
              <p className="text-xs text-text-muted">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
