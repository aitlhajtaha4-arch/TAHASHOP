import { notFound } from "next/navigation";
import { getProduct, getAllProducts } from "@/app/actions";
import { products as staticProducts } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);

  let product = null;
  let allProducts = staticProducts;

  try {
    product = await getProduct(productId);
    allProducts = await getAllProducts();
  } catch {
    product = staticProducts.find((p) => p.id === productId) || null;
  }

  if (!product) {
    notFound();
  }

  let relatedProducts = allProducts
    .filter((p) => p.brand === product!.brand && p.id !== product!.id)
    .slice(0, 4);

  if (relatedProducts.length < 4) {
    const extra = allProducts
      .filter((p) => p.id !== product!.id && p.brand !== product!.brand && p.category === product!.category)
      .slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...extra);
  }

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
