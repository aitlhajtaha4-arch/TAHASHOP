"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquarePlus, Trash2 } from "lucide-react";
import { useReviews } from "@/context/ReviewContext";
import ReviewForm from "./ReviewForm";

function ReviewCard({ review, onDelete }: { review: { id: string; name: string; rating: number; content: string; date: string }; onDelete?: () => void }) {
  const initial = review.name.charAt(0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-border bg-surface-dark p-4"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-purple text-xs font-bold text-white">
            {initial}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{review.name}</p>
            <p className="text-[10px] text-text-muted">{review.date}</p>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
            title="حذف التقييم"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mb-2 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-foreground/80">{review.content}</p>
    </motion.div>
  );
}

export default function ProductReviews({ productId, productName }: { productId: number; productName: string }) {
  const { getProductReviews, getProductRating, deleteReview, loadProductReviews } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const reviews = getProductReviews(productId);
  const { average, count } = getProductRating(productId);

  useEffect(() => {
    loadProductReviews(productId);
  }, [productId, loadProductReviews]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-foreground">التقييمات والمراجعات</h3>
          {count > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-surface-dark px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-foreground">{average}</span>
              <span className="text-[10px] text-text-muted">({count} تقييم)</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          أضف تقييمك
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <ReviewForm productId={productId} productName={productName} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>

      {count === 0 && !showForm && (
        <div className="rounded-xl border border-border bg-surface-dark p-8 text-center">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm text-text-muted">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={() => deleteReview(review.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
