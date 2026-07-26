"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { flashDeals as defaultFlashDeals, type FlashDeal } from "@/data/products";
import { useCart } from "@/context/CartContext";

function Countdown({ endsAt }: { endsAt: number }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, endsAt - Date.now());
      return {
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      };
    };
    setTime(calc());
    const i = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(i);
  }, [endsAt]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      {[time.h, time.m, time.s].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-lg bg-surface-dark px-2 py-1 text-xs font-bold tabular-nums text-foreground">
            {pad(v)}
          </span>
          {i < 2 && <span className="text-xs text-text-muted">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function FlashDeals({ deals }: { deals?: FlashDeal[] }) {
  const { addItem } = useCart();
  const allDeals = deals && deals.length > 0 ? deals : defaultFlashDeals;
  const flashDeals = allDeals.filter((d) => {
    if ("isActive" in d) return (d as FlashDeal).isActive;
    return true;
  });

  if (flashDeals.length === 0) return null;

  return (
    <section id="deals" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500">
            <Zap className="h-4 w-4 fill-current" />
            عروض محدودة
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">
            عروض <span className="text-accent-gradient">الوميض</span>
          </h2>
          <p className="text-text-muted">خصومات حصرية تنتهي قريباً!</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {flashDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-surface card-hover"
            >
              <div className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
                -{deal.discount}%
              </div>

              <div className="relative overflow-hidden bg-surface-dark p-6">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="mx-auto h-40 w-auto rounded-xl object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="p-5">
                <p className="text-[10px] font-medium text-text-muted">{deal.brand}</p>
                <h3 className="mb-2 text-sm font-bold text-foreground">{deal.name}</h3>

                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-xl font-black text-red-500">
                    {deal.price.toLocaleString()} <span className="text-xs">درهم</span>
                  </span>
                  <span className="text-xs text-text-muted line-through">
                    {deal.originalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">ينتهي خلال</span>
                  <Countdown endsAt={deal.endsAt} />
                </div>

                <button
                  onClick={() =>
                    addItem({
                      id: deal.id,
                      name: deal.name,
                      brand: deal.brand,
                      price: deal.price,
                      image: deal.image,
                      color: "",
                      storage: "",
                    })
                  }
                  className="w-full rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25"
                >
                  اشترِ الآن
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
