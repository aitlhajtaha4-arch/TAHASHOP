"use server";

import { createClient } from "@/lib/supabase/server";
import { mapProduct, mapFlashDeal, mapReview, mapAccessory } from "@/lib/supabase/mappers";
import { brandLogos } from "@/data/brandLogos";
import type { Brand } from "@/data/products";

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
  const { error } = await supabase.from("orders").insert(order);
  if (error) throw error;
  return { success: true };
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
