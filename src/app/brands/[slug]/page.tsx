import { notFound } from "next/navigation";
import { getProducts, getBrands } from "@/app/actions";
import { products as staticProducts, brands as staticBrands } from "@/data/products";
import BrandPageClient from "@/components/BrandPageClient";

export const dynamic = "force-dynamic";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brandName = decodeURIComponent(slug);

  let allProducts = staticProducts;
  let allBrands = staticBrands;

  try {
    const [supabaseProducts, supabaseBrands] = await Promise.all([
      getProducts(),
      getBrands(),
    ]);
    if (supabaseProducts.length > 0) allProducts = supabaseProducts;
    if (supabaseBrands.length > 0) allBrands = supabaseBrands;
  } catch {
    // fall back to static
  }

  const brand = allBrands.find((b) => b.name.toLowerCase() === brandName.toLowerCase());
  const brandProducts = allProducts.filter((p) => p.brand.toLowerCase() === brandName.toLowerCase());

  if (!brand) {
    notFound();
  }

  return <BrandPageClient brand={brand} brandProducts={brandProducts} />;
}
