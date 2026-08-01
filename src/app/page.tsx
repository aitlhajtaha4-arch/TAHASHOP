import HomeClient from "@/components/HomeClient";
import { getAllProducts, getFlashDeals, getAccessories, getCategories, getStoreSettings } from "./actions";
import { products as staticProducts, flashDeals as staticDeals } from "@/data/products";
import type { FlashDeal, Accessory } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialProducts = staticProducts;
  let initialDeals: FlashDeal[] = staticDeals;
  let initialAccessories: Accessory[] = [];

  try {
    const [supabaseProducts, supabaseDeals, supabaseAccessories] = await Promise.all([
      getAllProducts(),
      getFlashDeals().catch(() => []),
      getAccessories().catch(() => []),
    ]);
    if (supabaseProducts.length > 0) initialProducts = supabaseProducts;
    if (supabaseDeals.length > 0) initialDeals = supabaseDeals;
    initialAccessories = supabaseAccessories;
  } catch {
    // Supabase not configured yet — fall back to static data
  }

  const [categories, storeSettings] = await Promise.all([
    getCategories().catch(() => []),
    getStoreSettings().catch(() => null),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HomeClient
        initialProducts={initialProducts}
        initialDeals={initialDeals}
        initialAccessories={initialAccessories}
        categories={categories}
        storeSettings={storeSettings}
      />
    </div>
  );
}
