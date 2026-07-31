"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { brands, type Brand } from "@/data/products";
import { useRef, useState, useCallback, type CSSProperties } from "react";

function RippleButton({ brand }: { brand: Brand }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, []);

  return (
    <Link
      ref={btnRef}
      href={`/brands/${encodeURIComponent(brand.name)}`}
      aria-label={brand.name}
      onClick={handleClick}
      style={{ "--brand-color": brand.color } as CSSProperties}
      className="group relative flex flex-col items-center justify-center rounded-xl border border-border/50 bg-surface px-3 py-3 sm:py-4 text-center transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.97] overflow-hidden brand-card"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full bg-primary/15 animate-ripple"
          style={{ left: r.x - 12, top: r.y - 12, width: 24, height: 24 }}
        />
      ))}
      <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-1.5 rounded-lg overflow-hidden">
        <img
          src={brand.logo}
          alt={brand.name}
          className="h-full w-full object-contain brand-logo transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="text-[11px] sm:text-xs font-medium text-foreground/80 leading-tight">
        {brand.name === "Google Pixel" ? "Pixel" : brand.name}
      </span>
    </Link>
  );
}

export default function Categories() {
  return (
    <section id="brands" className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            تسوق حسب القسم
          </h2>
          <p className="mt-1 text-[13px] text-text-muted">
            اختر من بين {brands.length} علامة تجارية أو تصفح الإكسسوارات
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="min-w-0"
            >
              <RippleButton brand={brand} />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.3, delay: brands.length * 0.02 }}
          >
            <Link
              href="/accessories"
              className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] px-3 py-3 sm:py-4 text-center transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-0.5 active:scale-[0.97] overflow-hidden"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-1.5 rounded-lg overflow-hidden">
                <svg className="h-8 sm:h-9 w-auto text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-primary/70 leading-tight">
                إكسسوارات
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
