"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ShoppingCart, Truck, Heart } from "lucide-react";
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
  "تيتانيوم صحراوي": "#d4a574",   "التيتانيوم أزرق": "#334155",
  "تيتانيوم أزرق": "#334155", "النатурالي": "#8b7355",
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
            className={`h-3.5 w-3.5 ${
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-text-muted">({reviews.toLocaleString()})</span>
    </div>
  );
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const conditionColors: Record<string, string> = {
    "جديد": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "مستعمل": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "مجدد": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface card-hover"
    >
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="accent-gradient rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
            {product.badge}
          </span>
        )}
        {product.condition !== "جديد" && (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${conditionColors[product.condition]}`}>
            {product.condition}
          </span>
        )}
      </div>

      <button className="absolute top-3 left-3 z-10 rounded-full bg-background/80 p-2 text-text-muted backdrop-blur-sm opacity-0 transition-all duration-500 hover:bg-background hover:text-red-500 group-hover:opacity-100">
        <Heart className="h-4 w-4" />
      </button>

      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-surface-dark p-6">
        <div className="shimmer-bg absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={product.image}
          alt={product.name}
          className="relative mx-auto h-44 sm:h-52 w-auto rounded-xl object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </Link>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {product.brand}
          </p>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${conditionColors[product.condition]}`}>
            {product.condition}
          </span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-2 text-sm font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>

        <Stars rating={product.rating} reviews={product.reviews} />

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {[
            { label: "التخزين", value: product.storage },
            { label: "الذاكرة", value: product.ram },
            { label: "الكاميرا", value: product.camera.split("+")[0].trim() },
            { label: "البطارية", value: product.battery },
          ].map((spec) => (
            <div key={spec.label} className="rounded-lg bg-surface-dark px-2 py-1.5">
              <span className="block text-[9px] text-text-muted">{spec.label}</span>
              <span className="block truncate text-[10px] font-semibold text-foreground">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {product.colors.slice(0, 5).map((color, i) => (
            <span
              key={i}
              className="group/swatch relative inline-flex"
            >
              <span
                className="h-5 w-5 rounded-full border-2 border-background shadow-sm transition-transform hover:scale-125 cursor-pointer"
                style={{ backgroundColor: getColorCode(color) }}
              />
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[9px] font-medium text-background opacity-0 transition-opacity group-hover/swatch:opacity-100 shadow-lg">
                {color}
              </span>
            </span>
          ))}
          {product.colors.length > 5 && (
            <span className="inline-flex h-5 items-center rounded-full bg-surface-dark px-1.5 text-[9px] font-medium text-text-muted">
              +{product.colors.length - 5}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-black text-primary">
            {product.price.toLocaleString()} <span className="text-sm font-bold">درهم</span>
          </span>
          {product.originalPrice && (
            <span className="mb-0.5 text-xs text-text-muted line-through">
              {product.originalPrice.toLocaleString()} درهم
            </span>
          )}
          {discount > 0 && (
            <span className="mb-0.5 rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
              -{discount}%
            </span>
          )}
        </div>

        {product.monthlyPayment && (
          <p className="mt-1 text-[10px] text-text-muted">
            أو {product.monthlyPayment.toLocaleString()} درهم/شهر
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          {product.freeShipping && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
              <Truck className="h-3 w-3" /> توصيل مجاني
            </span>
          )}
          <span
            className={`text-[10px] ${
              product.available
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500"
            }`}
          >
            {product.available ? "متوفر" : "نفذ"}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
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
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl accent-gradient py-2.5 text-xs font-bold text-white transition-all duration-500 hover:shadow-lg hover:shadow-primary/25"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            أضف للسلة
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-xs font-bold text-primary transition-all duration-500 hover:bg-primary hover:text-white"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
