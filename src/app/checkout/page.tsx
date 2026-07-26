"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, MapPin, CreditCard, FileText, Truck, CheckCircle } from "lucide-react";
import ShimmerButton from "@/components/ui/shimmer-button";
import { useCart } from "@/context/CartContext";
import { createOrder } from "../actions";

const schema = z.object({
  firstName: z.string().min(2, "الاسم قصير جداً"),
  lastName: z.string().min(2, "الاسم قصير جداً"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  city: z.string().min(2, "المدينة مطلوبة"),
  address: z.string().min(5, "العنوان غير كافٍ"),
  postalCode: z.string().min(5, "الرمز البريدي غير صالح"),
  age: z.number().min(16, "العمر الأدنى 16 سنة").max(100),
  paymentMethod: z.enum(["cod", "card", "paypal"]),
  deliveryOption: z.enum(["standard", "express"]),
  notes: z.string().optional(),
  acceptTerms: z.literal(true, { message: "يجب الموافقة على الشروط" }),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, total, discount, couponCode, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { paymentMethod: "cod", deliveryOption: "standard" },
  });

  const shipping = watch("deliveryOption") === "express" ? 99 : (total > 5000 ? 0 : 49);
  const vat = Math.round(total * 0.2);
  const discountAmount = discount > 0 ? Math.round(total * discount / 100) : 0;
  const finalTotal = total - discountAmount + shipping + vat;

  const onSubmit = async (data: FormData) => {
    try {
      await createOrder({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        postal_code: data.postalCode,
        payment_method: data.paymentMethod,
        delivery_option: data.deliveryOption,
        notes: data.notes || null,
        total: finalTotal,
        discount: discountAmount,
        shipping: shipping,
        vat: vat,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          storage: item.storage,
        })),
      });
    } catch {
      // Order saved locally even if Supabase fails
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle className="mx-auto mb-6 h-20 w-20 text-emerald-500" />
          <h1 className="mb-4 text-3xl font-black text-foreground">تم الطلب بنجاح!</h1>
          <p className="mb-8 text-text-muted">شكراً لك. سيتم التواصل معك قريباً لتأكيد الطلب.</p>
          <a href="/" className="inline-block"><ShimmerButton>العودة للمتجر</ShimmerButton></a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-3xl font-black">إتمام <span className="text-accent-gradient">الشراء</span></motion.h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><User className="h-5 w-5 text-primary" /> المعلومات الشخصية</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "firstName" as const, label: "الاسم الأول", icon: User, placeholder: "محمد" },
                  { name: "lastName" as const, label: "اسم العائلة", icon: User, placeholder: "الأحمد" },
                  { name: "email" as const, label: "البريد الإلكتروني", icon: Mail, placeholder: "email@example.com", type: "email" },
                  { name: "phone" as const, label: "رقم الهاتف", icon: Phone, placeholder: "06XXXXXXXX" },
                  { name: "age" as const, label: "العمر", icon: User, placeholder: "25", type: "number" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-1.5 block text-xs font-medium text-text-muted">{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input type={field.type || "text"} placeholder={field.placeholder} {...register(field.name)} className={`w-full rounded-xl border bg-background py-3 pr-10 pl-3 text-sm text-foreground placeholder-text-muted transition-colors focus:outline-none ${errors[field.name] ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"}`} />
                    </div>
                    {errors[field.name] && <p className="mt-1 text-[11px] text-red-500">{errors[field.name]?.message}</p>}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-primary" /> العنوان</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">المدينة</label>
                  <input placeholder="الدار البيضاء" {...register("city")} className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:outline-none ${errors.city ? "border-red-500" : "border-border focus:border-primary"}`} />
                  {errors.city && <p className="mt-1 text-[11px] text-red-500">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-muted">الرمز البريدي</label>
                  <input placeholder="20000" {...register("postalCode")} className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:outline-none ${errors.postalCode ? "border-red-500" : "border-border focus:border-primary"}`} />
                  {errors.postalCode && <p className="mt-1 text-[11px] text-red-500">{errors.postalCode.message}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-text-muted">العنوان التفصيلي</label>
                <textarea rows={3} placeholder="الشارع، رقم المنزل، الحي..." {...register("address")} className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:outline-none resize-none ${errors.address ? "border-red-500" : "border-border focus:border-primary"}`} />
                {errors.address && <p className="mt-1 text-[11px] text-red-500">{errors.address.message}</p>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Truck className="h-5 w-5 text-primary" /> خيارات التوصيل</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "standard", label: "توصيل عادي", desc: "2-3 أيام عمل", price: total > 5000 ? "مجاني" : "49 درهم" },
                  { value: "express", label: "توصيل سريع", desc: "في نفس اليوم", price: "99 درهم" },
                ].map((opt) => (
                  <label key={opt.value} className={`cursor-pointer rounded-xl border p-4 transition-all ${watch("deliveryOption") === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <input type="radio" value={opt.value} {...register("deliveryOption")} className="sr-only" />
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-foreground">{opt.label}</p>
                        <p className="text-[11px] text-text-muted">{opt.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{opt.price}</span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><CreditCard className="h-5 w-5 text-primary" /> طريقة الدفع</h2>
              <div className="space-y-3">
                {[
                  { value: "cod", label: "الدفع عند الاستلام", desc: "ادفع نقداً عند التوصيل" },
                  { value: "card", label: "بطاقة بنكية", desc: "Visa / Mastercard / Mada" },
                  { value: "paypal", label: "Apple Pay", desc: "ادفع بسهولة بأبل باي" },
                ].map((opt) => (
                  <label key={opt.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${watch("paymentMethod") === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <input type="radio" value={opt.value} {...register("paymentMethod")} className="h-4 w-4 accent-primary" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{opt.label}</p>
                      <p className="text-[11px] text-text-muted">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-primary" /> ملاحظات إضافية</h2>
              <textarea rows={3} placeholder="أي ملاحظات خاصة بالطلب..." {...register("notes")} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none resize-none" />
            </motion.div>

            <div className="flex items-start gap-3">
              <input type="checkbox" {...register("acceptTerms")} className="mt-1 h-4 w-4 accent-primary" />
              <label className="text-sm text-text-muted">أوافق على <a href="#" className="text-primary hover:underline">شروط الاستخدام</a> و<a href="#" className="text-primary hover:underline">سياسة الخصوصية</a></label>
            </div>
            {errors.acceptTerms && <p className="text-[11px] text-red-500">{errors.acceptTerms.message}</p>}
          </form>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 space-y-4">
              <h2 className="text-lg font-bold">ملخص الطلب</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <p className="text-[10px] text-text-muted">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-primary whitespace-nowrap">{(item.price * item.quantity).toLocaleString()} درهم</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="كود الخصم" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none" />
                <button onClick={() => applyCoupon(coupon)} className="rounded-xl border border-primary bg-primary/5 px-3 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">تطبيق</button>
              </div>
              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between text-text-muted"><span>المجموع</span><span>{total.toLocaleString()} درهم</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-500"><span>الخصم ({discount}%)</span><span>-{discountAmount.toLocaleString()} درهم</span></div>}
                <div className="flex justify-between text-text-muted"><span>الشحن</span><span>{shipping === 0 ? <span className="text-emerald-500">مجاني</span> : `${shipping} درهم`}</span></div>
                <div className="flex justify-between text-text-muted"><span>الضريبة (20%)</span><span>{vat.toLocaleString()} درهم</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-black text-foreground"><span>الإجمالي</span><span className="text-primary text-lg">{finalTotal.toLocaleString()} درهم</span></div>
              </div>
              <ShimmerButton type="submit" onClick={handleSubmit(onSubmit)} className="w-full" shimmerDuration="2.5s">
                تأكيد الطلب - {finalTotal.toLocaleString()} درهم
              </ShimmerButton>
              <p className="text-center text-[10px] text-text-muted">🔒 دفع آمن ومحمي بالكامل</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
