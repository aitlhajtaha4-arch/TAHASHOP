"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPayPalAccessToken, type PayPalMode } from "@/lib/payments";
import { cookies } from "next/headers";

export async function signInAdmin(email: string, password: string, remember = false) {
  const cookieStore = await cookies();
  cookieStore.set("rememberAdmin", remember ? "1" : "0", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: remember ? 60 * 60 * 24 * 30 : undefined,
  });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: admin } = await supabase.from("admins").select("*").eq("id", data.user.id).single();
  if (!admin) {
    await supabase.auth.signOut();
    throw new Error("غير مصرح لك بالدخول");
  }
  return admin;
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("rememberAdmin");
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function getAdminProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single();
  return admin || null;
}

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
