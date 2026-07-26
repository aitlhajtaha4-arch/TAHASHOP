"use server";

import { createClient } from "@/lib/supabase/server";

export async function signInAdmin(email: string, password: string) {
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
