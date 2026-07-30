"use client";

import { motion } from "framer-motion";
import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "توصيل سريع",
    desc: "توصيل مجاني خلال 24–48 ساعة لجميع المدن المغربية",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-200 dark:border-emerald-800/30",
  },
  {
    icon: Shield,
    title: "ضمان أصلي",
    desc: "جميع المنتجات أصلية 100% مع ضمان لمدة سنة كاملة",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800/30",
  },
  {
    icon: CreditCard,
    title: "دفع آمن",
    desc: "نظام دفع مشفر وآمن عبر البطاقات البنكية والتحويل",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    borderColor: "border-violet-200 dark:border-violet-800/30",
  },
  {
    icon: Headphones,
    title: "دعم 24/7",
    desc: "فريق دعم فني متاح على مدار الساعة لمساعدتك",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    borderColor: "border-rose-200 dark:border-rose-800/30",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            لماذا TechVault؟
          </h2>
          <p className="mt-1 text-[13px] text-text-muted">
            نقدم لك أفضل تجربة تسوق إلكتروني في المغرب
          </p>
        </motion.div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={`rounded-xl border ${f.borderColor} ${f.bgColor}/20 bg-surface px-4 py-5 sm:py-6 text-center transition-all duration-250 hover:shadow-md hover:-translate-y-1`}
            >
              <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${f.bgColor} ${f.color}`}>
                <f.icon className="h-5.5 w-5.5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-[12px] text-text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
