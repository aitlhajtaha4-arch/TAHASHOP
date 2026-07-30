"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { id: 1, name: "أحمد بن علي", role: "رائد أعمال", content: "تجربة شراء استثنائية! الهاتف وصلني في نفس اليوم والتغليف كان فاخر. أفضل متجر إلكتروني في المغرب بلا منازع.", avatar: "أ", color: "from-blue-500 to-purple-500" },
  { id: 2, name: "سارة الإدريسي", role: "مصممة جرافيك", content: "أسعارهم لا تُقاوم والدعم الفني متميز. سبق وطلبت منهم عدة مرات ولم أُخَبَر قط. أنصح بالتعامل معهم.", avatar: "س", color: "from-purple-500 to-pink-500" },
  { id: 3, name: "يوسف المغربي", role: "مطور برمجيات", content: "أفضل متجر للهواتف في المنطقة. الضمان أصلي والأسعار أفضل من السوق بفرق واضح. التوصيل سريع جداً.", avatar: "ي", color: "from-cyan-500 to-blue-500" },
  { id: 4, name: "فاطمة الزهراء", role: "طبيبة", content: "خدمة ممتازة ومنتجات أصلية. سهولة في الدفع والاستبدال. أصبحت من زبوناتهم الدائمين.", avatar: "ف", color: "from-emerald-500 to-cyan-500" },
];

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        setVisible(true);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);

  return <div ref={ref}>{count.toLocaleString()}</div>;
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-8 sm:mb-10 text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">تجارب عملائنا</h2>
            <p className="mt-1 text-[13px] text-text-muted">ماذا يقولون عنا</p>
          </motion.div>

          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-12">
            <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />
            <motion.div key={active} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="relative z-10">
              <p className="mb-8 text-lg leading-relaxed text-foreground">&ldquo;{testimonials[active].content}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${testimonials[active].color} flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white`}>{testimonials[active].avatar}</div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonials[active].name}</h4>
                  <p className="text-sm text-text-muted">{testimonials[active].role}</p>
                </div>
              </div>
            </motion.div>
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "w-2 bg-border hover:bg-text-muted"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { target: 50000, suffix: "+", label: "عميل سعيد", icon: "😊" },
              { target: 120, suffix: "+", label: "علامة تجارية", icon: "🏷️" },
              { target: 800, suffix: "+", label: "هاتف متوفر", icon: "📱" },
              { target: 99, suffix: "%", label: "رضا العملاء", icon: "⭐" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center rounded-2xl border border-border bg-surface p-6">
                <div className="mb-2 text-3xl">{stat.icon}</div>
                <div className="text-3xl font-black text-primary"><Counter target={stat.target} />{stat.suffix}</div>
                <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
