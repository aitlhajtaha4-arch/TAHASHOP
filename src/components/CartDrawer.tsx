"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, Tag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ShimmerButton from "@/components/ui/shimmer-button";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, itemCount, applyCoupon, discount, couponCode } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const shipping = total > 5000 ? 0 : 49;
  const vat = Math.round(total * 0.2);
  const discountedTotal = total - Math.round((total * discount) / 100);
  const finalTotal = discountedTotal + shipping + vat;

  const handleCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    if (applyCoupon(coupon)) {
      setCouponSuccess("تم تطبيق الكوبون بنجاح!");
    } else {
      setCouponError("كوبون غير صالح");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-background shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="text-lg font-bold">سلة المشتريات ({itemCount})</h2>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="text-text-muted">سلتك فارغة</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={`${item.id}-${item.color}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 rounded-xl border border-border bg-surface p-3"
                  >
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-primary">{item.brand}</p>
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                      <p className="text-xs text-text-muted">
                        {item.storage} • {item.color}
                      </p>
                      <p className="mt-1 text-sm font-bold text-primary">
                        {item.price.toLocaleString()} درهم
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface-dark"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface-dark"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id, item.color)}
                          className="mr-auto p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="كود الخصم"
                      className="w-full rounded-xl border border-border bg-surface py-2.5 pr-9 pl-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCoupon}
                    className="rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    تطبيق
                  </button>
                </div>

                {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-500">{couponSuccess}</p>}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>المجموع الفرعي</span>
                    <span>{total.toLocaleString()} درهم</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-500">
                      <span>الخصم ({discount}%)</span>
                      <span>-{Math.round((total * discount) / 100).toLocaleString()} درهم</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-muted">
                    <span>الشحن</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-500">مجاني</span>
                      ) : (
                        `${shipping} درهم`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>ضريبة القيمة المضافة (20%)</span>
                    <span>{vat.toLocaleString()} درهم</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                    <span>الإجمالي</span>
                    <span className="text-primary text-lg">{finalTotal.toLocaleString()} درهم</span>
                  </div>
                </div>

                <a href="/checkout">
                  <ShimmerButton className="w-full" shimmerDuration="2.5s">
                    إتمام الشراء
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </ShimmerButton>
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
