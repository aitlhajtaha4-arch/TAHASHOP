"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, X, Package } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product, Brand } from "@/data/products";

const conditions = ["الكل", "جديد", "مستعمل", "مجدد"] as const;

export default function BrandPageClient({ brand, brandProducts }: { brand: Brand; brandProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("الكل");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    let result = brandProducts;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.storage.toLowerCase().includes(q) ||
          p.ram.toLowerCase().includes(q)
      );
    }

    if (conditionFilter !== "الكل") {
      result = result.filter((p) => p.condition === conditionFilter);
    }

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [brandProducts, searchQuery, conditionFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white dark:bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2.5 text-xs text-text-muted">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{brand.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5 sm:py-6">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-border/60 bg-background shrink-0">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <div className="text-center sm:text-right">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                {brand.name}
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                {brandProducts.length > 0
                  ? `${brandProducts.length} منتج${brandProducts.length !== 1 ? "" : ""} متاح`
                  : "قريباً"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {brandProducts.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-dark">
            <Package className="h-6 w-6 text-text-muted" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">قريباً</h2>
          <p className="text-sm text-text-muted">منتجات {brand.name} قيد الإضافة، ترقبوا وصولها قريباً.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark active:scale-[0.97]"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمتجر
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث..."
                className="w-full rounded-xl border border-border bg-background py-2 pr-9 pl-3 text-sm text-foreground placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="featured">ترتيب</option>
                <option value="price-low">السعر: من الأقل</option>
                <option value="price-high">السعر: من الأعلى</option>
                <option value="rating">التقييم</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {conditions.map((c) => (
              <button
                key={c}
                onClick={() => setConditionFilter(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  conditionFilter === c
                    ? "bg-foreground text-background"
                    : "border border-border bg-background text-text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {c === "الكل" ? "الكل" : c}
              </button>
            ))}
            <span className="mr-auto text-xs text-text-muted">{filtered.length} منتج</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark">
                <Search className="h-5 w-5 text-text-muted" />
              </div>
              <p className="text-sm font-medium text-foreground mb-0.5">لا توجد نتائج</p>
              <p className="text-xs text-text-muted">جرّب تغيير البحث أو الفلتر</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
