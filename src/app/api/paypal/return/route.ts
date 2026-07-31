import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { capturePayPalOrder, type PayPalSettings } from "@/lib/payments";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/checkout/paypal-failed`);
  }

  const supabase = createAdminClient();

  const { data: settings, error: settingsError } = await supabase
    .from("payment_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (settingsError) {
    return NextResponse.redirect(`${origin}/checkout/paypal-failed`);
  }

  try {
    const capture = await capturePayPalOrder(token, settings as PayPalSettings);
    if (capture.status !== "COMPLETED") {
      throw new Error("capture not completed");
    }

    const { data: pending } = await supabase
      .from("pending_checkouts")
      .select("*")
      .eq("paypal_order_id", token)
      .single();

    if (!pending) {
      return NextResponse.redirect(`${origin}/checkout/paypal-failed`);
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        ...(pending.data as Record<string, unknown>),
        payment_method: "paypal",
        payment_status: "paid",
        transaction_id: capture.id,
        paid_at: new Date().toISOString(),
        payer_email: capture.payer?.email_address || null,
        payer_id: capture.payer?.payer_id || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw orderError || new Error("order insert failed");
    }

    await supabase.from("pending_checkouts").delete().eq("id", pending.id);

    return NextResponse.redirect(`${origin}/checkout/success?order=${order.id}&method=paypal`);
  } catch {
    return NextResponse.redirect(`${origin}/checkout/paypal-failed`);
  }
}
