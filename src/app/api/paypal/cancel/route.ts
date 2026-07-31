import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const token = url.searchParams.get("token");

  if (token) {
    const supabase = createAdminClient();
    await supabase.from("pending_checkouts").delete().eq("paypal_order_id", token);
  }

  return NextResponse.redirect(`${origin}/checkout/paypal-failed`);
}
