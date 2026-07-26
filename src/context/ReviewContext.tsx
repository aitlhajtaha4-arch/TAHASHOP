"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Review } from "@/data/products";
import { createReview as createReviewAction, deleteReview as deleteReviewAction, getProductReviews as getReviewsAction } from "@/app/actions";

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productId: number) => Review[];
  getProductRating: (productId: number) => { average: number; count: number };
  loadProductReviews: (productId: number) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

const STORAGE_KEY = "techvault-reviews";

function loadLocalReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {}
}

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setReviews(loadLocalReviews());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveLocalReviews(reviews);
  }, [reviews, loaded]);

  const addReview = useCallback(async (data: Omit<Review, "id" | "date">) => {
    const localReview: Review = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [localReview, ...prev]);

    try {
      await createReviewAction({
        product_id: data.productId,
        name: data.name,
        rating: data.rating,
        content: data.content,
      });
    } catch {
      // Supabase not available, localStorage fallback is fine
    }
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteReviewAction(id);
    } catch {
      // fallback: already removed locally
    }
  }, []);

  const loadProductReviews = useCallback(async (productId: number) => {
    try {
      const dbReviews = await getReviewsAction(productId);
      if (dbReviews.length > 0) {
        setReviews((prev) => {
          const localOnly = prev.filter((r) => r.productId !== productId);
          return [...localOnly, ...dbReviews];
        });
      }
    } catch {
      // fallback to local
    }
  }, []);

  const getProductReviews = useCallback(
    (productId: number) => reviews.filter((r) => r.productId === productId),
    [reviews]
  );

  const getProductRating = useCallback(
    (productId: number) => {
      const productReviews = reviews.filter((r) => r.productId === productId);
      if (productReviews.length === 0) return { average: 0, count: 0 };
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      return { average: Math.round((sum / productReviews.length) * 10) / 10, count: productReviews.length };
    },
    [reviews]
  );

  return (
    <ReviewContext.Provider value={{ reviews, addReview, deleteReview, getProductReviews, getProductRating, loadProductReviews }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewProvider");
  return ctx;
}
