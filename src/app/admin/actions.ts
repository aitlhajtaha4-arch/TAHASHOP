"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getPayPalAccessToken, type PayPalMode } from "@/lib/payments";
import { getAdminProfile } from "@/app/auth/actions";

export async function getPaymentSettings() {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("payment_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function savePaymentSettings(settings: {
  paypal_client_id: string;
  paypal_client_secret: string;
  paypal_mode: PayPalMode;
  paypal_currency: string;
  paypal_rate: number;
  paypal_enabled: boolean;
  cod_enabled: boolean;
}) {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const supabase = createAdminClient();
  const { error } = await supabase.from("payment_settings").upsert({
    id: 1,
    ...settings,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return { success: true };
}

export async function testPayPalConnection() {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const settings = await getPaymentSettings();
  if (!settings.paypal_client_id || !settings.paypal_client_secret) {
    return { success: false, message: "أدخل Client ID و Client Secret أولاً" };
  }
  try {
    await getPayPalAccessToken(
      settings.paypal_client_id,
      settings.paypal_client_secret,
      settings.paypal_mode
    );
    return { success: true, mode: settings.paypal_mode };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "تعذر الاتصال بـ PayPal",
    };
  }
}

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export async function getCategories() {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data || []) as CategoryRow[];
}

export async function createCategory(data: { name: string; slug: string; icon: string; sort_order: number; is_active: boolean }) {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  if (!data.name.trim()) throw new Error("أدخل اسم الفئة");
  if (!data.slug.trim()) throw new Error("أدخل المعرّف (slug)");
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert({
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    icon: data.icon || "🏷️",
    sort_order: data.sort_order,
    is_active: data.is_active,
  });
  if (error) throw error;
  return { success: true };
}

export async function updateCategory(id: number, data: { name: string; slug: string; icon: string; sort_order: number; is_active: boolean }) {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  if (!data.name.trim()) throw new Error("أدخل اسم الفئة");
  if (!data.slug.trim()) throw new Error("أدخل المعرّف (slug)");
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").update({
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    icon: data.icon || "🏷️",
    sort_order: data.sort_order,
    is_active: data.is_active,
  }).eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function deleteCategory(id: number) {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

export type StoreSettingsRow = {
  store_name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  support_hours: string;
};

export async function getStoreSettings() {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data as StoreSettingsRow;
}

export async function saveStoreSettings(settings: StoreSettingsRow) {
  const admin = await getAdminProfile();
  if (!admin) throw new Error("غير مصرح");
  const supabase = createAdminClient();
  const { error } = await supabase.from("store_settings").upsert({
    id: 1,
    ...settings,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return { success: true };
}
