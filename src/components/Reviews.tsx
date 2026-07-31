"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ChevronDown, BadgeCheck, MessageCircle, Plus, X } from "lucide-react";
import { useReviews } from "@/context/ReviewContext";
import { products } from "@/data/products";

const seedReviews = [
  { id: "seed-1", productId: 4, name: "محمد أمين", initials: "م", rating: 5, content: "هاتف ممتاز جداً، التوصيل كان سريع والمنتج في حالة ممتازة. أنصح بالشراء من هذا المتجر.", date: "2026-01-15" },
  { id: "seed-2", productId: 1, name: "فاطمة الزهراء", initials: "ف", rating: 5, content: "أول مرة نطلب من هنا وتجربة ممتازة. الهاتف أصلي والسعر مناسب مقارنة بالسوق.", date: "2026-01-10" },
  { id: "seed-3", productId: 8, name: "يوسف الإدريسي", initials: "ي", rating: 4, content: "هاتف شجيع وبطاريته تدوم طول اليوم. فقط التغليف كان ممكن يكون أحسن.", date: "2025-12-28" },
  { id: "seed-4", productId: 22, name: "سارة بوزيد", initials: "س", rating: 5, content: "خدمة ما بعد البيع ممتازة وفريق الدعم متعاون جداً. شكراً!", date: "2025-12-22" },
  { id: "seed-5", productId: 16, name: "عمر بنجدين", initials: "ع", rating: 4, content: "الكاميرا خيالية خصوصاً في الليل. هاتف ينافس الكبار بسعر معقول.", date: "2025-12-15" },
  { id: "seed-6", productId: 19, name: "نادية المغربي", initials: "ن", rating: 5, content: "اشتريت هاتفين للعائلة، التوصيل كان في الوقت والهواتف كما في الوصف بالضبط.", date: "2025-12-01" },
];

function loadLikes(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("review-likes") || "{}"); }
  catch { return {}; }
}

type SortMode = "newest" | "oldest" | "highest" | "lowest";

export default function Reviews() {
  const { reviews, addReview } = useReviews();
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<SortMode>("newest");
  const [showCount, setShowCount] = useState(6);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: 5, content: "", productId: 1 });

  useEffect(() => { setLikes(loadLikes()); }, []);

  const allReviews = reviews.length > 0 ? reviews : seedReviews.map((r) => r);

  const sorted = [...allReviews].sort((a, b) => {
    if (sort === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort === "highest") return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const displayed = sorted.slice(0, showCount);
  const hasMore = showCount < allReviews.length;

  const toggleLike = (id: string) => {
    const current = loadLikes();
    const wasLiked = liked[id];
    current[id] = (current[id] || 0) + (wasLiked ? -1 : 1);
    if (current[id] <= 0) delete current[id];
    localStorage.setItem("review-likes", JSON.stringify(current));
    setLikes({ ...current });
    setLiked((prev) => ({ ...prev, [id]: !wasLiked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;
    addReview({
      productId: formData.productId,
      name: formData.name.trim(),
      rating: formData.rating,
      content: formData.content.trim(),
    });
    setFormData({ name: "", rating: 5, content: "", productId: 1 });
    setShowForm(false);
  };

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: "newest", label: "الأحدث" },
    { value: "oldest", label: "الأقدم" },
    { value: "highest", label: "أعلى تقييم" },
    { value: "lowest", label: "أقل تقييم" },
  ];

  const productOptions = products.slice(0, 30);

  return (
    <section id="reviews" className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            آراء عملائنا
          </h2>
          <p className="mt-1 text-[13px] text-text-muted">
            ماذا يقولون عنا
          </p>
        </motion.div>

        <div className="mb-6 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-6 rounded-2xl border border-border/60 bg-surface p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-black text-foreground leading-none">
              {(allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)}
            </div>
            <div className="mt-1.5 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`} />
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-text-muted">{allReviews.length} تقييم</p>
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = allReviews.filter((r) => r.rating === star).length;
              const pct = allReviews.length ? Math.round((count / allReviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-[11px]">
                  <span className="w-8 text-text-muted shrink-0">{star} ★</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-dark">
                    <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-text-muted tabular-nums">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/90 active:scale-[0.97]"
          >
            <Plus className="h-3.5 w-3.5" />
            كتابة تقييم
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="appearance-none rounded-xl border border-border bg-surface px-3 py-2 pr-8 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-text-muted pointer-events-none" />
          </div>
        </div>

        {allReviews.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface py-12 text-center">
            <p className="text-sm font-medium text-foreground">لا توجد تقييمات بعد</p>
            <p className="text-xs text-text-muted mt-0.5">كن أول من يكتب تقييماً!</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((review, i) => {
                const reviewId = review.id;
                const product = products.find((p) => p.id === review.productId);
                const likeCount = likes[reviewId] || 0;
                const isLiked = liked[reviewId] || false;

                return (
                  <motion.div
                    key={reviewId}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="flex flex-col rounded-xl border border-border/60 bg-surface p-3.5 sm:p-4 transition-all duration-250 hover:shadow-sm hover:border-primary/15"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary shrink-0">
                        {"initials" in review ? (review as any).initials : review.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-[13px] font-semibold text-foreground truncate">{review.name}</h4>
                          <BadgeCheck className="h-3 w-3 text-blue-500 shrink-0" />
                        </div>
                        <span className="text-[10px] text-text-muted">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-2.5 w-2.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-[13px] text-text-muted leading-relaxed mb-2 line-clamp-3">&ldquo;{review.content}&rdquo;</p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                      {product ? (
                        <span className="truncate rounded-md bg-primary/[0.06] px-2 py-0.5 text-[10px] font-medium text-primary/70 max-w-[55%]">{product.name}</span>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleLike(reviewId)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-all duration-200 ${
                            isLiked ? "bg-red-500/10 text-red-500" : "bg-surface-dark text-text-muted hover:text-red-500 hover:bg-red-500/5"
                          }`}
                        >
                          <Heart className={`h-3 w-3 ${isLiked ? "fill-red-500" : ""}`} />
                          {likeCount > 0 ? likeCount : "إعجاب"}
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-text-muted hover:text-primary transition-colors">
                          <MessageCircle className="h-3 w-3" />
                          رد
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => setShowCount((prev) => prev + 6)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-5 py-2.5 text-xs font-medium text-foreground/70 transition-all hover:border-primary/30 hover:text-primary active:scale-[0.97]"
                >
                  عرض المزيد ({allReviews.length - showCount})
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">كتابة تقييم</h3>
                  <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-text-muted hover:bg-surface">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">المنتج</label>
                    <select
                      value={formData.productId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productId: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      {productOptions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">الاسم</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="اسمك"
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-text-muted/50 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">التقييم</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setFormData((prev) => ({ ...prev, rating: s }))}>
                          <Star className={`h-6 w-6 transition-colors ${s <= formData.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">التعليق</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="شارك تجربتك..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-text-muted/50 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
                  >
                    نشر التقييم
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
