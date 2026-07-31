"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

const colorMap: Record<string, string> = {
  "الأسود": "#1a1a1a", "أسود": "#1a1a1a", "أسود سماوي": "#0a1628",
  "الأسود السماوي": "#0a1628", "الكحلي": "#0f172a", "الأسود الفضي": "#374151",
  "الرمادي": "#6b7280", "الرمادي الثلجي": "#d1d5db", "الفضي": "#9ca3af",
  "الفضي الثلجي": "#e5e7eb", "الأبيض": "#f9fafb", "الأبيض الفضي": "#f3f4f6",
  "البنفسجي": "#7c3aed", "الوردي": "#ec4899", "الوردي الفاتح": "#f9a8d4",
  "الأزرق": "#3b82f6", "الأزرق السماوي": "#38bdf8", "المسك الأزرق": "#60a5fa",
  "النعناعي": "#86efac", "الأخضر": "#22c55e", "الأخضر الزمردي": "#10b981",
  "الأخضر الفضي": "#6ee7b7", "البرتقالي": "#f97316", "الأصفر": "#eab308",
  "الذهبي": "#d4a017", "اللماع": "#c0c0c0", "التيتانيوم طبيعي": "#8b7355",
  "تيتانيوم طبيعي": "#8b7355", "التيتانيوم أسود": "#292524",
  "تيتانيوم أسود": "#292524", "التيتانيوم أبيض": "#f5f5f4",
  "تيتانيوم أبيض": "#f5f5f4", "التيتانيوم صحراوي": "#d4a574",
  "تيتانيوم صحراوي": "#d4a574",  "التيتانيوم أزرق": "#334155",
  "تيتانيوم أزرق": "#334155", "النaturالي": "#8b7355",
  "ال_midnight": "#191970", "الخزفي": "#d4c5a9",
  "البيج": "#f5f0e1", "وردي": "#ec4899",
};

function getColorCode(name: string): string {
  for (const [key, val] of Object.entries(colorMap)) {
    if (name.includes(key) || key.includes(name)) return val;
  }
  return "#9ca3af";
}

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-text-muted">({reviews})</span>
    </div>
  );
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface card-hover"
    >
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1">
        {product.badge && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
            {product.badge}
          </span>
        )}
      </div>

      <Link href={`/product/${product.id}`} className="flex h-24 sm:h-40 items-center justify-center bg-surface-dark/50 p-3 sm:p-5">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        <p className="text-[10px] font-semibold text-primary/70 tracking-wide uppercase mb-0.5">
          {product.brand}
        </p>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground line-clamp-1 hover:text-primary transition-colors mb-1.5">
            {product.name}
          </h3>
        </Link>

        <Stars rating={product.rating} reviews={product.reviews} />

        <div className="mt-2 grid grid-cols-2 gap-1">
          {[
            { label: "التخزين", value: product.storage },
            { label: "الرام", value: product.ram },
          ].map((spec) => (
            <div key={spec.label} className="rounded-lg bg-surface-dark/70 px-2 py-0.5 sm:py-1">
              <span className="block text-[9px] text-text-muted">{spec.label}</span>
              <span className="block text-[10px] font-medium text-foreground">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((color, i) => (
            <span
              key={i}
              className="inline-block h-4 w-4 rounded-full border border-border/40 shadow-sm"
              style={{ backgroundColor: getColorCode(color) }}
              title={color}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[9px] text-text-muted">+{product.colors.length - 4}</span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 min-h-[24px]">
          <span className="text-base font-semibold text-foreground">
            {product.price.toLocaleString()} <span className="text-[10px] font-normal text-text-muted">درهم</span>
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-text-muted line-through">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-500">-{discount}%</span>
          )}
        </div>

        <div className="mt-auto pt-2 flex gap-1.5">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image,
                color: product.colors[0],
                storage: product.storage,
              });
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-1.5 sm:py-2 text-[11px] font-medium text-white transition-all duration-200 hover:bg-primary-dark active:scale-[0.97]"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            أضف
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center rounded-xl border border-border/60 px-3 py-1.5 sm:py-2 text-[11px] font-medium text-foreground transition-all duration-200 hover:bg-surface-dark active:scale-[0.97]"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
