"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, X } from "lucide-react";
import { useReviews } from "@/context/ReviewContext";

interface ReviewFormProps {
  productId: number;
  productName: string;
  onClose?: () => void;
}

export default function ReviewForm({ productId, productName, onClose }: ReviewFormProps) {
  const { addReview } = useReviews();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || rating === 0) return;
    addReview({ productId, name: name.trim(), rating, content: content.trim() });
    setSubmitted(true);
    setName("");
    setRating(0);
    setContent("");
    setTimeout(() => {
      setSubmitted(false);
      onClose?.();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">اكتب تقييمك</h3>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-surface-dark hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mb-4 text-xs text-text-muted">لـ {productName}</p>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-8 text-center"
          >
            <div className="mb-3 text-4xl">✅</div>
            <p className="text-sm font-bold text-foreground">شكراً لتقييمك!</p>
            <p className="text-xs text-text-muted">تم حفظ تقييمك بنجاح</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">اسمك</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="محمد"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">التقييم</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="mr-2 flex items-center text-xs text-text-muted">
                    {rating === 1 && "سيء"}
                    {rating === 2 && "مقبول"}
                    {rating === 3 && "جيد"}
                    {rating === 4 && "ممتاز"}
                    {rating === 5 && "رائع"}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">تقييمك</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب رأيك في الهاتف..."
                required
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !content.trim() || rating === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl accent-gradient py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              إرسال التقييم
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
