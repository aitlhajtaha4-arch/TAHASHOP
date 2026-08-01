"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProduct, mapFlashDeal, mapReview, mapAccessory } from "@/lib/supabase/mappers";
import { brandLogos } from "@/data/brandLogos";
import { brandColorsByName, productCategories, type Brand } from "@/data/products";
import { createPayPalOrder, type PayPalSettings } from "@/lib/payments";

export async function getProducts(brand?: string, category?: string) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").order("id");
  if (brand) query = query.eq("brand", brand);
  if (category && category !== "all") {
    if (category === "new") query = query.eq("condition", "جديد");
    else if (category === "used") query = query.in("condition", ["مستعمل", "مجدد"]);
    else query = query.eq("category", category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function getProduct(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return mapProduct(data);
}

export async function getAllProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function createProduct(product: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id: number, updates: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("brands").select("*").order("id");
  if (error) throw error;
  return (data || [])
    .filter((r: Record<string, unknown>) => r.name !== "Nothing")
    .map((r: Record<string, unknown>): Brand => ({
      id: Number(r.id),
      name: String(r.name),
      logo: String(brandLogos[String(r.name)] || r.logo || ""),
      color: brandColorsByName[String(r.name)] || "#0066cc",
    }));
}

export async function getFlashDeals() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("flash_deals").select("*").order("id");
  if (error) throw error;
  return (data || []).map(mapFlashDeal);
}

export async function getAllFlashDeals() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("flash_deals").select("*").order("id");
  if (error) throw error;
  return (data || []).map(mapFlashDeal);
}

export async function createFlashDeal(deal: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("flash_deals").insert(deal).select().single();
  if (error) throw error;
  return mapFlashDeal(data);
}

export async function updateFlashDeal(id: number, updates: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("flash_deals").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return mapFlashDeal(data);
}

export async function deleteFlashDeal(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("flash_deals").delete().eq("id", id);
  if (error) throw error;
}

export async function getAccessories(category?: string) {
  const supabase = await createClient();
  let query = supabase.from("accessories").select("*").order("id");
  if (category && category !== "all") query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((r: Record<string, unknown>) => mapAccessory(r as never));
}

export async function getAllAccessories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("accessories").select("*").order("id");
  if (error) throw error;
  return (data || []).map((r: Record<string, unknown>) => mapAccessory(r as never));
}

export async function createAccessory(accessory: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("accessories").insert(accessory).select().single();
  if (error) throw error;
  return mapAccessory(data as never);
}

export async function updateAccessory(id: number, updates: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("accessories").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return mapAccessory(data as never);
}

export async function deleteAccessory(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("accessories").delete().eq("id", id);
  if (error) throw error;
}

export async function getProductReviews(productId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapReview);
}

export async function getAllReviews() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapReview);
}

export async function createReview(review: { product_id: number; name: string; rating: number; content: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("reviews").insert(review).select().single();
  if (error) throw error;
  return mapReview(data);
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

export async function createOrder(order: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...order, payment_status: "pending" })
    .select("id")
    .single();
  if (error) throw error;
  return { orderId: data.id };
}

export async function getCheckoutPaymentSettings() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("payment_settings")
    .select(
      "paypal_client_id, paypal_mode, paypal_currency, paypal_rate, paypal_enabled, cod_enabled"
    )
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function startPayPalCheckout(orderData: Record<string, unknown>, origin: string) {
  const supabase = createAdminClient();
  const { data: settings, error: settingsError } = await supabase
    .from("payment_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (settingsError) throw settingsError;
  if (!settings.paypal_enabled) throw new Error("الدفع عبر PayPal غير مفعل حالياً");
  if (!settings.paypal_client_id || !settings.paypal_client_secret) {
    throw new Error("لم يتم إعداد الدفع عبر PayPal بعد");
  }

  const totalMad = Number(orderData.total) || 0;
  const rate = Number(settings.paypal_rate) || 10;
  const amountValue = (totalMad / rate).toFixed(2);

  const paypalOrder = await createPayPalOrder(
    settings as PayPalSettings,
    { currency_code: settings.paypal_currency, value: amountValue },
    `${origin}/api/paypal/return`,
    `${origin}/api/paypal/cancel`
  );

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("pending_checkouts").delete().lt("created_at", dayAgo);

  await supabase.from("pending_checkouts").insert({
    paypal_order_id: paypalOrder.id,
    data: orderData,
  });

  return { approvalUrl: paypalOrder.approvalUrl };
}

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function getStats() {
  const supabase = await createClient();
  const [products, orders, reviews] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("*"),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
  ]);
  const totalRevenue = orders.data?.reduce((sum: number, o: Record<string, unknown>) => sum + ((o.total as number) || 0), 0) || 0;
  return {
    totalProducts: products.count || 0,
    totalOrders: orders.data?.length || 0,
    totalRevenue,
    totalReviews: reviews.count || 0,
    recentOrders: orders.data?.slice(0, 5) || [],
  };
}

export type StoreCategory = { id: string; label: string; icon: string };

export async function getCategories(): Promise<StoreCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name, icon")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map((c: { slug: string; name: string; icon: string }) => ({
        id: c.slug,
        label: c.name,
        icon: c.icon || "🏷️",
      }));
    }
  } catch {
    // table missing — fall through to static list
  }
  return productCategories;
}

export type StoreInfo = {
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

export async function getStoreSettings(): Promise<StoreInfo> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).single();
    if (!error && data) return data as StoreInfo;
  } catch {
    // table missing — use defaults
  }
  return {
    store_name: "TechVault",
    tagline: "وجهتك المثالية لأحدث الهواتف الذكية",
    description:
      "وجهتك المثالية لشراء أحدث الهواتف الذكية والإكسسوارات في المغرب. ضمان أصلي، توصيل سريع، وأسعار استثنائية.",
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    shipping_fee: 30,
    free_shipping_threshold: 300,
    support_hours: "من الاثنين إلى السبت: 9 صباحاً - 9 مساءً",
  };
}
