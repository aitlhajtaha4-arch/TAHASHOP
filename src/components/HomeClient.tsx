"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Categories from "@/components/Categories";
import FlashDeals from "@/components/FlashDeals";
import AccessoriesSection from "@/components/AccessoriesSection";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import Reviews from "@/components/Reviews";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { productCategories, type Product, type FlashDeal, type Accessory } from "@/data/products";
import { motion } from "framer-motion";

export default function HomeClient({ initialProducts, initialDeals, initialAccessories }: { initialProducts: Product[]; initialDeals: FlashDeal[]; initialAccessories: Accessory[] }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    let result = initialProducts;

    if (categoryFilter === "new") {
      result = result.filter((p) => p.condition === "جديد");
    } else if (categoryFilter === "used") {
      result = result.filter((p) => p.condition === "مستعمل" || p.condition === "مجدد");
    } else if (categoryFilter === "flagship") {
      result = result.filter((p) => p.category === "flagship");
    } else if (categoryFilter === "budget") {
      result = result.filter((p) => p.category === "budget" || p.category === "mid-range");
    } else if (categoryFilter === "gaming") {
      result = result.filter((p) => p.category === "gaming");
    } else if (categoryFilter === "bestsellers") {
      result = result.filter((p) => p.badge === "الأكثر مبيعاً");
    }

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [initialProducts, categoryFilter, sortBy]);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} products={initialProducts} accessories={initialAccessories} />

      <main className="flex-1">
        <Hero />
        <Categories />

        <section id="products" className="py-10 sm:py-14 scroll-mt-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                أحدث الهواتف
              </h2>
              <p className="mt-1 text-[13px] text-text-muted">اكتشف أحدث الهواتف الذكية بأفضل الأسعار</p>
            </motion.div>

            <div className="mb-4 flex overflow-x-auto gap-1.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`flex-shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    categoryFilter === cat.id
                      ? "bg-foreground text-background"
                      : "bg-surface text-text-muted border border-border/60 hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-text-muted">{filtered.length} منتج</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-border/60 bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="featured">المميزة</option>
                <option value="price-low">السعر: من الأقل</option>
                <option value="price-high">السعر: من الأعلى</option>
                <option value="rating">التقييم</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-foreground mb-0.5">لا توجد منتجات</p>
                <p className="text-xs text-text-muted">جرّب تغيير الفلتر</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        <FlashDeals deals={initialDeals} />
        <AccessoriesSection accessories={initialAccessories} />
        <WhyChooseUs />
        <Reviews />
        <Testimonials />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
