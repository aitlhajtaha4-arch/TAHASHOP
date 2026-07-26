import AccessoriesPageClient from "@/components/AccessoriesPageClient";
import { getAccessories } from "@/app/actions";
import type { Accessory } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function AccessoriesPage() {
  let accessories: Accessory[] = [];

  try {
    accessories = await getAccessories().catch(() => []);
  } catch {}

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AccessoriesPageClient accessories={accessories} />
    </div>
  );
}
