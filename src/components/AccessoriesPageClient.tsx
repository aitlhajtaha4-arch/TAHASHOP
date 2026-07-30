"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { accessoryCategories, accessoryCategoryMap, type Accessory } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function AccessoriesPageClient({ accessories }: { accessories: Accessory[] }) {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = accessories.filter((a) => a.available);

    if (activeCategory !== "all") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ar"));
    else result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return result;
  }, [accessories, activeCategory, sortBy]);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} onSearchOpen={() => {}} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
              <ArrowRight className="h-4 w-4" />
              العودة للمتجر
            </Link>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                إكسسوارات الهواتف
              </h1>
              <p className="mt-1 text-[13px] text-text-muted">اكتشف أفضل الإكسسوارات لحماية هاتفك وتحسين تجربتك</p>
            </motion.div>
          </div>

          <div className="mb-6 flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            {accessoryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "accent-gradient text-white shadow-lg shadow-primary/25"
                    : "border border-border bg-surface text-text-muted hover:border-primary/30 hover:text-primary"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-text-muted">{filtered.length} إكسسوار</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none">
              <option value="featured">المميزة</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="name">الاسم</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-5xl mb-4">🎧</p>
              <p className="text-lg font-bold text-foreground mb-2">لا توجد إكسسوارات</p>
              <p className="text-sm text-text-muted">جرّب تغيير الفئة أو العودة لاحقاً</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((acc, i) => (
                <motion.div
                  key={acc.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
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
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
