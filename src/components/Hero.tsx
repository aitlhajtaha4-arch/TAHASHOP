"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-[70vh] min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => videoRef.current?.pause()}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />

      <div className="absolute inset-0 bg-gradient-to-tr from-[#0066cc]/15 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-10" />

      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] sm:text-[11px] font-medium text-white/80">مجموعة 2026 — وصلت حديثاً</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight"
          >
            هاتفك الجديد
            <br />
            <span className="text-white/85">في متناول يدك</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-3 sm:mt-4 max-w-md mx-auto text-sm sm:text-[15px] text-white/65 leading-relaxed"
          >
            أحدث الهواتف الذكية من أكبر العلامات العالمية. ضمان أصلي وتوصيل في أقل من 24 ساعة.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 justify-center"
          >
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-sm font-semibold text-[#1d1d1f] transition-all duration-300 hover:bg-white/90 active:scale-[0.97]"
            >
              تصفح المنتجات
            </a>
            <a
              href="#deals"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-sm font-medium text-white/85 transition-all duration-300 hover:bg-white/10 active:scale-[0.97]"
            >
              عروض اليوم
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 sm:mt-10 flex items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { val: "50K+", label: "عميل سعيد" },
              { val: "800+", label: "هاتف" },
              { val: "17+", label: "علامة تجارية" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white">{stat.val}</div>
                <div className="text-[10px] sm:text-[11px] text-white/45 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
      >
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="flex flex-col items-center gap-1">
          <span className="text-[9px] text-white/30">اكتشف المزيد</span>
          <ArrowDown className="h-3.5 w-3.5 text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
