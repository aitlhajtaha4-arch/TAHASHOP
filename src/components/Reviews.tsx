"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { useReviews } from "@/context/ReviewContext";
import { products } from "@/data/products";

const seedReviews = [
  { id: "seed-1", productId: 4, name: "محمد أمين", rating: 5, content: "هاتف ممتاز جداً، التوصيل كان سريع والمنتج في حالة ممتازة. أنصح بالشراء من هذا المتجر.", date: "2026-01-15" },
  { id: "seed-2", productId: 1, name: "فاطمة الزهراء", rating: 5, content: "أول مرة نطلب من هنا وتجربة ممتازة. الهاتف أصلي والسعر مناسب مقارنة بالسوق.", date: "2026-01-10" },
  { id: "seed-3", productId: 8, name: "يوسف الإدريسي", rating: 4, content: "هاتف شجيع وبطاريته تدوم طول اليوم. فقط التغليف كان ممكن يكون أحسن.", date: "2025-12-28" },
  { id: "seed-4", productId: 22, name: "سارة بوزيد", rating: 5, content: "خدمة ما بعد البيع ممتازة وفريق الدعم متعاون جداً. شكراً!", date: "2025-12-22" },
  { id: "seed-5", productId: 16, name: "عمر بنجدين", rating: 4, content: "الكاميرا خيالية خصوصاً في الليل. هاتف ينافس الكبار بسعر معقول.", date: "2025-12-15" },
  { id: "seed-6", productId: 19, name: "نادية المغربي", rating: 5, content: "اشتريت هاتفين للعائلة، التوصيل كان في الوقت والهواتف كما في الوصف بالضبط.", date: "2025-12-01" },
];

export default function Reviews() {
  const { reviews } = useReviews();

  const displayReviews = reviews.length > 0 ? reviews : seedReviews;

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 sm:mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">آراء عملائنا</span>
          <h2 className="mb-4 text-2xl sm:text-3xl font-black tracking-tight sm:text-4xl">ماذا يقول <span className="text-accent-gradient">عملاؤنا</span></h2>
        </motion.div>

        {displayReviews.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-lg font-bold text-foreground mb-1">لا توجد تقييمات بعد</p>
            <p className="text-sm text-text-muted">كن أول من يكتب تقييماً!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayReviews.map((review, i) => {
              const product = products.find((p) => p.id === review.productId);
              const initial = review.name.charAt(0);
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`} />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-text-muted">&ldquo;{review.content}&rdquo;</p>
                  {product && <p className="mb-4 text-[10px] font-medium text-primary">{product.name}</p>}
                  <div className="flex items-center gap-3">
                    <div className="accent-gradient flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                        <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <span>🇲🇦</span>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
