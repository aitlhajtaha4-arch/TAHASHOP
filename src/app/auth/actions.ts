"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

function mapAuthError(error: { message?: string }): string {
  const msg = (error.message || "").toLowerCase();
  if (msg.includes("invalid login credentials")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  if (msg.includes("email not confirmed")) return "لم يتم تأكيد البريد الإلكتروني بعد";
  if (msg.includes("invalid email")) return "البريد الإلكتروني غير صالح";
  if (msg.includes("rate limit")) return "محاولات كثيرة جداً — انتظر دقيقة ثم أعد المحاولة";
  return error.message || "خطأ في تسجيل الدخول";
}

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
  if (error) throw new Error(mapAuthError(error));

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (adminError) {
    await supabase.auth.signOut();
    throw new Error(
      "تعذر التحقق من صلاحية المشرف. تأكد من إضافة المستخدم إلى جدول admins ثم أعد المحاولة."
    );
  }
  if (!admin) {
    await supabase.auth.signOut();
    throw new Error(
      "هذا الحساب غير مسجّل كمشرف بعد. في Supabase افتح Database ← SQL Editor وشغّل هذا السطر فقط:\n" +
        `insert into public.admins (id, email, name) values ('${data.user.id}', '${email}', 'Admin') on conflict (id) do nothing;`
    );
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single();
  return admin || null;
}

export async function getAdminSetupState() {
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase.from("admins").select("id", { count: "exact", head: true });
    if (error) return { setupRequired: false, available: false };
    return { setupRequired: (count || 0) === 0, available: true };
  } catch {
    return { setupRequired: false, available: false };
  }
}

export async function createFirstAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error("أدخل بريداً إلكترونياً صحيحاً");
  if (!password || password.length < 8) throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  });
  if (error) {
    const msg = (error.message || "").toLowerCase();
    if (msg.includes("already registered") || msg.includes("already been registered")) {
      throw new Error("هذا البريد مسجل بالفعل — أضفه إلى جدول admins ثم سجّل الدخول");
    }
    throw new Error(error.message || "تعذر إنشاء حساب المشرف");
  }

  const createdUser = data.user;

  const { error: insertError } = await supabase.from("admins").insert({
    id: createdUser.id,
    email: normalizedEmail,
    name: "Admin",
  });
  if (insertError) {
    await supabase.auth.admin.deleteUser(createdUser.id).catch(() => {});
    throw new Error("تعذر حفظ صلاحية المشرف: " + (insertError.message || "خطأ في قاعدة البيانات"));
  }

  return { success: true };
}
