"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import type { Product } from "@/data/products";

export default function ProductPageClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const conditionColors: Record<string, string> = {
    "جديد": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "مستعمل": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "مجدد": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  const specs = [
    { label: "الشاشة", value: product.screenSize },
    { label: "المعالج", value: product.processor },
    { label: "الذاكرة العشوائية", value: product.ram },
    { label: "التخزين", value: product.storage },
    { label: "الكاميرا الخلفية", value: product.camera },
    { label: "البطارية", value: product.battery },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
              <ArrowRight className="h-4 w-4" />
              العودة للمتجر
            </Link>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="sticky top-24 rounded-3xl border border-border bg-surface p-8 sm:p-12">
                <div className="relative">
                  {product.badge && (
                    <span className="absolute top-4 right-4 z-10 accent-gradient rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
                      {product.badge}
                    </span>
                  )}
                  {product.condition !== "جديد" && (
                    <span className={`absolute top-4 left-4 z-10 rounded-full border px-3 py-1 text-xs font-bold ${conditionColors[product.condition]}`}>
                      {product.condition}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-64 sm:h-80 w-auto rounded-2xl object-cover"
                  />
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-primary w-6" : "bg-border"}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-primary">{product.brand}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${conditionColors[product.condition]}`}>
                  {product.condition}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-5 w-5 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-sm text-text-muted">({product.reviews.toLocaleString()} تقييم)</span>
              </div>

              <p className="text-sm leading-relaxed text-text-muted mb-6">{product.description}</p>

              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black text-primary">
                  {product.price.toLocaleString()} <span className="text-base font-bold">درهم</span>
                </span>
                {product.originalPrice && (
                  <span className="mb-1 text-base text-text-muted line-through">
                    {product.originalPrice.toLocaleString()} درهم
                  </span>
                )}
                {discount > 0 && (
                  <span className="mb-1 rounded-lg bg-red-500/10 px-2 py-1 text-sm font-bold text-red-500">
                    -{discount}%
                  </span>
                )}
              </div>
              {product.monthlyPayment && (
                <p className="text-sm text-text-muted mb-6">أو {product.monthlyPayment.toLocaleString()} درهم/شهر</p>
              )}

              <div className="mb-6">
                <p className="text-sm font-bold text-foreground mb-3">اللون: <span className="font-normal text-text-muted">{product.colors[selectedColor]}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`rounded-xl border px-4 py-2 text-xs font-medium transition-all ${
                        selectedColor === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-text-muted hover:border-primary/30"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <p className="text-sm font-bold text-foreground">الكمية:</p>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-text-muted hover:text-primary text-lg font-bold">-</button>
                  <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-text-muted hover:text-primary text-lg font-bold">+</button>
                </div>
                <span className={`text-sm font-bold ${product.available ? "text-emerald-500" : "text-red-500"}`}>
                  {product.available ? "✓ متوفر" : "✗ غير متوفر"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addItem({
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        image: product.image,
                        color: product.colors[selectedColor],
                        storage: product.storage,
                      });
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl accent-gradient py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  <ShoppingCart className="h-5 w-5" />
                  أضف للسلة
                </button>
                <Link
                  href="/checkout"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  اشترِ الآن
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Truck, label: "توصيل مجاني", desc: product.freeShipping ? "للطلبات فوق 500 درهم" : "49 درهم" },
                  { icon: Shield, label: "ضمان أصلي", desc: "ضمان سنة" },
                  { icon: RotateCcw, label: "إرجاع", desc: "خلال 14 يوم" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-surface p-3 text-center">
                    <item.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                    <p className="text-[10px] font-bold text-foreground">{item.label}</p>
                    <p className="text-[9px] text-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground mb-4">المواصفات</h3>
                <div className="space-y-3">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                      <span className="text-sm text-text-muted">{spec.label}</span>
                      <span className="text-sm font-bold text-foreground">{spec.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                    <span className="text-sm text-text-muted">الألوان المتاحة</span>
                    <span className="text-sm font-bold text-foreground">{product.colors.length} ألوان</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16">
            <ProductReviews productId={product.id} productName={product.name} />
          </div>

          {relatedProducts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
              <h2 className="text-2xl font-black text-foreground mb-8">منتجات مشابهة</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
