"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product, Brand } from "@/data/products";

export default function BrandPageClient({ brand, brandProducts }: { brand: Brand; brandProducts: Product[] }) {
  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent-purple/5" />
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[200px] -translate-x-1/2 -translate-y-1/2" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
              <ArrowRight className="h-4 w-4" />
              العودة للمتجر
            </Link>
          </motion.div>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 rounded-3xl border border-border bg-surface p-8 shadow-xl shadow-primary/5"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-16 w-40 object-contain"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 text-3xl sm:text-4xl font-black text-foreground"
            >
              هواتف <span className="text-accent-gradient">{brand.name}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-text-muted max-w-lg"
            >
              اكتشف جميع هواتف {brand.name} المتاحة في متجرنا. {brandProducts.length} منتج متوفر بأفضل الأسعار.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brandProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
