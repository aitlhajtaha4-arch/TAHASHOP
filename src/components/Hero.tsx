"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ShimmerButton from "@/components/ui/shimmer-button";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const wordVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.18, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
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

      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative flex h-full items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div custom={0} initial="hidden" animate="visible" variants={wordVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-xs font-medium text-white/90">مجموعة 2026 - وصلت حديثاً</span>
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.h1 custom={1} initial="hidden" animate="visible" variants={wordVariants} className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight" style={{ textShadow: "0 2px 40px rgba(0,0,0,0.6), 0 0 80px rgba(37,99,235,0.3)" }}>
              هاتفك
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-2">
            <motion.h1 custom={2} initial="hidden" animate="visible" variants={wordVariants} className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
              <span className="text-accent-gradient" style={{ filter: "drop-shadow(0 2px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 60px rgba(37,99,235,0.4))" }}>الجديد</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1 custom={3} initial="hidden" animate="visible" variants={wordVariants} className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight" style={{ textShadow: "0 2px 40px rgba(0,0,0,0.6), 0 0 80px rgba(37,99,235,0.3)" }}>
              في متناول يدك
            </motion.h1>
          </div>

          <motion.p custom={4} initial="hidden" animate="visible" variants={wordVariants} className="mb-10 max-w-xl mx-auto text-lg leading-relaxed text-white/80" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            اكتشف أحدث الهواتف الذكية من أكبر العلامات التجارية العالمية.
            أسعار استثنائية، ضمان أصلي، وتوصيل في أقل من 24 ساعة.
          </motion.p>

          <motion.div custom={5} initial="hidden" animate="visible" variants={wordVariants} className="flex flex-wrap gap-4 justify-center">
            <a href="#products">
              <ShimmerButton shimmerColor="rgba(255,255,255,0.3)" shimmerDuration="2.5s">
                تصفح المنتجات
              </ShimmerButton>
            </a>
            <a href="#deals" className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30">
              عروض اليوم
            </a>
          </motion.div>

          <motion.div custom={6} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { delay: 1.2, duration: 1, ease: "easeOut" as const } } }} className="mt-12 flex items-center justify-center gap-8 sm:gap-12">
            {[
              { val: "50K+", label: "عميل سعيد" },
              { val: "800+", label: "هاتف" },
              { val: "17+", label: "علامة تجارية" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>{stat.val}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/40">اكتشف المزيد</span>
          <ArrowDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
