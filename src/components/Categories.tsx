"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { brands } from "@/data/products";

function BrandLogo({ logo, name }: { logo: string; name: string }) {
  return (
    <img
      src={logo}
      alt={name}
      className="mx-auto h-10 w-20 object-contain transition-transform duration-500 group-hover:scale-110"
    />
  );
}

export default function Categories() {
  return (
    <section id="brands" className="py-16 sm:py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 text-center"
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            العلامات التجارية
          </span>
          <h2 className="mb-4 text-2xl sm:text-3xl font-black tracking-tight sm:text-4xl">
            تصفح حسب <span className="text-accent-gradient">العلامة التجارية</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/brands/${encodeURIComponent(brand.name)}`}
                prefetch={true}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface p-4 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 block"
                style={{ aspectRatio: "1 / 1" }}
              >
                <div className="mb-2 flex flex-1 items-center justify-center">
                  <BrandLogo logo={brand.logo} name={brand.name} />
                </div>
                <h3 className="text-[10px] sm:text-xs font-bold text-foreground leading-tight">{brand.name}</h3>

                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent-purple transition-all duration-500 group-hover:w-full" />

                <div className="absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(110deg, transparent 30%, rgba(37, 99, 235, 0.08) 50%, transparent 70%)",
                      backgroundSize: "300% 100%",
                      animation: "shimmer 2s infinite linear",
                    }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
