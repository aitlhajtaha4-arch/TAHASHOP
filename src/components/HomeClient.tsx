"use client";

import { useState } from "react";
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

  let filtered = initialProducts;

  if (categoryFilter === "new") {
    filtered = filtered.filter((p) => p.condition === "جديد");
  } else if (categoryFilter === "used") {
    filtered = filtered.filter((p) => p.condition === "مستعمل" || p.condition === "مجدد");
  } else if (categoryFilter === "flagship") {
    filtered = filtered.filter((p) => p.category === "flagship");
  } else if (categoryFilter === "budget") {
    filtered = filtered.filter((p) => p.category === "budget" || p.category === "mid-range");
  } else if (categoryFilter === "gaming") {
    filtered = filtered.filter((p) => p.category === "gaming");
  } else if (categoryFilter === "bestsellers") {
    filtered = filtered.filter((p) => p.badge === "الأكثر مبيعاً");
  }

  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} products={initialProducts} />

      <main className="flex-1">
        <Hero />
        <Categories />

        <section id="products" className="py-16 sm:py-20 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">مختاراتنا</span>
              <h2 className="mb-4 text-2xl sm:text-3xl font-black tracking-tight sm:text-4xl">أحدث <span className="text-accent-gradient">الهواتف</span></h2>
              <p className="text-text-muted text-sm">اكتشف أفضل الهواتف الذكية بأفضل الأسعار</p>
            </motion.div>

            <div className="mb-5 flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-none">
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    categoryFilter === cat.id
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
              <p className="text-sm text-text-muted">{filtered.length} منتج</p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none">
                <option value="featured">المميزة</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-5xl mb-4">📱</p>
                <p className="text-lg font-bold text-foreground mb-2">لا توجد منتجات</p>
                <p className="text-sm text-text-muted">جرّب تغيير الفلتر أو البحث عن هاتف آخر</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
