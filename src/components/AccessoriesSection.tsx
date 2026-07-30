"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Accessory } from "@/data/products";
import { accessoryCategoryMap } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function AccessoriesSection({ accessories }: { accessories: Accessory[] }) {
  const { addItem } = useCart();

  if (accessories.length === 0) return null;

  const featured = accessories.filter((a) => a.featured && a.available);
  const display = featured.length > 0 ? featured : accessories.filter((a) => a.available);

  return (
    <section id="accessories" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            إكسسوارات مميزة
          </h2>
          <p className="mt-1 text-[13px] text-text-muted">اكمل تجربتك مع أفضل الإكسسوارات</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {display.slice(0, 8).map((acc, i) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface card-hover"
            >
              {acc.originalPrice && (
                <div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                  -{Math.round(((acc.originalPrice - acc.price) / acc.originalPrice) * 100)}%
                </div>
              )}

              <div className="relative overflow-hidden bg-surface-dark p-6">
                <img
                  src={acc.image}
                  alt={acc.name}
                  className="mx-auto h-40 w-auto rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="p-5">
                <span className="mb-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {accessoryCategoryMap[acc.category] || acc.category}
                </span>
                <p className="text-[10px] font-medium text-text-muted">{acc.brand}</p>
                <h3 className="mb-2 text-sm font-bold text-foreground line-clamp-1">{acc.name}</h3>

                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-xl font-black text-primary">
                    {acc.price.toLocaleString()} <span className="text-xs">درهم</span>
                  </span>
                  {acc.originalPrice && (
                    <span className="text-xs text-text-muted line-through">
                      {acc.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    addItem({
                      id: acc.id,
                      name: acc.name,
                      brand: acc.brand,
                      price: acc.price,
                      image: acc.image,
                      color: "",
                      storage: "",
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  أضف للسلة
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
